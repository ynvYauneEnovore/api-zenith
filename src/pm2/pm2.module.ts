import { Module } from '@nestjs/common';
import { Pm2Service } from './pm2.service';
import { Pm2Controller } from './pm2.controller';
import { Pm2Gateway } from './pm2.gateway';

@Module({
  controllers: [Pm2Controller],
  providers: [Pm2Service, Pm2Gateway],
})
export class Pm2Module {}
