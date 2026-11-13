import { CheckIcon, MoonIcon, XIcon } from "@phosphor-icons/react";
import { useEffect, useState, type ReactNode } from "react";
import { useT } from "../i18n";
import { cn, formatTime } from "../lib/format";
import { usePlayer } from "../player/player";

const OPTIONS = [15, 30, 45, 60, 90];

function Item({
  icon,
  active,
  onClick,
  children,
}: {
  icon: ReactNode;
  active?: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      role="menuitem"
      onClick={onClick}
      className={cn(
        "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition-colors hover:bg-surface-3",
        active ? "font-medium text-fg" : "text-fg-2 hover:text-fg",
      )}
    >
      <span className="w-4 shrink-0 text-accent-text">{active ? <CheckIcon size={16} /> : icon}</span>
      {children}
    </button>
  );
}

/** Sleep timer: stop playback after a set time, or at the end of the current track. */
export function SleepTimer({ className }: { className?: string }) {
  const t = useT();
  const sleepUntil = usePlayer((s) => s.sleepUntil);
  const sleepRemaining = usePlayer((s) => s.sleepRemaining);
  const sleepEndOfTrack = usePlayer((s) => s.sleepEndOfTrack);
  const setSleepTimer = usePlayer((s) => s.setSleepTimer);
  const setSleepEndOfTrack = usePlayer((s) => s.setSleepEndOfTrack);
  const [open, setOpen] = useState(false);
  const active = sleepUntil !== null || sleepEndOfTrack;

  const label = active
    ? sleepEndOfTrack
      ? t.player.sleepTimer.endOfTrack
      : t.player.sleepTimer.endsIn(formatTime(sleepRemaining))
    : t.player.sleepTimer.title;

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open ]);

  const pick = (fn: () => void) => () => {
    fn();
    setOpen(false);
  };

  return (
    <div className={cn("relative", className)}>
      <button
        type="button"
        aria-label={label}
        aria-expanded={open}
        title={label}
        onClick={() => setOpen((o) => !o)}
        className={cn(
          "flex h-9 items-center gap-1.5 rounded-full px-3 text-[13px] font-medium ring-1 transition-colors duration-200",
          active ? "bg-accent-soft text-accent-text ring-accent/40" : "text-fg-2 ring-line hover:text-fg",
        )}
      >
        <MoonIcon size={15} />
        {active && !sleepEndOfTrack ? (
          <span className="font-mono tabular-nums">{formatTime(sleepRemaining)}</span>
        ) : (
          label
        )}
      </button>
      {open && (
        <>
          <button
            type="button"
            aria-hidden
            tabIndex={-1}
            className="fixed inset-0 z-40 cursor-default"
            onClick={() => setOpen(false)}
          />
          <div
            role="menu"
            aria-label={t.player.sleepTimer.title}
            className="absolute bottom-[calc(100%+8px)] left-1/2 z-50 w-56 max-w-[calc(100vw-32px)] -translate-x-1/2 rounded-2xl bg-surface-2 p-1.5 shadow-xl ring-1 ring-line"
          >
            <p className="px-3 pt-2 pb-1 text-xs font-medium text-fg-3">{t.player.sleepTimer.title}</p>
            {OPTIONS.map((n) => (
              <Item
                key={n}
                icon={<MoonIcon size={16} className="text-fg-2" />}
                active={sleepUntil !== null && Math.ceil(sleepRemaining / 60) === n}
                onClick={pick(() => setSleepTimer(n))}
              >
                {t.player.sleepTimer.minutes(n)}
              </Item>
            ))}
            <Item
              icon={<MoonIcon size={16} className="text-fg-2" />}
              active={sleepEndOfTrack}
              onClick={pick(setSleepEndOfTrack)}
            >
              {t.player.sleepTimer.endOfTrack}
            </Item>
            {active && (
              <Item icon={<XIcon size={16} className="text-danger" />} onClick={pick(() => setSleepTimer(null))}>
                {t.player.sleepTimer.off}
              </Item>
            )}
          </div>
        </>
      )}
    </div>
  );
}
