import type { Location } from "@/db/schema";
import { hashSlug } from "@/lib/theme";
import {
  HERO_H1_POOL,
  HERO_SUB_POOL,
  FINAL_CTA_POOL,
  fillTemplate,
} from "@/lib/copyPools";
import { REVIEW_POOL } from "@/lib/reviewPool";

export type HeroVariant = "split" | "centered" | "imageRight";
export type ServicesVariant = "grid" | "list" | "alternating";
export type AboutVariant = "imageLeft" | "imageRight" | "stacked";
export type ProcessVariant = "cards" | "timeline" | "stepper";
export type WhyVariant = "grid" | "stacked" | "iconLed";
export type SectionKey = "services" | "about" | "process" | "why";

export type VariantPick = {
  hero: HeroVariant;
  services: ServicesVariant;
  about: AboutVariant;
  process: ProcessVariant;
  why: WhyVariant;
  sectionOrder: SectionKey[];
  reviewPicks: number[];
  copy: {
    heroH1: string;
    heroSub: string;
    finalCta: string;
  };
};

const HERO_VARIANTS: HeroVariant[] = ["split", "centered", "imageRight"];
const SERVICES_VARIANTS: ServicesVariant[] = ["grid", "list", "alternating"];
const ABOUT_VARIANTS: AboutVariant[] = ["imageLeft", "imageRight", "stacked"];
const PROCESS_VARIANTS: ProcessVariant[] = ["cards", "timeline", "stepper"];
const WHY_VARIANTS: WhyVariant[] = ["grid", "stacked", "iconLed"];
const CANONICAL_ORDER: SectionKey[] = ["services", "about", "process", "why"];

function pickFrom<T>(arr: readonly T[], seed: number): T {
  return arr[seed % arr.length];
}

// Deterministic shuffle: returns first `n` indices of a stable Fisher-Yates
// permutation seeded by `seed`. Same input → same output.
function pickNIndices(poolSize: number, n: number, seed: number): number[] {
  const indices = Array.from({ length: poolSize }, (_, i) => i);
  let state = seed >>> 0 || 1;
  for (let i = indices.length - 1; i > 0; i--) {
    // xorshift32
    state ^= state << 13;
    state ^= state >>> 17;
    state ^= state << 5;
    state = state >>> 0;
    const j = state % (i + 1);
    [indices[i], indices[j]] = [indices[j], indices[i]];
  }
  return indices.slice(0, n);
}

function shuffleSectionOrder(seed: number): SectionKey[] {
  const order = [...CANONICAL_ORDER];
  // Swap one adjacent pair deterministically — gentle reorder, layout stays sensible.
  const i = seed % (order.length - 1);
  [order[i], order[i + 1]] = [order[i + 1], order[i]];
  return order;
}

export function getVariantsForSlug(loc: Location): VariantPick {
  const hash = hashSlug(loc.slug || "");
  // Independent sub-seeds so one decision doesn't cascade into others.
  const s = {
    hero: hash,
    services: (hash >>> 3) ^ 0x9e3779b1,
    about: (hash >>> 7) ^ 0x85ebca6b,
    process: (hash >>> 11) ^ 0xc2b2ae35,
    why: (hash >>> 13) ^ 0x27d4eb2f,
    order: (hash >>> 17) ^ 0x165667b1,
    reviews: (hash >>> 19) ^ 0xd3a2646c,
    heroH1: (hash >>> 23) ^ 0xfd7046c5,
    heroSub: (hash >>> 5) ^ 0xb55a4f09,
    finalCta: (hash >>> 2) ^ 0x6a09e667,
  };

  const heroH1Tpl = pickFrom(HERO_H1_POOL, s.heroH1);
  const heroSubTpl = pickFrom(HERO_SUB_POOL, s.heroSub);
  const finalCtaTpl = pickFrom(FINAL_CTA_POOL, s.finalCta);

  return {
    hero: pickFrom(HERO_VARIANTS, s.hero),
    services: pickFrom(SERVICES_VARIANTS, s.services),
    about: pickFrom(ABOUT_VARIANTS, s.about),
    process: pickFrom(PROCESS_VARIANTS, s.process),
    why: pickFrom(WHY_VARIANTS, s.why),
    sectionOrder: shuffleSectionOrder(s.order),
    reviewPicks: pickNIndices(REVIEW_POOL.length, 3, s.reviews),
    copy: {
      heroH1: fillTemplate(heroH1Tpl, loc),
      heroSub: fillTemplate(heroSubTpl, loc),
      finalCta: fillTemplate(finalCtaTpl, loc),
    },
  };
}
