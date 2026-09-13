import { TRUST_POINTS } from "@/data/site";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";

export function Transparency() {
  return (
    <section className="bg-paper-2 py-16 md:py-24">
      <div className="shell">
        <div className="grid gap-10 md:gap-14 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
          <SectionHeading
            tone="light"
            eyebrow="Transparency"
            title="We don't ask you to trust blindly."
            intro="Every part of the arrangement can be checked before you commit to anything."
          />

          <Reveal stagger=".trust-row">
            <ul>
              {TRUST_POINTS.map((point, i) => (
                <li
                  key={point.title}
                  className="trust-row grid gap-1.5 rule-line py-5 md:grid-cols-[auto_1fr] md:gap-8 md:py-6"
                >
                  <span className="font-mono text-[0.68rem] tracking-[0.12em] text-green-deep md:pt-1.5">
                    0{i + 1}
                  </span>
                  <div className="min-w-0">
                    <h3 className="font-display text-xl uppercase tracking-tight text-ink">
                      {point.title}
                    </h3>
                    <p className="mt-2 max-w-lg text-[0.95rem] leading-relaxed text-ink-soft">
                      {point.body}
                    </p>
                  </div>
                </li>
              ))}
            </ul>

            <p className="mt-8 max-w-lg border-l-2 border-green pl-5 text-[0.95rem] leading-relaxed text-ink-soft md:mt-10">
              THE CAR-BAR is a car-arrangement service, not a vehicle seller. We
              connect your requirement with authorised sellers and help coordinate
              — the sale itself is always theirs.
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
