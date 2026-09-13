"use client";

import { useEffect } from "react";
import { refreshWhenSettled } from "@/lib/gsap";

/**
 * Three pinned sections share this page, so their measurements must be taken
 * after fonts and images have settled — not during hydration.
 */
export function MotionBoot() {
  useEffect(() => {
    refreshWhenSettled();
  }, []);

  return null;
}
