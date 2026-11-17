
import { useMemo, useState } from "react";
import {
  calculateInvestmentProjection,
  compareWithBenchmarks,
} from "../utils/calculations";

function Calculator() {
  const [form, setForm] = useState({
    amount: 50000,
    rentalYield: 6,
    annualGrowth: 5,
    years: 5,
  });

  const projection = useMemo(
    () => calculateInvestmentProjection(form),
    [form]
  );

  const comparison = useMemo(
    () => compareWithBenchmarks(form),
    [form]
  );

  const handleChange = (event) => {
    setForm((current) => ({
      ...current,
      [event.target.name]: Number(event.target.value),
    }));
  };

  return (
    <div className="page-shell bg-[var(--surface)] text-[var(--navy)]">
      <div className="page-container py-16">
        <h1 className="mb-3 text-3xl font-bold">Investment Calculator</h1>
        <p className="mb-8 max-w-2xl text-muted">
          Estimate your projected return based on rental income and property appreciation.
          Compare with fixed demo rates for FD and gold — not live market prices.
        </p>

        <div className="grid gap-8 lg:grid-cols-[1fr_1.1fr]">
          <div className="card p-6">
            <div className="space-y-5">
              <div>
                <label htmlFor="amount" className="mb-2 block text-sm font-medium text-[var(--navy-mid)]">
                  Investment amount
                </label>
                <input
                  id="amount"
                  name="amount"
                  type="number"
                  min="1000"
                  step="1000"
                  value={form.amount}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-4 py-3 outline-none focus:border-[var(--gold)]"
                />
              </div>

              <div>
                <label htmlFor="rentalYield" className="mb-2 block text-sm font-medium text-[var(--navy-mid)]">
                  Annual rental yield (%)
                </label>
                <input
                  id="rentalYield"
                  name="rentalYield"
                  type="number"
                  min="0"
                  step="0.5"
                  value={form.rentalYield}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-4 py-3 outline-none focus:border-[var(--gold)]"
                />
              </div>

              <div>
                <label htmlFor="annualGrowth" className="mb-2 block text-sm font-medium text-[var(--navy-mid)]">
                  Property growth per year (%)
                </label>
                <input
                  id="annualGrowth"
                  name="annualGrowth"
                  type="number"
                  min="0"
                  step="0.5"
                  value={form.annualGrowth}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-4 py-3 outline-none focus:border-[var(--gold)]"
                />
              </div>

              <div>
                <label htmlFor="years" className="mb-2 block text-sm font-medium text-[var(--navy-mid)]">
                  Holding period (years)
                </label>
                <input
                  id="years"
                  name="years"
                  type="number"
                  min="1"
                  max="30"
                  value={form.years}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-4 py-3 outline-none focus:border-[var(--gold)]"
                />
              </div>
            </div>
          </div>

          <div className="card p-6">
            <h2 className="mb-5 text-2xl font-bold">Projected Returns</h2>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-lg bg-[var(--cream)] p-4">
                <p className="text-sm text-muted">Estimated monthly rent</p>
                <p className="mt-2 text-2xl font-bold text-[var(--success)]">
                  Rs.{Math.round(projection.monthlyRent).toLocaleString()}
                </p>
              </div>

              <div className="rounded-lg bg-[var(--cream)] p-4">
                <p className="text-sm text-muted">Total rental income</p>
                <p className="mt-2 text-2xl font-bold text-[var(--success)]">
                  Rs.{Math.round(projection.totalRent).toLocaleString()}
                </p>
              </div>

              <div className="rounded-lg bg-[var(--cream)] p-4">
                <p className="text-sm text-muted">Projected property value</p>
                <p className="mt-2 text-2xl font-bold text-[var(--navy)]">
                  Rs.{Math.round(projection.projectedValue).toLocaleString()}
                </p>
              </div>

              <div className="rounded-lg bg-[var(--cream)] p-4">
                <p className="text-sm text-muted">Total returns</p>
                <p className="mt-2 text-2xl font-bold text-[var(--navy)]">
                  Rs.{Math.round(projection.totalReturns).toLocaleString()}
                </p>
              </div>
            </div>

            <div className="mt-5 rounded-lg border border-[var(--gold)]/30 bg-[var(--gold-pale)] p-4">
              <p className="text-sm text-[var(--navy-mid)]">Final estimated value</p>
              <p className="mt-1 text-3xl font-bold text-[var(--navy)]">
                Rs.{Math.round(projection.finalValue).toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <section className="mt-12">
          <h2 className="mb-2 text-2xl font-bold">Compare with FD & Gold</h2>
          <p className="mb-6 text-sm text-muted">
            Illustrative comparison using assumed annual returns (7% FD, 8% gold). BrickVest uses your
            rent + growth inputs above. Not financial advice.
          </p>

          <div className="overflow-x-auto rounded-xl border border-[var(--border)] bg-[var(--surface)]">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead className="bg-[var(--cream)] text-[var(--navy)]">
                <tr>
                  <th className="px-4 py-3 font-medium">Option</th>
                  <th className="px-4 py-3 font-medium">Assumption</th>
                  <th className="px-4 py-3 font-medium">Final value</th>
                  <th className="px-4 py-3 font-medium">Total gain</th>
                </tr>
              </thead>
              <tbody>
                {comparison.options.map((option) => (
                  <tr
                    key={option.id}
                    className={`border-t border-[var(--border)] ${
                      option.id === comparison.bestId ? "bg-[var(--cream)]" : "bg-[var(--surface)]"
                    }`}
                  >
                    <td className="px-4 py-4 font-semibold text-[var(--navy)]">
                      {option.label}
                      {option.id === comparison.bestId && (
                        <span className="ml-2 rounded-full bg-[var(--gold-pale)] px-2 py-0.5 text-xs text-[var(--gold)]">
                          Highest (demo)
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-4 text-muted">{option.detail}</td>
                    <td className="px-4 py-4 font-semibold text-[var(--navy)]">
                      Rs.{Math.round(option.finalValue).toLocaleString()}
                    </td>
                    <td className="px-4 py-4 text-[var(--success)]">
                      +Rs.{Math.round(option.totalGain).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            {comparison.options.map((option) => {
              const maxValue = Math.max(...comparison.options.map((o) => o.finalValue));
              const barWidth = maxValue
                ? Math.round((option.finalValue / maxValue) * 100)
                : 0;

              return (
                <div key={option.id} className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-4">
                  <p className="text-sm font-medium text-[var(--navy-mid)]">{option.label}</p>
                  <div className="mt-3 h-2 overflow-hidden rounded-full bg-[var(--border-light)]">
                    <div
                      className={`h-full rounded-full ${
                        option.highlight ? "bg-[var(--navy)]" : "bg-[var(--muted)]"
                      }`}
                      style={{ width: `${barWidth}%` }}
                    />
                  </div>
                  <p className="mt-2 text-lg font-bold text-[var(--navy)]">
                    Rs.{Math.round(option.finalValue).toLocaleString()}
                  </p>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}

export default Calculator;
