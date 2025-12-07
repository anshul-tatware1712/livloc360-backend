import Location from "../models/Location.js";
import Device from "../models/Device.js";

class LocationService {
  async saveLocation(data) {
    const { deviceId, coordinates, address, accuracy, speed, altitude } = data;

    try {
      const device = await Device.findOne({ deviceId }).populate("user");

      if (!device) {
        throw new Error("Device not found");
      }

      const location = await Location.create({
        device: device._id,
        user: device.user ? device.user._id : null,
        coordinates: {
          type: "Point",
          coordinates: [coordinates.lng, coordinates.lat],
        },
        address,
        accuracy,
        speed,
        altitude,
      });

      device.currentLocation = {
        type: "Point",
        coordinates: [coordinates.lng, coordinates.lat],
        address: address || device.currentLocation?.address || "",
        timestamp: new Date(),
      };
      device.lastSeen = new Date();
      device.isOnline = true;

      await device.save();

      return { location, device };
    } catch (error) {
      console.error("Error saving location:", error);
      throw error;
    }
  }
}

export default new LocationService();
