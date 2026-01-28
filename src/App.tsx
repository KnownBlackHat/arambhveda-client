import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AIAssistantButton } from "@/components/assistant/AIAssistantButton";
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
import Dashboard from "./pages/Dashboard";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/colleges" element={<Colleges />} />
          <Route path="/college/:id" element={<CollegeDetail />} />
          <Route path="/top-colleges" element={<TopColleges />} />
          <Route path="/compare" element={<Compare />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <AIAssistantButton />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
