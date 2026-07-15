import { Module } from '@nestjs/common';
import { Pm2Service } from './pm2.service';
import { Pm2Controller } from './pm2.controller';
import { Pm2Gateway } from './pm2.gateway';
import { HubClientService } from './hub-client.service';

@Module({
  controllers: [Pm2Controller],
  providers: [Pm2Service, Pm2Gateway, HubClientService],
})
export class Pm2Module { }
