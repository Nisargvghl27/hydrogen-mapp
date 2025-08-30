import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Map, 
  Database, 
  BarChart3, 
  Filter, 
  Layers, 
  Route,
  Wind,
  Factory,
  Truck,
  Shield
} from "lucide-react";

const Features = () => {
  const mainFeatures = [
    {
      icon: Map,
      title: "Interactive Geospatial Visualization",
      description: "Advanced mapping with Mapbox integration for real-time visualization of hydrogen infrastructure, renewable energy sources, and demand centers.",
      color: "text-tech-blue"
    },
    {
      icon: Database,
      title: "Integrated Data Layers",
      description: "Comprehensive integration of renewable energy datasets, water availability, transport networks, and regulatory zones in one platform.",
      color: "text-hydrogen-green"
    },
    {
      icon: BarChart3,
      title: "AI-Powered Site Scoring",
      description: "Multi-criteria decision model analyzing proximity to renewables, logistics connectivity, and demand hubs for optimal site selection.",
      color: "text-success-emerald"
    },
    {
      icon: Filter,
      title: "Advanced Filtering & Ranking",
      description: "Dynamic filtering capabilities based on key feasibility conditions including policy constraints and environmental factors.",
      color: "text-data-navy"
    }
  ];

  const dataLayers = [
    { icon: Wind, label: "Renewable Energy Zones", color: "text-hydrogen-green" },
    { icon: Factory, label: "Industrial Clusters", color: "text-tech-blue" },
    { icon: Route, label: "Transport Networks", color: "text-success-emerald" },
    { icon: Truck, label: "Demand Centers", color: "text-data-navy" },
    { icon: Layers, label: "Regulatory Zones", color: "text-hydrogen-dark" },
    { icon: Shield, label: "Environmental Constraints", color: "text-destructive" }
  ];

  return (
    <section className="py-24 bg-gradient-to-b from-background to-secondary/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-foreground mb-4">
            Comprehensive Platform Capabilities
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Advanced geospatial analytics and decision support tools for green hydrogen infrastructure development
          </p>
        </div>

        {/* Main Features Grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-20">
          {mainFeatures.map((feature, index) => (
            <Card key={index} className="group hover:shadow-medium transition-all duration-300 border-0 bg-gradient-card">
              <CardContent className="p-8">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <feature.icon className={`w-8 h-8 ${feature.color}`} />
                  </div>
                  <div className="space-y-3">
                    <h3 className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Data Layers Section */}
        <div className="bg-card rounded-3xl p-8 lg:p-12 shadow-large border">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h3 className="text-3xl font-bold text-foreground">
                Integrated Data Ecosystem
              </h3>
              <p className="text-lg text-muted-foreground">
                Our platform consolidates multiple critical data layers to provide comprehensive 
                insights for hydrogen infrastructure planning and optimization.
              </p>
              <div className="grid grid-cols-2 gap-4">
                {dataLayers.map((layer, index) => (
                  <div key={index} className="flex items-center space-x-3 p-3 bg-secondary/50 rounded-xl">
                    <layer.icon className={`w-5 h-5 ${layer.color}`} />
                    <span className="text-sm font-medium text-foreground">{layer.label}</span>
                  </div>
                ))}
              </div>
              <Button variant="hero" size="lg" className="mt-6">
                Explore Data Layers
              </Button>
            </div>
            
            <div className="relative">
              <div className="bg-gradient-to-br from-hydrogen-green/20 to-tech-blue/20 rounded-2xl p-8 text-center">
                <Database className="w-16 h-16 text-primary mx-auto mb-4" />
                <h4 className="text-xl font-semibold text-foreground mb-2">
                  Real-time Data Integration
                </h4>
                <p className="text-muted-foreground">
                  Continuous updates from multiple data sources ensure accurate and current infrastructure insights.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;