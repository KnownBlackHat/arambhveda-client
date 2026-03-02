import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Star, MapPin, Trophy, ChevronRight, TrendingUp } from "lucide-react";
import { useColleges } from "@/hooks/useColleges";
import { formatCurrency } from "@/utils/formatCurrency";
import { useState } from "react";

export default function TopColleges() {
  const [page, setPage] = useState(0);
  const pageSize = 50;

  const { data, isLoading } = useColleges({
    sortBy: "rating",
    limit: pageSize,
    offset: page * pageSize,
  });

  const topColleges = data?.colleges || [];
  const total = data?.total || 0;

  return (
    <Layout>
      {/* Header */}
      <div className="bg-gradient-to-br from-primary/10 to-accent/10 py-12">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-accent/20 text-accent-foreground px-4 py-1.5 rounded-full text-sm font-medium mb-4">
            <Trophy className="w-4 h-4" />
            Top Ranked Institutions
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Top Colleges in <span className="text-gradient">India</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Explore {total.toLocaleString()}+ educational institutions ranked by academic excellence,
            placements, infrastructure, and student satisfaction.
          </p>
        </div>
      </div>

      {/* College List */}
      <div className="container mx-auto px-4 py-12">
        <div className="space-y-6">
          {isLoading
            ? Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="bg-card rounded-xl border border-border p-6">
                  <Skeleton className="h-24 w-full" />
                </div>
              ))
            : topColleges.map((college, index) => {
                const rank = page * pageSize + index;
                return (
                  <Link
                    key={college.id}
                    to={`/college/${college.id}`}
                    className="block bg-card rounded-xl border border-border overflow-hidden card-hover group"
                  >
                    <div className="flex flex-col md:flex-row">
                      {/* Rank Badge */}
                      <div
                        className={`w-full md:w-20 py-4 md:py-0 flex items-center justify-center ${
                          rank === 0 ? "bg-gradient-to-br from-yellow-400 to-yellow-600" :
                          rank === 1 ? "bg-gradient-to-br from-gray-300 to-gray-500" :
                          rank === 2 ? "bg-gradient-to-br from-amber-600 to-amber-800" :
                          "bg-secondary"
                        }`}
                      >
                        <div className="text-center">
                          <div className={`text-3xl font-bold ${rank < 3 ? "text-white" : "text-foreground"}`}>
                            #{rank + 1}
                          </div>
                          {rank < 3 && <Trophy className="w-5 h-5 mx-auto mt-1 text-white/80" />}
                        </div>
                      </div>

                      {/* Content */}
                      <div className="flex-1 p-6">
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex flex-wrap items-center gap-2 mb-2">
                              <h2 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                                {college.name}
                              </h2>
                              {college.type && <Badge variant="outline">{college.type}</Badge>}
                            </div>

                            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                              <div className="flex items-center gap-1">
                                <MapPin className="w-4 h-4" />
                                {college.city || "India"}{college.state ? `, ${college.state}` : ""}
                              </div>
                              {college.rating && (
                                <div className="flex items-center gap-1">
                                  <Star className="w-4 h-4 text-accent fill-accent" />
                                  <span className="font-semibold text-foreground">{college.rating}</span>
                                </div>
                              )}
                            </div>

                            {college.courses && college.courses.length > 0 && (
                              <div className="flex flex-wrap gap-1.5">
                                {college.courses.slice(0, 5).map((course) => (
                                  <Badge key={course} variant="secondary" className="text-xs">{course}</Badge>
                                ))}
                              </div>
                            )}
                          </div>

                          <div className="flex flex-wrap lg:flex-nowrap gap-6 items-center">
                            {college.avg_fees != null && (
                              <div className="text-center">
                                <div className="text-sm text-muted-foreground">Avg. Fees</div>
                                <div className="font-bold text-lg">{formatCurrency(college.avg_fees)}</div>
                              </div>
                            )}
                            {college.avg_package != null && (
                              <div className="text-center">
                                <div className="text-sm text-muted-foreground">Avg. Package</div>
                                <div className="font-bold text-lg text-success flex items-center gap-1">
                                  <TrendingUp className="w-4 h-4" />
                                  {formatCurrency(college.avg_package)}
                                </div>
                              </div>
                            )}
                            <ChevronRight className="w-6 h-6 text-muted-foreground group-hover:text-primary transition-colors hidden lg:block" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
        </div>

        {/* Pagination */}
        {total > pageSize && (
          <div className="flex items-center justify-between mt-8">
            <p className="text-sm text-muted-foreground">
              Showing {page * pageSize + 1}-{Math.min((page + 1) * pageSize, total)} of {total.toLocaleString()}
            </p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" disabled={page === 0} onClick={() => setPage(page - 1)}>
                Previous
              </Button>
              <Button variant="outline" size="sm" disabled={(page + 1) * pageSize >= total} onClick={() => setPage(page + 1)}>
                Next
              </Button>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
