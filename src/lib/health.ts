import { useCallback, useEffect, useState } from "react";
import { computeScore, useStats } from "./device";
import { recordActiveDay, recordScore } from "./history";
import type { ToolId } from "./tools";

const KEY = "tuneup.done";
const DAY = 24 * 60 * 60 * 1000;

type DoneMap = Partial<Record<ToolId | "scan", number>>;

const read = (): DoneMap => {
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? "{}");
  } catch {
    return {};
  }
};

/** Live health score (from real device readings) plus which tools were run today. */
export const useHealth = () => {
  const { stats, refresh } = useStats();
  const [done, setDone] = useState<DoneMap>(read);
  const score = computeScore(stats);

  useEffect(() => {
    const sync = () => {
      setDone(read());
      refresh();
    };
    window.addEventListener("tuneup:health", sync);
    return () => window.removeEventListener("tuneup:health", sync);
  }, [refresh]);

  useEffect(() => {
    recordScore(score);
  }, [score]);

  const markDone = useCallback((id: ToolId | "scan") => {
    localStorage.setItem(KEY, JSON.stringify({ ...read(), [id]: Date.now() }));
    recordActiveDay();
    window.dispatchEvent(new Event("tuneup:health"));
  }, []);

  const doneToday = Object.fromEntries(
    Object.entries(done).filter(([, t]) => Date.now() - (t as number) < DAY),
  ) as DoneMap;

  return { stats, score, done: doneToday, markDone, refresh };
};
