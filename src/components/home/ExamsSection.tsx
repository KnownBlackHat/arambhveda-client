import { Link } from "react-router-dom";
import { Calendar, ArrowRight, FileText, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const exams = [
  {
    name: "JEE Main 2026",
    category: "Engineering",
    date: "Jan 22 - Jan 31, 2026",
    registrations: "12 Lakh+",
    status: "Registration Open",
    color: "bg-blue-500",
    slug: "jee-main",
  },
  {
    name: "NEET UG 2026",
    category: "Medical",
    date: "May 4, 2026",
    registrations: "18 Lakh+",
    status: "Upcoming",
    color: "bg-red-500",
    slug: "neet",
  },
  {
    name: "CAT 2026",
    category: "Management",
    date: "Nov 24, 2026",
    registrations: "2.5 Lakh+",
    status: "Upcoming",
    color: "bg-purple-500",
    slug: "cat",
  },
  {
    name: "GATE 2026",
    category: "Engineering/PG",
    date: "Feb 1-16, 2026",
    registrations: "8 Lakh+",
    status: "Registration Open",
    color: "bg-green-500",
    slug: "gate",
  },
  {
    name: "CLAT 2026",
    category: "Law",
    date: "Dec 2026",
    registrations: "80,000+",
    status: "Upcoming",
    color: "bg-amber-600",
    slug: "clat",
  },
  {
    name: "JEE Advanced 2026",
    category: "Engineering",
    date: "May 2026",
    registrations: "1.5 Lakh+",
    status: "Upcoming",
    color: "bg-indigo-500",
    slug: "jee-advanced",
  },
];

export function ExamsSection() {
  return (
    <section className="py-16 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
              Upcoming <span className="text-gradient">Entrance Exams</span>
            </h2>
            <p className="text-muted-foreground">
              Stay updated with important exam dates and registration deadlines
            </p>
          </div>
          <Link to="/exams" className="text-primary font-medium flex items-center gap-2 hover:underline">
            View All Exams <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {exams.map((exam) => (
            <Link
              key={exam.name}
              to={`/exams/${exam.slug}`}
              className="bg-card rounded-xl border border-border p-5 card-hover group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 ${exam.color} rounded-lg flex items-center justify-center`}>
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <Badge 
                  variant={exam.status === "Registration Open" ? "default" : "secondary"}
                  className={exam.status === "Registration Open" ? "bg-success" : ""}
                >
                  {exam.status}
                </Badge>
              </div>

              <h3 className="font-semibold text-lg text-foreground group-hover:text-primary transition-colors mb-1">
                {exam.name}
              </h3>
              <p className="text-sm text-muted-foreground mb-4">{exam.category}</p>

              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  {exam.date}
                </div>
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <Users className="w-4 h-4" />
                  {exam.registrations}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
