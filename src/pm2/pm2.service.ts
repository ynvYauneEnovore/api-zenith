import { Injectable, OnModuleDestroy, OnModuleInit, InternalServerErrorException } from '@nestjs/common';
import { CreatePm2Dto } from './dto/create-pm2.dto';
import { UpdatePm2Dto } from './dto/update-pm2.dto';
import pm2 from 'pm2';


@Injectable()
export class Pm2Service implements OnModuleInit, OnModuleDestroy {

  onModuleInit() {
    pm2.connect((err) => {
      if (err) {
        console.error('Error connecting to PM2:', err);
        process.exit(2);
      }
      console.log('Successfully connected to PM2 daemon');
    });
  }

  onModuleDestroy() {
    pm2.disconnect();
  }

  async getProcessList(): Promise<pm2.ProcessDescription[]> {
    return new Promise((resolve, reject) => {
      pm2.list((err, list) => {
        if (err) {
          reject(new InternalServerErrorException('Failed to retrieve PM2 processes'));
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
          return reject(new InternalServerErrorException(`Failed to restart process ${id}`));
        }
        resolve({ message: `Process ${id} restarted successfully` });
      });
    });
  }

  async reloadProcess(id: string): Promise<{ message: string }> {
    return new Promise((resolve, reject) => {
      pm2.reload(id, (err) => {
        if (err) {
          return reject(new InternalServerErrorException(`Failed to reload process ${id}`));
        }
        resolve({ message: `Process ${id} reloaded successfully` });
      });
    });
  }

  async stopProcess(id: string): Promise<{ message: string }> {
    return new Promise((resolve, reject) => {
      pm2.stop(id, (err) => {
        if (err) {
          return reject(new InternalServerErrorException(`Failed to stop process ${id}`));
        }
        resolve({ message: `Process ${id} stopped` });
      });
    });
  }

  async deleteProcess(id: string): Promise<{ message: string }> {
    return new Promise((resolve, reject) => {
      pm2.delete(id, (err) => {
        if (err) {
          return reject(new InternalServerErrorException(`Failed to delete process ${id}`));
        }
        resolve({ message: `Process ${id} deleted from PM2` });
      });
    });
  }


  async scaleProcess(appName: string, instances: number | string): Promise<{ message: string }> {
    return new Promise((resolve, reject) => {
      (pm2 as any).scale(appName, instances, (err: any) => {
        if (err) {
          return reject(new InternalServerErrorException(`Failed to scale application ${appName}`));
        }
        resolve({ message: `Application ${appName} scaled to ${instances} instances successfully` });
      });
    });
  }

  async killDaemon(): Promise<{ message: string }> {
    return new Promise((resolve, reject) => {
      pm2.killDaemon((err) => {
        if (err) {
          return reject(new InternalServerErrorException('Failed to kill PM2 daemon'));
        }
        resolve({ message: 'PM2 daemon killed successfully' });
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
            return reject(new InternalServerErrorException(`Failed to send data to process ${id}`));
          }
          resolve({ message: `Data successfully injected into process ${id}` });
        }
      );
    });
  }

}
