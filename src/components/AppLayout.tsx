import { Outlet } from "react-router-dom";
import { BottomNav } from "./BottomNav";
import { AdBanner } from "./AdBanner";
import { useAppOpenAd } from "@/lib/ads";

export const AppLayout = () => {
  useAppOpenAd();
  return (
    <div className="mx-auto min-h-screen max-w-md bg-background pb-[calc(8.5rem+env(safe-area-inset-bottom))] pt-[env(safe-area-inset-top)]">
      <Outlet />
      <div className="fixed inset-x-0 bottom-[calc(4rem+env(safe-area-inset-bottom))] z-20 mx-auto max-w-md pb-2">
        <AdBanner />
      </div>
      <BottomNav />
    </div>
  );
};
