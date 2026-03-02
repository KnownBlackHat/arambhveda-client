import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Search, Download, ChevronLeft, ChevronRight, Flag, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { logLeadStatusChange, softDeleteLead, logActivity } from "@/utils/adminHelpers";
import { useToast } from "@/hooks/use-toast";

const PAGE_SIZE = 20;
const stageColors: Record<string, string> = {
  new: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  contacted: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  interested: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
  converted: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  lost: "bg-muted text-muted-foreground",
};
const stageLabels: Record<string, string> = {
  new: "New", contacted: "Contacted", interested: "Interested", converted: "Converted", lost: "Lost",
};

export default function LeadsPage() {
  const [search, setSearch] = useState("");
  const [stageFilter, setStageFilter] = useState("all");
  const [page, setPage] = useState(0);
  const [selectedLead, setSelectedLead] = useState<any>(null);
  const [noteText, setNoteText] = useState("");
  const qc = useQueryClient();
  const { toast } = useToast();

  const { data, isLoading } = useQuery({
    queryKey: ["website-leads", search, stageFilter, page],
    queryFn: async () => {
      let query = supabase
        .from("leads")
        .select("*", { count: "exact" })
        .is("deleted_at", null)
        .order("created_at", { ascending: false })
        .range(page * PAGE_SIZE, (page + 1) * PAGE_SIZE - 1);
      if (search) query = query.or(`name.ilike.%${search}%,email.ilike.%${search}%,phone.ilike.%${search}%`);
      if (stageFilter !== "all") query = query.eq("lead_stage", stageFilter);
      const { data, count, error } = await query;
      if (error) throw error;
      return { leads: data || [], total: count || 0 };
    },
  });

  const { data: statusHistory } = useQuery({
    queryKey: ["lead-history", selectedLead?.id],
    queryFn: async () => {
      if (!selectedLead) return [];
      const { data } = await supabase
        .from("lead_status_history")
        .select("*")
        .eq("lead_id", selectedLead.id)
        .order("created_at", { ascending: false });
      return data || [];
    },
    enabled: !!selectedLead,
  });

  const updateStage = useMutation({
    mutationFn: async ({ id, oldStage, newStage }: { id: string; oldStage: string; newStage: string }) => {
      const { error } = await supabase.from("leads").update({ lead_stage: newStage, status: newStage }).eq("id", id);
      if (error) throw error;
      await logLeadStatusChange(id, oldStage, newStage);
      await logActivity("status_change", "lead", id, { from: oldStage, to: newStage });
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["website-leads"] }),
  });

  const handleSoftDelete = async (id: string, name: string) => {
    if (!confirm(`Move lead "${name}" to trash?`)) return;
    const { error } = await softDeleteLead(id);
    if (!error) {
      await logActivity("delete", "lead", id, { name });
      toast({ title: "Lead moved to trash" });
      qc.invalidateQueries({ queryKey: ["website-leads"] });
    }
  };

  const handleSaveNotes = async () => {
    if (!selectedLead) return;
    await supabase.from("leads").update({ notes: noteText }).eq("id", selectedLead.id);
    toast({ title: "Notes saved" });
    qc.invalidateQueries({ queryKey: ["website-leads"] });
  };

  const handleToggleReminder = async (id: string, current: boolean) => {
    await supabase.from("leads").update({ reminder_flag: !current }).eq("id", id);
    qc.invalidateQueries({ queryKey: ["website-leads"] });
  };

  const totalPages = Math.ceil((data?.total || 0) / PAGE_SIZE);

  const exportCSV = () => {
    if (!data?.leads.length) return;
    const headers = ["Name", "Email", "Phone", "Course", "City", "Stage", "Source", "Follow-up", "Date"];
    const rows = data.leads.map(l => [
      l.name, l.email || "", l.phone || "", l.course_interest || "", l.city || "",
      l.lead_stage || l.status, l.source_page || "", l.follow_up_date || "",
      format(new Date(l.created_at), "yyyy-MM-dd"),
    ]);
    const csv = [headers, ...rows].map(r => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `leads-${format(new Date(), "yyyy-MM-dd")}.csv`;
    a.click();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Website Leads</h1>
          <p className="text-sm text-muted-foreground">{data?.total || 0} leads from website forms</p>
        </div>
        <Button variant="outline" onClick={exportCSV}>
          <Download className="h-4 w-4 mr-1" /> Export CSV
        </Button>
      </div>

      {/* Funnel Overview */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
        {Object.entries(stageLabels).map(([key, label]) => {
          const count = data?.leads.filter(l => (l.lead_stage || l.status) === key).length || 0;
          return (
            <Card key={key} className={`cursor-pointer hover:border-primary ${stageFilter === key ? "border-primary" : ""}`} onClick={() => { setStageFilter(stageFilter === key ? "all" : key); setPage(0); }}>
              <CardContent className="p-3 text-center">
                <div className={`inline-block px-2 py-0.5 rounded text-xs font-medium mb-1 ${stageColors[key]}`}>{label}</div>
                <p className="text-lg font-bold text-foreground">{count}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 flex-1 min-w-[200px]">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search name, email, phone..." value={search} onChange={e => { setSearch(e.target.value); setPage(0); }} />
            </div>
            <Select value={stageFilter} onValueChange={v => { setStageFilter(v); setPage(0); }}>
              <SelectTrigger className="w-[140px]"><SelectValue placeholder="Stage" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Stages</SelectItem>
                {Object.entries(stageLabels).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Course</TableHead>
                <TableHead>Source</TableHead>
                <TableHead>Stage</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow><TableCell colSpan={7} className="text-center py-8 text-muted-foreground">Loading...</TableCell></TableRow>
              ) : data?.leads.length === 0 ? (
                <TableRow><TableCell colSpan={7} className="text-center py-8 text-muted-foreground">No leads found</TableCell></TableRow>
              ) : (
                data?.leads.map((l) => (
                  <TableRow key={l.id} className="cursor-pointer" onClick={() => { setSelectedLead(l); setNoteText(l.notes || ""); }}>
                    <TableCell className="font-medium">
                      {l.name}
                      {l.reminder_flag && <Flag className="inline h-3 w-3 text-destructive ml-1" />}
                      {l.is_duplicate && <Badge variant="destructive" className="ml-1 text-[10px]">DUP</Badge>}
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">{l.email}</div>
                      <div className="text-xs text-muted-foreground">{l.phone}</div>
                    </TableCell>
                    <TableCell className="text-sm">{l.course_interest || "—"}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">{l.source_page || "—"}</TableCell>
                    <TableCell>
                      <Select value={l.lead_stage || l.status} onValueChange={v => { updateStage.mutate({ id: l.id, oldStage: l.lead_stage || l.status, newStage: v }); }}>
                        <SelectTrigger className="h-7 text-xs w-[120px]" onClick={e => e.stopPropagation()}>
                          <Badge className={`${stageColors[l.lead_stage || l.status]} text-xs border-0`}>{stageLabels[l.lead_stage || l.status] || l.status}</Badge>
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(stageLabels).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">{format(new Date(l.created_at), "dd MMM yyyy")}</TableCell>
                    <TableCell className="text-right" onClick={e => e.stopPropagation()}>
                      <Button variant="ghost" size="icon" onClick={() => handleToggleReminder(l.id, l.reminder_flag || false)}>
                        <Flag className={`h-4 w-4 ${l.reminder_flag ? "text-destructive fill-destructive" : "text-muted-foreground"}`} />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleSoftDelete(l.id, l.name)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-3 border-t border-border">
              <p className="text-sm text-muted-foreground">Page {page + 1} of {totalPages}</p>
              <div className="flex gap-1">
                <Button variant="outline" size="sm" disabled={page === 0} onClick={() => setPage(p => p - 1)}><ChevronLeft className="h-4 w-4" /></Button>
                <Button variant="outline" size="sm" disabled={page >= totalPages - 1} onClick={() => setPage(p => p + 1)}><ChevronRight className="h-4 w-4" /></Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Lead Detail Dialog */}
      <Dialog open={!!selectedLead} onOpenChange={() => setSelectedLead(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>Lead: {selectedLead?.name}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div><span className="text-muted-foreground">Email:</span> {selectedLead?.email}</div>
              <div><span className="text-muted-foreground">Phone:</span> {selectedLead?.phone}</div>
              <div><span className="text-muted-foreground">Course:</span> {selectedLead?.course_interest}</div>
              <div><span className="text-muted-foreground">City:</span> {selectedLead?.city}</div>
              <div><span className="text-muted-foreground">Source:</span> {selectedLead?.source_page}</div>
              <div><span className="text-muted-foreground">Date:</span> {selectedLead && format(new Date(selectedLead.created_at), "dd MMM yyyy")}</div>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Notes</label>
              <Textarea value={noteText} onChange={e => setNoteText(e.target.value)} rows={3} />
              <Button size="sm" onClick={handleSaveNotes}>Save Notes</Button>
            </div>
            {statusHistory && statusHistory.length > 0 && (
              <div>
                <h4 className="text-sm font-medium mb-2">Status History</h4>
                <div className="space-y-1 max-h-40 overflow-y-auto">
                  {statusHistory.map(h => (
                    <div key={h.id} className="text-xs flex items-center gap-2 py-1 border-b border-border">
                      <Badge className={`${stageColors[h.old_status || "new"]} text-[10px] border-0`}>{h.old_status || "—"}</Badge>
                      <span>→</span>
                      <Badge className={`${stageColors[h.new_status]} text-[10px] border-0`}>{h.new_status}</Badge>
                      <span className="text-muted-foreground ml-auto">{format(new Date(h.created_at), "dd MMM HH:mm")}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
