import { Link } from "react-router-dom";
import { ArrowRight, GitCompare, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const features = [
  "Compare up to 4 colleges side by side",
  "Detailed fee structure comparison",
  "Placement statistics comparison",
  "Infrastructure & facilities",
  "Course curriculum differences",
  "Admission process timeline",
];

export function CompareSection() {
  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div>
            <div className="inline-flex items-center gap-2 bg-secondary px-4 py-1.5 rounded-full text-sm font-medium text-secondary-foreground mb-4">
              <GitCompare className="w-4 h-4" />
              College Comparison Tool
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Compare Colleges <span className="text-gradient">Side by Side</span>
            </h2>
            <p className="text-muted-foreground mb-6">
              Make informed decisions by comparing multiple colleges across various parameters. 
              Our comprehensive comparison tool helps you evaluate fees, placements, infrastructure, 
              and more - all in one place.
            </p>

            <ul className="space-y-3 mb-8">
              {features.map((feature) => (
                <li key={feature} className="flex items-center gap-3 text-foreground">
                  <CheckCircle className="w-5 h-5 text-success flex-shrink-0" />
                  {feature}
                </li>
              ))}
            </ul>

            <Link to="/compare">
              <Button size="lg" className="gap-2 shadow-orange">
                Start Comparing <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>

          {/* Visual */}
          <div className="relative">
            <div className="bg-card rounded-2xl border border-border p-6 shadow-lg">
              {/* Mini comparison preview */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-secondary/50 rounded-xl p-4 text-center">
                  <div className="w-16 h-16 bg-primary/20 rounded-full mx-auto mb-3 flex items-center justify-center">
                    <span className="text-2xl font-bold text-primary">IIT</span>
                  </div>
                  <h4 className="font-semibold text-sm">IIT Bombay</h4>
                  <p className="text-xs text-muted-foreground">Mumbai, Maharashtra</p>
                </div>
                <div className="bg-secondary/50 rounded-xl p-4 text-center">
                  <div className="w-16 h-16 bg-accent/20 rounded-full mx-auto mb-3 flex items-center justify-center">
                    <span className="text-2xl font-bold text-accent-foreground">IIT</span>
                  </div>
                  <h4 className="font-semibold text-sm">IIT Delhi</h4>
                  <p className="text-xs text-muted-foreground">New Delhi, Delhi</p>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                <div className="flex justify-between items-center p-3 bg-secondary/30 rounded-lg">
                  <span className="text-sm text-muted-foreground">Avg. Package</span>
                  <div className="flex gap-8">
                    <span className="font-semibold text-sm">₹21 LPA</span>
                    <span className="font-semibold text-sm">₹19 LPA</span>
                  </div>
                </div>
                <div className="flex justify-between items-center p-3 bg-secondary/30 rounded-lg">
                  <span className="text-sm text-muted-foreground">Rating</span>
                  <div className="flex gap-8">
                    <span className="font-semibold text-sm">4.9 ⭐</span>
                    <span className="font-semibold text-sm">4.9 ⭐</span>
                  </div>
                </div>
                <div className="flex justify-between items-center p-3 bg-secondary/30 rounded-lg">
                  <span className="text-sm text-muted-foreground">Fees</span>
                  <div className="flex gap-8">
                    <span className="font-semibold text-sm">₹2.5L/yr</span>
                    <span className="font-semibold text-sm">₹2.3L/yr</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Decorative elements */}
            <div className="absolute -z-10 -top-4 -right-4 w-full h-full bg-primary/10 rounded-2xl" />
          </div>
        </div>
      </div>
    </section>
  );
}
