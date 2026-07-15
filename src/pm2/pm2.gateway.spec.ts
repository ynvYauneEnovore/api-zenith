import { Test, TestingModule } from '@nestjs/testing';
import { Pm2Gateway } from './pm2.gateway';

describe('Pm2Gateway', () => {
  let gateway: Pm2Gateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [Pm2Gateway],
    }).compile();

    gateway = module.get<Pm2Gateway>(Pm2Gateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
