import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Shield, Lock, AlertTriangle, CheckCircle } from "lucide-react";
import { format } from "date-fns";

export default function SecurityPage() {
  const { data: loginAttempts } = useQuery({
    queryKey: ["login-attempts"],
    queryFn: async () => {
      const { data } = await supabase.from("login_attempts").select("*").order("created_at", { ascending: false }).limit(100);
      return data || [];
    },
  });

  const { data: roleStats } = useQuery({
    queryKey: ["role-stats"],
    queryFn: async () => {
      const { data } = await supabase.from("user_roles").select("role");
      const counts: Record<string, number> = {};
      (data || []).forEach((r) => { counts[r.role] = (counts[r.role] || 0) + 1; });
      return counts;
    },
  });

  const successRate = loginAttempts
    ? Math.round((loginAttempts.filter(a => a.success).length / Math.max(loginAttempts.length, 1)) * 100)
    : 0;
  const failedAttempts = loginAttempts?.filter(a => !a.success).length || 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Security Overview</h1>
        <p className="text-sm text-muted-foreground">Monitor authentication and access control</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4 border-0 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-green-100 text-green-600"><Shield className="h-4 w-4" /></div>
            <div><p className="text-xl font-bold">{successRate}%</p><p className="text-xs text-muted-foreground">Login Success</p></div>
          </div>
        </Card>
        <Card className="p-4 border-0 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-red-100 text-red-600"><AlertTriangle className="h-4 w-4" /></div>
            <div><p className="text-xl font-bold">{failedAttempts}</p><p className="text-xs text-muted-foreground">Failed Logins</p></div>
          </div>
        </Card>
        <Card className="p-4 border-0 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-100 text-blue-600"><Lock className="h-4 w-4" /></div>
            <div><p className="text-xl font-bold">{Object.keys(roleStats || {}).length}</p><p className="text-xs text-muted-foreground">Active Roles</p></div>
          </div>
        </Card>
        <Card className="p-4 border-0 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-accent/10 text-accent"><CheckCircle className="h-4 w-4" /></div>
            <div><p className="text-xl font-bold">{loginAttempts?.length || 0}</p><p className="text-xs text-muted-foreground">Total Attempts</p></div>
          </div>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="p-6 border-0 shadow-sm">
          <h3 className="font-semibold mb-4">Role Distribution</h3>
          <div className="space-y-3">
            {Object.entries(roleStats || {}).map(([role, count]) => (
              <div key={role} className="flex items-center justify-between">
                <Badge variant="secondary">{role}</Badge>
                <span className="font-semibold">{count as number}</span>
              </div>
            ))}
            {Object.keys(roleStats || {}).length === 0 && (
              <p className="text-sm text-muted-foreground">No roles found</p>
            )}
          </div>
        </Card>

        <Card className="p-6 border-0 shadow-sm">
          <h3 className="font-semibold mb-4">Security Policies</h3>
          <div className="space-y-3 text-sm">
            <div className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-green-500" /><span>Row Level Security enabled on all tables</span></div>
            <div className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-green-500" /><span>Role-based access control active</span></div>
            <div className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-green-500" /><span>Email verification required</span></div>
            <div className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-green-500" /><span>Soft delete protection for records</span></div>
            <div className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-green-500" /><span>Audit logging for admin actions</span></div>
          </div>
        </Card>
      </div>

      <Card className="border-0 shadow-sm overflow-hidden">
        <div className="p-4 border-b"><h3 className="font-semibold">Recent Login Attempts</h3></div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Email</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>IP Address</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loginAttempts?.slice(0, 20).map((a) => (
              <TableRow key={a.id}>
                <TableCell className="font-medium">{a.email}</TableCell>
                <TableCell>
                  <Badge variant={a.success ? "secondary" : "destructive"} className={a.success ? "bg-green-100 text-green-800" : ""}>
                    {a.success ? "Success" : "Failed"}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">{a.ip_address || "—"}</TableCell>
                <TableCell className="text-sm text-muted-foreground">{format(new Date(a.created_at), "MMM d, h:mm a")}</TableCell>
              </TableRow>
            ))}
            {(!loginAttempts || loginAttempts.length === 0) && (
              <TableRow><TableCell colSpan={4} className="text-center py-8 text-muted-foreground">No login attempts recorded</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
