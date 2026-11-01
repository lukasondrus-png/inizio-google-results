
require("dotenv").config();

const express = require("express");
const { rateLimit } = require("express-rate-limit");
const path = require("node:path");
const { normalizeOrganicResults } = require("./searchResults");

const app = express();
const PORT = process.env.PORT || 3000;


const searchLimiter = rateLimit({
  // Časové okno: 15 minut
  windowMs: 15 * 60 * 1000,

  // Maximálně 10 požadavků na IP adresu
  limit: 10,

  // Informace o limitu v HTTP hlavičkách
  standardHeaders: "draft-8",
  legacyHeaders: false,

  // Odpověď při překročení limitu
  message: {
    error: "Příliš mnoho vyhledávání. Zkus to prosím později."
  }
});


// Zpřístupnění HTML stránky
app.use(express.static(path.join(__dirname, "public")));

// Kontrolní endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

// Vyhledávání prostřednictvím SerpApi
app.get("/api/search", searchLimiter, async (req, res) => {
  const keyword =
    typeof req.query.q === "string"
      ? req.query.q.trim()
      : "";

  if (!keyword || keyword.length > 150) {
    return res.status(400).json({
      error: "Zadej hledaný výraz (maximálně 150 znaků)."
    });
  }

  if (!process.env.SERPAPI_KEY) {
    return res.status(500).json({
      error: "Chybí konfigurace API klíče."
    });
  }

  try {
    const url = new URL("https://serpapi.com/search.json");

    url.searchParams.set("engine", "google");
    url.searchParams.set("q", keyword);
    url.searchParams.set("hl", "cs");
    url.searchParams.set("gl", "cz");
    url.searchParams.set("device", "desktop");
    url.searchParams.set("start", "0");
    url.searchParams.set("api_key", process.env.SERPAPI_KEY);

    const response = await fetch(url, {
      signal: AbortSignal.timeout(25000)
    });

    const data = await response.json();

    const noResults =
      data.search_information?.organic_results_state ===
      "Fully empty";

    if (!response.ok || (data.error && !noResults)) {
      throw new Error(data.error || "SerpApi neodpovědělo správně.");
    }

    const results = normalizeOrganicResults(data);

    res.json({
      keyword,
      results
    });

  } catch (error) {
    console.error("Chyba SerpApi:", error.message);

    res.status(502).json({
      error: "Nepodařilo se získat výsledky vyhledávání."
    });
  }
});

// Spuštění serveru
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server běží na portu ${PORT}`);
});

