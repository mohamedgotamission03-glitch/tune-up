import { useEffect, useRef } from "react";
import { getNativeFeed, isNative, useAdFree } from "@/lib/ads";

/** Native AdMob ad (rendered by the Google SDK, labelled "Ad"). Nothing shows on the web or when ad-free. */
export const NativeAd = ({ slot }: { slot: string }) => {
  const ref = useRef<HTMLDivElement>(null);
  const adFree = useAdFree();

  useEffect(() => {
    const el = ref.current;
    if (!el || adFree || !isNative()) return;
    let cancelled = false;
    let detach: (() => void) | undefined;
    getNativeFeed().then((feed) => {
      if (cancelled || !feed) return;
      feed.attach(slot, el);
      detach = () => feed.detach(el);
    });
    return () => {
      cancelled = true;
      detach?.();
    };
  }, [slot, adFree]);

  if (adFree || !isNative()) return null;

  return <div ref={ref} className="mx-4 h-[120px] overflow-hidden rounded-3xl bg-card shadow-sm" />;
};
