import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Upload, Trash2, Image as ImageIcon, FileText, Copy } from "lucide-react";
import { logActivity } from "@/utils/adminHelpers";
import { format } from "date-fns";

export default function AdminMediaLibrary() {
  const [folder, setFolder] = useState("general");
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const qc = useQueryClient();

  const { data: media, isLoading } = useQuery({
    queryKey: ["media-library", folder],
    queryFn: async () => {
      let query = supabase.from("media_library").select("*").order("created_at", { ascending: false });
      if (folder !== "all") query = query.eq("folder", folder);
      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    },
  });

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length) return;
    setUploading(true);

    for (const file of Array.from(files)) {
      const ext = file.name.split(".").pop();
      const path = `${folder}/${Date.now()}-${file.name}`;

      const { error: uploadError } = await supabase.storage.from("media").upload(path, file);
      if (uploadError) {
        toast({ title: "Upload failed", description: uploadError.message, variant: "destructive" });
        continue;
      }

      const { data: urlData } = supabase.storage.from("media").getPublicUrl(path);

      await supabase.from("media_library").insert({
        file_name: file.name,
        file_path: path,
        file_url: urlData.publicUrl,
        file_type: file.type,
        file_size: file.size,
        folder,
      });

      await logActivity("create", "media", path, { file_name: file.name });
    }

    setUploading(false);
    toast({ title: "Upload complete" });
    qc.invalidateQueries({ queryKey: ["media-library"] });
    if (fileRef.current) fileRef.current.value = "";
  };

  const handleDelete = async (item: any) => {
    if (!confirm(`Delete "${item.file_name}"?`)) return;
    await supabase.storage.from("media").remove([item.file_path]);
    await supabase.from("media_library").delete().eq("id", item.id);
    await logActivity("delete", "media", item.id, { file_name: item.file_name });
    toast({ title: "File deleted" });
    qc.invalidateQueries({ queryKey: ["media-library"] });
  };

  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    toast({ title: "URL copied to clipboard" });
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1048576).toFixed(1)} MB`;
  };

  const folders = ["general", "colleges", "banners", "blogs", "testimonials"];

  return (
    <>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Media Library</h1>
            <p className="text-sm text-muted-foreground">{media?.length || 0} files</p>
          </div>
          <div>
            <input type="file" ref={fileRef} multiple accept="image/*,.pdf,.doc,.docx" onChange={handleUpload} className="hidden" />
            <Button onClick={() => fileRef.current?.click()} disabled={uploading}>
              <Upload className="h-4 w-4 mr-1" /> {uploading ? "Uploading..." : "Upload Files"}
            </Button>
          </div>
        </div>

        <div className="flex gap-2">
          <Button variant={folder === "all" ? "default" : "outline"} size="sm" onClick={() => setFolder("all")}>All</Button>
          {folders.map(f => (
            <Button key={f} variant={folder === f ? "default" : "outline"} size="sm" onClick={() => setFolder(f)} className="capitalize">{f}</Button>
          ))}
        </div>

        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Preview</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Size</TableHead>
                  <TableHead>Folder</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow><TableCell colSpan={7} className="text-center py-8 text-muted-foreground">Loading...</TableCell></TableRow>
                ) : !media?.length ? (
                  <TableRow><TableCell colSpan={7} className="text-center py-8 text-muted-foreground">No files uploaded</TableCell></TableRow>
                ) : (
                  media.map(m => (
                    <TableRow key={m.id}>
                      <TableCell>
                        {m.file_type?.startsWith("image/") ? (
                          <img src={m.file_url} alt={m.alt_text || m.file_name} className="w-12 h-12 object-cover rounded" />
                        ) : (
                          <div className="w-12 h-12 bg-muted rounded flex items-center justify-center">
                            <FileText className="h-5 w-5 text-muted-foreground" />
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="font-medium text-sm max-w-[200px] truncate">{m.file_name}</TableCell>
                      <TableCell><Badge variant="secondary" className="text-xs">{m.file_type?.split("/")[1] || "file"}</Badge></TableCell>
                      <TableCell className="text-sm text-muted-foreground">{m.file_size ? formatSize(m.file_size) : "—"}</TableCell>
                      <TableCell className="text-sm capitalize">{m.folder}</TableCell>
                      <TableCell className="text-xs text-muted-foreground">{format(new Date(m.created_at), "dd MMM yyyy")}</TableCell>
                      <TableCell className="text-right space-x-1">
                        <Button variant="ghost" size="icon" onClick={() => copyUrl(m.file_url)}>
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(m)}>
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
    </>
  );
}
