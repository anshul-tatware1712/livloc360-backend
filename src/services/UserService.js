import UserRepository from "../repositories/UserRepository.js";
import {
  generateUniqueId,
  generateSecurePassword,
} from "../utils/generateId.js";
import jwt from "jsonwebtoken";
import { generateToken, generateRefreshToken } from "../utils/tokenUtils.js";

class UserService {
  async registerUser(userData) {
    const { firstName, lastName, email, password } = userData;

    const userExists = await UserRepository.findByField("email", email);
    if (userExists) {
      throw new Error("User already exists");
    }

    const generatedId = generateUniqueId("USR");
    const generatedPassword = generateSecurePassword();

    const user = await UserRepository.create({
      firstName,
      lastName,
      email,
      password,
      generatedId,
      generatedPassword,
    });

    return user;
  }

  async authenticateUser(email, password) {
    const user = await UserRepository.findByEmail(email);
    if (!user || !(await user.comparePassword(password))) {
      throw new Error("Invalid email or password");
    }

    return user;
  }

  async authenticateWithGeneratedCredentials(generatedId, generatedPassword) {
    const user = await UserRepository.findByGeneratedCredentials(generatedId);
    if (!user || !(await user.compareGeneratedPassword(generatedPassword))) {
      throw new Error("Invalid credentials");
    }

    return user;
  }

  async getUserProfile(userId) {
    let user = await UserRepository.findByIdWithDevices(userId);
    if (!user) {
      throw new Error("User not found");
    }

    if (user.isPremium) {
      const premiumUser = await UserRepository.findByIdWithCredentials(userId);
      user.generatedId = premiumUser.generatedId;
      user.generatedPassword = premiumUser.generatedPassword;
    }

    return user;
  }

  async updateUserProfile(userId, updateData) {
    const user = await UserRepository.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    user.firstName = updateData.firstName || user.firstName;
    user.lastName = updateData.lastName || user.lastName;
    user.email = updateData.email || user.email;

    if (updateData.password) {
      user.password = updateData.password;
    }

    return await user.save();
  }

  async generateNewCredentials(userId) {
    const user = await UserRepository.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    user.generatedId = generateUniqueId("USR");
    user.generatedPassword = generateSecurePassword();

    return await UserRepository.updateCredentials(
      userId,
      user.generatedId,
      user.generatedPassword
    );
  }

  async findById(userId) {
    return await UserRepository.findById(userId);
  }

  async clearRefreshToken(userId) {
    const user = await UserRepository.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }
    user.accessToken = undefined;
    user.refreshToken = undefined;
    await user.save();
    return user;
  }

  async refreshUserToken(refreshToken) {
    if (!refreshToken) {
      throw new Error("Refresh token is required");
    }

    let decoded;
    try {
      decoded = jwt.verify(
        refreshToken,
        process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET + "refresh"
      );
    } catch (error) {
      throw new Error("Invalid or expired refresh token");
    }

    const user = await UserRepository.findById(decoded.id);

    if (!user || user.refreshToken !== refreshToken) {
      throw new Error("Invalid refresh token");
    }

    const newAccessToken = generateToken(user._id);
    const newRefreshToken = generateRefreshToken(user._id);

    user.refreshToken = newRefreshToken;
    await user.save();

    return {
      token: newAccessToken,
      refreshToken: newRefreshToken,
    };
  }
}

export default new UserService();
