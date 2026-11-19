import { useEffect, useRef, useState } from "react";
import { Navigate } from "react-router-dom";
import { Capacitor } from "@capacitor/core";
import { toast } from "sonner";
import { Copy, Download } from "lucide-react";
import { SUPPORT_EMAIL } from "@/lib/appInfo";
import { SCREENSHOTS, drawFeatureGraphic, drawIcon512, drawPromoScreenshot, loadIcon } from "@/lib/kitDraw";

const NAMES = ["TuneUp: Phone Health Check", "TuneUp: Battery & Storage", "TuneUp - Phone Care & Monitor"];

const SHORTS = [
  "See your phone's storage, RAM, battery and heat in one tap. Plain-English tips.",
  "Check battery, storage, memory and temperature, then get simple fixes that work.",
];

const LONG = `Ever wonder why your phone feels slow, runs warm or loses battery by lunchtime? TuneUp shows you what's going on and what you can do about it.

Tap Smart Scan and in a few seconds you get a clear picture of your storage, memory, battery and temperature, with a short list of things worth your attention. No jargon, no scary pop-ups.

WHAT'S INSIDE

• Smart Scan: storage, memory, battery and heat checked in one go
• Live Monitor: memory, battery and temperature updating in real time, with simple graphs
• Storage Cleaner: clears TuneUp's own cache and shows how much space you have left
• Memory Check: see free and used RAM, with tips when it runs low
• Battery Care: level, charging state and battery health, plus shortcuts to Android's battery settings
• Heat Monitor: know when your phone runs warm and what helps it cool down
• Device Info: model, Android version, RAM, storage and more
• Speed Test: check your connection speed
• Health score, weekly chart and daily streak so you can see progress
• Light and dark mode

STRAIGHT TALK
Android already manages memory and background apps for you, so TuneUp doesn't pretend to "boost" or "kill" anything. It shows real readings from your phone and points you to the right Android settings when something needs fixing.

PRIVACY FIRST
TuneUp doesn't ask for access to your photos, files, contacts, location, camera or microphone. Readings stay on your device. The app shows ads, and you can change your ad choices any time in More.

Questions or ideas? Write to ${SUPPORT_EMAIL}. We read everything.`;

const copy = async (t: string) => {
  await navigator.clipboard.writeText(t);
  toast.success("Copied");
};

const Copyable = ({ label, value, max }: { label: string; value: string; max?: number }) => (
  <div className="rounded-2xl border bg-card p-4">
    <div className="mb-2 flex items-center justify-between gap-2">
      <span className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
        {label}
        {max ? ` · ${value.length}/${max}` : ""}
      </span>
      <button onClick={() => copy(value)} className="flex items-center gap-1 rounded-full bg-primary px-3 py-1.5 text-xs font-bold text-primary-foreground">
        <Copy className="h-3.5 w-3.5" /> Copy
      </button>
    </div>
    <p className="whitespace-pre-wrap text-sm leading-relaxed">{value}</p>
  </div>
);

const download = (canvas: HTMLCanvasElement, name: string) =>
  canvas.toBlob((b) => {
    if (!b) return;
    const a = document.createElement("a");
    a.href = URL.createObjectURL(b);
    a.download = name;
    a.click();
    URL.revokeObjectURL(a.href);
  }, "image/png");

const CanvasCard = ({ w, h, file, label, draw, maxWidth }: { w: number; h: number; file: string; label: string; draw: (c: CanvasRenderingContext2D) => void; maxWidth: number }) => {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const ctx = ref.current?.getContext("2d");
    if (ctx) draw(ctx);
  }, [draw]);
  return (
    <div className="rounded-2xl border bg-card p-3" style={{ maxWidth }}>
      <canvas ref={ref} width={w} height={h} className="w-full rounded-xl border" />
      <div className="mt-2 flex items-center justify-between gap-2">
        <span className="text-xs font-semibold text-muted-foreground">
          {label} · {w}×{h}
        </span>
        <button onClick={() => ref.current && download(ref.current, file)} className="flex items-center gap-1 rounded-full bg-primary px-3 py-1.5 text-xs font-bold text-primary-foreground">
          <Download className="h-3.5 w-3.5" /> PNG
        </button>
      </div>
    </div>
  );
};

const Kit = () => {
  const [icon, setIcon] = useState<HTMLImageElement | null>(null);
  useEffect(() => {
    loadIcon().then(setIcon).catch(() => toast.error("Could not load icon"));
  }, []);

  if (!import.meta.env.DEV || Capacitor.isNativePlatform()) return <Navigate to="/" replace />;

  return (
    <div className="mx-auto max-w-3xl space-y-8 p-4 pb-16">
      <header>
        <h1 className="text-3xl font-extrabold">Store kit</h1>
        <p className="text-sm text-muted-foreground">Preview only. This page is not included in the Android app or the production site.</p>
      </header>

      <section className="space-y-3">
        <h2 className="text-xl font-bold">App title (30 characters max)</h2>
        {NAMES.map((n) => (
          <Copyable key={n} label="Title" value={n} max={30} />
        ))}
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-bold">Short description (80 characters max)</h2>
        {SHORTS.map((s) => (
          <Copyable key={s} label="Short" value={s} max={80} />
        ))}
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-bold">Full description (4000 characters max)</h2>
        <Copyable label="Long" value={LONG} max={4000} />
        <p className="text-xs text-muted-foreground">
          Tip: Google Play search reads the first lines most closely, so the keywords (storage, memory, battery, temperature, scan) appear early and are repeated naturally. Avoid stuffing extra keywords.
        </p>
      </section>

      {icon && (
        <section className="space-y-3">
          <h2 className="text-xl font-bold">Graphics</h2>
          <CanvasCard w={512} h={512} file="tuneup-icon-512.png" label="App icon" draw={(c) => drawIcon512(c, icon)} maxWidth={260} />
          <CanvasCard w={1024} h={500} file="tuneup-feature-graphic.png" label="Feature graphic" draw={(c) => drawFeatureGraphic(c, icon)} maxWidth={640} />
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {SCREENSHOTS.map((s, i) => (
              <CanvasCard key={s.file} w={1080} h={1920} file={`tuneup-${s.file}.png`} label={`Screenshot ${i + 1}`} draw={(c) => drawPromoScreenshot(c, i)} maxWidth={260} />
            ))}
          </div>
          <p className="text-xs text-muted-foreground">
            The promo screenshots use sample numbers. Google Play expects screenshots to match the real app, so swap in real captures from the live preview below if you can.
          </p>
        </section>
      )}

      <section className="space-y-3">
        <h2 className="text-xl font-bold">Live preview</h2>
        <p className="text-sm text-muted-foreground">The real app in a phone frame. Use it to capture genuine screenshots or a screen recording for your promo video.</p>
        <div className="mx-auto w-[300px] rounded-[2.5rem] bg-slate-900 p-2.5 shadow-xl">
          <iframe title="App preview" src="/" className="h-[600px] w-full rounded-[2rem] bg-white" />
        </div>
      </section>
    </div>
  );
};

export default Kit;
