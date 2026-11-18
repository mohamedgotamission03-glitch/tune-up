import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

interface Props {
  title: string;
  subtitle?: string;
  back?: boolean;
}

export const PageHeader = ({ title, subtitle, back }: Props) => {
  const navigate = useNavigate();
  return (
    <header className="flex items-center gap-3 px-5 pb-3 pt-6">
      {back && (
        <button
          onClick={() => navigate(-1)}
          aria-label="Go back"
          className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-card shadow-sm active:scale-95"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
      )}
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight">{title}</h1>
        {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
      </div>
    </header>
  );
};
