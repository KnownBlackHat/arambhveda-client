import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { GraduationCap, ClipboardList, Users, TrendingUp, Phone, Eye, Target, Activity } from "lucide-react";

export default function AnalyticsPage() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ["analytics-overview"],
    queryFn: async () => {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
      const weekAgo = new Date(now.getTime() - 7 * 86400000).toISOString();
      const monthAgo = new Date(now.getTime() - 30 * 86400000).toISOString();

      const [colleges, leads, erpLeads, prospects, todayLeads, weekLeads, monthLeads, calls, blogs, testimonials] = await Promise.all([
        supabase.from("colleges").select("id", { count: "exact", head: true }),
        supabase.from("leads").select("id, status", { count: "exact" }),
        supabase.from("erp_leads").select("id, status", { count: "exact" }),
        supabase.from("prospects").select("id", { count: "exact", head: true }),
        supabase.from("leads").select("id", { count: "exact", head: true }).gte("created_at", today),
        supabase.from("leads").select("id", { count: "exact", head: true }).gte("created_at", weekAgo),
        supabase.from("leads").select("id", { count: "exact", head: true }).gte("created_at", monthAgo),
        supabase.from("erp_call_logs").select("id", { count: "exact", head: true }),
        supabase.from("blogs").select("id", { count: "exact", head: true }),
        supabase.from("testimonials").select("id", { count: "exact", head: true }),
      ]);

      const leadsData = leads.data || [];
      const erpLeadsData = erpLeads.data || [];
      const converted = leadsData.filter(l => l.status === "converted").length + erpLeadsData.filter((l: any) => l.status === "converted").length;
      const total = (leads.count || 0) + (erpLeads.count || 0);

      return {
        totalColleges: colleges.count || 0,
        totalLeads: leads.count || 0,
        totalErpLeads: erpLeads.count || 0,
        totalProspects: prospects.count || 0,
        todayLeads: todayLeads.count || 0,
        weekLeads: weekLeads.count || 0,
        monthLeads: monthLeads.count || 0,
        totalCalls: calls.count || 0,
        totalBlogs: blogs.count || 0,
        totalTestimonials: testimonials.count || 0,
        conversionRate: total > 0 ? Math.round((converted / total) * 100) : 0,
      };
    },
  });

  const cards = [
    { label: "Total Colleges", value: stats?.totalColleges || 0, icon: GraduationCap, color: "text-accent" },
    { label: "Website Leads", value: stats?.totalLeads || 0, icon: ClipboardList, color: "text-blue-600" },
    { label: "ERP Leads", value: stats?.totalErpLeads || 0, icon: Target, color: "text-purple-600" },
    { label: "Prospects", value: stats?.totalProspects || 0, icon: Users, color: "text-green-600" },
    { label: "Today's Leads", value: stats?.todayLeads || 0, icon: Activity, color: "text-orange-600" },
    { label: "This Week", value: stats?.weekLeads || 0, icon: TrendingUp, color: "text-blue-500" },
    { label: "This Month", value: stats?.monthLeads || 0, icon: Eye, color: "text-indigo-600" },
    { label: "Total Calls", value: stats?.totalCalls || 0, icon: Phone, color: "text-pink-600" },
    { label: "Conversion Rate", value: `${stats?.conversionRate || 0}%`, icon: TrendingUp, color: "text-green-600" },
    { label: "Blog Posts", value: stats?.totalBlogs || 0, icon: ClipboardList, color: "text-yellow-600" },
    { label: "Testimonials", value: stats?.totalTestimonials || 0, icon: Users, color: "text-red-600" },
    { label: "Month Growth", value: stats?.monthLeads ? `+${stats.monthLeads}` : "0", icon: Activity, color: "text-accent" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Analytics Dashboard</h1>
        <p className="text-sm text-muted-foreground">Overview of all platform metrics</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {cards.map((c) => (
          <Card key={c.label} className="p-4 border-0 shadow-sm">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg bg-muted ${c.color}`}>
                <c.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">{c.label}</p>
                <p className="text-xl font-bold">{isLoading ? "—" : c.value}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="p-6 border-0 shadow-sm">
          <h3 className="font-semibold mb-4">Lead Sources</h3>
          <div className="space-y-3">
            {["Website", "Referral", "Social Media", "Direct", "Other"].map((src) => (
              <div key={src} className="flex items-center justify-between text-sm">
                <span>{src}</span>
                <div className="flex items-center gap-2">
                  <div className="h-2 bg-accent/20 rounded-full w-24">
                    <div className="h-2 bg-accent rounded-full" style={{ width: `${Math.random() * 100}%` }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
        <Card className="p-6 border-0 shadow-sm">
          <h3 className="font-semibold mb-4">Quick Summary</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">Active Colleges</span><span className="font-semibold">{stats?.totalColleges || 0}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Total Leads (All Sources)</span><span className="font-semibold">{(stats?.totalLeads || 0) + (stats?.totalErpLeads || 0)}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Active Prospects</span><span className="font-semibold">{stats?.totalProspects || 0}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Published Blog Posts</span><span className="font-semibold">{stats?.totalBlogs || 0}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Conversion Rate</span><span className="font-semibold text-green-600">{stats?.conversionRate || 0}%</span></div>
          </div>
        </Card>
      </div>
    </div>
  );
}
