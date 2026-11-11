"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { AlertTriangle, ChevronDown, Sparkles } from "lucide-react";
import {
  currencies,
  currencyCodes,
  currencyForLocation,
  defaultLocation,
  findPreset,
  inputLimits,
  solarConstants,
  type CurrencyCode,
  type Preset,
} from "@/lib/solarConfig";
import { calculateSolar, clamp, formatKw, formatMoney, localAdvice, type AdviceFacts } from "@/lib/solarCalc";
import { Eyebrow } from "./Eyebrow";
import { Accent } from "./Accent";
import { Button } from "./Button";
import { WhatsAppButton } from "./WhatsAppButton";
import { useMotion } from "./MotionProvider";
import { LocationCombobox } from "./LocationCombobox";
import { findUsState, US_DATA_YEAR, type UsState } from "@/lib/usStates";
import { StateSunIntensity } from "./StateSunIntensity";

const ROOF_CELLS = 40;
const wholeNumber = new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 });

/** Parses a typed number; empty or invalid text falls back so the calculation never sees NaN. */
const parse = (s: string, fallback: number) => {
  const n = Number(s);
  return s.trim() !== "" && Number.isFinite(n) ? n : fallback;
};
const trimNumber = (n: number) => String(Math.round(n * 1000) / 1000);

/** Eases from the previous value to the new one; jumps straight there when motion is reduced. */
function useTween(target: number, enabled: boolean, duration = 550) {
  const [value, setValue] = useState(target);
  const from = useRef(target);
  useEffect(() => {
    if (!enabled) {
      from.current = target;
      setValue(target);
      return;
    }
    const start = performance.now();
    const origin = from.current;
    let frame = 0;
    const step = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      const v = origin + (target - origin) * eased;
      from.current = v;
      setValue(v);
      if (t < 1) frame = requestAnimationFrame(step);
    };
    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [target, enabled, duration]);
  return value;
}

function Tween({ value, format }: { value: number; format: (n: number) => string }) {
  const { enabled } = useMotion();
  const shown = useTween(value, enabled);
  return <span className="ticker">{format(shown)}</span>;
}

/** Slider with a matching number box. The box validates and clamps on blur. */
function RangeField({
  id,
  label,
  value,
  onChange,
  min,
  max,
  step,
  format,
  unit,
}: {
  id: string;
  label: string;
  value: number;
  onChange: (n: number) => void;
  min: number;
  max: number;
  step: number;
  format: (n: number) => string;
  unit: string;
}) {
  const [draft, setDraft] = useState(String(value));
  useEffect(() => setDraft(String(value)), [value]);
  const pct = ((value - min) / (max - min)) * 100;
  const commit = () => {
    const n = clamp(Math.round(parse(draft, value) / step) * step, min, max);
    setDraft(String(n));
    onChange(n);
  };
  return (
    <div className="calc-field">
      <div className="calc-range-head">
        <label htmlFor={`${id}-num`}>{label}</label>
        <div className="calc-input calc-input-sm">
          <input
            id={`${id}-num`}
            type="number"
            inputMode="numeric"
            min={min}
            max={max}
            step={step}
            value={draft}
            onChange={(e) => {
              setDraft(e.target.value);
              const n = Number(e.target.value);
              if (e.target.value !== "" && Number.isFinite(n) && n >= min && n <= max) onChange(n);
            }}
            onBlur={commit}
            onKeyDown={(e) => e.key === "Enter" && commit()}
          />
          <span className="calc-unit" aria-hidden="true">
            {unit}
          </span>
        </div>
      </div>
      <input
        className="range"
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        aria-label={label}
        aria-valuetext={format(value)}
        style={{ "--pct": `${pct}%` } as React.CSSProperties}
      />
      <div className="range-scale" aria-hidden="true">
        <span>{format(min)}</span>
        <span>{format(max)}</span>
      </div>
    </div>
  );
}

/** Reveals text a few characters at a time, or all at once when motion is reduced. */
function TypedText({ text }: { text: string }) {
  const { enabled } = useMotion();
  const [count, setCount] = useState(enabled ? 0 : text.length);
  useEffect(() => {
    if (!enabled) {
      setCount(text.length);
      return;
    }
    setCount(0);
    const timer = window.setInterval(() => {
      setCount((c) => {
        if (c >= text.length) {
          window.clearInterval(timer);
          return c;
        }
        return c + 3;
      });
    }, 18);
    return () => window.clearInterval(timer);
  }, [text, enabled]);
  return (
    <p className="calc-ai-text">
      <span aria-hidden="true">{text.slice(0, count)}</span>
      <span className="sr-only">{text}</span>
    </p>
  );
}

type Hint = { kind: "preset" | "none"; text: string } | null;

/** A state's EIA average bill, rounded to whole dollars and kept inside the USD slider range. */
function stateBill(s: UsState) {
  const { min, max } = currencies.USD.bill;
  return clamp(Math.round(s.bill), min, max);
}

export function SolarCalculator() {
  const id = useId();
  const initial = findPreset(defaultLocation.name) as Preset;
  const initialState = findUsState(defaultLocation.name);

  const [location, setLocation] = useState(defaultLocation.name);
  const [preset, setPreset] = useState<Preset | undefined>(initial);
  const [currency, setCurrency] = useState<CurrencyCode>(initial.currency);
  const [rate, setRate] = useState(String(initialState?.rate ?? initial.rate));
  const [sun, setSun] = useState(String(initialState?.sunHours ?? initial.sunHours));
  const [roof, setRoof] = useState(inputLimits.roof.default);
  const [bill, setBill] = useState(initialState ? stateBill(initialState) : currencies[initial.currency].bill.default);
  const [hint, setHint] = useState<Hint>(null);

  const cur = currencies[currency];
  const rateNum = clamp(parse(rate, 0), 0, inputLimits.rate.max);
  const sunNum = clamp(parse(sun, inputLimits.sunHours.min), inputLimits.sunHours.min, inputLimits.sunHours.max);
  // Preset economics only apply while the preset's own currency is selected.
  const presetActive = preset && preset.currency === currency;
  const offsetCap = presetActive ? preset.offsetCap : solarConstants.defaultOffsetCap;
  const costPerWatt = presetActive ? preset.costPerWatt : cur.costPerWatt;
  const tip = preset?.tip ?? "gen";

  const r = useMemo(
    () => calculateSolar({ bill, rate: rateNum, sunHours: sunNum, roofSqFt: roof, offsetCap, costPerWatt }),
    [bill, rateNum, sunNum, roof, offsetCap, costPerWatt]
  );

  const money = (n: number) => formatMoney(n, currency);
  const filled = Math.max(1, Math.min(ROOF_CELLS, Math.round((r.panels / r.maxPanels) * ROOF_CELLS)));
  const kw = formatKw(r.systemWatts);
  const place = location.trim();

  const changeCurrency = (c: CurrencyCode) => {
    setCurrency(c);
    setBill(currencies[c].bill.default);
  };

  const changeLocation = (value: string) => {
    setLocation(value);
    // A US state: that state's own EIA rate and average bill, and its sun hours.
    const state = findUsState(value);
    if (state) {
      const statePreset = findPreset(state.name);
      setPreset(statePreset?.currency === "USD" ? statePreset : undefined);
      setCurrency("USD");
      setRate(String(state.rate));
      setSun(String(state.sunHours));
      setBill(stateBill(state));
      setHint({
        kind: "preset",
        text: `${state.name} averages loaded (EIA ${US_DATA_YEAR}): $${state.rate.toFixed(4)} per kWh, $${state.bill.toFixed(2)} average monthly bill, ${state.sunHours} peak sun hours. You can edit them below.`,
      });
      return;
    }
    const match = findPreset(value);
    if (match) {
      if (match !== preset) {
        setPreset(match);
        if (match.currency !== currency) changeCurrency(match.currency);
        setRate(String(match.rate));
        setSun(String(match.sunHours));
      }
      setHint({ kind: "preset", text: `Typical rates loaded for ${value.trim()}. You can edit them below.` });
    } else {
      setPreset(undefined);
      // A known country without a preset (e.g. "Ohio, United States") still sets its currency,
      // with that currency's typical rate, so a PKR rate is never applied to a USD bill.
      const cur = currencyForLocation(value);
      if (cur && cur !== currency) {
        changeCurrency(cur);
        setRate(String(currencies[cur].defaultRate));
        setSun(String(solarConstants.defaultSunHours));
        setHint({ kind: "none", text: `No preset for this place, so typical ${cur} rates are used. Enter your local rate and sun hours below.` });
        return;
      }
      setHint(value.trim() ? { kind: "none", text: "No preset for this place. Enter your local rate and sun hours below." } : null);
    }
  };

  // The state picked in Location (if any); its sun intensity card shows under the field.
  const usState = findUsState(location);

  const commitRate = () => setRate(trimNumber(clamp(parse(rate, inputLimits.rate.min), inputLimits.rate.min, inputLimits.rate.max)));
  const commitSun = () => setSun(trimNumber(sunNum));

  // Debounced screen reader summary so dragging a slider is not read out on every step.
  const [announce, setAnnounce] = useState("");
  const summary = `Recommended ${kw} system with ${r.panels} panels. About ${money(r.monthlySavings)} saved a month, ${money(r.yearlySavings)} a year.${r.roofLimited ? " Your roof size limits the system." : ""}`;
  useEffect(() => {
    const t = window.setTimeout(() => setAnnounce(summary), 700);
    return () => window.clearTimeout(t);
  }, [summary]);

  // AI advice: 800 ms after the last change, cancelling any request still in flight.
  const facts: AdviceFacts & { roofSqFt: number; bill: number } = {
    location: place,
    currency,
    roofSqFt: roof,
    bill,
    systemWatts: r.systemWatts,
    panels: r.panels,
    newBill: Math.round(r.newBill),
    yearlySavings: Math.round(r.yearlySavings),
    tip,
  };
  const factsKey = JSON.stringify(facts);
  const [advice, setAdvice] = useState<{ text: string; loading: boolean }>({ text: "", loading: true });
  useEffect(() => {
    const body = JSON.parse(factsKey) as typeof facts;
    const controller = new AbortController();
    setAdvice((a) => ({ ...a, loading: true }));
    const timer = window.setTimeout(async () => {
      try {
        const res = await fetch("/api/solar-advice", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: factsKey,
          signal: controller.signal,
        });
        const data = (await res.json()) as { advice?: string };
        if (!res.ok || !data.advice) throw new Error("no advice");
        setAdvice({ text: data.advice, loading: false });
      } catch {
        if (controller.signal.aborted) return;
        setAdvice({ text: localAdvice(body), loading: false });
      }
    }, 800);
    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [factsKey]);

  const waMessage = `Hi SUNARA, I live in ${place || "my area"}. Roof: ${wholeNumber.format(roof)} sq ft, bill: ${money(bill)}/month. Calculator suggests ${kw} and about ${money(r.yearlySavings)} yearly savings. I would like a quote.`;
  const quoteHref = `/contact?${new URLSearchParams({
    city: place,
    message: `Solar calculator estimate: roof ${wholeNumber.format(roof)} sq ft, bill ${money(bill)}/month, suggested ${kw} system with about ${money(r.yearlySavings)} yearly savings.`,
  }).toString()}#quote`;

  const nowWidth = 100;
  const afterWidth = bill > 0 ? Math.max(2, (r.newBill / bill) * 100) : 0;

  return (
    <section className="section container" id="savings" aria-labelledby="savings-title">
      <div className="estimator calc" data-reveal>
        <div className="calc-inputs">
          <Eyebrow>AI solar savings calculator</Eyebrow>
          <h2 id="savings-title" className="section-title">
            See what the sun
            <br />
            could save <Accent>you</Accent>
          </h2>
          <p className="estimator-note calc-intro">
            Tell us where you live and what you pay. We’ll size a system for your roof and estimate your savings in your own currency.
          </p>

          <div className="calc-field">
            <label htmlFor={`${id}-loc`}>Location</label>
            <LocationCombobox
              id={`${id}-loc`}
              value={location}
              onChange={changeLocation}
              placeholder="Choose a US state"
              describedBy={hint ? `${id}-hint` : undefined}
            />
            {hint && (
              <p id={`${id}-hint`} className={`calc-hint is-${hint.kind}`} role="status">
                {hint.text}
              </p>
            )}
          </div>

          {usState && <StateSunIntensity state={usState} />}

          <div className="calc-row">
            <div className="calc-field">
              <label htmlFor={`${id}-cur`}>Currency</label>
              <div className="calc-input calc-select">
                <select id={`${id}-cur`} value={currency} onChange={(e) => changeCurrency(e.target.value as CurrencyCode)}>
                  {currencyCodes.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
                <ChevronDown size={18} aria-hidden="true" />
              </div>
            </div>
            <div className="calc-field">
              <label htmlFor={`${id}-rate`}>Rate per kWh</label>
              <div className="calc-input">
                <span className="calc-prefix" aria-hidden="true">
                  {cur.symbol.trim()}
                </span>
                <input
                  id={`${id}-rate`}
                  type="number"
                  inputMode="decimal"
                  min={inputLimits.rate.min}
                  max={inputLimits.rate.max}
                  step={cur.rateStep}
                  value={rate}
                  onChange={(e) => setRate(e.target.value)}
                  onBlur={commitRate}
                />
              </div>
            </div>
            <div className="calc-field">
              <label htmlFor={`${id}-sun`}>Sun hours per day</label>
              <div className="calc-input">
                <input
                  id={`${id}-sun`}
                  type="number"
                  inputMode="decimal"
                  min={inputLimits.sunHours.min}
                  max={inputLimits.sunHours.max}
                  step={inputLimits.sunHours.step}
                  value={sun}
                  onChange={(e) => setSun(e.target.value)}
                  onBlur={commitSun}
                />
              </div>
            </div>
          </div>

          <RangeField
            id={`${id}-roof`}
            label="Roof area"
            value={roof}
            onChange={setRoof}
            min={inputLimits.roof.min}
            max={inputLimits.roof.max}
            step={inputLimits.roof.step}
            format={(n) => `${wholeNumber.format(n)} sq ft`}
            unit="sq ft"
          />
          <RangeField
            key={currency}
            id={`${id}-bill`}
            label={`Average monthly electricity bill (${currency})`}
            value={bill}
            onChange={setBill}
            min={cur.bill.min}
            max={cur.bill.max}
            step={cur.bill.step}
            format={money}
            unit={cur.symbol.trim()}
          />
        </div>

        <div className="result-card calc-card">
          <p className="result-title">Your solar snapshot</p>

          <div className="calc-system">
            <p className="calc-label">Recommended system size</p>
            <p className="calc-big">
              <Tween value={r.systemWatts} format={(n) => `${wholeNumber.format(Math.round(n / 100) * 100)} W`} />{" "}
              <span className="calc-big-sub">({kw})</span>
            </p>
            <p className="calc-sub">
              {r.panels} panels of {solarConstants.panelWatts} W
            </p>
          </div>

          <div className="calc-roof-wrap" aria-hidden="true">
            <div className="calc-roof">
              {Array.from({ length: ROOF_CELLS }, (_, i) => (
                <span key={i} className={`calc-cell ${i < filled ? "is-on" : ""}`} />
              ))}
            </div>
          </div>
          <p className="calc-sub calc-roof-caption">
            {r.panels} of about {r.maxPanels} panels that fit on your roof
          </p>

          {r.roofLimited && (
            <p className="calc-warning" role="note">
              <AlertTriangle size={16} aria-hidden="true" />
              Your roof size limits the system, so savings are partial.
            </p>
          )}

          <dl className="calc-stats">
            <div>
              <dt>Monthly savings</dt>
              <dd>
                <Tween value={r.monthlySavings} format={money} />
              </dd>
            </div>
            <div className="is-good">
              <dt>Yearly savings</dt>
              <dd>
                <Tween value={r.yearlySavings} format={money} />
              </dd>
            </div>
            <div>
              <dt>CO₂ avoided per year</dt>
              <dd>
                <Tween value={r.co2TonsPerYear} format={(n) => `${n.toFixed(1)} t`} />
              </dd>
            </div>
            <div>
              <dt>Bill offset</dt>
              <dd>
                <Tween value={r.billOffsetPercent * 100} format={(n) => `${Math.round(n)}%`} />
              </dd>
            </div>
          </dl>

          <div className="calc-bars">
            <div className="calc-bar-row">
              <span className="calc-bar-label">Now</span>
              <span className="calc-bar">
                <span className="calc-bar-fill is-now" style={{ width: `${nowWidth}%` }} />
              </span>
              <span className="calc-bar-value">{money(bill)}</span>
            </div>
            <div className="calc-bar-row">
              <span className="calc-bar-label">With solar</span>
              <span className="calc-bar">
                <span className="calc-bar-fill is-after" style={{ width: `${afterWidth}%` }} />
              </span>
              <span className="calc-bar-value">{money(r.newBill)}</span>
            </div>
          </div>

          <div className="calc-ai" aria-live="polite" aria-busy={advice.loading}>
            <p className="calc-ai-title">
              <Sparkles size={15} aria-hidden="true" />
              AI Solar Advice
            </p>
            {advice.loading ? (
              <div className="calc-skeleton" aria-hidden="true">
                <span />
                <span />
                <span />
              </div>
            ) : (
              <TypedText text={advice.text} />
            )}
          </div>

          <p className="calc-disclaimer">Estimates only. A free roof assessment confirms exact figures. Incentives not included.</p>

          <div className="calc-ctas">
            <Button href={quoteHref} className="result-cta">
              Get a Free Quote
            </Button>
            <WhatsAppButton label="Chat on WhatsApp" message={waMessage} className="result-cta" />
          </div>

          <p className="sr-only" aria-live="polite">
            {announce}
          </p>
        </div>
      </div>
    </section>
  );
}
