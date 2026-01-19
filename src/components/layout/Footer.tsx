import { Link } from "react-router-dom";
import { Facebook, Twitter, Instagram, Linkedin, Youtube, Mail, Phone, MapPin } from "lucide-react";
import logo from "@/assets/logo.png";

export function Footer() {
  return (
    <footer className="bg-foreground text-background">
      {/* Main Footer */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <img src={logo} alt="Aarambh Veda" className="h-16 w-auto bg-white p-2 rounded-lg" />
            <p className="text-sm opacity-80">
              Aarambh Veda - The Beginning of New Education. Your trusted partner
              for college admissions in India. We help students find the perfect
              college for their bright future.
            </p>
            <div className="flex gap-3">
              <a href="#" className="w-9 h-9 rounded-full bg-background/10 flex items-center justify-center hover:bg-primary transition-colors">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-background/10 flex items-center justify-center hover:bg-primary transition-colors">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-background/10 flex items-center justify-center hover:bg-primary transition-colors">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-background/10 flex items-center justify-center hover:bg-primary transition-colors">
                <Linkedin className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-background/10 flex items-center justify-center hover:bg-primary transition-colors">
                <Youtube className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm opacity-80">
              <li><Link to="/colleges" className="hover:text-primary transition-colors">All Colleges</Link></li>
              <li><Link to="/top-colleges" className="hover:text-primary transition-colors">Top Colleges</Link></li>
              <li><Link to="/compare" className="hover:text-primary transition-colors">Compare Colleges</Link></li>
              <li><Link to="/courses" className="hover:text-primary transition-colors">Courses</Link></li>
              <li><Link to="/exams" className="hover:text-primary transition-colors">Entrance Exams</Link></li>
              <li><Link to="/about" className="hover:text-primary transition-colors">About Us</Link></li>
            </ul>
          </div>

          {/* Top Categories */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Top Categories</h4>
            <ul className="space-y-2 text-sm opacity-80">
              <li><Link to="/colleges?category=engineering" className="hover:text-primary transition-colors">Engineering Colleges</Link></li>
              <li><Link to="/colleges?category=management" className="hover:text-primary transition-colors">MBA Colleges</Link></li>
              <li><Link to="/colleges?category=medical" className="hover:text-primary transition-colors">Medical Colleges</Link></li>
              <li><Link to="/colleges?category=law" className="hover:text-primary transition-colors">Law Colleges</Link></li>
              <li><Link to="/colleges?category=design" className="hover:text-primary transition-colors">Design Colleges</Link></li>
              <li><Link to="/colleges?category=commerce" className="hover:text-primary transition-colors">Commerce Colleges</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Contact Us</h4>
            <ul className="space-y-3 text-sm opacity-80">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>123 Education Hub, Connaught Place, New Delhi - 110001</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 flex-shrink-0" />
                <span>+91 96436 89903 </span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 flex-shrink-0" />
                <span>support@aarambhveda.com</span>
              </li>
            </ul>
            <div className="mt-4 p-4 bg-background/10 rounded-lg">
              <p className="text-xs font-medium mb-2">Get Free Counselling</p>
              <p className="text-xs opacity-70">Talk to our experts for free guidance</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-background/10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm opacity-70">
            <p>© 2026 Aarambh Veda. All rights reserved.</p>
            <div className="flex gap-6">
              <Link to="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link>
              <Link to="/terms" className="hover:text-primary transition-colors">Terms of Service</Link>
              <Link to="/contact" className="hover:text-primary transition-colors">Contact</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
