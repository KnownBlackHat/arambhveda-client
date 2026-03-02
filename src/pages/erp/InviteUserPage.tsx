import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { UserPlus, Copy, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  accepted: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  expired: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
  revoked: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400",
};

export default function InviteUserPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("user");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const { data: invitations } = useQuery({
    queryKey: ["invitations"],
    queryFn: async () => {
      const { data } = await supabase.from("invitations").select("*").order("created_at", { ascending: false });
      return data || [];
    },
  });

  const createInvite = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("invitations").insert({
        email,
        role: role as any,
        invited_by: user?.id,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invitations"] });
      setEmail("");
      toast({ title: "Invitation created" });
    },
    onError: (err: any) => toast({ title: "Error", description: err.message, variant: "destructive" }),
  });

  const copyToken = (token: string, id: string) => {
    navigator.clipboard.writeText(token);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Invite User</h1>
        <p className="text-sm text-muted-foreground">Invite team members to the platform</p>
      </div>

      <Card className="p-6 border-0 shadow-sm">
        <form onSubmit={(e) => { e.preventDefault(); createInvite.mutate(); }} className="flex gap-3 items-end flex-wrap">
          <div className="space-y-1 flex-1 min-w-[200px]">
            <Label className="text-xs">Email Address</Label>
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="newmember@company.com" required />
          </div>
          <div className="space-y-1 w-40">
            <Label className="text-xs">Role</Label>
            <Select value={role} onValueChange={setRole}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="user">User</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button type="submit" className="bg-accent hover:bg-accent/90 text-accent-foreground" disabled={createInvite.isPending}>
            <UserPlus className="h-4 w-4 mr-1" />{createInvite.isPending ? "..." : "Send Invite"}
          </Button>
        </form>
      </Card>

      <Card className="border-0 shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Token</TableHead>
              <TableHead>Expires</TableHead>
              <TableHead>Created</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invitations?.map((inv) => (
              <TableRow key={inv.id}>
                <TableCell className="font-medium">{inv.email}</TableCell>
                <TableCell><Badge variant="secondary">{inv.role}</Badge></TableCell>
                <TableCell>
                  <Badge variant="secondary" className={statusColors[inv.status] || ""}>
                    {inv.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-xs h-7"
                    onClick={() => copyToken(inv.token, inv.id)}
                  >
                    {copiedId === inv.id ? <Check className="h-3 w-3 mr-1" /> : <Copy className="h-3 w-3 mr-1" />}
                    {copiedId === inv.id ? "Copied" : "Copy"}
                  </Button>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">{format(new Date(inv.expires_at), "MMM d")}</TableCell>
                <TableCell className="text-sm text-muted-foreground">{format(new Date(inv.created_at), "MMM d")}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
