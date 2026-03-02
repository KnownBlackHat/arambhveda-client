import { Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LeadCaptureForm } from "@/components/lead/LeadCaptureForm";

export function CTASection() {
  return (
    <section className="py-16 bg-gradient-primary">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left - Text */}
          <div className="text-center md:text-left">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Need Help Choosing the Right College?
            </h2>
            <p className="text-white/90 text-lg mb-8 max-w-lg">
              Get free counselling from our expert advisors. We'll help you find
              the perfect college based on your preferences, budget, and career goals.
            </p>

            <a href="tel:+919876543210">
              <Button size="lg" variant="outline" className="gap-2 border-white text-white hover:bg-white/10">
                <Phone className="w-5 h-5" />
                Call: +91 98765 43210
              </Button>
            </a>

            <div className="mt-8 flex flex-wrap justify-center md:justify-start gap-8 text-white/80 text-sm">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-white rounded-full" />
                Free Expert Guidance
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-white rounded-full" />
                Personalized Recommendations
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-white rounded-full" />
                Application Support
              </div>
            </div>
          </div>

          {/* Right - Form */}
          <div className="bg-card rounded-2xl p-6 shadow-lg border border-border">
            <LeadCaptureForm sourcePage="homepage_cta" />
          </div>
        </div>
      </div>
    </section>
  );
}
