import { useCallback, useEffect, useState } from "react";
import type { ToolId } from "./tools";

const KEY = "tuneup.done";

type DoneMap = Partial<Record<ToolId, number>>;

const read = (): DoneMap => {
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? "{}");
  } catch {
    return {};
  }
};

const DAY = 24 * 60 * 60 * 1000;

/** Phone health score: baseline 58, +10 for each tool run within the last 24h. */
export const useHealth = () => {
  const [done, setDone] = useState<DoneMap>(read);

  useEffect(() => {
    const sync = () => setDone(read());
    window.addEventListener("tuneup:health", sync);
    return () => window.removeEventListener("tuneup:health", sync);
  }, []);

  const markDone = useCallback((id: ToolId) => {
    localStorage.setItem(KEY, JSON.stringify({ ...read(), [id]: Date.now() }));
    window.dispatchEvent(new Event("tuneup:health"));
  }, []);

  const recent = (Object.values(done) as number[]).filter((t) => Date.now() - t < DAY).length;
  const score = Math.min(99, 58 + recent * 10);

  return { score, done, markDone };
};

export const formatBytes = (b: number) => {
  if (b >= 1e9) return `${(b / 1e9).toFixed(1)} GB`;
  if (b >= 1e6) return `${(b / 1e6).toFixed(0)} MB`;
  return `${Math.round(b / 1e3)} KB`;
};
