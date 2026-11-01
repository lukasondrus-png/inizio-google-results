
function normalizeOrganicResults(apiData) {
  // Ověříme, zda máme pole organických výsledků.
  const organicResults = Array.isArray(apiData?.organic_results)
    ? apiData.organic_results
    : [];

  return organicResults
    .filter((item) => {
      // Výsledek musí mít platný název.
      if (
        !item ||
        typeof item.title !== "string" ||
        !item.title.trim()
      ) {
        return false;
      }

      // Musí mít platné pořadí.
      if (
        !Number.isInteger(item.position) ||
        item.position < 1
      ) {
        return false;
      }

      // Musí mít běžnou HTTP nebo HTTPS adresu.
      if (typeof item.link !== "string") {
        return false;
      }

      try {
        const url = new URL(item.link);

        return (
          url.protocol === "http:" ||
          url.protocol === "https:"
        );
      } catch {
        return false;
      }
    })
    .map((item) => ({
      position: item.position,
      title: item.title,
      url: item.link,
      description:
        typeof item.snippet === "string"
          ? item.snippet
          : ""
    }));
}

// Zpřístupní funkci ostatním souborům.
module.exports = { normalizeOrganicResults };
