import { WebSocketGateway, WebSocketServer, OnGatewayInit } from '@nestjs/websockets';
import { Server } from 'socket.io';
import pm2 from 'pm2';

@WebSocketGateway({ cors: { origin: '*' } })
export class Pm2Gateway implements OnGatewayInit {

  @WebSocketServer()
  server: Server;

  afterInit() {
    console.log('WebSocket Server (Socket.io) initialized');

    pm2.connect((connectErr) => {
      if (connectErr) {
        console.error('Error connecting to PM2:', connectErr);
        return;
      }

      pm2.launchBus((err, bus) => {
        if (err) {
          console.error('Error starting PM2 Bus:', err);
          return;
        }

        console.log('PM2 Bus intercepted successfully');

        bus.on('log:out', (packet) => {
          this.server.emit('pm2-log', {
            app: packet.process.name,
            type: 'info',
            message: packet.data
          });
        });

        bus.on('log:err', (packet) => {
          this.server.emit('pm2-log', {
            app: packet.process.name,
            type: 'error',
            message: packet.data
          });
        });

        bus.on('process:exception', (packet) => {
          this.server.emit('pm2-alert', {
            app: packet.process.name,
            type: 'crash',
            message: 'Process stopped due to a fatal error!',
            error_details: packet.data
          });
        });
      });
    });
  }
}