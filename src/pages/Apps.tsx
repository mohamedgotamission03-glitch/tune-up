import { useState } from "react";
import { toast } from "sonner";
import { Moon } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { cn } from "@/lib/utils";

const initial = [
  { name: "Social Feed", mb: 412, ram: 310, last: "Today" },
  { name: "Video Streaming", mb: 268, ram: 240, last: "Yesterday" },
  { name: "Photo Editor", mb: 190, ram: 150, last: "3 days ago" },
  { name: "Mobile Game", mb: 1240, ram: 420, last: "5 days ago" },
  { name: "Shopping", mb: 156, ram: 120, last: "2 weeks ago" },
  { name: "Maps & Travel", mb: 134, ram: 98, last: "Last month" },
  { name: "Music Player", mb: 88, ram: 76, last: "Today" },
];

const Apps = () => {
  const [sleeping, setSleeping] = useState<Set<string>>(new Set());

  const toggle = (name: string) => {
    const next = new Set(sleeping);
    if (next.has(name)) next.delete(name);
    else {
      next.add(name);
      toast.success(`${name} hibernated`);
    }
    setSleeping(next);
  };

  return (
    <div className="animate-in fade-in duration-300">
      <PageHeader title="App Manager" subtitle="Hibernate apps you rarely use" />
      <ul className="mx-4 overflow-hidden rounded-3xl bg-card shadow-sm">
        {initial.map((a, i) => {
          const asleep = sleeping.has(a.name);
          return (
            <li key={a.name} className={cn("flex items-center gap-3 p-4", i > 0 && "border-t")}>
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-secondary text-lg font-extrabold text-primary">
                {a.name[0]}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate font-bold">{a.name}</p>
                <p className="text-xs text-muted-foreground">
                  {a.mb} MB · {a.ram} MB RAM · {a.last}
                </p>
              </div>
              <button
                onClick={() => toggle(a.name)}
                className={cn(
                  "inline-flex h-9 items-center gap-1 rounded-full px-3 text-xs font-bold transition active:scale-95",
                  asleep ? "bg-emerald-100 text-emerald-800" : "bg-primary text-primary-foreground",
                )}
              >
                <Moon className="h-3.5 w-3.5" /> {asleep ? "Asleep" : "Hibernate"}
              </button>
            </li>
          );
        })}
      </ul>
      <p className="mx-6 mt-3 text-xs text-muted-foreground">Sample list shown for illustration.</p>
    </div>
  );
};

export default Apps;
