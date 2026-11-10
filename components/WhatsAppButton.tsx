import { whatsapp } from "@/lib/content";
import { whatsappUrl } from "@/lib/whatsapp";
import { WhatsAppIcon } from "./WhatsAppIcon";

/** Green WhatsApp button with the icon on the left. Renders nothing until a number is configured. */
export function WhatsAppButton({
  label = whatsapp.chat,
  message,
  className = "",
}: {
  label?: string;
  message?: string;
  className?: string;
}) {
  const href = whatsappUrl(message);
  if (!href) return null;
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={`btn btn-wa ${className}`}>
      <WhatsAppIcon size={18} />
      <span className="btn-label">{label}</span>
    </a>
  );
}
