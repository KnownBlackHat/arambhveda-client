import { Link } from "react-router-dom";
import { ArrowRight, Phone, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CTASection() {
  return (
    <section className="py-16 bg-gradient-primary">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
          Need Help Choosing the Right College?
        </h2>
        <p className="text-white/90 text-lg mb-8 max-w-2xl mx-auto">
          Get free counselling from our expert advisors. We'll help you find 
          the perfect college based on your preferences, budget, and career goals.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/register">
            <Button size="lg" variant="secondary" className="gap-2 text-primary">
              <MessageCircle className="w-5 h-5" />
              Get Free Counselling
            </Button>
          </Link>
          <a href="tel:+919643689903">
            <Button size="lg" variant="outline" className="gap-2 border-white text-black hover:bg-white/10">
              <Phone className="w-5 h-5" />
              Call: +91 96436 89903
            </Button>
          </a>
        </div>

        <div className="mt-8 flex flex-wrap justify-center gap-8 text-white/80 text-sm">
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
    </section>
  );
}
