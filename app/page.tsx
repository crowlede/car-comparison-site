"use client";

import { useMemo, useState } from "react";

type Car = {
  name: string;
  short: string;
  year: string;
  price: number;
  mileage: string;
  tax: number;
  insurance: [number, number];
  economy: number;
  fuel: "Petrol" | "Diesel";
  baseline?: boolean;
};

const cars: Car[] = [
  {
    name: "Volkswagen Polo 1.2",
    short: "Your current car",
    year: "2008",
    price: 0,
    mileage: "Current car",
    tax: 330,
    insurance: [523, 523],
    economy: 6.5,
    fuel: "Petrol",
    baseline: true,
  },
  {
    name: "BMW X3 xDrive20d auto",
    short: "BMW X3",
    year: "2014",
    price: 9400,
    mileage: "264,500 km",
    tax: 280,
    insurance: [600, 750],
    economy: 6.7,
    fuel: "Diesel",
  },
  {
    name: "Audi Q5 2.0 TDI",
    short: "Audi Q5",
    year: "2013",
    price: 9950,
    mileage: "277,338 km",
    tax: 280,
    insurance: [550, 700],
    economy: 6.3,
    fuel: "Diesel",
  },
  {
    name: "Volvo XC60 2.0D",
    short: "Volvo XC60",
    year: "2015",
    price: 8950,
    mileage: "333,000 km",
    tax: 200,
    insurance: [500, 650],
    economy: 6.4,
    fuel: "Diesel",
  },
];

const euro = (amount: number) =>
  new Intl.NumberFormat("en-IE", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(amount);

export default function Home() {
  const [annualKm, setAnnualKm] = useState(12000);

  const rows = useMemo(() => cars.map((car) => {
    const fuelPrice = car.fuel === "Diesel" ? 1.72 : 1.76;
    const fuelCost = (annualKm / 100) * car.economy * fuelPrice;
    const insurance = (car.insurance[0] + car.insurance[1]) / 2;
    return { ...car, fuelCost, insurance, total: fuelCost + insurance + car.tax };
  }), [annualKm]);
  const current = rows[0];
  const candidates = rows.slice(1);
  const leastExtra = [...candidates].sort((a, b) => a.total - b.total)[0];
  const lowestMileage = candidates.reduce((lowest, car) => Number(car.mileage.replace(/[^0-9]/g, "")) < Number(lowest.mileage.replace(/[^0-9]/g, "")) ? car : lowest);
  const middleChoice = candidates.find((car) => car.short === "Audi Q5") ?? candidates[0];
  const costDifference = (car: (typeof rows)[number]) =>
    car.total >= current.total
      ? `${euro(car.total - current.total)} more`
      : `${euro(current.total - car.total)} less`;

  return (
    <main>
      <section className="hero">
        <div className="eyebrow">Shortlist builder</div>
        <h1>New car comparison</h1>
        <p className="lede">Compare each car you find with your current Volkswagen Polo. Add more listings whenever you want to grow the shortlist.</p>
        <div className="assumption-bar">
          <label>
            Annual driving
            <input type="number" min="1000" step="1000" value={annualKm} onChange={(event) => setAnnualKm(Number(event.target.value) || 0)} /> km
          </label>
          <span>Fuel assumptions: petrol €1.76/L · diesel €1.72/L · Insurance is an estimate based on your current Zurich policy.</span>
        </div>
      </section>

      <section className="top-picks" aria-label="Quick read">
        <article><span>Least extra to run</span><strong>{leastExtra.short}</strong><p>{costDifference(leastExtra)} a year versus the Polo.</p></article>
        <article><span>Lowest mileage</span><strong>{lowestMileage.short}</strong><p>{lowestMileage.mileage} on the ad.</p></article>
        <article><span>Middle-ground choice</span><strong>{middleChoice.short}</strong><p>A balanced pick from the current shortlist.</p></article>
      </section>

      <section className="comparison">
        <div className="section-heading"><div><div className="eyebrow">Annual running costs</div><h2>The yearly picture</h2></div><p>Fuel, annual motor tax and estimated insurance. Excludes finance, parking, depreciation and repairs.</p></div>
        <div className="table-wrap">
          <table>
            <thead><tr><th>Car</th><th>Fuel</th><th>Tax</th><th>Insurance</th><th>Annual total</th><th>vs Polo</th></tr></thead>
            <tbody>{rows.map((car) => <tr key={car.name} className={car.baseline ? "baseline" : ""}>
              <th scope="row"><span className="car-year">{car.year}</span>{car.short}<small>{car.mileage}</small></th>
              <td>{euro(car.fuelCost)}<small>{car.economy.toFixed(1)} L / 100 km</small></td>
              <td>{euro(car.tax)}</td>
              <td>{car.insurance[0] === car.insurance[1] ? euro(car.insurance) : `${euro(car.insurance[0])}–${euro(car.insurance[1])}`}</td>
              <td className="total">{euro(car.total)}</td>
              <td className={car.baseline ? "muted" : "difference"}>{car.baseline ? "Benchmark" : costDifference(car)}</td>
            </tr>)}</tbody>
          </table>
        </div>
      </section>

    </main>
  );
}
