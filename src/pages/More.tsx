import { Link } from "react-router-dom";
import { ChevronRight, ShieldCheck, FileText, Smartphone, Mail } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { APP_NAME, APP_VERSION, SUPPORT_EMAIL } from "@/lib/appInfo";

const links = [
  { to: "/device", label: "Device info", icon: Smartphone },
  { to: "/privacy", label: "Privacy Policy", icon: ShieldCheck },
  { to: "/terms", label: "Terms of Service", icon: FileText },
];

const More = () => (
  <div className="animate-in fade-in duration-300">
    <PageHeader title="More" subtitle="About and legal" />
    <div className="mx-4 overflow-hidden rounded-3xl bg-card shadow-sm">
      {links.map(({ to, label, icon: Icon }, i) => (
        <Link key={to} to={to} className={`flex items-center gap-3 p-4 active:bg-secondary ${i > 0 ? "border-t" : ""}`}>
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-secondary text-primary">
            <Icon className="h-5 w-5" />
          </span>
          <span className="flex-1 font-semibold">{label}</span>
          <ChevronRight className="h-5 w-5 text-muted-foreground" />
        </Link>
      ))}
      <a href={`mailto:${SUPPORT_EMAIL}`} className="flex items-center gap-3 border-t p-4 active:bg-secondary">
        <span className="grid h-10 w-10 place-items-center rounded-xl bg-secondary text-primary">
          <Mail className="h-5 w-5" />
        </span>
        <span className="flex-1 font-semibold">Contact support</span>
      </a>
    </div>
    <p className="mt-6 text-center text-xs text-muted-foreground">
      {APP_NAME} v{APP_VERSION}
    </p>
  </div>
);

export default More;
