import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";


async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request("http://localhost/", {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

test("server-renders the car comparison", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<title>The Family Car Cost Comparison<\/title>/i);
  assert.match(html, /New car comparison/);
  assert.match(html, /Volkswagen Polo/);
  assert.match(html, /BMW X3/);
  assert.match(html, /Audi Q5/);
  assert.match(html, /Volvo XC60/);
  assert.match(html, /Annual driving/);
  assert.match(html, /more|less/);
});

test("keeps the desired comparison scope", async () => {
  const [page, packageJson] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../package.json", import.meta.url), "utf8"),
  ]);

  assert.match(packageJson, /"name": "car-comparison-site"/);
  assert.match(page, /const \[annualKm, setAnnualKm\]/);
  assert.match(page, /more/);
  assert.match(page, /less/);
  assert.doesNotMatch(page, /maintenance reserve|buying advice|how-to/i);
});
