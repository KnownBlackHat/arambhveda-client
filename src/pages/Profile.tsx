import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { User, Mail, Phone, GraduationCap, Calendar, LogOut, Edit2, Save, X } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export default function Profile() {
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [profile, setProfile] = useState({
    full_name: "",
    email: "",
    phone: "",
    display_name: "",
    avatar_url: "",
  });

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
      return;
    }
    if (user) {
      fetchProfile();
    }
  }, [user, loading]);

  const fetchProfile = async () => {
    if (!user) return;
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", user.id)
      .single();

    if (data) {
      setProfile({
        full_name: data.full_name || user.user_metadata?.full_name || "",
        email: data.email || user.email || "",
        phone: data.phone || user.user_metadata?.phone || "",
        display_name: data.display_name || "",
        avatar_url: data.avatar_url || "",
      });
    } else {
      setProfile({
        full_name: user.user_metadata?.full_name || "",
        email: user.email || "",
        phone: user.user_metadata?.phone || "",
        display_name: user.user_metadata?.display_name || "",
        avatar_url: "",
      });
    }
  };

  const handleSave = async () => {
    if (!user) return;
    setIsSaving(true);
    const { error } = await supabase
      .from("profiles")
      .update({
        full_name: profile.full_name,
        phone: profile.phone,
        display_name: profile.display_name,
      })
      .eq("user_id", user.id);

    if (error) {
      toast.error("Failed to update profile.");
    } else {
      toast.success("Profile updated successfully!");
      setIsEditing(false);
    }
    setIsSaving(false);
  };

  const handleSignOut = async () => {
    await signOut();
    toast.success("Signed out successfully.");
    navigate("/");
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  if (loading) {
    return (
      <Layout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-[70vh] py-12 px-4">
        <div className="container mx-auto max-w-2xl">
          {/* Profile Header */}
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="flex flex-col sm:flex-row items-center gap-6">
                <Avatar className="w-24 h-24 border-4 border-primary/20">
                  <AvatarImage src={profile.avatar_url} />
                  <AvatarFallback className="bg-primary text-primary-foreground text-2xl font-bold">
                    {getInitials(profile.full_name || profile.display_name || "U")}
                  </AvatarFallback>
                </Avatar>
                <div className="text-center sm:text-left flex-1">
                  <h1 className="text-2xl font-bold text-foreground">
                    {profile.full_name || profile.display_name || "Student"}
                  </h1>
                  <p className="text-muted-foreground">{profile.email}</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    <Calendar className="inline w-4 h-4 mr-1" />
                    Member since {new Date(user?.created_at || "").toLocaleDateString("en-IN", { month: "long", year: "numeric" })}
                  </p>
                </div>
                <div className="flex gap-2">
                  {!isEditing ? (
                    <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                      <Edit2 className="w-4 h-4 mr-1" /> Edit
                    </Button>
                  ) : (
                    <>
                      <Button size="sm" onClick={handleSave} disabled={isSaving}>
                        <Save className="w-4 h-4 mr-1" /> {isSaving ? "Saving..." : "Save"}
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => { setIsEditing(false); fetchProfile(); }}>
                        <X className="w-4 h-4" />
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Profile Details */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg">Personal Information</CardTitle>
              <CardDescription>Your account details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fullName" className="flex items-center gap-2">
                  <User className="w-4 h-4 text-muted-foreground" /> Full Name
                </Label>
                {isEditing ? (
                  <Input
                    id="fullName"
                    value={profile.full_name}
                    onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                  />
                ) : (
                  <p className="text-foreground py-2 px-3 bg-muted/50 rounded-md">
                    {profile.full_name || "Not set"}
                  </p>
                )}
              </div>

              <Separator />

              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-muted-foreground" /> Email Address
                </Label>
                <p className="text-foreground py-2 px-3 bg-muted/50 rounded-md">
                  {profile.email}
                </p>
              </div>

              <Separator />

              <div className="space-y-2">
                <Label htmlFor="phone" className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-muted-foreground" /> Phone Number
                </Label>
                {isEditing ? (
                  <Input
                    id="phone"
                    value={profile.phone}
                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                  />
                ) : (
                  <p className="text-foreground py-2 px-3 bg-muted/50 rounded-md">
                    {profile.phone || "Not set"}
                  </p>
                )}
              </div>

              <Separator />

              <div className="space-y-2">
                <Label htmlFor="displayName" className="flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 text-muted-foreground" /> Display Name
                </Label>
                {isEditing ? (
                  <Input
                    id="displayName"
                    value={profile.display_name}
                    onChange={(e) => setProfile({ ...profile, display_name: e.target.value })}
                  />
                ) : (
                  <p className="text-foreground py-2 px-3 bg-muted/50 rounded-md">
                    {profile.display_name || "Not set"}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Sign Out */}
          <Button variant="destructive" className="w-full" onClick={handleSignOut}>
            <LogOut className="w-4 h-4 mr-2" /> Sign Out
          </Button>
        </div>
      </div>
    </Layout>
  );
}
