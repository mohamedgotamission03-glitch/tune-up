import {
  Trash2,
  MemoryStick,
  BatteryCharging,
  Thermometer,
  type LucideIcon,
} from "lucide-react";

export type ToolId = "junk" | "ram" | "battery" | "cpu";

export interface Tool {
  id: ToolId;
  title: string;
  blurb: string;
  action: string;
  icon: LucideIcon;
  tint: string;
  steps: string[];
  result: (n: number) => { headline: string; stats: { label: string; value: string }[] };
}

export const tools: Tool[] = [
  {
    id: "junk",
    title: "Junk Cleaner",
    blurb: "Remove cache & leftover files",
    action: "Clean now",
    icon: Trash2,
    tint: "bg-blue-100 text-blue-700",
    steps: ["Scanning app cache", "Finding residual files", "Checking temp files", "Clearing junk"],
    result: (n) => ({
      headline: `${(n * 3.1 + 180).toFixed(0)} MB cleaned`,
      stats: [
        { label: "Cache", value: `${(n * 1.4 + 90).toFixed(0)} MB` },
        { label: "Residual", value: `${(n * 1.1 + 60).toFixed(0)} MB` },
        { label: "Temp", value: `${(n * 0.6 + 30).toFixed(0)} MB` },
      ],
    }),
  },
  {
    id: "ram",
    title: "RAM Booster",
    blurb: "Free memory from idle apps",
    action: "Boost now",
    icon: MemoryStick,
    tint: "bg-emerald-100 text-emerald-700",
    steps: ["Reading memory usage", "Finding idle processes", "Stopping background apps", "Reclaiming memory"],
    result: (n) => ({
      headline: `${(n * 4 + 320).toFixed(0)} MB freed`,
      stats: [
        { label: "Apps stopped", value: `${Math.round(n / 4) + 6}` },
        { label: "Speed gain", value: `${Math.round(n / 3) + 12}%` },
      ],
    }),
  },
  {
    id: "battery",
    title: "Battery Saver",
    blurb: "Stretch every last percent",
    action: "Save power",
    icon: BatteryCharging,
    tint: "bg-amber-100 text-amber-800",
    steps: ["Checking power drain", "Detecting heavy apps", "Limiting background sync", "Applying power plan"],
    result: (n) => ({
      headline: `+${Math.round(n * 2.2 + 35)} min battery`,
      stats: [
        { label: "Apps hibernated", value: `${Math.round(n / 5) + 4}` },
        { label: "Drain reduced", value: `${Math.round(n / 4) + 9}%` },
      ],
    }),
  },
  {
    id: "cpu",
    title: "CPU Cooler",
    blurb: "Cool down a hot phone",
    action: "Cool down",
    icon: Thermometer,
    tint: "bg-cyan-100 text-cyan-800",
    steps: ["Measuring temperature", "Finding heat sources", "Pausing heavy apps", "Cooling down"],
    result: (n) => ({
      headline: `Cooled by ${(n / 10 + 2.4).toFixed(1)}°C`,
      stats: [
        { label: "Apps paused", value: `${Math.round(n / 6) + 3}` },
        { label: "CPU load", value: `-${Math.round(n / 3) + 14}%` },
      ],
    }),
  },
];

export const getTool = (id?: string) => tools.find((t) => t.id === id);
