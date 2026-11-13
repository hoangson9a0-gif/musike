import { useState } from "react";
import { useT } from "../i18n";
import { Modal } from "./Modal";

const LAUNCHES_KEY = "musike:launches";
const SEEN_KEY = "musike:support-seen";

/** Counted once per app load (StrictMode mounts twice in dev). */
let launchCounted = false;

/** The second notice: from the second launch on, once. */
function shouldShow(): boolean {
  try {
    if (localStorage.getItem(SEEN_KEY) === "1") return false;
    if (!launchCounted) {
      launchCounted = true;
      const launches = Number(localStorage.getItem(LAUNCHES_KEY) ?? "0") + 1;
      localStorage.setItem(LAUNCHES_KEY, String(launches));
    }
    return Number(localStorage.getItem(LAUNCHES_KEY) ?? "0") >= 2;
  } catch {
    return false;
  }
}

/** Thanks for using the app, with a way to support the fork. Shown once. */
export function SupportDialog() {
  const t = useT();
  const [open, setOpen] = useState(shouldShow);
  const [showQr, setShowQr] = useState(false);

  const dismiss = () => {
    try {
      localStorage.setItem(SEEN_KEY, "1");
    } catch {
      /* private mode */
    }
    setOpen(false);
  };

  return (
    <Modal open={open} onClose={dismiss} title={t.support.title}>
      {showQr ? (
        <div className="flex flex-col items-center gap-3">
          <img src="/donate-qr.jpg" alt={t.support.scan} className="w-full max-w-[300px] rounded-2xl" />
          <p className="text-center text-[15px] text-fg-2">{t.support.scan}</p>
          <button
            type="button"
            onClick={dismiss}
            className="mt-1 flex h-11 w-full items-center justify-center rounded-full bg-surface-1 text-[15px] font-medium ring-1 ring-line transition-transform active:scale-[0.98]"
          >
            {t.common.close}
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <p className="text-[15px] leading-relaxed text-fg-2">{t.support.body}</p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={dismiss}
              className="flex h-11 flex-1 items-center justify-center rounded-full bg-surface-1 text-[15px] font-medium ring-1 ring-line transition-transform active:scale-[0.98]"
            >
              {t.support.ok}
            </button>
            <button
              type="button"
              onClick={() => setShowQr(true)}
              className="flex h-11 flex-[2] items-center justify-center rounded-full bg-accent px-3 text-[15px] font-semibold text-accent-ink transition-transform active:scale-[0.98]"
            >
              {t.support.coffee}
            </button>
          </div>
        </div>
      )}
    </Modal>
  );
}
