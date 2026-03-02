import { useParams, Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { getCollegeImage } from "@/utils/collegeImages";
import { useCollege } from "@/hooks/useColleges";
import { formatCurrency } from "@/utils/formatCurrency";
import {
  Star, MapPin, Calendar, Building2, Award, Users, Briefcase, BookOpen,
  CheckCircle, Phone, ArrowLeft, Download, Share2, Heart, TrendingUp,
} from "lucide-react";
import { LeadCaptureForm } from "@/components/lead/LeadCaptureForm";

export default function CollegeDetail() {
  const { id } = useParams();
  const { data: college, isLoading } = useCollege(Number(id));

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 space-y-6">
          <Skeleton className="h-48 w-full rounded-xl" />
          <Skeleton className="h-8 w-1/2" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      </Layout>
    );
  }

  if (!college) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">College Not Found</h1>
          <Link to="/colleges">
            <Button>Back to Colleges</Button>
          </Link>
        </div>
      </Layout>
    );
  }

  const highlights = [
    ...(college.established ? [{ icon: Calendar, label: "Established", value: college.established.toString() }] : []),
    ...(college.campus_area ? [{ icon: Building2, label: "Campus Area", value: `${college.campus_area} acres` }] : []),
    ...(college.type ? [{ icon: Users, label: "College Type", value: college.type }] : []),
    ...(college.rating ? [{ icon: Award, label: "Rating", value: `${college.rating}/5` }] : []),
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary/10 to-accent/10">
        <div className="container mx-auto px-4 py-8">
          <Link to="/colleges" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-6">
            <ArrowLeft className="w-4 h-4" /> Back to Colleges
          </Link>

          <div className="flex flex-col lg:flex-row gap-8">
            <div className="w-full lg:w-48 h-48 rounded-xl border border-border overflow-hidden flex-shrink-0">
              <img src={college.image_url || getCollegeImage(college.id)} alt={college.name} className="w-full h-full object-cover" />
            </div>

            <div className="flex-1">
              <div className="flex flex-wrap items-start gap-3 mb-3">
                {college.type && <Badge className="bg-primary">{college.type}</Badge>}
                {college.approvals?.slice(0, 3).map((approval) => (
                  <Badge key={approval} variant="outline">{approval}</Badge>
                ))}
                {college.category && <Badge variant="secondary">{college.category}</Badge>}
              </div>

              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">{college.name}</h1>

              <div className="flex items-center gap-4 text-muted-foreground mb-4">
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {college.city || college.address || "India"}{college.state ? `, ${college.state}` : ""}
                </div>
                {college.rating && (
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-accent fill-accent" />
                    <span className="font-semibold text-foreground">{college.rating}</span>
                  </div>
                )}
              </div>

              {college.description && (
                <p className="text-muted-foreground mb-6 max-w-2xl">{college.description}</p>
              )}

              <div className="flex flex-wrap gap-3">
                <Button size="lg" className="shadow-orange gap-2">
                  <Phone className="w-4 h-4" /> Get Free Counselling
                </Button>
                <Button variant="outline" size="lg" className="gap-2">
                  <Download className="w-4 h-4" /> Download Brochure
                </Button>
                <Button variant="outline" size="lg" className="gap-2">
                  <Heart className="w-4 h-4" /> Save
                </Button>
                <Button variant="ghost" size="lg">
                  <Share2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {highlights.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
              {highlights.map((item) => (
                <div key={item.label} className="bg-card rounded-xl border border-border p-4 text-center">
                  <item.icon className="w-6 h-6 text-primary mx-auto mb-2" />
                  <div className="text-lg font-semibold text-foreground">{item.value}</div>
                  <div className="text-sm text-muted-foreground">{item.label}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="w-full justify-start overflow-x-auto">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            {college.courses && college.courses.length > 0 && <TabsTrigger value="courses">Courses & Fees</TabsTrigger>}
            {college.admission_exams && college.admission_exams.length > 0 && <TabsTrigger value="admission">Admission</TabsTrigger>}
            {(college.avg_package || college.highest_package) && <TabsTrigger value="placements">Placements</TabsTrigger>}
            {college.infrastructure && college.infrastructure.length > 0 && <TabsTrigger value="infrastructure">Infrastructure</TabsTrigger>}
          </TabsList>

          <TabsContent value="overview" className="space-y-8">
            <div className="bg-card rounded-xl border border-border p-6">
              <h2 className="text-xl font-semibold mb-4">About {college.name}</h2>
              <p className="text-muted-foreground mb-4">{college.description || `${college.name} is an educational institution located in ${college.city || "India"}.`}</p>
              {college.established && (
                <p className="text-muted-foreground">
                  Established in {college.established}, {college.name} has been a leading institution
                  {college.courses ? ` offering ${college.courses.slice(0, 3).join(", ")} and more` : ""}.
                  {college.campus_area ? ` The campus spans across ${college.campus_area} acres.` : ""}
                </p>
              )}
              {college.pincode && (
                <p className="text-sm text-muted-foreground mt-2">Pincode: {college.pincode}</p>
              )}
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {college.approvals && college.approvals.length > 0 && (
                <div className="bg-card rounded-xl border border-border p-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Award className="w-5 h-5 text-primary" /> Approvals & Accreditations
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {college.approvals.map((approval) => (
                      <Badge key={approval} variant="secondary" className="text-sm">
                        <CheckCircle className="w-3 h-3 mr-1" /> {approval}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {college.admission_exams && college.admission_exams.length > 0 && (
                <div className="bg-card rounded-xl border border-border p-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-primary" /> Entrance Exams Accepted
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {college.admission_exams.map((exam) => (
                      <Badge key={exam} variant="outline" className="text-sm">{exam}</Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </TabsContent>

          {college.courses && college.courses.length > 0 && (
            <TabsContent value="courses" className="space-y-6">
              <div className="bg-card rounded-xl border border-border p-6">
                <h2 className="text-xl font-semibold mb-4">Courses Offered</h2>
                <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {college.courses.map((course) => (
                    <div key={course} className="bg-secondary/50 rounded-lg p-4 flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">{course}</h4>
                        <p className="text-sm text-muted-foreground">4 Years</p>
                      </div>
                      {college.avg_fees != null && (
                        <div className="text-right">
                          <p className="font-semibold">{formatCurrency(college.avg_fees)}</p>
                          <p className="text-xs text-muted-foreground">per year</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
          )}

          {college.admission_exams && college.admission_exams.length > 0 && (
            <TabsContent value="admission" className="space-y-6">
              <div className="bg-card rounded-xl border border-border p-6">
                <h2 className="text-xl font-semibold mb-4">Admission Process</h2>
                <div className="space-y-4">
                  <div className="flex gap-4">
                    <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">1</div>
                    <div>
                      <h4 className="font-medium">Entrance Exam</h4>
                      <p className="text-sm text-muted-foreground">Qualify in {college.admission_exams.join(" / ")}</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">2</div>
                    <div>
                      <h4 className="font-medium">Counselling</h4>
                      <p className="text-sm text-muted-foreground">Participate in the counselling process based on rank</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">3</div>
                    <div>
                      <h4 className="font-medium">Document Verification</h4>
                      <p className="text-sm text-muted-foreground">Submit required documents for verification</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">4</div>
                    <div>
                      <h4 className="font-medium">Fee Payment & Enrollment</h4>
                      <p className="text-sm text-muted-foreground">Pay the admission fee and complete enrollment</p>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          )}

          {(college.avg_package || college.highest_package) && (
            <TabsContent value="placements" className="space-y-6">
              <div className="grid md:grid-cols-3 gap-6">
                {college.highest_package != null && (
                  <div className="bg-card rounded-xl border border-border p-6 text-center">
                    <TrendingUp className="w-10 h-10 text-success mx-auto mb-3" />
                    <div className="text-3xl font-bold text-success">{formatCurrency(college.highest_package)}</div>
                    <div className="text-muted-foreground">Highest Package</div>
                  </div>
                )}
                {college.avg_package != null && (
                  <div className="bg-card rounded-xl border border-border p-6 text-center">
                    <Briefcase className="w-10 h-10 text-primary mx-auto mb-3" />
                    <div className="text-3xl font-bold text-primary">{formatCurrency(college.avg_package)}</div>
                    <div className="text-muted-foreground">Average Package</div>
                  </div>
                )}
                <div className="bg-card rounded-xl border border-border p-6 text-center">
                  <Users className="w-10 h-10 text-accent mx-auto mb-3" />
                  <div className="text-3xl font-bold text-foreground">95%</div>
                  <div className="text-muted-foreground">Placement Rate</div>
                </div>
              </div>

              {college.top_recruiters && college.top_recruiters.length > 0 && (
                <div className="bg-card rounded-xl border border-border p-6">
                  <h3 className="text-lg font-semibold mb-4">Top Recruiters</h3>
                  <div className="flex flex-wrap gap-3">
                    {college.top_recruiters.map((recruiter) => (
                      <div key={recruiter} className="bg-secondary px-4 py-2 rounded-lg font-medium text-sm">{recruiter}</div>
                    ))}
                  </div>
                </div>
              )}
            </TabsContent>
          )}

          {college.infrastructure && college.infrastructure.length > 0 && (
            <TabsContent value="infrastructure" className="space-y-6">
              <div className="bg-card rounded-xl border border-border p-6">
                <h2 className="text-xl font-semibold mb-4">Campus Facilities</h2>
                <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {college.infrastructure.map((facility) => (
                    <div key={facility} className="flex items-center gap-3 p-3 bg-secondary/50 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-success flex-shrink-0" />
                      <span>{facility}</span>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
          )}
        </Tabs>

        {/* Lead Capture Form */}
        <div className="mt-12 bg-card rounded-2xl border border-border p-6 md:p-8 max-w-2xl mx-auto">
          <LeadCaptureForm
            sourcePage={`college_${college.id}`}
            heading={`Interested in ${college.name}?`}
            subheading="Fill the form below and our counsellor will help you with admissions, fees, and more."
            
          />
        </div>
      </div>
    </Layout>
  );
}
