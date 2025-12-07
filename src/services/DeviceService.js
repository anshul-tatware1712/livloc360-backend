import DeviceRepository from '../repositories/DeviceRepository.js';
import UserRepository from '../repositories/UserRepository.js';

class DeviceService {
  async registerDevice(deviceData) {
    const { deviceId, deviceName, deviceType, os, userId } = deviceData;

    const deviceExists = await DeviceRepository.findByField('deviceId', deviceId);
    if (deviceExists) {
      throw new Error('Device already registered');
    }

    const device = await DeviceRepository.create({
      deviceId,
      deviceName,
      deviceType,
      os,
      user: userId,
    });

    await UserRepository.updateOne({ _id: userId }, { 
      $push: { devices: device._id } 
    });

    return device;
  }

  async getDevicesByUserId(userId) {
    return await DeviceRepository.findByUserId(userId, 'user firstName lastName email');
  }

  async deleteDevice(deviceId, userId) {
    const device = await DeviceRepository.findById(deviceId);
    if (!device) {
      throw new Error('Device not found');
    }

    if (device.user.toString() !== userId.toString()) {
      throw new Error('Not authorized to delete this device');
    }

    await UserRepository.updateOne({ _id: userId }, {
      $pull: { devices: deviceId }
    });

    return await DeviceRepository.deleteById(deviceId);
  }

  async getDeviceById(deviceId) {
    return await DeviceRepository.findById(deviceId);
  }

  async getDeviceByDeviceId(deviceId) {
    return await DeviceRepository.findByDeviceId(deviceId);
  }
}

export default new DeviceService();