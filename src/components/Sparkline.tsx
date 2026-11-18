interface Props {
  values: number[];
  min?: number;
  max?: number;
  className?: string;
}

export const Sparkline = ({ values, min = 0, max = 100, className = "stroke-primary" }: Props) => {
  const W = 120;
  const H = 36;
  if (values.length < 2) return <svg viewBox={`0 0 ${W} ${H}`} className="h-9 w-full" />;
  const span = max - min || 1;
  const pts = values
    .map((v, i) => `${(i / (values.length - 1)) * W},${H - 2 - ((Math.min(max, Math.max(min, v)) - min) / span) * (H - 4)}`)
    .join(" ");
  return (
    <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className="h-9 w-full">
      <polyline points={pts} fill="none" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className} />
    </svg>
  );
};
