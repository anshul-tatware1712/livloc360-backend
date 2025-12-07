import { getIO } from '../config/socket.js';

class SocketService {
  emitLocationUpdate(userId, data) {
    const io = getIO();
    io.to(userId).emit('location_updated', data);
  }

  joinUserRoom(socketId, userId) {
    const io = getIO();
    io.to(socketId).emit('join_user_room', userId);
  }

  leaveUserRoom(socketId, userId) {
    const io = getIO();
    io.to(socketId).emit('leave_user_room', userId);
  }

  emitDeviceStatus(userId, deviceId, status) {
    const io = getIO();
    io.to(userId).emit('device_status', {
      deviceId,
      status,
      timestamp: new Date()
    });
  }
}

export default new SocketService();