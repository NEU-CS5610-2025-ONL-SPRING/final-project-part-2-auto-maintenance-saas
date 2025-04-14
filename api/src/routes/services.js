import express from "express";
import prisma from "../utils/db.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

// GET all services
router.get("/", async (req, res) => {
  try {
    const services = await prisma.service.findMany();
    res.json(services);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch services" });
  }
});

// POST new service (authenticated)
router.post("/", requireAuth, async (req, res) => {
  try {
    const { name, price, duration, description } = req.body;
    const newService = await prisma.service.create({
      data: { name, price, duration, description },
    });
    res.status(201).json(newService);
  } catch (error) {
    res.status(400).json({ error: "Failed to create service" });
  }
});

export default router;
