import { publicEnv } from "./env";
import { whatsapp } from "./content";

/**
 * wa.me chat link with a prefilled message. Returns "" when NEXT_PUBLIC_WHATSAPP_NUMBER
 * is not set, so callers can hide WhatsApp buttons instead of linking nowhere.
 */
export function whatsappUrl(message: string = whatsapp.defaultMessage) {
  const number = publicEnv.whatsapp.replace(/\D/g, "");
  if (!number) return "";
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}
