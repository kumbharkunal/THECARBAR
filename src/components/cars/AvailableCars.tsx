"use client";

import { useRef } from "react";
import { ArrowUpRight } from "lucide-react";
import { AVAILABILITY_LABEL, CARS, type Car } from "@/data/cars";
import { WHATSAPP_HREF } from "@/data/site";
import { track } from "@/lib/analytics";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { DemoNote } from "@/components/ui/DemoNote";
import { MediaFrame } from "@/components/ui/MediaFrame";

function enquiryHref(car: Car) {
  const message = `Hi THE CAR-BAR, I'd like to check availability for a ${car.brand} ${car.model} ${car.variant} (${car.transmission}, ${car.colour}).`;
  return `${WHATSAPP_HREF.split("?")[0]}?text=${encodeURIComponent(message)}`;
}

export function AvailableCars() {
  const rail = useRef<HTMLDivElement>(null);

  return (
    <section
      id="available-cars"
      className="scroll-mt-24 overflow-hidden bg-paper-2 py-16 md:py-24"
    >
      <div className="shell">
        <SectionHeading
          eyebrow="Explore"
          tone="light"
          title="Explore available options"
          intro="A sample of the models customers ask us about most. These are not listings — tell us the specification you want and we'll check what's possible."
        />
      </div>

      {/* Inside a shell so the first card lines up under the heading. */}
      <div className="shell mt-10 md:mt-14">
        <div
          ref={rail}
          className="rail-scroll rail-inset flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4 sm:gap-5"
        >
        {CARS.map((car, i) => (
          <article
            key={car.slug}
            className="group flex w-[80vw] min-w-[16.5rem] shrink-0 snap-start flex-col overflow-hidden rounded-2xl border border-line bg-white lift transition-[border-color,box-shadow] duration-500 hover:border-green-line hover:lift-lg sm:w-[46vw] lg:w-[24rem]"
          >
            <div className="relative overflow-hidden border-b border-line-soft">
              <MediaFrame
                src={car.image}
                alt={`${car.brand} ${car.model} — ${car.colour}`}
                seed={i}
                sizes="(max-width: 640px) 80vw, (max-width: 1024px) 46vw, 24rem"
                className="aspect-[4/3] transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03]"
              />
              <span className="absolute left-3 top-3 rounded-full border border-green-line bg-green-soft px-3 py-1.5 font-mono text-[0.6rem] uppercase tracking-[0.12em] text-green-deep sm:left-4 sm:top-4">
                {AVAILABILITY_LABEL[car.availability]}
              </span>
            </div>

            <div className="flex flex-1 flex-col p-5 sm:p-6">
              <p className="label-mono text-green-deep">{car.brand}</p>
              <h3 className="mt-1.5 font-display text-[1.6rem] uppercase tracking-tight text-ink sm:text-2xl">
                {car.model}
              </h3>
              <p className="mt-1 text-sm text-ink-soft">{car.variant}</p>

              <dl className="mt-6 grid grid-cols-2 gap-x-4 gap-y-3 border-t border-line pt-5">
                {[
                  ["Fuel", car.fuel],
                  ["Transmission", car.transmission],
                  ["Seating", `${car.seating} seater`],
                  ["Colour", car.colour],
                ].map(([label, value]) => (
                  <div key={label}>
                    <dt className="font-mono text-[0.68rem] uppercase tracking-[0.08em] text-ink-soft sm:text-[0.6rem] sm:tracking-[0.1em]">
                      {label}
                    </dt>
                    <dd className="mt-0.5 text-[0.82rem] text-ink">{value}</dd>
                  </div>
                ))}
              </dl>

              <p className="mt-auto pt-6 font-mono text-[0.62rem] uppercase tracking-[0.1em] text-ink-soft">
                Authorised seller · {car.location}
              </p>

              <a
                href={enquiryHref(car)}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() =>
                  track("car_enquiry_click", { model: `${car.brand} ${car.model}` })
                }
                className="mt-4 inline-flex min-h-[48px] items-center justify-between gap-3 rounded-full border border-green px-5 font-mono text-[0.68rem] uppercase tracking-[0.14em] text-green-deep transition-colors duration-300 hover:bg-green hover:text-ink"
              >
                Check availability
                <ArrowUpRight size={15} strokeWidth={2} aria-hidden />
              </a>
            </div>
          </article>
        ))}
        </div>
      </div>

      <div className="shell mt-8">
        <DemoNote tone="light" className="max-w-xl">
          Showcase selection, not live inventory. Availability, variant and colour
          are always confirmed with the relevant authorised seller before anything
          moves forward.
        </DemoNote>
      </div>
    </section>
  );
}
