import { useState, useRef } from "react";
// Unified dashboard - no AdminLayout wrapper needed
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Upload, FileText, CheckCircle, XCircle } from "lucide-react";
import { logActivity } from "@/utils/adminHelpers";

export default function AdminBulkImport() {
  const [csvData, setCsvData] = useState("");
  const [importing, setImporting] = useState(false);
  const [results, setResults] = useState<{ success: number; failed: number; errors: string[] }>({ success: 0, failed: 0, errors: [] });
  const [showResults, setShowResults] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setCsvData(ev.target?.result as string);
    reader.readAsText(file);
  };

  const parseCSV = (csv: string) => {
    const lines = csv.trim().split("\n");
    if (lines.length < 2) return [];
    const headers = lines[0].split(",").map(h => h.trim().toLowerCase().replace(/\s+/g, "_"));
    return lines.slice(1).map(line => {
      const values = line.split(",").map(v => v.trim());
      const obj: Record<string, any> = {};
      headers.forEach((h, i) => {
        if (values[i]) obj[h] = values[i];
      });
      return obj;
    });
  };

  const handleImport = async () => {
    const records = parseCSV(csvData);
    if (!records.length) {
      toast({ title: "No data found", variant: "destructive" });
      return;
    }

    setImporting(true);
    let success = 0;
    let failed = 0;
    const errors: string[] = [];

    // Process in batches of 50
    for (let i = 0; i < records.length; i += 50) {
      const batch = records.slice(i, i + 50).map(r => ({
        name: r.name || r.college_name || "Unknown",
        city: r.city || null,
        state: r.state || null,
        type: r.type || null,
        category: r.category || null,
        established: r.established ? Number(r.established) : null,
        avg_fees: r.avg_fees ? Number(r.avg_fees) : null,
        avg_package: r.avg_package ? Number(r.avg_package) : null,
        rating: r.rating ? Number(r.rating) : null,
        accreditation: r.accreditation || null,
        affiliation: r.affiliation || null,
        description: r.description || null,
        slug: (r.slug || r.name || "").toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      }));

      const { error, data } = await supabase.from("colleges").insert(batch).select("id");
      if (error) {
        failed += batch.length;
        errors.push(`Batch ${i / 50 + 1}: ${error.message}`);
      } else {
        success += data?.length || 0;
      }
    }

    await logActivity("create", "college", undefined, { bulk_import: true, success, failed });
    setResults({ success, failed, errors });
    setShowResults(true);
    setImporting(false);
    toast({ title: `Import complete: ${success} added, ${failed} failed` });
  };

  const sampleCSV = "name,city,state,type,category,established,avg_fees,rating\nExample College,Mumbai,Maharashtra,Private,Engineering,2000,500000,4.0";

  return (
    <>
      <div className="space-y-4 max-w-3xl">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Bulk Import</h1>
          <p className="text-sm text-muted-foreground">Import colleges from CSV files</p>
        </div>

        <Card>
          <CardHeader><CardTitle className="text-lg">Upload CSV</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div>
              <input type="file" ref={fileRef} accept=".csv" onChange={handleFileUpload} className="hidden" />
              <Button variant="outline" onClick={() => fileRef.current?.click()}>
                <Upload className="h-4 w-4 mr-1" /> Choose CSV File
              </Button>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium">Or paste CSV data</label>
              <Textarea rows={8} value={csvData} onChange={e => setCsvData(e.target.value)} placeholder={sampleCSV} className="font-mono text-xs" />
            </div>

            <div className="flex items-center gap-2">
              <Button onClick={handleImport} disabled={importing || !csvData.trim()}>
                {importing ? "Importing..." : "Start Import"}
              </Button>
              <Button variant="outline" onClick={() => setCsvData(sampleCSV)}>Load Sample</Button>
            </div>

            <div className="text-xs text-muted-foreground">
              <p className="font-medium mb-1">Required columns: <code>name</code></p>
              <p>Optional: city, state, type, category, established, avg_fees, avg_package, rating, accreditation, affiliation, description, slug</p>
            </div>
          </CardContent>
        </Card>

        {showResults && (
          <Card>
            <CardHeader><CardTitle className="text-lg">Import Results</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <div className="flex gap-4">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span className="text-lg font-bold">{results.success}</span>
                  <span className="text-sm text-muted-foreground">imported</span>
                </div>
                <div className="flex items-center gap-2">
                  <XCircle className="h-5 w-5 text-destructive" />
                  <span className="text-lg font-bold">{results.failed}</span>
                  <span className="text-sm text-muted-foreground">failed</span>
                </div>
              </div>
              {results.errors.length > 0 && (
                <div className="space-y-1">
                  <p className="text-sm font-medium text-destructive">Errors:</p>
                  {results.errors.map((err, i) => (
                    <p key={i} className="text-xs text-muted-foreground">{err}</p>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </>
  );
}
