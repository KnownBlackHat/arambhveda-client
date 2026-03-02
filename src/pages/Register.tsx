import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Eye, EyeOff, Mail, Lock, User, Phone, GraduationCap, CheckCircle, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { z } from "zod";
import logo from "@/assets/logo.png";

const registerSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().trim().email("Enter a valid email address"),
  phone: z.string().trim().min(10, "Enter a valid phone number").max(15),
  password: z.string().min(6, "Password must be at least 6 characters"),
  studyLevel: z.string().optional(),
  agreeTerms: z.literal(true, { errorMap: () => ({ message: "You must agree to the terms" }) }),
});

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [emailSent, setEmailSent] = useState(false);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    studyLevel: "",
    agreeTerms: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const result = registerSchema.safeParse(formData);
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
      const { data, error } = await supabase.auth.signUp({
        email: formData.email.trim(),
        password: formData.password,
        options: {
          data: {
            full_name: formData.name.trim(),
            display_name: formData.name.trim(),
            phone: formData.phone.trim(),
            study_level: formData.studyLevel,
          },
          emailRedirectTo: window.location.origin,
        },
      });

      if (error) throw error;

      // Auto-create lead from registration
      try {
        await supabase.from("leads").insert({
          name: formData.name.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim(),
          source_page: "registration",
          status: "new",
          lead_stage: "new",
          course_interest: formData.studyLevel || null,
        });
      } catch {
        // Lead creation failure shouldn't block registration
        console.error("Lead auto-creation failed");
      }

      if (data.user && !data.session) {
        setEmailSent(true);
        toast.success("Account created! Please check your email to verify your account.");
      } else if (data.session) {
        toast.success("Account created successfully!");
        navigate("/");
      }
    } catch (error: any) {
      if (error.message?.includes("already registered")) {
        toast.error("This email is already registered. Please sign in instead.");
      } else {
        toast.error(error.message || "Registration failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const benefits = [
    "Access detailed college information",
    "Compare colleges side by side",
    "Get personalized recommendations",
    "Track application status",
    "Free expert counselling",
  ];

  if (emailSent) {
    return (
      <Layout>
        <div className="min-h-[80vh] flex items-center justify-center py-12 px-4">
          <div className="w-full max-w-md bg-card rounded-2xl border border-border p-8 shadow-lg text-center">
            <Mail className="w-16 h-16 text-primary mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-foreground mb-2">Verify Your Email</h2>
            <p className="text-muted-foreground mb-6">
              We've sent a verification link to <strong className="text-foreground">{formData.email}</strong>. Please check your inbox and click the link to activate your account.
            </p>
            <p className="text-sm text-muted-foreground mb-4">
              Didn't receive the email? Check your spam folder or try again.
            </p>
            <div className="flex flex-col gap-3">
              <Button variant="outline" onClick={() => setEmailSent(false)}>
                Try with a different email
              </Button>
              <Link to="/login">
                <Button className="w-full">Go to Login</Button>
              </Link>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-[80vh] flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-5xl">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Benefits Side */}
            <div className="hidden lg:flex flex-col justify-center bg-gradient-primary rounded-2xl p-8 text-white">
              <GraduationCap className="w-16 h-16 mb-6 opacity-90" />
              <h2 className="text-3xl font-bold mb-4">
                Start Your Journey to the Perfect College
              </h2>
              <p className="text-white/90 mb-8">
                Join thousands of students who found their dream college with Aarambh Veda.
              </p>
              <ul className="space-y-4">
                {benefits.map((benefit) => (
                  <li key={benefit} className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 flex-shrink-0" />
                    {benefit}
                  </li>
                ))}
              </ul>
            </div>

            {/* Form Side */}
            <div className="bg-card rounded-2xl border border-border p-8 shadow-lg">
              <div className="text-center mb-6">
                <Link to="/">
                  <img src={logo} alt="Aarambh Veda" className="h-14 mx-auto mb-3" />
                </Link>
                <h1 className="text-2xl font-bold text-foreground">Create Your Account</h1>
                <p className="text-muted-foreground mt-1">Get started with free college search</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="name"
                      placeholder="Enter your full name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className={`pl-10 ${errors.name ? "border-destructive" : ""}`}
                    />
                  </div>
                  {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className={`pl-10 ${errors.email ? "border-destructive" : ""}`}
                    />
                  </div>
                  {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="Enter your phone number"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className={`pl-10 ${errors.phone ? "border-destructive" : ""}`}
                    />
                  </div>
                  {errors.phone && <p className="text-xs text-destructive">{errors.phone}</p>}
                </div>

                <div className="space-y-2">
                  <Label>Current Education Level</Label>
                  <Select value={formData.studyLevel} onValueChange={(value) => setFormData({ ...formData, studyLevel: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your current level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="10th">Class 10th</SelectItem>
                      <SelectItem value="12th">Class 12th</SelectItem>
                      <SelectItem value="graduate">Graduate</SelectItem>
                      <SelectItem value="postgraduate">Post Graduate</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Create a password (min 6 characters)"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className={`pl-10 pr-10 ${errors.password ? "border-destructive" : ""}`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {errors.password && <p className="text-xs text-destructive">{errors.password}</p>}
                </div>

                <label className="flex items-start gap-2 text-sm cursor-pointer">
                  <Checkbox
                    checked={formData.agreeTerms}
                    onCheckedChange={(checked) => setFormData({ ...formData, agreeTerms: checked as boolean })}
                    className="mt-0.5"
                  />
                  <span className={`${errors.agreeTerms ? "text-destructive" : "text-muted-foreground"}`}>
                    I agree to the{" "}
                    <Link to="/terms" className="text-primary hover:underline">Terms of Service</Link>{" "}
                    and{" "}
                    <Link to="/privacy" className="text-primary hover:underline">Privacy Policy</Link>
                  </span>
                </label>
                {errors.agreeTerms && <p className="text-xs text-destructive">{errors.agreeTerms}</p>}

                <Button type="submit" className="w-full h-12 text-base shadow-orange" disabled={loading}>
                  {loading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : null}
                  {loading ? "Creating Account..." : "Create Account"}
                </Button>
              </form>

              <p className="text-center text-sm text-muted-foreground mt-5">
                Already have an account?{" "}
                <Link to="/login" className="text-primary font-medium hover:underline">Sign in</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
