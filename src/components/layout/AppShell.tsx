import { useState, type ReactNode } from "react";
import { AppSidebar } from "./AppSidebar";
import { AppTopbar } from "./AppTopbar";
import { BottomNav } from "./BottomNav";

export function AppShell({ children }: { children: ReactNode }) {
  const [openSidebar, setOpenSidebar] = useState(false);

  return (
    <div className="min-h-screen bg-ink-50/60">
      <div className="flex">
        <AppSidebar open={openSidebar} onClose={() => setOpenSidebar(false)} />
        <div className="flex-1 min-w-0 flex flex-col">
          <AppTopbar onMenu={() => setOpenSidebar(true)} />
          <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6 lg:py-8 pb-24 lg:pb-10 max-w-7xl w-full mx-auto">
            {children}
          </main>
        </div>
      </div>
      <BottomNav />
    </div>
  );
}
