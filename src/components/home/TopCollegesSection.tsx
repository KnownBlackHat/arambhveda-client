import { Link } from "react-router-dom";
import { Star, MapPin, Award, ArrowRight, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { colleges, formatCurrency } from "@/data/colleges";

export function TopCollegesSection() {
  const topColleges = colleges.slice(0, 6);

  return (
    <section className="py-16 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
              Top Colleges in <span className="text-gradient">India</span>
            </h2>
            <p className="text-muted-foreground">
              Handpicked institutions ranked by academics, placements, and infrastructure
            </p>
          </div>
          <Link to="/top-colleges">
            <Button variant="outline" className="gap-2">
              View All <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {topColleges.map((college, index) => (
            <Link
              key={college.id}
              to={`/college/${college.id}`}
              className="group bg-card rounded-xl border border-border overflow-hidden card-hover"
            >
              {/* Image Placeholder with Rank Badge */}
              <div className="relative h-40 bg-gradient-to-br from-primary/20 to-accent/20">
                <div className="absolute top-3 left-3">
                  <Badge className="bg-primary text-primary-foreground font-bold">
                    #{index + 1}
                  </Badge>
                </div>
                <div className="absolute bottom-3 right-3 flex items-center gap-1 bg-card/90 backdrop-blur px-2 py-1 rounded-full text-sm">
                  <Star className="w-4 h-4 text-accent fill-accent" />
                  <span className="font-semibold">{college.rating}</span>
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Award className="w-16 h-16 text-primary/30" />
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div>
                    <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2">
                      {college.name}
                    </h3>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                      <MapPin className="w-3 h-3" />
                      {college.city}, {college.state}
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5 mb-4">
                  {college.courses.slice(0, 3).map((course) => (
                    <Badge key={course} variant="secondary" className="text-xs font-normal">
                      {course}
                    </Badge>
                  ))}
                  {college.courses.length > 3 && (
                    <Badge variant="secondary" className="text-xs font-normal">
                      +{college.courses.length - 3}
                    </Badge>
                  )}
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-border">
                  <div>
                    <div className="text-xs text-muted-foreground">Avg. Package</div>
                    <div className="font-semibold text-success">
                      {formatCurrency(college.avgPackage)}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-muted-foreground">Fees</div>
                    <div className="font-semibold text-foreground">
                      {formatCurrency(college.avgFees)}/yr
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
