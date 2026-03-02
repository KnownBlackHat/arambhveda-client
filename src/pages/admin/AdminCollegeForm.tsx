import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
// Unified dashboard - no AdminLayout wrapper needed
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Save, History, RotateCcw } from "lucide-react";
import { logActivity, saveCollegeVersion, saveSlugRedirect } from "@/utils/adminHelpers";
import { format } from "date-fns";

interface CollegeFormData {
  name: string; slug: string; city: string; state: string; address: string; pincode: string;
  category: string; type: string; established: number | null; affiliation: string; accreditation: string;
  description: string; courses: string; avg_fees: number | null; avg_package: number | null;
  highest_package: number | null; rating: number | null; campus_area: number | null;
  top_recruiters: string; infrastructure: string; approvals: string; admission_exams: string;
  admission_process: string; image_url: string; meta_title: string; meta_description: string;
  is_featured: boolean; prospectus_url: string; publish_status: string; featured_priority: number;
  homepage_visible: boolean; noindex: boolean; sitemap_priority: number;
  canonical_url: string; og_title: string; og_description: string; og_image: string;
  twitter_title: string; twitter_description: string; twitter_image: string;
}

const defaultForm: CollegeFormData = {
  name: "", slug: "", city: "", state: "", address: "", pincode: "", category: "", type: "",
  established: null, affiliation: "", accreditation: "", description: "", courses: "",
  avg_fees: null, avg_package: null, highest_package: null, rating: null, campus_area: null,
  top_recruiters: "", infrastructure: "", approvals: "", admission_exams: "", admission_process: "",
  image_url: "", meta_title: "", meta_description: "", is_featured: false, prospectus_url: "",
  publish_status: "published", featured_priority: 0, homepage_visible: false, noindex: false,
  sitemap_priority: 0.5, canonical_url: "", og_title: "", og_description: "", og_image: "",
  twitter_title: "", twitter_description: "", twitter_image: "",
};

export default function AdminCollegeForm() {
  const { id } = useParams();
  const isNew = id === "new";
  const navigate = useNavigate();
  const { toast } = useToast();
  const [form, setForm] = useState<CollegeFormData>(defaultForm);
  const [saving, setSaving] = useState(false);
  const [originalData, setOriginalData] = useState<Record<string, any> | null>(null);
  const [showVersions, setShowVersions] = useState(false);

  // Fetch versions
  const { data: versions } = useQuery({
    queryKey: ["college-versions", id],
    queryFn: async () => {
      if (isNew || !id) return [];
      const { data } = await supabase
        .from("college_versions")
        .select("*")
        .eq("college_id", Number(id))
        .order("version_number", { ascending: false })
        .limit(20);
      return data || [];
    },
    enabled: !isNew && !!id,
  });

  useEffect(() => {
    if (!isNew && id) {
      supabase.from("colleges").select("*").eq("id", Number(id)).maybeSingle().then(({ data }) => {
        if (data) {
          setOriginalData(data);
          setForm({
            name: data.name || "", slug: data.slug || "", city: data.city || "", state: data.state || "",
            address: data.address || "", pincode: data.pincode || "", category: data.category || "",
            type: data.type || "", established: data.established, affiliation: data.affiliation || "",
            accreditation: data.accreditation || "", description: data.description || "",
            courses: (data.courses || []).join(", "), avg_fees: data.avg_fees, avg_package: data.avg_package,
            highest_package: data.highest_package, rating: data.rating, campus_area: data.campus_area,
            top_recruiters: (data.top_recruiters || []).join(", "),
            infrastructure: (data.infrastructure || []).join(", "),
            approvals: (data.approvals || []).join(", "),
            admission_exams: (data.admission_exams || []).join(", "),
            admission_process: data.admission_process || "", image_url: data.image_url || "",
            meta_title: data.meta_title || "", meta_description: data.meta_description || "",
            is_featured: data.is_featured || false, prospectus_url: data.prospectus_url || "",
            publish_status: data.publish_status || "published",
            featured_priority: data.featured_priority || 0,
            homepage_visible: data.homepage_visible || false,
            noindex: data.noindex || false,
            sitemap_priority: data.sitemap_priority || 0.5,
            canonical_url: data.canonical_url || "",
            og_title: data.og_title || "",
            og_description: data.og_description || "",
            og_image: data.og_image || "",
            twitter_title: data.twitter_title || "",
            twitter_description: data.twitter_description || "",
            twitter_image: data.twitter_image || "",
          });
        }
      });
    }
  }, [id, isNew]);

  const toArray = (s: string) => s ? s.split(",").map(v => v.trim()).filter(Boolean) : [];

  const handleSave = async () => {
    if (!form.name.trim()) {
      toast({ title: "Error", description: "College name is required", variant: "destructive" });
      return;
    }
    setSaving(true);

    const newSlug = form.slug || form.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const payload: Record<string, any> = {
      name: form.name, slug: newSlug, city: form.city || null, state: form.state || null,
      address: form.address || null, pincode: form.pincode || null, category: form.category || null,
      type: form.type || null, established: form.established, affiliation: form.affiliation || null,
      accreditation: form.accreditation || null, description: form.description || null,
      courses: toArray(form.courses), avg_fees: form.avg_fees, avg_package: form.avg_package,
      highest_package: form.highest_package, rating: form.rating, campus_area: form.campus_area,
      top_recruiters: toArray(form.top_recruiters), infrastructure: toArray(form.infrastructure),
      approvals: toArray(form.approvals), admission_exams: toArray(form.admission_exams),
      admission_process: form.admission_process || null, image_url: form.image_url || null,
      meta_title: form.meta_title || null, meta_description: form.meta_description || null,
      is_featured: form.is_featured, prospectus_url: form.prospectus_url || null,
      publish_status: form.publish_status, featured_priority: form.featured_priority,
      homepage_visible: form.homepage_visible, noindex: form.noindex,
      sitemap_priority: form.sitemap_priority, canonical_url: form.canonical_url || null,
      og_title: form.og_title || null, og_description: form.og_description || null,
      og_image: form.og_image || null, twitter_title: form.twitter_title || null,
      twitter_description: form.twitter_description || null, twitter_image: form.twitter_image || null,
    };

    let error;
    if (isNew) {
      ({ error } = await supabase.from("colleges").insert(payload as any));
      if (!error) await logActivity("create", "college", undefined, { name: form.name });
    } else {
      // Save version before update
      if (originalData) {
        await saveCollegeVersion(Number(id), originalData, `Edited: ${form.name}`);
        // Check slug change for redirect
        if (originalData.slug && originalData.slug !== newSlug) {
          await saveSlugRedirect(originalData.slug, newSlug);
        }
      }
      ({ error } = await supabase.from("colleges").update(payload).eq("id", Number(id)));
      if (!error) await logActivity("update", "college", String(id), { name: form.name });
    }

    setSaving(false);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Saved", description: `College ${isNew ? "created" : "updated"} successfully.` });
      navigate("/admin/colleges");
    }
  };

  const handleRestoreVersion = async (versionContent: Record<string, any>) => {
    if (!confirm("Restore this version? Current content will be versioned first.")) return;
    // Save current as a version first
    if (originalData) {
      await saveCollegeVersion(Number(id), originalData, "Before version restore");
    }
    const { error } = await supabase.from("colleges").update(versionContent).eq("id", Number(id));
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      await logActivity("restore", "college", String(id), { version: "restored" });
      toast({ title: "Version restored" });
      window.location.reload();
    }
  };

  const set = (key: keyof CollegeFormData, value: any) => setForm(prev => ({ ...prev, [key]: value }));

  return (
    <>
      <div className="space-y-4 max-w-4xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => navigate("/admin/colleges")}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-foreground">{isNew ? "Add College" : "Edit College"}</h1>
              <p className="text-sm text-muted-foreground">{isNew ? "Create a new college entry" : form.name}</p>
            </div>
          </div>
          {!isNew && (
            <Button variant="outline" size="sm" onClick={() => setShowVersions(!showVersions)}>
              <History className="h-4 w-4 mr-1" /> {showVersions ? "Hide" : "Show"} History ({versions?.length || 0})
            </Button>
          )}
        </div>

        {/* Version History */}
        {showVersions && versions && versions.length > 0 && (
          <Card>
            <CardHeader><CardTitle className="text-lg">Version History</CardTitle></CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Version</TableHead>
                    <TableHead>Change</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {versions.map(v => (
                    <TableRow key={v.id}>
                      <TableCell><Badge variant="secondary">v{v.version_number}</Badge></TableCell>
                      <TableCell className="text-sm">{v.change_summary || "—"}</TableCell>
                      <TableCell className="text-xs text-muted-foreground">{format(new Date(v.created_at), "dd MMM yyyy HH:mm")}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" onClick={() => handleRestoreVersion(v.previous_content as Record<string, any>)}>
                          <RotateCcw className="h-3 w-3 mr-1" /> Restore
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}

        {/* Basic Info */}
        <Card>
          <CardHeader><CardTitle className="text-lg">Basic Information</CardTitle></CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2 space-y-1">
              <Label>College Name *</Label>
              <Input value={form.name} onChange={e => set("name", e.target.value)} placeholder="e.g. IIT Bombay" />
            </div>
            <div className="space-y-1">
              <Label>Slug (SEO URL)</Label>
              <Input value={form.slug} onChange={e => set("slug", e.target.value)} placeholder="iit-bombay" />
            </div>
            <div className="space-y-1">
              <Label>Established Year</Label>
              <Input type="number" value={form.established ?? ""} onChange={e => set("established", e.target.value ? Number(e.target.value) : null)} />
            </div>
            <div className="space-y-1">
              <Label>City</Label>
              <Input value={form.city} onChange={e => set("city", e.target.value)} />
            </div>
            <div className="space-y-1">
              <Label>State</Label>
              <Input value={form.state} onChange={e => set("state", e.target.value)} />
            </div>
            <div className="space-y-1">
              <Label>Type</Label>
              <Select value={form.type} onValueChange={v => set("type", v)}>
                <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Government">Government</SelectItem>
                  <SelectItem value="Private">Private</SelectItem>
                  <SelectItem value="Deemed">Deemed</SelectItem>
                  <SelectItem value="Autonomous">Autonomous</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label>Category</Label>
              <Input value={form.category} onChange={e => set("category", e.target.value)} />
            </div>
            <div className="space-y-1">
              <Label>Affiliation</Label>
              <Input value={form.affiliation} onChange={e => set("affiliation", e.target.value)} />
            </div>
            <div className="space-y-1">
              <Label>Accreditation</Label>
              <Input value={form.accreditation} onChange={e => set("accreditation", e.target.value)} placeholder="NAAC A++" />
            </div>
            <div className="md:col-span-2 space-y-1">
              <Label>Address</Label>
              <Input value={form.address} onChange={e => set("address", e.target.value)} />
            </div>
            <div className="space-y-1">
              <Label>Pincode</Label>
              <Input value={form.pincode} onChange={e => set("pincode", e.target.value)} />
            </div>
          </CardContent>
        </Card>

        {/* Publish Control */}
        <Card>
          <CardHeader><CardTitle className="text-lg">Publish Control</CardTitle></CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label>Status</Label>
              <Select value={form.publish_status} onValueChange={v => set("publish_status", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label>Featured Priority (higher = more prominent)</Label>
              <Input type="number" value={form.featured_priority} onChange={e => set("featured_priority", Number(e.target.value))} />
            </div>
            <div className="flex items-center gap-3">
              <Switch checked={form.is_featured} onCheckedChange={v => set("is_featured", v)} />
              <Label>Featured College</Label>
            </div>
            <div className="flex items-center gap-3">
              <Switch checked={form.homepage_visible} onCheckedChange={v => set("homepage_visible", v)} />
              <Label>Show on Homepage</Label>
            </div>
          </CardContent>
        </Card>

        {/* Academics */}
        <Card>
          <CardHeader><CardTitle className="text-lg">Academics & Placements</CardTitle></CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2 space-y-1">
              <Label>Courses (comma-separated)</Label>
              <Textarea value={form.courses} onChange={e => set("courses", e.target.value)} />
            </div>
            <div className="space-y-1">
              <Label>Average Fees (₹)</Label>
              <Input type="number" value={form.avg_fees ?? ""} onChange={e => set("avg_fees", e.target.value ? Number(e.target.value) : null)} />
            </div>
            <div className="space-y-1">
              <Label>Rating</Label>
              <Input type="number" step="0.1" max="5" value={form.rating ?? ""} onChange={e => set("rating", e.target.value ? Number(e.target.value) : null)} />
            </div>
            <div className="space-y-1">
              <Label>Average Package (₹ LPA)</Label>
              <Input type="number" value={form.avg_package ?? ""} onChange={e => set("avg_package", e.target.value ? Number(e.target.value) : null)} />
            </div>
            <div className="space-y-1">
              <Label>Highest Package (₹ LPA)</Label>
              <Input type="number" value={form.highest_package ?? ""} onChange={e => set("highest_package", e.target.value ? Number(e.target.value) : null)} />
            </div>
            <div className="space-y-1">
              <Label>Campus Area (acres)</Label>
              <Input type="number" value={form.campus_area ?? ""} onChange={e => set("campus_area", e.target.value ? Number(e.target.value) : null)} />
            </div>
            <div className="md:col-span-2 space-y-1">
              <Label>Top Recruiters (comma-separated)</Label>
              <Input value={form.top_recruiters} onChange={e => set("top_recruiters", e.target.value)} />
            </div>
            <div className="md:col-span-2 space-y-1">
              <Label>Infrastructure (comma-separated)</Label>
              <Input value={form.infrastructure} onChange={e => set("infrastructure", e.target.value)} />
            </div>
            <div className="md:col-span-2 space-y-1">
              <Label>Approvals (comma-separated)</Label>
              <Input value={form.approvals} onChange={e => set("approvals", e.target.value)} />
            </div>
            <div className="md:col-span-2 space-y-1">
              <Label>Admission Exams (comma-separated)</Label>
              <Input value={form.admission_exams} onChange={e => set("admission_exams", e.target.value)} />
            </div>
          </CardContent>
        </Card>

        {/* Description */}
        <Card>
          <CardHeader><CardTitle className="text-lg">Description & Admissions</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1">
              <Label>Description</Label>
              <Textarea rows={4} value={form.description} onChange={e => set("description", e.target.value)} />
            </div>
            <div className="space-y-1">
              <Label>Admission Process</Label>
              <Textarea rows={3} value={form.admission_process} onChange={e => set("admission_process", e.target.value)} />
            </div>
            <div className="space-y-1">
              <Label>Image URL</Label>
              <Input value={form.image_url} onChange={e => set("image_url", e.target.value)} />
            </div>
            <div className="space-y-1">
              <Label>Prospectus URL</Label>
              <Input value={form.prospectus_url} onChange={e => set("prospectus_url", e.target.value)} />
            </div>
          </CardContent>
        </Card>

        {/* Advanced SEO */}
        <Card>
          <CardHeader><CardTitle className="text-lg">SEO & Open Graph</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label>Meta Title (max 60)</Label>
                <Input maxLength={60} value={form.meta_title} onChange={e => set("meta_title", e.target.value)} />
                <p className="text-xs text-muted-foreground">{form.meta_title.length}/60</p>
              </div>
              <div className="space-y-1">
                <Label>Canonical URL</Label>
                <Input value={form.canonical_url} onChange={e => set("canonical_url", e.target.value)} placeholder="https://..." />
              </div>
            </div>
            <div className="space-y-1">
              <Label>Meta Description (max 160)</Label>
              <Textarea maxLength={160} value={form.meta_description} onChange={e => set("meta_description", e.target.value)} />
              <p className="text-xs text-muted-foreground">{form.meta_description.length}/160</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label>OG Title</Label>
                <Input value={form.og_title} onChange={e => set("og_title", e.target.value)} />
              </div>
              <div className="space-y-1">
                <Label>OG Image URL</Label>
                <Input value={form.og_image} onChange={e => set("og_image", e.target.value)} />
              </div>
              <div className="md:col-span-2 space-y-1">
                <Label>OG Description</Label>
                <Textarea value={form.og_description} onChange={e => set("og_description", e.target.value)} />
              </div>
              <div className="space-y-1">
                <Label>Twitter Title</Label>
                <Input value={form.twitter_title} onChange={e => set("twitter_title", e.target.value)} />
              </div>
              <div className="space-y-1">
                <Label>Twitter Image URL</Label>
                <Input value={form.twitter_image} onChange={e => set("twitter_image", e.target.value)} />
              </div>
              <div className="md:col-span-2 space-y-1">
                <Label>Twitter Description</Label>
                <Textarea value={form.twitter_description} onChange={e => set("twitter_description", e.target.value)} />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label>Sitemap Priority (0.0 - 1.0)</Label>
                <Input type="number" step="0.1" min="0" max="1" value={form.sitemap_priority} onChange={e => set("sitemap_priority", Number(e.target.value))} />
              </div>
              <div className="flex items-center gap-3 pt-4">
                <Switch checked={form.noindex} onCheckedChange={v => set("noindex", v)} />
                <Label>Noindex (hide from search engines)</Label>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-3 pb-6">
          <Button onClick={handleSave} disabled={saving}>
            <Save className="h-4 w-4 mr-1" /> {saving ? "Saving..." : "Save College"}
          </Button>
          <Button variant="outline" onClick={() => navigate("/dashboard/colleges")}>Cancel</Button>
        </div>
      </div>
    </>
  );
}
