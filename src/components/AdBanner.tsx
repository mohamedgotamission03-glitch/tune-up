import { useEffect } from "react";
import { hideBanner, isNative, showBanner, useAdFree } from "@/lib/ads";

/** Shows the native AdMob banner on Android. Renders nothing visible on the web. */
export const AdBanner = () => {
  const adFree = useAdFree();

  useEffect(() => {
    if (adFree) hideBanner();
    else showBanner();
  }, [adFree]);

  return isNative() && !adFree ? <div className="h-[50px]" aria-hidden /> : null;
};
