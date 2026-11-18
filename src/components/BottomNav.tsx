import { NavLink } from "react-router-dom";
import { Home, HardDrive, LayoutGrid, Gauge, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { to: "/", label: "Home", icon: Home },
  { to: "/storage", label: "Storage", icon: HardDrive },
  { to: "/apps", label: "Apps", icon: LayoutGrid },
  { to: "/speed", label: "Speed", icon: Gauge },
  { to: "/more", label: "More", icon: Settings },
];

export const BottomNav = () => (
  <nav className="fixed inset-x-0 bottom-0 z-30 mx-auto max-w-md border-t bg-card pb-[env(safe-area-inset-bottom)]">
    <ul className="grid h-16 grid-cols-5">
      {items.map(({ to, label, icon: Icon }) => (
        <li key={to}>
          <NavLink
            to={to}
            end={to === "/"}
            className={({ isActive }) =>
              cn(
                "flex h-full flex-col items-center justify-center gap-1 text-[11px] font-semibold transition-colors",
                isActive ? "text-primary" : "text-muted-foreground",
              )
            }
          >
            {({ isActive }) => (
              <>
                <span className={cn("grid h-7 w-12 place-items-center rounded-full transition-colors", isActive && "bg-secondary")}>
                  <Icon className="h-5 w-5" />
                </span>
                {label}
              </>
            )}
          </NavLink>
        </li>
      ))}
    </ul>
  </nav>
);
