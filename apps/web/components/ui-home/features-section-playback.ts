import { useInView } from "motion/react";
import { useEffect, useRef, useState } from "react";

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

/**
 * Plays a short scripted sequence once, the first time the element is mostly
 * in view. `durations[n]` is how long step `n` lasts before step `n + 1`.
 *
 * The server HTML and the first client render show the last step, so no-JS
 * visitors and reduced motion always get the finished state. With motion
 * allowed, the sequence rewinds on mount, while the card is still hidden by
 * its `Reveal`, and plays once it scrolls into view.
 */
export function usePlayback<T extends Element>(durations: readonly number[]) {
  const ref = useRef<T>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const last = durations.length;
  const [step, setStep] = useState(last);
  const [armed, setArmed] = useState(false);

  useEffect(() => {
    if (window.matchMedia(REDUCED_MOTION_QUERY).matches) {
      return;
    }
    setStep(0);
    setArmed(true);
  }, []);

  useEffect(() => {
    if (!(armed && inView) || step >= last) {
      return;
    }
    const timer = window.setTimeout(
      () => setStep((current) => current + 1),
      durations[step],
    );
    return () => window.clearTimeout(timer);
  }, [armed, inView, step, last, durations]);

  return { ref, step, last };
}
