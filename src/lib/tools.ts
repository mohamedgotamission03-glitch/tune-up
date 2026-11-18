import { Trash2, MemoryStick, BatteryCharging, Thermometer, type LucideIcon } from "lucide-react";
import { clearOwnCache, formatBytes, getStats, type SettingsTarget } from "./device";

export type ToolId = "junk" | "ram" | "battery" | "cpu";

export interface ToolResult {
  headline: string;
  stats: { label: string; value: string }[];
  tips: string[];
  cta?: { label: string; target: SettingsTarget };
}

export interface Tool {
  id: ToolId;
  title: string;
  blurb: string;
  action: string;
  icon: LucideIcon;
  tint: string;
  steps: string[];
  run: () => Promise<ToolResult>;
}

const NA = "Available in the Android app";

export const tools: Tool[] = [
  {
    id: "junk",
    title: "Storage Cleaner",
    blurb: "Clear TuneUp's cache & check free space",
    action: "Clean now",
    icon: Trash2,
    tint: "bg-blue-100 text-blue-700",
    steps: ["Measuring storage", "Finding cache files", "Clearing cache", "Re-checking space"],
    run: async () => {
      const freed = await clearOwnCache();
      const s = await getStats();
      return {
        headline: freed > 0 ? `${formatBytes(freed)} cleared` : "Cache already clean",
        stats: [
          { label: "Cleared", value: formatBytes(freed) },
          { label: "Free space", value: s.diskFree !== undefined ? formatBytes(s.diskFree) : "—" },
          { label: "Total", value: s.diskTotal !== undefined ? formatBytes(s.diskTotal) : "—" },
        ],
        tips: [
          "Android does not allow apps to delete other apps' cache. Use the system storage screen to free up more space.",
          "Delete old downloads, large videos and duplicate photos you no longer need.",
          ...(s.native ? [] : [NA + " for exact storage numbers."]),
        ],
        cta: { label: "Open storage settings", target: "storage" },
      };
    },
  },
  {
    id: "ram",
    title: "Memory Check",
    blurb: "See real RAM usage & get tips",
    action: "Check now",
    icon: MemoryStick,
    tint: "bg-emerald-100 text-emerald-700",
    steps: ["Reading memory", "Checking available RAM", "Analysing usage", "Preparing tips"],
    run: async () => {
      const s = await getStats();
      const used = s.ramTotal && s.ramFree !== undefined ? s.ramTotal - s.ramFree : undefined;
      const low = s.ramTotal && s.ramFree !== undefined && s.ramFree / s.ramTotal < 0.15;
      return {
        headline: s.ramFree !== undefined ? `${formatBytes(s.ramFree)} RAM free` : "Memory checked",
        stats: [
          { label: "Free", value: formatBytes(s.ramFree) },
          { label: "Used", value: formatBytes(used) },
          { label: "Total", value: formatBytes(s.ramTotal) },
        ],
        tips: [
          low
            ? "Memory is running low. Close apps you are not using from the recent apps screen."
            : "Memory looks healthy. Android manages RAM automatically, so there is nothing you need to close.",
          "Restart your phone once a week to keep it smooth.",
          "Uninstall apps you no longer use to reduce background activity.",
        ],
        cta: { label: "Review installed apps", target: "apps" },
      };
    },
  },
  {
    id: "battery",
    title: "Battery Care",
    blurb: "Battery status, health & power tips",
    action: "Check now",
    icon: BatteryCharging,
    tint: "bg-amber-100 text-amber-800",
    steps: ["Reading battery level", "Checking health", "Reviewing power use", "Preparing tips"],
    run: async () => {
      const s = await getStats();
      const level = s.batteryLevel !== undefined ? Math.round(s.batteryLevel) : undefined;
      return {
        headline: level !== undefined ? `Battery at ${level}%` : "Battery checked",
        stats: [
          { label: "Level", value: level !== undefined ? `${level}%` : "—" },
          { label: "Status", value: s.charging === undefined ? "—" : s.charging ? "Charging" : "On battery" },
          { label: "Health", value: s.batteryHealth ?? "—" },
        ],
        tips: [
          "Turn on Battery Saver in Android settings when you need to stretch your charge.",
          "Lower screen brightness and shorten screen timeout.",
          "Check which apps use the most power and restrict the ones you rarely use.",
        ],
        cta: { label: "Open battery usage", target: "battery" },
      };
    },
  },
  {
    id: "cpu",
    title: "Heat Monitor",
    blurb: "Check phone temperature & cooling tips",
    action: "Check now",
    icon: Thermometer,
    tint: "bg-cyan-100 text-cyan-800",
    steps: ["Reading temperature", "Checking processor load", "Analysing heat", "Preparing tips"],
    run: async () => {
      const s = await getStats();
      const t = s.batteryTemp;
      const state = t === undefined ? "—" : t < 38 ? "Normal" : t < 43 ? "Warm" : "Hot";
      return {
        headline: t !== undefined ? `${t.toFixed(1)}°C · ${state}` : "Temperature unavailable",
        stats: [
          { label: "Temperature", value: t !== undefined ? `${t.toFixed(1)}°C` : "—" },
          { label: "State", value: state },
          { label: "CPU cores", value: s.cores ? String(s.cores) : "—" },
        ],
        tips: [
          t !== undefined && t >= 38
            ? "Your phone is warm. Take off the case, stay out of direct sun and pause heavy apps or games."
            : "Your phone temperature is fine.",
          "Avoid using the phone while fast charging if it gets hot.",
          ...(t === undefined ? [NA + " for temperature."] : []),
        ],
        cta: { label: "Open battery usage", target: "battery" },
      };
    },
  },
];

export const getTool = (id?: string) => tools.find((t) => t.id === id);
