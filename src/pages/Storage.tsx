import { Link } from "react-router-dom";
import { ExternalLink } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { canOpenSettings, formatBytes, openSettings, useStats } from "@/lib/device";

const Storage = () => {
  const { stats } = useStats();
  const total = stats?.diskTotal;
  const free = stats?.diskFree;
  const known = total !== undefined && free !== undefined;
  const used = known ? total - free : 0;
  const usedPct = known && total ? (used / total) * 100 : 0;

  return (
    <div className="animate-in fade-in duration-300">
      <PageHeader title="Storage" subtitle="See how much space is left" />

      <section className="mx-4 rounded-3xl bg-card p-5 shadow-sm">
        {known ? (
          <>
            <p className="text-3xl font-extrabold">
              {formatBytes(used)} <span className="text-base font-semibold text-muted-foreground">of {formatBytes(total)} used</span>
            </p>
            <div className="mt-4 h-4 overflow-hidden rounded-full bg-secondary">
              <div
                className={`h-full rounded-full transition-all duration-700 ${usedPct > 85 ? "bg-destructive" : "bg-primary"}`}
                style={{ width: `${usedPct}%` }}
              />
            </div>
            <div className="mt-4 flex justify-between text-sm font-semibold">
              <span className="text-muted-foreground">Free</span>
              <span>{formatBytes(free)}</span>
            </div>
            {usedPct > 85 && <p className="mt-3 text-sm font-semibold text-destructive">Storage is almost full. Free up some space.</p>}
          </>
        ) : (
          <p className="text-sm text-muted-foreground">Exact storage numbers are available in the Android app.</p>
        )}
      </section>

      <section className="mx-4 mt-4 rounded-3xl bg-card p-5 text-sm text-muted-foreground shadow-sm">
        <p className="font-bold text-foreground">How to free up space</p>
        <ul className="mt-2 list-disc space-y-1 pl-5">
          <li>Run the Storage Cleaner to clear TuneUp's cache.</li>
          <li>Use Android's storage screen to remove large or unused files.</li>
          <li>Back up photos and videos, then delete the local copies.</li>
        </ul>
      </section>

      <div className="mx-4 mt-4 space-y-3">
        <Link
          to="/tool/junk"
          className="flex h-12 items-center justify-center rounded-full bg-primary font-bold text-primary-foreground shadow-md shadow-primary/30 active:scale-[0.98]"
        >
          Run Storage Cleaner
        </Link>
        {canOpenSettings() && (
          <button
            onClick={() => openSettings("storage")}
            className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-secondary font-bold text-secondary-foreground active:scale-[0.98]"
          >
            <ExternalLink className="h-4 w-4" /> Open Android storage settings
          </button>
        )}
      </div>
    </div>
  );
};

export default Storage;
