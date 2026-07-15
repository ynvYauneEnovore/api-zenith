import { Controller, Get, Post, Body, Patch, Param, Delete, InternalServerErrorException } from '@nestjs/common';
import { Pm2Service } from './pm2.service';
import { CreatePm2Dto } from './dto/create-pm2.dto';
import { UpdatePm2Dto } from './dto/update-pm2.dto';

@Controller('pm2')
export class Pm2Controller {
  constructor(private readonly pm2Service: Pm2Service) { }

  @Get('dashboard')
  async getDashboardMetrics() {
    try {
      const processes = await this.pm2Service.getProcessList();

      return processes.map(proc => {
        const metrics = (proc.pm2_env as any)?.ax_monit || {};

        return {
          id: proc.pm_id,
          name: proc.name,
          status: proc.pm2_env?.status,
          cpu: proc.monit?.cpu || 0,
          memory: proc.monit?.memory || 0,
          restarts: proc.pm2_env?.restart_time || 0,
          uptime: proc.pm2_env?.pm_uptime || 0,
          eventLoopLatency: metrics['Loop delay']?.value || '0ms',
          heapSize: metrics['Heap Size']?.value || '0MiB',
          heapUsage: metrics['Heap Usage']?.value || '0%',
          activeRequests: metrics['Active requests']?.value || 0,
          version: (proc.pm2_env as any)?.version || 'N/A',
          instances: proc.pm2_env?.instances || 1,
          execMode: (proc.pm2_env as any)?.exec_mode
        };
      });
    } catch (error) {
      throw new InternalServerErrorException('Error fetching metrics from PM2');
    }
  }

  @Post('restart/:id')
  async restartApp(@Param('id') id: string) {
    return await this.pm2Service.restartProcess(id);
  }

  @Post('reload/:id')
  async reloadApp(@Param('id') id: string) {
    return await this.pm2Service.reloadProcess(id);
  }

  @Post('stop/:id')
  async stopApp(@Param('id') id: string) {
    return await this.pm2Service.stopProcess(id);
  }

  @Post('delete/:id')
  async deleteApp(@Param('id') id: string) {
    return await this.pm2Service.deleteProcess(id);
  }

  @Post('scale/:appName')
  async scaleApp(
    @Param('appName') appName: string,
    @Body('instances') instances: number | string,
  ) {
    if (!instances) {
      throw new InternalServerErrorException('You must provide the number of instances');
    }
    return await this.pm2Service.scaleProcess(appName, instances);
  }

  @Post('system/kill')
  async killPm2() {
    return await this.pm2Service.killDaemon();
  }

  @Post('send-data/:id')
  async sendDataToApp(
    @Param('id') id: string,
    @Body() payload: any,
  ) {
    if (!payload || Object.keys(payload).length === 0) {
      throw new InternalServerErrorException('Payload body cannot be empty');
    }
    return await this.pm2Service.sendDataToProcess(Number(id), payload);
  }
}
