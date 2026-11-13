import { useState } from "react";
import { useT } from "../i18n";
import { Modal } from "./Modal";

const SEEN_KEY = "musike:welcome-seen";

function readSeen(): boolean {
  try {
    return localStorage.getItem(SEEN_KEY) === "1";
  } catch {
    return true; // storage blocked: don't nag on every launch
  }
}

/** First-launch notice: what Musike is, who made it, and that this is a fork. Shown once. */
export function WelcomeDialog() {
  const t = useT();
  const [open, setOpen] = useState(() => !readSeen());

  const dismiss = () => {
    try {
      localStorage.setItem(SEEN_KEY, "1");
    } catch {
      /* private mode */
    }
    setOpen(false);
  };

  return (
    <Modal open={open} onClose={dismiss} title={t.welcome.title}>
      <div className="flex flex-col gap-3 text-[15px] leading-relaxed text-fg-2">
        <p>{t.welcome.about}</p>
        <p>
          <a
            href="https://github.com/Ernani1234/musike"
            target="_blank"
            rel="noreferrer"
            className="font-medium text-accent-text underline-offset-2 hover:underline"
          >
            github.com/Ernani1234/musike
          </a>
        </p>
        <p>{t.welcome.fork}</p>
        <p>{t.welcome.thanks}</p>
        <button
          type="button"
          onClick={dismiss}
          className="mt-1 flex h-11 items-center justify-center rounded-full bg-accent text-[15px] font-semibold text-accent-ink transition-transform active:scale-[0.98]"
        >
          {t.welcome.start}
        </button>
      </div>
    </Modal>
  );
}
