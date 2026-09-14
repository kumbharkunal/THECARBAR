import Image from "next/image";
import { ArrowUpRight, Phone } from "lucide-react";
import { NAV_LINKS } from "@/data/navigation";
import { CALL_HREF, CONTACT, FIND_MY_CAR_HREF, SITE, WHATSAPP_HREF } from "@/data/site";
import { SOCIALS } from "@/data/social";
import { SocialIcon } from "@/components/ui/SocialIcon";

export function Footer() {
  return (
    <footer id="contact" className="scroll-mt-24 border-t border-line bg-paper-2">
      <div className="shell py-14 md:py-20">
        {/* A last, quiet invitation before the legal lines. */}
        <div className="flex flex-col gap-6 border-b border-line pb-12 md:flex-row md:items-end md:justify-between md:gap-10">
          <div>
            <Image
              src="/brand/logo.png"
              alt={SITE.name}
              width={2084}
              height={754}
              sizes="240px"
              className="h-10 w-auto md:h-11"
            />
            <p className="display-md mt-6 max-w-sm uppercase text-ink">
              {SITE.proposition}
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <a
              href={FIND_MY_CAR_HREF}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[52px] items-center justify-center gap-2.5 rounded-full bg-green px-7 font-mono text-[0.72rem] uppercase tracking-[0.14em] text-ink transition-colors duration-300 hover:bg-green-deep hover:text-white"
            >
              Find my car
              <ArrowUpRight size={16} strokeWidth={2} aria-hidden />
            </a>
            <a
              href={CALL_HREF}
              className="inline-flex min-h-[52px] items-center justify-center gap-2.5 rounded-full border border-line bg-paper px-6 font-mono text-[0.72rem] tracking-[0.08em] text-ink transition-colors duration-300 hover:border-green-line hover:bg-green-soft"
            >
              <Phone size={15} strokeWidth={2} aria-hidden className="text-green-deep" />
              {CONTACT.phoneDisplay}
            </a>
          </div>
        </div>

        <div className="grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <h2 className="label-mono text-ink-faint">Follow</h2>
            <ul className="mt-5 flex flex-wrap gap-2.5">
              {SOCIALS.map((social) =>
                social.href ? (
                  <li key={social.label}>
                    <a
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={social.label}
                      className="group inline-flex h-12 w-12 items-center justify-center rounded-full border border-line bg-paper transition-all duration-300 hover:-translate-y-0.5 hover:border-green-line hover:bg-green-soft"
                    >
                      <SocialIcon src={social.icon} label={social.label} size={19} />
                    </a>
                  </li>
                ) : (
                  // No URL supplied yet — shown, but not a dead link.
                  <li key={social.label}>
                    <span
                      title={`${social.label} — link not supplied yet`}
                      className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-dashed border-line bg-paper opacity-40"
                    >
                      <SocialIcon src={social.icon} label={social.label} size={19} />
                    </span>
                  </li>
                ),
              )}
            </ul>
            <p className="mt-6 max-w-sm text-sm leading-relaxed text-ink-soft">
              THE CAR-BAR connects your requirement with authorised sellers across
              its network and helps coordinate the next step. The purchase is
              completed directly with the authorised seller.
            </p>
          </div>

          <nav aria-label="Footer">
            <h2 className="label-mono text-ink-faint">Explore</h2>
            <ul className="mt-5 flex flex-col gap-1">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="inline-flex min-h-11 items-center text-sm text-ink transition-colors hover:text-green-deep"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className="label-mono text-ink-faint">Get in touch</h2>
            <ul className="mt-5 flex flex-col gap-1 text-sm">
              <li>
                <a
                  href={WHATSAPP_HREF}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-11 items-center text-ink transition-colors hover:text-green-deep"
                >
                  WhatsApp
                </a>
              </li>
              <li>
                <a
                  href={CALL_HREF}
                  className="inline-flex min-h-11 items-center text-ink transition-colors hover:text-green-deep"
                >
                  {CONTACT.phoneDisplay}
                </a>
              </li>
              <li>
                <a
                  href={SITE.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-11 items-center text-ink transition-colors hover:text-green-deep"
                >
                  {SITE.instagramHandle}
                </a>
              </li>
            </ul>

            <ul className="mt-6 flex flex-col gap-1 font-mono text-[0.68rem] uppercase tracking-[0.1em] text-ink-faint">
              <li className="py-1">Privacy policy</li>
              <li className="py-1">Terms of service</li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col gap-4 border-t border-line pt-7 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-mono text-[0.68rem] uppercase tracking-[0.12em] text-ink-faint">
            © {new Date().getFullYear()} {SITE.name} · {SITE.serviceArea}
          </p>
          <p className="max-w-md font-mono text-[0.68rem] leading-relaxed tracking-[0.04em] text-ink-faint">
            Vehicle availability is always subject to confirmation with the
            relevant authorised seller.
          </p>
        </div>
      </div>
    </footer>
  );
}
