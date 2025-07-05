// import express from "express";
// import cors from "cors";
// import dotenv from "dotenv";
// dotenv.config();

// import authRoutes from "./routes/authRoutes.js";
// import bookRoutes from "./routes/bookRoutes.js";

// import { connectDB } from "./lib/db.js";

// const app = express();
// const PORT = process.env.PORT || 3000;

// // ✅ Middleware to parse JSON request bodies
// app.use(express.json());
// app.use(cors());
// // Your routes
// app.use("/api/auth", authRoutes);
// app.use("/api/books", bookRoutes);



// app.listen(PORT, () => {
//     console.log(`Server running on PORT ${PORT}`);
//     connectDB();
// });


import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import job from "./lib/cron.js";
dotenv.config();

import authRoutes from "./routes/authRoutes.js";
import bookRoutes from "./routes/bookRoutes.js";
import { connectDB } from "./lib/db.js";

const app = express();
const PORT = process.env.PORT || 8080;

job.start();
app.use(express.json());
app.use(cors());

// Simple test route
app.get("/", (req, res) => {
  res.send("🚀 API is working from Railway!");
});

// Route check
app.get("/api/auth/api/hello", (req, res) => {
  res.send("✅ Hello from /api/auth/api/hello");
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/books", bookRoutes);

// Connect DB then start server
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ Failed to connect to DB:", err);
  });
