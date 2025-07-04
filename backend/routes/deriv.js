const express = require("express");
const { createDerivClient } = require("../services/derivClient");
const router = express.Router();

// GET /api/deriv/balance
router.get("/balance", async (req, res) => {
  try {
    const client = createDerivClient();
    const balance = await client.getBalance();
    return res.json(balance);
  } catch (err) {
    console.error("Deriv balance fetch failed", err.message);
    return res.status(500).json({ error: err.message || "Deriv error" });
  }
});

module.exports = router;
