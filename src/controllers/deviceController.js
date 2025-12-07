import asyncHandler from "express-async-handler";
import DeviceService from "../services/DeviceService.js";
import { registerDeviceValidation } from "../validations/deviceValidation.js";

const registerDevice = asyncHandler(async (req, res) => {
  try {
    const { error } = registerDeviceValidation.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }

    const device = await DeviceService.registerDevice(req.body);

    res.status(201).json({
      success: true,
      data: device,
    });
  } catch (error) {
    if (error.message === "Device already registered") {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    res.status(500).json({
      success: false,
      message: error.message || "Server error registering device",
    });
  }
});

const getDevices = asyncHandler(async (req, res) => {
  try {
    const devices = await DeviceService.getDevicesByUserId(req.user._id);

    res.json({
      success: true,
      count: devices.length,
      data: devices,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Server error retrieving devices",
    });
  }
});

const deleteDevice = asyncHandler(async (req, res) => {
  try {
    const result = await DeviceService.deleteDevice(
      req.params.id,
      req.user._id
    );

    res.json({
      success: true,
      message: "Device removed successfully",
      data: result,
    });
  } catch (error) {
    if (error.message === "Device not found") {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    } else if (error.message === "Not authorized to delete this device") {
      return res.status(401).json({
        success: false,
        message: error.message,
      });
    }

    res.status(500).json({
      success: false,
      message: error.message || "Server error deleting device",
    });
  }
});

export { registerDevice, getDevices, deleteDevice };
