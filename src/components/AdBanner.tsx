import { useEffect } from "react";
import { isNative, showBanner } from "@/lib/ads";

/** Native AdMob banner on Android; a labelled placeholder in the web preview. */
export const AdBanner = () => {
  useEffect(() => {
    showBanner();
  }, []);

  if (isNative()) return <div className="h-[50px]" aria-hidden />;

  return (
    <div className="mx-4 grid h-[50px] place-items-center rounded-xl border border-dashed border-primary/40 bg-secondary text-xs font-semibold text-secondary-foreground">
      Ad · AdMob banner (test)
    </div>
  );
};
