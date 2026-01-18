import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { colleges, formatCurrency, College } from "@/data/colleges";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  X,
  Plus,
  Star,
  MapPin,
  Calendar,
  Building2,
  Award,
  Briefcase,
  TrendingUp,
  CheckCircle,
  XCircle,
  GitCompare,
} from "lucide-react";

export default function Compare() {
  const [selectedColleges, setSelectedColleges] = useState<College[]>([
    colleges[0],
    colleges[1],
  ]);

  const addCollege = (collegeId: string) => {
    const college = colleges.find((c) => c.id === Number(collegeId));
    if (college && !selectedColleges.find((c) => c.id === college.id)) {
      setSelectedColleges([...selectedColleges, college]);
    }
  };

  const removeCollege = (id: number) => {
    setSelectedColleges(selectedColleges.filter((c) => c.id !== id));
  };

  const availableColleges = colleges.filter(
    (c) => !selectedColleges.find((sc) => sc.id === c.id)
  );

  const ComparisonRow = ({
    label,
    getValue,
    highlight = false,
  }: {
    label: string;
    getValue: (c: College) => React.ReactNode;
    highlight?: boolean;
  }) => (
    <tr className={highlight ? "bg-secondary/30" : ""}>
      <td className="p-4 font-medium text-muted-foreground border-r border-border sticky left-0 bg-card">
        {label}
      </td>
      {selectedColleges.map((college) => (
        <td key={college.id} className="p-4 text-center min-w-[200px]">
          {getValue(college)}
        </td>
      ))}
    </tr>
  );

  return (
    <Layout>
      {/* Header */}
      <div className="bg-secondary/50 py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-3 mb-2">
            <GitCompare className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-bold text-foreground">Compare Colleges</h1>
          </div>
          <p className="text-muted-foreground">
            Compare up to 4 colleges side by side to make an informed decision
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* College Selection */}
        <div className="flex flex-wrap gap-4 mb-8">
          {selectedColleges.map((college) => (
            <div
              key={college.id}
              className="bg-card rounded-xl border border-border p-4 flex items-center gap-3"
            >
              <div className="w-12 h-12 bg-secondary rounded-lg flex items-center justify-center">
                <span className="text-lg font-bold text-primary/50">
                  {college.name.charAt(0)}
                </span>
              </div>
              <div>
                <h3 className="font-semibold text-sm">{college.name}</h3>
                <p className="text-xs text-muted-foreground">
                  {college.city}, {college.state}
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="ml-2"
                onClick={() => removeCollege(college.id)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          ))}

          {selectedColleges.length < 4 && (
            <Select onValueChange={addCollege}>
              <SelectTrigger className="w-[280px]">
                <Plus className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Add college to compare" />
              </SelectTrigger>
              <SelectContent>
                {availableColleges.map((college) => (
                  <SelectItem key={college.id} value={college.id.toString()}>
                    {college.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>

        {/* Comparison Table */}
        {selectedColleges.length >= 2 ? (
          <div className="bg-card rounded-xl border border-border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-secondary/50">
                    <th className="p-4 text-left font-semibold sticky left-0 bg-secondary/50 min-w-[160px]">
                      Criteria
                    </th>
                    {selectedColleges.map((college) => (
                      <th key={college.id} className="p-4 text-center min-w-[200px]">
                        <div className="font-semibold">{college.name}</div>
                        <div className="flex items-center justify-center gap-1 text-sm text-muted-foreground mt-1">
                          <Star className="w-3 h-3 text-accent fill-accent" />
                          {college.rating}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  <ComparisonRow
                    label="Location"
                    getValue={(c) => (
                      <div className="flex items-center justify-center gap-1">
                        <MapPin className="w-4 h-4 text-muted-foreground" />
                        {c.city}, {c.state}
                      </div>
                    )}
                  />
                  <ComparisonRow
                    label="Type"
                    getValue={(c) => <Badge variant="secondary">{c.type}</Badge>}
                    highlight
                  />
                  <ComparisonRow
                    label="Established"
                    getValue={(c) => (
                      <div className="flex items-center justify-center gap-1">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        {c.established}
                      </div>
                    )}
                  />
                  <ComparisonRow
                    label="Campus Area"
                    getValue={(c) => (
                      <div className="flex items-center justify-center gap-1">
                        <Building2 className="w-4 h-4 text-muted-foreground" />
                        {c.campusArea} acres
                      </div>
                    )}
                    highlight
                  />
                  <ComparisonRow
                    label="Average Fees"
                    getValue={(c) => (
                      <span className="font-semibold">{formatCurrency(c.avgFees)}/yr</span>
                    )}
                  />
                  <ComparisonRow
                    label="Average Package"
                    getValue={(c) => (
                      <span className="font-semibold text-success">
                        {formatCurrency(c.avgPackage)}
                      </span>
                    )}
                    highlight
                  />
                  <ComparisonRow
                    label="Highest Package"
                    getValue={(c) => (
                      <span className="font-semibold text-primary">
                        {formatCurrency(c.highestPackage)}
                      </span>
                    )}
                  />
                  <ComparisonRow
                    label="Courses"
                    getValue={(c) => (
                      <div className="flex flex-wrap justify-center gap-1">
                        {c.courses.slice(0, 3).map((course) => (
                          <Badge key={course} variant="outline" className="text-xs">
                            {course}
                          </Badge>
                        ))}
                        {c.courses.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{c.courses.length - 3}
                          </Badge>
                        )}
                      </div>
                    )}
                    highlight
                  />
                  <ComparisonRow
                    label="Entrance Exams"
                    getValue={(c) => (
                      <div className="flex flex-wrap justify-center gap-1">
                        {c.admissionExams.map((exam) => (
                          <Badge key={exam} variant="secondary" className="text-xs">
                            {exam}
                          </Badge>
                        ))}
                      </div>
                    )}
                  />
                  <ComparisonRow
                    label="Approvals"
                    getValue={(c) => (
                      <div className="flex flex-wrap justify-center gap-1">
                        {c.approvals.slice(0, 2).map((approval) => (
                          <Badge key={approval} className="text-xs bg-success">
                            {approval}
                          </Badge>
                        ))}
                      </div>
                    )}
                    highlight
                  />
                  <ComparisonRow
                    label="Top Recruiters"
                    getValue={(c) => (
                      <div className="text-sm text-muted-foreground">
                        {c.topRecruiters.slice(0, 3).join(", ")}
                      </div>
                    )}
                  />
                  <ComparisonRow
                    label="Infrastructure"
                    getValue={(c) => (
                      <div className="space-y-1">
                        {c.infrastructure.slice(0, 4).map((item) => (
                          <div
                            key={item}
                            className="flex items-center justify-center gap-1 text-xs"
                          >
                            <CheckCircle className="w-3 h-3 text-success" />
                            {item}
                          </div>
                        ))}
                      </div>
                    )}
                    highlight
                  />
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="text-center py-16 bg-secondary/30 rounded-xl">
            <GitCompare className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Select Colleges to Compare</h3>
            <p className="text-muted-foreground mb-4">
              Add at least 2 colleges to start comparing
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
}
