import { Test, TestingModule } from '@nestjs/testing';
import { Pm2Controller } from './pm2.controller';
import { Pm2Service } from './pm2.service';

describe('Pm2Controller', () => {
  let controller: Pm2Controller;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [Pm2Controller],
      providers: [Pm2Service],
    }).compile();

    controller = module.get<Pm2Controller>(Pm2Controller);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
