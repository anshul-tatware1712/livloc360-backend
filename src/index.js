import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";

dotenv.config();
const app = express();


app.use(cors());
app.use(express.json());
connectDB();

app.get("/start", (req, res) => {
  res.send("livloc360 backend running ✅");
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
