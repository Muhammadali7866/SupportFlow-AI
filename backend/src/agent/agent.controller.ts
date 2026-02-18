import { Controller, Post } from '@nestjs/common';
import { AgentService } from './agent.service';

@Controller('agent')
export class AgentController {
  constructor(private agentService: AgentService) {}

  @Post('process')
  async processTickets() {
    return await this.agentService.processTickets();
  }
}
