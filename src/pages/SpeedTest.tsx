import { useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { Gauge } from "lucide-react";

const BYTES = 8_000_000;

const SpeedTest = () => {
  const [running, setRunning] = useState(false);
  const [mbps, setMbps] = useState<number | null>(null);
  const [ping, setPing] = useState<number | null>(null);
  const [error, setError] = useState("");

  const run = async () => {
    setRunning(true);
    setError("");
    setMbps(null);
    setPing(null);
    try {
      const t0 = performance.now();
      await fetch(`https://speed.cloudflare.com/__down?bytes=0&r=${Math.random()}`, { cache: "no-store" });
      setPing(Math.round(performance.now() - t0));

      const t1 = performance.now();
      const res = await fetch(`https://speed.cloudflare.com/__down?bytes=${BYTES}&r=${Math.random()}`, { cache: "no-store" });
      const buf = await res.arrayBuffer();
      const secs = (performance.now() - t1) / 1000;
      setMbps((buf.byteLength * 8) / secs / 1e6);
    } catch {
      setError("Could not run the test. Check your connection and try again.");
    } finally {
      setRunning(false);
    }
  };

  return (
    <div className="animate-in fade-in duration-300">
      <PageHeader title="Speed Test" subtitle="Check your internet speed" />
      <section className="mx-4 rounded-3xl bg-card p-8 text-center shadow-sm">
        <div className="mx-auto grid h-40 w-40 place-items-center rounded-full bg-secondary">
          <div>
            <Gauge className={`mx-auto h-8 w-8 text-primary ${running ? "animate-pulse" : ""}`} />
            <p className="text-4xl font-extrabold tabular-nums">{mbps ? mbps.toFixed(1) : "--"}</p>
            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Mbps</p>
          </div>
        </div>
        <div className="mt-5 flex justify-center gap-6 text-sm">
          <div>
            <p className="font-extrabold">{ping !== null ? `${ping} ms` : "--"}</p>
            <p className="text-muted-foreground">Ping</p>
          </div>
          <div>
            <p className="font-extrabold">{mbps ? `${(mbps / 8).toFixed(1)} MB/s` : "--"}</p>
            <p className="text-muted-foreground">Download</p>
          </div>
        </div>
        {error && <p className="mt-4 text-sm font-semibold text-destructive">{error}</p>}
        <button
          onClick={run}
          disabled={running}
          className="mt-6 h-12 w-full rounded-full bg-primary text-base font-bold text-primary-foreground shadow-md shadow-primary/30 transition active:scale-[0.98] disabled:opacity-60"
        >
          {running ? "Testing…" : mbps ? "Test again" : "Start test"}
        </button>
      </section>
    </div>
  );
};

export default SpeedTest;
