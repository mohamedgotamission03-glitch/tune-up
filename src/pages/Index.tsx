import { Link } from "react-router-dom";
import { Activity, ChevronRight, Flame, HardDrive, LayoutGrid, Smartphone, Gauge, Zap } from "lucide-react";
import { ScoreRing } from "@/components/ScoreRing";
import { WeekChart } from "@/components/WeekChart";
import { useHealth } from "@/lib/health";
import { streak } from "@/lib/history";
import { formatBytes } from "@/lib/device";
import { tools } from "@/lib/tools";
import { cn } from "@/lib/utils";

const quick = [
  { to: "/live", label: "Live monitor", icon: Activity },
  { to: "/storage", label: "Storage analyzer", icon: HardDrive },
  { to: "/apps", label: "App manager", icon: LayoutGrid },
  { to: "/device", label: "Device info", icon: Smartphone },
  { to: "/speed", label: "Speed test", icon: Gauge },
];

const Index = () => {
  const { stats, score, done } = useHealth();
  const days = streak();
  const status = score >= 90 ? "Excellent shape" : score >= 75 ? "Looking good" : "Needs attention";
  const ringTone = score >= 75 ? "text-success" : "text-primary";

  const used = stats?.ramTotal && stats.ramFree !== undefined ? stats.ramTotal - stats.ramFree : undefined;
  const glance = [
    { label: "Free storage", value: stats?.diskFree !== undefined ? formatBytes(stats.diskFree) : "—" },
    { label: "RAM in use", value: used !== undefined ? formatBytes(used) : "—" },
    { label: "Battery", value: stats?.batteryLevel !== undefined ? `${Math.round(stats.batteryLevel)}%` : "—" },
    { label: "Temp", value: stats?.batteryTemp !== undefined ? `${stats.batteryTemp.toFixed(0)}°C` : "—" },
  ];

  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
      <header className="flex items-center gap-3 px-5 pb-2 pt-6">
        <img src="/icon.svg" alt="" className="h-10 w-10 rounded-xl" />
        <div className="flex-1">
          <h1 className="text-xl font-extrabold leading-tight">TuneUp</h1>
          <p className="text-xs font-medium text-muted-foreground">Keep your phone healthy</p>
        </div>
        {days > 0 && (
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-3 py-1.5 text-xs font-extrabold text-amber-800">
            <Flame className="h-4 w-4" /> {days} day{days > 1 ? "s" : ""}
          </span>
        )}
      </header>

      <section className="mx-4 mt-3 rounded-3xl bg-card p-6 text-center shadow-sm">
        <div className="flex justify-center">
          <ScoreRing value={score} label="Health" tone={ringTone} />
        </div>
        <p className="mt-4 text-lg font-bold">{status}</p>
        <p className="text-sm text-muted-foreground">Based on your phone's real storage, memory, battery and heat.</p>
        <Link
          to="/scan"
          className="mt-5 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-primary text-base font-bold text-primary-foreground shadow-md shadow-primary/30 transition active:scale-[0.98]"
        >
          <Zap className="h-5 w-5" /> Smart Scan
        </Link>
      </section>

      <section className="mx-4 mt-4 grid grid-cols-4 gap-2">
        {glance.map((g) => (
          <div key={g.label} className="rounded-2xl bg-card p-3 text-center shadow-sm">
            <p className="text-base font-extrabold tabular-nums">{g.value}</p>
            <p className="text-[10px] font-semibold leading-tight text-muted-foreground">{g.label}</p>
          </div>
        ))}
      </section>

      <section className="mt-6 px-4">
        <h2 className="mb-3 px-1 text-sm font-bold uppercase tracking-wider text-muted-foreground">Smart tools</h2>
        <div className="grid grid-cols-2 gap-3">
          {tools.map(({ id, title, blurb, icon: Icon, tint }) => (
            <Link key={id} to={`/tool/${id}`} className="rounded-3xl bg-card p-4 shadow-sm transition active:scale-[0.97]">
              <span className={cn("grid h-12 w-12 place-items-center rounded-2xl", tint)}>
                <Icon className="h-6 w-6" />
              </span>
              <p className="mt-3 font-bold">{title}</p>
              <p className="text-xs text-muted-foreground">{blurb}</p>
              <p className={cn("mt-2 text-xs font-bold", done[id] ? "text-success" : "text-primary")}>
                {done[id] ? "✓ Checked today" : "Tap to run"}
              </p>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-4 mt-6 rounded-3xl bg-card p-5 shadow-sm">
        <h2 className="mb-3 text-sm font-bold uppercase tracking-wider text-muted-foreground">Health this week</h2>
        <WeekChart refreshKey={score} />
      </section>

      <section className="mt-6 px-4">
        <h2 className="mb-3 px-1 text-sm font-bold uppercase tracking-wider text-muted-foreground">More</h2>
        <div className="overflow-hidden rounded-3xl bg-card shadow-sm">
          {quick.map(({ to, label, icon: Icon }, i) => (
            <Link key={to} to={to} className={cn("flex items-center gap-3 px-4 py-4 active:bg-secondary", i > 0 && "border-t")}>
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-secondary text-primary">
                <Icon className="h-5 w-5" />
              </span>
              <span className="flex-1 font-semibold">{label}</span>
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Index;
