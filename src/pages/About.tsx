import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
  GraduationCap,
  Users,
  Building,
  Award,
  Target,
  Heart,
  Lightbulb,
  Phone,
  Mail,
  MapPin,
  Shield,
  CheckCircle,
} from "lucide-react";
import logo from "@/assets/logo.png";

const stats = [
  { value: "15,000+", label: "Colleges Listed", icon: Building },
  { value: "2M+", label: "Students Helped", icon: Users },
  { value: "500+", label: "Courses Available", icon: GraduationCap },
  { value: "50+", label: "Expert Counselors", icon: Award },
];

const values = [
  {
    icon: Target,
    title: "Our Mission",
    description:
      "To democratize access to quality education information and help every student in India find their perfect college — regardless of background, location, or financial status. We aim to eliminate misinformation and provide verified, authentic college data.",
  },
  {
    icon: Lightbulb,
    title: "Our Vision",
    description:
      "To become India's most trusted and comprehensive education platform, empowering millions of students across tier-1, tier-2, and tier-3 cities to make informed, confident decisions about their academic future.",
  },
  {
    icon: Heart,
    title: "Our Values",
    description:
      "Integrity, transparency, and a student-first approach guide everything we do. We are committed to providing unbiased, verified data — never accepting paid rankings or sponsored listings that could mislead students.",
  },
];

const trustPoints = [
  "100% verified college data from official sources",
  "No paid rankings or biased listings",
  "Free counselling for all students",
  "Real placement data, not inflated claims",
  "Student reviews verified before publishing",
  "Regular data updates and accuracy checks",
];

export default function About() {
  return (
    <Layout>
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary/10 to-accent/10 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <img src={logo} alt="Aarambh Veda" className="h-24 mx-auto mb-6" />
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              The Beginning of <span className="text-gradient">New Education</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Aarambh Veda is India's leading education consultancy platform, founded by{" "}
              <strong className="text-foreground">Vaibhav Dubey</strong> from Mirzapur, Uttar Pradesh — 
              dedicated to helping students discover, compare, and choose the perfect college for their future.
            </p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="py-12 bg-card border-y border-border">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <stat.icon className="w-10 h-10 text-primary mx-auto mb-3" />
                <div className="text-3xl font-bold text-foreground">{stat.value}</div>
                <div className="text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Story Section */}
      <div className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-foreground mb-6 text-center">Our Story</h2>
            <div className="prose prose-lg mx-auto text-muted-foreground">
              <p>
                Founded by <strong className="text-foreground">Vaibhav Dubey</strong> from Mirzapur, 
                Uttar Pradesh, Aarambh Veda was born out of a firsthand observation: finding 
                the right college in India is overwhelming. With thousands of institutions, 
                varying fees, different admission processes, and conflicting information, 
                students often make uninformed decisions that shape their entire careers.
              </p>
              <p className="mt-4">
                Having experienced this confusion growing up in a tier-2 city, Vaibhav set out to create 
                a comprehensive, trustworthy platform that brings all college information under one roof — 
                accessible to students from every corner of India. Today, Aarambh Veda has helped over 
                2 million students find their dream colleges.
              </p>
              <p className="mt-4">
                From IITs and IIMs to regional colleges, from engineering to arts, we cover 
                every institution and every course that matters. Our mission is simple: 
                to ensure that every student has access to accurate, unbiased information 
                to make the best decision for their future.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Platform Purpose & Trust */}
      <div className="py-16 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-4">
                Why Trust <span className="text-gradient">Aarambh Veda</span>?
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                We believe in data authenticity and transparency. Every piece of information on our 
                platform is verified from official sources before being published.
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-card rounded-2xl border border-border p-8">
                <Shield className="w-12 h-12 text-primary mb-4" />
                <h3 className="text-xl font-bold text-foreground mb-4">Data Authenticity Commitment</h3>
                <ul className="space-y-3">
                  {trustPoints.map((point) => (
                    <li key={point} className="flex items-start gap-3 text-muted-foreground">
                      <CheckCircle className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="space-y-6">
                {values.map((value) => (
                  <div
                    key={value.title}
                    className="bg-card rounded-2xl border border-border p-6"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                        <value.icon className="w-5 h-5 text-primary" />
                      </div>
                      <h3 className="text-lg font-bold text-foreground">{value.title}</h3>
                    </div>
                    <p className="text-muted-foreground text-sm">{value.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Founder Section */}
      <div className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-foreground mb-8 text-center">
              Meet the Founder
            </h2>
            <div className="bg-card rounded-2xl border border-border p-8 flex flex-col md:flex-row items-center gap-8">
              <div className="w-32 h-32 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-4xl font-bold text-primary">VD</span>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-foreground mb-1">Vaibhav Dubey</h3>
                <p className="text-primary font-medium mb-3">Founder & CEO, Aarambh Veda</p>
                <p className="text-muted-foreground">
                  Hailing from Mirzapur, Uttar Pradesh, Vaibhav Dubey founded Aarambh Veda with the 
                  vision of making quality education information accessible to every student in India. 
                  His personal experience of navigating the complex Indian education landscape inspired 
                  him to build a platform that students can trust completely.
                </p>
                <div className="flex items-center gap-2 mt-3 text-sm text-muted-foreground">
                  <MapPin className="w-4 h-4" />
                  Mirzapur, Uttar Pradesh, India
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contact CTA */}
      <div className="py-16 bg-gradient-primary">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Start Your Journey?
          </h2>
          <p className="text-white/90 mb-8 max-w-2xl mx-auto">
            Get in touch with our expert counselors for free guidance on your college admission.
          </p>
          <div className="flex flex-wrap justify-center gap-6 mb-8">
            <div className="flex items-center gap-2 text-white">
              <Phone className="w-5 h-5" />
              +91 9643689903
            </div>
            <div className="flex items-center gap-2 text-white">
              <Mail className="w-5 h-5" />
              info@aarambhveda.com
            </div>
            <div className="flex items-center gap-2 text-white">
              <MapPin className="w-5 h-5" />
              Mirzapur, Uttar Pradesh, India
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/contact">
              <Button size="lg" variant="secondary" className="text-primary">
                Contact Us
              </Button>
            </Link>
            <Link to="/colleges">
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white bg-transparent hover:bg-white/10"
              >
                Explore Colleges
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
}
