import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format } from "date-fns";

export default function AuditLogsPage() {
  const { data: logs, isLoading } = useQuery({
    queryKey: ["audit-logs"],
    queryFn: async () => {
      const { data } = await supabase.from("activity_logs").select("*").order("created_at", { ascending: false }).limit(200);
      return data || [];
    },
  });

  const actionColor: Record<string, string> = {
    create: "bg-green-100 text-green-800",
    update: "bg-blue-100 text-blue-800",
    delete: "bg-red-100 text-red-800",
    restore: "bg-yellow-100 text-yellow-800",
    login: "bg-purple-100 text-purple-800",
  };

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold">Audit Logs</h1>
        <p className="text-sm text-muted-foreground">Track all administrative actions</p>
      </div>

      <Card className="border-0 shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Action</TableHead>
              <TableHead>Module</TableHead>
              <TableHead>Record ID</TableHead>
              <TableHead>Details</TableHead>
              <TableHead>IP</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow><TableCell colSpan={6} className="text-center py-8 text-muted-foreground">Loading...</TableCell></TableRow>
            ) : logs?.length === 0 ? (
              <TableRow><TableCell colSpan={6} className="text-center py-8 text-muted-foreground">No audit logs yet</TableCell></TableRow>
            ) : (
              logs?.map((log) => (
                <TableRow key={log.id}>
                  <TableCell>
                    <Badge variant="secondary" className={actionColor[log.action_type] || ""}>
                      {log.action_type}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-medium">{log.module}</TableCell>
                  <TableCell className="text-sm font-mono text-muted-foreground">{log.record_id ? log.record_id.slice(0, 8) : "—"}</TableCell>
                  <TableCell className="text-sm max-w-[200px] truncate">
                    {log.details ? JSON.stringify(log.details).slice(0, 60) : "—"}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{log.ip_address || "—"}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{format(new Date(log.created_at), "MMM d, h:mm a")}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
