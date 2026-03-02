import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Users, Phone, TrendingUp, Target, Activity, Clock } from "lucide-react";

export default function ERPDashboard() {
  const { user, hasRole } = useAuth();
  const isErpAdmin = hasRole("admin") || hasRole("super_admin");

  const { data: leadStats } = useQuery({
    queryKey: ["erp-lead-stats"],
    queryFn: async () => {
      const { count: totalLeads } = await supabase.from("erp_leads").select("*", { count: "exact", head: true });
      const { count: newLeads } = await supabase.from("erp_leads").select("*", { count: "exact", head: true }).eq("status", "new");
      const { count: converted } = await supabase.from("erp_leads").select("*", { count: "exact", head: true }).eq("status", "converted");
      const { count: prospects } = await supabase.from("prospects").select("*", { count: "exact", head: true });
      const { count: callsToday } = await supabase
        .from("erp_call_logs")
        .select("*", { count: "exact", head: true })
        .gte("created_at", new Date().toISOString().split("T")[0]);
      return { totalLeads: totalLeads || 0, newLeads: newLeads || 0, converted: converted || 0, prospects: prospects || 0, callsToday: callsToday || 0 };
    },
  });

  const stats = [
    { label: "Total Leads", value: leadStats?.totalLeads || 0, icon: Target, color: "text-accent" },
    { label: "New Leads", value: leadStats?.newLeads || 0, icon: TrendingUp, color: "text-blue-500" },
    { label: "Converted", value: leadStats?.converted || 0, icon: Activity, color: "text-green-500" },
    { label: "Prospects", value: leadStats?.prospects || 0, icon: Users, color: "text-purple-500" },
    { label: "Calls Today", value: leadStats?.callsToday || 0, icon: Phone, color: "text-orange-500" },
    { label: "Active Hours", value: "8h", icon: Clock, color: "text-pink-500" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Welcome back, {user?.email?.split("@")[0]}
          {isErpAdmin && <span className="ml-2 text-accent font-medium">• Admin</span>}
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="p-4 border-0 shadow-sm">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg bg-muted ${stat.color}`}>
                <stat.icon className="h-4 w-4" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="p-6 border-0 shadow-sm">
          <h3 className="font-semibold mb-4">Recent Activity</h3>
          <div className="space-y-3 text-sm text-muted-foreground">
            <p>No recent activity to display.</p>
          </div>
        </Card>
        <Card className="p-6 border-0 shadow-sm">
          <h3 className="font-semibold mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-2">
            <a href="/dashboard/calls" className="p-3 rounded-lg bg-muted hover:bg-accent/10 text-center text-sm font-medium transition-colors">
              + Add Lead
            </a>
            <a href="/dashboard/todays-data" className="p-3 rounded-lg bg-muted hover:bg-accent/10 text-center text-sm font-medium transition-colors">
              + Add Prospect
            </a>
            <a href="/dashboard/attendance" className="p-3 rounded-lg bg-muted hover:bg-accent/10 text-center text-sm font-medium transition-colors">
              Check In
            </a>
            <a href="/dashboard/leads" className="p-3 rounded-lg bg-muted hover:bg-accent/10 text-center text-sm font-medium transition-colors">
              Log Call
            </a>
          </div>
        </Card>
      </div>
    </div>
  );
}
