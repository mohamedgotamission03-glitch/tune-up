const SCORES = "tuneup.scores";
const DAYS = "tuneup.days";

const dayKey = (d = new Date()) => d.toISOString().slice(0, 10);

const read = <T,>(key: string, fallback: T): T => {
  try {
    return JSON.parse(localStorage.getItem(key) ?? "") as T;
  } catch {
    return fallback;
  }
};

export const recordScore = (score: number) => {
  if (score <= 0) return;
  const all = read<Record<string, number>>(SCORES, {});
  if (all[dayKey()] === score) return;
  all[dayKey()] = score;
  localStorage.setItem(SCORES, JSON.stringify(all));
};

export const recordActiveDay = () => {
  const days = new Set(read<string[]>(DAYS, []));
  days.add(dayKey());
  localStorage.setItem(DAYS, JSON.stringify([...days].slice(-60)));
};

/** Last 7 days of scores (null where nothing was recorded). */
export const lastWeek = () => {
  const all = read<Record<string, number>>(SCORES, {});
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return { label: d.toLocaleDateString("en", { weekday: "short" }).slice(0, 1), score: all[dayKey(d)] ?? null };
  });
};

/** Consecutive days (ending today or yesterday) on which the user ran a check. */
export const streak = () => {
  const days = new Set(read<string[]>(DAYS, []));
  const d = new Date();
  if (!days.has(dayKey(d))) d.setDate(d.getDate() - 1);
  let n = 0;
  while (days.has(dayKey(d))) {
    n++;
    d.setDate(d.getDate() - 1);
  }
  return n;
};
