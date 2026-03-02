import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { AIAssistantButton } from "@/components/assistant/AIAssistantButton";
import { ProtectedERPRoute } from "@/components/erp/ProtectedERPRoute";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Colleges from "./pages/Colleges";
import CollegeDetail from "./pages/CollegeDetail";
import TopColleges from "./pages/TopColleges";
import Compare from "./pages/Compare";
import Courses from "./pages/Courses";
import About from "./pages/About";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ExamDetail from "./pages/ExamDetail";
import Profile from "./pages/Profile";
import ERPLogin from "./pages/erp/ERPLogin";
import ERPDashboard from "./pages/erp/ERPDashboard";
import TodaysData from "./pages/erp/TodaysData";
import LeadsPage from "./pages/erp/LeadsPage";
import CallLogsPage from "./pages/erp/CallLogsPage";
import AttendancePage from "./pages/erp/AttendancePage";
import ProfilePage from "./pages/erp/ProfilePage";
import TeamPage from "./pages/erp/TeamPage";
import InviteUserPage from "./pages/erp/InviteUserPage";
import AdminCollegeForm from "./pages/admin/AdminCollegeForm";
import AdminMediaLibrary from "./pages/admin/AdminMediaLibrary";
import AdminNotifications from "./pages/admin/AdminNotifications";
import AdminBulkImport from "./pages/admin/AdminBulkImport";
import CollegesManagement from "./pages/dashboard/CollegesManagement";
import BlogsPage from "./pages/dashboard/BlogsPage";
import TestimonialsPage from "./pages/dashboard/TestimonialsPage";
import BannersPage from "./pages/dashboard/BannersPage";
import CoursesPage from "./pages/dashboard/CoursesPage";
import ExamsPage from "./pages/dashboard/ExamsPage";
import SEOPage from "./pages/dashboard/SEOPage";
import AnalyticsPage from "./pages/dashboard/AnalyticsPage";
import AuditLogsPage from "./pages/dashboard/AuditLogsPage";
import SecurityPage from "./pages/dashboard/SecurityPage";
import SystemPage from "./pages/dashboard/SystemPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Index />} />
            <Route path="/colleges" element={<Colleges />} />
            <Route path="/college/:id" element={<CollegeDetail />} />
            <Route path="/top-colleges" element={<TopColleges />} />
            <Route path="/compare" element={<Compare />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/about" element={<About />} />
            <Route path="/exams/:slug" element={<ExamDetail />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile" element={<Profile />} />

            {/* ERP/Admin Login */}
            <Route path="/erp/login" element={<ERPLogin />} />
            <Route path="/admin/login" element={<Navigate to="/erp/login" replace />} />
            <Route path="/admin" element={<Navigate to="/dashboard" replace />} />

            {/* Unified Dashboard - Sales & CRM */}
            <Route path="/dashboard" element={<ProtectedERPRoute><ERPDashboard /></ProtectedERPRoute>} />
            <Route path="/dashboard/todays-data" element={<ProtectedERPRoute><TodaysData /></ProtectedERPRoute>} />
            <Route path="/dashboard/leads" element={<ProtectedERPRoute><LeadsPage /></ProtectedERPRoute>} />
            <Route path="/dashboard/calls" element={<ProtectedERPRoute><CallLogsPage /></ProtectedERPRoute>} />
            <Route path="/dashboard/attendance" element={<ProtectedERPRoute><AttendancePage /></ProtectedERPRoute>} />
            <Route path="/dashboard/profile" element={<ProtectedERPRoute><ProfilePage /></ProtectedERPRoute>} />

            {/* Unified Dashboard - Content Management (Admin) */}
            <Route path="/dashboard/colleges" element={<ProtectedERPRoute adminOnly><CollegesManagement /></ProtectedERPRoute>} />
            <Route path="/dashboard/courses" element={<ProtectedERPRoute adminOnly><CoursesPage /></ProtectedERPRoute>} />
            <Route path="/dashboard/exams" element={<ProtectedERPRoute adminOnly><ExamsPage /></ProtectedERPRoute>} />
            <Route path="/dashboard/blogs" element={<ProtectedERPRoute adminOnly><BlogsPage /></ProtectedERPRoute>} />
            <Route path="/dashboard/testimonials" element={<ProtectedERPRoute adminOnly><TestimonialsPage /></ProtectedERPRoute>} />
            <Route path="/dashboard/banners" element={<ProtectedERPRoute adminOnly><BannersPage /></ProtectedERPRoute>} />
            <Route path="/dashboard/media" element={<ProtectedERPRoute adminOnly><AdminMediaLibrary /></ProtectedERPRoute>} />

            {/* Unified Dashboard - Administration (Admin) */}
            <Route path="/dashboard/team" element={<ProtectedERPRoute adminOnly><TeamPage /></ProtectedERPRoute>} />
            <Route path="/dashboard/invite" element={<ProtectedERPRoute adminOnly><InviteUserPage /></ProtectedERPRoute>} />
            <Route path="/dashboard/analytics" element={<ProtectedERPRoute adminOnly><AnalyticsPage /></ProtectedERPRoute>} />
            <Route path="/dashboard/audit" element={<ProtectedERPRoute adminOnly><AuditLogsPage /></ProtectedERPRoute>} />
            <Route path="/dashboard/seo" element={<ProtectedERPRoute adminOnly><SEOPage /></ProtectedERPRoute>} />
            <Route path="/dashboard/notifications" element={<ProtectedERPRoute adminOnly><AdminNotifications /></ProtectedERPRoute>} />
            <Route path="/dashboard/bulk-import" element={<ProtectedERPRoute adminOnly><AdminBulkImport /></ProtectedERPRoute>} />
            <Route path="/dashboard/security" element={<ProtectedERPRoute adminOnly><SecurityPage /></ProtectedERPRoute>} />
            <Route path="/dashboard/system" element={<ProtectedERPRoute adminOnly><SystemPage /></ProtectedERPRoute>} />

            {/* Legacy admin routes - College form still needs AdminLayout */}
            <Route path="/admin/colleges/:id" element={<ProtectedERPRoute adminOnly><AdminCollegeForm /></ProtectedERPRoute>} />

            <Route path="*" element={<NotFound />} />
          </Routes>
          <AIAssistantButton />
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
