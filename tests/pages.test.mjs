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
    "Audi Q5",
    "Volvo XC60",
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
  assert.match(page, /maintenance: \[1200, 2100\]/);
  assert.match(page, /maintenance: \[1400, 2500\]/);
  assert.match(page, /totalWithoutMaintenance/);
  assert.match(page, /costDifference\(car\.totalWithoutMaintenance, current\.totalWithoutMaintenance\)/);
  assert.match(page, /carzone\.ie\/used-cars\/bmw\/x3\/fpa\/4502188/);
  assert.match(page, /carzone\.ie\/used-cars\/audi\/q5\/fpa\/4501126/);
  assert.match(page, /carzone\.ie\/used-cars\/volvo\/xc60\/fpa\/4450220/);
  assert.match(page, /donedeal\.ie\/cars-for-sale\/volvo-xc60-new-nct-full-leather-serviced-\/42321876/);
  assert.match(page, /donedeal\.ie\/cars-for-sale\/2014-volvo-xc60-2-0l-diesel-new-nct-06-2027\/42404123/);
  assert.match(page, /donedeal\.ie\/cars-for-sale\/2012-volvo-xc60-d3-lux-automatic-new-nct\/42564899/);
  assert.match(page, /donedeal\.ie\/cars-for-sale\/volvo-xc60-2010-full-service-history\/41196023/);
  assert.match(page, /donedeal\.ie\/cars-for-sale\/2014-volvo-xc60\/42407355/);
  assert.doesNotMatch(page, /buying advice|how-to/i);
});
