import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { ElasticsearchModule } from './elasticsearch/elasticsearch.module';
import { TicketsModule } from './tickets/tickets.module';
import { AgentModule } from './agent/agent.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    ElasticsearchModule,
    TicketsModule,
    AgentModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
