import { useEffect, useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import {
  GraduationCap, ClipboardList, TrendingUp, Users, Eye, Phone, BarChart3, Activity
} from "lucide-react";

interface DashboardStats {
  totalColleges: number;
  totalLeads: number;
  todayLeads: number;
  weekLeads: number;
  monthLeads: number;
  newLeads: number;
  contactedLeads: number;
  convertedLeads: number;
  conversionRate: number;
  pendingCallbacks: number;
  featuredColleges: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalColleges: 0, totalLeads: 0, todayLeads: 0, weekLeads: 0, monthLeads: 0,
    newLeads: 0, contactedLeads: 0, convertedLeads: 0, conversionRate: 0,
    pendingCallbacks: 0, featuredColleges: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
      const weekAgo = new Date(now.getTime() - 7 * 86400000).toISOString();
      const monthAgo = new Date(now.getTime() - 30 * 86400000).toISOString();

      const [colleges, leads, todayL, weekL, monthL, featured] = await Promise.all([
        supabase.from("colleges").select("id", { count: "exact", head: true }),
        supabase.from("leads").select("id, status", { count: "exact" }),
        supabase.from("leads").select("id", { count: "exact", head: true }).gte("created_at", today),
        supabase.from("leads").select("id", { count: "exact", head: true }).gte("created_at", weekAgo),
        supabase.from("leads").select("id", { count: "exact", head: true }).gte("created_at", monthAgo),
        supabase.from("colleges").select("id", { count: "exact", head: true }).eq("is_featured", true),
      ]);

      const leadsData = leads.data || [];
      const newL = leadsData.filter(l => l.status === "new").length;
      const contacted = leadsData.filter(l => l.status === "contacted").length;
      const converted = leadsData.filter(l => l.status === "converted").length;
      const total = leads.count || 0;

      setStats({
        totalColleges: colleges.count || 0,
        totalLeads: total,
        todayLeads: todayL.count || 0,
        weekLeads: weekL.count || 0,
        monthLeads: monthL.count || 0,
        newLeads: newL,
        contactedLeads: contacted,
        convertedLeads: converted,
        conversionRate: total > 0 ? Math.round((converted / total) * 100) : 0,
        pendingCallbacks: contacted,
        featuredColleges: featured.count || 0,
      });
      setLoading(false);
    }
    fetchStats();
  }, []);

  const statCards = [
    { label: "Total Colleges", value: stats.totalColleges, icon: GraduationCap, color: "text-primary" },
    { label: "Total Leads", value: stats.totalLeads, icon: ClipboardList, color: "text-blue-600" },
    { label: "Today's Leads", value: stats.todayLeads, icon: Activity, color: "text-green-600" },
    { label: "This Week", value: stats.weekLeads, icon: TrendingUp, color: "text-purple-600" },
    { label: "This Month", value: stats.monthLeads, icon: BarChart3, color: "text-orange-600" },
    { label: "Conversion Rate", value: `${stats.conversionRate}%`, icon: TrendingUp, color: "text-green-600" },
    { label: "Pending Callbacks", value: stats.pendingCallbacks, icon: Phone, color: "text-yellow-600" },
    { label: "Featured Colleges", value: stats.featuredColleges, icon: Eye, color: "text-primary" },
  ];

  const leadsByStatus = [
    { label: "New", count: stats.newLeads, color: "bg-blue-500" },
    { label: "Contacted", count: stats.contactedLeads, color: "bg-yellow-500" },
    { label: "Converted", count: stats.convertedLeads, color: "bg-green-500" },
    { label: "Total", count: stats.totalLeads, color: "bg-muted-foreground" },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
          <p className="text-sm text-muted-foreground">Welcome to Aarambh Veda Admin</p>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {statCards.map((s) => (
            <Card key={s.label}>
              <CardContent className="p-4 flex items-center gap-3">
                <div className={`p-2 rounded-lg bg-muted ${s.color}`}>
                  <s.icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">{s.label}</p>
                  <p className="text-xl font-bold text-foreground">
                    {loading ? "—" : s.value}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Lead Status Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Lead Status Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {leadsByStatus.map((s) => (
                <div key={s.label} className="text-center p-4 rounded-lg bg-muted/50">
                  <div className={`h-2 w-16 mx-auto rounded-full mb-2 ${s.color}`} />
                  <p className="text-2xl font-bold text-foreground">{loading ? "—" : s.count}</p>
                  <p className="text-xs text-muted-foreground">{s.label}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
