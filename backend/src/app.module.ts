import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { ElasticsearchModule } from './elasticsearch/elasticsearch.module';
import { TicketsModule } from './tickets/tickets.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    ElasticsearchModule,
    TicketsModule,

  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
