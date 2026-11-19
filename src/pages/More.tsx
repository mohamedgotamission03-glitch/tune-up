import { Link } from "react-router-dom";
import { useTheme } from "next-themes";
import { ChevronRight, ShieldCheck, FileText, Smartphone, Mail, Moon, Megaphone, Package } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { Switch } from "@/components/ui/switch";
import { APP_NAME, APP_VERSION, SUPPORT_EMAIL } from "@/lib/appInfo";
import { isNative, openAdPrivacyOptions } from "@/lib/ads";

const links = [
  { to: "/device", label: "Device info", icon: Smartphone },
  { to: "/privacy", label: "Privacy Policy", icon: ShieldCheck },
  { to: "/terms", label: "Terms of Service", icon: FileText },
  ...(import.meta.env.DEV ? [{ to: "/kit", label: "Store kit (preview only)", icon: Package }] : []),
];

const rowCls = "flex items-center gap-3 p-4 active:bg-secondary";
const iconCls = "grid h-10 w-10 place-items-center rounded-xl bg-secondary text-primary";

const More = () => {
  const { resolvedTheme, setTheme } = useTheme();
  return (
    <div className="animate-in fade-in duration-300">
      <PageHeader title="More" subtitle="Settings, about and legal" />
      <div className="mx-4 overflow-hidden rounded-3xl bg-card shadow-sm">
        <div className={rowCls}>
          <span className={iconCls}><Moon className="h-5 w-5" /></span>
          <span className="flex-1 font-semibold">Dark mode</span>
          <Switch checked={resolvedTheme === "dark"} onCheckedChange={(v) => setTheme(v ? "dark" : "light")} />
        </div>
        {links.map(({ to, label, icon: Icon }) => (
          <Link key={to} to={to} className={`${rowCls} border-t`}>
            <span className={iconCls}><Icon className="h-5 w-5" /></span>
            <span className="flex-1 font-semibold">{label}</span>
            <ChevronRight className="h-5 w-5 text-muted-foreground" />
          </Link>
        ))}
        {isNative() && (
          <button onClick={openAdPrivacyOptions} className={`${rowCls} w-full border-t text-left`}>
            <span className={iconCls}><Megaphone className="h-5 w-5" /></span>
            <span className="flex-1 font-semibold">Ad privacy choices</span>
            <ChevronRight className="h-5 w-5 text-muted-foreground" />
          </button>
        )}
        <a href={`mailto:${SUPPORT_EMAIL}`} className={`${rowCls} border-t`}>
          <span className={iconCls}><Mail className="h-5 w-5" /></span>
          <span className="flex-1 font-semibold">Contact support</span>
        </a>
      </div>
      <p className="mt-6 text-center text-xs text-muted-foreground">
        {APP_NAME} 2027 · v{APP_VERSION}
      </p>
    </div>
  );
};

export default More;
