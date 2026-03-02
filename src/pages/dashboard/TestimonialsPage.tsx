import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Edit, Trash2, Star } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function TestimonialsPage() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState({ name: "", role: "", company: "", content: "", rating: 5, is_featured: false, is_visible: true });

  const { data: testimonials, isLoading } = useQuery({
    queryKey: ["testimonials-admin"],
    queryFn: async () => {
      const { data } = await supabase.from("testimonials").select("*").order("created_at", { ascending: false });
      return data || [];
    },
  });

  const save = useMutation({
    mutationFn: async () => {
      if (editing) {
        const { error } = await supabase.from("testimonials").update(form).eq("id", editing.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("testimonials").insert(form);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["testimonials-admin"] });
      setDialogOpen(false);
      resetForm();
      toast({ title: editing ? "Testimonial updated" : "Testimonial added" });
    },
    onError: (e: any) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("testimonials").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["testimonials-admin"] });
      toast({ title: "Deleted" });
    },
  });

  const resetForm = () => {
    setForm({ name: "", role: "", company: "", content: "", rating: 5, is_featured: false, is_visible: true });
    setEditing(null);
  };

  const openEdit = (t: any) => {
    setEditing(t);
    setForm({ name: t.name, role: t.role || "", company: t.company || "", content: t.content, rating: t.rating || 5, is_featured: t.is_featured || false, is_visible: t.is_visible !== false });
    setDialogOpen(true);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Testimonials</h1>
          <p className="text-sm text-muted-foreground">{testimonials?.length || 0} testimonials</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={(o) => { setDialogOpen(o); if (!o) resetForm(); }}>
          <DialogTrigger asChild>
            <Button size="sm" className="bg-accent hover:bg-accent/90 text-accent-foreground"><Plus className="h-4 w-4 mr-1" />Add</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>{editing ? "Edit" : "Add"} Testimonial</DialogTitle></DialogHeader>
            <form onSubmit={(e) => { e.preventDefault(); save.mutate(); }} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1"><Label className="text-xs">Name *</Label><Input value={form.name} onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))} required /></div>
                <div className="space-y-1"><Label className="text-xs">Role</Label><Input value={form.role} onChange={(e) => setForm(f => ({ ...f, role: e.target.value }))} placeholder="e.g. Student" /></div>
                <div className="space-y-1"><Label className="text-xs">Company/College</Label><Input value={form.company} onChange={(e) => setForm(f => ({ ...f, company: e.target.value }))} /></div>
                <div className="space-y-1"><Label className="text-xs">Rating (1-5)</Label><Input type="number" min={1} max={5} value={form.rating} onChange={(e) => setForm(f => ({ ...f, rating: parseInt(e.target.value) || 5 }))} /></div>
              </div>
              <div className="space-y-1"><Label className="text-xs">Content *</Label><Textarea value={form.content} onChange={(e) => setForm(f => ({ ...f, content: e.target.value }))} rows={3} required /></div>
              <div className="flex gap-6">
                <div className="flex items-center gap-2"><Switch checked={form.is_featured} onCheckedChange={(c) => setForm(f => ({ ...f, is_featured: c }))} /><Label className="text-xs">Featured</Label></div>
                <div className="flex items-center gap-2"><Switch checked={form.is_visible} onCheckedChange={(c) => setForm(f => ({ ...f, is_visible: c }))} /><Label className="text-xs">Visible</Label></div>
              </div>
              <Button type="submit" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground" disabled={save.isPending}>
                {save.isPending ? "Saving..." : editing ? "Update" : "Add"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="border-0 shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Content</TableHead>
              <TableHead>Rating</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow><TableCell colSpan={5} className="text-center py-8 text-muted-foreground">Loading...</TableCell></TableRow>
            ) : testimonials?.length === 0 ? (
              <TableRow><TableCell colSpan={5} className="text-center py-8 text-muted-foreground">No testimonials yet</TableCell></TableRow>
            ) : (
              testimonials?.map((t: any) => (
                <TableRow key={t.id}>
                  <TableCell>
                    <div className="font-medium">{t.name}</div>
                    <div className="text-xs text-muted-foreground">{t.role}{t.company ? ` • ${t.company}` : ""}</div>
                  </TableCell>
                  <TableCell className="max-w-[300px] truncate text-sm">{t.content}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: t.rating || 0 }).map((_, i) => <Star key={i} className="h-3 w-3 fill-accent text-accent" />)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      {t.is_featured && <Badge className="bg-accent/20 text-accent text-xs">Featured</Badge>}
                      <Badge variant={t.is_visible ? "secondary" : "outline"} className="text-xs">{t.is_visible ? "Visible" : "Hidden"}</Badge>
                    </div>
                  </TableCell>
                  <TableCell className="text-right space-x-1">
                    <Button variant="ghost" size="icon" onClick={() => openEdit(t)}><Edit className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" onClick={() => { if (confirm("Delete?")) remove.mutate(t.id); }}><Trash2 className="h-4 w-4 text-destructive" /></Button>
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
