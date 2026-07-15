import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Pm2Module } from './pm2/pm2.module';

@Module({
  imports: [Pm2Module],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
