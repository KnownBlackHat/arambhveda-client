import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Badge } from "@/components/ui/badge";
import { colleges, formatCurrency } from "@/data/colleges";
import { Star, MapPin, Trophy, ChevronRight, TrendingUp } from "lucide-react";

export default function TopColleges() {
  // Sort by rating to get top colleges
  const topColleges = [...colleges].sort((a, b) => b.rating - a.rating);

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
            Explore India's finest educational institutions ranked by academic excellence,
            placements, infrastructure, and student satisfaction.
          </p>
        </div>
      </div>

      {/* College List */}
      <div className="container mx-auto px-4 py-12">
        <div className="space-y-6">
          {topColleges.map((college, index) => (
            <Link
              key={college.id}
              to={`/college/${college.id}`}
              className="block bg-card rounded-xl border border-border overflow-hidden card-hover group"
            >
              <div className="flex flex-col md:flex-row">
                {/* College Image with Rank Badge */}
                <div className="relative w-full md:w-20 h-32 md:h-auto">
                  {college.image ? (
                    <img 
                      src={`/${college.image}`} 
                      alt={college.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className={`w-full h-full flex items-center justify-center ${
                      index === 0 ? "bg-gradient-to-br from-yellow-400 to-yellow-600" :
                      index === 1 ? "bg-gradient-to-br from-gray-300 to-gray-500" :
                      index === 2 ? "bg-gradient-to-br from-amber-600 to-amber-800" :
                      "bg-secondary"
                    }`}>
                      <div className="text-center">
                        <div className={`text-3xl font-bold ${index < 3 ? "text-white" : "text-foreground"}`}>
                          #{index + 1}
                        </div>
                        {index < 3 && <Trophy className={`w-5 h-5 mx-auto mt-1 ${index < 3 ? "text-white/80" : ""}`} />}
                      </div>
                    </div>
                  )}
                  {/* Rank Badge Overlay */}
                  <div className="absolute top-2 left-2 z-10">
                    <Badge className={`text-xs font-bold ${
                      index === 0 ? "bg-yellow-500 text-white" :
                      index === 1 ? "bg-gray-500 text-white" :
                      index === 2 ? "bg-amber-700 text-white" :
                      "bg-primary text-primary-foreground"
                    }`}>
                      #{index + 1}
                    </Badge>
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
                        <Badge variant="outline">{college.type}</Badge>
                      </div>

                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {college.city}, {college.state}
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-accent fill-accent" />
                          <span className="font-semibold text-foreground">{college.rating}</span>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-1.5">
                        {college.courses.slice(0, 5).map((course) => (
                          <Badge key={course} variant="secondary" className="text-xs">
                            {course}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="flex flex-wrap lg:flex-nowrap gap-6 items-center">
                      <div className="text-center">
                        <div className="text-sm text-muted-foreground">Avg. Fees</div>
                        <div className="font-bold text-lg">{formatCurrency(college.avgFees)}</div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm text-muted-foreground">Avg. Package</div>
                        <div className="font-bold text-lg text-success flex items-center gap-1">
                          <TrendingUp className="w-4 h-4" />
                          {formatCurrency(college.avgPackage)}
                        </div>
                      </div>
                      <ChevronRight className="w-6 h-6 text-muted-foreground group-hover:text-primary transition-colors hidden lg:block" />
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </Layout>
  );
}
