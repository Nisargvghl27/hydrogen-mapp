import { Button } from "@/components/ui/button";
import { Zap, Mail, Phone, MapPin, Github, Linkedin, Twitter } from "lucide-react";

const Footer = () => {
  const footerSections = [
    {
      title: "Platform",
      links: [
        { name: "Features", href: "#features" },
        { name: "Data Sources", href: "#data" },
        { name: "API Documentation", href: "#api" },
        { name: "System Status", href: "#status" }
      ]
    },
    {
      title: "Use Cases",
      links: [
        { name: "Energy Companies", href: "#energy" },
        { name: "Government", href: "#government" },
        { name: "Infrastructure Planning", href: "#planning" },
        { name: "Research Institutions", href: "#research" }
      ]
    },
    {
      title: "Resources",
      links: [
        { name: "Documentation", href: "#docs" },
        { name: "User Guides", href: "#guides" },
        { name: "Case Studies", href: "#cases" },
        { name: "Webinars", href: "#webinars" }
      ]
    },
    {
      title: "Support",
      links: [
        { name: "Help Center", href: "#help" },
        { name: "Contact Sales", href: "#sales" },
        { name: "Technical Support", href: "#support" },
        { name: "Training", href: "#training" }
      ]
    }
  ];

  const socialLinks = [
    { icon: Github, href: "#github", label: "GitHub" },
    { icon: Linkedin, href: "#linkedin", label: "LinkedIn" },
    { icon: Twitter, href: "#twitter", label: "Twitter" }
  ];

  return (
    <footer id="footer" className="bg-data-navy text-white">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid lg:grid-cols-5 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-1 space-y-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-hydrogen-green to-tech-blue rounded-lg">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-bold">H2 Infrastructure</span>
                <span className="text-xs text-white/70">Mapping Platform</span>
              </div>
            </div>
            
            <p className="text-white/80 text-sm leading-relaxed">
              Advanced geospatial analytics for green hydrogen infrastructure optimization and investment planning.
            </p>

            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-sm">
                <Mail className="w-4 h-4 text-hydrogen-green" />
                <span className="text-white/80">contact@h2infrastructure.com</span>
              </div>
              <div className="flex items-center space-x-3 text-sm">
                <Phone className="w-4 h-4 text-hydrogen-green" />
                <span className="text-white/80">+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-3 text-sm">
                <MapPin className="w-4 h-4 text-hydrogen-green" />
                <span className="text-white/80">San Francisco, CA</span>
              </div>
            </div>
          </div>

          {/* Footer Links */}
          {footerSections.map((section, index) => (
            <div key={index} className="space-y-4">
              <h3 className="font-semibold text-white">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <a
                      href={link.href}
                      className="text-white/70 hover:text-hydrogen-green transition-colors text-sm"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter Signup */}
        <div className="mt-12 pt-8 border-t border-white/20">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="space-y-3">
              <h3 className="text-xl font-semibold text-white">Stay Updated</h3>
              <p className="text-white/80">
                Get the latest updates on hydrogen infrastructure developments and platform features.
              </p>
            </div>
            <div className="flex space-x-3">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-hydrogen-green"
              />
              <Button variant="success" size="sm">
                Subscribe
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-white/70 text-sm">
              © 2024 H2 Infrastructure Mapping Platform. All rights reserved.
            </div>
            
            <div className="flex items-center space-x-6">
              <div className="flex space-x-4">
                <a href="#privacy" className="text-white/70 hover:text-white text-sm transition-colors">
                  Privacy Policy
                </a>
                <a href="#terms" className="text-white/70 hover:text-white text-sm transition-colors">
                  Terms of Service
                </a>
                <a href="#cookies" className="text-white/70 hover:text-white text-sm transition-colors">
                  Cookie Policy
                </a>
              </div>
              
              <div className="flex space-x-3">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.href}
                    aria-label={social.label}
                    className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
                  >
                    <social.icon className="w-4 h-4 text-white" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;