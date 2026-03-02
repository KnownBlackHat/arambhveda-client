import { Link } from "react-router-dom";
import { Star, MapPin, ArrowRight, ChevronRight } from "lucide-react";
import { getCollegeImage } from "@/utils/collegeImages";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useTopColleges } from "@/hooks/useColleges";
import { useCollegeCount } from "@/hooks/useColleges";
import { formatCurrency } from "@/utils/formatCurrency";
import { Skeleton } from "@/components/ui/skeleton";

export function TopCollegesSection() {
  const { data: topColleges, isLoading } = useTopColleges(6);
  const { data: totalCount } = useCollegeCount();

  return (
    <section className="py-16 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
              Top Colleges in <span className="text-gradient">India</span>
            </h2>
            <p className="text-muted-foreground">
              {totalCount ? `${totalCount.toLocaleString()}+ colleges` : "Handpicked institutions"} ranked by academics, placements, and infrastructure
            </p>
          </div>
          <Link to="/top-colleges">
            <Button variant="outline" className="gap-2">
              View All <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading
            ? Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="bg-card rounded-xl border border-border overflow-hidden">
                  <Skeleton className="h-40 w-full" />
                  <div className="p-5 space-y-3">
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                </div>
              ))
            : topColleges?.map((college, index) => (
                <Link
                  key={college.id}
                  to={`/college/${college.id}`}
                  className="group bg-card rounded-xl border border-border overflow-hidden card-hover"
                >
                  <div className="relative h-40 overflow-hidden">
                    <img
                      src={college.image_url || getCollegeImage(college.id)}
                      alt={college.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 left-3">
                      <Badge className="bg-primary text-primary-foreground font-bold">#{index + 1}</Badge>
                    </div>
                    {college.rating && (
                      <div className="absolute bottom-3 right-3 flex items-center gap-1 bg-card/90 backdrop-blur px-2 py-1 rounded-full text-sm">
                        <Star className="w-4 h-4 text-accent fill-accent" />
                        <span className="font-semibold">{college.rating}</span>
                      </div>
                    )}
                  </div>

                  <div className="p-5">
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <div>
                        <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2">
                          {college.name}
                        </h3>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                          <MapPin className="w-3 h-3" />
                          {college.city || "India"}{college.state ? `, ${college.state}` : ""}
                        </div>
                      </div>
                    </div>

                    {college.courses && college.courses.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {college.courses.slice(0, 3).map((course) => (
                          <Badge key={course} variant="secondary" className="text-xs font-normal">{course}</Badge>
                        ))}
                        {college.courses.length > 3 && (
                          <Badge variant="secondary" className="text-xs font-normal">+{college.courses.length - 3}</Badge>
                        )}
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-3 border-t border-border">
                      {college.avg_package != null ? (
                        <div>
                          <div className="text-xs text-muted-foreground">Avg. Package</div>
                          <div className="font-semibold text-success">{formatCurrency(college.avg_package)}</div>
                        </div>
                      ) : (
                        <div />
                      )}
                      {college.avg_fees != null ? (
                        <div className="text-right">
                          <div className="text-xs text-muted-foreground">Fees</div>
                          <div className="font-semibold text-foreground">{formatCurrency(college.avg_fees)}/yr</div>
                        </div>
                      ) : (
                        <div />
                      )}
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
