import { Injectable, OnModuleInit } from '@nestjs/common';
import WebSocket from 'ws';
import { Pm2Service } from './pm2.service';

@Injectable()
export class HubClientService implements OnModuleInit {
    private ws: WebSocket;

    constructor(private readonly pm2Service: Pm2Service) { }

    onModuleInit() {
        this.connectToMasterHub();
    }

    connectToMasterHub() {
        this.ws = new WebSocket('ws://localhost:8081/ws/agent');

        this.ws.on('open', () => {
            console.log('✅ [AGENTE] Conectado exitosamente al Master Hub (Go)');

            setInterval(async () => {
                try {
                    const metrics = await this.pm2Service.getProcessList();

                    this.ws.send(JSON.stringify({
                        server: 'Servidor Ubuntu A',
                        processes: metrics
                    }));
                } catch (error) {
                    console.error('Fallo al extraer métricas', error);
                }
            }, 2000);
        });

        this.ws.on('message', (data) => {
            console.log('🏢 [HUB DICE]:', data.toString());
        });

        this.ws.on('close', () => {
            console.log('❌ [AGENTE] Hub desconectado. Reintentando en 5 segundos...');
            setTimeout(() => this.connectToMasterHub(), 5000);
        });
    }
}