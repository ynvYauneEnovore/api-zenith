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
        // PM2 guarda las métricas avanzadas (APM) aquí
        const metrics = (proc.pm2_env as any)?.ax_monit || {};

        return {
          id: proc.pm_id,
          name: proc.name,
          status: proc.pm2_env?.status,

          // Métricas Core (CPU % y Memoria en Bytes)
          cpu: proc.monit?.cpu || 0,
          memory: proc.monit?.memory || 0,
          restarts: proc.pm2_env?.restart_time || 0,
          uptime: proc.pm2_env?.pm_uptime || 0,

          // Métricas Avanzadas APM
          eventLoopLatency: metrics['Loop delay']?.value || '0ms',
          heapSize: metrics['Heap Size']?.value || '0MiB',
          heapUsage: metrics['Heap Usage']?.value || '0%',
          activeRequests: metrics['Active requests']?.value || 0,

          // Información del entorno
          version: (proc.pm2_env as any)?.version || 'N/A',
          instances: proc.pm2_env?.instances || 1,
          execMode: (proc.pm2_env as any)?.exec_mode
        };
      });
    } catch (error) {
      throw new InternalServerErrorException('Error fetching metrics from PM2');
    }
  }

  @Post()
  create(@Body() createPm2Dto: CreatePm2Dto) {
    return this.pm2Service.create(createPm2Dto);
  }

  @Get()
  findAll() {
    return this.pm2Service.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.pm2Service.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePm2Dto: UpdatePm2Dto) {
    return this.pm2Service.update(+id, updatePm2Dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.pm2Service.remove(+id);
  }
}
