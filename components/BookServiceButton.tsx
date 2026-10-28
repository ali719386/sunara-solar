"use client";

import type { ServiceType } from "@/lib/content";
import { Button } from "./Button";
import { selectService } from "./QuoteForm";

/** Preselects the service in the quote form, then scrolls to it. */
export function BookServiceButton({ service, label }: { service: ServiceType; label: string }) {
  return (
    <Button href="#quote" onClick={() => selectService(service)}>
      {label}
    </Button>
  );
}
