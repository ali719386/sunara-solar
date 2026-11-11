import { whatsapp } from "@/lib/content";
import { whatsappUrl } from "@/lib/whatsapp";
import { Button } from "./Button";
import { WhatsAppIcon } from "./WhatsAppIcon";

/**
 * Sticky quote/WhatsApp bar on phones. The floating WhatsApp button now lives in the
 * chat dock (ChatWidget), which sits above this bar; the bar respects the safe area.
 */
export function WhatsAppDock() {
  const href = whatsappUrl();
  return (
    <>
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
