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
    "more",
    "less",
  ]) {
    assert.match(page, new RegExp(text));
  }
  assert.doesNotMatch(page, /maintenance reserve|buying advice|how-to/i);
});
