/**
 * Event hooks for a provider that is not yet connected.
 * Pushes to window.dataLayer when present, no-ops otherwise. No values are invented.
 */

export type AnalyticsEvent =
  | "hero_cta_click"
  | "nav_cta_click"
  | "whatsapp_click"
  | "call_click"
  | "car_enquiry_click"
  | "reel_click"
  | "testimonial_interaction"
  | "final_cta_click";

type Payload = Record<string, string | number | boolean>;

declare global {
  interface Window {
    dataLayer?: Payload[];
  }
}

export function track(event: AnalyticsEvent, payload: Payload = {}) {
  if (typeof window === "undefined") return;
  window.dataLayer?.push({ event, ...payload });
}
