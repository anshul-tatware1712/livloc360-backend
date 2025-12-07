import BaseRepository from './BaseRepository.js';
import User from '../models/User.js';

class UserRepository extends BaseRepository {
  constructor() {
    super(User);
  }

  async findByEmail(email) {
    return await this.model.findOne({ email }).select('+password +generatedPassword');
  }

  async findByGeneratedCredentials(generatedId) {
    return await this.model.findOne({ generatedId }).select('+generatedPassword');
  }

  async findByIdWithDevices(id) {
    return await this.model.findById(id).populate('devices');
  }

  async findByIdWithCredentials(id) {
    return await this.model.findById(id).select('+generatedId +generatedPassword');
  }

  async updateCredentials(userId, generatedId, generatedPassword) {
    return await this.model.findByIdAndUpdate(
      userId,
      { generatedId, generatedPassword },
      { new: true }
    ).select('+generatedId +generatedPassword');
  }
}

export default new UserRepository();