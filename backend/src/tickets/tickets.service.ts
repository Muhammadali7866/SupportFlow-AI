import { Injectable } from '@nestjs/common';
import { ElasticsearchService } from '../elasticsearch/elasticsearch.service';
import { CreateTicketDto } from './dto/create-ticket.dto';

@Injectable()
export class TicketsService {
  private readonly indexName = 'support-tickets';

  constructor(private elasticsearchService: ElasticsearchService) {}

  async createTicket(createTicketDto: CreateTicketDto) {
    const client = this.elasticsearchService.getClient();
    const ticketId = `TICKET-${Date.now()}`;

    const ticket = {
      ticketId,
      title: createTicketDto.title,
      description: createTicketDto.description,
      description_embedding: createTicketDto.description,
      status: 'NEW',
      ai_state: 'RAW',
      category: null,
      priority: null,
      assignedTo: null,
      tags: [],
      sentiment: null,
      ai_confidence: null,
      solution: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const result = await client.index({
      index: this.indexName,
      document: ticket,
    });

    return {
      ticketId,
      _id: result._id,
    };
  }

  async getTicket(id: string) {
    const client = this.elasticsearchService.getClient();
    const result = await client.get({
      index: this.indexName,
      id: id,
    });
    return result._source;
  }
}
