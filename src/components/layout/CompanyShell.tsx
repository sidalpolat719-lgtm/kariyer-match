import { useState, type ReactNode } from "react";
import { CompanySidebar } from "./CompanySidebar";
import { CompanyTopbar } from "./CompanyTopbar";
import { CompanyBottomNav } from "./CompanyBottomNav";
import { NewPostingModal } from "../company/NewPostingModal";

export function CompanyShell({ children }: { children: ReactNode }) {
  const [openSidebar, setOpenSidebar] = useState(false);
  const [newPostingOpen, setNewPostingOpen] = useState(false);

  return (
    <div className="min-h-screen bg-grad-corp-soft relative">
      {/* Subtle ambient bg */}
      <div
        className="fixed inset-0 -z-10 opacity-50 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(at 0% 0%, #ddd6fe 0px, transparent 40%), radial-gradient(at 100% 100%, #fae8ff 0px, transparent 40%)",
        }}
      />
      <div className="flex">
        <CompanySidebar
          open={openSidebar}
          onClose={() => setOpenSidebar(false)}
          onNewPosting={() => setNewPostingOpen(true)}
        />
        <div className="flex-1 min-w-0 flex flex-col">
          <CompanyTopbar
            onMenu={() => setOpenSidebar(true)}
            onNewPosting={() => setNewPostingOpen(true)}
          />
          <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6 lg:py-8 pb-24 lg:pb-10 max-w-[1480px] w-full mx-auto">
            {children}
          </main>
        </div>
      </div>
      <CompanyBottomNav />
      <NewPostingModal open={newPostingOpen} onClose={() => setNewPostingOpen(false)} />
    </div>
  );
}
