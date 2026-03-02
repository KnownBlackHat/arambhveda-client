import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

export default function SEOPage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState({ page_path: "", meta_title: "", meta_description: "", og_title: "", og_description: "", og_image: "", canonical_url: "", noindex: false });

  const { data: seoSettings, isLoading } = useQuery({
    queryKey: ["seo-settings"],
    queryFn: async () => {
      const { data } = await supabase.from("seo_settings").select("*").order("page_path");
      return data || [];
    },
  });

  const save = useMutation({
    mutationFn: async () => {
      const payload = { ...form, updated_by: user?.id };
      if (editing) {
        const { error } = await supabase.from("seo_settings").update(payload).eq("id", editing.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("seo_settings").insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["seo-settings"] });
      setDialogOpen(false);
      resetForm();
      toast({ title: editing ? "Updated" : "Created" });
    },
    onError: (e: any) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("seo_settings").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["seo-settings"] });
      toast({ title: "Deleted" });
    },
  });

  const resetForm = () => {
    setForm({ page_path: "", meta_title: "", meta_description: "", og_title: "", og_description: "", og_image: "", canonical_url: "", noindex: false });
    setEditing(null);
  };

  const openEdit = (s: any) => {
    setEditing(s);
    setForm({ page_path: s.page_path, meta_title: s.meta_title || "", meta_description: s.meta_description || "", og_title: s.og_title || "", og_description: s.og_description || "", og_image: s.og_image || "", canonical_url: s.canonical_url || "", noindex: s.noindex || false });
    setDialogOpen(true);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">SEO Settings</h1>
          <p className="text-sm text-muted-foreground">Manage meta tags and SEO for each page</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={(o) => { setDialogOpen(o); if (!o) resetForm(); }}>
          <DialogTrigger asChild>
            <Button size="sm" className="bg-accent hover:bg-accent/90 text-accent-foreground"><Plus className="h-4 w-4 mr-1" />Add Page</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>{editing ? "Edit" : "Add"} SEO Settings</DialogTitle></DialogHeader>
            <form onSubmit={(e) => { e.preventDefault(); save.mutate(); }} className="space-y-3">
              <div className="space-y-1"><Label className="text-xs">Page Path *</Label><Input value={form.page_path} onChange={(e) => setForm(f => ({ ...f, page_path: e.target.value }))} required placeholder="e.g. /colleges" /></div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1"><Label className="text-xs">Meta Title</Label><Input value={form.meta_title} onChange={(e) => setForm(f => ({ ...f, meta_title: e.target.value }))} /></div>
                <div className="space-y-1"><Label className="text-xs">Meta Description</Label><Input value={form.meta_description} onChange={(e) => setForm(f => ({ ...f, meta_description: e.target.value }))} /></div>
                <div className="space-y-1"><Label className="text-xs">OG Title</Label><Input value={form.og_title} onChange={(e) => setForm(f => ({ ...f, og_title: e.target.value }))} /></div>
                <div className="space-y-1"><Label className="text-xs">OG Description</Label><Input value={form.og_description} onChange={(e) => setForm(f => ({ ...f, og_description: e.target.value }))} /></div>
                <div className="space-y-1"><Label className="text-xs">OG Image</Label><Input value={form.og_image} onChange={(e) => setForm(f => ({ ...f, og_image: e.target.value }))} /></div>
                <div className="space-y-1"><Label className="text-xs">Canonical URL</Label><Input value={form.canonical_url} onChange={(e) => setForm(f => ({ ...f, canonical_url: e.target.value }))} /></div>
              </div>
              <div className="flex items-center gap-2"><Switch checked={form.noindex} onCheckedChange={(c) => setForm(f => ({ ...f, noindex: c }))} /><Label className="text-xs">No Index</Label></div>
              <Button type="submit" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground" disabled={save.isPending}>
                {save.isPending ? "Saving..." : editing ? "Update" : "Create"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="border-0 shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Page Path</TableHead>
              <TableHead>Meta Title</TableHead>
              <TableHead>Index</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow><TableCell colSpan={4} className="text-center py-8 text-muted-foreground">Loading...</TableCell></TableRow>
            ) : seoSettings?.length === 0 ? (
              <TableRow><TableCell colSpan={4} className="text-center py-8 text-muted-foreground">No SEO settings configured</TableCell></TableRow>
            ) : (
              seoSettings?.map((s: any) => (
                <TableRow key={s.id}>
                  <TableCell className="font-medium font-mono text-sm">{s.page_path}</TableCell>
                  <TableCell className="text-sm max-w-[250px] truncate">{s.meta_title || "—"}</TableCell>
                  <TableCell><Badge variant={s.noindex ? "destructive" : "secondary"} className="text-xs">{s.noindex ? "No Index" : "Indexed"}</Badge></TableCell>
                  <TableCell className="text-right space-x-1">
                    <Button variant="ghost" size="icon" onClick={() => openEdit(s)}><Edit className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" onClick={() => { if (confirm("Delete?")) remove.mutate(s.id); }}><Trash2 className="h-4 w-4 text-destructive" /></Button>
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
