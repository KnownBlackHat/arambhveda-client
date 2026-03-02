import { useState } from "react";
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
import { Plus, Edit, Trash2, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function CoursesPage() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState({ name: "", slug: "", description: "", duration: "", degree_type: "", stream: "", avg_fees: "", eligibility: "", is_popular: false, status: "published" });

  const { data: courses, isLoading } = useQuery({
    queryKey: ["courses-admin", search],
    queryFn: async () => {
      let q = supabase.from("courses").select("*").order("name");
      if (search) q = q.ilike("name", `%${search}%`);
      const { data } = await q;
      return data || [];
    },
  });

  const save = useMutation({
    mutationFn: async () => {
      const payload = {
        ...form,
        slug: form.slug || form.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        avg_fees: form.avg_fees ? parseFloat(form.avg_fees) : null,
      };
      if (editing) {
        const { error } = await supabase.from("courses").update(payload).eq("id", editing.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("courses").insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courses-admin"] });
      setDialogOpen(false);
      resetForm();
      toast({ title: editing ? "Course updated" : "Course created" });
    },
    onError: (e: any) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("courses").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courses-admin"] });
      toast({ title: "Deleted" });
    },
  });

  const resetForm = () => {
    setForm({ name: "", slug: "", description: "", duration: "", degree_type: "", stream: "", avg_fees: "", eligibility: "", is_popular: false, status: "published" });
    setEditing(null);
  };

  const openEdit = (c: any) => {
    setEditing(c);
    setForm({ name: c.name, slug: c.slug || "", description: c.description || "", duration: c.duration || "", degree_type: c.degree_type || "", stream: c.stream || "", avg_fees: c.avg_fees?.toString() || "", eligibility: c.eligibility || "", is_popular: c.is_popular || false, status: c.status || "published" });
    setDialogOpen(true);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Course Management</h1>
          <p className="text-sm text-muted-foreground">{courses?.length || 0} courses</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={(o) => { setDialogOpen(o); if (!o) resetForm(); }}>
          <DialogTrigger asChild>
            <Button size="sm" className="bg-accent hover:bg-accent/90 text-accent-foreground"><Plus className="h-4 w-4 mr-1" />Add Course</Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader><DialogTitle>{editing ? "Edit" : "Add"} Course</DialogTitle></DialogHeader>
            <form onSubmit={(e) => { e.preventDefault(); save.mutate(); }} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1 col-span-2"><Label className="text-xs">Name *</Label><Input value={form.name} onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))} required /></div>
                <div className="space-y-1"><Label className="text-xs">Slug</Label><Input value={form.slug} onChange={(e) => setForm(f => ({ ...f, slug: e.target.value }))} placeholder="auto" /></div>
                <div className="space-y-1"><Label className="text-xs">Duration</Label><Input value={form.duration} onChange={(e) => setForm(f => ({ ...f, duration: e.target.value }))} placeholder="e.g. 4 Years" /></div>
                <div className="space-y-1">
                  <Label className="text-xs">Degree Type</Label>
                  <Select value={form.degree_type} onValueChange={(v) => setForm(f => ({ ...f, degree_type: v }))}>
                    <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="UG">Undergraduate</SelectItem>
                      <SelectItem value="PG">Postgraduate</SelectItem>
                      <SelectItem value="Diploma">Diploma</SelectItem>
                      <SelectItem value="PhD">PhD</SelectItem>
                      <SelectItem value="Certificate">Certificate</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1"><Label className="text-xs">Stream</Label><Input value={form.stream} onChange={(e) => setForm(f => ({ ...f, stream: e.target.value }))} placeholder="e.g. Engineering" /></div>
                <div className="space-y-1"><Label className="text-xs">Avg Fees (₹)</Label><Input type="number" value={form.avg_fees} onChange={(e) => setForm(f => ({ ...f, avg_fees: e.target.value }))} /></div>
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
        <Input placeholder="Search courses..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      <Card className="border-0 shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Degree</TableHead>
              <TableHead>Stream</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Avg Fees</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow><TableCell colSpan={6} className="text-center py-8 text-muted-foreground">Loading...</TableCell></TableRow>
            ) : courses?.length === 0 ? (
              <TableRow><TableCell colSpan={6} className="text-center py-8 text-muted-foreground">No courses yet</TableCell></TableRow>
            ) : (
              courses?.map((c: any) => (
                <TableRow key={c.id}>
                  <TableCell className="font-medium">{c.name}{c.is_popular && <Badge className="ml-2 bg-accent/20 text-accent text-xs">Popular</Badge>}</TableCell>
                  <TableCell><Badge variant="outline">{c.degree_type || "—"}</Badge></TableCell>
                  <TableCell className="text-sm">{c.stream || "—"}</TableCell>
                  <TableCell className="text-sm">{c.duration || "—"}</TableCell>
                  <TableCell className="text-sm">{c.avg_fees ? `₹${Number(c.avg_fees).toLocaleString()}` : "—"}</TableCell>
                  <TableCell className="text-right space-x-1">
                    <Button variant="ghost" size="icon" onClick={() => openEdit(c)}><Edit className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" onClick={() => { if (confirm("Delete?")) remove.mutate(c.id); }}><Trash2 className="h-4 w-4 text-destructive" /></Button>
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
