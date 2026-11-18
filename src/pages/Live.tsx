import { useEffect, useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { Sparkline } from "@/components/Sparkline";
import { formatBytes, getStats, type Stats } from "@/lib/device";

const MAX_POINTS = 30;

interface Series {
  ram: number[];
  battery: number[];
  temp: number[];
}

const push = (arr: number[], v?: number) => (v === undefined ? arr : [...arr, v].slice(-MAX_POINTS));

const Live = () => {
  const [s, setS] = useState<Stats | null>(null);
  const [series, setSeries] = useState<Series>({ ram: [], battery: [], temp: [] });

  useEffect(() => {
    let alive = true;
    const tick = async () => {
      const next = await getStats();
      if (!alive) return;
      setS(next);
      setSeries((p) => ({
        ram: push(p.ram, next.ramTotal && next.ramFree !== undefined ? ((next.ramTotal - next.ramFree) / next.ramTotal) * 100 : undefined),
        battery: push(p.battery, next.batteryLevel),
        temp: push(p.temp, next.batteryTemp),
      }));
    };
    tick();
    const t = setInterval(tick, 2000);
    return () => {
      alive = false;
      clearInterval(t);
    };
  }, []);

  const used = s?.ramTotal && s.ramFree !== undefined ? s.ramTotal - s.ramFree : undefined;
  const cards = [
    {
      title: "Memory in use",
      value: used !== undefined ? formatBytes(used) : "—",
      sub: s?.ramTotal ? `of ${formatBytes(s.ramTotal)}` : "Android app only",
      values: series.ram,
      range: [0, 100],
      tone: "stroke-emerald-500",
    },
    {
      title: "Battery",
      value: s?.batteryLevel !== undefined ? `${Math.round(s.batteryLevel)}%` : "—",
      sub: s?.charging ? "Charging" : "On battery",
      values: series.battery,
      range: [0, 100],
      tone: "stroke-amber-500",
    },
    {
      title: "Temperature",
      value: s?.batteryTemp !== undefined ? `${s.batteryTemp.toFixed(1)}°C` : "—",
      sub: s?.batteryTemp === undefined ? "Android app only" : s.batteryTemp < 38 ? "Normal" : s.batteryTemp < 43 ? "Warm" : "Hot",
      values: series.temp,
      range: [20, 50],
      tone: "stroke-cyan-600",
    },
  ];

  return (
    <div className="animate-in fade-in duration-300">
      <PageHeader title="Live Monitor" subtitle="Real readings, updated every 2 seconds" back />
      <div className="space-y-3 px-4">
        {cards.map((c) => (
          <section key={c.title} className="rounded-3xl bg-card p-4 shadow-sm">
            <div className="flex items-end justify-between">
              <div>
                <p className="text-sm font-semibold text-muted-foreground">{c.title}</p>
                <p className="text-3xl font-extrabold tabular-nums">{c.value}</p>
              </div>
              <p className="text-sm font-bold text-muted-foreground">{c.sub}</p>
            </div>
            <div className="mt-2 rounded-2xl bg-secondary px-2 py-1">
              <Sparkline values={c.values} min={c.range[0]} max={c.range[1]} className={c.tone} />
            </div>
          </section>
        ))}
      </div>
    </div>
  );
};

export default Live;
