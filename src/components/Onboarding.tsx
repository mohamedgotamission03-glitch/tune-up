import { useState } from "react";
import { Activity, ShieldCheck, Zap } from "lucide-react";
import { initAds } from "@/lib/ads";

const KEY = "tuneup.onboarded";

const slides = [
  { icon: Activity, title: "See your phone's real health", text: "Live storage, memory, battery and temperature, straight from your device." },
  { icon: Zap, title: "One-tap Smart Scan", text: "Find what needs attention and get clear, honest fixes. No fake boosting." },
  { icon: ShieldCheck, title: "Private by design", text: "No account, no file access and no app list. Everything stays on your phone." },
];

export const Onboarding = () => {
  const [open, setOpen] = useState(() => localStorage.getItem(KEY) !== "1");
  const [i, setI] = useState(0);
  if (!open) return null;

  const last = i === slides.length - 1;
  const { icon: Icon, title, text } = slides[i];

  const next = () => {
    if (!last) return setI(i + 1);
    localStorage.setItem(KEY, "1");
    setOpen(false);
    initAds(); // shows the ad-consent form first where required
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-background px-6 pb-10 pt-[max(2rem,env(safe-area-inset-top))]">
      <button onClick={() => { setI(slides.length - 1); }} className={`self-end text-sm font-bold text-muted-foreground ${last ? "invisible" : ""}`}>
        Skip
      </button>
      <div key={i} className="flex flex-1 flex-col items-center justify-center text-center animate-in fade-in slide-in-from-right-4 duration-300">
        <span className="grid h-36 w-36 place-items-center rounded-[2.5rem] bg-primary text-primary-foreground shadow-xl shadow-primary/30">
          <Icon className="h-16 w-16" />
        </span>
        <h2 className="mt-10 text-3xl font-extrabold tracking-tight">{title}</h2>
        <p className="mt-3 max-w-xs text-muted-foreground">{text}</p>
      </div>
      <div className="mb-6 flex justify-center gap-2">
        {slides.map((_, n) => (
          <span key={n} className={`h-2 rounded-full transition-all ${n === i ? "w-6 bg-primary" : "w-2 bg-primary/25"}`} />
        ))}
      </div>
      <button onClick={next} className="h-14 w-full rounded-full bg-primary text-base font-bold text-primary-foreground shadow-md shadow-primary/30 active:scale-[0.98]">
        {last ? "Get started" : "Next"}
      </button>
    </div>
  );
};
