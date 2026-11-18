import { useEffect, useState } from "react";

interface Props {
  value: number;
  size?: number;
  stroke?: number;
  label?: string;
  tone?: string;
}

export const ScoreRing = ({ value, size = 200, stroke = 16, label, tone = "text-primary" }: Props) => {
  const [shown, setShown] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => setShown(value), 80);
    return () => clearTimeout(t);
  }, [value]);

  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;

  return (
    <div className="relative grid place-items-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" strokeWidth={stroke} className="stroke-secondary" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - shown / 100)}
          className={`stroke-current transition-[stroke-dashoffset] duration-1000 ease-out ${tone}`}
        />
      </svg>
      <div className="absolute text-center">
        <div className="text-5xl font-extrabold tabular-nums">{value}</div>
        {label && <div className="mt-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</div>}
      </div>
    </div>
  );
};
