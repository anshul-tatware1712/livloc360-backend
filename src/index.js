import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import http from "http";
import swaggerUi from "swagger-ui-express";
import swaggerSpecs from "./config/swagger.js";
import connectDB from "./config/db.js";
import { initSocket } from "./config/socket.js";
import userRoutes from "./routes/userRoutes.js";
import deviceRoutes from "./routes/deviceRoutes.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

connectDB();

app.get("/start", (_, res) => {
  res.send("livloc360 backend running");
});

app.use("/api/users", userRoutes);
app.use("/api/devices", deviceRoutes);

const PORT = process.env.PORT || 8000;
const server = http.createServer(app);
const io = initSocket(server);

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
