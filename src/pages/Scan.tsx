import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AlertTriangle, CheckCircle2, ExternalLink, ScanSearch, XCircle } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { ScoreRing } from "@/components/ScoreRing";
import { NativeAd } from "@/components/NativeAd";
import { Progress } from "@/components/ui/progress";
import { clearOwnCache, canOpenSettings, computeScore, formatBytes, getStats, openSettings, type Stats } from "@/lib/device";
import { buildFindings, type Finding } from "@/lib/findings";
import { useHealth } from "@/lib/health";
import { showInterstitial } from "@/lib/ads";
import { cn } from "@/lib/utils";

const STEPS = ["Checking storage", "Reading memory", "Inspecting battery", "Measuring heat", "Clearing TuneUp cache"];

const Scan = () => {
  const navigate = useNavigate();
  const { markDone } = useHealth();
  const [phase, setPhase] = useState<"idle" | "running" | "done">("idle");
  const [progress, setProgress] = useState(0);
  const [stats, setStats] = useState<Stats | null>(null);
  const [freed, setFreed] = useState(0);
  const finished = useRef(false);

  useEffect(() => {
    if (phase !== "running") return;
    const t = setInterval(() => setProgress((p) => (finished.current ? 100 : Math.min(94, p + 3))), 90);
    return () => clearInterval(t);
  }, [phase]);

  const start = async () => {
    finished.current = false;
    setProgress(0);
    setPhase("running");
    const [bytes] = await Promise.all([clearOwnCache(), new Promise((r) => setTimeout(r, 3000))]);
    const s = await getStats();
    finished.current = true;
    setProgress(100);
    setFreed(bytes);
    setStats(s);
    markDone("scan");
    setTimeout(() => {
      setPhase("done");
      showInterstitial();
    }, 350);
  };

  const findings: Finding[] = stats ? buildFindings(stats) : [];
  const score = computeScore(stats);

  const act = (f: Finding) => {
    if (f.action?.tool) navigate(`/tool/${f.action.tool}`);
    else if (f.action?.target) openSettings(f.action.target);
  };

  return (
    <div className="animate-in fade-in duration-300">
      <PageHeader title="Smart Scan" subtitle="One tap checks your whole phone" back />

      {phase !== "done" && (
        <section className="mx-4 mt-4 rounded-3xl bg-card p-8 text-center shadow-sm">
          <div className="relative mx-auto grid h-40 w-40 place-items-center">
            {phase === "running" && <span className="absolute inset-0 animate-ping rounded-full bg-primary/15" />}
            <span className="relative grid h-32 w-32 place-items-center rounded-full bg-secondary text-primary">
              <ScanSearch className="h-14 w-14" />
            </span>
          </div>
          {phase === "idle" ? (
            <>
              <p className="mt-6 text-lg font-bold">Full phone check-up</p>
              <p className="text-sm text-muted-foreground">Storage, memory, battery and heat, with clear fixes for anything that needs attention.</p>
              <button
                onClick={start}
                className="mt-6 h-12 w-full rounded-full bg-primary text-base font-bold text-primary-foreground shadow-md shadow-primary/30 active:scale-[0.98]"
              >
                Start scan
              </button>
            </>
          ) : (
            <>
              <p className="mt-6 text-lg font-bold">{STEPS[Math.min(STEPS.length - 1, Math.floor((progress / 100) * STEPS.length))]}…</p>
              <Progress value={progress} className="mt-4 h-3 rounded-full bg-secondary" />
              <p className="mt-2 text-sm font-semibold tabular-nums text-muted-foreground">{progress}%</p>
            </>
          )}
        </section>
      )}

      {phase === "done" && stats && (
        <div className="space-y-4 animate-in zoom-in-95 fade-in duration-500">
          <section className="mx-4 mt-4 rounded-3xl bg-card p-6 text-center shadow-sm">
            <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-emerald-100 px-4 py-1.5 text-sm font-bold text-emerald-800">
              <CheckCircle2 className="h-4 w-4" /> Job done!
            </div>
            <div className="mt-3 flex justify-center">
              <ScoreRing value={score} label="Health" tone={findings.length ? "text-primary" : "text-success"} size={170} />
            </div>
            <p className="mt-4 text-xl font-extrabold">
              {findings.length ? `${findings.length} thing${findings.length > 1 ? "s" : ""} to look at` : "Everything looks great"}
            </p>
            <p className="text-sm text-muted-foreground">
              {freed > 0 ? `${formatBytes(freed)} of TuneUp cache cleared.` : "No cache to clear."}
            </p>
          </section>

          {findings.length > 0 && (
            <ul className="mx-4 overflow-hidden rounded-3xl bg-card shadow-sm">
              {findings.map((f, i) => (
                <li key={f.id} className={cn("p-4", i > 0 && "border-t")}>
                  <div className="flex gap-3">
                    {f.level === "bad" ? (
                      <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-destructive" />
                    ) : (
                      <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-warning" />
                    )}
                    <div className="flex-1">
                      <p className="font-bold">{f.title}</p>
                      <p className="text-sm text-muted-foreground">{f.desc}</p>
                      {f.action && (f.action.tool || canOpenSettings()) && (
                        <button
                          onClick={() => act(f)}
                          className="mt-2 inline-flex h-9 items-center gap-1 rounded-full bg-primary px-4 text-xs font-bold text-primary-foreground active:scale-95"
                        >
                          {f.action.target && <ExternalLink className="h-3.5 w-3.5" />} {f.action.label}
                        </button>
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}

          <NativeAd slot="scan" />

          <button
            onClick={() => navigate("/")}
            className="mx-4 block h-12 w-[calc(100%-2rem)] rounded-full bg-primary text-base font-bold text-primary-foreground shadow-md shadow-primary/30 active:scale-[0.98]"
          >
            Done
          </button>
        </div>
      )}
    </div>
  );
};

export default Scan;
