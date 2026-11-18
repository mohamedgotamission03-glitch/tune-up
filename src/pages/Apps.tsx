import { toast } from "sonner";
import { AppWindow, BatteryWarning, Database, MonitorSmartphone, ShieldCheck, ChevronRight } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { canOpenSettings, openSettings, type SettingsTarget } from "@/lib/device";

const shortcuts: { target: SettingsTarget; title: string; desc: string; icon: typeof AppWindow }[] = [
  { target: "apps", title: "All apps", desc: "Uninstall, clear cache or force stop any app", icon: AppWindow },
  { target: "batteryOptimization", title: "Battery optimization", desc: "Restrict apps that drain power", icon: BatteryWarning },
  { target: "data", title: "Data usage", desc: "See which apps use mobile data", icon: Database },
  { target: "defaultApps", title: "Default apps", desc: "Choose your browser, dialer and more", icon: ShieldCheck },
  { target: "display", title: "Display", desc: "Brightness and screen timeout", icon: MonitorSmartphone },
];

const Apps = () => {
  const go = async (target: SettingsTarget) => {
    if (!canOpenSettings()) {
      toast.info("This opens the matching Android settings screen in the app.");
      return;
    }
    await openSettings(target);
  };

  return (
    <div className="animate-in fade-in duration-300">
      <PageHeader title="App Manager" subtitle="Jump to Android's own app controls" />
      <ul className="mx-4 overflow-hidden rounded-3xl bg-card shadow-sm">
        {shortcuts.map(({ target, title, desc, icon: Icon }, i) => (
          <li key={target} className={i > 0 ? "border-t" : ""}>
            <button onClick={() => go(target)} className="flex w-full items-center gap-3 p-4 text-left active:bg-secondary">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-secondary text-primary">
                <Icon className="h-5 w-5" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block font-bold">{title}</span>
                <span className="block text-xs text-muted-foreground">{desc}</span>
              </span>
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </button>
          </li>
        ))}
      </ul>
      <p className="mx-6 mt-3 text-xs text-muted-foreground">
        For your privacy, TuneUp does not read your installed apps list. Android's own screens give you full control.
      </p>
    </div>
  );
};

export default Apps;
