import express from "express";

const router = express.Router();

// Ping endpoint
router.get("/", (req, res) => {
  res.status(200).json({ message: "Pong!" });
});

export default router;
