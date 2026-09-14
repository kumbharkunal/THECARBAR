import { cn } from "@/lib/utils";

/**
 * Official brand marks, served as files rather than inlined.
 *
 * Instagram's gradients use single-letter ids (a–h) and Facebook has a clipPath
 * id of "a" — inlining either more than once on a page would collide those ids
 * and corrupt the fills. An <img> scopes them to the external document.
 *
 * They are full-colour by design, so `className` sizes and positions them; there
 * is no currentColor to inherit.
 */
export function SocialIcon({
  src,
  label,
  size = 20,
  className,
}: {
  src: string;
  label: string;
  size?: number;
  className?: string;
}) {
  return (
    // next/image passes SVG through unoptimised, so it would only add overhead here.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={label}
      width={size}
      height={size}
      loading="lazy"
      decoding="async"
      className={cn("shrink-0", className)}
      style={{ width: size, height: size }}
    />
  );
}
