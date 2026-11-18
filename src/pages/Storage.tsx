import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { PageHeader } from "@/components/PageHeader";
import { formatBytes } from "@/lib/health";

const categories = [
  { name: "Apps", gb: 24.6, bar: "bg-primary" },
  { name: "Photos & videos", gb: 18.2, bar: "bg-emerald-500" },
  { name: "Audio", gb: 4.1, bar: "bg-amber-500" },
  { name: "Documents", gb: 2.8, bar: "bg-cyan-500" },
  { name: "System", gb: 12.0, bar: "bg-slate-400" },
];
const TOTAL = 128;

const Storage = () => {
  const [app, setApp] = useState<{ usage: number; quota: number } | null>(null);

  useEffect(() => {
    navigator.storage?.estimate?.().then((e) => setApp({ usage: e.usage ?? 0, quota: e.quota ?? 0 }));
  }, []);

  const used = categories.reduce((s, c) => s + c.gb, 0);

  return (
    <div className="animate-in fade-in duration-300">
      <PageHeader title="Storage" subtitle="See what is taking up space" />

      <section className="mx-4 rounded-3xl bg-card p-5 shadow-sm">
        <div className="flex items-end justify-between">
          <p className="text-3xl font-extrabold">
            {used.toFixed(1)} <span className="text-base font-semibold text-muted-foreground">of {TOTAL} GB used</span>
          </p>
        </div>
        <div className="mt-4 flex h-4 overflow-hidden rounded-full bg-secondary">
          {categories.map((c) => (
            <div key={c.name} className={c.bar} style={{ width: `${(c.gb / TOTAL) * 100}%` }} />
          ))}
        </div>
        <ul className="mt-5 space-y-3">
          {categories.map((c) => (
            <li key={c.name} className="flex items-center gap-3">
              <span className={`h-3 w-3 rounded-full ${c.bar}`} />
              <span className="flex-1 font-semibold">{c.name}</span>
              <span className="text-sm font-bold tabular-nums text-muted-foreground">{c.gb.toFixed(1)} GB</span>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-xs text-muted-foreground">Category sizes are estimates.</p>
      </section>

      {app && (
        <section className="mx-4 mt-4 rounded-3xl bg-card p-5 shadow-sm">
          <p className="font-bold">TuneUp data</p>
          <p className="text-sm text-muted-foreground">
            {formatBytes(app.usage)} used of {formatBytes(app.quota)} available to this app.
          </p>
        </section>
      )}

      <Link
        to="/tool/junk"
        className="mx-4 mt-4 flex h-12 items-center justify-center rounded-full bg-primary font-bold text-primary-foreground shadow-md shadow-primary/30 active:scale-[0.98]"
      >
        Free up space
      </Link>
    </div>
  );
};

export default Storage;
