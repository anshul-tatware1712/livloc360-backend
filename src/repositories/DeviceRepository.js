import BaseRepository from './BaseRepository.js';
import Device from '../models/Device.js';

class DeviceRepository extends BaseRepository {
  constructor() {
    super(Device);
  }

  async findByDeviceId(deviceId, populateOptions = 'user') {
    return await this.model.findOne({ deviceId }).populate(populateOptions);
  }

  async findByUserId(userId, populateOptions = '') {
    return await this.model.find({ user: userId }).populate(populateOptions);
  }

  async updateLocationByDeviceId(deviceId, locationData) {
    return await this.model.findOneAndUpdate(
      { deviceId },
      {
        $set: {
          currentLocation: locationData,
          lastSeen: new Date(),
          isOnline: true
        }
      },
      { new: true }
    );
  }

  async getDevicesByUserId(userId, selectOptions = '_id deviceId') {
    return await this.model.find({ user: userId }).select(selectOptions);
  }
}

export default new DeviceRepository();