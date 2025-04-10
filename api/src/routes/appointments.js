const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const authenticateToken = require("../middleware/auth");

// Get all appointments for the authenticated user
router.get("/", authenticateToken, async (req, res) => {
  try {
    const appointments = await prisma.appointment.findMany({
      where: { userId: req.user.id },
      include: { service: true },
      orderBy: { date: "asc" },
    });
    res.json(appointments);
  } catch (error) {
    console.error("Error fetching appointments:", error);
    res.status(500).json({ message: "Error fetching appointments" });
  }
});

// Get all appointments (admin only)
router.get("/all", authenticateToken, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Forbidden" });
    }

    const appointments = await prisma.appointment.findMany({
      include: { service: true, user: { select: { id: true, email: true } } },
      orderBy: { date: "asc" },
    });
    res.json(appointments);
  } catch (error) {
    console.error("Error fetching all appointments:", error);
    res.status(500).json({ message: "Error fetching all appointments" });
  }
});

// Create a new appointment
router.post("/", authenticateToken, async (req, res) => {
  try {
    const { date, carModel, serviceId } = req.body;

    // Validate request body
    if (!date || !carModel || !serviceId) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Check if service exists
    const service = await prisma.service.findUnique({
      where: { id: parseInt(serviceId) },
    });

    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    // Check if the time slot is available
    const appointmentDate = new Date(date);
    const existingAppointment = await prisma.appointment.findFirst({
      where: {
        date: appointmentDate,
        serviceId: parseInt(serviceId),
      },
    });

    if (existingAppointment) {
      return res
        .status(409)
        .json({ message: "This time slot is already booked" });
    }

    // Create the appointment
    const appointment = await prisma.appointment.create({
      data: {
        date: appointmentDate,
        carModel,
        userId: req.user.id,
        serviceId: parseInt(serviceId),
        status: "PENDING",
      },
      include: { service: true },
    });

    res.status(201).json(appointment);
  } catch (error) {
    console.error("Error creating appointment:", error);
    res.status(500).json({ message: "Error creating appointment" });
  }
});

// Update an appointment status (admin only)
router.patch("/:id/status", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Check if user is admin
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Forbidden" });
    }

    // Validate status
    if (!["PENDING", "CONFIRMED", "COMPLETED", "CANCELLED"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const appointment = await prisma.appointment.update({
      where: { id: parseInt(id) },
      data: { status },
      include: { service: true },
    });

    res.json(appointment);
  } catch (error) {
    console.error("Error updating appointment status:", error);
    res.status(500).json({ message: "Error updating appointment status" });
  }
});

// Cancel an appointment
router.delete("/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    // Check if the appointment exists and belongs to the user
    const appointment = await prisma.appointment.findUnique({
      where: { id: parseInt(id) },
    });

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    if (appointment.userId !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ message: "Forbidden" });
    }

    // Delete the appointment
    await prisma.appointment.delete({
      where: { id: parseInt(id) },
    });

    res.status(204).send();
  } catch (error) {
    console.error("Error cancelling appointment:", error);
    res.status(500).json({ message: "Error cancelling appointment" });
  }
});

// Get available time slots for a specific date and service
router.get("/time-slots", async (req, res) => {
  try {
    const { date, serviceId } = req.query;

    if (!date || !serviceId) {
      return res
        .status(400)
        .json({ message: "Missing required query parameters" });
    }

    // Get the service to determine duration
    const service = await prisma.service.findUnique({
      where: { id: parseInt(serviceId) },
    });

    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    // Get booked appointments for the date
    const selectedDate = new Date(date);
    const nextDay = new Date(selectedDate);
    nextDay.setDate(nextDay.getDate() + 1);

    const bookedAppointments = await prisma.appointment.findMany({
      where: {
        date: {
          gte: selectedDate,
          lt: nextDay,
        },
        serviceId: parseInt(serviceId),
      },
    });

    // Generate time slots (9am to 5pm, assuming 30-minute intervals)
    const slots = [];
    const startHour = 9; // 9 AM
    const endHour = 17; // 5 PM

    for (let hour = startHour; hour < endHour; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const slotTime = new Date(selectedDate);
        slotTime.setHours(hour, minute, 0, 0);

        // Skip if the slot end time is past closing time
        const slotEndTime = new Date(slotTime);
        slotEndTime.setMinutes(slotEndTime.getMinutes() + service.duration);

        if (slotEndTime.getHours() >= endHour) {
          continue;
        }

        // Check if slot is available
        const isBooked = bookedAppointments.some((appt) => {
          const apptTime = new Date(appt.date);
          return apptTime.getTime() === slotTime.getTime();
        });

        if (!isBooked) {
          slots.push({
            time: slotTime.toISOString(),
            available: true,
          });
        }
      }
    }

    res.json(slots);
  } catch (error) {
    console.error("Error fetching available time slots:", error);
    res.status(500).json({ message: "Error fetching available time slots" });
  }
});

module.exports = router;
