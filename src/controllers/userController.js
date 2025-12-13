import asyncHandler from "express-async-handler";
import { generateToken, generateRefreshToken } from "../utils/tokenUtils.js";
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

    // Generate refresh token and store it in the user document
    const refreshToken = generateRefreshToken(user._id);
    user.refreshToken = refreshToken;
    await user.save();

    res.status(201).json({
      success: true,
      data: {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        accessToken: generateToken(user._id),
        refreshToken: refreshToken,
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

    // Generate refresh token and store it in the user document
    const refreshToken = generateRefreshToken(user._id);
    user.refreshToken = refreshToken;
    await user.save();

    res.status(200).json({
      success: true,
      data: {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        accessToken: generateToken(user._id),
        refreshToken: refreshToken,
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

    // Generate refresh token and store it in the user document
    const refreshToken = generateRefreshToken(user._id);
    user.refreshToken = refreshToken;
    await user.save();

    res.status(200).json({
      success: true,
      data: {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        generatedId: user.generatedId,
        token: generateToken(user._id),
        refreshToken,
      },
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: error.message || "Invalid credentials",
    });
  }
});

const refreshAuthToken = asyncHandler(async (req, res) => {
  try {
    const refreshToken = req.body.refreshToken;

    const result = await UserService.refreshUserToken(refreshToken);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    if (
      error.message === "Refresh token is required" ||
      error.message === "Invalid refresh token" ||
      error.message === "Invalid or expired refresh token"
    ) {
      return res.status(401).json({
        success: false,
        message: error.message,
      });
    }

    res.status(500).json({
      success: false,
      message: error.message || "Server error during token refresh",
    });
  }
});

const logoutUser = asyncHandler(async (req, res) => {
  try {
    await UserService.clearRefreshToken(req.user._id);

    res.status(200).json({
      success: true,
      message: "User logged out successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Server error during logout",
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
  refreshAuthToken,
  logoutUser,
};
