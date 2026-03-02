import {
  LayoutDashboard, GraduationCap, BookOpen, FileText, Users, MessageSquare,
  Image, Settings, BarChart3, ClipboardList, Shield, History, ImageIcon,
  Bell, Upload
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useLocation } from "react-router-dom";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel,
  SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar,
} from "@/components/ui/sidebar";
import logo from "@/assets/logo.png";

const mainItems = [
  { title: "Dashboard", url: "/admin", icon: LayoutDashboard },
  { title: "Colleges", url: "/admin/colleges", icon: GraduationCap },
  { title: "Courses", url: "/admin/courses", icon: BookOpen },
  { title: "Exams", url: "/admin/exams", icon: FileText },
  { title: "Leads", url: "/admin/leads", icon: ClipboardList },
];

const contentItems = [
  { title: "Blogs", url: "/admin/blogs", icon: FileText },
  { title: "Testimonials", url: "/admin/testimonials", icon: MessageSquare },
  { title: "Banners", url: "/admin/banners", icon: Image },
  { title: "Media Library", url: "/admin/media", icon: ImageIcon },
];

const settingsItems = [
  { title: "Users & Roles", url: "/admin/users", icon: Users },
  { title: "Audit Logs", url: "/admin/audit-logs", icon: History },
  { title: "Notifications", url: "/admin/notifications", icon: Bell },
  { title: "SEO Settings", url: "/admin/seo", icon: Shield },
  { title: "Analytics", url: "/admin/analytics", icon: BarChart3 },
  { title: "Bulk Import", url: "/admin/bulk-import", icon: Upload },
  { title: "System", url: "/admin/system", icon: Settings },
];

export function AdminSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";

  const renderItems = (items: typeof mainItems) =>
    items.map((item) => (
      <SidebarMenuItem key={item.title}>
        <SidebarMenuButton asChild>
          <NavLink
            to={item.url}
            end={item.url === "/admin"}
            className="hover:bg-sidebar-accent"
            activeClassName="bg-sidebar-accent text-sidebar-primary font-medium"
          >
            <item.icon className="mr-2 h-4 w-4 shrink-0" />
            {!collapsed && <span>{item.title}</span>}
          </NavLink>
        </SidebarMenuButton>
      </SidebarMenuItem>
    ));

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-sidebar-border">
        <img src={logo} alt="Logo" className="h-8" />
        {!collapsed && <span className="font-semibold text-sm">Aarambh Admin</span>}
      </div>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Main</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>{renderItems(mainItems)}</SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Content</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>{renderItems(contentItems)}</SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Settings</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>{renderItems(settingsItems)}</SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
