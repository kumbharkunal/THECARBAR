import { cn } from "@/lib/utils";

/** The visitor's requirement, made concrete. Illustrative example, not a live quote. */
export const REQUIREMENT = [
  { label: "Model", value: "Toyota Fortuner" },
  { label: "Transmission", value: "Automatic" },
  { label: "Colour", value: "Black" },
  { label: "Location", value: "Pune" },
] as const;

export function RequirementCard({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "lift w-full max-w-[19rem] rounded-xl border border-line bg-white p-5 sm:p-6 lg:w-[clamp(15rem,23vw,19rem)]",
        className,
      )}
    >
      <p className="label-mono flex items-center gap-2 text-green-deep">
        <span aria-hidden className="inline-block h-1.5 w-1.5 rounded-full bg-green" />
        Your requirement
      </p>

      <dl className="mt-4 flex flex-col gap-2.5">
        {REQUIREMENT.map((row) => (
          <div
            key={row.label}
            className="flex items-baseline justify-between gap-4 border-b border-line-soft pb-2.5 last:border-0 last:pb-0"
          >
            <dt className="font-mono text-[0.62rem] uppercase tracking-[0.12em] text-ink-soft">
              {row.label}
            </dt>
            <dd className="text-right text-sm font-medium text-ink">
              {row.value}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
