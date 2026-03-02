import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Server, Database, Users, HardDrive, CheckCircle, Clock } from "lucide-react";

export default function SystemPage() {
  const { data: stats } = useQuery({
    queryKey: ["system-stats"],
    queryFn: async () => {
      const [colleges, leads, users, blogs, exams, courses] = await Promise.all([
        supabase.from("colleges").select("id", { count: "exact", head: true }),
        supabase.from("leads").select("id", { count: "exact", head: true }),
        supabase.from("profiles").select("id", { count: "exact", head: true }),
        supabase.from("blogs").select("id", { count: "exact", head: true }),
        supabase.from("exams").select("id", { count: "exact", head: true }),
        supabase.from("courses").select("id", { count: "exact", head: true }),
      ]);
      return {
        colleges: colleges.count || 0,
        leads: leads.count || 0,
        users: users.count || 0,
        blogs: blogs.count || 0,
        exams: exams.count || 0,
        courses: courses.count || 0,
      };
    },
  });

  const tables = [
    { name: "colleges", rows: stats?.colleges || 0 },
    { name: "leads", rows: stats?.leads || 0 },
    { name: "profiles", rows: stats?.users || 0 },
    { name: "blogs", rows: stats?.blogs || 0 },
    { name: "exams", rows: stats?.exams || 0 },
    { name: "courses", rows: stats?.courses || 0 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">System Settings</h1>
        <p className="text-sm text-muted-foreground">Platform configuration and health</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4 border-0 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-green-100 text-green-600"><Server className="h-4 w-4" /></div>
            <div><p className="text-sm font-semibold">System Status</p><Badge className="bg-green-100 text-green-800">Healthy</Badge></div>
          </div>
        </Card>
        <Card className="p-4 border-0 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-100 text-blue-600"><Database className="h-4 w-4" /></div>
            <div><p className="text-sm font-semibold">Database</p><Badge className="bg-blue-100 text-blue-800">Connected</Badge></div>
          </div>
        </Card>
        <Card className="p-4 border-0 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-accent/10 text-accent"><Users className="h-4 w-4" /></div>
            <div><p className="text-sm font-semibold">Auth</p><Badge className="bg-green-100 text-green-800">Active</Badge></div>
          </div>
        </Card>
        <Card className="p-4 border-0 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-purple-100 text-purple-600"><HardDrive className="h-4 w-4" /></div>
            <div><p className="text-sm font-semibold">Storage</p><Badge className="bg-green-100 text-green-800">Online</Badge></div>
          </div>
        </Card>
      </div>

      <Card className="p-6 border-0 shadow-sm">
        <h3 className="font-semibold mb-4">Database Tables Overview</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {tables.map((t) => (
            <div key={t.name} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-2">
                <Database className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium font-mono">{t.name}</span>
              </div>
              <Badge variant="secondary">{t.rows} rows</Badge>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
