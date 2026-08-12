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
  maintenance: [number, number];
  adUrl?: string;
  image?: string;
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
    maintenance: [650, 1050],
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
    maintenance: [1300, 2300],
    adUrl: "https://www.carzone.ie/used-cars/bmw/x3/fpa/4502188",
    image: "/car-comparison-site/bmw-x3.jpg",
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
    maintenance: [1200, 2100],
    adUrl: "https://www.carzone.ie/used-cars/audi/q5/fpa/4501126",
    image: "/car-comparison-site/audi-q5.jpg",
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
    maintenance: [1400, 2500],
    adUrl: "https://www.carzone.ie/used-cars/volvo/xc60/fpa/4450220",
    image: "/car-comparison-site/volvo-xc60.jpg",
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
    const maintenance = (car.maintenance[0] + car.maintenance[1]) / 2;
    const totalWithoutMaintenance = fuelCost + insurance + car.tax;
    return { ...car, fuelCost, insurance, maintenance, totalWithoutMaintenance, total: totalWithoutMaintenance + maintenance };
  }), [annualKm]);
  const current = rows[0];
  const candidates = rows.slice(1);
  const leastExtra = [...candidates].sort((a, b) => a.total - b.total)[0];
  const lowestMileage = candidates.reduce((lowest, car) => Number(car.mileage.replace(/[^0-9]/g, "")) < Number(lowest.mileage.replace(/[^0-9]/g, "")) ? car : lowest);
  const middleChoice = candidates.find((car) => car.short === "Audi Q5") ?? candidates[0];
  const costDifference = (amount: number, poloAmount: number) =>
    amount >= poloAmount
      ? `${euro(amount - poloAmount)} more`
      : `${euro(poloAmount - amount)} less`;

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
        <article><span>Least extra to run</span><strong>{leastExtra.short}</strong><p>{costDifference(leastExtra.total, current.total)} a year versus the Polo.</p></article>
        <article><span>Lowest mileage</span><strong>{lowestMileage.short}</strong><p>{lowestMileage.mileage} on the ad.</p></article>
        <article><span>Middle-ground choice</span><strong>{middleChoice.short}</strong><p>A balanced pick from the current shortlist.</p></article>
      </section>

      <section className="comparison">
        <div className="section-heading"><div><div className="eyebrow">Annual running costs</div><h2>The yearly picture</h2></div><p>Fuel, annual motor tax, estimated insurance and a maintenance reserve. Excludes finance, parking and depreciation.</p></div>
        <div className="table-wrap">
          <table>
            <thead><tr><th>Car</th><th>Mileage</th><th>Fuel</th><th>Tax</th><th>Insurance</th><th>Maintenance</th><th>Annual total</th><th>vs Polo</th><th>vs Polo excl. maintenance</th></tr></thead>
            <tbody>{rows.map((car) => <tr key={car.name} className={car.baseline ? "baseline" : ""}>
              <th scope="row"><span className="car-year">{car.year}</span>{car.short}</th>
              <td>{car.mileage}</td>
              <td>{euro(car.fuelCost)}<small>{car.economy.toFixed(1)} L / 100 km</small></td>
              <td>{euro(car.tax)}</td>
              <td>{car.insurance[0] === car.insurance[1] ? euro(car.insurance) : `${euro(car.insurance[0])}–${euro(car.insurance[1])}`}</td>
              <td>{euro(car.maintenance)}<small>Estimated reserve</small></td>
              <td className="total">{euro(car.total)}</td>
              <td className={car.baseline ? "muted" : "difference"}>{car.baseline ? "Benchmark" : costDifference(car.total, current.total)}</td>
              <td className={car.baseline ? "muted" : "difference"}>{car.baseline ? "Benchmark" : costDifference(car.totalWithoutMaintenance, current.totalWithoutMaintenance)}</td>
            </tr>)}</tbody>
          </table>
        </div>
      </section>

      <section className="listings" aria-labelledby="listing-heading">
        <div className="section-heading">
          <div><div className="eyebrow">Original listings</div><h2 id="listing-heading">See the cars in the ads</h2></div>
          <p>Photos and listing details can change if the seller updates or removes an ad.</p>
        </div>
        <div className="listing-grid">
          {cars.filter((car) => car.adUrl && car.image).map((car) => (
            <a className="listing-card" href={car.adUrl} target="_blank" rel="noreferrer" key={car.name}>
              <img src={car.image} alt={`${car.year} ${car.name} from its Carzone listing`} loading="lazy" />
              <span className="listing-copy">
                <span><span className="car-year">{car.year}</span><strong>{car.short}</strong><small>{car.mileage} · {euro(car.price)}</small></span>
                <span className="ad-link">Open original ad <span aria-hidden="true">↗</span></span>
              </span>
            </a>
          ))}
        </div>
      </section>

    </main>
  );
}
