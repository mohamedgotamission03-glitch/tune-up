import { useState } from "react";
import { toast } from "sonner";
import { Sparkles } from "lucide-react";
import { grantAdFree, isNative, showRewarded, useAdFree } from "@/lib/ads";

/** Optional: watch one short video to hide ads for 24 hours. Shown only on Android. */
export const AdFreeCard = () => {
  const adFree = useAdFree();
  const [busy, setBusy] = useState(false);
  if (!isNative()) return null;

  const watch = async () => {
    setBusy(true);
    const ok = await showRewarded();
    setBusy(false);
    if (ok) {
      await grantAdFree();
      toast.success("Enjoy 24 hours without ads!");
    } else {
      toast.info("The video isn't available right now. Please try again later.");
    }
  };

  return (
    <section className="mx-4 mt-4 flex items-center gap-3 rounded-3xl bg-secondary p-4">
      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-primary text-primary-foreground">
        <Sparkles className="h-5 w-5" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="font-bold text-secondary-foreground">{adFree ? "Ad-free is active" : "Go ad-free for 24 hours"}</p>
        <p className="text-xs text-muted-foreground">{adFree ? "Thanks for supporting TuneUp." : "Watch one short video. Totally optional."}</p>
      </div>
      {!adFree && (
        <button
          onClick={watch}
          disabled={busy}
          className="h-10 shrink-0 rounded-full bg-primary px-4 text-sm font-bold text-primary-foreground active:scale-95 disabled:opacity-60"
        >
          {busy ? "Loading…" : "Watch"}
        </button>
      )}
    </section>
  );
};
