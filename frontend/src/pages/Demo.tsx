import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, Circle } from "react-leaflet";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MapPin, TrendingUp, Zap, Target, Database, Activity, Play, Pause, Sparkles } from "lucide-react";
import "leaflet/dist/leaflet.css";

// Fix for default markers in react-leaflet
import L from "leaflet";
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// Demo data for demonstration
const demoInfrastructureData = [
  {
    id: 1,
    name: "Solar Hydrogen Plant - California",
    type: "Production",
    lat: 34.0522,
    lng: -118.2437,
    capacity: 50,
    status: "Operational",
    efficiency: 85,
    production: 42.5,
  },
  {
    id: 2,
    name: "Wind Hydrogen Facility - Texas",
    type: "Production",
    lat: 31.9686,
    lng: -99.9018,
    capacity: 75,
    status: "Operational",
    efficiency: 78,
    production: 58.5,
  },
  {
    id: 3,
    name: "Hydrogen Storage Hub - Illinois",
    type: "Storage",
    lat: 41.8781,
    lng: -87.6298,
    capacity: 100,
    status: "Operational",
    efficiency: 92,
    production: 0,
  },
  {
    id: 4,
    name: "Distribution Center - New York",
    type: "Distribution",
    lat: 40.7128,
    lng: -74.0060,
    capacity: 25,
    status: "Operational",
    efficiency: 88,
    production: 22,
  },
];

const demoChartData = [
  { name: "Production", value: 123, color: "#10b981" },
  { name: "Storage", value: 100, color: "#3b82f6" },
  { name: "Distribution", value: 25, color: "#f59e0b" },
];

const demoEfficiencyData = [
  { month: "Jan", efficiency: 82 },
  { month: "Feb", efficiency: 85 },
  { month: "Mar", efficiency: 88 },
  { month: "Apr", efficiency: 87 },
  { month: "May", efficiency: 90 },
  { month: "Jun", efficiency: 92 },
];

const Demo = () => {
  const [selectedSite, setSelectedSite] = useState<any>(null);
  const [isDemoRunning, setIsDemoRunning] = useState(false);

  useEffect(() => {
    console.log("Demo component mounted");
  }, []);

  const getMarkerColor = (type: string) => {
    switch (type) {
      case "Production":
        return "#10b981";
      case "Storage":
        return "#3b82f6";
      case "Distribution":
        return "#f59e0b";
      default:
        return "#6b7280";
    }
  };

  const totalCapacity = demoInfrastructureData.reduce((sum, site) => sum + site.capacity, 0);
  const totalProduction = demoInfrastructureData.reduce((sum, site) => sum + site.production, 0);
  const avgEfficiency = Math.round(
    demoInfrastructureData.reduce((sum, site) => sum + site.efficiency, 0) / demoInfrastructureData.length
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/30">
      {/* Hero Section */}
      <section className="relative py-16 lg:py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-hydrogen-green/10 via-tech-blue/10 to-success-emerald/10"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-hydrogen-green/20 to-tech-blue/20 backdrop-blur-sm rounded-full px-6 py-3 text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4 text-hydrogen-green" />
              <span className="text-foreground">Interactive Demo</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6">
              Platform Demo
              <span className="block bg-gradient-to-r from-hydrogen-green to-tech-blue bg-clip-text text-transparent">
                Experience the Future
              </span>
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed mb-8">
              Interactive demonstration of hydrogen infrastructure mapping capabilities. 
              Explore real-time data visualization and analytics with sample infrastructure sites.
            </p>

            <Button
              variant={isDemoRunning ? "destructive" : "hero"}
              size="lg"
              onClick={() => setIsDemoRunning(!isDemoRunning)}
              className="group"
            >
              {isDemoRunning ? <Pause className="h-5 w-5 mr-2" /> : <Play className="h-5 w-5 mr-2" />}
              {isDemoRunning ? "Stop Demo" : "Start Demo"}
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <Card className="group hover:shadow-medium transition-all duration-300 border-0 bg-gradient-card">
              <CardContent className="p-6 text-center">
                <div className="flex items-center justify-center mb-4">
                  <div className="p-3 bg-hydrogen-green/20 rounded-full">
                    <MapPin className="h-6 w-6 text-hydrogen-green" />
                  </div>
                </div>
                <div className="text-3xl font-bold text-foreground mb-2">{demoInfrastructureData.length}</div>
                <p className="text-sm text-muted-foreground">Active Sites</p>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-medium transition-all duration-300 border-0 bg-gradient-card">
              <CardContent className="p-6 text-center">
                <div className="flex items-center justify-center mb-4">
                  <div className="p-3 bg-tech-blue/20 rounded-full">
                    <Zap className="h-6 w-6 text-tech-blue" />
                  </div>
                </div>
                <div className="text-3xl font-bold text-foreground mb-2">{totalCapacity} MW</div>
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
                <div className="text-3xl font-bold text-foreground mb-2">{avgEfficiency}%</div>
                <p className="text-sm text-muted-foreground">Avg Efficiency</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Map Section */}
            <Card className="group hover:shadow-medium transition-all duration-300 border-0 bg-gradient-card">
              <CardHeader className="pb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-hydrogen-green/20 rounded-lg">
                    <MapPin className="h-5 w-5 text-hydrogen-green" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">Infrastructure Map</CardTitle>
                    <CardDescription>Geographic distribution of demo infrastructure</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-96 w-full rounded-xl overflow-hidden border border-border/50">
                  {/* Temporary map replacement for debugging */}
                  <div style={{ 
                    height: "100%", 
                    width: "100%", 
                    background: "linear-gradient(135deg, hsl(142 76% 36% / 0.1), hsl(221 83% 53% / 0.1))", 
                    display: "flex", 
                    alignItems: "center", 
                    justifyContent: "center",
                    border: "2px dashed hsl(142 76% 36% / 0.3)"
                  }}>
                    <div style={{ textAlign: "center" }}>
                      <MapPin className="h-12 w-12 text-hydrogen-green mx-auto mb-4 opacity-50" />
                      <h3 className="text-lg font-semibold text-foreground mb-2">Demo Map</h3>
                      <p className="text-muted-foreground">{demoInfrastructureData.length} demo sites</p>
                      <p className="text-sm text-muted-foreground mt-2">California, Texas, Illinois, New York</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Analytics Section */}
            <Card className="group hover:shadow-medium transition-all duration-300 border-0 bg-gradient-card">
              <CardHeader className="pb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-tech-blue/20 rounded-lg">
                    <Database className="h-5 w-5 text-tech-blue" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">Analytics Dashboard</CardTitle>
                    <CardDescription>Demo infrastructure insights and metrics</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="distribution" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 bg-secondary/50">
                    <TabsTrigger value="distribution" className="data-[state=active]:bg-background">Distribution</TabsTrigger>
                    <TabsTrigger value="efficiency" className="data-[state=active]:bg-background">Efficiency</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="distribution" className="space-y-4 mt-4">
                    <div className="h-64 bg-gradient-to-br from-hydrogen-green/10 to-tech-blue/10 rounded-xl border border-border/50 flex items-center justify-center">
                      <div style={{ textAlign: "center" }}>
                        <Database className="h-12 w-12 text-hydrogen-green mx-auto mb-4 opacity-50" />
                        <h3 className="text-lg font-semibold text-foreground mb-2">Distribution Chart</h3>
                        <p className="text-muted-foreground">Production: {demoChartData[0].value} MW</p>
                        <p className="text-muted-foreground">Storage: {demoChartData[1].value} MW</p>
                        <p className="text-muted-foreground">Distribution: {demoChartData[2].value} MW</p>
                      </div>
                    </div>
                    <div className="text-center text-muted-foreground">
                      <p>Infrastructure capacity by type (MW)</p>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="efficiency" className="space-y-4 mt-4">
                    <div className="h-64 bg-gradient-to-br from-success-emerald/10 to-hydrogen-green/10 rounded-xl border border-border/50 flex items-center justify-center">
                      <div style={{ textAlign: "center" }}>
                        <Activity className="h-12 w-12 text-success-emerald mx-auto mb-4 opacity-50" />
                        <h3 className="text-lg font-semibold text-foreground mb-2">Efficiency Trends</h3>
                        <p className="text-muted-foreground">{demoEfficiencyData.length} months of data</p>
                        <p className="text-muted-foreground">Range: 82% - 92%</p>
                      </div>
                    </div>
                    <div className="text-center text-muted-foreground">
                      <p>Monthly efficiency trends (%)</p>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Site Details */}
          {selectedSite && (
            <Card className="mt-8 group hover:shadow-medium transition-all duration-300 border-0 bg-gradient-card">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-hydrogen-green/20 rounded-lg">
                    <Target className="h-5 w-5 text-hydrogen-green" />
                  </div>
                  <div>
                    <CardTitle>Site Details</CardTitle>
                    <CardDescription>{selectedSite.name}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div className="text-center p-4 bg-secondary/30 rounded-lg">
                    <p className="text-sm font-medium text-muted-foreground mb-2">Type</p>
                    <p className="text-lg font-semibold text-foreground">{selectedSite.type}</p>
                  </div>
                  <div className="text-center p-4 bg-secondary/30 rounded-lg">
                    <p className="text-sm font-medium text-muted-foreground mb-2">Capacity</p>
                    <p className="text-lg font-semibold text-foreground">{selectedSite.capacity} MW</p>
                  </div>
                  <div className="text-center p-4 bg-secondary/30 rounded-lg">
                    <p className="text-sm font-medium text-muted-foreground mb-2">Status</p>
                    <Badge variant="outline" className="mt-1">{selectedSite.status}</Badge>
                  </div>
                  <div className="text-center p-4 bg-secondary/30 rounded-lg">
                    <p className="text-sm font-medium text-muted-foreground mb-2">Efficiency</p>
                    <p className="text-lg font-semibold text-foreground">{selectedSite.efficiency}%</p>
                  </div>
                </div>
                {selectedSite.production > 0 && (
                  <div className="mt-6 text-center p-4 bg-success-emerald/10 rounded-lg">
                    <p className="text-sm font-medium text-muted-foreground mb-2">Current Production</p>
                    <p className="text-lg font-semibold text-foreground">{selectedSite.production} MW</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Demo Notice */}
          <Card className="mt-8 bg-gradient-to-r from-hydrogen-green/10 to-tech-blue/10 border-0">
            <CardContent className="pt-8">
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 text-hydrogen-green mb-4">
                  <Sparkles className="h-6 w-6" />
                  <p className="font-semibold text-lg">Demo Mode Active</p>
                </div>
                <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                  This is a demonstration of the hydrogen infrastructure mapping platform. 
                  The data shown is for illustrative purposes only and represents sample infrastructure sites.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button variant="hero" size="lg" className="group">
                    Access Full Platform
                    <MapPin className="w-5 h-5 group-hover:scale-110 transition-transform ml-2" />
                  </Button>
                  <Button variant="outline" size="lg">
                    Learn More
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

export default Demo;
