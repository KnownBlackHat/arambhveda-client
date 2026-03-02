import { ReactNode, useState } from "react";
import { ERPSidebar } from "./ERPSidebar";
import { ERPHeader } from "./ERPHeader";

export function ERPLayout({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen w-full bg-background">
      <ERPSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col min-w-0">
        <ERPHeader onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 p-4 md:p-6 overflow-auto">{children}</main>
        <footer className="h-10 border-t border-border flex items-center justify-center">
          <p className="text-xs text-muted-foreground">© 2026 Aarambhaveda • Enterprise Sales Management</p>
        </footer>
      </div>
    </div>
  );
}
