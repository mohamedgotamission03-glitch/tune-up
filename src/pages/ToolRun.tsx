import { useEffect, useMemo, useRef, useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { CheckCircle2, Rocket } from "lucide-react";
import { ScoreRing } from "@/components/ScoreRing";
import { PageHeader } from "@/components/PageHeader";
import { Progress } from "@/components/ui/progress";
import { getTool } from "@/lib/tools";
import { useHealth } from "@/lib/health";
import { showInterstitial } from "@/lib/ads";
import { cn } from "@/lib/utils";

const ToolRun = () => {
  const { id } = useParams();
  const tool = getTool(id);
  const navigate = useNavigate();
  const { score, markDone } = useHealth();
  const [phase, setPhase] = useState<"idle" | "running" | "done">("idle");
  const [progress, setProgress] = useState(0);
  const finished = useRef(false);
  const seed = useMemo(() => 20 + Math.floor(Math.random() * 60), [phase === "done"]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (phase !== "running" || !tool) return;
    const timer = setInterval(() => setProgress((p) => Math.min(100, p + 2)), 70);
    return () => clearInterval(timer);
  }, [phase, tool]);

  useEffect(() => {
    if (phase === "running" && progress >= 100 && !finished.current && tool) {
      finished.current = true;
      markDone(tool.id);
      setPhase("done");
      showInterstitial();
    }
  }, [progress, phase, tool, markDone]);

  if (!tool) return <Navigate to="/" replace />;

  const Icon = tool.icon;
  const stepIndex = Math.min(tool.steps.length - 1, Math.floor((progress / 100) * tool.steps.length));
  const result = tool.result(seed);

  const start = () => {
    finished.current = false;
    setProgress(0);
    setPhase("running");
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

      {phase === "done" && (
        <section className="mx-4 mt-4 rounded-3xl bg-card p-6 text-center shadow-sm animate-in zoom-in-95 fade-in duration-500">
          <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-emerald-100 px-4 py-1.5 text-sm font-bold text-emerald-800">
            <CheckCircle2 className="h-4 w-4" /> Job done!
          </div>
          <div className="mt-3 flex justify-center">
            <ScoreRing value={score} label="Health" tone="text-success" size={180} />
          </div>
          <p className="mt-4 flex items-center justify-center gap-2 text-2xl font-extrabold">
            <Rocket className="h-6 w-6 text-primary" /> {result.headline}
          </p>
          <div className="mt-5 grid grid-cols-[repeat(auto-fit,minmax(0,1fr))] gap-2">
            {result.stats.map((s) => (
              <div key={s.label} className="rounded-2xl bg-secondary p-3">
                <p className="text-lg font-extrabold text-secondary-foreground">{s.value}</p>
                <p className="text-xs font-medium text-muted-foreground">{s.label}</p>
              </div>
            ))}
          </div>
          <button
            onClick={() => navigate("/")}
            className="mt-6 h-12 w-full rounded-full bg-primary text-base font-bold text-primary-foreground shadow-md shadow-primary/30 active:scale-[0.98]"
          >
            Done
          </button>
        </section>
      )}
    </div>
  );
};

export default ToolRun;
