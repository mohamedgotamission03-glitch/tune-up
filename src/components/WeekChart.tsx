import { lastWeek } from "@/lib/history";
import { cn } from "@/lib/utils";

export const WeekChart = ({ refreshKey }: { refreshKey: number }) => {
  const week = lastWeek();
  void refreshKey;
  return (
    <div className="flex h-28 items-end justify-between gap-2">
      {week.map((d, i) => (
        <div key={i} className="flex flex-1 flex-col items-center gap-1">
          <div className="flex h-20 w-full items-end rounded-full bg-secondary">
            <div
              className={cn("w-full rounded-full transition-all duration-700", i === 6 ? "bg-primary" : "bg-primary/45")}
              style={{ height: d.score ? `${Math.max(12, d.score)}%` : "0%" }}
              title={d.score ? `${d.score}` : "No data"}
            />
          </div>
          <span className="text-[11px] font-bold text-muted-foreground">{d.label}</span>
        </div>
      ))}
    </div>
  );
};
