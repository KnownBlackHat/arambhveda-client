import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Search, Filter, Star, MapPin, ChevronRight, X, SlidersHorizontal } from "lucide-react";
import { getCollegeImage } from "@/utils/collegeImages";
import { useColleges, DbCollege } from "@/hooks/useColleges";
import { formatCurrency } from "@/utils/formatCurrency";
import { states } from "@/data/colleges";
import { Skeleton } from "@/components/ui/skeleton";

export default function Colleges() {
  const [searchParams] = useSearchParams();
  const initialSearch = searchParams.get("search") || "";
  const initialCategory = searchParams.get("category") || "";

  const [search, setSearch] = useState(initialSearch);
  const [debouncedSearch, setDebouncedSearch] = useState(initialSearch);
  const [selectedStates, setSelectedStates] = useState<string[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState("rating");
  const [showFilters, setShowFilters] = useState(false);
  const [page, setPage] = useState(0);
  const pageSize = 50;

  // Debounce search
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(null);
  const handleSearchChange = (value: string) => {
    setSearch(value);
    if (searchTimeout) clearTimeout(searchTimeout);
    const timeout = setTimeout(() => {
      setDebouncedSearch(value);
      setPage(0);
    }, 300);
    setSearchTimeout(timeout);
  };

  const { data, isLoading } = useColleges({
    search: debouncedSearch || undefined,
    state: selectedStates.length === 1 ? selectedStates[0] : undefined,
    sortBy,
    limit: pageSize,
    offset: page * pageSize,
  });

  const colleges = data?.colleges || [];
  const total = data?.total || 0;

  const collegeTypes = ["Government", "Private", "Autonomous", "Deemed University", "Central University", "State University"];

  const toggleState = (state: string) => {
    setSelectedStates((prev) =>
      prev.includes(state) ? prev.filter((s) => s !== state) : [...prev, state]
    );
    setPage(0);
  };

  const toggleType = (type: string) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
    setPage(0);
  };

  const clearFilters = () => {
    setSelectedStates([]);
    setSelectedTypes([]);
    setSearch("");
    setDebouncedSearch("");
    setPage(0);
  };

  return (
    <Layout>
      {/* Header */}
      <div className="bg-secondary/50 py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            {initialCategory
              ? `${initialCategory.charAt(0).toUpperCase() + initialCategory.slice(1)} Colleges in India`
              : "All Colleges in India"}
          </h1>
          <p className="text-muted-foreground">
            Explore {total.toLocaleString()} colleges {debouncedSearch ? "matching your criteria" : "across India"}
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <aside className={`lg:w-72 ${showFilters ? "block" : "hidden lg:block"}`}>
            <div className="bg-card rounded-xl border border-border p-5 sticky top-24">
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-semibold flex items-center gap-2">
                  <Filter className="w-4 h-4" /> Filters
                </h3>
                {(selectedStates.length > 0 || selectedTypes.length > 0) && (
                  <button onClick={clearFilters} className="text-sm text-primary hover:underline">
                    Clear All
                  </button>
                )}
              </div>

              {/* State Filter */}
              <div className="mb-6">
                <h4 className="text-sm font-medium mb-3">State</h4>
                <div className="max-h-48 overflow-y-auto space-y-2">
                  {states.map((state) => (
                    <label key={state} className="flex items-center gap-2 text-sm cursor-pointer">
                      <Checkbox
                        checked={selectedStates.includes(state)}
                        onCheckedChange={() => toggleState(state)}
                      />
                      {state}
                    </label>
                  ))}
                </div>
              </div>

              {/* Type Filter */}
              <div>
                <h4 className="text-sm font-medium mb-3">College Type</h4>
                <div className="space-y-2">
                  {collegeTypes.map((type) => (
                    <label key={type} className="flex items-center gap-2 text-sm cursor-pointer">
                      <Checkbox
                        checked={selectedTypes.includes(type)}
                        onCheckedChange={() => toggleType(type)}
                      />
                      {type}
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            {/* Search and Sort Bar */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search colleges, courses..."
                  value={search}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-3">
                <Button variant="outline" className="lg:hidden" onClick={() => setShowFilters(!showFilters)}>
                  <SlidersHorizontal className="w-4 h-4 mr-2" />
                  Filters
                </Button>
                <Select value={sortBy} onValueChange={(v) => { setSortBy(v); setPage(0); }}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="rating">Highest Rating</SelectItem>
                    <SelectItem value="package">Highest Package</SelectItem>
                    <SelectItem value="fees-low">Fees: Low to High</SelectItem>
                    <SelectItem value="fees-high">Fees: High to Low</SelectItem>
                    <SelectItem value="name">Name A-Z</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Active Filters */}
            {(selectedStates.length > 0 || selectedTypes.length > 0) && (
              <div className="flex flex-wrap gap-2 mb-6">
                {selectedStates.map((state) => (
                  <Badge key={state} variant="secondary" className="cursor-pointer gap-1" onClick={() => toggleState(state)}>
                    {state} <X className="w-3 h-3" />
                  </Badge>
                ))}
                {selectedTypes.map((type) => (
                  <Badge key={type} variant="secondary" className="cursor-pointer gap-1" onClick={() => toggleType(type)}>
                    {type} <X className="w-3 h-3" />
                  </Badge>
                ))}
              </div>
            )}

            {/* College List */}
            <div className="space-y-4">
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="bg-card rounded-xl border border-border p-5">
                    <div className="flex flex-col md:flex-row gap-5">
                      <Skeleton className="w-full md:w-32 h-24 rounded-lg" />
                      <div className="flex-1 space-y-3">
                        <Skeleton className="h-6 w-3/4" />
                        <Skeleton className="h-4 w-1/2" />
                        <Skeleton className="h-4 w-full" />
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <>
                  {colleges.map((college, index) => (
                    <CollegeCard key={college.id} college={college} rank={page * pageSize + index + 1} />
                  ))}

                  {colleges.length === 0 && (
                    <div className="text-center py-12">
                      <p className="text-muted-foreground text-lg">No colleges found matching your criteria</p>
                      <Button variant="outline" onClick={clearFilters} className="mt-4">
                        Clear Filters
                      </Button>
                    </div>
                  )}
                </>
              )}
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
          </main>
        </div>
      </div>
    </Layout>
  );
}

function CollegeCard({ college, rank }: { college: DbCollege; rank: number }) {
  return (
    <Link
      to={`/college/${college.id}`}
      className="block bg-card rounded-xl border border-border p-5 card-hover group"
    >
      <div className="flex flex-col md:flex-row gap-5">
        {/* College Image */}
        <div className="w-full md:w-32 h-24 rounded-lg overflow-hidden flex-shrink-0">
          <img src={college.image_url || getCollegeImage(college.id)} alt={college.name} className="w-full h-full object-cover" />
        </div>

        {/* Content */}
        <div className="flex-1">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 mb-3">
            <div>
              <h3 className="font-semibold text-lg text-foreground group-hover:text-primary transition-colors">
                {college.name}
              </h3>
              <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                <MapPin className="w-3 h-3" />
                {college.city || "India"}{college.state ? `, ${college.state}` : ""}
                {college.type && (
                  <>
                    <span className="mx-1">•</span>
                    <Badge variant="outline" className="text-xs">{college.type}</Badge>
                  </>
                )}
              </div>
            </div>
            {college.rating && (
              <div className="flex items-center gap-1 bg-secondary px-2 py-1 rounded-lg">
                <Star className="w-4 h-4 text-accent fill-accent" />
                <span className="font-semibold">{college.rating}</span>
              </div>
            )}
          </div>

          {college.courses && college.courses.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-4">
              {college.courses.slice(0, 5).map((course) => (
                <Badge key={course} variant="secondary" className="text-xs font-normal">
                  {course}
                </Badge>
              ))}
              {college.courses.length > 5 && (
                <Badge variant="secondary" className="text-xs font-normal">
                  +{college.courses.length - 5}
                </Badge>
              )}
            </div>
          )}

          <div className="flex flex-wrap items-center gap-6 text-sm">
            {college.avg_fees != null && (
              <div>
                <span className="text-muted-foreground">Avg. Fees:</span>{" "}
                <span className="font-semibold text-foreground">{formatCurrency(college.avg_fees)}/yr</span>
              </div>
            )}
            {college.avg_package != null && (
              <div>
                <span className="text-muted-foreground">Avg. Package:</span>{" "}
                <span className="font-semibold text-success">{formatCurrency(college.avg_package)}</span>
              </div>
            )}
            {college.highest_package != null && (
              <div>
                <span className="text-muted-foreground">Highest:</span>{" "}
                <span className="font-semibold text-foreground">{formatCurrency(college.highest_package)}</span>
              </div>
            )}
            {college.category && (
              <Badge variant="outline" className="text-xs">{college.category}</Badge>
            )}
            <ChevronRight className="w-5 h-5 text-muted-foreground ml-auto group-hover:text-primary transition-colors" />
          </div>
        </div>
      </div>
    </Link>
  );
}
