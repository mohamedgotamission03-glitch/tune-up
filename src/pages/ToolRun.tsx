import { useEffect, useRef, useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { CheckCircle2, ExternalLink, Lightbulb } from "lucide-react";
import { ScoreRing } from "@/components/ScoreRing";
import { PageHeader } from "@/components/PageHeader";
import { Progress } from "@/components/ui/progress";
import { getTool, type ToolResult } from "@/lib/tools";
import { useHealth } from "@/lib/health";
import { canOpenSettings, openSettings } from "@/lib/device";
import { showInterstitial } from "@/lib/ads";
import { cn } from "@/lib/utils";

const MIN_MS = 2200;

const ToolRun = () => {
  const { id } = useParams();
  const tool = getTool(id);
  const navigate = useNavigate();
  const { score, markDone } = useHealth();
  const [phase, setPhase] = useState<"idle" | "running" | "done">("idle");
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<ToolResult | null>(null);
  const finished = useRef(false);

  useEffect(() => {
    if (phase !== "running") return;
    const timer = setInterval(() => setProgress((p) => (finished.current ? 100 : Math.min(94, p + 3))), MIN_MS / 32);
    return () => clearInterval(timer);
  }, [phase]);

  if (!tool) return <Navigate to="/" replace />;

  const Icon = tool.icon;
  const stepIndex = Math.min(tool.steps.length - 1, Math.floor((progress / 100) * tool.steps.length));

  const start = async () => {
    finished.current = false;
    setProgress(0);
    setPhase("running");
    const [res] = await Promise.all([tool.run(), new Promise((r) => setTimeout(r, MIN_MS))]);
    finished.current = true;
    setProgress(100);
    setResult(res);
    markDone(tool.id);
    setTimeout(() => {
      setPhase("done");
      showInterstitial();
    }, 350);
  };

  return (
    <div className="animate-in fade-in duration-300">
      <PageHeader title={tool.title} subtitle={tool.blurb} back />

      {phase !== "done" && (
        <section className="mx-4 mt-4 rounded-3xl bg-card p-8 text-center shadow-sm">
          <div className="relative mx-auto grid h-40 w-40 place-items-center">
            {phase === "running" && <span className="absolute inset-0 animate-ping rounded-full bg-primary/15" />}
            <span className={cn("relative grid h-32 w-32 place-items-center rounded-full", tool.tint)}>
              <Icon className="h-14 w-14" />
            </span>
          </div>
          {phase === "idle" ? (
            <>
              <p className="mt-6 text-lg font-bold">Ready to go</p>
              <p className="text-sm text-muted-foreground">{tool.blurb}.</p>
              <button
                onClick={start}
                className="mt-6 h-12 w-full rounded-full bg-primary text-base font-bold text-primary-foreground shadow-md shadow-primary/30 transition active:scale-[0.98]"
              >
                {tool.action}
              </button>
            </>
          ) : (
            <>
              <p className="mt-6 text-lg font-bold">{tool.steps[stepIndex]}…</p>
              <Progress value={progress} className="mt-4 h-3 rounded-full bg-secondary" />
              <p className="mt-2 text-sm font-semibold tabular-nums text-muted-foreground">{progress}%</p>
            </>
          )}
        </section>
      )}

      {phase === "done" && result && (
        <section className="mx-4 mt-4 rounded-3xl bg-card p-6 text-center shadow-sm animate-in zoom-in-95 fade-in duration-500">
          <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-emerald-100 px-4 py-1.5 text-sm font-bold text-emerald-800">
            <CheckCircle2 className="h-4 w-4" /> Job done!
          </div>
          <div className="mt-3 flex justify-center">
            <ScoreRing value={score} label="Health" tone="text-success" size={180} />
          </div>
          <p className="mt-4 text-2xl font-extrabold">{result.headline}</p>
          <div className="mt-5 grid grid-cols-3 gap-2">
            {result.stats.map((s) => (
              <div key={s.label} className="rounded-2xl bg-secondary p-3">
                <p className="text-base font-extrabold text-secondary-foreground">{s.value}</p>
                <p className="text-xs font-medium text-muted-foreground">{s.label}</p>
              </div>
            ))}
          </div>
          <ul className="mt-5 space-y-2 text-left text-sm text-muted-foreground">
            {result.tips.map((t) => (
              <li key={t} className="flex gap-2">
                <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-warning" />
                <span>{t}</span>
              </li>
            ))}
          </ul>
          {result.cta && canOpenSettings() && (
            <button
              onClick={() => openSettings(result.cta!.target)}
              className="mt-5 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-secondary text-base font-bold text-secondary-foreground active:scale-[0.98]"
            >
              <ExternalLink className="h-4 w-4" /> {result.cta.label}
            </button>
          )}
          <button
            onClick={() => navigate("/")}
            className="mt-3 h-12 w-full rounded-full bg-primary text-base font-bold text-primary-foreground shadow-md shadow-primary/30 active:scale-[0.98]"
          >
            Done
          </button>
        </section>
      )}
    </div>
  );
};

export default ToolRun;
