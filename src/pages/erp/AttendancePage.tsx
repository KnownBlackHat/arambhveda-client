import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Clock, LogIn, LogOut } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

export default function AttendancePage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: attendance } = useQuery({
    queryKey: ["erp-attendance", user?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from("erp_attendance")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(30);
      return data || [];
    },
  });

  const todayRecord = attendance?.find(
    (a) => new Date(a.check_in).toDateString() === new Date().toDateString()
  );

  const checkIn = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("erp_attendance").insert({
        user_id: user?.id!,
        check_in: new Date().toISOString(),
        status: "present",
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["erp-attendance"] });
      toast({ title: "Checked in successfully!" });
    },
    onError: (err: any) => toast({ title: "Error", description: err.message, variant: "destructive" }),
  });

  const checkOut = useMutation({
    mutationFn: async () => {
      if (!todayRecord) return;
      const { error } = await supabase.from("erp_attendance").update({
        check_out: new Date().toISOString(),
      }).eq("id", todayRecord.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["erp-attendance"] });
      toast({ title: "Checked out successfully!" });
    },
    onError: (err: any) => toast({ title: "Error", description: err.message, variant: "destructive" }),
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Attendance</h1>
        <p className="text-sm text-muted-foreground">Track your daily attendance</p>
      </div>

      <Card className="p-6 border-0 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold">Today - {format(new Date(), "EEEE, MMM d, yyyy")}</h3>
            {todayRecord ? (
              <p className="text-sm text-muted-foreground mt-1">
                Checked in at {format(new Date(todayRecord.check_in), "h:mm a")}
                {todayRecord.check_out && ` • Checked out at ${format(new Date(todayRecord.check_out), "h:mm a")}`}
              </p>
            ) : (
              <p className="text-sm text-muted-foreground mt-1">Not checked in yet</p>
            )}
          </div>
          <div className="flex gap-2">
            {!todayRecord ? (
              <Button onClick={() => checkIn.mutate()} className="bg-accent hover:bg-accent/90 text-accent-foreground" disabled={checkIn.isPending}>
                <LogIn className="h-4 w-4 mr-2" />{checkIn.isPending ? "..." : "Check In"}
              </Button>
            ) : !todayRecord.check_out ? (
              <Button onClick={() => checkOut.mutate()} variant="outline" disabled={checkOut.isPending}>
                <LogOut className="h-4 w-4 mr-2" />{checkOut.isPending ? "..." : "Check Out"}
              </Button>
            ) : (
              <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                <Clock className="h-3 w-3 mr-1" /> Day Complete
              </Badge>
            )}
          </div>
        </div>
      </Card>

      <Card className="border-0 shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Check In</TableHead>
              <TableHead>Check Out</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Duration</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {attendance?.map((a) => {
              const dur = a.check_out
                ? Math.round((new Date(a.check_out).getTime() - new Date(a.check_in).getTime()) / 60000)
                : null;
              return (
                <TableRow key={a.id}>
                  <TableCell className="font-medium">{format(new Date(a.check_in), "MMM d, yyyy")}</TableCell>
                  <TableCell>{format(new Date(a.check_in), "h:mm a")}</TableCell>
                  <TableCell>{a.check_out ? format(new Date(a.check_out), "h:mm a") : "—"}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                      {a.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{dur ? `${Math.floor(dur / 60)}h ${dur % 60}m` : "—"}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
