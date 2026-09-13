import Image from "next/image";
import { NAV_LINKS } from "@/data/navigation";
import { CALL_HREF, CONTACT, SITE, WHATSAPP_HREF } from "@/data/site";

export function Footer() {
  return (
    <footer id="contact" className="scroll-mt-24 bg-paper-2">
      <div className="shell py-14 md:py-20">
        <div className="grid gap-12 sm:grid-cols-2 sm:gap-10 lg:grid-cols-[1.3fr_1fr_1fr] lg:gap-14">
          <div className="sm:col-span-2 lg:col-span-1">
            <Image
              src="/brand/logo.png"
              alt={SITE.name}
              width={2084}
              height={754}
              sizes="240px"
              className="h-9 w-auto sm:h-10"
            />
            <p className="display-md mt-6 max-w-sm uppercase text-ink md:mt-7">
              {SITE.proposition}
            </p>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-ink-soft">
              THE CAR-BAR connects your requirement with authorised sellers across
              its network and helps coordinate the next step. The purchase is
              completed directly with the authorised seller.
            </p>
          </div>

          <nav aria-label="Footer">
            <h2 className="label-mono text-green-deep">Explore</h2>
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
            <h2 className="label-mono text-green-deep">Get in touch</h2>
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
                  Instagram {SITE.instagramHandle}
                </a>
              </li>
            </ul>

            <ul className="mt-7 flex flex-col gap-3 font-mono text-[0.68rem] uppercase tracking-[0.12em] text-ink-soft">
              <li>Privacy policy</li>
              <li>Terms of service</li>
            </ul>
          </div>
        </div>

        <div className="rule-line mt-12 flex flex-col gap-4 pt-7 sm:flex-row sm:items-start sm:justify-between sm:gap-8 md:mt-14">
          <p className="font-mono text-[0.66rem] uppercase leading-relaxed tracking-[0.14em] text-ink-soft">
            © {new Date().getFullYear()} {SITE.name} · {SITE.serviceArea}
          </p>
          <p className="max-w-md font-mono text-[0.66rem] leading-relaxed tracking-[0.04em] text-ink-soft">
            Vehicle availability is always subject to confirmation with the
            relevant authorised seller.
          </p>
        </div>
      </div>
    </footer>
  );
}
