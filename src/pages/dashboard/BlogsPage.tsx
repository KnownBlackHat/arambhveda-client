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
import { format } from "date-fns";
import { useAuth } from "@/hooks/useAuth";

export default function BlogsPage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState({ title: "", slug: "", content: "", excerpt: "", category: "general", status: "draft", cover_image: "", meta_title: "", meta_description: "" });

  const { data: blogs, isLoading } = useQuery({
    queryKey: ["blogs", search],
    queryFn: async () => {
      let q = supabase.from("blogs").select("*").order("created_at", { ascending: false });
      if (search) q = q.ilike("title", `%${search}%`);
      const { data } = await q;
      return data || [];
    },
  });

  const saveBlog = useMutation({
    mutationFn: async () => {
      const payload = {
        ...form,
        slug: form.slug || form.title.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        author_id: user?.id,
        published_at: form.status === "published" ? new Date().toISOString() : null,
      };
      if (editing) {
        const { error } = await supabase.from("blogs").update(payload).eq("id", editing.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("blogs").insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blogs"] });
      setDialogOpen(false);
      resetForm();
      toast({ title: editing ? "Blog updated" : "Blog created" });
    },
    onError: (e: any) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  const deleteBlog = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("blogs").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blogs"] });
      toast({ title: "Blog deleted" });
    },
  });

  const resetForm = () => {
    setForm({ title: "", slug: "", content: "", excerpt: "", category: "general", status: "draft", cover_image: "", meta_title: "", meta_description: "" });
    setEditing(null);
  };

  const openEdit = (blog: any) => {
    setEditing(blog);
    setForm({
      title: blog.title, slug: blog.slug || "", content: blog.content || "", excerpt: blog.excerpt || "",
      category: blog.category || "general", status: blog.status || "draft", cover_image: blog.cover_image || "",
      meta_title: blog.meta_title || "", meta_description: blog.meta_description || "",
    });
    setDialogOpen(true);
  };

  const statusColor: Record<string, string> = {
    draft: "bg-yellow-100 text-yellow-800",
    published: "bg-green-100 text-green-800",
    archived: "bg-gray-100 text-gray-800",
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Blog Management</h1>
          <p className="text-sm text-muted-foreground">{blogs?.length || 0} articles</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={(o) => { setDialogOpen(o); if (!o) resetForm(); }}>
          <DialogTrigger asChild>
            <Button size="sm" className="bg-accent hover:bg-accent/90 text-accent-foreground">
              <Plus className="h-4 w-4 mr-1" />New Post
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader><DialogTitle>{editing ? "Edit Post" : "New Blog Post"}</DialogTitle></DialogHeader>
            <form onSubmit={(e) => { e.preventDefault(); saveBlog.mutate(); }} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1 col-span-2">
                  <Label className="text-xs">Title *</Label>
                  <Input value={form.title} onChange={(e) => setForm(f => ({ ...f, title: e.target.value }))} required />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Slug</Label>
                  <Input value={form.slug} onChange={(e) => setForm(f => ({ ...f, slug: e.target.value }))} placeholder="auto-generated" />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Category</Label>
                  <Select value={form.category} onValueChange={(v) => setForm(f => ({ ...f, category: v }))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="general">General</SelectItem>
                      <SelectItem value="education">Education</SelectItem>
                      <SelectItem value="careers">Careers</SelectItem>
                      <SelectItem value="admissions">Admissions</SelectItem>
                      <SelectItem value="exams">Exams</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Status</Label>
                  <Select value={form.status} onValueChange={(v) => setForm(f => ({ ...f, status: v }))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="published">Published</SelectItem>
                      <SelectItem value="archived">Archived</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Cover Image URL</Label>
                  <Input value={form.cover_image} onChange={(e) => setForm(f => ({ ...f, cover_image: e.target.value }))} />
                </div>
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Excerpt</Label>
                <Textarea value={form.excerpt} onChange={(e) => setForm(f => ({ ...f, excerpt: e.target.value }))} rows={2} />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Content</Label>
                <Textarea value={form.content} onChange={(e) => setForm(f => ({ ...f, content: e.target.value }))} rows={8} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs">Meta Title</Label>
                  <Input value={form.meta_title} onChange={(e) => setForm(f => ({ ...f, meta_title: e.target.value }))} />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Meta Description</Label>
                  <Input value={form.meta_description} onChange={(e) => setForm(f => ({ ...f, meta_description: e.target.value }))} />
                </div>
              </div>
              <Button type="submit" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground" disabled={saveBlog.isPending}>
                {saveBlog.isPending ? "Saving..." : editing ? "Update Post" : "Create Post"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search blogs..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      <Card className="border-0 shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow><TableCell colSpan={5} className="text-center py-8 text-muted-foreground">Loading...</TableCell></TableRow>
            ) : blogs?.length === 0 ? (
              <TableRow><TableCell colSpan={5} className="text-center py-8 text-muted-foreground">No blog posts yet</TableCell></TableRow>
            ) : (
              blogs?.map((b: any) => (
                <TableRow key={b.id}>
                  <TableCell className="font-medium max-w-[250px] truncate">{b.title}</TableCell>
                  <TableCell><Badge variant="outline">{b.category}</Badge></TableCell>
                  <TableCell><Badge variant="secondary" className={statusColor[b.status] || ""}>{b.status}</Badge></TableCell>
                  <TableCell className="text-sm text-muted-foreground">{format(new Date(b.created_at), "MMM d, yyyy")}</TableCell>
                  <TableCell className="text-right space-x-1">
                    <Button variant="ghost" size="icon" onClick={() => openEdit(b)}><Edit className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" onClick={() => { if (confirm("Delete this post?")) deleteBlog.mutate(b.id); }}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
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
