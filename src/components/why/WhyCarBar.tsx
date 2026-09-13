import {
  Clock,
  Handshake,
  Layers,
  MapPinned,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";

const REASONS = [
  {
    icon: Clock,
    title: "Shorter waiting",
    body: "A wait quoted by one showroom reflects that showroom's allocation — not every possibility available to you.",
  },
  {
    icon: MapPinned,
    title: "Pan-India network",
    body: "We look beyond your city, across authorised sellers beyond a single local allocation.",
  },
  {
    icon: Layers,
    title: "Multi-brand",
    body: "Your requirement isn't tied to one manufacturer's showroom or one brand's stock position.",
  },
  {
    icon: UserRound,
    title: "Personal assistance",
    body: "You talk to a person who understands the specification you asked for, not a form.",
  },
  {
    icon: ShieldCheck,
    title: "Transparent process",
    body: "You know which authorised seller you're being connected with, and what has been confirmed.",
  },
  {
    icon: Handshake,
    title: "Customer-first",
    body: "We tell you what is actually possible — including when the answer is that nothing suitable is available.",
  },
] as const;

export function WhyCarBar() {
  return (
    <section id="why" className="scroll-mt-24 bg-paper py-16 md:py-24">
      <div className="shell">
        <SectionHeading
          eyebrow="Why THE CAR-BAR"
          title="Built around one question: what's actually possible?"
        />

        <Reveal stagger=".why-row" className="mt-10 md:mt-12">
          {/* Negative inset lets the hover wash bleed past the type without
              breaking the rule alignment. */}
          <ul className="rule-line -mx-4 px-4 md:-mx-6 md:px-6">
            {REASONS.map(({ icon: Icon, title, body }) => (
              <li
                key={title}
                className="why-row group -mx-4 grid grid-cols-[auto_minmax(0,1fr)] items-baseline gap-x-4 gap-y-2 border-b border-line px-4 py-5 transition-colors duration-300 hover:bg-green-soft md:-mx-6 md:grid-cols-[auto_minmax(0,17rem)_minmax(0,1fr)] md:gap-x-8 md:px-6 md:py-6"
              >
                <Icon
                  size={20}
                  strokeWidth={1.5}
                  aria-hidden
                  className="text-green transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-0.5 md:mt-1"
                />
                <h3 className="font-display text-[1.4rem] uppercase leading-[1.05] tracking-tight text-ink sm:text-2xl md:text-[1.75rem]">
                  {title}
                </h3>
                <p className="col-start-2 max-w-xl text-[0.95rem] leading-relaxed text-ink-soft md:col-start-auto">
                  {body}
                </p>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
