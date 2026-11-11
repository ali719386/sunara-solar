"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronDown, MapPin } from "lucide-react";
import { searchUsStates, type UsState } from "@/lib/usStates";

type Props = {
  id: string;
  value: string;
  /** Called with the typed text, or the picked state's name. */
  onChange: (value: string) => void;
  describedBy?: string;
  placeholder?: string;
};

/**
 * Location field with a searchable list of the 50 US states and DC. Each option shows the
 * state's average electricity rate and sun hours. Any free text is still accepted.
 */
export function LocationCombobox({ id, value, onChange, describedBy, placeholder }: Props) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  // Text typed since the list opened; empty means "show every state".
  const [query, setQuery] = useState("");
  const input = useRef<HTMLInputElement>(null);
  const list = useRef<HTMLUListElement>(null);
  const listId = `${id}-list`;

  const options: UsState[] = useMemo(() => searchUsStates(query), [query]);

  useEffect(() => setActive(-1), [query, open]);

  // Keep the highlighted option in view while using the arrow keys.
  useEffect(() => {
    if (active < 0) return;
    list.current?.querySelector<HTMLElement>(`[data-index="${active}"]`)?.scrollIntoView({ block: "nearest" });
  }, [active]);

  const pick = (s: UsState) => {
    onChange(s.name);
    setQuery("");
    setOpen(false);
    input.current?.focus();
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (!open) setOpen(true);
      else setActive((i) => Math.min(options.length - 1, i + 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => Math.max(-1, i - 1));
    } else if (e.key === "Enter" && open && active >= 0 && options[active]) {
      e.preventDefault();
      pick(options[active]);
    } else if (e.key === "Escape" && open) {
      e.preventDefault();
      e.stopPropagation();
      setOpen(false);
    } else if (e.key === "Tab") {
      setOpen(false);
    }
  };

  const showList = open;

  return (
    <div className={`loc-combo ${showList ? "is-open" : ""}`}>
      <div className="calc-input">
        <MapPin className="loc-pin" size={17} aria-hidden="true" />
        <input
          ref={input}
          id={id}
          type="text"
          role="combobox"
          aria-expanded={showList}
          aria-controls={listId}
          aria-autocomplete="list"
          aria-activedescendant={active >= 0 ? `${listId}-${active}` : undefined}
          aria-describedby={describedBy}
          autoComplete="off"
          spellCheck={false}
          placeholder={placeholder}
          value={value}
          maxLength={60}
          onFocus={() => {
            setQuery("");
            setOpen(true);
          }}
          onClick={() => setOpen(true)}
          onBlur={() => setOpen(false)}
          onChange={(e) => {
            onChange(e.target.value);
            setQuery(e.target.value);
            setOpen(true);
          }}
          onKeyDown={onKeyDown}
        />
        <button
          type="button"
          className="loc-toggle"
          tabIndex={-1}
          aria-label={showList ? "Hide states" : "Show all states"}
          // Keep focus in the field so the list does not close on mousedown.
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => {
            setQuery("");
            setOpen((o) => !o);
            input.current?.focus();
          }}
        >
          <ChevronDown size={18} aria-hidden="true" />
        </button>
      </div>

      {showList && (
        <ul ref={list} id={listId} role="listbox" className="loc-list" aria-label="US states" onMouseDown={(e) => e.preventDefault()}>
          {options.length > 0 && (
            <li role="presentation" className="loc-group" aria-hidden="true">
              US states · rate and sun hours
            </li>
          )}
          {options.length === 0 && <li className="loc-note">No matching US state. You can keep your own text.</li>}
          {options.map((s, i) => (
            <li
              key={s.code}
              id={`${listId}-${i}`}
              data-index={i}
              role="option"
              aria-selected={i === active}
              className={`loc-option ${i === active ? "is-active" : ""}`}
              onMouseEnter={() => setActive(i)}
              onClick={() => pick(s)}
            >
              <span className="loc-label">{s.name}</span>
              <span className="loc-detail">
                ${s.rate.toFixed(2)}/kWh · {s.sunHours} h sun
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
