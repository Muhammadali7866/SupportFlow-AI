import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { CreateTicketDto } from './dto/create-ticket.dto';

@Controller('tickets')
export class TicketsController {
  constructor(private ticketsService: TicketsService) {}

  @Post()
  async create(@Body() createTicketDto: CreateTicketDto) {
    return await this.ticketsService.createTicket(createTicketDto);
  }

  @Get(':id')
  async getOne(@Param('id') id: string) {
    return await this.ticketsService.getTicket(id);
  }
}
