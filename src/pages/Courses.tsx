import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Badge } from "@/components/ui/badge";
import {
  Cpu,
  Briefcase,
  Stethoscope,
  Scale,
  Palette,
  BookOpen,
  TrendingUp,
  Atom,
  Pill,
  Building,
  Clock,
  GraduationCap,
  ChevronRight,
} from "lucide-react";

const courses = [
  {
    category: "Engineering",
    icon: Cpu,
    color: "bg-blue-500",
    description: "Build the future with technology and innovation",
    programs: [
      { name: "B.Tech", duration: "4 Years", colleges: 2500 },
      { name: "M.Tech", duration: "2 Years", colleges: 1800 },
      { name: "B.E.", duration: "4 Years", colleges: 1200 },
      { name: "Diploma", duration: "3 Years", colleges: 3000 },
    ],
    slug: "engineering",
  },
  {
    category: "Management",
    icon: Briefcase,
    color: "bg-purple-500",
    description: "Lead organizations and drive business growth",
    programs: [
      { name: "MBA", duration: "2 Years", colleges: 1800 },
      { name: "BBA", duration: "3 Years", colleges: 2000 },
      { name: "PGDM", duration: "2 Years", colleges: 500 },
      { name: "Executive MBA", duration: "1 Year", colleges: 200 },
    ],
    slug: "management",
  },
  {
    category: "Medical",
    icon: Stethoscope,
    color: "bg-red-500",
    description: "Heal lives and advance healthcare",
    programs: [
      { name: "MBBS", duration: "5.5 Years", colleges: 600 },
      { name: "BDS", duration: "5 Years", colleges: 300 },
      { name: "BAMS", duration: "5.5 Years", colleges: 250 },
      { name: "B.Sc Nursing", duration: "4 Years", colleges: 2000 },
    ],
    slug: "medical",
  },
  {
    category: "Law",
    icon: Scale,
    color: "bg-amber-600",
    description: "Uphold justice and shape legal frameworks",
    programs: [
      { name: "BA LLB", duration: "5 Years", colleges: 500 },
      { name: "BBA LLB", duration: "5 Years", colleges: 300 },
      { name: "LLB", duration: "3 Years", colleges: 800 },
      { name: "LLM", duration: "2 Years", colleges: 200 },
    ],
    slug: "law",
  },
  {
    category: "Design",
    icon: Palette,
    color: "bg-pink-500",
    description: "Create experiences that inspire and delight",
    programs: [
      { name: "B.Des", duration: "4 Years", colleges: 150 },
      { name: "M.Des", duration: "2 Years", colleges: 80 },
      { name: "Fashion Design", duration: "4 Years", colleges: 100 },
      { name: "Interior Design", duration: "4 Years", colleges: 120 },
    ],
    slug: "design",
  },
  {
    category: "Arts & Humanities",
    icon: BookOpen,
    color: "bg-teal-500",
    description: "Explore human expression and culture",
    programs: [
      { name: "BA", duration: "3 Years", colleges: 5000 },
      { name: "MA", duration: "2 Years", colleges: 3000 },
      { name: "BA Journalism", duration: "3 Years", colleges: 400 },
      { name: "BA Psychology", duration: "3 Years", colleges: 500 },
    ],
    slug: "arts",
  },
  {
    category: "Commerce",
    icon: TrendingUp,
    color: "bg-green-500",
    description: "Master finance, accounting and business",
    programs: [
      { name: "B.Com", duration: "3 Years", colleges: 4000 },
      { name: "M.Com", duration: "2 Years", colleges: 2000 },
      { name: "CA", duration: "3-4 Years", colleges: 100 },
      { name: "B.Com (Hons)", duration: "3 Years", colleges: 1500 },
    ],
    slug: "commerce",
  },
  {
    category: "Science",
    icon: Atom,
    color: "bg-indigo-500",
    description: "Discover the laws that govern our universe",
    programs: [
      { name: "B.Sc", duration: "3 Years", colleges: 3500 },
      { name: "M.Sc", duration: "2 Years", colleges: 2000 },
      { name: "B.Sc (Hons)", duration: "3 Years", colleges: 1000 },
      { name: "Integrated M.Sc", duration: "5 Years", colleges: 200 },
    ],
    slug: "science",
  },
  {
    category: "Pharmacy",
    icon: Pill,
    color: "bg-cyan-500",
    description: "Advance pharmaceutical sciences and healthcare",
    programs: [
      { name: "B.Pharm", duration: "4 Years", colleges: 450 },
      { name: "M.Pharm", duration: "2 Years", colleges: 300 },
      { name: "D.Pharm", duration: "2 Years", colleges: 800 },
      { name: "Pharm.D", duration: "6 Years", colleges: 100 },
    ],
    slug: "pharmacy",
  },
  {
    category: "Architecture",
    icon: Building,
    color: "bg-orange-500",
    description: "Design spaces that transform how we live",
    programs: [
      { name: "B.Arch", duration: "5 Years", colleges: 280 },
      { name: "M.Arch", duration: "2 Years", colleges: 150 },
      { name: "B.Plan", duration: "4 Years", colleges: 100 },
      { name: "M.Plan", duration: "2 Years", colleges: 80 },
    ],
    slug: "architecture",
  },
];

export default function Courses() {
  return (
    <Layout>
      {/* Header */}
      <div className="bg-gradient-hero py-12">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-secondary px-4 py-1.5 rounded-full text-sm font-medium text-secondary-foreground mb-4">
            <GraduationCap className="w-4 h-4" />
            Explore Programs
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Find Your Perfect <span className="text-gradient">Course</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Discover a wide range of undergraduate, postgraduate, and professional 
            programs across India's top institutions.
          </p>
        </div>
      </div>

      {/* Courses Grid */}
      <div className="container mx-auto px-4 py-12">
        <div className="space-y-10">
          {courses.map((category) => (
            <div
              key={category.category}
              className="bg-card rounded-2xl border border-border overflow-hidden"
            >
              {/* Category Header */}
              <div className={`${category.color} p-6 flex items-center gap-4`}>
                <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center">
                  <category.icon className="w-7 h-7 text-white" />
                </div>
                <div className="text-white">
                  <h2 className="text-2xl font-bold">{category.category}</h2>
                  <p className="opacity-90">{category.description}</p>
                </div>
              </div>

              {/* Programs */}
              <div className="p-6">
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {category.programs.map((program) => (
                    <Link
                      key={program.name}
                      to={`/colleges?category=${category.slug}&course=${program.name}`}
                      className="group bg-secondary/50 rounded-xl p-5 hover:bg-secondary transition-colors"
                    >
                      <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
                        {program.name}
                      </h3>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {program.duration}
                        </div>
                      </div>
                      <div className="mt-3 flex items-center justify-between">
                        <Badge variant="outline" className="text-xs">
                          {program.colleges}+ Colleges
                        </Badge>
                        <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                      </div>
                    </Link>
                  ))}
                </div>
                <div className="mt-4 text-right">
                  <Link
                    to={`/colleges?category=${category.slug}`}
                    className="text-primary font-medium text-sm hover:underline inline-flex items-center gap-1"
                  >
                    View all {category.category} colleges
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}
