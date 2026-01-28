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
      "To democratize access to quality education information and help every student find their perfect college, regardless of their background.",
  },
  {
    icon: Lightbulb,
    title: "Our Vision",
    description:
      "To become India's most trusted education platform, empowering millions of students to make informed decisions about their future.",
  },
  {
    icon: Heart,
    title: "Our Values",
    description:
      "Integrity, transparency, and student-first approach guide everything we do. We believe every student deserves access to accurate information.",
  },
];

const team = [
  { name: "Dr. Ananya Sharma", role: "Founder & CEO", expertise: "20+ years in Education" },
  { name: "Rajesh Kumar", role: "Head of Counseling", expertise: "Former IIT Professor" },
  { name: "Priya Mehta", role: "Director of Content", expertise: "Education Journalist" },
  { name: "Vikram Singh", role: "Technology Head", expertise: "Ex-Google Engineer" },
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
              Aarambh Veda is India's leading education consultancy platform, dedicated to 
              helping students discover, compare, and choose the perfect college for their future.
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
                Founded in 2020, Aarambh Veda was born out of a simple observation: finding 
                the right college in India is overwhelming. With thousands of institutions, 
                varying fees, different admission processes, and conflicting information, 
                students often make uninformed decisions.
              </p>
              <p className="mt-4">
                Our founders, having experienced this confusion firsthand, set out to create 
                a comprehensive platform that brings all college information under one roof. 
                Today, Aarambh Veda has helped over 2 million students find their dream colleges.
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

      {/* Values */}
      <div className="py-16 bg-secondary/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-foreground mb-12 text-center">
            What Drives Us
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {values.map((value) => (
              <div
                key={value.title}
                className="bg-card rounded-2xl border border-border p-8 text-center"
              >
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <value.icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">{value.title}</h3>
                <p className="text-muted-foreground">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Team */}
      <div className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-foreground mb-4 text-center">
            Meet Our Leadership
          </h2>
          <p className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
            Our team of education experts and technology professionals work tirelessly 
            to make your college search easier.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((member) => (
              <div
                key={member.name}
                className="bg-card rounded-xl border border-border p-6 text-center"
              >
                <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-primary">
                    {member.name.split(" ").map((n) => n[0]).join("")}
                  </span>
                </div>
                <h3 className="font-semibold text-foreground">{member.name}</h3>
                <p className="text-primary text-sm">{member.role}</p>
                <p className="text-sm text-muted-foreground mt-1">{member.expertise}</p>
              </div>
            ))}
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
              support@aarambhveda.com
            </div>
            <div className="flex items-center gap-2 text-white">
              <MapPin className="w-5 h-5" />
              New Delhi, India
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
                className="border-white text-white hover:bg-white/10"
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
