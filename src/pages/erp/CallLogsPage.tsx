import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Plus, Search, Edit, Trash2, Upload, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

const statusColors: Record<string, string> = {
  new: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  contacted: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  interested: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  follow_up: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
  converted: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400",
  not_interested: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
};

const statusLabels: Record<string, string> = {
  new: "New",
  contacted: "Contacted",
  interested: "Interested",
  follow_up: "Follow Up",
  converted: "Converted",
  not_interested: "Not Interested",
};

export default function CallLogsPage() {
  const { user, hasRole } = useAuth();
  const isErpAdmin = hasRole("admin") || hasRole("super_admin");
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingLead, setEditingLead] = useState<any>(null);

  // Form state
  const [form, setForm] = useState({
    name: "", phone: "", email: "", company: "", source: "", notes: "",
    status: "new" as string, follow_up_date: "", assigned_to: "",
    log_call: false, call_duration_min: "0", call_duration_sec: "0",
    call_outcome: "answered" as string, call_notes: "",
  });

  const { data: teamMembers } = useQuery({
    queryKey: ["team-members"],
    queryFn: async () => {
      const { data } = await supabase.from("profiles").select("user_id, email, full_name, display_name");
      return data || [];
    },
    enabled: isErpAdmin,
  });

  const { data: leads, isLoading } = useQuery({
    queryKey: ["erp-leads", search, statusFilter],
    queryFn: async () => {
      let query = supabase.from("erp_leads").select("*").order("created_at", { ascending: false });
      if (search) {
        query = query.or(`name.ilike.%${search}%,phone.ilike.%${search}%,email.ilike.%${search}%,company.ilike.%${search}%`);
      }
      if (statusFilter !== "all") {
        query = query.eq("status", statusFilter as any);
      }
      const { data } = await query;
      return data || [];
    },
  });

  const saveLead = useMutation({
    mutationFn: async (data: typeof form) => {
      const leadData: any = {
        name: data.name,
        phone: data.phone || null,
        email: data.email || null,
        company: data.company || null,
        source: data.source || null,
        notes: data.notes || null,
        status: data.status,
        follow_up_date: data.follow_up_date || null,
        assigned_to: isErpAdmin && data.assigned_to ? data.assigned_to : user?.id,
        created_by: user?.id,
        last_activity_at: new Date().toISOString(),
      };

      let leadId: string;

      if (editingLead) {
        const { error } = await supabase.from("erp_leads").update(leadData).eq("id", editingLead.id);
        if (error) throw error;
        leadId = editingLead.id;
      } else {
        const { data: inserted, error } = await supabase.from("erp_leads").insert(leadData).select("id").single();
        if (error) throw error;
        leadId = inserted.id;
      }

      // Log call if checked
      if (data.log_call) {
        await supabase.from("erp_call_logs").insert({
          lead_id: leadId,
          user_id: user?.id!,
          duration_minutes: parseInt(data.call_duration_min) || 0,
          duration_seconds: parseInt(data.call_duration_sec) || 0,
          outcome: data.call_outcome as any,
          notes: data.call_notes || null,
        });

        // Update lead call count and last_call_at
        await supabase.from("erp_leads").update({
          call_count: (editingLead?.call_count || 0) + 1,
          last_call_at: new Date().toISOString(),
        }).eq("id", leadId);
      }

      // Timeline entry
      await supabase.from("lead_timeline").insert({
        lead_id: leadId,
        user_id: user?.id!,
        action_type: editingLead ? "lead_updated" : "lead_created",
        new_value: data.status,
        notes: editingLead ? "Lead updated" : "Lead created",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["erp-leads"] });
      setDialogOpen(false);
      resetForm();
      toast({ title: editingLead ? "Lead updated" : "Lead created" });
    },
    onError: (err: any) => {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    },
  });

  const deleteLead = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("erp_leads").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["erp-leads"] });
      toast({ title: "Lead deleted" });
    },
  });

  const resetForm = () => {
    setForm({
      name: "", phone: "", email: "", company: "", source: "", notes: "",
      status: "new", follow_up_date: "", assigned_to: "",
      log_call: false, call_duration_min: "0", call_duration_sec: "0",
      call_outcome: "answered", call_notes: "",
    });
    setEditingLead(null);
  };

  const openEdit = (lead: any) => {
    setEditingLead(lead);
    setForm({
      name: lead.name, phone: lead.phone || "", email: lead.email || "",
      company: lead.company || "", source: lead.source || "", notes: lead.notes || "",
      status: lead.status, follow_up_date: lead.follow_up_date?.split("T")[0] || "",
      assigned_to: lead.assigned_to || "",
      log_call: false, call_duration_min: "0", call_duration_sec: "0",
      call_outcome: "answered", call_notes: "",
    });
    setDialogOpen(true);
  };

  const getAssignedName = (userId: string | null) => {
    if (!userId) return null;
    const member = teamMembers?.find(m => m.user_id === userId);
    return member?.full_name || member?.display_name || member?.email?.split("@")[0] || null;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Leads Management</h1>
          <p className="text-sm text-muted-foreground">Manage and track your sales leads</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm"><Download className="h-4 w-4 mr-1" />Export</Button>
          <Button variant="outline" size="sm"><Upload className="h-4 w-4 mr-1" />Import CSV</Button>
          <Dialog open={dialogOpen} onOpenChange={(o) => { setDialogOpen(o); if (!o) resetForm(); }}>
            <DialogTrigger asChild>
              <Button size="sm" className="bg-accent hover:bg-accent/90 text-accent-foreground">
                <Plus className="h-4 w-4 mr-1" />Add Lead
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingLead ? "Edit Lead" : "Add New Lead"}</DialogTitle>
              </DialogHeader>
              <form onSubmit={(e) => { e.preventDefault(); saveLead.mutate(form); }} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label className="text-xs">Name *</Label>
                    <Input value={form.name} onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))} required />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Phone</Label>
                    <Input value={form.phone} onChange={(e) => setForm(f => ({ ...f, phone: e.target.value }))} />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Email</Label>
                    <Input type="email" value={form.email} onChange={(e) => setForm(f => ({ ...f, email: e.target.value }))} />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Company</Label>
                    <Input value={form.company} onChange={(e) => setForm(f => ({ ...f, company: e.target.value }))} />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Source</Label>
                    <Input value={form.source} onChange={(e) => setForm(f => ({ ...f, source: e.target.value }))} placeholder="e.g. Website, Referral" />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Status</Label>
                    <Select value={form.status} onValueChange={(v) => setForm(f => ({ ...f, status: v }))}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {Object.entries(statusLabels).map(([k, v]) => (
                          <SelectItem key={k} value={k}>{v}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Follow-up Date</Label>
                    <Input type="date" value={form.follow_up_date} onChange={(e) => setForm(f => ({ ...f, follow_up_date: e.target.value }))} />
                  </div>
                  {isErpAdmin && (
                    <div className="space-y-1">
                      <Label className="text-xs">Assign To</Label>
                      <Select value={form.assigned_to} onValueChange={(v) => setForm(f => ({ ...f, assigned_to: v }))}>
                        <SelectTrigger><SelectValue placeholder="Select member" /></SelectTrigger>
                        <SelectContent>
                          {teamMembers?.map(m => (
                            <SelectItem key={m.user_id} value={m.user_id}>{m.full_name || m.email}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>

                <div className="space-y-1">
                  <Label className="text-xs">Notes</Label>
                  <Textarea value={form.notes} onChange={(e) => setForm(f => ({ ...f, notes: e.target.value }))} rows={2} />
                </div>

                {/* Log a Call */}
                <div className="border rounded-lg p-3 space-y-3">
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="log_call"
                      checked={form.log_call}
                      onCheckedChange={(c) => setForm(f => ({ ...f, log_call: !!c }))}
                    />
                    <Label htmlFor="log_call" className="text-sm font-medium cursor-pointer">Log a Call</Label>
                  </div>
                  {form.log_call && (
                    <div className="space-y-3 pt-1">
                      <div className="grid grid-cols-3 gap-2">
                        <div className="space-y-1">
                          <Label className="text-xs">Minutes</Label>
                          <Input type="number" min="0" value={form.call_duration_min} onChange={(e) => setForm(f => ({ ...f, call_duration_min: e.target.value }))} />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs">Seconds</Label>
                          <Input type="number" min="0" max="59" value={form.call_duration_sec} onChange={(e) => setForm(f => ({ ...f, call_duration_sec: e.target.value }))} />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs">Outcome</Label>
                          <Select value={form.call_outcome} onValueChange={(v) => setForm(f => ({ ...f, call_outcome: v }))}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="answered">Answered</SelectItem>
                              <SelectItem value="no_answer">No Answer</SelectItem>
                              <SelectItem value="busy">Busy</SelectItem>
                              <SelectItem value="voicemail">Voicemail</SelectItem>
                              <SelectItem value="wrong_number">Wrong Number</SelectItem>
                              <SelectItem value="callback_requested">Callback</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">Call Notes</Label>
                        <Textarea value={form.call_notes} onChange={(e) => setForm(f => ({ ...f, call_notes: e.target.value }))} rows={2} />
                      </div>
                    </div>
                  )}
                </div>

                <Button type="submit" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground" disabled={saveLead.isPending}>
                  {saveLead.isPending ? "Saving..." : editingLead ? "Update Lead" : "Create Lead"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search name, phone, email, company..."
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40"><SelectValue placeholder="All Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            {Object.entries(statusLabels).map(([k, v]) => (
              <SelectItem key={k} value={k}>{v}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <Card className="border-0 shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Company</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Assigned To</TableHead>
              <TableHead>Calls</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow><TableCell colSpan={8} className="text-center py-8 text-muted-foreground">Loading...</TableCell></TableRow>
            ) : leads?.length === 0 ? (
              <TableRow><TableCell colSpan={8} className="text-center py-8 text-muted-foreground">No leads found</TableCell></TableRow>
            ) : (
              leads?.map((lead) => (
                <TableRow key={lead.id}>
                  <TableCell className="font-medium">{lead.name}</TableCell>
                  <TableCell>
                    <div className="text-sm">{lead.phone || "—"}</div>
                    <div className="text-xs text-muted-foreground">{lead.email || ""}</div>
                  </TableCell>
                  <TableCell>{lead.company || "—"}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className={statusColors[lead.status] || ""}>
                      {statusLabels[lead.status] || lead.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {lead.assigned_to ? (
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarFallback className="text-[10px] bg-accent/20">
                            {getAssignedName(lead.assigned_to)?.slice(0, 2).toUpperCase() || "?"}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm">{getAssignedName(lead.assigned_to) || "—"}</span>
                      </div>
                    ) : (
                      <Badge variant="outline" className="text-muted-foreground">Unassigned</Badge>
                    )}
                  </TableCell>
                  <TableCell>{lead.call_count || 0}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {format(new Date(lead.created_at), "MMM d")}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(lead)}>
                        <Edit className="h-3.5 w-3.5" />
                      </Button>
                      {isErpAdmin && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:text-destructive"
                          onClick={() => deleteLead.mutate(lead.id)}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
