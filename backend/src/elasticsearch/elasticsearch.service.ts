import { Injectable, OnModuleInit } from '@nestjs/common';
import { Client } from '@elastic/elasticsearch';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ElasticsearchService implements OnModuleInit {
  private client!: Client;

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
    } catch (error) {
      console.error('Elasticsearch connection failed', error);
    }
  }

  getClient() {
    return this.client;
  }
}
