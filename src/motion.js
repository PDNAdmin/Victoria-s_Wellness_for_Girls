// Shared motion setup: GSAP, ScrollTrigger, Lenis and the design system's curves.
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CustomEase } from "gsap/CustomEase";
import Lenis from "lenis";

gsap.registerPlugin(ScrollTrigger, CustomEase);

// Curves mirror the motion tokens in tokens.css
export const ease = {
  standard: CustomEase.create("standard", "0.2,0,0,1"),
  gentle: CustomEase.create("gentle", "0.25,0.8,0.25,1"),
  bloom: CustomEase.create("bloom", "0.19,1,0.22,1"),
  spring: CustomEase.create("spring", "0.34,1.56,0.64,1"),
};

export const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

let lenis = null;

export function startSmoothScroll() {
  if (reducedMotion) return null;
  lenis = new Lenis({ lerp: 0.11, wheelMultiplier: 0.95, smoothWheel: true });
  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
  return lenis;
}

export function getLenis() {
  return lenis;
}

export { gsap, ScrollTrigger };
