import { useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Plus, Search, Edit, Trash2, Star, ChevronLeft, ChevronRight, RotateCcw, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { softDeleteCollege, restoreCollege, logActivity } from "@/utils/adminHelpers";

const PAGE_SIZE = 20;

export default function AdminColleges() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [typeFilter, setTypeFilter] = useState("all");
  const [stateFilter, setStateFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("active");
  const navigate = useNavigate();
  const { toast } = useToast();
  const { hasRole } = useAuth();

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["admin-colleges", search, page, typeFilter, stateFilter, statusFilter],
    queryFn: async () => {
      let query = supabase
        .from("colleges")
        .select("id, name, city, state, category, type, rating, is_featured, slug, publish_status, deleted_at, page_views, leads_generated, accreditation", { count: "exact" })
        .order("name")
        .range(page * PAGE_SIZE, (page + 1) * PAGE_SIZE - 1);

      if (statusFilter === "active") query = query.is("deleted_at", null);
      else if (statusFilter === "deleted") query = query.not("deleted_at", "is", null);

      if (search) query = query.ilike("name", `%${search}%`);
      if (typeFilter !== "all") query = query.eq("type", typeFilter);
      if (stateFilter !== "all") query = query.eq("state", stateFilter);

      const { data, count, error } = await query;
      if (error) throw error;
      return { colleges: data || [], total: count || 0 };
    },
  });

  // Fetch unique states for filter
  const { data: states } = useQuery({
    queryKey: ["college-states"],
    queryFn: async () => {
      const { data } = await supabase.from("colleges").select("state").not("state", "is", null);
      const unique = [...new Set(data?.map(d => d.state).filter(Boolean) || [])].sort();
      return unique as string[];
    },
  });

  const totalPages = Math.ceil((data?.total || 0) / PAGE_SIZE);

  const handleSoftDelete = async (id: number, name: string) => {
    if (!confirm(`Move "${name}" to trash?`)) return;
    const { error } = await softDeleteCollege(id);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      await logActivity("delete", "college", String(id), { name });
      toast({ title: "Moved to trash", description: `${name} can be restored later.` });
      refetch();
    }
  };

  const handleRestore = async (id: number, name: string) => {
    const { error } = await restoreCollege(id);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      await logActivity("restore", "college", String(id), { name });
      toast({ title: "Restored", description: `${name} is active again.` });
      refetch();
    }
  };

  const publishStatusBadge = (status: string | null) => {
    if (status === "draft") return <Badge variant="secondary" className="text-xs">Draft</Badge>;
    if (status === "archived") return <Badge variant="outline" className="text-xs">Archived</Badge>;
    return <Badge className="bg-green-100 text-green-800 border-0 text-xs">Published</Badge>;
  };

  return (
    <AdminLayout>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">College Management</h1>
            <p className="text-sm text-muted-foreground">{data?.total || 0} colleges total</p>
          </div>
          <Button onClick={() => navigate("/admin/colleges/new")}>
            <Plus className="h-4 w-4 mr-1" /> Add College
          </Button>
        </div>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-2 flex-1 min-w-[200px]">
                <Search className="h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search colleges..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(0); }} />
              </div>
              <Select value={typeFilter} onValueChange={v => { setTypeFilter(v); setPage(0); }}>
                <SelectTrigger className="w-[130px]"><SelectValue placeholder="Type" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="Government">Government</SelectItem>
                  <SelectItem value="Private">Private</SelectItem>
                  <SelectItem value="Deemed">Deemed</SelectItem>
                  <SelectItem value="Autonomous">Autonomous</SelectItem>
                </SelectContent>
              </Select>
              <Select value={stateFilter} onValueChange={v => { setStateFilter(v); setPage(0); }}>
                <SelectTrigger className="w-[150px]"><SelectValue placeholder="State" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All States</SelectItem>
                  {states?.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={v => { setStatusFilter(v); setPage(0); }}>
                <SelectTrigger className="w-[120px]"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="deleted">Trash</SelectItem>
                  <SelectItem value="all">All</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Views</TableHead>
                  <TableHead>Leads</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow><TableCell colSpan={8} className="text-center py-8 text-muted-foreground">Loading...</TableCell></TableRow>
                ) : data?.colleges.length === 0 ? (
                  <TableRow><TableCell colSpan={8} className="text-center py-8 text-muted-foreground">No colleges found</TableCell></TableRow>
                ) : (
                  data?.colleges.map((c) => (
                    <TableRow key={c.id} className={c.deleted_at ? "opacity-50" : ""}>
                      <TableCell className="font-medium max-w-[200px] truncate">
                        {c.name}
                        {c.is_featured && <Star className="inline h-3 w-3 fill-accent text-accent ml-1" />}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">{c.city}, {c.state}</TableCell>
                      <TableCell><Badge variant="secondary" className="text-xs">{c.type || "N/A"}</Badge></TableCell>
                      <TableCell>{publishStatusBadge(c.publish_status)}</TableCell>
                      <TableCell>{c.rating ? Number(c.rating).toFixed(1) : "—"}</TableCell>
                      <TableCell className="text-sm">{c.page_views || 0}</TableCell>
                      <TableCell className="text-sm">{c.leads_generated || 0}</TableCell>
                      <TableCell className="text-right space-x-1">
                        {c.deleted_at ? (
                          <Button variant="ghost" size="sm" onClick={() => handleRestore(c.id, c.name)}>
                            <RotateCcw className="h-4 w-4 mr-1" /> Restore
                          </Button>
                        ) : (
                          <>
                            <Button variant="ghost" size="icon" onClick={() => navigate(`/admin/colleges/${c.id}`)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            {hasRole("super_admin") && (
                              <Button variant="ghost" size="icon" onClick={() => handleSoftDelete(c.id, c.name)}>
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            )}
                          </>
                        )}
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
                  <Button variant="outline" size="sm" disabled={page === 0} onClick={() => setPage(p => p - 1)}>
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" disabled={page >= totalPages - 1} onClick={() => setPage(p => p + 1)}>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
