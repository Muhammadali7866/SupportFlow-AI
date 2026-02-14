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
      status: 'open', // Default status
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Insert the ticket into Elasticsearch
    const result = await client.index({
      index: this.indexName,
      document: ticket,
    });

    return {
      ticketId,
      _id: result._id,
      status: 'created',
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
