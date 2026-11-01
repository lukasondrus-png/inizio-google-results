
# Google Organic Results

Jednoduchá webová aplikace pro získávání organických výsledků
z první stránky vyhledávání Google.

Projekt vznikl jako řešení technického zadání společnosti Inizio.

## Funkce aplikace

- Zadání klíčového slovního spojení.
- Získání výsledků vyhledávání pomocí SerpApi.
- Zpracování pouze organických (neplacených) výsledků.
- Zobrazení názvu, URL, popisu a pořadí výsledků.
- Export získaných výsledků do souboru JSON.
- Validace vstupních dat a ošetření chyb.
- Automatické unit testy zpracování dat.

Vyhledávání je nastaveno pro český jazyk, Českou republiku
a desktopové zařízení.

## Použité technologie

- Node.js – backend aplikace
- Express – HTTP server a API endpointy
- HTML, CSS, JavaScript – uživatelské rozhraní
- SerpApi – získávání výsledků Google Search
- Vitest – automatické unit testování
- dotenv – správa proměnných prostředí

## Požadavky

Pro lokální spuštění je potřeba:

- Node.js 24 LTS
- npm
- SerpApi účet s platným API klíčem

Registrace SerpApi:
https://serpapi.com/

## Instalace

1. Stáhněte nebo naklonujte projekt.
2. Otevřete terminál v kořenovém adresáři projektu.
3. Nainstalujte závislosti:

```bash
npm install
```

## Konfigurace API klíče

V kořenovém adresáři vytvořte soubor `.env`:

```env
SERPAPI_KEY=vas_serpapi_klic
```

Hodnotu nahraďte vlastním API klíčem.

Soubor `.env` není součástí repozitáře,
protože obsahuje citlivé přístupové údaje.

## Spuštění aplikace

V terminálu zadejte:

```bash
npm start
```

Aplikace bude dostupná na adrese:

http://localhost:3000

## Použití

1. Otevřete aplikaci v prohlížeči.
2. Zadejte klíčové slovní spojení.
3. Klikněte na tlačítko "Vyhledat".
4. Počkejte na načtení výsledků.
5. Pro stažení dat klikněte na "Stáhnout JSON".

## API endpointy

### GET /api/health

Kontrolní endpoint pro ověření dostupnosti serveru.

Příklad odpovědi:

```json
{
  "status": "ok"
}
```

### GET /api/search?q=keyword

Získá organické výsledky Googlu pro zadaný výraz.

Příklad:

```text
http://localhost:3000/api/search?q=nejlepsi+kavovary
```

Odpověď obsahuje hledaný výraz a pole výsledků.

## Výstupní formát

Výsledky jsou exportovány do souboru JSON.

Příklad struktury (ilustrační data):

```json
{
  "keyword": "nejlepsi kavovary",
  "results": [
    {
      "position": 1,
      "title": "Ukázkový výsledek",
      "url": "https://example.com",
      "description": "Ukázkový popis výsledku."
    }
  ]
}
```

## Unit testy

Testy používají framework Vitest.

Spuštění:

```bash
npm test
```

Testy kontrolují zejména:

- Správnou strukturu výstupních dat.
- Zpracování pouze organických výsledků.
- Vynechávání neúplných nebo neplatných záznamů.
- Chování při chybějícím popisu.
- Chování při prázdných výsledcích.
- Zpracování neplatného vstupu.
- Validaci URL a pořadí výsledků.

Testy používají připravená vstupní data a nevolají
skutečné SerpApi. Nespotřebovávají tedy API limit.

## Struktura projektu

```text
inizio-google-results/
├── public/
│   └── index.html
├── tests/
│   └── searchResults.test.mjs
├── server.js
├── searchResults.js
├── package.json
├── package-lock.json
├── .gitignore
└── README.md
```

Soubor `.env` se vytváří lokálně a není verzován.

## Technické řešení

Frontend komunikuje s Node.js backendem prostřednictvím
HTTP požadavků.

Backend používá SerpApi pro získání výsledků
vyhledávání Google.

Z odpovědi API se zpracovává pouze pole
`organic_results`, které obsahuje organické výsledky.

Funkce `normalizeOrganicResults()` provádí validaci
a převod výsledků do jednotného formátu.

Frontend následně výsledky zobrazí a umožní jejich
stažení jako JSON soubor.

## Omezení počtu požadavků

Aplikace používá knihovnu `express-rate-limit`.

Endpoint `/api/search` je omezen na maximálně
10 požadavků z jedné IP adresy během 15 minut.

Při překročení limitu server vrací HTTP status 429
a JSON chybovou zprávu.

Omezení je implementováno pomocí paměťového úložiště.
Po restartu serveru se počítadla resetují.

Tato ochrana nenahrazuje měsíční limit
nebo správu kvóty poskytovatele SerpApi.

## Omezení

- Aplikace závisí na dostupnosti SerpApi.
- Počet vyhledávání je omezen tarifem poskytovatele.
- Výsledky se mohou lišit podle lokality a času.
- Aplikace zpracovává organické výsledky první stránky.
- Unit testy ověřují zpracování dat, nikoli živé
  vyhledávání nebo kompletní uživatelské rozhraní.
