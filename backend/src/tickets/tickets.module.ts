import { Module } from '@nestjs/common';
import { TicketsController } from './tickets.controller';
import { TicketsService } from './tickets.service';
import { ElasticsearchModule } from '../elasticsearch/elasticsearch.module';

// @Module() groups related functionality together
// Module = A container that organizes your app structure
@Module({
  imports: [ElasticsearchModule], // Import ElasticsearchModule to use ElasticsearchService
  controllers: [TicketsController], // Register the controller
  providers: [TicketsService], // Register the service
  exports: [TicketsService], // Export service so other modules can use it
})
export class TicketsModule {}
