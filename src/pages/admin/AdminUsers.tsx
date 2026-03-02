import { useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { UserPlus, Shield, Trash2 } from "lucide-react";

type AppRole = "super_admin" | "content_manager" | "seo_manager" | "lead_manager" | "editor";

const roleLabels: Record<AppRole, string> = {
  super_admin: "Super Admin",
  content_manager: "Content Manager",
  seo_manager: "SEO Manager",
  lead_manager: "Lead Manager",
  editor: "Editor",
};

const roleColors: Record<AppRole, string> = {
  super_admin: "bg-red-100 text-red-800",
  content_manager: "bg-blue-100 text-blue-800",
  seo_manager: "bg-green-100 text-green-800",
  lead_manager: "bg-yellow-100 text-yellow-800",
  editor: "bg-purple-100 text-purple-800",
};

export default function AdminUsers() {
  const { hasRole } = useAuth();
  const { toast } = useToast();
  const qc = useQueryClient();
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newRole, setNewRole] = useState<AppRole>("editor");
  const [newName, setNewName] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [creating, setCreating] = useState(false);

  const isSuperAdmin = hasRole("super_admin");

  const { data: roles, isLoading } = useQuery({
    queryKey: ["admin-user-roles"],
    queryFn: async () => {
      const { data, error } = await supabase.from("user_roles").select("*");
      if (error) throw error;
      // Fetch profiles for these user_ids
      const userIds = [...new Set(data.map(r => r.user_id))];
      const { data: profiles } = await supabase
        .from("profiles")
        .select("user_id, display_name, email")
        .in("user_id", userIds);
      const profileMap = new Map(profiles?.map(p => [p.user_id, p]) || []);
      return data.map(r => ({
        ...r,
        display_name: profileMap.get(r.user_id)?.display_name || "Unknown",
        email: profileMap.get(r.user_id)?.email || "Unknown",
      }));
    },
    enabled: isSuperAdmin,
  });

  const handleCreateUser = async () => {
    if (!newEmail || !newPassword) {
      toast({ title: "Error", description: "Email and password required", variant: "destructive" });
      return;
    }
    setCreating(true);

    // Sign up the user
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email: newEmail,
      password: newPassword,
      options: {
        emailRedirectTo: window.location.origin,
        data: { display_name: newName || newEmail },
      },
    });

    if (signUpError || !signUpData.user) {
      toast({ title: "Error", description: signUpError?.message || "Failed to create user", variant: "destructive" });
      setCreating(false);
      return;
    }

    // Assign role - note: this needs super_admin RLS
    const { error: roleError } = await supabase.from("user_roles").insert({
      user_id: signUpData.user.id,
      role: newRole,
    });

    setCreating(false);
    if (roleError) {
      toast({ title: "User created but role assignment failed", description: roleError.message, variant: "destructive" });
    } else {
      toast({ title: "User created", description: `${newEmail} added as ${roleLabels[newRole]}` });
      setDialogOpen(false);
      setNewEmail("");
      setNewPassword("");
      setNewName("");
      qc.invalidateQueries({ queryKey: ["admin-user-roles"] });
    }
  };

  const handleDeleteRole = async (roleId: string) => {
    if (!confirm("Remove this role?")) return;
    const { error } = await supabase.from("user_roles").delete().eq("id", roleId);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      qc.invalidateQueries({ queryKey: ["admin-user-roles"] });
    }
  };

  if (!isSuperAdmin) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Only Super Admins can manage users.</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Users & Roles</h1>
            <p className="text-sm text-muted-foreground">Manage admin team members</p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button><UserPlus className="h-4 w-4 mr-1" /> Add User</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Admin User</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-2">
                <div className="space-y-1">
                  <Label>Display Name</Label>
                  <Input value={newName} onChange={e => setNewName(e.target.value)} placeholder="John Doe" />
                </div>
                <div className="space-y-1">
                  <Label>Email *</Label>
                  <Input type="email" value={newEmail} onChange={e => setNewEmail(e.target.value)} placeholder="admin@example.com" />
                </div>
                <div className="space-y-1">
                  <Label>Password *</Label>
                  <Input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder="Min 6 characters" />
                </div>
                <div className="space-y-1">
                  <Label>Role</Label>
                  <Select value={newRole} onValueChange={v => setNewRole(v as AppRole)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {Object.entries(roleLabels).map(([k, v]) => (
                        <SelectItem key={k} value={k}>{v}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={handleCreateUser} disabled={creating} className="w-full">
                  {creating ? "Creating..." : "Create User"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow><TableCell colSpan={4} className="text-center py-8 text-muted-foreground">Loading...</TableCell></TableRow>
                ) : !roles?.length ? (
                  <TableRow><TableCell colSpan={4} className="text-center py-8 text-muted-foreground">No admin users yet</TableCell></TableRow>
                ) : (
                  roles.map((r) => (
                    <TableRow key={r.id}>
                      <TableCell className="font-medium">{r.display_name}</TableCell>
                      <TableCell className="text-muted-foreground">{r.email}</TableCell>
                      <TableCell>
                        <Badge className={`${roleColors[r.role as AppRole]} border-0 text-xs`}>
                          <Shield className="h-3 w-3 mr-1" /> {roleLabels[r.role as AppRole]}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" onClick={() => handleDeleteRole(r.id)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
