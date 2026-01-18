import { Link } from "react-router-dom";
import { 
  Cpu, Briefcase, Stethoscope, Scale, Palette, BookOpen, 
  TrendingUp, Atom, Pill, Building 
} from "lucide-react";

const categories = [
  { name: "Engineering", icon: Cpu, count: "2,500+ Colleges", color: "bg-blue-500", slug: "engineering" },
  { name: "Management", icon: Briefcase, count: "1,800+ Colleges", color: "bg-purple-500", slug: "management" },
  { name: "Medical", icon: Stethoscope, count: "750+ Colleges", color: "bg-red-500", slug: "medical" },
  { name: "Law", icon: Scale, count: "500+ Colleges", color: "bg-amber-600", slug: "law" },
  { name: "Design", icon: Palette, count: "350+ Colleges", color: "bg-pink-500", slug: "design" },
  { name: "Arts & Humanities", icon: BookOpen, count: "1,200+ Colleges", color: "bg-teal-500", slug: "arts" },
  { name: "Commerce", icon: TrendingUp, count: "1,500+ Colleges", color: "bg-green-500", slug: "commerce" },
  { name: "Science", icon: Atom, count: "900+ Colleges", color: "bg-indigo-500", slug: "science" },
  { name: "Pharmacy", icon: Pill, count: "450+ Colleges", color: "bg-cyan-500", slug: "pharmacy" },
  { name: "Architecture", icon: Building, count: "280+ Colleges", color: "bg-orange-500", slug: "architecture" },
];

export function CategorySection() {
  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Explore Colleges by <span className="text-gradient">Category</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Browse through various streams and find the best colleges that match your interests and career goals
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {categories.map((category) => (
            <Link
              key={category.name}
              to={`/colleges?category=${category.slug}`}
              className="group bg-card rounded-xl p-5 border border-border card-hover text-center"
            >
              <div className={`w-14 h-14 ${category.color} rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                <category.icon className="w-7 h-7 text-white" />
              </div>
              <h3 className="font-semibold text-foreground mb-1 text-sm">{category.name}</h3>
              <p className="text-xs text-muted-foreground">{category.count}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
