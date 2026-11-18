import { useEffect, useState } from "react";
import { PageHeader } from "@/components/PageHeader";

interface BatteryManager {
  level: number;
  charging: boolean;
}

const Device = () => {
  const [battery, setBattery] = useState<BatteryManager | null>(null);

  useEffect(() => {
    (navigator as Navigator & { getBattery?: () => Promise<BatteryManager> }).getBattery?.().then(setBattery);
  }, []);

  const nav = navigator as Navigator & { deviceMemory?: number; connection?: { effectiveType?: string } };
  const rows = [
    ["Platform", nav.platform || "Unknown"],
    ["CPU cores", String(nav.hardwareConcurrency ?? "Unknown")],
    ["Memory", nav.deviceMemory ? `~${nav.deviceMemory} GB` : "Unknown"],
    ["Screen", `${screen.width} × ${screen.height}`],
    ["Pixel ratio", `${window.devicePixelRatio}x`],
    ["Network", nav.connection?.effectiveType?.toUpperCase() ?? (nav.onLine ? "Online" : "Offline")],
    ["Battery", battery ? `${Math.round(battery.level * 100)}%${battery.charging ? " (charging)" : ""}` : "Unavailable"],
    ["Language", nav.language],
  ];

  return (
    <div className="animate-in fade-in duration-300">
      <PageHeader title="Device Info" subtitle="About this phone" back />
      <dl className="mx-4 overflow-hidden rounded-3xl bg-card shadow-sm">
        {rows.map(([k, v], i) => (
          <div key={k} className={`flex justify-between gap-4 p-4 ${i > 0 ? "border-t" : ""}`}>
            <dt className="font-semibold text-muted-foreground">{k}</dt>
            <dd className="text-right font-bold">{v}</dd>
          </div>
        ))}
      </dl>
      <p className="mx-4 mt-4 break-words px-2 text-xs text-muted-foreground">{nav.userAgent}</p>
    </div>
  );
};

export default Device;
