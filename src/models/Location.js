import mongoose from 'mongoose';

const locationSchema = new mongoose.Schema({
  device: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Device',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  coordinates: {
    type: {
      type: String,
      default: 'Point',
      enum: ['Point']
    },
    coordinates: {
      type: [Number],
      index: '2dsphere'
    }
  },
  address: {
    type: String,
    required: false,
    default: ''
  },
  accuracy: {
    type: Number,
    required: false
  },
  speed: {
    type: Number,
    required: false
  },
  altitude: {
    type: Number, 
    required: false
  },
  timestamp: {
    type: Date,
    default: Date.now,
    index: true
  }
}, {
  timestamps: true
});

locationSchema.index({ createdAt: 1 }, { expireAfterSeconds: 172800 });

const Location = mongoose.model('Location', locationSchema);

export default Location;