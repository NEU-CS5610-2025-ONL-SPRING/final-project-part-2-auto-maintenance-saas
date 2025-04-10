const express = require("express");
const router = express.Router();
const axios = require("axios");

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

module.exports = router;
