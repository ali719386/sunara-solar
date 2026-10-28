"use client";

import { useEffect, useId, useState } from "react";
import { estimate, estimator, formatMoney } from "@/lib/content";
import { Eyebrow } from "./Eyebrow";
import { Accent } from "./Accent";
import { Button } from "./Button";

/** Re-keys on change so the 0.3s fade/up runs; the value itself is never delayed. */
function Ticker({ value, className = "" }: { value: string; className?: string }) {
  return (
    <span className={`ticker ${className}`}>
      <span key={value} className="ticker-value">
        {value}
      </span>
    </span>
  );
}

export function Estimator() {
  const [bill, setBill] = useState(estimator.defaultBill);
  const [announce, setAnnounce] = useState("");
  const id = useId();
  const { systemKw, yearlySavings, co2Tons } = estimate(bill);
  const pct = ((bill - estimator.min) / (estimator.max - estimator.min)) * 100;

  // Debounced summary for screen readers so dragging the slider is not overwhelming.
  useEffect(() => {
    const t = window.setTimeout(() => {
      setAnnounce(
        `Recommended ${systemKw} kilowatt system, about ${formatMoney(yearlySavings)} saved per year, ${co2Tons} tonnes of CO2 avoided.`
      );
    }, 700);
    return () => window.clearTimeout(t);
  }, [systemKw, yearlySavings, co2Tons]);

  return (
    <section className="section container" id="savings" aria-labelledby="savings-title">
      <div className="estimator" data-reveal>
        <div className="estimator-left">
          <Eyebrow>{estimator.eyebrow}</Eyebrow>
          <h2 id="savings-title" className="section-title">
            {estimator.title.lines[0]}
            <br />
            {estimator.title.lines[1]}
            <Accent>{estimator.title.accent}</Accent>
          </h2>

          <label htmlFor={`${id}-bill`} className="estimator-label">
            {estimator.label}
          </label>
          <p className="estimator-bill" aria-hidden="true">
            <Ticker value={formatMoney(bill)} />
          </p>
          <input
            id={`${id}-bill`}
            className="range"
            type="range"
            min={estimator.min}
            max={estimator.max}
            step={estimator.step}
            value={bill}
            onChange={(e) => setBill(Number(e.target.value))}
            aria-valuetext={formatMoney(bill)}
            style={{ "--pct": `${pct}%` } as React.CSSProperties}
          />
          <div className="range-scale" aria-hidden="true">
            <span>{formatMoney(estimator.min)}</span>
            <span>{formatMoney(estimator.max)}</span>
          </div>
          <p className="estimator-note">{estimator.note}</p>
        </div>

        <div className="result-card">
          <p className="result-title">{estimator.card.title}</p>
          <dl className="result-list">
            <div className="result-row">
              <dt>{estimator.card.system}</dt>
              <dd>
                <Ticker value={`${systemKw} kW`} />
              </dd>
            </div>
            <div className="result-row">
              <dt>{estimator.card.savings}</dt>
              <dd>
                <Ticker value={formatMoney(yearlySavings)} />
              </dd>
            </div>
            <div className="result-row">
              <dt>{estimator.card.co2}</dt>
              <dd>
                <Ticker value={`${co2Tons} t`} />
              </dd>
            </div>
          </dl>
          <Button href={estimator.card.cta.href} className="result-cta">
            {estimator.card.cta.label}
          </Button>          <p className="sr-only" aria-live="polite">
            {announce}
          </p>
        </div>
      </div>
    </section>
  );
}
