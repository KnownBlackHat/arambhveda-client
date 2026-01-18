import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, GraduationCap, Building, BookOpen, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const stats = [
  { icon: Building, value: "15,000+", label: "Colleges Listed" },
  { icon: BookOpen, value: "500+", label: "Courses Available" },
  { icon: Users, value: "2M+", label: "Students Helped" },
  { icon: GraduationCap, value: "50+", label: "Entrance Exams" },
];

export function HeroSection() {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/colleges?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <section className="relative bg-gradient-hero overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-accent/10 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 py-16 md:py-24 relative">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-secondary px-4 py-1.5 rounded-full text-sm font-medium text-secondary-foreground mb-6 animate-fade-in">
            <span className="w-2 h-2 bg-primary rounded-full animate-pulse-soft" />
            India's Most Trusted Education Portal
          </div>

          {/* Heading */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 animate-fade-in">
            Find Your Perfect{" "}
            <span className="text-gradient">College</span> in India
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto animate-fade-in">
            Discover 15,000+ colleges across India. Compare courses, fees, placements, 
            and make informed decisions for your future.
          </p>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-10 animate-fade-in">
            <div className="flex flex-col sm:flex-row gap-3 p-2 bg-card rounded-xl shadow-lg border border-border">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search colleges, courses, exams..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 h-12 border-0 bg-transparent focus-visible:ring-0 text-base"
                />
              </div>
              <Button type="submit" size="lg" className="h-12 px-8 shadow-orange">
                Search
              </Button>
            </div>
          </form>

          {/* Quick Links */}
          <div className="flex flex-wrap justify-center gap-2 mb-12 animate-fade-in">
            <span className="text-sm text-muted-foreground">Popular:</span>
            {["IIT", "NIT", "AIIMS", "IIM", "Top Engineering", "Top MBA"].map((term) => (
              <button
                key={term}
                onClick={() => navigate(`/colleges?search=${term}`)}
                className="text-sm text-primary hover:text-primary/80 font-medium transition-colors"
              >
                {term}
              </button>
            ))}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 animate-fade-in">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center p-4">
                <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center mx-auto mb-3">
                  <stat.icon className="w-6 h-6 text-primary" />
                </div>
                <div className="text-2xl md:text-3xl font-bold text-foreground">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
