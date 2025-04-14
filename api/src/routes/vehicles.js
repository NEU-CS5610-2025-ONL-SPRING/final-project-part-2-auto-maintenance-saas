import express from "express";
import axios from "axios";
import { commonMakes, commonModels } from "../data/commonVehicles.js";

const router = express.Router();

// Get common vehicle makes (curated list)
router.get("/common-makes", async (req, res) => {
  try {
    res.json(commonMakes);
  } catch (error) {
    console.error("Error fetching common vehicle makes:", error);
    res.status(500).json({ message: "Error fetching common vehicle makes" });
  }
});

// Get common models for a specific make (curated list)
router.get("/common-models/:make", async (req, res) => {
  try {
    const { make } = req.params;
    if (commonModels[make]) {
      res.json(commonModels[make]);
    } else {
      res.json([]);
    }
  } catch (error) {
    console.error("Error fetching common vehicle models:", error);
    res.status(500).json({ message: "Error fetching common vehicle models" });
  }
});

// Get vehicle makes
router.get("/makes", async (req, res) => {
  try {
    const response = await axios.get(
      "https://vpic.nhtsa.dot.gov/api/vehicles/getallmakes?format=json"
    );
    res.json(response.data.Results);
  } catch (error) {
    console.error("Error fetching vehicle makes:", error);
    res.status(500).json({ message: "Error fetching vehicle makes" });
  }
});

// Get models for a specific make
router.get("/models/:make", async (req, res) => {
  try {
    const { make } = req.params;
    const response = await axios.get(
      `https://vpic.nhtsa.dot.gov/api/vehicles/getmodelsformake/${make}?format=json`
    );
    res.json(response.data.Results);
  } catch (error) {
    console.error("Error fetching vehicle models:", error);
    res.status(500).json({ message: "Error fetching vehicle models" });
  }
});

// Get vehicle details by VIN
router.get("/vin/:vin", async (req, res) => {
  try {
    const { vin } = req.params;
    const response = await axios.get(
      `https://vpic.nhtsa.dot.gov/api/vehicles/decodevin/${vin}?format=json`
    );
    res.json(response.data.Results);
  } catch (error) {
    console.error("Error fetching vehicle by VIN:", error);
    res.status(500).json({ message: "Error fetching vehicle by VIN" });
  }
});

export default router;
