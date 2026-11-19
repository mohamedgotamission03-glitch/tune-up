type Ctx = CanvasRenderingContext2D;

const FONT = "Inter, system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif";
export const BLUE = "#2563EB";

export const loadIcon = () =>
  new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = "/icon.svg";
  });

const rr = (c: Ctx, x: number, y: number, w: number, h: number, r: number, fill: string) => {
  c.beginPath();
  c.roundRect(x, y, w, h, r);
  c.fillStyle = fill;
  c.fill();
};

const text = (c: Ctx, t: string, x: number, y: number, size: number, color: string, weight = 700, align: CanvasTextAlign = "left") => {
  c.font = `${weight} ${size}px ${FONT}`;
  c.fillStyle = color;
  c.textAlign = align;
  c.textBaseline = "alphabetic";
  c.fillText(t, x, y);
};

const ring = (c: Ctx, cx: number, cy: number, r: number, lw: number, pct: number, color: string, track: string) => {
  c.lineWidth = lw;
  c.lineCap = "round";
  c.strokeStyle = track;
  c.beginPath();
  c.arc(cx, cy, r, 0, Math.PI * 2);
  c.stroke();
  c.strokeStyle = color;
  c.beginPath();
  c.arc(cx, cy, r, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * pct);
  c.stroke();
};

export const drawIcon512 = (c: Ctx, icon: HTMLImageElement) => {
  c.clearRect(0, 0, 512, 512);
  c.drawImage(icon, 0, 0, 512, 512);
};

export const drawFeatureGraphic = (c: Ctx, icon: HTMLImageElement) => {
  rr(c, 0, 0, 1024, 500, 0, BLUE);
  c.globalAlpha = 0.12;
  c.lineWidth = 36;
  c.strokeStyle = "#FFFFFF";
  c.beginPath();
  c.arc(900, 90, 210, 0, Math.PI * 2);
  c.stroke();
  c.globalAlpha = 1;
  text(c, "TuneUp", 70, 170, 44, "#BFDBFE", 700);
  text(c, "Know your phone's", 70, 255, 66, "#FFFFFF", 800);
  text(c, "health in one tap", 70, 330, 66, "#FFFFFF", 800);
  text(c, "Storage · Memory · Battery · Heat", 70, 405, 30, "#DBEAFE", 500);
  c.drawImage(icon, 700, 110, 280, 280);
};

type Kind = "home" | "scan" | "done" | "live" | "battery" | "dark";

export const SCREENSHOTS: { kind: Kind; title: string; bg: string; file: string }[] = [
  { kind: "home", title: "Your phone's health\nat a glance", bg: "#2563EB", file: "01-home" },
  { kind: "scan", title: "One tap\nSmart Scan", bg: "#0F766E", file: "02-scan" },
  { kind: "done", title: "Job done.\nSee what you found", bg: "#6D28D9", file: "03-done" },
  { kind: "live", title: "Live memory,\nbattery & heat", bg: "#1D4ED8", file: "04-live" },
  { kind: "battery", title: "Battery care that\nmakes sense", bg: "#B45309", file: "05-battery" },
  { kind: "dark", title: "Easy on the eyes,\ndark mode included", bg: "#334155", file: "06-dark" },
];

const drawScreen = (c: Ctx, kind: Kind, x: number, y: number, w: number, h: number) => {
  const dark = kind === "dark";
  const bg = dark ? "#0B1220" : "#F5F8FF";
  const card = dark ? "#16213A" : "#FFFFFF";
  const ink = dark ? "#F1F5F9" : "#0F172A";
  const sub = dark ? "#94A3B8" : "#64748B";
  const track = dark ? "#1E2B4A" : "#DBEAFE";

  c.save();
  c.beginPath();
  c.roundRect(x, y, w, h, 56);
  c.clip();
  rr(c, x, y, w, h, 0, bg);

  const px = x + 40;
  const pw = w - 80;
  text(c, kind === "scan" ? "Smart Scan" : kind === "live" ? "Live Monitor" : kind === "battery" ? "Battery Care" : "TuneUp", px, y + 130, 46, ink, 800);

  if (kind === "home" || kind === "dark") {
    rr(c, px, y + 190, pw, 560, 48, card);
    ring(c, x + w / 2, y + 470, 150, 34, 0.87, BLUE, track);
    text(c, "87", x + w / 2, y + 495, 110, ink, 800, "center");
    text(c, "Phone health: Good", x + w / 2, y + 680, 34, sub, 600, "center");
    const tiles: [string, string][] = [["Storage free", "58%"], ["RAM free", "3.1 GB"], ["Battery", "82%"], ["Temperature", "31°C"]];
    tiles.forEach(([k, v], i) => {
      const tx = px + (i % 2) * (pw / 2 + 10);
      const ty = y + 790 + Math.floor(i / 2) * 190;
      rr(c, tx, ty, pw / 2 - 10, 170, 36, card);
      text(c, k, tx + 28, ty + 62, 28, sub, 600);
      text(c, v, tx + 28, ty + 128, 50, ink, 800);
    });
    rr(c, px, y + 1190, pw, 120, 60, BLUE);
    text(c, "Run Smart Scan", x + w / 2, y + 1266, 40, "#FFFFFF", 800, "center");
  }

  if (kind === "scan") {
    rr(c, px, y + 190, pw, 300, 48, card);
    text(c, "Checking your phone…", px + 40, y + 280, 38, ink, 800);
    rr(c, px + 40, y + 330, pw - 80, 26, 13, track);
    rr(c, px + 40, y + 330, (pw - 80) * 0.72, 26, 13, BLUE);
    text(c, "72%", px + 40, y + 430, 34, sub, 700);
    ["Storage", "Memory", "Battery", "Temperature"].forEach((n, i) => {
      const ry = y + 540 + i * 150;
      rr(c, px, ry, pw, 126, 36, card);
      const done = i < 3;
      c.beginPath();
      c.arc(px + 66, ry + 63, 30, 0, Math.PI * 2);
      c.fillStyle = done ? "#16A34A" : track;
      c.fill();
      if (done) text(c, "✓", px + 66, ry + 78, 40, "#FFFFFF", 800, "center");
      text(c, n, px + 124, ry + 76, 38, ink, 700);
      text(c, done ? "Done" : "Reading…", px + pw - 36, ry + 76, 30, done ? "#16A34A" : sub, 700, "right");
    });
  }

  if (kind === "done") {
    c.beginPath();
    c.arc(x + w / 2, y + 400, 190, 0, Math.PI * 2);
    c.fillStyle = "#DCFCE7";
    c.fill();
    ring(c, x + w / 2, y + 400, 150, 30, 1, "#16A34A", "#BBF7D0");
    text(c, "✓", x + w / 2, y + 455, 150, "#16A34A", 800, "center");
    text(c, "Job done!", x + w / 2, y + 700, 72, ink, 800, "center");
    text(c, "Here's what we found", x + w / 2, y + 765, 34, sub, 600, "center");
    ["Storage looks healthy", "Memory is fine", "Battery health: Good"].forEach((t, i) => {
      const ry = y + 840 + i * 140;
      rr(c, px, ry, pw, 116, 34, card);
      text(c, t, px + 36, ry + 72, 36, ink, 700);
    });
    rr(c, px, y + 1280, pw, 20, 10, "rgba(0,0,0,0)");
  }

  if (kind === "live") {
    const rows: [string, string, number[], string][] = [
      ["Memory free", "3.1 GB", [40, 55, 50, 62, 58, 66, 60, 70], "#16A34A"],
      ["Battery", "82%", [90, 89, 88, 86, 85, 84, 83, 82], BLUE],
      ["Temperature", "31°C", [28, 29, 29, 30, 31, 30, 31, 31], "#EA580C"],
    ];
    rows.forEach(([k, v, pts, col], i) => {
      const ry = y + 190 + i * 370;
      rr(c, px, ry, pw, 340, 48, card);
      text(c, k, px + 40, ry + 80, 34, sub, 600);
      text(c, v, px + pw - 40, ry + 84, 56, ink, 800, "right");
      c.lineWidth = 10;
      c.lineCap = "round";
      c.lineJoin = "round";
      c.strokeStyle = col;
      c.beginPath();
      const min = Math.min(...pts);
      const max = Math.max(...pts);
      pts.forEach((p, j) => {
        const gx = px + 40 + (j * (pw - 80)) / (pts.length - 1);
        const gy = ry + 300 - ((p - min) / (max - min || 1)) * 150;
        if (j === 0) c.moveTo(gx, gy);
        else c.lineTo(gx, gy);
      });
      c.stroke();
    });
  }

  if (kind === "battery") {
    rr(c, px, y + 190, pw, 520, 48, card);
    rr(c, x + w / 2 - 190, y + 300, 380, 200, 40, track);
    rr(c, x + w / 2 - 190, y + 300, 380 * 0.82, 200, 40, "#F59E0B");
    text(c, "82%", x + w / 2, y + 640, 110, ink, 800, "center");
    [["Status", "On battery"], ["Health", "Good"], ["Temperature", "31°C"]].forEach(([k, v], i) => {
      const ry = y + 760 + i * 140;
      rr(c, px, ry, pw, 116, 34, card);
      text(c, k, px + 36, ry + 72, 34, sub, 600);
      text(c, v, px + pw - 36, ry + 72, 38, ink, 800, "right");
    });
    rr(c, px, y + 1200, pw, 110, 55, "#B45309");
    text(c, "Open battery usage", x + w / 2, y + 1269, 36, "#FFFFFF", 800, "center");
  }

  c.restore();
};

export const drawPromoScreenshot = (c: Ctx, index: number) => {
  const s = SCREENSHOTS[index];
  rr(c, 0, 0, 1080, 1920, 0, s.bg);
  s.title.split("\n").forEach((line, i) => text(c, line, 540, 170 + i * 100, 84, "#FFFFFF", 800, "center"));
  rr(c, 150, 400, 780, 1560, 90, "#0F172A");
  drawScreen(c, s.kind, 170, 420, 740, 1500);
};
