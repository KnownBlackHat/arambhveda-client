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
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus, Search, Phone, TrendingUp, Users, Target, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function TodaysData() {
  const { user, hasRole } = useAuth();
  const isErpAdmin = hasRole("admin") || hasRole("super_admin");
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [addOpen, setAddOpen] = useState(false);
  const [callDialogOpen, setCallDialogOpen] = useState(false);
  const [selectedProspect, setSelectedProspect] = useState<any>(null);

  const [form, setForm] = useState({ name: "", phone: "", email: "", company: "", source: "", notes: "", assigned_to: "" });
  const [callForm, setCallForm] = useState({ duration_min: "0", duration_sec: "0", outcome: "connected", notes: "" });

  const { data: teamMembers } = useQuery({
    queryKey: ["team-members"],
    queryFn: async () => {
      const { data } = await supabase.from("profiles").select("user_id, email, full_name");
      return data || [];
    },
    enabled: isErpAdmin,
  });

  const { data: prospects, isLoading } = useQuery({
    queryKey: ["prospects", search],
    queryFn: async () => {
      let query = supabase.from("prospects").select("*").eq("is_promoted", false).order("created_at", { ascending: false });
      if (search) {
        query = query.or(`name.ilike.%${search}%,company.ilike.%${search}%,phone.ilike.%${search}%`);
      }
      const { data } = await query;
      return data || [];
    },
  });

  const addProspect = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("prospects").insert({
        name: form.name,
        phone: form.phone || null,
        email: form.email || null,
        company: form.company || null,
        source: form.source || null,
        notes: form.notes || null,
        assigned_to: isErpAdmin && form.assigned_to ? form.assigned_to : user?.id,
        created_by: user?.id,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["prospects"] });
      setAddOpen(false);
      setForm({ name: "", phone: "", email: "", company: "", source: "", notes: "", assigned_to: "" });
      toast({ title: "Prospect added" });
    },
    onError: (err: any) => toast({ title: "Error", description: err.message, variant: "destructive" }),
  });

  const logCall = useMutation({
    mutationFn: async () => {
      if (!selectedProspect) return;
      const totalSeconds = (parseInt(callForm.duration_min) || 0) * 60 + (parseInt(callForm.duration_sec) || 0);

      const { error } = await supabase.from("prospect_calls").insert({
        prospect_id: selectedProspect.id,
        user_id: user?.id!,
        duration_seconds: totalSeconds,
        outcome: callForm.outcome as any,
        notes: callForm.notes || null,
      });
      if (error) throw error;

      // Update prospect
      await supabase.from("prospects").update({
        call_count: (selectedProspect.call_count || 0) + 1,
        last_called_at: new Date().toISOString(),
      }).eq("id", selectedProspect.id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["prospects"] });
      setCallDialogOpen(false);
      setCallForm({ duration_min: "0", duration_sec: "0", outcome: "connected", notes: "" });
      toast({ title: "Call logged successfully" });
    },
    onError: (err: any) => toast({ title: "Error", description: err.message, variant: "destructive" }),
  });

  const promoteToLead = useMutation({
    mutationFn: async (prospect: any) => {
      const { data: lead, error: leadErr } = await supabase.from("erp_leads").insert({
        name: prospect.name,
        phone: prospect.phone,
        email: prospect.email,
        company: prospect.company,
        source: prospect.source,
        notes: prospect.notes,
        assigned_to: prospect.assigned_to,
        created_by: user?.id,
        status: "interested",
      }).select("id").single();
      if (leadErr) throw leadErr;

      await supabase.from("prospects").update({
        is_promoted: true,
        promoted_at: new Date().toISOString(),
        promoted_to_lead_id: lead.id,
      }).eq("id", prospect.id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["prospects"] });
      queryClient.invalidateQueries({ queryKey: ["erp-leads"] });
      toast({ title: "Prospect promoted to Lead!" });
    },
    onError: (err: any) => toast({ title: "Error", description: err.message, variant: "destructive" }),
  });

  const totalProspects = prospects?.length || 0;
  const hotProspects = prospects?.filter(p => (p.ai_score || 0) > 70).length || 0;
  const calledToday = prospects?.filter(p => p.last_called_at && new Date(p.last_called_at).toDateString() === new Date().toDateString()).length || 0;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Today's Data</h1>
          <p className="text-sm text-muted-foreground">Prospect management and daily calling list</p>
        </div>
        <Dialog open={addOpen} onOpenChange={setAddOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="bg-accent hover:bg-accent/90 text-accent-foreground">
              <Plus className="h-4 w-4 mr-1" />Add Prospect
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Add Prospect</DialogTitle></DialogHeader>
            <form onSubmit={(e) => { e.preventDefault(); addProspect.mutate(); }} className="space-y-3">
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
                  <Input value={form.source} onChange={(e) => setForm(f => ({ ...f, source: e.target.value }))} />
                </div>
                {isErpAdmin && (
                  <div className="space-y-1">
                    <Label className="text-xs">Assign To</Label>
                    <Select value={form.assigned_to} onValueChange={(v) => setForm(f => ({ ...f, assigned_to: v }))}>
                      <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
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
              <Button type="submit" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground" disabled={addProspect.isPending}>
                {addProspect.isPending ? "Adding..." : "Add Prospect"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4 border-0 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-accent/10 text-accent"><Users className="h-4 w-4" /></div>
            <div>
              <p className="text-xl font-bold">{totalProspects}</p>
              <p className="text-xs text-muted-foreground">Total Prospects</p>
            </div>
          </div>
        </Card>
        <Card className="p-4 border-0 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-orange-100 dark:bg-orange-900/30 text-orange-600"><Target className="h-4 w-4" /></div>
            <div>
              <p className="text-xl font-bold">{totalProspects - calledToday}</p>
              <p className="text-xs text-muted-foreground">To Call Today</p>
            </div>
          </div>
        </Card>
        <Card className="p-4 border-0 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-600"><TrendingUp className="h-4 w-4" /></div>
            <div>
              <p className="text-xl font-bold">{hotProspects}</p>
              <p className="text-xs text-muted-foreground">Hot Prospects</p>
            </div>
          </div>
        </Card>
        <Card className="p-4 border-0 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30 text-green-600"><Phone className="h-4 w-4" /></div>
            <div>
              <p className="text-xl font-bold">{calledToday}</p>
              <p className="text-xs text-muted-foreground">Called Today</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search prospects..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      {/* AI Recommendations */}
      {hotProspects > 0 && (
        <Card className="p-4 border-0 shadow-sm bg-accent/5">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="h-4 w-4 text-accent" />
            <h3 className="font-semibold text-sm">AI Recommendations</h3>
          </div>
          <p className="text-sm text-muted-foreground">
            {hotProspects} prospect(s) have high AI scores and are ready for promotion to leads.
          </p>
        </Card>
      )}

      {/* Table */}
      <Card className="border-0 shadow-sm overflow-hidden">
        <ScrollArea className="h-[500px]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Calls</TableHead>
                <TableHead>AI Score</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow><TableCell colSpan={6} className="text-center py-8 text-muted-foreground">Loading...</TableCell></TableRow>
              ) : prospects?.length === 0 ? (
                <TableRow><TableCell colSpan={6} className="text-center py-8 text-muted-foreground">No prospects yet</TableCell></TableRow>
              ) : (
                prospects?.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell className="font-medium">{p.name}</TableCell>
                    <TableCell>
                      <div className="text-sm">{p.phone || "—"}</div>
                      <div className="text-xs text-muted-foreground">{p.email || ""}</div>
                    </TableCell>
                    <TableCell>{p.company || "—"}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{p.call_count || 0}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className={
                        (p.ai_score || 0) > 70
                          ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                          : (p.ai_score || 0) > 40
                          ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                          : "bg-muted text-muted-foreground"
                      }>
                        {p.ai_score || 0}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-xs h-7"
                          onClick={() => { setSelectedProspect(p); setCallDialogOpen(true); }}
                        >
                          <Phone className="h-3 w-3 mr-1" />Log Call
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-xs h-7 text-accent border-accent/30 hover:bg-accent/10"
                          onClick={() => promoteToLead.mutate(p)}
                          disabled={promoteToLead.isPending}
                        >
                          <TrendingUp className="h-3 w-3 mr-1" />To Lead
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </ScrollArea>
      </Card>

      {/* Log Call Dialog */}
      <Dialog open={callDialogOpen} onOpenChange={setCallDialogOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Log Call - {selectedProspect?.name}</DialogTitle></DialogHeader>
          <form onSubmit={(e) => { e.preventDefault(); logCall.mutate(); }} className="space-y-3">
            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1">
                <Label className="text-xs">Minutes</Label>
                <Input type="number" min="0" value={callForm.duration_min} onChange={(e) => setCallForm(f => ({ ...f, duration_min: e.target.value }))} />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Seconds</Label>
                <Input type="number" min="0" max="59" value={callForm.duration_sec} onChange={(e) => setCallForm(f => ({ ...f, duration_sec: e.target.value }))} />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Outcome</Label>
                <Select value={callForm.outcome} onValueChange={(v) => setCallForm(f => ({ ...f, outcome: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="connected">Connected</SelectItem>
                    <SelectItem value="not_connected">Not Connected</SelectItem>
                    <SelectItem value="busy">Busy</SelectItem>
                    <SelectItem value="no_answer">No Answer</SelectItem>
                    <SelectItem value="wrong_number">Wrong Number</SelectItem>
                    <SelectItem value="callback">Callback</SelectItem>
                    <SelectItem value="interested">Interested</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Notes</Label>
              <Textarea value={callForm.notes} onChange={(e) => setCallForm(f => ({ ...f, notes: e.target.value }))} rows={3} />
            </div>
            <Button type="submit" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground" disabled={logCall.isPending}>
              {logCall.isPending ? "Logging..." : "Log Call"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
