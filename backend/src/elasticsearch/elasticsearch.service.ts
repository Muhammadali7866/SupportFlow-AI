import { Injectable, OnModuleInit } from '@nestjs/common';
import { Client } from '@elastic/elasticsearch';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ElasticsearchService implements OnModuleInit {
  private client!: Client;
  private readonly indexName = 'support-tickets';

  constructor(private configService: ConfigService) {}

  async onModuleInit() {
    this.client = new Client({
      node: this.configService.get<string>('ELASTICSEARCH_NODE'),
      auth: {
        apiKey: this.configService.get<string>('ELASTICSEARCH_API_KEY')!,
      },
    });

    try {
      await this.client.info();
      console.log('Elasticsearch connected successfully');
      await this.createIndexIfNotExists();
    } catch (error) {
      console.error('Elasticsearch connection failed', error);
    }
  }

  private async createIndexIfNotExists() {
    const indexExists = await this.client.indices.exists({
      index: this.indexName,
    });

    if (!indexExists) {
      await this.client.indices.create({
        index: this.indexName,
        mappings: {
          properties: {
            ticketId: { type: 'keyword' },
            title: { type: 'text' },
            description: { type: 'text' },
            status: { type: 'keyword' },
            priority: { type: 'keyword' },
            category: { type: 'keyword' },
            customerName: { type: 'text' },
            customerEmail: { type: 'keyword' },
            assignedTo: { type: 'keyword' },
            tags: { type: 'keyword' },
            createdAt: { type: 'date' },
            updatedAt: { type: 'date' },
          },
        },
      });
      console.log(`Index '${this.indexName}' created successfully`);
    } else {
      console.log(`Index '${this.indexName}' already exists`);
    }
  }

  getClient() {
    return this.client;
  }
}
