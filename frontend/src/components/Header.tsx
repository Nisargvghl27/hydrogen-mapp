import { Button } from "@/components/ui/button";
import { Zap, Menu, Mail } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const navigation = [
    { name: "Platform", href: "/platform" },
    { name: "Use Cases", href: "#use-cases" },
    { name: "Data", href: "#data" },
    { name: "Documentation", href: "#docs" },
    { name: "Contact Us", href: "#footer" }
  ];

  const handleNavigation = (href: string) => {
    if (href.startsWith('/')) {
      navigate(href);
      setIsMenuOpen(false);
    } else {
      // Handle anchor links
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
      setIsMenuOpen(false);
    }
  };

  return (
    <header className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
            <div className="p-2 bg-gradient-to-r from-hydrogen-green to-tech-blue rounded-lg">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold text-foreground">H2 Infrastructure</span>
              <span className="text-xs text-muted-foreground -mt-1">Mapping Platform</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <button
                key={item.name}
                onClick={() => handleNavigation(item.href)}
                className={`transition-all duration-300 font-medium flex items-center space-x-2 ${
                  item.name === "Contact Us" 
                    ? "text-hydrogen-green hover:text-hydrogen-green/80 hover:scale-105" 
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {item.name === "Contact Us" && <Mail className="w-4 h-4" />}
                <span>{item.name}</span>
              </button>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-muted-foreground hover:text-foreground"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <nav className="flex flex-col space-y-4">
              {navigation.map((item) => (
                <button
                  key={item.name}
                  onClick={() => handleNavigation(item.href)}
                  className={`text-left transition-all duration-300 font-medium flex items-center space-x-2 ${
                    item.name === "Contact Us" 
                      ? "text-hydrogen-green hover:text-hydrogen-green/80 hover:scale-105" 
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {item.name === "Contact Us" && <Mail className="w-4 h-4" />}
                  <span>{item.name}</span>
                </button>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;