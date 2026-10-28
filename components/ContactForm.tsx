"use client";

import { useId, useState } from "react";
import { contact, quote } from "@/lib/content";
import { Button } from "./Button";
import { EMAIL_RE } from "./QuoteForm";

type Errors = Partial<Record<"name" | "email" | "phone", string>>;

const PHONE_RE = /^[+\d][\d\s-]{6,}$/;

export function ContactForm() {
  const f = contact.form;
  const id = useId();
  const [values, setValues] = useState({
    name: "",
    phone: "",
    email: "",
    property: quote.properties[0] as string,
    service: f.services[0] as string,
    message: "",
  });
  const [errors, setErrors] = useState<Errors>({});
  const [sent, setSent] = useState(false);

  const set = (key: keyof typeof values) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setValues((v) => ({ ...v, [key]: e.target.value }));
    if (sent) setSent(false);
    if (key in errors) setErrors((er) => ({ ...er, [key]: undefined }));
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const next: Errors = {};
    if (!values.name.trim()) next.name = f.errors.name;
    if (!EMAIL_RE.test(values.email.trim())) next.email = f.errors.email;
    if (values.phone.trim() && !PHONE_RE.test(values.phone.trim())) next.phone = f.errors.phone;
    setErrors(next);
    if (Object.keys(next).length > 0) {
      const first = Object.keys(next)[0];
      document.getElementById(`${id}-${first}`)?.focus();
      return;
    }
    // TODO: connect a real API here (e.g. POST /api/contact with `values`) before launch.
    // Submissions are not sent anywhere yet.
    setSent(true);
    setValues((v) => ({ ...v, name: "", phone: "", email: "", message: "" }));
  };

  const field = (key: "name" | "phone" | "email", label: string, type: string, autoComplete: string, required = false) => (
    <div className={`field ${errors[key] ? "is-invalid" : ""}`}>
      <label htmlFor={`${id}-${key}`}>
        {label}
        {required && <span aria-hidden="true"> *</span>}
      </label>
      <input
        id={`${id}-${key}`}
        type={type}
        autoComplete={autoComplete}
        value={values[key]}
        onChange={set(key)}
        aria-invalid={!!errors[key]}
        aria-describedby={errors[key] ? `${id}-${key}-err` : undefined}
        required={required}
      />
      {errors[key] && (
        <p id={`${id}-${key}-err`} className="field-error">
          {errors[key]}
        </p>
      )}
    </div>
  );

  return (
    <form className="contact-form" onSubmit={onSubmit} noValidate aria-labelledby={`${id}-title`}>
      <h2 id={`${id}-title`} className="contact-form-title">
        {f.title}
      </h2>
      <div className="field-row">
        {field("name", f.name, "text", "name", true)}
        {field("phone", f.phone, "tel", "tel")}
      </div>
      {field("email", f.email, "email", "email", true)}
      <div className="field-row">
        <div className="field">
          <label htmlFor={`${id}-property`}>{f.property}</label>
          <select id={`${id}-property`} value={values.property} onChange={set("property")}>
            {quote.properties.map((p) => (
              <option key={p}>{p}</option>
            ))}
          </select>
        </div>
        <div className="field">
          <label htmlFor={`${id}-service`}>{f.service}</label>
          <select id={`${id}-service`} value={values.service} onChange={set("service")}>
            {f.services.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="field">
        <label htmlFor={`${id}-message`}>{f.message}</label>
        <textarea
          id={`${id}-message`}
          rows={5}
          placeholder={f.messagePlaceholder}
          value={values.message}
          onChange={set("message")}
        />
      </div>
      <div className="contact-form-foot">
        <Button type="submit">{f.button}</Button>
        <p className={`form-msg ${sent ? "is-success" : ""}`} role="status" aria-live="polite">
          <span key={String(sent)} className="form-msg-text">
            {sent ? f.success : f.note}
          </span>
        </p>
      </div>
    </form>
  );
}
