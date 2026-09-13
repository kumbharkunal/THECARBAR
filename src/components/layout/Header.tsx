"use client";

import Image from "next/image";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { NAV_LINKS } from "@/data/navigation";
import { CALL_HREF, CONTACT, FIND_MY_CAR_HREF, SITE, WHATSAPP_HREF } from "@/data/site";
import { track } from "@/lib/analytics";
import { WhatsAppIcon } from "@/components/ui/icons";
import { cn } from "@/lib/utils";

/**
 * A floating pill that never hides on scroll direction — direction-flip navs
 * flicker, and there is nothing to gain here. Only the ground changes: clear
 * over the top of the page, frosted once you are past it. The two thresholds
 * give it hysteresis so it cannot oscillate at the boundary.
 */
const GROUND_ON = 110;
const GROUND_OFF = 55;

export function Header() {
  const [open, setOpen] = useState(false);
  const [grounded, setGrounded] = useState(false);
  const [active, setActive] = useState<string | null>(null);

  const panelId = useId();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const read = () =>
      setGrounded((was) =>
        was ? window.scrollY > GROUND_OFF : window.scrollY > GROUND_ON,
      );
    read();
    window.addEventListener("scroll", read, { passive: true });
    return () => window.removeEventListener("scroll", read);
  }, []);

  // Which section is in view, so the pill has something to mark.
  useEffect(() => {
    const sections = NAV_LINKS.map((l) =>
      document.querySelector<HTMLElement>(l.href),
    ).filter(Boolean) as HTMLElement[];
    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive(`#${visible.target.id}`);
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: [0, 0.25, 0.6] },
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  const close = useCallback(() => {
    setOpen(false);
    triggerRef.current?.focus();
  }, []);

  // Scroll lock, focus trap and Escape while the panel is open.
  useEffect(() => {
    if (!open) return;

    document.documentElement.style.overflow = "clip";
    const panel = panelRef.current;
    const focusable = panel
      ? Array.from(
          panel.querySelectorAll<HTMLElement>("a[href], button:not([disabled])"),
        ).filter((el) => el.offsetParent !== null)
      : [];
    focusable[0]?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        close();
        return;
      }
      if (event.key !== "Tab" || !focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.documentElement.style.removeProperty("overflow");
    };
  }, [open, close]);

  return (
    <>
      <header
        className={cn(
          "fixed left-1/2 top-3 z-50 flex max-w-[calc(100vw-1.5rem)] -translate-x-1/2 items-center gap-1 whitespace-nowrap rounded-full py-1.5 pl-4 pr-1.5 transition-all duration-500 md:top-4 md:pl-5",
          grounded
            ? "border border-green-line/80 bg-white/80 backdrop-blur-xl backdrop-saturate-150 lift"
            : "border border-transparent bg-white/40 backdrop-blur-md",
        )}
      >
        <a
          href="#top"
          className="mr-1 shrink-0"
          aria-label={`${SITE.name} — home`}
        >
          <Image
            src="/brand/logo.png"
            alt={SITE.name}
            width={2084}
            height={754}
            priority
            sizes="(max-width: 768px) 160px, 190px"
            className="h-9 w-auto md:h-10"
          />
        </a>

        <nav aria-label="Primary" className="hidden lg:block">
          <ul className="flex items-center">
            {NAV_LINKS.map((link) => {
              const isActive = active === link.href;
              return (
                <li key={link.href}>
                  <a
                    href={link.href}
                    aria-current={isActive ? "true" : undefined}
                    className={cn(
                      "relative flex h-9 items-center rounded-full px-3.5 text-[0.82rem] font-medium transition-colors duration-300",
                      isActive
                        ? "text-green-deep"
                        : "text-ink-soft hover:text-ink",
                    )}
                  >
                    {isActive && (
                      <span
                        aria-hidden
                        className="absolute inset-0 -z-10 rounded-full bg-green-soft"
                      />
                    )}
                    {link.label}
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="ml-1 flex shrink-0 items-center gap-1.5">
          <a
            href={FIND_MY_CAR_HREF}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => track("nav_cta_click")}
            className="hidden h-9 items-center rounded-full bg-green px-5 text-[0.8rem] font-semibold text-ink transition-colors duration-300 hover:bg-green-deep hover:text-white sm:inline-flex"
          >
            Find my car
          </a>

          <button
            ref={triggerRef}
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls={panelId}
            className="grid h-9 w-9 place-items-center rounded-full bg-green-soft text-ink transition-colors hover:bg-green-line lg:hidden"
          >
            <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
            <span aria-hidden className="grid w-[1.05rem] gap-[0.3rem]">
              <i
                className={cn(
                  "block h-[1.5px] rounded-full bg-ink transition-transform duration-300",
                  open && "translate-y-[0.22rem] rotate-[18deg]",
                )}
              />
              <i
                className={cn(
                  "block h-[1.5px] rounded-full bg-ink transition-transform duration-300",
                  open && "-translate-y-[0.22rem] -rotate-[18deg]",
                )}
              />
            </span>
          </button>
        </div>
      </header>

      {/* Full-screen panel: sweeps down, links wipe up under it. */}
      <div
        id={panelId}
        ref={panelRef}
        inert={!open}
        className={cn(
          "fixed inset-0 z-[45] flex flex-col justify-between gap-8 bg-paper px-[clamp(1.15rem,4.5vw,4.5rem)] pb-[calc(2rem+env(safe-area-inset-bottom))] pt-[calc(var(--nav-h)+2.5rem)] lg:hidden",
          "[transition:clip-path_620ms_cubic-bezier(0.16,1,0.3,1),visibility_0s_linear_620ms]",
          open
            ? "visible [clip-path:inset(0_0_0%_0)] [transition:clip-path_620ms_cubic-bezier(0.16,1,0.3,1),visibility_0s_linear_0s]"
            : "invisible [clip-path:inset(0_0_100%_0)]",
        )}
      >
        <nav aria-label="Primary, expanded">
          <ul className="grid gap-1">
            {NAV_LINKS.map((link, i) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={close}
                  style={{ transitionDelay: open ? `${0.2 + i * 0.045}s` : "0s" }}
                  className={cn(
                    "flex min-h-[2.75rem] items-baseline gap-4 py-1.5 font-display text-[clamp(2.1rem,1rem+6.5vw,3.2rem)] font-semibold leading-[1.04] tracking-tight text-ink",
                    "[transition:clip-path_560ms_cubic-bezier(0.16,1,0.3,1),transform_560ms_cubic-bezier(0.16,1,0.3,1)]",
                    open
                      ? "translate-y-0 [clip-path:inset(0_0_0%_0)]"
                      : "translate-y-3.5 [clip-path:inset(0_0_100%_0)]",
                  )}
                >
                  <span className="font-mono text-[0.7rem] font-normal tracking-widest text-green">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span>{link.label}</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div
          style={{ transitionDelay: open ? "0.46s" : "0s" }}
          className={cn(
            "grid justify-items-start gap-3 border-t border-green-line pt-6",
            "[transition:clip-path_560ms_cubic-bezier(0.16,1,0.3,1),transform_560ms_cubic-bezier(0.16,1,0.3,1)]",
            open
              ? "translate-y-0 [clip-path:inset(0_0_0%_0)]"
              : "translate-y-3.5 [clip-path:inset(0_0_100%_0)]",
          )}
        >
          <a
            href={CALL_HREF}
            onClick={() => track("call_click", { source: "menu" })}
            className="flex min-h-[2.75rem] items-center font-mono text-sm tracking-wide text-ink-soft"
          >
            {CONTACT.phoneDisplay}
          </a>
          <div className="flex w-full flex-wrap gap-2.5">
            <a
              href={FIND_MY_CAR_HREF}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => {
                track("nav_cta_click");
                close();
              }}
              className="inline-flex min-h-[3.25rem] flex-1 items-center justify-center rounded-full bg-green px-6 text-[0.8rem] font-semibold uppercase tracking-[0.1em] text-ink"
            >
              Find my car
            </a>
            <a
              href={WHATSAPP_HREF}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => track("whatsapp_click", { source: "menu" })}
              aria-label="Message us on WhatsApp"
              className="inline-flex min-h-[3.25rem] w-[3.25rem] items-center justify-center rounded-full border border-green-line text-green-deep"
            >
              <WhatsAppIcon size={20} />
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
