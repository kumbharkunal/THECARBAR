import { STORIES } from "@/data/stories";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { MediaFrame } from "@/components/ui/MediaFrame";
import { Reveal } from "@/components/ui/Reveal";

export function CustomerStories() {
  const [lead, ...rest] = STORIES;

  return (
    <section className="bg-paper py-16 md:py-24">
      <div className="shell">
        <SectionHeading
          eyebrow="Customer stories"
          title="Requirements that found an answer."
        />

        <Reveal stagger=".story-item" className="mt-10 md:mt-12">
          <div className="grid gap-4 sm:gap-5 lg:grid-cols-2">
            <figure className="story-item overflow-hidden rounded-2xl border border-line bg-paper lift transition duration-500 hover:border-green-line hover:lift-lg">
              <MediaFrame
                src={lead.image}
                alt={`${lead.vehicle} delivered in ${lead.city}`}
                seed={8}
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="aspect-[4/3] lg:aspect-[16/10]"
              />
              <figcaption className="p-6 sm:p-7">
                <p className="label-mono text-green-deep">{lead.city}</p>
                <h3 className="display-md mt-3 uppercase text-ink">
                  {lead.headline}
                </h3>
                {lead.vehicle && (
                  <p className="mt-3 font-mono text-[0.68rem] uppercase tracking-[0.1em] text-ink-faint">
                    {lead.vehicle}
                  </p>
                )}
              </figcaption>
            </figure>

            <div className="grid gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-1">
              {rest.map((story, i) => (
                <figure
                  key={story.id}
                  className="story-item flex flex-col overflow-hidden rounded-2xl border border-line bg-paper lift transition duration-500 hover:border-green-line hover:lift-lg lg:flex-row"
                >
                  <MediaFrame
                    src={story.image}
                    alt={`${story.vehicle} in ${story.city}`}
                    seed={9 + i}
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="aspect-[4/3] shrink-0 lg:aspect-square lg:w-44 xl:w-52"
                  />
                  <figcaption className="flex min-w-0 flex-col justify-center p-5 sm:p-6">
                    <p className="label-mono text-green-deep">{story.city}</p>
                    <h3 className="mt-2.5 font-display text-lg uppercase leading-tight tracking-tight text-ink sm:text-xl">
                      {story.headline}
                    </h3>
                    {story.vehicle && (
                      <p className="mt-2 font-mono text-[0.66rem] uppercase tracking-[0.1em] text-ink-faint">
                        {story.vehicle}
                      </p>
                    )}
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </Reveal>

      </div>
    </section>
  );
}
