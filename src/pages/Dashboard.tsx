import { useState } from "react";
import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { colleges, formatCurrency } from "@/data/colleges";
import {
  User,
  Heart,
  FileText,
  Bell,
  Settings,
  LogOut,
  GraduationCap,
  MapPin,
  Star,
  ChevronRight,
  Clock,
  CheckCircle,
  AlertCircle,
  Calendar,
  BookOpen,
  Briefcase,
} from "lucide-react";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("overview");

  // Mock user data
  const user = {
    name: "Rahul Sharma",
    email: "rahul.sharma@email.com",
    phone: "+91 96436 89903",
    education: "Class 12th",
    preferredCourse: "B.Tech",
  };

  // Mock saved colleges (first 4 from data)
  const savedColleges = colleges.slice(0, 4);

  // Mock applications
  const applications = [
    { college: colleges[0], status: "submitted", date: "2026-01-05" },
    { college: colleges[2], status: "under_review", date: "2026-01-03" },
    { college: colleges[5], status: "accepted", date: "2025-12-28" },
  ];

  // Mock notifications
  const notifications = [
    { title: "Application Update", message: "Your application to IIT Bombay is under review", time: "2 hours ago", read: false },
    { title: "Deadline Reminder", message: "IIT Delhi application deadline in 3 days", time: "1 day ago", read: false },
    { title: "New Recommendation", message: "Based on your profile, we recommend checking out NIT Trichy", time: "2 days ago", read: true },
  ];

  const quickStats = [
    { label: "Saved Colleges", value: "12", icon: Heart, color: "text-red-500" },
    { label: "Applications", value: "5", icon: FileText, color: "text-blue-500" },
    { label: "Exams Tracked", value: "3", icon: BookOpen, color: "text-purple-500" },
    { label: "Profile Complete", value: "85%", icon: User, color: "text-green-500" },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "submitted":
        return <Badge className="bg-blue-500">Submitted</Badge>;
      case "under_review":
        return <Badge className="bg-yellow-500">Under Review</Badge>;
      case "accepted":
        return <Badge className="bg-green-500">Accepted</Badge>;
      case "rejected":
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <Layout>
      <div className="bg-secondary/30 min-h-screen">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar */}
            <aside className="lg:w-72 flex-shrink-0">
              <div className="bg-card rounded-xl border border-border p-6 sticky top-24">
                {/* Profile */}
                <div className="text-center mb-6">
                  <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-3xl font-bold text-primary">R</span>
                  </div>
                  <h2 className="font-semibold text-lg">{user.name}</h2>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                  <Badge variant="secondary" className="mt-2">
                    <GraduationCap className="w-3 h-3 mr-1" />
                    {user.education}
                  </Badge>
                </div>

                {/* Profile Completion */}
                <div className="mb-6">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-muted-foreground">Profile Completion</span>
                    <span className="font-medium">85%</span>
                  </div>
                  <Progress value={85} className="h-2" />
                </div>

                {/* Nav */}
                <nav className="space-y-1">
                  {[
                    { label: "Overview", icon: User, tab: "overview" },
                    { label: "Saved Colleges", icon: Heart, tab: "saved" },
                    { label: "Applications", icon: FileText, tab: "applications" },
                    { label: "Notifications", icon: Bell, tab: "notifications" },
                    { label: "Settings", icon: Settings, tab: "settings" },
                  ].map((item) => (
                    <button
                      key={item.tab}
                      onClick={() => setActiveTab(item.tab)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                        activeTab === item.tab
                          ? "bg-primary text-primary-foreground"
                          : "hover:bg-secondary text-foreground"
                      }`}
                    >
                      <item.icon className="w-5 h-5" />
                      {item.label}
                      {item.tab === "notifications" && (
                        <Badge className="ml-auto bg-destructive">2</Badge>
                      )}
                    </button>
                  ))}
                </nav>

                <Button variant="outline" className="w-full mt-6 gap-2 text-destructive">
                  <LogOut className="w-4 h-4" /> Sign Out
                </Button>
              </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1">
              {activeTab === "overview" && (
                <div className="space-y-6">
                  <div>
                    <h1 className="text-2xl font-bold mb-2">Welcome back, {user.name.split(" ")[0]}!</h1>
                    <p className="text-muted-foreground">
                      Here's an overview of your college search journey
                    </p>
                  </div>

                  {/* Quick Stats */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {quickStats.map((stat) => (
                      <div
                        key={stat.label}
                        className="bg-card rounded-xl border border-border p-4"
                      >
                        <stat.icon className={`w-8 h-8 ${stat.color} mb-2`} />
                        <div className="text-2xl font-bold">{stat.value}</div>
                        <div className="text-sm text-muted-foreground">{stat.label}</div>
                      </div>
                    ))}
                  </div>

                  {/* Recent Activity */}
                  <div className="bg-card rounded-xl border border-border p-6">
                    <h3 className="text-lg font-semibold mb-4">Recent Applications</h3>
                    <div className="space-y-4">
                      {applications.map((app, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-4 bg-secondary/50 rounded-lg"
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center">
                              <GraduationCap className="w-6 h-6 text-primary" />
                            </div>
                            <div>
                              <h4 className="font-medium">{app.college.name}</h4>
                              <p className="text-sm text-muted-foreground">
                                Applied on {new Date(app.date).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          {getStatusBadge(app.status)}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Recommendations */}
                  <div className="bg-card rounded-xl border border-border p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold">Recommended for You</h3>
                      <Link to="/colleges" className="text-primary text-sm hover:underline">
                        View All
                      </Link>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      {colleges.slice(6, 10).map((college) => (
                        <Link
                          key={college.id}
                          to={`/college/${college.id}`}
                          className="flex items-center gap-4 p-4 bg-secondary/50 rounded-lg hover:bg-secondary transition-colors"
                        >
                          <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center flex-shrink-0">
                            <GraduationCap className="w-6 h-6 text-primary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium truncate">{college.name}</h4>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <MapPin className="w-3 h-3" />
                              {college.city}
                              <Star className="w-3 h-3 text-accent fill-accent ml-2" />
                              {college.rating}
                            </div>
                          </div>
                          <ChevronRight className="w-5 h-5 text-muted-foreground" />
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "saved" && (
                <div className="space-y-6">
                  <h1 className="text-2xl font-bold">Saved Colleges</h1>
                  <div className="grid gap-4">
                    {savedColleges.map((college) => (
                      <Link
                        key={college.id}
                        to={`/college/${college.id}`}
                        className="bg-card rounded-xl border border-border p-5 flex items-center gap-4 hover:border-primary transition-colors"
                      >
                        <div className="w-16 h-16 bg-secondary rounded-lg flex items-center justify-center flex-shrink-0">
                          <GraduationCap className="w-8 h-8 text-primary/50" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg">{college.name}</h3>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              {college.city}, {college.state}
                            </span>
                            <span className="flex items-center gap-1">
                              <Star className="w-3 h-3 text-accent fill-accent" />
                              {college.rating}
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold text-success">
                            {formatCurrency(college.avgPackage)}
                          </div>
                          <div className="text-sm text-muted-foreground">Avg Package</div>
                        </div>
                        <Button variant="ghost" size="icon">
                          <Heart className="w-5 h-5 text-red-500 fill-red-500" />
                        </Button>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === "applications" && (
                <div className="space-y-6">
                  <h1 className="text-2xl font-bold">My Applications</h1>
                  <div className="grid gap-4">
                    {applications.map((app, index) => (
                      <div
                        key={index}
                        className="bg-card rounded-xl border border-border p-5"
                      >
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-4">
                            <div className="w-14 h-14 bg-secondary rounded-lg flex items-center justify-center">
                              <GraduationCap className="w-7 h-7 text-primary/50" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-lg">{app.college.name}</h3>
                              <p className="text-sm text-muted-foreground">
                                {app.college.city}, {app.college.state}
                              </p>
                            </div>
                          </div>
                          {getStatusBadge(app.status)}
                        </div>
                        <div className="flex items-center gap-6 text-sm">
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Calendar className="w-4 h-4" />
                            Applied: {new Date(app.date).toLocaleDateString()}
                          </div>
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Briefcase className="w-4 h-4" />
                            {app.college.courses[0]}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === "notifications" && (
                <div className="space-y-6">
                  <h1 className="text-2xl font-bold">Notifications</h1>
                  <div className="space-y-3">
                    {notifications.map((notif, index) => (
                      <div
                        key={index}
                        className={`bg-card rounded-xl border border-border p-5 ${
                          !notif.read ? "border-l-4 border-l-primary" : ""
                        }`}
                      >
                        <div className="flex items-start gap-4">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            !notif.read ? "bg-primary/20" : "bg-secondary"
                          }`}>
                            <Bell className={`w-5 h-5 ${!notif.read ? "text-primary" : "text-muted-foreground"}`} />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium">{notif.title}</h4>
                            <p className="text-sm text-muted-foreground mt-1">{notif.message}</p>
                            <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {notif.time}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === "settings" && (
                <div className="space-y-6">
                  <h1 className="text-2xl font-bold">Settings</h1>
                  <div className="bg-card rounded-xl border border-border p-6">
                    <h3 className="text-lg font-semibold mb-4">Profile Information</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="p-4 bg-secondary/50 rounded-lg">
                        <div className="text-sm text-muted-foreground">Full Name</div>
                        <div className="font-medium">{user.name}</div>
                      </div>
                      <div className="p-4 bg-secondary/50 rounded-lg">
                        <div className="text-sm text-muted-foreground">Email</div>
                        <div className="font-medium">{user.email}</div>
                      </div>
                      <div className="p-4 bg-secondary/50 rounded-lg">
                        <div className="text-sm text-muted-foreground">Phone</div>
                        <div className="font-medium">{user.phone}</div>
                      </div>
                      <div className="p-4 bg-secondary/50 rounded-lg">
                        <div className="text-sm text-muted-foreground">Education</div>
                        <div className="font-medium">{user.education}</div>
                      </div>
                    </div>
                    <Button className="mt-6">Edit Profile</Button>
                  </div>
                </div>
              )}
            </main>
          </div>
        </div>
      </div>
    </Layout>
  );
}
