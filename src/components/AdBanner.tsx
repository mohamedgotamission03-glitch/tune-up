import { useEffect } from "react";
import { isNative, showBanner } from "@/lib/ads";

/** Shows the native AdMob banner on Android. Renders nothing visible on the web. */
export const AdBanner = () => {
  useEffect(() => {
    showBanner();
  }, []);

  return isNative() ? <div className="h-[50px]" aria-hidden /> : null;
};
