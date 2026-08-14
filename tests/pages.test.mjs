import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("builds a GitHub Pages entry point with scoped assets", async () => {
  const html = await readFile(new URL("../dist/index.html", import.meta.url), "utf8");

  assert.match(html, /<title>New Car Comparison<\/title>/);
  assert.match(html, /\/car-comparison-site\/assets\//);
});

test("preserves the requested comparison experience", async () => {
  const page = await readFile(new URL("../app/page.tsx", import.meta.url), "utf8");

  for (const text of [
    "Volkswagen Polo",
    "BMW X3",
    "Annual driving",
    "Fuel",
    "Tax",
    "Insurance",
    "Maintenance",
    "Estimated reserve",
    "Mileage",
    "vs Polo excl. maintenance",
    "Original listings",
    "Open ad",
    "more",
    "less",
  ]) {
    assert.match(page, new RegExp(text));
  }
  assert.match(page, /maintenance: \[650, 1050\]/);
  assert.match(page, /maintenance: \[1300, 2300\]/);
  assert.match(page, /totalWithoutMaintenance/);
  assert.match(page, /costDifference\(car\.totalWithoutMaintenance, current\.totalWithoutMaintenance\)/);
  assert.match(page, /carzone\.ie\/used-cars\/bmw\/x3\/fpa\/4502188/);
  assert.match(page, /marks convenience only, not a recommendation/);
  assert.doesNotMatch(page, /buying advice|how-to/i);
});
