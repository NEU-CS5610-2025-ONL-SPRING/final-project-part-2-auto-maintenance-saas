import express from "express";
import { json } from "express";
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth.js";
import pingRouter from "./routes/ping.js";
import servicesRouter from "./routes/services.js"; // Add this import
import { requireAuth } from "./middleware/auth.js"; // Add this import

const app = express();
app.use(json());
app.use(cookieParser());

// Routes
app.use("/auth", authRouter);
app.use("/services", requireAuth, servicesRouter);
app.use("/ping", pingRouter);

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Internal server error" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
