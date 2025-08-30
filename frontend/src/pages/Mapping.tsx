import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MapPin, Layers, Filter, Database, Wind, Factory, Route, Truck, Shield, Globe, ZoomIn, Search, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Mapping = () => {
  const navigate = useNavigate();
  
  const mapLayers = [
    {
      icon: Wind,
      label: "Renewable Energy Zones",
      color: "text-hydrogen-green",
      active: true,
      count: 156
    },
    {
      icon: Factory,
      label: "Industrial Clusters",
      color: "text-tech-blue",
      active: true,
      count: 89
    },
    {
      icon: Route,
      label: "Transport Networks",
      color: "text-success-emerald",
      active: false,
      count: 234
    },
    {
      icon: Truck,
      label: "Demand Centers",
      color: "text-data-navy",
      active: true,
      count: 67
    },
    {
      icon: Shield,
      label: "Regulatory Zones",
      color: "text-hydrogen-dark",
      active: false,
      count: 45
    },
    {
      icon: Database,
      label: "Environmental Data",
      color: "text-destructive",
      active: false,
      count: 123
    }
  ];

  const infrastructureSites = [
    {
      name: "Solar Hydrogen Plant Alpha",
      type: "Production",
      location: "California, USA",
      coordinates: "34.0522°N, 118.2437°W",
      capacity: "500 MW",
      status: "Operational",
      lastUpdated: "2 hours ago"
    },
    {
      name: "Wind Hydrogen Facility Beta",
      type: "Production",
      location: "Texas, USA",
      coordinates: "31.9686°N, 99.9018°W",
      capacity: "300 MW",
      status: "Construction",
      lastUpdated: "1 day ago"
    },
    {
      name: "Hydrogen Storage Hub Gamma",
      type: "Storage",
      location: "Washington, USA",
      coordinates: "47.6062°N, 122.3321°W",
      capacity: "200 MW",
      status: "Planning",
      lastUpdated: "3 days ago"
    }
  ];

  const filterOptions = [
    { label: "Production Sites", count: 45, active: true },
    { label: "Storage Facilities", count: 23, active: false },
    { label: "Distribution Centers", count: 34, active: false },
    { label: "Transport Hubs", count: 28, active: false }
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
              <MapPin className="w-4 h-4 text-hydrogen-green" />
              <span className="text-foreground">Interactive Mapping</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6">
              Geospatial
              <span className="block bg-gradient-to-r from-hydrogen-green to-tech-blue bg-clip-text text-transparent">
                Visualization
              </span>
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Advanced interactive mapping platform with real-time visualization of hydrogen infrastructure, 
              renewable energy sources, and comprehensive data layers for informed decision-making.
            </p>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            <Card className="group hover:shadow-medium transition-all duration-300 border-0 bg-gradient-card">
              <CardContent className="p-6 text-center">
                <div className="flex items-center justify-center mb-4">
                  <div className="p-3 bg-hydrogen-green/20 rounded-full">
                    <MapPin className="h-6 w-6 text-hydrogen-green" />
                  </div>
                </div>
                <div className="text-3xl font-bold text-foreground mb-2">156</div>
                <p className="text-sm text-muted-foreground">Active Sites</p>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-medium transition-all duration-300 border-0 bg-gradient-card">
              <CardContent className="p-6 text-center">
                <div className="flex items-center justify-center mb-4">
                  <div className="p-3 bg-tech-blue/20 rounded-full">
                    <Layers className="h-6 w-6 text-tech-blue" />
                  </div>
                </div>
                <div className="text-3xl font-bold text-foreground mb-2">6</div>
                <p className="text-sm text-muted-foreground">Data Layers</p>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-medium transition-all duration-300 border-0 bg-gradient-card">
              <CardContent className="p-6 text-center">
                <div className="flex items-center justify-center mb-4">
                  <div className="p-3 bg-success-emerald/20 rounded-full">
                    <Globe className="h-6 w-6 text-success-emerald" />
                  </div>
                </div>
                <div className="text-3xl font-bold text-foreground mb-2">3</div>
                <p className="text-sm text-muted-foreground">Continents</p>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-medium transition-all duration-300 border-0 bg-gradient-card">
              <CardContent className="p-6 text-center">
                <div className="flex items-center justify-center mb-4">
                  <div className="p-3 bg-hydrogen-dark/20 rounded-full">
                    <Database className="h-6 w-6 text-hydrogen-dark" />
                  </div>
                </div>
                <div className="text-3xl font-bold text-foreground mb-2">24/7</div>
                <p className="text-sm text-muted-foreground">Real-time Updates</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            {/* Map Interface */}
            <Card className="group hover:shadow-medium transition-all duration-300 border-0 bg-gradient-card">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-hydrogen-green/20 rounded-lg">
                    <Globe className="h-5 w-5 text-hydrogen-green" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">Interactive Map</CardTitle>
                    <CardDescription>Real-time geospatial visualization</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-96 w-full rounded-xl overflow-hidden border border-border/50 bg-gradient-to-br from-hydrogen-green/10 to-tech-blue/10">
                  <div className="h-full w-full flex items-center justify-center relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-hydrogen-green/5 to-tech-blue/5"></div>
                    <div className="relative z-10 text-center">
                      <Globe className="h-16 w-16 text-hydrogen-green mx-auto mb-4 opacity-60" />
                      <h3 className="text-xl font-semibold text-foreground mb-2">Interactive Map</h3>
                      <p className="text-muted-foreground mb-4">Zoom, pan, and explore infrastructure sites</p>
                      <div className="flex gap-2 justify-center">
                        <Button size="sm" variant="outline">
                          <ZoomIn className="w-4 h-4 mr-2" />
                          Zoom In
                        </Button>
                        <Button size="sm" variant="outline">
                          <Search className="w-4 h-4 mr-2" />
                          Search
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Data Layers Control */}
            <Card className="group hover:shadow-medium transition-all duration-300 border-0 bg-gradient-card">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-tech-blue/20 rounded-lg">
                    <Layers className="h-5 w-5 text-tech-blue" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">Data Layers</CardTitle>
                    <CardDescription>Toggle and configure map layers</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {mapLayers.map((layer, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <layer.icon className={`w-5 h-5 ${layer.color}`} />
                      <div>
                        <h4 className="font-medium text-foreground">{layer.label}</h4>
                        <p className="text-sm text-muted-foreground">{layer.count} items</p>
                      </div>
                    </div>
                    <Badge variant={layer.active ? "default" : "secondary"}>
                      {layer.active ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Infrastructure Sites */}
          <Card className="group hover:shadow-medium transition-all duration-300 border-0 bg-gradient-card mb-12">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-success-emerald/20 rounded-lg">
                  <Database className="h-5 w-5 text-success-emerald" />
                </div>
                <div>
                  <CardTitle className="text-xl">Infrastructure Sites</CardTitle>
                  <CardDescription>Real-time status of hydrogen infrastructure</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                {filterOptions.map((option, index) => (
                  <Button
                    key={index}
                    variant={option.active ? "default" : "outline"}
                    className="justify-between"
                  >
                    {option.label}
                    <Badge variant="secondary" className="ml-2">
                      {option.count}
                    </Badge>
                  </Button>
                ))}
              </div>
              
              <div className="space-y-4">
                {infrastructureSites.map((site, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-secondary/30 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="p-2 bg-hydrogen-green/20 rounded-lg">
                        <MapPin className="h-5 w-5 text-hydrogen-green" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-foreground">{site.name}</h4>
                        <p className="text-sm text-muted-foreground">{site.location}</p>
                        <p className="text-xs text-muted-foreground">{site.coordinates}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center space-x-2 mb-2">
                        <Badge variant="outline">{site.type}</Badge>
                        <Badge variant={site.status === "Operational" ? "default" : "secondary"}>
                          {site.status}
                        </Badge>
                      </div>
                      <p className="text-sm font-medium text-foreground">{site.capacity}</p>
                      <p className="text-xs text-muted-foreground">Updated {site.lastUpdated}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Call to Action */}
          <Card className="bg-gradient-to-r from-hydrogen-green/10 to-tech-blue/10 border-0">
            <CardContent className="pt-8">
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 text-hydrogen-green mb-4">
                  <MapPin className="h-6 w-6" />
                  <p className="font-semibold text-lg">Ready to Explore the Map?</p>
                </div>
                <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                  Navigate through our comprehensive mapping platform to visualize hydrogen infrastructure, 
                  analyze spatial relationships, and discover optimal locations for your projects.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button variant="hero" size="lg" className="group">
                    Launch Full Map
                    <Globe className="w-5 h-5 group-hover:scale-110 transition-transform ml-2" />
                  </Button>
                  <Button variant="outline" size="lg">
                    Download Data
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

export default Mapping;
