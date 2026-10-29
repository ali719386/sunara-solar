"use client";

import { useId, useState } from "react";
import { Check, ChevronDown } from "lucide-react";
import { contact, quote } from "@/lib/content";
import { Button } from "./Button";
import { Accent } from "./Accent";
import { EMAIL_RE } from "./QuoteForm";

type Errors = Partial<Record<"name" | "email" | "phone", string>>;
type TextKey = "name" | "phone" | "email" | "city";

const PHONE_RE = /^[+\d][\d\s-]{6,}$/;
const digits = (s: string) => s.replace(/\D/g, "").length;

/** Short quote form: the essentials only, with inline validation. */
export function ContactForm() {
  const f = contact.form;
  const id = useId();
  const empty = {
    name: "",
    phone: "",
    email: "",
    city: "",
    property: quote.properties[0] as string,
    service: f.services[0] as string,
    message: "",
  };
  const [values, setValues] = useState(empty);
  const [errors, setErrors] = useState<Errors>({});
  const [sent, setSent] = useState(false);

  const set = (key: TextKey | "service" | "message") =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      setValues((v) => ({ ...v, [key]: e.target.value }));
      if (key in errors) setErrors((er) => ({ ...er, [key]: undefined }));
    };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const next: Errors = {};
    if (values.name.trim().length < 2) next.name = f.errors.name;
    const phone = values.phone.trim();
    if (!PHONE_RE.test(phone) || digits(phone) < 10) next.phone = f.errors.phone;
    if (values.email.trim() && !EMAIL_RE.test(values.email.trim())) next.email = f.errors.email;
    setErrors(next);
    if (Object.keys(next).length > 0) {
      const first = Object.keys(next)[0];
      document.getElementById(`${id}-${first}`)?.focus();
      return;
    }
    // TODO: connect a real API here (e.g. POST /api/contact with `values`) before launch.
    // The phone field shows a fixed f.phonePrefix; join the two when sending.
    // Submissions are not sent anywhere yet.
    setSent(true);
    setValues(empty);
  };

  const field = (
    key: TextKey,
    label: string,
    o: { type?: string; autoComplete: string; required?: boolean; placeholder?: string; prefix?: string; list?: string }
  ) => {
    const err = key === "city" ? undefined : errors[key];
    return (
      <div className={`field ${err ? "is-invalid" : ""}`}>
        <label htmlFor={`${id}-${key}`}>
          {label}
          {o.required ? <span aria-hidden="true"> *</span> : <span className="ct-optional"> ({f.optional})</span>}
        </label>
        <div className={`ct-input ${o.prefix ? "has-prefix" : ""}`}>
          {o.prefix && (
            <span className="ct-prefix" aria-hidden="true">
              {o.prefix}
            </span>
          )}
          <input
            id={`${id}-${key}`}
            name={key}
            type={o.type ?? "text"}
            autoComplete={o.autoComplete}
            inputMode={o.type === "tel" ? "tel" : o.type === "email" ? "email" : undefined}
            placeholder={o.placeholder}
            list={o.list}
            value={values[key]}
            onChange={set(key)}
            aria-invalid={!!err}
            aria-describedby={err ? `${id}-${key}-err` : undefined}
            required={o.required}
          />
        </div>
        {err && (
          <p id={`${id}-${key}-err`} className="field-error">
            {err}
          </p>
        )}
      </div>
    );
  };

  if (sent) {
    return (
      <div className="ct-success" role="status" aria-live="polite">
        <span className="ct-success-icon">
          <Check size={30} strokeWidth={2.4} aria-hidden="true" />
        </span>
        <h2 className="ct-form-title">
          {f.successTitle} <Accent>{f.successAccent}</Accent>
        </h2>
        <p className="ct-muted">{f.successText}</p>
        <Button variant="secondary" arrow="none" onClick={() => setSent(false)}>
          {f.again}
        </Button>
      </div>
    );
  }

  return (
    <form className="ct-form" onSubmit={onSubmit} noValidate aria-labelledby={`${id}-title`}>
      <h2 id={`${id}-title`} className="ct-form-title">
        {f.title}
      </h2>
      <p className="ct-muted ct-intro">{f.intro}</p>

      {field("name", f.name, { autoComplete: "name", required: true, placeholder: f.namePlaceholder })}
      {field("phone", f.phone, {
        type: "tel",
        autoComplete: "tel-national",
        required: true,
        prefix: f.phonePrefix,
        placeholder: f.phonePlaceholder,
      })}
      <div className="field-row">
        {field("email", f.email, { type: "email", autoComplete: "email", placeholder: f.emailPlaceholder })}
        {field("city", f.city, {
          autoComplete: "address-level2",
          placeholder: f.cityPlaceholder,
          list: `${id}-cities`,
        })}
      </div>
      <datalist id={`${id}-cities`}>
        {f.cities.map((c) => (
          <option key={c} value={c} />
        ))}
      </datalist>

      <div className="field">
        <span className="ct-label" id={`${id}-property`}>
          {f.property}
        </span>
        <div className="ct-segments" role="group" aria-labelledby={`${id}-property`}>
          {quote.properties.map((p) => (
            <button
              key={p}
              type="button"
              className="ct-segment"
              aria-pressed={values.property === p}
              onClick={() => setValues((v) => ({ ...v, property: p }))}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      <div className="field">
        <label htmlFor={`${id}-service`}>{f.service}</label>
        <div className="ct-select">
          <select id={`${id}-service`} name="service" value={values.service} onChange={set("service")}>
            {f.services.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
          <ChevronDown size={18} aria-hidden="true" />
        </div>
      </div>

      <div className="field">
        <label htmlFor={`${id}-message`}>
          {f.message}
          <span className="ct-optional"> ({f.optional})</span>
        </label>
        <textarea
          id={`${id}-message`}
          name="message"
          rows={3}
          placeholder={f.messagePlaceholder}
          value={values.message}
          onChange={set("message")}
        />
      </div>

      <Button type="submit" arrow="right" className="ct-submit">
        {f.button}
      </Button>
      <p className="ct-muted ct-small ct-note">{f.note}</p>
    </form>
  );
}
