import { useLayoutEffect } from "react";
import type { RefObject } from "react";
import gsap from "gsap";

export function useGsapReveal(rootRef: RefObject<HTMLElement | null>) {
  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) {
      return;
    }

    const media = gsap.matchMedia();

    media.add("(prefers-reduced-motion: no-preference)", () => {
      const context = gsap.context(() => {
        const riseTargets = gsap.utils.toArray<HTMLElement>(".gsap-rise");
        if (riseTargets.length > 0) {
          gsap.fromTo(
            riseTargets,
            { y: 26, autoAlpha: 0 },
            {
              y: 0,
              autoAlpha: 1,
              duration: 0.75,
              ease: "power3.out",
              stagger: 0.08,
            },
          );
        }

        const driftTargets = gsap.utils.toArray<HTMLElement>(".gsap-drift");
        if (driftTargets.length > 0) {
          gsap.fromTo(
            driftTargets,
            { y: 0 },
            {
              y: -6,
              duration: 2.4,
              ease: "sine.inOut",
              yoyo: true,
              repeat: -1,
              stagger: 0.12,
            },
          );
        }
      }, root);

      return () => context.revert();
    });

    return () => media.revert();
  }, [rootRef]);
}
