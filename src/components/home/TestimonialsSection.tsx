import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Priya Sharma",
    college: "Admitted to IIT Delhi",
    text: "Aarambh Veda helped me compare different IITs and understand which one was best for my goals. The detailed placement data was incredibly helpful!",
    rating: 5,
    image: null,
  },
  {
    name: "Rahul Verma",
    college: "Admitted to IIM Ahmedabad",
    text: "The college comparison tool saved me so much time. I could easily see the differences between IIM-A, IIM-B, and IIM-C side by side.",
    rating: 5,
    image: null,
  },
  {
    name: "Ananya Patel",
    college: "Admitted to AIIMS Delhi",
    text: "As a medical aspirant, finding reliable information about colleges was tough. Aarambh Veda made my research so much easier!",
    rating: 5,
    image: null,
  },
];

export function TestimonialsSection() {
  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            What Students <span className="text-gradient">Say About Us</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Join thousands of students who found their dream college with our guidance
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-card rounded-xl border border-border p-6 relative card-hover"
            >
              <Quote className="absolute top-4 right-4 w-10 h-10 text-primary/10" />
              
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-accent fill-accent" />
                ))}
              </div>

              <p className="text-foreground mb-6 relative z-10">"{testimonial.text}"</p>

              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
                  <span className="text-lg font-bold text-primary">
                    {testimonial.name.charAt(0)}
                  </span>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">{testimonial.name}</h4>
                  <p className="text-sm text-success">{testimonial.college}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
