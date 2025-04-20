import express from "express";
import { json } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import authRouter from "./routes/auth.js";
import servicesRouter from "./routes/services.js";
import vehiclesRouter from "./routes/vehicles.js";
import appointmentsRouter from "./routes/appointments.js";
import { requireAuth } from "./middleware/auth.js";

const app = express();

// Middleware
app.use(json());
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true,
  })
);

// Health check endpoint for Render
app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

// Routes
app.use("/api/auth", authRouter);
app.use("/api/services", servicesRouter);
app.use("/api/vehicles", vehiclesRouter);
app.use("/api/appointments", appointmentsRouter);

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Internal server error" });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
