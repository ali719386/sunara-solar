"use client";

import { useEffect, useId, useState } from "react";
import { quote, type PropertyType, type ServiceType } from "@/lib/content";
import { Button } from "./Button";

const EVENT = "sunara:select-property";
const SERVICE_EVENT = "sunara:select-service";

/** Called by solution cards to preselect the property type before scrolling to the form. */
export function selectProperty(p: PropertyType) {
  window.dispatchEvent(new CustomEvent<PropertyType>(EVENT, { detail: p }));
}

/** Called by "Book this service" buttons to preselect the service before scrolling to the form. */
export function selectService(s: ServiceType) {
  window.dispatchEvent(new CustomEvent<ServiceType>(SERVICE_EVENT, { detail: s }));
}

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function QuoteForm({ withService = false }: { withService?: boolean }) {
  const [property, setProperty] = useState<PropertyType>("Home");
  const [service, setService] = useState<ServiceType>("Installation");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "invalid" | "success">("idle");
  const id = useId();

  useEffect(() => {
    const onSelect = (e: Event) => setProperty((e as CustomEvent<PropertyType>).detail);
    const onService = (e: Event) => setService((e as CustomEvent<ServiceType>).detail);
    window.addEventListener(EVENT, onSelect);
    window.addEventListener(SERVICE_EVENT, onService);
    return () => {
      window.removeEventListener(EVENT, onSelect);
      window.removeEventListener(SERVICE_EVENT, onService);
    };
  }, []);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!EMAIL_RE.test(email.trim())) {
      setStatus("invalid");
      return;
    }
    // TODO: connect a real lead API here (e.g. POST /api/quote with { property, service, email })
    // before launch. Submissions are not sent anywhere yet.
    setStatus("success");
    setEmail("");
  };

  return (
    <form className="quote-form" onSubmit={onSubmit} noValidate>
      {withService && (
        <fieldset className="segmented">
          <legend className="sr-only">Service</legend>
          {quote.services.map((s) => (
            <label key={s} className={`segment ${service === s ? "is-active" : ""}`}>
              <input type="radio" name="service" value={s} checked={service === s} onChange={() => setService(s)} />
              <span>{s}</span>
            </label>
          ))}
        </fieldset>
      )}
      <fieldset className="segmented">
        <legend className="sr-only">Property type</legend>
        {quote.properties.map((p) => (
          <label key={p} className={`segment ${property === p ? "is-active" : ""}`}>
            <input
              type="radio"
              name="property"
              value={p}
              checked={property === p}
              onChange={() => setProperty(p)}
            />
            <span>{p}</span>
          </label>
        ))}
      </fieldset>
      <div className={`email-field ${status === "invalid" ? "is-invalid" : ""}`}>
        <label htmlFor={`${id}-email`} className="sr-only">
          Email address
        </label>
        <input
          id={`${id}-email`}
          type="email"
          inputMode="email"
          autoComplete="email"
          placeholder="Your email address"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (status !== "idle") setStatus("idle");
          }}
          aria-invalid={status === "invalid"}
          aria-describedby={`${id}-msg`}
        />
        <Button type="submit" arrow="up-right" className="quote-submit">
          {quote.button}
        </Button>
      </div>
      <p id={`${id}-msg`} className={`form-msg is-${status}`} role="status" aria-live="polite">
        <span key={status} className="form-msg-text">
          {status === "success" ? quote.success : status === "invalid" ? quote.invalid : quote.note}
        </span>
      </p>
    </form>
  );
}
