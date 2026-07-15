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

  async restartProcess(id: string): Promise<{ message: string }> {
    return new Promise((resolve, reject) => {
      pm2.restart(id, (err) => {
        if (err) {
          return reject(new InternalServerErrorException(`No se pudo reiniciar el proceso ${id}`));
        }
        resolve({ message: `Proceso ${id} reiniciado exitosamente` });
      });
    });
  }

  async reloadProcess(id: string): Promise<{ message: string }> {
    return new Promise((resolve, reject) => {
      pm2.reload(id, (err) => {
        if (err) {
          return reject(new InternalServerErrorException(`No se pudo recargar el proceso ${id}`));
        }
        resolve({ message: `Proceso ${id} recargado (Zero Downtime) exitosamente` });
      });
    });
  }

  async stopProcess(id: string): Promise<{ message: string }> {
    return new Promise((resolve, reject) => {
      pm2.stop(id, (err) => {
        if (err) {
          return reject(new InternalServerErrorException(`No se pudo detener el proceso ${id}`));
        }
        resolve({ message: `Proceso ${id} detenido` });
      });
    });
  }

  async deleteProcess(id: string): Promise<{ message: string }> {
    return new Promise((resolve, reject) => {
      pm2.delete(id, (err) => {
        if (err) {
          return reject(new InternalServerErrorException(`No se pudo eliminar el proceso ${id}`));
        }
        resolve({ message: `Proceso ${id} eliminado de PM2` });
      });
    });
  }


  async scaleProcess(appName: string, instances: number | string): Promise<{ message: string }> {
    return new Promise((resolve, reject) => {
      (pm2 as any).scale(appName, instances, (err: any) => {
        if (err) {
          return reject(new InternalServerErrorException(`No se pudo escalar la aplicación ${appName}`));
        }
        resolve({ message: `Aplicación ${appName} escalada a ${instances} instancias exitosamente` });
      });
    });
  }

  async killDaemon(): Promise<{ message: string }> {
    return new Promise((resolve, reject) => {
      pm2.killDaemon((err) => {
        if (err) {
          return reject(new InternalServerErrorException('Error al intentar apagar el demonio de PM2'));
        }
        resolve({ message: 'Demonio de PM2 apagado correctamente' });
      });
    });
  }


  async sendDataToProcess(id: number, dataPayload: any): Promise<{ message: string }> {
    return new Promise((resolve, reject) => {
      pm2.sendDataToProcessId(
        id,
        {
          type: 'process:msg',
          data: dataPayload,
          topic: 'zenith-command'
        },
        (err, res) => {
          if (err) {
            return reject(new InternalServerErrorException(`Fallo al enviar datos al proceso ${id}`));
          }
          resolve({ message: `Datos inyectados correctamente al proceso ${id}` });
        }
      );
    });
  }

}
