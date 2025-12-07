import express from "express";
import {
  registerDevice,
  getDevices,
  deleteDevice,
} from "../controllers/deviceController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Devices
 *   description: Device management API
 */

/**
 * @swagger
 * /devices:
 *   get:
 *     summary: Get all devices for the logged in user
 *     tags: [Devices]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of user devices
 *       401:
 *         description: Not authorized
 */
router.route("/").get(protect, getDevices);

/**
 * @swagger
 * /devices/register:
 *   post:
 *     summary: Register a new device
 *     tags: [Devices]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - deviceId
 *               - deviceName
 *               - userId
 *             properties:
 *               deviceId:
 *                 type: string
 *               deviceName:
 *                 type: string
 *               deviceType:
 *                 type: string
 *                 default: Mobile
 *               os:
 *                 type: string
 *               userId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Device registered successfully
 *       400:
 *         description: Device already exists or invalid data
 */
router.route("/register").post(protect, registerDevice);

/**
 * @swagger
 * /devices/{id}:
 *   delete:
 *     summary: Delete a device
 *     tags: [Devices]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Device deleted
 *       404:
 *         description: Device not found
 */
router.route("/:id").delete(protect, deleteDevice);

export default router;
