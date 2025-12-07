import asyncHandler from "express-async-handler";
import { generateToken } from "../middleware/authMiddleware.js";
import UserService from "../services/UserService.js";
import {
  registerValidation,
  loginValidation,
  deviceLoginValidation,
  updateUserValidation,
} from "../validations/userValidation.js";

const registerUser = asyncHandler(async (req, res) => {
  try {
    const { error } = registerValidation.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }

    const user = await UserService.registerUser(req.body);

    res.status(201).json({
      success: true,
      data: {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        token: generateToken(user._id),
      },
    });
  } catch (error) {
    if (error.message === "User already exists") {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    res.status(500).json({
      success: false,
      message: error.message || "Server error during registration",
    });
  }
});

const loginUser = asyncHandler(async (req, res) => {
  try {
    const { error } = loginValidation.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }

    const user = await UserService.authenticateUser(
      req.body.email,
      req.body.password
    );

    res.status(200).json({
      success: true,
      data: {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        token: generateToken(user._id),
      },
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: error.message || "Authentication failed",
    });
  }
});

const getUserProfile = asyncHandler(async (req, res) => {
  try {
    const user = await UserService.getUserProfile(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      data: {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        isPremium: user.isPremium,
        devices: user.devices,
        createdAt: user.createdAt,
        ...(user.isPremium && {
          generatedId: user.generatedId,
          generatedPassword: user.generatedPassword,
        }),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Server error retrieving profile",
    });
  }
});

const updateUserProfile = asyncHandler(async (req, res) => {
  try {
    const { error } = updateUserValidation.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }

    const updatedUser = await UserService.updateUserProfile(
      req.user._id,
      req.body
    );

    res.status(200).json({
      success: true,
      data: {
        _id: updatedUser._id,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        email: updatedUser.email,
        token: generateToken(updatedUser._id),
      },
    });
  } catch (error) {
    if (error.message === "User not found") {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }

    res.status(500).json({
      success: false,
      message: error.message || "Server error during profile update",
    });
  }
});

const generateNewCredentials = asyncHandler(async (req, res) => {
  try {
    const result = await UserService.generateNewCredentials(req.user._id);

    res.status(200).json({
      success: true,
      data: {
        generatedId: result.generatedId,
        generatedPassword: result.generatedPassword,
      },
    });
  } catch (error) {
    if (error.message === "User not found") {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }

    res.status(500).json({
      success: false,
      message: error.message || "Server error generating credentials",
    });
  }
});

const deviceLogin = asyncHandler(async (req, res) => {
  try {
    const { error } = deviceLoginValidation.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }

    const user = await UserService.authenticateWithGeneratedCredentials(
      req.body.generatedId,
      req.body.generatedPassword
    );

    res.status(200).json({
      success: true,
      data: {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        generatedId: user.generatedId,
      },
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: error.message || "Invalid credentials",
    });
  }
});

export {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  generateNewCredentials,
  deviceLogin,
};
