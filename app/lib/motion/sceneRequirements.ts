import type { MotionCapabilities } from '@/lib/motion/motionCapabilities'

/** Scenes that depend on GSAP / ScrollTrigger timelines */
export const REQUIRES_ANIMATIONS: Partial<MotionCapabilities> = { animations: true }

/** Scroll-scrubbed reveals synced with Locomotive */
export const REQUIRES_SMOOTH_SCROLL: Partial<MotionCapabilities> = { smoothScroll: true }

/** WebGL canvas overlays (HeroDepthCanvas, TeamScene3D) */
export const REQUIRES_WEBGL: Partial<MotionCapabilities> = { webgl: true }
