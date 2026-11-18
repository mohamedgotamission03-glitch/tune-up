import { useCallback, useEffect, useState } from "react";
import { Capacitor, registerPlugin } from "@capacitor/core";

export interface Stats {
  native: boolean;
  diskTotal?: number;
  diskFree?: number;
  ramTotal?: number;
  ramFree?: number;
  batteryLevel?: number; // 0-100
  charging?: boolean;
  batteryTemp?: number; // °C
  batteryHealth?: string;
  model: string;
  manufacturer: string;
  androidVersion: string;
  cores?: number;
}

export type SettingsTarget =
  | "storage"
  | "battery"
  | "batteryOptimization"
  | "apps"
  | "defaultApps"
  | "data"
  | "display";

interface DeviceStatsPlugin {
  getStats(): Promise<Omit<Stats, "native">>;
  clearCache(): Promise<{ freed: number }>;
  openSettings(opts: { target: SettingsTarget }): Promise<void>;
}

const Native = registerPlugin<DeviceStatsPlugin>("DeviceStats");
const isNative = () => Capacitor.isNativePlatform();

type WebNav = Navigator & {
  deviceMemory?: number;
  getBattery?: () => Promise<{ level: number; charging: boolean }>;
};

/** Real values on Android; best-effort browser values in the web preview. */
export const getStats = async (): Promise<Stats> => {
  if (isNative()) {
    try {
      return { native: true, ...(await Native.getStats()) };
    } catch {
      /* fall through to web values */
    }
  }
  const nav = navigator as WebNav;
  const battery = await nav.getBattery?.().catch(() => undefined);
  return {
    native: false,
    ramTotal: nav.deviceMemory ? nav.deviceMemory * 1e9 : undefined,
    batteryLevel: battery ? battery.level * 100 : undefined,
    charging: battery?.charging,
    cores: nav.hardwareConcurrency,
    model: nav.platform || "Browser",
    manufacturer: "Unknown",
    androidVersion: "Unknown",
  };
};

/** Clears TuneUp's own cache. Returns the number of bytes removed. */
export const clearOwnCache = async (): Promise<number> => {
  if (isNative()) {
    try {
      return (await Native.clearCache()).freed;
    } catch {
      return 0;
    }
  }
  const before = (await navigator.storage?.estimate?.())?.usage ?? 0;
  const keys = (await caches?.keys?.()) ?? [];
  await Promise.all(keys.map((k) => caches.delete(k)));
  const after = (await navigator.storage?.estimate?.())?.usage ?? 0;
  return Math.max(0, before - after);
};

export const canOpenSettings = isNative;

export const openSettings = async (target: SettingsTarget) => {
  if (isNative()) await Native.openSettings({ target });
};

export const useStats = () => {
  const [stats, setStats] = useState<Stats | null>(null);
  const refresh = useCallback(async () => {
    const s = await getStats();
    setStats(s);
    return s;
  }, []);
  useEffect(() => {
    refresh();
  }, [refresh]);
  return { stats, refresh };
};

export const formatBytes = (b?: number) => {
  if (b === undefined) return "—";
  if (b >= 1e9) return `${(b / 1e9).toFixed(1)} GB`;
  if (b >= 1e6) return `${(b / 1e6).toFixed(0)} MB`;
  if (b >= 1e3) return `${Math.round(b / 1e3)} KB`;
  return `${b} B`;
};

/** Health score (0-99) from real readings that are available on this device. */
export const computeScore = (s: Stats | null): number => {
  if (!s) return 0;
  const parts: number[] = [];
  if (s.diskTotal && s.diskFree !== undefined) parts.push(Math.min(1, s.diskFree / s.diskTotal / 0.25));
  if (s.ramTotal && s.ramFree !== undefined) parts.push(Math.min(1, s.ramFree / s.ramTotal / 0.2));
  if (s.batteryTemp !== undefined) parts.push(s.batteryTemp <= 38 ? 1 : s.batteryTemp >= 45 ? 0.3 : 1 - ((s.batteryTemp - 38) / 7) * 0.7);
  if (s.batteryHealth) parts.push(s.batteryHealth === "Good" ? 1 : 0.5);
  if (!parts.length) return 80;
  return Math.min(99, Math.round((parts.reduce((a, b) => a + b, 0) / parts.length) * 100));
};
