"use client";

import { useMemo, useState } from "react";

type EvModel = {
  name: string;
  short: string;
  trim: string;
  priceOtr: number;
  rangeWltpKm: number;
  consumptionKwhPer100Km: number;
  batteryKwh: number;
  powerKw: number;
  bootLitres: number;
  bootSeatsDownLitres?: number;
  zeroTo100Sec: number;
  dcChargeMin10to80: number;
  lengthMm: number;
  tax: number;
  insurance: [number, number];
  maintenance: [number, number];
  image?: string;
  configUrl: string;
  highlights: string[];
};

const evModels: EvModel[] = [
  {
    name: "Volvo EX30 Single Motor Extended Range",
    short: "Volvo EX30",
    trim: "Single Motor Extended Range · 69 kWh",
    priceOtr: 36990,
    rangeWltpKm: 476,
    consumptionKwhPer100Km: 17.5,
    batteryKwh: 69,
    powerKw: 200,
    bootLitres: 325,
    bootSeatsDownLitres: 904,
    zeroTo100Sec: 5.3,
    dcChargeMin10to80: 28,
    lengthMm: 4233,
    tax: 120,
    insurance: [650, 850],
    maintenance: [400, 700],
    image: "/car-comparison-site/volvo-ex30.jpg",
    configUrl: "https://www.volvocars.com/ie/cars/ex30-electric/",
    highlights: [
      "Most affordable long-range pick in this trio",
      "Premium Volvo safety branding and minimalist cabin",
      "Smallest footprint — easiest to park",
    ],
  },
  {
    name: "Škoda Elroq Selection 85",
    short: "Škoda Elroq",
    trim: "Selection 85 · 82 kWh",
    priceOtr: 42315,
    rangeWltpKm: 573,
    consumptionKwhPer100Km: 15.4,
    batteryKwh: 82,
    powerKw: 210,
    bootLitres: 470,
    bootSeatsDownLitres: 1580,
    zeroTo100Sec: 6.4,
    dcChargeMin10to80: 29,
    lengthMm: 4488,
    tax: 120,
    insurance: [600, 800],
    maintenance: [400, 750],
    image: "/car-comparison-site/skoda-elroq.jpg",
    configUrl: "https://www.skoda.ie/new-cars/elroq",
    highlights: [
      "Longest WLTP range in this comparison",
      "Strong value for boot space and equipment",
      "V2L-ready with a 21-litre frunk",
    ],
  },
  {
    name: "Volkswagen ID.4 Pro 77 kWh",
    short: "VW ID.4",
    trim: "Pro · 77 kWh",
    priceOtr: 39030,
    rangeWltpKm: 566,
    consumptionKwhPer100Km: 16.5,
    batteryKwh: 77,
    powerKw: 210,
    bootLitres: 543,
    bootSeatsDownLitres: 1575,
    zeroTo100Sec: 6.5,
    dcChargeMin10to80: 28,
    lengthMm: 4584,
    tax: 120,
    insurance: [650, 850],
    maintenance: [450, 800],
    image: "/car-comparison-site/vw-id4.jpg",
    configUrl: "https://www.volkswagen.ie/en/new-cars/ID4.html",
    highlights: [
      "Largest cabin and boot — best for family trips",
      "Most familiar family-SUV driving position",
      "Competitive price with strong dealer network",
    ],
  },
];

const euro = (amount: number) =>
  new Intl.NumberFormat("en-IE", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(amount);

const km = (value: number) =>
  new Intl.NumberFormat("en-IE", { maximumFractionDigits: 0 }).format(value);

type SpecRow = {
  label: string;
  values: (string | number)[];
  bestIndex?: number;
  lowerIsBetter?: boolean;
};

function bestIndex(values: number[], lowerIsBetter = true): number {
  const target = lowerIsBetter ? Math.min(...values) : Math.max(...values);
  return values.indexOf(target);
}

export default function Home() {
  const [annualKm, setAnnualKm] = useState(12000);
  const [homeRate, setHomeRate] = useState(0.25);

  const rows = useMemo(
    () =>
      evModels.map((model) => {
        const energyCost = (annualKm / 100) * model.consumptionKwhPer100Km * homeRate;
        const insurance = (model.insurance[0] + model.insurance[1]) / 2;
        const maintenance = (model.maintenance[0] + model.maintenance[1]) / 2;
        const totalWithoutMaintenance = energyCost + insurance + model.tax;
        return {
          ...model,
          energyCost,
          insurance,
          maintenance,
          totalWithoutMaintenance,
          total: totalWithoutMaintenance + maintenance,
        };
      }),
    [annualKm, homeRate],
  );

  const lowestPrice = [...rows].sort((a, b) => a.priceOtr - b.priceOtr)[0];
  const longestRange = [...rows].sort((a, b) => b.rangeWltpKm - a.rangeWltpKm)[0];
  const mostBoot = [...rows].sort((a, b) => b.bootLitres - a.bootLitres)[0];
  const lowestRunningCost = [...rows].sort((a, b) => a.total - b.total)[0];

  const specRows: SpecRow[] = [
    {
      label: "On-the-road price",
      values: rows.map((r) => r.priceOtr),
      bestIndex: bestIndex(rows.map((r) => r.priceOtr)),
      lowerIsBetter: true,
    },
    {
      label: "WLTP range",
      values: rows.map((r) => `${km(r.rangeWltpKm)} km`),
      bestIndex: bestIndex(rows.map((r) => r.rangeWltpKm), false),
    },
    {
      label: "Battery",
      values: rows.map((r) => `${r.batteryKwh} kWh`),
    },
    {
      label: "Consumption",
      values: rows.map((r) => `${r.consumptionKwhPer100Km.toFixed(1)} kWh / 100 km`),
      bestIndex: bestIndex(rows.map((r) => r.consumptionKwhPer100Km)),
    },
    {
      label: "Power",
      values: rows.map((r) => `${r.powerKw} kW`),
      bestIndex: bestIndex(rows.map((r) => r.powerKw), false),
    },
    {
      label: "0–100 km/h",
      values: rows.map((r) => `${r.zeroTo100Sec.toFixed(1)} s`),
      bestIndex: bestIndex(rows.map((r) => r.zeroTo100Sec)),
    },
    {
      label: "Boot",
      values: rows.map((r) => `${r.bootLitres} L`),
      bestIndex: bestIndex(rows.map((r) => r.bootLitres), false),
    },
    {
      label: "Boot (seats down)",
      values: rows.map((r) => (r.bootSeatsDownLitres ? `${r.bootSeatsDownLitres} L` : "—")),
      bestIndex: bestIndex(rows.map((r) => r.bootSeatsDownLitres ?? 0), false),
    },
    {
      label: "DC fast charge 10–80%",
      values: rows.map((r) => `${r.dcChargeMin10to80} min`),
      bestIndex: bestIndex(rows.map((r) => r.dcChargeMin10to80)),
    },
    {
      label: "Length",
      values: rows.map((r) => `${(r.lengthMm / 1000).toFixed(2)} m`),
      bestIndex: bestIndex(rows.map((r) => r.lengthMm)),
    },
  ];

  const costRows: SpecRow[] = [
    {
      label: "Energy (home charging)",
      values: rows.map((r) => r.energyCost),
      bestIndex: bestIndex(rows.map((r) => r.energyCost)),
    },
    {
      label: "Motor tax",
      values: rows.map((r) => r.tax),
    },
    {
      label: "Insurance (est.)",
      values: rows.map((r) => r.insurance),
      bestIndex: bestIndex(rows.map((r) => r.insurance)),
    },
    {
      label: "Maintenance reserve",
      values: rows.map((r) => r.maintenance),
      bestIndex: bestIndex(rows.map((r) => r.maintenance)),
    },
    {
      label: "Annual total",
      values: rows.map((r) => r.total),
      bestIndex: bestIndex(rows.map((r) => r.total)),
    },
  ];

  const formatCostCell = (value: string | number) =>
    typeof value === "number" ? euro(value) : value;

  return (
    <main>
      <section className="hero">
        <div className="eyebrow">Family EV shortlist</div>
        <h1>
          Compare three <em>family EVs</em>
        </h1>
        <p className="lede">
          Volvo EX30, Škoda Elroq and Volkswagen ID.4 — comparable long-range trims with Irish guide
          prices, specs and annual running costs.
        </p>
        <div className="assumption-bar">
          <label>
            Annual driving
            <input
              type="number"
              min="1000"
              step="1000"
              value={annualKm}
              onChange={(event) => setAnnualKm(Number(event.target.value) || 0)}
            />{" "}
            km
          </label>
          <label>
            Home electricity
            <input
              type="number"
              min="0.05"
              max="1"
              step="0.01"
              value={homeRate}
              onChange={(event) => setHomeRate(Number(event.target.value) || 0)}
            />{" "}
            €/kWh
          </label>
          <span>
            Irish on-the-road prices include SEAI grant and VRT relief where applicable. Insurance is an
            estimate — confirm with your broker.
          </span>
        </div>
      </section>

      <section className="top-picks" aria-label="Quick read">
        <article>
          <span>Lowest upfront price</span>
          <strong>{lowestPrice.short}</strong>
          <p>{euro(lowestPrice.priceOtr)} on the road after grants.</p>
        </article>
        <article>
          <span>Longest range</span>
          <strong>{longestRange.short}</strong>
          <p>{km(longestRange.rangeWltpKm)} km WLTP on the {longestRange.trim.split("·")[0].trim()} trim.</p>
        </article>
        <article>
          <span>Most boot space</span>
          <strong>{mostBoot.short}</strong>
          <p>{mostBoot.bootLitres} litres with seats up — best for family gear.</p>
        </article>
      </section>

      <section className="comparison">
        <div className="section-heading">
          <div>
            <div className="eyebrow">Specifications</div>
            <h2>How they compare</h2>
          </div>
          <p>
            Comparable long-range trims as of August 2026. Guide prices and WLTP ranges — confirm with
            dealers before ordering.
          </p>
        </div>
        <div className="table-wrap">
          <table className="spec-table">
            <thead>
              <tr>
                <th>Spec</th>
                {rows.map((model) => (
                  <th key={model.name}>{model.short}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <th scope="row">Trim</th>
                {rows.map((model) => (
                  <td key={model.name}>{model.trim}</td>
                ))}
              </tr>
              {specRows.map((row) => (
                <tr key={row.label}>
                  <th scope="row">{row.label}</th>
                  {row.values.map((value, index) => (
                    <td key={rows[index].name} className={row.bestIndex === index ? "best-in-row" : ""}>
                      {typeof value === "number" ? euro(value) : value}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="comparison">
        <div className="section-heading">
          <div>
            <div className="eyebrow">Annual running costs</div>
            <h2>The yearly picture</h2>
          </div>
          <p>
            Home charging at €{homeRate.toFixed(2)}/kWh, €120 BEV motor tax, estimated insurance and a
            maintenance reserve. Excludes finance, depreciation and public charging.
          </p>
        </div>
        <p className="cost-callout">
          Lowest annual running cost today: <strong>{lowestRunningCost.short}</strong> at{" "}
          {euro(lowestRunningCost.total)} per year.
        </p>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Cost</th>
                {rows.map((model) => (
                  <th key={model.name}>{model.short}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {costRows.map((row) => (
                <tr key={row.label}>
                  <th scope="row">{row.label}</th>
                  {row.values.map((value, index) => (
                    <td
                      key={rows[index].name}
                      className={`${row.bestIndex === index ? "best-in-row" : ""}${row.label === "Annual total" ? " total" : ""}`}
                    >
                      {formatCostCell(value)}
                      {row.label === "Energy (home charging)" && (
                        <small>{rows[index].consumptionKwhPer100Km.toFixed(1)} kWh / 100 km</small>
                      )}
                      {row.label === "Maintenance reserve" && <small>Estimated reserve</small>}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="listings" aria-labelledby="model-heading">
        <div className="section-heading">
          <div>
            <div className="eyebrow">Explore further</div>
            <h2 id="model-heading">The three models</h2>
          </div>
          <p>Key differentiators and links to each manufacturer&apos;s Irish configurator.</p>
        </div>
        <div className="listing-grid">
          {rows.map((model) => (
            <article className="listing-card" key={model.name}>
              {model.image && (
                <a className="listing-image-link" href={model.configUrl} target="_blank" rel="noreferrer">
                  <img src={model.image} alt={`${model.short} — ${model.trim}`} loading="lazy" />
                </a>
              )}
              <span className="listing-copy">
                <span>
                  <span className="car-year">{model.trim}</span>
                  <strong>{model.short}</strong>
                  <small>{euro(model.priceOtr)} on the road · {km(model.rangeWltpKm)} km WLTP</small>
                  <ul className="highlights">
                    {model.highlights.map((highlight) => (
                      <li key={highlight}>{highlight}</li>
                    ))}
                  </ul>
                </span>
                <span className="ad-links">
                  <a className="ad-link" href={model.configUrl} target="_blank" rel="noreferrer">
                    Configure <span aria-hidden="true">↗</span>
                  </a>
                </span>
              </span>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
