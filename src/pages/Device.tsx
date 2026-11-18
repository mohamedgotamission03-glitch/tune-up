import { PageHeader } from "@/components/PageHeader";
import { formatBytes, useStats } from "@/lib/device";

const Device = () => {
  const { stats: s } = useStats();
  if (!s) return <PageHeader title="Device Info" back />;

  const nav = navigator as Navigator & { connection?: { effectiveType?: string } };
  const rows = [
    ["Model", s.native ? `${s.manufacturer} ${s.model}` : s.model],
    ["Android version", s.androidVersion],
    ["CPU cores", s.cores ? String(s.cores) : "—"],
    ["RAM", formatBytes(s.ramTotal)],
    ["Storage", s.diskTotal !== undefined ? `${formatBytes(s.diskFree)} free of ${formatBytes(s.diskTotal)}` : "—"],
    ["Screen", `${screen.width} × ${screen.height}`],
    ["Network", nav.connection?.effectiveType?.toUpperCase() ?? (navigator.onLine ? "Online" : "Offline")],
    [
      "Battery",
      s.batteryLevel !== undefined ? `${Math.round(s.batteryLevel)}%${s.charging ? " (charging)" : ""}` : "—",
    ],
    ["Battery health", s.batteryHealth ?? "—"],
    ["Temperature", s.batteryTemp !== undefined ? `${s.batteryTemp.toFixed(1)}°C` : "—"],
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
      {!s.native && <p className="mx-6 mt-3 text-xs text-muted-foreground">Full details are available in the Android app.</p>}
    </div>
  );
};

export default Device;
