const express = require("express");
const axios = require("axios");
const router = express.Router();

// GET /api/market-data/:symbol?limit=10&interval=day
// Fetches historical price data from CryptoCompare
router.get("/:symbol", async (req, res) => {
  try {
    const { symbol } = req.params;
    const { limit = 10, interval = "day" } = req.query;
    const apiKey = process.env.CRYPTOCOMPARE_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: "CRYPTOCOMPARE_API_KEY not set" });
    }

    const url = `https://min-api.cryptocompare.com/data/v2/histo${interval}?fsym=${symbol.toUpperCase()}&tsym=USD&limit=${limit - 1}&api_key=${apiKey}`;
    const { data } = await axios.get(url);
    if (data.Response === "Error") {
      return res.status(500).json({ error: data.Message || "CryptoCompare error" });
    }
    // Return closes only for simplicity
    const prices = data.Data.Data.map((d) => ({
      time: d.time,
      close: d.close,
    }));
    return res.json({ prices });
  } catch (err) {
    console.error("Market data fetch failed", err.message);
    return res.status(500).json({ error: "Failed to fetch market data" });
  }
});

module.exports = router;
