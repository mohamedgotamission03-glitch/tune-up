import type { SettingsTarget, Stats } from "./device";
import { formatBytes } from "./device";
import type { ToolId } from "./tools";

export interface Finding {
  id: string;
  level: "bad" | "warn";
  title: string;
  desc: string;
  action?: { label: string; tool?: ToolId; target?: SettingsTarget };
}

/** Turns real readings into a prioritised list of things worth fixing. */
export const buildFindings = (s: Stats): Finding[] => {
  const out: Finding[] = [];

  if (s.diskTotal && s.diskFree !== undefined) {
    const r = s.diskFree / s.diskTotal;
    if (r < 0.1)
      out.push({ id: "disk", level: "bad", title: "Storage almost full", desc: `Only ${formatBytes(s.diskFree)} free. Apps and updates may fail.`, action: { label: "Free up space", target: "storage" } });
    else if (r < 0.2)
      out.push({ id: "disk", level: "warn", title: "Storage getting low", desc: `${formatBytes(s.diskFree)} free. Consider clearing large files.`, action: { label: "Review storage", target: "storage" } });
  }

  if (s.ramTotal && s.ramFree !== undefined && s.ramFree / s.ramTotal < 0.15)
    out.push({ id: "ram", level: "warn", title: "Memory is running low", desc: `${formatBytes(s.ramFree)} RAM free. Close apps you are not using.`, action: { label: "See memory details", tool: "ram" } });

  if (s.batteryTemp !== undefined && s.batteryTemp >= 40)
    out.push({ id: "heat", level: s.batteryTemp >= 45 ? "bad" : "warn", title: "Phone is running hot", desc: `${s.batteryTemp.toFixed(1)}°C. Remove the case and pause heavy apps.`, action: { label: "Cooling tips", tool: "cpu" } });

  if (s.batteryHealth && s.batteryHealth !== "Good" && s.batteryHealth !== "Unknown")
    out.push({ id: "bhealth", level: "bad", title: `Battery health: ${s.batteryHealth}`, desc: "Your battery reports a problem. Consider having it checked.", action: { label: "Battery details", tool: "battery" } });

  if (s.batteryLevel !== undefined && s.batteryLevel < 20 && !s.charging)
    out.push({ id: "batt", level: "warn", title: "Battery is low", desc: `${Math.round(s.batteryLevel)}% left. Enable Battery Saver to stretch it.`, action: { label: "Battery usage", target: "battery" } });

  return out;
};
