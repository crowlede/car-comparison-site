import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("builds a GitHub Pages entry point with scoped assets", async () => {
  const html = await readFile(new URL("../dist/index.html", import.meta.url), "utf8");

  assert.match(html, /<title>Family EV Comparison<\/title>/);
  assert.match(html, /\/car-comparison-site\/assets\//);
});

test("preserves the EV comparison experience", async () => {
  const page = await readFile(new URL("../app/page.tsx", import.meta.url), "utf8");

  for (const text of [
    "Volvo EX30",
    "Škoda Elroq",
    "VW ID.4",
    "Annual driving",
    "Home electricity",
    "kWh / 100 km",
    "Motor tax",
    "Insurance \\(est\\.\\)",
    "Maintenance reserve",
    "WLTP range",
    "Configure",
    "best-in-row",
    "consumptionKwhPer100Km",
    "energyCost",
  ]) {
    assert.match(page, new RegExp(text));
  }

  assert.match(page, /tax: 120/);
  assert.match(page, /volvocars\.com\/ie\/cars\/ex30-electric/);
  assert.match(page, /skoda\.ie\/new-cars\/elroq/);
  assert.match(page, /volkswagen\.ie\/en\/new-cars\/ID4\.html/);
  assert.doesNotMatch(page, /Volkswagen Polo|BMW X3|carzone\.ie|vs Polo/i);
  assert.doesNotMatch(page, /buying advice|how-to/i);
});
