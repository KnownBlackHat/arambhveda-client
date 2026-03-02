import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Loader2, CheckCircle, Send } from "lucide-react";
import { z } from "zod";

const leadSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(100),
  phone: z.string().trim().min(10, "Enter a valid phone number").max(15),
  email: z.string().trim().email("Enter a valid email").max(255).optional().or(z.literal("")),
  course_interest: z.string().optional(),
  city: z.string().trim().max(100).optional().or(z.literal("")),
});

interface LeadCaptureFormProps {
  sourcePage?: string;
  courseInterestOptions?: string[];
  compact?: boolean;
  heading?: string;
  subheading?: string;
  className?: string;
}

export function LeadCaptureForm({
  sourcePage = "homepage",
  courseInterestOptions = [
    "MBBS", "MD", "MS", "BDS", "MDS", "BSc Nursing", "MSc Nursing", "GNM", "ANM", "BAMS", "BHMS", "BUMS", "BPT", "MPT", "B.Pharma", "M.Pharma", "D.Pharma", "PharmD",
    "B.Tech", "M.Tech", "BE", "ME", "BCA", "MCA", "BSc IT", "MSc IT", "B.Arch", "M.Arch",
    "MBA", "BBA", "BMS", "PGDM", "BBM",
    "BA LLB", "BBA LLB", "LLB", "LLM",
    "BA", "MA", "BSc", "MSc", "BCom", "MCom", "BEd", "MEd", "PhD",
    "BSc Agriculture", "MSc Agriculture", "BVSc", "MVSc",
    "BFA", "MFA", "B.Des", "M.Des", "BJMC", "MJMC",
    "BHM", "MHM", "BSW", "MSW",
    "Diploma", "ITI", "Polytechnic",
    "Other",
  ],
  compact = false,
  heading = "Get Free Expert Counselling",
  subheading = "Fill the form & our counsellor will reach out to you shortly",
  className = "",
}: LeadCaptureFormProps) {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    course_interest: "",
    city: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const result = leadSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) fieldErrors[err.path[0] as string] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.from("leads").insert({
        name: form.name.trim(),
        phone: form.phone.trim(),
        email: form.email.trim() || null,
        course_interest: form.course_interest || null,
        city: form.city.trim() || null,
        source_page: sourcePage,
        status: "new",
      });

      if (error) throw error;

      setSubmitted(true);
      toast.success("Thank you! Our counsellor will contact you shortly.");
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className={`flex flex-col items-center justify-center py-8 text-center ${className}`}>
        <CheckCircle className="w-12 h-12 text-green-500 mb-3" />
        <h3 className="text-lg font-semibold text-foreground">Thank You!</h3>
        <p className="text-sm text-muted-foreground mt-1">Our counsellor will reach out to you shortly.</p>
        <Button
          variant="outline"
          size="sm"
          className="mt-4"
          onClick={() => {
            setSubmitted(false);
            setForm({ name: "", phone: "", email: "", course_interest: "", city: "" });
          }}
        >
          Submit Another Enquiry
        </Button>
      </div>
    );
  }

  return (
    <div className={className}>
      {!compact && (
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-foreground">{heading}</h3>
          <p className="text-sm text-muted-foreground">{subheading}</p>
        </div>
      )}
      <form onSubmit={handleSubmit} className={compact ? "flex flex-wrap gap-3 items-end" : "space-y-4"}>
        <div className={compact ? "flex-1 min-w-[150px]" : ""}>
          {!compact && <Label htmlFor="lead-name">Full Name *</Label>}
          <Input
            id="lead-name"
            placeholder="Your full name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className={errors.name ? "border-destructive" : ""}
          />
          {errors.name && <p className="text-xs text-destructive mt-1">{errors.name}</p>}
        </div>

        <div className={compact ? "flex-1 min-w-[150px]" : ""}>
          {!compact && <Label htmlFor="lead-phone">Phone Number *</Label>}
          <Input
            id="lead-phone"
            placeholder="Your phone number"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            className={errors.phone ? "border-destructive" : ""}
          />
          {errors.phone && <p className="text-xs text-destructive mt-1">{errors.phone}</p>}
        </div>

        {!compact && (
          <>
            <div>
              <Label htmlFor="lead-email">Email (Optional)</Label>
              <Input
                id="lead-email"
                type="email"
                placeholder="your.email@example.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className={errors.email ? "border-destructive" : ""}
              />
              {errors.email && <p className="text-xs text-destructive mt-1">{errors.email}</p>}
            </div>

            <div>
              <Label>Interested Course</Label>
              <Select value={form.course_interest} onValueChange={(v) => setForm({ ...form, course_interest: v })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a course" />
                </SelectTrigger>
                <SelectContent>
                  {courseInterestOptions.map((opt) => (
                    <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="lead-city">City (Optional)</Label>
              <Input
                id="lead-city"
                placeholder="Your city"
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
              />
            </div>
          </>
        )}

        <Button type="submit" disabled={loading} className={compact ? "" : "w-full"}>
          {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Send className="w-4 h-4 mr-2" />}
          {loading ? "Submitting..." : "Get Free Counselling"}
        </Button>
      </form>
    </div>
  );
}
