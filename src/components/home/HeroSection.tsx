import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, GraduationCap, Building, BookOpen, Users, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import college1 from "@/assets/college-1.jpg";
import college2 from "@/assets/college-2.jpg";
import college3 from "@/assets/college-3.jpg";
import college4 from "@/assets/college-4.jpg";
import college5 from "@/assets/college-5.jpg";
import college6 from "@/assets/college-6.jpg";

const slides = [
  { image: college1, name: "IIT Delhi", location: "New Delhi" },
  { image: college2, name: "IIT Bombay", location: "Mumbai" },
  { image: college3, name: "AIIMS Delhi", location: "New Delhi" },
  { image: college4, name: "IIM Ahmedabad", location: "Ahmedabad" },
  { image: college5, name: "NIT Trichy", location: "Tiruchirappalli" },
  { image: college6, name: "BITS Pilani", location: "Pilani" },
];

const stats = [
  { icon: Building, value: "15,000+", label: "Colleges Listed" },
  { icon: BookOpen, value: "500+", label: "Courses Available" },
  { icon: Users, value: "2M+", label: "Students Helped" },
  { icon: GraduationCap, value: "50+", label: "Entrance Exams" },
];

export function HeroSection() {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/colleges?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const goToSlide = (index: number) => setCurrentSlide(index);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);

  return (
    <section className="relative w-full h-[70vh] min-h-[500px] overflow-hidden">
      {/* Fullscreen Slideshow */}
      {slides.map((slide, index) => (
        <div
          key={index}
          className="absolute inset-0 transition-opacity duration-1000 ease-in-out"
          style={{ opacity: currentSlide === index ? 1 : 0 }}
        >
          <img
            src={slide.image}
            alt={slide.name}
            className="w-full h-full object-cover"
          />
        </div>
      ))}

      {/* Dark overlay for text readability */}
      <div className="absolute inset-0 bg-black/50 z-10" />

      {/* Content overlay */}
      <div className="absolute inset-0 z-20 flex flex-col items-center justify-center px-4">
        {/* Heading */}
        <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-3 text-center drop-shadow-lg">
          Find Your Perfect{" "}
          <span className="text-primary">College</span> in India
        </h1>
        <p className="text-base md:text-lg text-white/90 mb-8 max-w-2xl text-center drop-shadow">
          Discover 15,000+ colleges across India. Compare courses, fees, placements,
          and make informed decisions for your future.
        </p>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="w-full max-w-2xl mb-6">
          <div className="flex flex-col sm:flex-row gap-0 bg-white rounded-xl shadow-2xl overflow-hidden">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search colleges, exams, courses and more..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 h-14 text-base text-foreground bg-white border-0 outline-none"
              />
            </div>
            <button
              type="submit"
              className="h-14 px-10 bg-primary text-primary-foreground font-semibold text-base hover:bg-primary/90 transition-colors shrink-0"
            >
              Search
            </button>
          </div>
        </form>

        {/* Quick Links */}
        <div className="flex flex-wrap justify-center gap-2 mb-6">
          <span className="text-sm text-white/70">Popular:</span>
          {["IIT", "NIT", "AIIMS", "IIM", "Top Engineering", "Top MBA"].map((term) => (
            <button
              key={term}
              onClick={() => navigate(`/colleges?search=${term}`)}
              className="text-sm text-white hover:text-primary font-medium transition-colors underline-offset-2 hover:underline"
            >
              {term}
            </button>
          ))}
        </div>
      </div>

      {/* Slide navigation arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-black/40 hover:bg-black/60 flex items-center justify-center text-white transition-colors"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-black/40 hover:bg-black/60 flex items-center justify-center text-white transition-colors"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* Slide info + dots */}
      <div className="absolute bottom-4 left-0 right-0 z-30 flex items-center justify-between px-6">
        <div className="text-white text-sm drop-shadow">
          <span className="font-semibold">{slides[currentSlide].name}</span>
          <span className="text-white/70">, {slides[currentSlide].location}</span>
        </div>
        <div className="flex items-center gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => goToSlide(i)}
              className={`w-2.5 h-2.5 rounded-full transition-all ${
                currentSlide === i ? "bg-primary scale-125" : "bg-white/50 hover:bg-white/80"
              }`}
            />
          ))}
          <span className="text-white/70 text-sm ml-2">
            {currentSlide + 1} / {slides.length}
          </span>
        </div>
      </div>

      {/* Stats bar at bottom */}
      <div className="absolute -bottom-0 left-0 right-0 z-30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-card/95 backdrop-blur-md rounded-t-xl p-4 shadow-lg border border-border border-b-0">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <stat.icon className="w-5 h-5 text-primary" />
                  <span className="text-xl font-bold text-foreground">{stat.value}</span>
                </div>
                <div className="text-xs text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
