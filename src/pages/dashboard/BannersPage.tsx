import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Edit, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function BannersPage() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState({ title: "", subtitle: "", image_url: "", link_url: "", position: "homepage", is_active: true, sort_order: 0 });

  const { data: banners, isLoading } = useQuery({
    queryKey: ["banners-admin"],
    queryFn: async () => {
      const { data } = await supabase.from("banners").select("*").order("sort_order");
      return data || [];
    },
  });

  const save = useMutation({
    mutationFn: async () => {
      if (editing) {
        const { error } = await supabase.from("banners").update(form).eq("id", editing.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("banners").insert(form);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["banners-admin"] });
      setDialogOpen(false);
      resetForm();
      toast({ title: editing ? "Banner updated" : "Banner created" });
    },
    onError: (e: any) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("banners").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["banners-admin"] });
      toast({ title: "Deleted" });
    },
  });

  const resetForm = () => {
    setForm({ title: "", subtitle: "", image_url: "", link_url: "", position: "homepage", is_active: true, sort_order: 0 });
    setEditing(null);
  };

  const openEdit = (b: any) => {
    setEditing(b);
    setForm({ title: b.title, subtitle: b.subtitle || "", image_url: b.image_url || "", link_url: b.link_url || "", position: b.position || "homepage", is_active: b.is_active !== false, sort_order: b.sort_order || 0 });
    setDialogOpen(true);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Banner Management</h1>
          <p className="text-sm text-muted-foreground">{banners?.length || 0} banners</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={(o) => { setDialogOpen(o); if (!o) resetForm(); }}>
          <DialogTrigger asChild>
            <Button size="sm" className="bg-accent hover:bg-accent/90 text-accent-foreground"><Plus className="h-4 w-4 mr-1" />Add Banner</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>{editing ? "Edit" : "Add"} Banner</DialogTitle></DialogHeader>
            <form onSubmit={(e) => { e.preventDefault(); save.mutate(); }} className="space-y-3">
              <div className="space-y-1"><Label className="text-xs">Title *</Label><Input value={form.title} onChange={(e) => setForm(f => ({ ...f, title: e.target.value }))} required /></div>
              <div className="space-y-1"><Label className="text-xs">Subtitle</Label><Input value={form.subtitle} onChange={(e) => setForm(f => ({ ...f, subtitle: e.target.value }))} /></div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1"><Label className="text-xs">Image URL</Label><Input value={form.image_url} onChange={(e) => setForm(f => ({ ...f, image_url: e.target.value }))} /></div>
                <div className="space-y-1"><Label className="text-xs">Link URL</Label><Input value={form.link_url} onChange={(e) => setForm(f => ({ ...f, link_url: e.target.value }))} /></div>
                <div className="space-y-1">
                  <Label className="text-xs">Position</Label>
                  <Select value={form.position} onValueChange={(v) => setForm(f => ({ ...f, position: v }))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="homepage">Homepage</SelectItem>
                      <SelectItem value="sidebar">Sidebar</SelectItem>
                      <SelectItem value="popup">Popup</SelectItem>
                      <SelectItem value="header">Header</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1"><Label className="text-xs">Sort Order</Label><Input type="number" value={form.sort_order} onChange={(e) => setForm(f => ({ ...f, sort_order: parseInt(e.target.value) || 0 }))} /></div>
              </div>
              <div className="flex items-center gap-2"><Switch checked={form.is_active} onCheckedChange={(c) => setForm(f => ({ ...f, is_active: c }))} /><Label className="text-xs">Active</Label></div>
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
              <TableHead>Title</TableHead>
              <TableHead>Position</TableHead>
              <TableHead>Order</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow><TableCell colSpan={5} className="text-center py-8 text-muted-foreground">Loading...</TableCell></TableRow>
            ) : banners?.length === 0 ? (
              <TableRow><TableCell colSpan={5} className="text-center py-8 text-muted-foreground">No banners yet</TableCell></TableRow>
            ) : (
              banners?.map((b: any) => (
                <TableRow key={b.id}>
                  <TableCell>
                    <div className="font-medium">{b.title}</div>
                    {b.subtitle && <div className="text-xs text-muted-foreground">{b.subtitle}</div>}
                  </TableCell>
                  <TableCell><Badge variant="outline">{b.position}</Badge></TableCell>
                  <TableCell>{b.sort_order}</TableCell>
                  <TableCell><Badge variant={b.is_active ? "secondary" : "outline"} className={b.is_active ? "bg-green-100 text-green-800" : ""}>{b.is_active ? "Active" : "Inactive"}</Badge></TableCell>
                  <TableCell className="text-right space-x-1">
                    <Button variant="ghost" size="icon" onClick={() => openEdit(b)}><Edit className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" onClick={() => { if (confirm("Delete?")) remove.mutate(b.id); }}><Trash2 className="h-4 w-4 text-destructive" /></Button>
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
