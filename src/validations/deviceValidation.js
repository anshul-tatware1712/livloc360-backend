import joi from 'joi';

export const registerDeviceValidation = joi.object({
  deviceId: joi.string().required(),
  deviceName: joi.string().max(100),
  deviceType: joi.string().valid('mobile', 'tablet', 'other'),
  os: joi.string(),
  userId: joi.string().required()
});

export const updateDeviceLocationValidation = joi.object({
  deviceId: joi.string().required(),
  coordinates: joi.object({
    lat: joi.number().min(-90).max(90).required(),
    lng: joi.number().min(-180).max(180).required()
  }).required(),
  address: joi.string(),
  accuracy: joi.number(),
  speed: joi.number(),
  altitude: joi.number()
});

export const getLocationsByDeviceValidation = joi.object({
  deviceId: joi.string().required()
});
export const createLocationValidation = joi.object({
  deviceId: joi.string().required(),
  coordinates: joi.object({
    lat: joi.number().min(-90).max(90).required(),
    lng: joi.number().min(-180).max(180).required()
  }).required(),
  address: joi.string(),
  accuracy: joi.number(),
  speed: joi.number(),
  altitude: joi.number()
});