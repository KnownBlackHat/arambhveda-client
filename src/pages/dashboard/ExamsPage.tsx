import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Edit, Trash2, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function ExamsPage() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState({
    name: "", slug: "", full_name: "", description: "", exam_date: "", conducting_body: "",
    mode: "", frequency: "", eligibility: "", official_website: "", is_popular: false,
  });

  const { data: exams, isLoading } = useQuery({
    queryKey: ["exams-admin", search],
    queryFn: async () => {
      let q = supabase.from("exams").select("*").order("name");
      if (search) q = q.ilike("name", `%${search}%`);
      const { data } = await q;
      return data || [];
    },
  });

  const save = useMutation({
    mutationFn: async () => {
      const payload = { ...form, slug: form.slug || form.name.toLowerCase().replace(/[^a-z0-9]+/g, "-") };
      if (editing) {
        const { error } = await supabase.from("exams").update(payload).eq("id", editing.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("exams").insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["exams-admin"] });
      setDialogOpen(false);
      resetForm();
      toast({ title: editing ? "Exam updated" : "Exam created" });
    },
    onError: (e: any) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("exams").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["exams-admin"] });
      toast({ title: "Deleted" });
    },
  });

  const resetForm = () => {
    setForm({ name: "", slug: "", full_name: "", description: "", exam_date: "", conducting_body: "", mode: "", frequency: "", eligibility: "", official_website: "", is_popular: false });
    setEditing(null);
  };

  const openEdit = (e: any) => {
    setEditing(e);
    setForm({
      name: e.name, slug: e.slug || "", full_name: e.full_name || "", description: e.description || "",
      exam_date: e.exam_date || "", conducting_body: e.conducting_body || "", mode: e.mode || "",
      frequency: e.frequency || "", eligibility: e.eligibility || "", official_website: e.official_website || "",
      is_popular: e.is_popular || false,
    });
    setDialogOpen(true);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Exam Management</h1>
          <p className="text-sm text-muted-foreground">{exams?.length || 0} exams</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={(o) => { setDialogOpen(o); if (!o) resetForm(); }}>
          <DialogTrigger asChild>
            <Button size="sm" className="bg-accent hover:bg-accent/90 text-accent-foreground"><Plus className="h-4 w-4 mr-1" />Add Exam</Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader><DialogTitle>{editing ? "Edit" : "Add"} Exam</DialogTitle></DialogHeader>
            <form onSubmit={(e) => { e.preventDefault(); save.mutate(); }} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1"><Label className="text-xs">Short Name *</Label><Input value={form.name} onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))} required placeholder="e.g. JEE Main" /></div>
                <div className="space-y-1"><Label className="text-xs">Slug</Label><Input value={form.slug} onChange={(e) => setForm(f => ({ ...f, slug: e.target.value }))} placeholder="auto" /></div>
                <div className="space-y-1 col-span-2"><Label className="text-xs">Full Name</Label><Input value={form.full_name} onChange={(e) => setForm(f => ({ ...f, full_name: e.target.value }))} placeholder="e.g. Joint Entrance Examination Main" /></div>
                <div className="space-y-1"><Label className="text-xs">Conducting Body</Label><Input value={form.conducting_body} onChange={(e) => setForm(f => ({ ...f, conducting_body: e.target.value }))} /></div>
                <div className="space-y-1"><Label className="text-xs">Exam Date</Label><Input value={form.exam_date} onChange={(e) => setForm(f => ({ ...f, exam_date: e.target.value }))} placeholder="e.g. April 2026" /></div>
                <div className="space-y-1"><Label className="text-xs">Mode</Label><Input value={form.mode} onChange={(e) => setForm(f => ({ ...f, mode: e.target.value }))} placeholder="Online/Offline" /></div>
                <div className="space-y-1"><Label className="text-xs">Frequency</Label><Input value={form.frequency} onChange={(e) => setForm(f => ({ ...f, frequency: e.target.value }))} placeholder="e.g. Twice a year" /></div>
                <div className="space-y-1 col-span-2"><Label className="text-xs">Official Website</Label><Input value={form.official_website} onChange={(e) => setForm(f => ({ ...f, official_website: e.target.value }))} /></div>
              </div>
              <div className="space-y-1"><Label className="text-xs">Eligibility</Label><Textarea value={form.eligibility} onChange={(e) => setForm(f => ({ ...f, eligibility: e.target.value }))} rows={2} /></div>
              <div className="space-y-1"><Label className="text-xs">Description</Label><Textarea value={form.description} onChange={(e) => setForm(f => ({ ...f, description: e.target.value }))} rows={3} /></div>
              <Button type="submit" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground" disabled={save.isPending}>
                {save.isPending ? "Saving..." : editing ? "Update" : "Create"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search exams..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      <Card className="border-0 shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Conducting Body</TableHead>
              <TableHead>Mode</TableHead>
              <TableHead>Exam Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow><TableCell colSpan={5} className="text-center py-8 text-muted-foreground">Loading...</TableCell></TableRow>
            ) : exams?.length === 0 ? (
              <TableRow><TableCell colSpan={5} className="text-center py-8 text-muted-foreground">No exams yet</TableCell></TableRow>
            ) : (
              exams?.map((e: any) => (
                <TableRow key={e.id}>
                  <TableCell>
                    <div className="font-medium">{e.name}</div>
                    {e.full_name && <div className="text-xs text-muted-foreground">{e.full_name}</div>}
                  </TableCell>
                  <TableCell className="text-sm">{e.conducting_body || "—"}</TableCell>
                  <TableCell><Badge variant="outline">{e.mode || "—"}</Badge></TableCell>
                  <TableCell className="text-sm">{e.exam_date || "—"}</TableCell>
                  <TableCell className="text-right space-x-1">
                    <Button variant="ghost" size="icon" onClick={() => openEdit(e)}><Edit className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" onClick={() => { if (confirm("Delete?")) remove.mutate(e.id); }}><Trash2 className="h-4 w-4 text-destructive" /></Button>
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
