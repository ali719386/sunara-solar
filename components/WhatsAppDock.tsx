import { whatsapp } from "@/lib/content";
import { whatsappUrl } from "@/lib/whatsapp";
import { Button } from "./Button";
import { WhatsAppIcon } from "./WhatsAppIcon";

/**
 * Floating WhatsApp button (all screens) plus a sticky quote/WhatsApp bar on phones.
 * The floating button sits above the bar on mobile; the bar respects the safe area.
 */
export function WhatsAppDock() {
  const href = whatsappUrl();
  return (
    <>
      {href && (
        <a href={href} target="_blank" rel="noopener noreferrer" className="wa-float" aria-label={whatsapp.chat}>
          <WhatsAppIcon size={28} />
        </a>
      )}
      <div className="wa-bar">
        <Button href={whatsapp.stickyQuote.href} className="wa-bar-btn">
          {whatsapp.stickyQuote.label}
        </Button>
        {href && (
          <a href={href} target="_blank" rel="noopener noreferrer" className="btn btn-wa wa-bar-btn">
            <WhatsAppIcon size={18} />
            <span className="btn-label">{whatsapp.short}</span>
          </a>
        )}
      </div>
    </>
  );
}
