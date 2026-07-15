import { Injectable, OnModuleDestroy, OnModuleInit, InternalServerErrorException } from '@nestjs/common';
import { CreatePm2Dto } from './dto/create-pm2.dto';
import { UpdatePm2Dto } from './dto/update-pm2.dto';
import pm2 from 'pm2';


@Injectable()
export class Pm2Service implements OnModuleInit, OnModuleDestroy {

  onModuleInit() {
    pm2.connect((err) => {
      if (err) {
        console.error('Error al conectar con PM2:', err);
        process.exit(2);
      }
      console.log('✅ Conectado exitosamente al demonio de PM2');
    });
  }

  // Se ejecuta al apagar el servidor para evitar fugas de memoria
  onModuleDestroy() {
    pm2.disconnect();
  }

  async getProcessList(): Promise<pm2.ProcessDescription[]> {
    return new Promise((resolve, reject) => {
      pm2.list((err, list) => {
        if (err) {
          reject(new InternalServerErrorException('Fallo al obtener los procesos de PM2'));
        } else {
          resolve(list);
        }
      });
    });
  }

  create(createPm2Dto: CreatePm2Dto) {
    return 'This action adds a new pm2';
  }

  findAll() {
    return `This action returns all pm2`;
  }

  findOne(id: number) {
    return `This action returns a #${id} pm2`;
  }

  update(id: number, updatePm2Dto: UpdatePm2Dto) {
    return `This action updates a #${id} pm2`;
  }

  remove(id: number) {
    return `This action removes a #${id} pm2`;
  }
}
