
import { describe, it, expect } from "vitest";
import searchResultsModule from "../searchResults.js";

const { normalizeOrganicResults } = searchResultsModule;

describe("Zpracování organických výsledků", () => {

  it("správně převede výsledek do požadovaného formátu", () => {
    const apiResponse = {
      organic_results: [
        {
          position: 1,
          title: "Testovací stránka",
          link: "https://example.com",
          snippet: "Popis stránky"
        }
      ]
    };

    const results = normalizeOrganicResults(apiResponse);

    expect(results).toEqual([
      {
        position: 1,
        title: "Testovací stránka",
        url: "https://example.com",
        description: "Popis stránky"
      }
    ]);
  });

  it("nezahrne placené reklamy", () => {
    const apiResponse = {
      organic_results: [
        {
          position: 1,
          title: "Organický výsledek",
          link: "https://example.com"
        }
      ],
      ads: [
        {
          title: "Placená reklama",
          link: "https://ads.example.com"
        }
      ]
    };

    const results = normalizeOrganicResults(apiResponse);

    expect(results).toHaveLength(1);
    expect(results[0].title).toBe("Organický výsledek");
  });

  it("vynechá výsledky bez názvu nebo odkazu", () => {
    const apiResponse = {
      organic_results: [
        {
          position: 1,
          title: "",
          link: "https://example.com"
        },
        {
          position: 2,
          title: "Chybí odkaz"
        },
        {
          position: 3,
          title: "Platný výsledek",
          link: "https://example.org"
        }
      ]
    };

    const results = normalizeOrganicResults(apiResponse);

    expect(results).toHaveLength(1);
    expect(results[0].position).toBe(3);
  });

  it("doplní prázdný popis, pokud chybí", () => {
    const apiResponse = {
      organic_results: [
        {
          position: 1,
          title: "Stránka bez popisu",
          link: "https://example.com"
        }
      ]
    };

    const results = normalizeOrganicResults(apiResponse);

    expect(results[0].description).toBe("");
  });

  it("vrátí prázdné pole při nulových výsledcích", () => {
    const results = normalizeOrganicResults({
      organic_results: []
    });

    expect(results).toEqual([]);
  });

  it("zvládne chybějící nebo neplatná data", () => {
    expect(normalizeOrganicResults({})).toEqual([]);
    expect(normalizeOrganicResults(null)).toEqual([]);
    expect(normalizeOrganicResults({
      organic_results: "neplatná data"
    })).toEqual([]);
  });

  it("odmítne neplatné URL a pořadí", () => {
    const results = normalizeOrganicResults({
      organic_results: [
        {
          position: 0,
          title: "Chybné pořadí",
          link: "https://example.com"
        },
        {
          position: 2,
          title: "Nebezpečné URL",
          link: "javascript:alert(1)"
        }
      ]
    });

    expect(results).toEqual([]);
  });

});
