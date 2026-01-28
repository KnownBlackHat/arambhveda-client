import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Search, ChevronDown, User, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import logo from "@/assets/logo.png";
const courseCategories = [{
  name: "Engineering",
  path: "/colleges?category=engineering"
}, {
  name: "Management",
  path: "/colleges?category=management"
}, {
  name: "Medical",
  path: "/colleges?category=medical"
}, {
  name: "Law",
  path: "/colleges?category=law"
}, {
  name: "Design",
  path: "/colleges?category=design"
}, {
  name: "Arts & Humanities",
  path: "/colleges?category=arts"
}];
const examLinks = [{
  name: "JEE Main",
  path: "/exams/jee-main"
}, {
  name: "JEE Advanced",
  path: "/exams/jee-advanced"
}, {
  name: "NEET",
  path: "/exams/neet"
}, {
  name: "CAT",
  path: "/exams/cat"
}, {
  name: "GATE",
  path: "/exams/gate"
}, {
  name: "CLAT",
  path: "/exams/clat"
}];
export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;
  return <header className="sticky top-0 z-50 w-full bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/90 border-b border-border">
      {/* Top Bar */}
      <div className="bg-primary text-primary-foreground py-1.5">
        <div className="container mx-auto px-4 flex justify-between items-center text-sm">
          <div className="flex items-center gap-4">
            
            <span className="hidden sm:inline">|</span>
            <span className="hidden sm:inline">info@aarambhveda.com</span>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/login" className="hover:underline">Student Login</Link>
            <span>|</span>
            <Link to="/register" className="hover:underline">Register</Link>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <img src={logo} alt="Aarambh Veda" className="h-12 w-auto" />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-6">
            <Link to="/" className={`text-sm font-medium transition-colors hover:text-primary ${isActive("/") ? "text-primary" : "text-foreground"}`}>
              Home
            </Link>

            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-1 text-sm font-medium transition-colors hover:text-primary">
                Colleges <ChevronDown className="w-4 h-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-48">
                <DropdownMenuItem asChild>
                  <Link to="/colleges">All Colleges</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/top-colleges">Top Colleges</Link>
                </DropdownMenuItem>
                {courseCategories.map(cat => <DropdownMenuItem key={cat.name} asChild>
                    <Link to={cat.path}>{cat.name}</Link>
                  </DropdownMenuItem>)}
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-1 text-sm font-medium transition-colors hover:text-primary">
                Exams <ChevronDown className="w-4 h-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-48">
                {examLinks.map(exam => <DropdownMenuItem key={exam.name} asChild>
                    <Link to={exam.path}>{exam.name}</Link>
                  </DropdownMenuItem>)}
              </DropdownMenuContent>
            </DropdownMenu>

            <Link to="/compare" className={`text-sm font-medium transition-colors hover:text-primary ${isActive("/compare") ? "text-primary" : "text-foreground"}`}>
              Compare Colleges
            </Link>

            <Link to="/courses" className={`text-sm font-medium transition-colors hover:text-primary ${isActive("/courses") ? "text-primary" : "text-foreground"}`}>
              Courses
            </Link>

            <Link to="/about" className={`text-sm font-medium transition-colors hover:text-primary ${isActive("/about") ? "text-primary" : "text-foreground"}`}>
              About Us
            </Link>
          </div>

          {/* Search and Actions */}
          <div className="hidden lg:flex items-center gap-3">
            <Link to="/search">
              <Button variant="ghost" size="icon">
                <Search className="w-5 h-5" />
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="outline" size="sm" className="gap-2">
                <User className="w-4 h-4" />
                Login
              </Button>
            </Link>
            <Link to="/register">
              <Button size="sm">Get Started</Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button className="lg:hidden p-2" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && <div className="lg:hidden mt-4 pb-4 border-t border-border pt-4 animate-fade-in">
            <div className="flex flex-col gap-3">
              <Link to="/" className="py-2 text-sm font-medium" onClick={() => setMobileMenuOpen(false)}>
                Home
              </Link>
              <Link to="/colleges" className="py-2 text-sm font-medium" onClick={() => setMobileMenuOpen(false)}>
                All Colleges
              </Link>
              <Link to="/top-colleges" className="py-2 text-sm font-medium" onClick={() => setMobileMenuOpen(false)}>
                Top Colleges
              </Link>
              <Link to="/compare" className="py-2 text-sm font-medium" onClick={() => setMobileMenuOpen(false)}>
                Compare Colleges
              </Link>
              <Link to="/courses" className="py-2 text-sm font-medium" onClick={() => setMobileMenuOpen(false)}>
                Courses
              </Link>
              <Link to="/about" className="py-2 text-sm font-medium" onClick={() => setMobileMenuOpen(false)}>
                About Us
              </Link>
              <div className="flex gap-2 pt-3 border-t border-border">
                <Link to="/login" className="flex-1" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="outline" className="w-full">Login</Button>
                </Link>
                <Link to="/register" className="flex-1" onClick={() => setMobileMenuOpen(false)}>
                  <Button className="w-full">Register</Button>
                </Link>
              </div>
            </div>
          </div>}
      </nav>
    </header>;
}