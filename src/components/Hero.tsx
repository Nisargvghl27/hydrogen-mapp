import { Button } from "@/components/ui/button";
import { MapPin, Zap, Target, TrendingUp } from "lucide-react";
import heroImage from "@/assets/hero-hydrogen-infrastructure.jpg";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden py-12 sm:py-16 lg:py-20">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src={heroImage} 
          alt="Green hydrogen infrastructure mapping visualization" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-data-navy/90 via-data-navy/70 to-transparent"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
        <div className="text-white space-y-6 lg:space-y-8">
          <div className="space-y-3 lg:space-y-4">
            <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 text-sm">
              <Zap className="w-4 h-4 text-hydrogen-green" />
              <span>Next-Generation Infrastructure Planning</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
              Green Hydrogen
              <span className="block bg-gradient-to-r from-hydrogen-green to-tech-blue bg-clip-text text-transparent">
                Infrastructure Mapping
              </span>
            </h1>
            
            <p className="text-lg sm:text-xl text-white/90 leading-relaxed max-w-2xl">
              Advanced geospatial analytics platform for optimizing green hydrogen infrastructure development. 
              Make data-driven investment decisions with comprehensive mapping and site suitability analysis.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <Button variant="hero" size="lg" className="group">
              Access Platform
              <MapPin className="w-5 h-5 group-hover:scale-110 transition-transform" />
            </Button>
            <Button 
              variant="ghost" 
              size="lg" 
              className="border border-white/30 text-white bg-transparent hover:bg-white/10 hover:text-white hover:border-white/50 transition-all duration-300"
            >
              View Demo
            </Button>
          </div>

          {/* Key Stats */}
          <div className="grid grid-cols-3 gap-6 pt-8 border-t border-white/20">
            <div className="text-center">
              <div className="text-2xl font-bold text-hydrogen-green">500+</div>
              <div className="text-sm text-white/80">Infrastructure Sites</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-tech-blue">25+</div>
              <div className="text-sm text-white/80">Data Layers</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-success-emerald">98%</div>
              <div className="text-sm text-white/80">Accuracy Rate</div>
            </div>
          </div>
        </div>

        {/* Right side - Feature highlights */}
        <div className="space-y-6">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            <Target className="w-8 h-8 text-hydrogen-green mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">Site Optimization</h3>
            <p className="text-white/80">
              AI-powered analysis of proximity to renewable energy sources, demand centers, and transport networks.
            </p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            <MapPin className="w-8 h-8 text-tech-blue mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">Interactive Mapping</h3>
            <p className="text-white/80">
              Real-time visualization of hydrogen infrastructure with advanced filtering and scenario analysis.
            </p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            <TrendingUp className="w-8 h-8 text-success-emerald mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">Investment Insights</h3>
            <p className="text-white/80">
              Data-driven recommendations for infrastructure investment and growth pathway planning.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;