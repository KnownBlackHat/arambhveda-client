// Unified dashboard - no AdminLayout wrapper needed
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { Bell, Check, CheckCheck, AlertTriangle, Info, XCircle, CheckCircle } from "lucide-react";
import { format } from "date-fns";

const typeIcons: Record<string, any> = {
  info: Info,
  warning: AlertTriangle,
  error: XCircle,
  success: CheckCircle,
};
const typeColors: Record<string, string> = {
  info: "bg-blue-100 text-blue-800",
  warning: "bg-yellow-100 text-yellow-800",
  error: "bg-red-100 text-red-800",
  success: "bg-green-100 text-green-800",
};

export default function AdminNotifications() {
  const { user } = useAuth();
  const qc = useQueryClient();

  const { data: notifications, isLoading } = useQuery({
    queryKey: ["admin-notifications"],
    queryFn: async () => {
      const { data } = await supabase
        .from("admin_notifications")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(100);
      return data || [];
    },
  });

  const markRead = async (id: string) => {
    await supabase.from("admin_notifications").update({ is_read: true }).eq("id", id);
    qc.invalidateQueries({ queryKey: ["admin-notifications"] });
  };

  const markAllRead = async () => {
    if (!user) return;
    await supabase.from("admin_notifications").update({ is_read: true }).eq("user_id", user.id).eq("is_read", false);
    qc.invalidateQueries({ queryKey: ["admin-notifications"] });
  };

  const unreadCount = notifications?.filter(n => !n.is_read).length || 0;

  return (
    <>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Notifications</h1>
            <p className="text-sm text-muted-foreground">{unreadCount} unread</p>
          </div>
          {unreadCount > 0 && (
            <Button variant="outline" size="sm" onClick={markAllRead}>
              <CheckCheck className="h-4 w-4 mr-1" /> Mark All Read
            </Button>
          )}
        </div>

        <div className="space-y-2">
          {isLoading ? (
            <Card><CardContent className="py-8 text-center text-muted-foreground">Loading...</CardContent></Card>
          ) : !notifications?.length ? (
            <Card><CardContent className="py-12 text-center text-muted-foreground">
              <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>No notifications yet</p>
            </CardContent></Card>
          ) : (
            notifications.map(n => {
              const Icon = typeIcons[n.type] || Info;
              return (
                <Card key={n.id} className={`transition-colors ${!n.is_read ? "border-primary/30 bg-primary/5" : ""}`}>
                  <CardContent className="p-4 flex items-start gap-3">
                    <div className={`p-1.5 rounded ${typeColors[n.type]}`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-foreground">{n.title}</p>
                        {!n.is_read && <Badge className="bg-primary text-primary-foreground text-[10px]">New</Badge>}
                      </div>
                      <p className="text-sm text-muted-foreground mt-0.5">{n.message}</p>
                      <p className="text-xs text-muted-foreground mt-1">{format(new Date(n.created_at), "dd MMM yyyy HH:mm")}</p>
                    </div>
                    {!n.is_read && (
                      <Button variant="ghost" size="icon" onClick={() => markRead(n.id)}>
                        <Check className="h-4 w-4" />
                      </Button>
                    )}
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      </div>
    </>
  );
}
