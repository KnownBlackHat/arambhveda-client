import {
  LayoutDashboard, Database, Phone, Calendar, ClipboardList,
  Users, UserPlus, BarChart3, History, Shield, Eye, X,
  GraduationCap, BookOpen, FileText, MessageSquare, Image, Settings,
  Bell, Upload, ImageIcon, Megaphone, Search as SearchIcon
} from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";
import logo from "@/assets/logo.png";

const salesMenu = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard, end: true },
  { title: "Today's Data", url: "/dashboard/todays-data", icon: Database },
  { title: "Leads", url: "/dashboard/leads", icon: Phone },
  { title: "Call Logs", url: "/dashboard/calls", icon: ClipboardList },
  { title: "Attendance", url: "/dashboard/attendance", icon: Calendar },
];

const contentMenu = [
  { title: "Colleges", url: "/dashboard/colleges", icon: GraduationCap },
  { title: "Courses", url: "/dashboard/courses", icon: BookOpen },
  { title: "Exams", url: "/dashboard/exams", icon: FileText },
  { title: "Blogs", url: "/dashboard/blogs", icon: FileText },
  { title: "Testimonials", url: "/dashboard/testimonials", icon: MessageSquare },
  { title: "Banners", url: "/dashboard/banners", icon: Megaphone },
  { title: "Media Library", url: "/dashboard/media", icon: ImageIcon },
];

const adminMenu = [
  { title: "Team", url: "/dashboard/team", icon: Users },
  { title: "Invite User", url: "/dashboard/invite", icon: UserPlus },
  { title: "Analytics", url: "/dashboard/analytics", icon: BarChart3 },
  { title: "Audit Logs", url: "/dashboard/audit", icon: History },
  { title: "SEO Settings", url: "/dashboard/seo", icon: SearchIcon },
  { title: "Notifications", url: "/dashboard/notifications", icon: Bell },
  { title: "Bulk Import", url: "/dashboard/bulk-import", icon: Upload },
  { title: "Security", url: "/dashboard/security", icon: Shield },
  { title: "System", url: "/dashboard/system", icon: Settings },
];

interface ERPSidebarProps {
  open: boolean;
  onClose: () => void;
}

export function ERPSidebar({ open, onClose }: ERPSidebarProps) {
  const { hasRole } = useAuth();
  const isErpAdmin = hasRole("admin") || hasRole("super_admin");

  const renderLink = (item: typeof salesMenu[0]) => (
    <NavLink
      key={item.url}
      to={item.url}
      end={item.end || false}
      onClick={onClose}
      className={({ isActive }) =>
        cn(
          "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
          isActive
            ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-sm"
            : "text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-border"
        )
      }
    >
      <item.icon className="h-4 w-4 shrink-0" />
      <span>{item.title}</span>
    </NavLink>
  );

  const renderSection = (label: string, items: typeof salesMenu) => (
    <div>
      <p className="px-3 mb-2 text-[10px] font-semibold uppercase tracking-widest text-sidebar-foreground/30">
        {label}
      </p>
      <div className="space-y-1">
        {items.map((item) => renderLink(item))}
      </div>
    </div>
  );

  const sidebarContent = (
    <div className="flex flex-col h-full bg-sidebar">
      <div className="px-4 py-5 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <img src={logo} alt="Logo" className="h-9 w-9 rounded-lg" />
          <div className="min-w-0">
            <h1 className="text-sm font-bold text-sidebar-foreground truncate">Aarambhaveda</h1>
            <p className="text-[10px] text-sidebar-foreground/40 uppercase tracking-wider">Unified Portal</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        {renderSection("Sales & CRM", salesMenu)}
        {isErpAdmin && renderSection("Content Management", contentMenu)}
        {isErpAdmin && renderSection("Administration", adminMenu)}
      </nav>

      <div className="px-4 py-3 border-t border-sidebar-border">
        <p className="text-[10px] text-sidebar-foreground/25">v2.0.0 • Aarambhaveda Portal</p>
      </div>
    </div>
  );

  return (
    <>
      <aside className="hidden lg:flex w-64 shrink-0 h-screen sticky top-0">
        {sidebarContent}
      </aside>

      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={onClose} />
          <aside className="relative w-64 h-full">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 text-sidebar-foreground/50 hover:text-sidebar-foreground"
            >
              <X className="h-5 w-5" />
            </button>
            {sidebarContent}
          </aside>
        </div>
      )}
    </>
  );
}
