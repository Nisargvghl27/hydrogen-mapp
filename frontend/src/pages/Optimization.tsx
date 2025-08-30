import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Target, Zap, TrendingUp, MapPin, Wind, Factory, Route, Shield, Filter, BarChart3, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Optimization = () => {
  const navigate = useNavigate();
  
  const optimizationCriteria = [
    {
      icon: Wind,
      title: "Renewable Energy Proximity",
      description: "Analyze distance to solar, wind, and hydroelectric power sources",
      score: 85,
      color: "text-hydrogen-green"
    },
    {
      icon: Factory,
      title: "Industrial Demand Centers",
      description: "Evaluate proximity to manufacturing hubs and industrial clusters",
      score: 92,
      color: "text-tech-blue"
    },
    {
      icon: Route,
      title: "Transport Connectivity",
      description: "Assess road, rail, and pipeline infrastructure access",
      score: 78,
      color: "text-success-emerald"
    },
    {
      icon: Shield,
      title: "Environmental Constraints",
      description: "Consider protected areas, water sources, and emissions regulations",
      score: 88,
      color: "text-destructive"
    }
  ];

  const siteRecommendations = [
    {
      name: "Solar Valley Site A",
      location: "California, USA",
      totalScore: 89,
      capacity: "500 MW",
      investment: "$2.5B",
      roi: "18.5%",
      status: "Recommended"
    },
    {
      name: "Wind Coast Facility",
      location: "Texas, USA",
      totalScore: 87,
      capacity: "300 MW",
      investment: "$1.8B",
      roi: "16.2%",
      status: "Recommended"
    },
    {
      name: "Hydro Hub Central",
      location: "Washington, USA",
      totalScore: 84,
      capacity: "400 MW",
      investment: "$2.1B",
      roi: "15.8%",
      status: "Consider"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/30">
      {/* Hero Section */}
      <section className="relative py-16 lg:py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-hydrogen-green/10 via-tech-blue/10 to-success-emerald/10"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Button */}
          <div className="mb-8">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/')}
              className="text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </div>
          
          <div className="text-center mb-12">
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-hydrogen-green/20 to-tech-blue/20 backdrop-blur-sm rounded-full px-6 py-3 text-sm font-medium mb-6">
              <Target className="w-4 h-4 text-hydrogen-green" />
              <span className="text-foreground">AI-Powered Optimization</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6">
              Site Optimization
              <span className="block bg-gradient-to-r from-hydrogen-green to-tech-blue bg-clip-text text-transparent">
                & Analysis
              </span>
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Advanced AI algorithms analyze multiple criteria to identify optimal locations 
              for hydrogen infrastructure development with maximum efficiency and ROI.
            </p>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            <Card className="group hover:shadow-medium transition-all duration-300 border-0 bg-gradient-card">
              <CardContent className="p-6 text-center">
                <div className="flex items-center justify-center mb-4">
                  <div className="p-3 bg-hydrogen-green/20 rounded-full">
                    <Target className="h-6 w-6 text-hydrogen-green" />
                  </div>
                </div>
                <div className="text-3xl font-bold text-foreground mb-2">89%</div>
                <p className="text-sm text-muted-foreground">Average Site Score</p>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-medium transition-all duration-300 border-0 bg-gradient-card">
              <CardContent className="p-6 text-center">
                <div className="flex items-center justify-center mb-4">
                  <div className="p-3 bg-tech-blue/20 rounded-full">
                    <Zap className="h-6 w-6 text-tech-blue" />
                  </div>
                </div>
                <div className="text-3xl font-bold text-foreground mb-2">1.2 GW</div>
                <p className="text-sm text-muted-foreground">Total Capacity</p>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-medium transition-all duration-300 border-0 bg-gradient-card">
              <CardContent className="p-6 text-center">
                <div className="flex items-center justify-center mb-4">
                  <div className="p-3 bg-success-emerald/20 rounded-full">
                    <TrendingUp className="h-6 w-6 text-success-emerald" />
                  </div>
                </div>
                <div className="text-3xl font-bold text-foreground mb-2">16.8%</div>
                <p className="text-sm text-muted-foreground">Average ROI</p>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-medium transition-all duration-300 border-0 bg-gradient-card">
              <CardContent className="p-6 text-center">
                <div className="flex items-center justify-center mb-4">
                  <div className="p-3 bg-hydrogen-dark/20 rounded-full">
                    <MapPin className="h-6 w-6 text-hydrogen-dark" />
                  </div>
                </div>
                <div className="text-3xl font-bold text-foreground mb-2">3</div>
                <p className="text-sm text-muted-foreground">Recommended Sites</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            {/* Optimization Criteria */}
            <Card className="group hover:shadow-medium transition-all duration-300 border-0 bg-gradient-card">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-hydrogen-green/20 rounded-lg">
                    <Filter className="h-5 w-5 text-hydrogen-green" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">Optimization Criteria</CardTitle>
                    <CardDescription>Multi-factor analysis for site selection</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {optimizationCriteria.map((criteria, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-secondary/30 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <criteria.icon className={`w-5 h-5 ${criteria.color}`} />
                      <div>
                        <h4 className="font-medium text-foreground">{criteria.title}</h4>
                        <p className="text-sm text-muted-foreground">{criteria.description}</p>
                      </div>
                    </div>
                    <Badge variant="secondary" className="text-sm">
                      {criteria.score}/100
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Site Recommendations */}
            <Card className="group hover:shadow-medium transition-all duration-300 border-0 bg-gradient-card">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-tech-blue/20 rounded-lg">
                    <BarChart3 className="h-5 w-5 text-tech-blue" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">Top Site Recommendations</CardTitle>
                    <CardDescription>AI-optimized locations with highest potential</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {siteRecommendations.map((site, index) => (
                  <div key={index} className="p-4 bg-secondary/30 rounded-lg border-l-4 border-hydrogen-green">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-foreground">{site.name}</h4>
                      <Badge variant={site.status === "Recommended" ? "default" : "secondary"}>
                        {site.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{site.location}</p>
                    <div className="grid grid-cols-3 gap-2 text-sm">
                      <div>
                        <span className="text-muted-foreground">Score:</span>
                        <span className="font-medium text-foreground ml-1">{site.totalScore}%</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Capacity:</span>
                        <span className="font-medium text-foreground ml-1">{site.capacity}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">ROI:</span>
                        <span className="font-medium text-foreground ml-1">{site.roi}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Call to Action */}
          <Card className="bg-gradient-to-r from-hydrogen-green/10 to-tech-blue/10 border-0">
            <CardContent className="pt-8">
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 text-hydrogen-green mb-4">
                  <Target className="h-6 w-6" />
                  <p className="font-semibold text-lg">Ready to Optimize Your Sites?</p>
                </div>
                <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                  Use our AI-powered optimization engine to analyze potential sites, 
                  compare criteria, and make data-driven decisions for your hydrogen infrastructure projects.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button variant="hero" size="lg" className="group">
                    Analyze New Site
                    <Target className="w-5 h-5 group-hover:scale-110 transition-transform ml-2" />
                  </Button>
                  <Button variant="outline" size="lg">
                    View Full Report
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default Optimization;
