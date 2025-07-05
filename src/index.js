import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

import authRoutes from "./routes/authRoutes.js";
import bookRoutes from "./routes/bookRoutes.js";

import { connectDB } from "./lib/db.js";

const app = express();
const PORT = process.env.PORT || 3000;

// ✅ Middleware to parse JSON request bodies
app.use(express.json());
app.use(cors());
// Your routes
app.use("/api/auth", authRoutes);
app.use("/api/books", bookRoutes);



app.listen(PORT, () => {
    console.log(`Server running on PORT ${PORT}`);
    connectDB();
});
