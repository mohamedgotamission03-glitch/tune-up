import { Link } from "react-router-dom";
import { ChevronRight, HardDrive, LayoutGrid, Smartphone, Gauge, Zap } from "lucide-react";
import { ScoreRing } from "@/components/ScoreRing";
import { useHealth } from "@/lib/health";
import { tools } from "@/lib/tools";
import { cn } from "@/lib/utils";

const quick = [
  { to: "/storage", label: "Storage analyzer", icon: HardDrive },
  { to: "/apps", label: "App manager", icon: LayoutGrid },
  { to: "/device", label: "Device info", icon: Smartphone },
  { to: "/speed", label: "Speed test", icon: Gauge },
];

const Index = () => {
  const { score, done } = useHealth();
  const status = score >= 90 ? "Excellent shape" : score >= 75 ? "Looking good" : "Needs a tune-up";
  const ringTone = score >= 75 ? "text-success" : "text-primary";

  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
      <header className="flex items-center gap-3 px-5 pb-2 pt-6">
        <img src="/icon.svg" alt="" className="h-10 w-10 rounded-xl" />
        <div>
          <h1 className="text-xl font-extrabold leading-tight">TuneUp</h1>
          <p className="text-xs font-medium text-muted-foreground">Keep your phone fast</p>
        </div>
      </header>

      <section className="mx-4 mt-3 rounded-3xl bg-card p-6 text-center shadow-sm">
        <div className="flex justify-center">
          <ScoreRing value={score} label="Health" tone={ringTone} />
        </div>
        <p className="mt-4 text-lg font-bold">{status}</p>
        <p className="text-sm text-muted-foreground">Run the tools below to raise your score.</p>
        <Link
          to="/tool/junk"
          className="mt-5 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-primary text-base font-bold text-primary-foreground shadow-md shadow-primary/30 transition active:scale-[0.98]"
        >
          <Zap className="h-5 w-5" /> Optimize now
        </Link>
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
                {done[id] ? "✓ Done today" : "Tap to run"}
              </p>
            </Link>
          ))}
        </div>
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
