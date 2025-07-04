const express = require("express");
const axios = require("axios");
const router = express.Router();

// GET /api/news?query=bitcoin&pageSize=10
router.get("/", async (req, res) => {
  try {
    const { query = "crypto", pageSize = 10 } = req.query;
    const apiKey = process.env.NEWSAPI_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: "NEWSAPI_KEY not set" });
    }

    const url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(
      query
    )}&pageSize=${pageSize}&sortBy=publishedAt&language=en&apiKey=${apiKey}`;

    const { data } = await axios.get(url);
    return res.json({ articles: data.articles || [] });
  } catch (err) {
    console.error("News fetch failed", err.message);
    return res.status(500).json({ error: "Failed to fetch news" });
  }
});

module.exports = router;
