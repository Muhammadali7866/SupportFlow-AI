import { Injectable } from '@nestjs/common';
import { ElasticsearchService } from '../elasticsearch/elasticsearch.service';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
import {
  SupportTicket,
  TicketClassification,
} from 'src/types/ticket.interface';

@Injectable()
export class AgentService {
  private openai: OpenAI;
  private readonly indexName = 'support-tickets';

  constructor(
    private elasticsearchService: ElasticsearchService,
    private configService: ConfigService,
  ) {
    const apiKey = this.configService.get<string>('OPEN_AI_KEY');
    if (!apiKey) {
      throw new Error('OPEN_AI_KEY is not configured');
    }
    this.openai = new OpenAI({ apiKey });
  }

  async processTickets() {
    const tickets = await this.fetchRawTickets();

    const results: Array<{ ticketId: string; status: string; error?: string }> = [];

    for (const ticket of tickets) {
      try {
        if (!ticket._id) {
          throw new Error('Ticket is missing an _id');
        }
        const ticketId = ticket._id;
        const source = ticket._source as SupportTicket;
        await this.lockTicket(ticketId);
        const similar = await this.searchSimilarTickets(source.description);
        const classification = await this.classifyTicket(source, similar);

        await this.updateTicket(ticketId, {
          ...classification,
          ai_state: 'DONE',
        });

        results.push({ ticketId: source.ticketId, status: 'success' });
      } catch (error: any) {
        await this.markFailed(ticket._id!);
        results.push({
          ticketId: (ticket._source as SupportTicket)?.ticketId || 'unknown',
          status: 'failed',
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }

    return { processed: tickets.length, results };
  }

  private async fetchRawTickets() {
    const client = this.elasticsearchService.getClient();
    const result = await client.search({
      index: this.indexName,
      query: { term: { ai_state: 'RAW' } },
      size: 2,
    });
    return result.hits.hits;
  }

  private async lockTicket(id: string) {
    const client = this.elasticsearchService.getClient();
    await client.update({
      index: this.indexName,
      id,
      doc: { ai_state: 'PROCESSING', updatedAt: new Date().toISOString() },
    });
  }

  private async searchSimilarTickets(description: string) {
    const client = this.elasticsearchService.getClient();
    const result = await client.search({
      index: this.indexName,
      query: {
        semantic: {
          field: 'description_embedding',
          query: description,
        },
      },
      size: 3,
    });
    return result.hits.hits.map((hit) => hit._source as SupportTicket);
  }

  private async classifyTicket(
    ticket: SupportTicket,
    similarTickets: SupportTicket[],
  ): Promise<TicketClassification> {
    const prompt = `Analyze this support ticket and classify it.
  Ticket:
  Title: ${ticket.title}
  Description: ${ticket.description}

  Similar past tickets:
  ${similarTickets.map((t, i) => `${i + 1}. ${t.title} - ${t.description}`).join('\n')}

  Return JSON with:
  - category: "authentication" | "billing" | "technical" | "feature_request"
  - priority: "urgent" | "high" | "medium" | "low"
  - tags: array of 2-3 relevant keywords
  - sentiment: "positive" | "neutral" | "negative"
  - ai_confidence: number between 0 and 1
  - solution: suggested response to customer (2-3 sentences)`;

    const response = await this.openai.chat.completions.create({
      model: 'gpt-3.5-turbo',

      messages: [{ role: 'user', content: prompt }],
      response_format: { type: 'json_object' },
      temperature: 0.3,
    });

    return JSON.parse(
      response.choices[0].message.content!,
    ) as TicketClassification;
  }

  private async updateTicket(id: string, updates: Record<string, unknown>) {
    const client = this.elasticsearchService.getClient();
    await client.update({
      index: this.indexName,
      id,
      doc: { ...updates, updatedAt: new Date().toISOString() },
    });
  }

  private async markFailed(id: string) {
    const client = this.elasticsearchService.getClient();
    await client.update({
      index: this.indexName,
      id,
      doc: { ai_state: 'FAILED', updatedAt: new Date().toISOString() },
    });
  }
}
