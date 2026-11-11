import { Sun } from "lucide-react";
import { SUN_RANGE, sunLevel, type UsState } from "@/lib/usStates";
import { stateSun } from "@/lib/stateSun";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/**
 * Sun intensity for the chosen state: its annual peak sun hours on a US wide meter, a plain
 * language level, and the month by month pattern in its largest city. All data is bundled
 * (lib/stateSun.ts), so the card shows instantly with no request.
 */
export function StateSunIntensity({ state }: { state: UsState }) {
  const level = sunLevel(state.sunHours);
  const pos = ((state.sunHours - SUN_RANGE.min) / (SUN_RANGE.max - SUN_RANGE.min)) * 100;
  const monthly = stateSun[state.code];
  const values = monthly?.monthly.length === 12 ? monthly.monthly : [];
  const max = values.length ? Math.max(...values) : 0;
  const min = values.length ? Math.min(...values) : 0;

  return (
    <section className="sun-chart" aria-label={`Sun intensity in ${state.name}`}>
      <div className="sun-head">
        <Sun size={18} aria-hidden="true" />
        <p className="sun-chart-title">Sun intensity in {state.name}</p>
        <span className="sun-level">{level.label}</span>
      </div>
      <p className="sun-big">
        {state.sunHours} <span>peak sun hours a day, yearly average</span>
      </p>

      <div className="sun-meter" aria-hidden="true">
        <span className="sun-meter-dot" style={{ left: `${Math.min(100, Math.max(0, pos))}%` }} />
      </div>
      <div className="sun-meter-scale" aria-hidden="true">
        <span>{SUN_RANGE.min} h, least sunny state</span>
        <span>{SUN_RANGE.max} h, sunniest</span>
      </div>
      <p className="sun-chart-note">{level.note}</p>

      {values.length === 12 && (
        <figure className="sun-months">
          <figcaption className="sun-months-title">Month by month in {monthly.city}, the largest city</figcaption>
          <div className="sun-bars" aria-hidden="true">
            {values.map((v, i) => (
              <div key={MONTHS[i]} className="sun-bar-col" title={`${MONTHS[i]}: ${v} peak sun hours a day`}>
                <span className="sun-bar-value">{v === max || v === min ? v : ""}</span>
                <span className="sun-bar" style={{ height: `${Math.max(4, (v / max) * 82)}%` }} />
                <span className="sun-bar-tip">
                  {MONTHS[i]}: {v} h
                </span>
                <span className="sun-bar-month">{MONTHS[i][0]}</span>
              </div>
            ))}
          </div>
          <table className="sr-only">
            <caption>Peak sun hours per day by month in {monthly.city}</caption>
            <tbody>
              {values.map((v, i) => (
                <tr key={MONTHS[i]}>
                  <th scope="row">{MONTHS[i]}</th>
                  <td>{v}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </figure>
      )}
      <p className="sun-source">
        Yearly figure: NREL based state average. Monthly pattern: NLR (formerly NREL) NSRDB satellite data, south facing
        roof at 20°. Locations ©{" "}
        <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">
          OpenStreetMap
        </a>{" "}
        contributors.
      </p>
    </section>
  );
}
