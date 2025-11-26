import {
    WebSocketGateway,
    WebSocketServer,
    SubscribeMessage,
    MessageBody,
    ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class TrackingGateway {
  @WebSocketServer()
  server: Server;

  @SubscribeMessage('bus-location-update')
  handleBusLocationUpdate(
    @MessageBody() data: { busId: string; latitude: number; longitude: number },
    @ConnectedSocket() client: Socket,
  ) {
    // Broadcast to all clients tracking this bus
    this.server.emit(`bus-${data.busId}-location`, {
      latitude: data.latitude,
      longitude: data.longitude,
      timestamp: new Date(),
    });
    return { success: true };
  }

  @SubscribeMessage('track-bus')
  handleTrackBus(
    @MessageBody() data: { busId: string },
    @ConnectedSocket() client: Socket,
  ) {
    client.join(`bus-${data.busId}`);
    return { success: true, message: `Now tracking bus ${data.busId}` };
  }

  @SubscribeMessage('stop-tracking-bus')
  handleStopTrackingBus(
    @MessageBody() data: { busId: string },
    @ConnectedSocket() client: Socket,
  ) {
    client.leave(`bus-${data.busId}`);
    return { success: true, message: `Stopped tracking bus ${data.busId}` };
  }

  @SubscribeMessage('trip-status-update')
  handleTripStatusUpdate(
    @MessageBody() data: { tripId: string; status: string },
  ) {
    this.server.emit(`trip-${data.tripId}-status`, {
      status: data.status,
      timestamp: new Date(),
    });
    return { success: true };
  }

  broadcastBusLocation(busId: string, latitude: number, longitude: number) {
    this.server.emit(`bus-${busId}-location`, {
      latitude,
      longitude,
      timestamp: new Date(),
    });
  }
}
