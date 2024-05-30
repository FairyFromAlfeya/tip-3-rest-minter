import { Controller, Post, Body } from '@nestjs/common';

import { Transaction } from 'everscale-inpage-provider';

import { AppService } from './app.service';
import { CreateMintDto } from './dto/create-mint.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('mint')
  createMint(@Body() body: CreateMintDto): Promise<Transaction> {
    return this.appService.mint(body.amount, body.recipient);
  }
}
