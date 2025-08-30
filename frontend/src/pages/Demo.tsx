import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup, Circle } from "react-leaflet";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MapPin, TrendingUp, Zap, Target, Database, Activity, Sparkles } from "lucide-react";

import "leaflet/dist/leaflet.css";

// Define types for demo infrastructure data
interface DemoInfrastructureSite {
  id: number;
  name: string;
  type: string;
  lat: number;
  lng: number;
  capacity: number;
  status: string;
  efficiency: number;
  production: number;
}

// Fix for default markers in react-leaflet
import L from "leaflet";
delete (L.Icon.Default.prototype as { _getIconUrl?: () => string })._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// Demo data for demonstration
const demoInfrastructureData: DemoInfrastructureSite[] = [
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
  {
    id: 5,
    name: "Solar Hydrogen Plant - Arizona",
    type: "Production",
    lat: 33.4484,
    lng: -112.0740,
    capacity: 60,
    status: "Operational",
    efficiency: 91,
    production: 54.6,
  },
  {
    id: 6,
    name: "Wind Hydrogen Facility - Colorado",
    type: "Production",
    lat: 39.7392,
    lng: -104.9903,
    capacity: 45,
    status: "Operational",
    efficiency: 83,
    production: 37.35,
  },
  {
    id: 7,
    name: "Storage Hub - Michigan",
    type: "Storage",
    lat: 42.3314,
    lng: -83.0458,
    capacity: 80,
    status: "Operational",
    efficiency: 94,
    production: 0,
  },
];

const demoChartData = [
  { name: "Production", value: 275, color: "#10b981" },
  { name: "Storage", value: 180, color: "#3b82f6" },
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
  const [selectedSite, setSelectedSite] = useState<DemoInfrastructureSite | null>(null);
  const navigate = useNavigate();

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
                  <MapContainer 
                    center={[39.8283, -98.5795]} 
                    zoom={4} 
                    style={{ height: "100%", width: "100%" }}
                  >
                    <TileLayer
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />

                    {/* Render demo infrastructure markers */}
                    {demoInfrastructureData.map((site) => (
                      <Marker
                        key={site.id}
                        position={[site.lat, site.lng]}
                        eventHandlers={{
                          click: () => setSelectedSite(site),
                        }}
                      >
                        <Popup>
                          <div>
                            <strong>{site.name}</strong><br/>
                            Type: {site.type}<br/>
                            Status: {site.status}<br/>
                            Capacity: {site.capacity} MW<br/>
                            Efficiency: {site.efficiency}%
                            {site.production > 0 && (
                              <>
                                <br/>Production: {site.production} MW
                              </>
                            )}
                          </div>
                        </Popup>
                      </Marker>
                    ))}

                    {/* Optional: Circle for visualizing coverage */}
                    {demoInfrastructureData.map((site) => (
                      <Circle
                        key={`circle-${site.id}`}
                        center={[site.lat, site.lng]}
                        radius={80000} // radius in meters
                        pathOptions={{ color: getMarkerColor(site.type), fillOpacity: 0.1 }}
                      />
                    ))}
                  </MapContainer>
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
                    <div className="h-64 bg-gradient-to-br from-hydrogen-green/10 to-tech-blue/10 rounded-xl border border-border/50">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={demoChartData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                          <XAxis 
                            dataKey="name" 
                            stroke="rgba(255,255,255,0.7)"
                            fontSize={12}
                          />
                          <YAxis 
                            stroke="rgba(255,255,255,0.7)"
                            fontSize={12}
                          />
                          <Tooltip 
                            contentStyle={{
                              backgroundColor: 'rgba(0,0,0,0.8)',
                              border: '1px solid rgba(255,255,255,0.2)',
                              borderRadius: '8px',
                              color: 'white'
                            }}
                          />
                          <Bar dataKey="value" fill="#10b981" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="text-center text-muted-foreground">
                      <p>Infrastructure capacity by type (MW)</p>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="efficiency" className="space-y-4 mt-4">
                    <div className="h-64 bg-gradient-to-br from-success-emerald/10 to-hydrogen-green/10 rounded-xl border border-border/50">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={demoEfficiencyData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                          <XAxis 
                            dataKey="month" 
                            stroke="rgba(255,255,255,0.7)"
                            fontSize={12}
                          />
                          <YAxis 
                            stroke="rgba(255,255,255,0.7)"
                            fontSize={12}
                            domain={[75, 95]}
                          />
                          <Tooltip 
                            contentStyle={{
                              backgroundColor: 'rgba(0,0,0,0.8)',
                              border: '1px solid rgba(255,255,255,0.2)',
                              borderRadius: '8px',
                              color: 'white'
                            }}
                          />
                          <Line 
                            type="monotone" 
                            dataKey="efficiency" 
                            stroke="#10b981" 
                            strokeWidth={3}
                            dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
                            activeDot={{ r: 6, stroke: '#10b981', strokeWidth: 2 }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
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
                <div className="flex justify-center">
                  <Button 
                    variant="hero" 
                    size="lg" 
                    className="group"
                    onClick={() => navigate('/platform')}
                  >
                    Access Full Platform
                    <MapPin className="w-5 h-5 group-hover:scale-110 transition-transform ml-2" />
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