import { Module } from '@nestjs/common';
import { Pm2Module } from './pm2/pm2.module';

@Module({
  imports: [Pm2Module],
  controllers: [],
  providers: [],
})
export class AppModule { }
