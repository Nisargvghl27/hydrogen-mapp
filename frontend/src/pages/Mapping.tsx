import { useState, useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from "react-leaflet";
import "leaflet.heat";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { 
  MapPin, 
  Layers, 
  Database, 
  Globe, 
  Search, 
  ArrowLeft,
  BarChart3,
  Download,
  Share2,
  TrendingUp,
  Zap,
  Map,
  Maximize2,
  X,
  ZoomIn,
  ZoomOut,
  Home,
  RotateCcw
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import "leaflet/dist/leaflet.css";
import "leaflet.heat";


// Define types for infrastructure data
interface InfrastructureSite {
  id: number;
  name: string;
  type: string;
  lat: number;
  lng: number;
  capacity: number;
  status: string;
  efficiency: number;
  location: string;
  coordinates: string;
  lastUpdated: string;
  investment: string;
  technology: string;
  renewableSource: string;
  workforce: number;
}

// Fix for default markers in react-leaflet
import L from "leaflet";
delete (L.Icon.Default.prototype as { _getIconUrl?: () => string })._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const Mapping = () => {
  const navigate = useNavigate();
  const [selectedSite, setSelectedSite] = useState<InfrastructureSite | null>(null);
  const [selectedLayer, setSelectedLayer] = useState("all");
  const [mapView, setMapView] = useState("street");
  const [zoomLevel, setZoomLevel] = useState(10);
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [showClusters, setShowClusters] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [timeRange, setTimeRange] = useState("24h");
  const [dataRefresh, setDataRefresh] = useState("auto");
  const [lastDataUpdate, setLastDataUpdate] = useState(new Date());
  const [isFullScreenOpen, setIsFullScreenOpen] = useState(false);
  const mapRef = useRef<L.Map | null>(null);
  const fullScreenMapRef = useRef<L.Map | null>(null);

  // Mock infrastructure data - centered around Surat, India
  const infrastructureSites: InfrastructureSite[] = [
    {
      id: 1,
      name: "Surat Solar Hydrogen Plant",
      type: "Production",
      lat: 21.1702,
      lng: 72.8311,
      capacity: 500,
      status: "Operational",
      efficiency: 94,
      location: "Surat, Gujarat, India",
      coordinates: "21.1702°N, 72.8311°E",
      lastUpdated: "2 hours ago",
      investment: "$2.1B",
      technology: "PEM Electrolysis",
      renewableSource: "Solar PV",
      workforce: 245
    },
    {
      id: 2,
      name: "Mumbai Hydrogen Facility",
      type: "Production",
      lat: 19.0760,
      lng: 72.8777,
      capacity: 300,
      status: "Construction",
      efficiency: 92,
      location: "Mumbai, Maharashtra, India",
      coordinates: "19.0760°N, 72.8777°E",
      lastUpdated: "1 day ago",
      investment: "$1.8B",
      technology: "Alkaline Electrolysis",
      renewableSource: "Wind Power",
      workforce: 180
    },
    {
      id: 3,
      name: "Ahmedabad Storage Hub",
      type: "Storage",
      lat: 23.0225,
      lng: 72.5714,
      capacity: 200,
      status: "Planning",
      efficiency: 97,
      location: "Ahmedabad, Gujarat, India",
      coordinates: "23.0225°N, 72.5714°E",
      lastUpdated: "3 days ago",
      investment: "$950M",
      technology: "Compressed Gas Storage",
      renewableSource: "Grid Mix",
      workforce: 95
    },
    {
      id: 4,
      name: "Vadodara Green Hydrogen Refinery",
      type: "Production",
      lat: 22.3072,
      lng: 73.1812,
      capacity: 750,
      status: "Operational",
      efficiency: 94,
      location: "Vadodara, Gujarat, India",
      coordinates: "22.3072°N, 73.1812°E",
      lastUpdated: "30 minutes ago",
      investment: "$3.2B",
      technology: "Solid Oxide Electrolysis",
      renewableSource: "Hydroelectric",
      workforce: 320
    }
  ];

  const mapViews = [
    { id: "satellite", label: "Satellite", icon: Globe },
    { id: "street", label: "Street", icon: Map },
    { id: "hybrid", label: "Hybrid", icon: Layers }
  ];

  const timeRanges = [
    { value: "1h", label: "Last Hour" },
    { value: "24h", label: "Last 24 Hours" },
    { value: "7d", label: "Last 7 Days" },
    { value: "30d", label: "Last 30 Days" },
    { value: "1y", label: "Last Year" },
    { value: "all", label: "All Time" }
  ];

  const analyticsData = {
    totalCapacity: "1.75 GW",
    totalInvestment: "$8.05B",
    totalWorkforce: 840,
    averageEfficiency: "94.1%",
    carbonReduction: "1.2M tons CO2/year",
    renewablePercentage: "98.5%",
    operationalSites: 2,
    constructionSites: 1,
    planningSites: 1
  };

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

  // Get tile layer URL based on map view
  const getTileLayerUrl = (view: string) => {
    switch (view) {
      case "satellite":
        return "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}";
      case "hybrid":
        return "https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}";
      case "street":
      default:
        return "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
    }
  };

  // Get tile layer attribution based on map view
  const getTileLayerAttribution = (view: string) => {
    switch (view) {
      case "satellite":
        return '&copy; <a href="https://www.esri.com/">Esri</a> &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community';
      case "hybrid":
        return '&copy; <a href="https://www.esri.com/">Esri</a> &mdash; Source: Esri, DeLorme, NAVTEQ, USGS, Intermap, iPC, NRCAN, Esri Japan, METI, Esri China (Hong Kong), Esri (Thailand), TomTom, 2012';
      case "street":
      default:
        return '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
    }
  };

  // Map control functions
  const handleZoomIn = () => {
    if (mapRef.current) {
      mapRef.current.zoomIn();
    }
    if (fullScreenMapRef.current) {
      fullScreenMapRef.current.zoomIn();
    }
  };

  const handleZoomOut = () => {
    if (mapRef.current) {
      mapRef.current.zoomOut();
    }
    if (fullScreenMapRef.current) {
      fullScreenMapRef.current.zoomOut();
    }
  };

  const handleHome = () => {
    const suratCenter: [number, number] = [21.1702, 72.8311];
    if (mapRef.current) {
      mapRef.current.setView(suratCenter, 8);
    }
    if (fullScreenMapRef.current) {
      fullScreenMapRef.current.setView(suratCenter, 8);
    }
  };

  const handleReset = () => {
    const suratCenter: [number, number] = [21.1702, 72.8311];
    if (mapRef.current) {
      mapRef.current.setView(suratCenter, 8);
    }
    if (fullScreenMapRef.current) {
      fullScreenMapRef.current.setView(suratCenter, 8);
    }
  };

  // Handle zoom level change from slider
  const handleZoomLevelChange = (value: number[]) => {
    const newZoom = value[0];
    setZoomLevel(newZoom);
    
    if (mapRef.current) {
      const center = mapRef.current.getCenter();
      mapRef.current.setView([center.lat, center.lng], newZoom);
    }
    if (fullScreenMapRef.current) {
      const center = fullScreenMapRef.current.getCenter();
      fullScreenMapRef.current.setView([center.lat, center.lng], newZoom);
    }
  };

  // Handle search functionality
  const handleSearch = () => {
    if (searchQuery.trim()) {
      // Simple search implementation - you can enhance this with geocoding API
      const searchTerm = searchQuery.toLowerCase();
      
      // Search in infrastructure sites
      const foundSite = infrastructureSites.find(site => 
        site.name.toLowerCase().includes(searchTerm) ||
        site.location.toLowerCase().includes(searchTerm) ||
        site.coordinates.includes(searchTerm)
      );
      
      if (foundSite) {
        const siteCenter: [number, number] = [foundSite.lat, foundSite.lng];
        if (mapRef.current) {
          mapRef.current.setView(siteCenter, 12);
        }
        if (fullScreenMapRef.current) {
          fullScreenMapRef.current.setView(siteCenter, 12);
        }
        setSelectedSite(foundSite);
      } else {
        // If not found in sites, try to search for common locations
        const locationMap: { [key: string]: [number, number] } = {
          'surat': [21.1702, 72.8311],
          'mumbai': [19.0760, 72.8777],
          'ahmedabad': [23.0225, 72.5714],
          'vadodara': [22.3072, 73.1812],
          'gujarat': [22.2587, 71.1924],
          'india': [20.5937, 78.9629]
        };
        
        const foundLocation = Object.keys(locationMap).find(loc => 
          loc.toLowerCase().includes(searchTerm)
        );
        
        if (foundLocation) {
          const locationCenter = locationMap[foundLocation];
          if (mapRef.current) {
            mapRef.current.setView(locationCenter, 10);
          }
          if (fullScreenMapRef.current) {
            fullScreenMapRef.current.setView(locationCenter, 10);
          }
        }
      }
    }
  };

  // Handle time range change
  const handleTimeRangeChange = (newTimeRange: string) => {
    setTimeRange(newTimeRange);
    setLastDataUpdate(new Date());
    // In a real application, you would fetch data based on the time range
    console.log(`Data updated for time range: ${newTimeRange}`);
  };

  // Handle data refresh
  const handleDataRefresh = () => {
    setLastDataUpdate(new Date());
    // In a real application, you would refresh the data from the server
    console.log('Data refreshed');
  };

  // Map Controller Component
  const MapController = ({ mapRef }: { mapRef: React.MutableRefObject<L.Map | null> }) => {
    const map = useMap();
    
    useEffect(() => {
      if (mapRef.current !== map) {
        mapRef.current = map;
      }
    }, [map, mapRef]);
    
    return null;
  };

  useEffect(() => {
    console.log("Mapping component mounted");
  }, []);

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
              <span className="text-foreground">Interactive Mapping Platform</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6">
              Geospatial
              <span className="block bg-gradient-to-r from-hydrogen-green to-tech-blue bg-clip-text text-transparent">
                Intelligence Platform
              </span>
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Interactive mapping platform with real-time visualization of hydrogen infrastructure, 
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
                <div className="text-3xl font-bold text-foreground mb-2">{infrastructureSites.length}</div>
                <p className="text-sm text-muted-foreground">Infrastructure Sites</p>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-medium transition-all duration-300 border-0 bg-gradient-card">
              <CardContent className="p-6 text-center">
                <div className="flex items-center justify-center mb-4">
                  <div className="p-3 bg-tech-blue/20 rounded-full">
                    <Zap className="h-6 w-6 text-tech-blue" />
                  </div>
                </div>
                <div className="text-3xl font-bold text-foreground mb-2">{analyticsData.totalCapacity}</div>
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
                <div className="text-3xl font-bold text-foreground mb-2">{analyticsData.averageEfficiency}</div>
                <p className="text-sm text-muted-foreground">Avg Efficiency</p>
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
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Map Interface */}
            <div className="lg:col-span-2">
              <Card className="group hover:shadow-medium transition-all duration-300 border-0 bg-gradient-card">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-hydrogen-green/20 rounded-lg">
                        <Globe className="h-5 w-5 text-hydrogen-green" />
                      </div>
                      <div>
                        <CardTitle className="text-xl">Interactive Map</CardTitle>
                        <CardDescription>Real-time geospatial visualization</CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setIsFullScreenOpen(true)}
                      >
                        <Maximize2 className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Share2 className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                                     <div className="h-96 w-full rounded-xl overflow-hidden border border-border/50">
                     <MapContainer 
                       center={[21.1702, 72.8311]} 
                       zoom={8} 
                       style={{ height: "100%", width: "100%" }}
                     >
                       <MapController mapRef={mapRef} />
                       <TileLayer
                         url={getTileLayerUrl(mapView)}
                         attribution={getTileLayerAttribution(mapView)}
                       />
                     </MapContainer>
                   </div>
                 </CardContent>
               </Card>
             </div>

            {/* Map Controls */}
            <div className="space-y-6">
              {/* Search and Filters */}
              <Card className="border-0 bg-gradient-card">
                <CardHeader>
                  <CardTitle className="text-lg">Search & Filters</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                                     <div className="space-y-2">
                     <Label>Search Locations</Label>
                     <div className="relative">
                       <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                       <Input
                         placeholder="Search sites, coordinates..."
                         value={searchQuery}
                         onChange={(e) => setSearchQuery(e.target.value)}
                         onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                         className="pl-10 pr-10"
                       />
                       <Button
                         variant="ghost"
                         size="sm"
                         onClick={handleSearch}
                         className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
                       >
                         <Search className="w-4 h-4" />
                       </Button>
                     </div>
                   </div>

                  <div className="space-y-2">
                    <Label>Map View</Label>
                    <Select value={mapView} onValueChange={setMapView}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {mapViews.map((view) => (
                          <SelectItem key={view.id} value={view.id}>
                            <div className="flex items-center space-x-2">
                              <view.icon className="w-4 h-4" />
                              <span>{view.label}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                                     <div className="space-y-2">
                     <Label>Time Range</Label>
                     <Select value={timeRange} onValueChange={handleTimeRangeChange}>
                       <SelectTrigger>
                         <SelectValue />
                       </SelectTrigger>
                       <SelectContent>
                         {timeRanges.map((range) => (
                           <SelectItem key={range.value} value={range.value}>
                             {range.label}
                           </SelectItem>
                         ))}
                       </SelectContent>
                     </Select>
                     <div className="flex items-center justify-between">
                       <div className="text-xs text-muted-foreground">
                         Last updated: {lastDataUpdate.toLocaleTimeString()}
                       </div>
                       <Button
                         variant="ghost"
                         size="sm"
                         onClick={handleDataRefresh}
                         className="h-6 w-6 p-0"
                       >
                         <RotateCcw className="w-3 h-3" />
                       </Button>
                     </div>
                   </div>

                                     <div className="space-y-2">
                     <Label>Zoom Level: {zoomLevel}</Label>
                     <Slider
                       value={[zoomLevel]}
                       onValueChange={handleZoomLevelChange}
                       max={20}
                       min={1}
                       step={1}
                       className="w-full"
                     />
                   </div>

                                     <div className="space-y-3">
                     <div className="flex items-center justify-between">
                       <Label>Heatmap View</Label>
                       <Switch checked={showHeatmap} onCheckedChange={setShowHeatmap} />
                     </div>
                     <div className="flex items-center justify-between">
                       <Label>Show Clusters</Label>
                       <Switch checked={showClusters} onCheckedChange={setShowClusters} />
                     </div>
                     {showHeatmap && (
                       <div className="text-xs text-muted-foreground bg-secondary/30 p-2 rounded">
                         Heatmap overlay enabled - showing density visualization
                       </div>
                     )}
                     {showClusters && (
                       <div className="text-xs text-muted-foreground bg-secondary/30 p-2 rounded">
                         Clustering enabled - grouping nearby locations
                       </div>
                     )}
                   </div>
                </CardContent>
              </Card>

              {/* Quick Stats */}
              <Card className="border-0 bg-gradient-card">
                <CardHeader>
                  <CardTitle className="text-lg">Quick Stats</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Total Investment</span>
                    <span className="text-sm font-semibold">{analyticsData.totalInvestment}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Workforce</span>
                    <span className="text-sm font-semibold">{analyticsData.totalWorkforce}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Carbon Reduction</span>
                    <span className="text-sm font-semibold">{analyticsData.carbonReduction}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Renewable %</span>
                    <span className="text-sm font-semibold">{analyticsData.renewablePercentage}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Site Details */}
          {selectedSite && (
            <Card className="mt-8 group hover:shadow-medium transition-all duration-300 border-0 bg-gradient-card">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-hydrogen-green/20 rounded-lg">
                    <MapPin className="h-5 w-5 text-hydrogen-green" />
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
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-6">
                  <div className="text-center p-4 bg-secondary/30 rounded-lg">
                    <p className="text-sm font-medium text-muted-foreground mb-2">Investment</p>
                    <p className="text-lg font-semibold text-foreground">{selectedSite.investment}</p>
                  </div>
                  <div className="text-center p-4 bg-secondary/30 rounded-lg">
                    <p className="text-sm font-medium text-muted-foreground mb-2">Technology</p>
                    <p className="text-lg font-semibold text-foreground">{selectedSite.technology}</p>
                  </div>
                  <div className="text-center p-4 bg-secondary/30 rounded-lg">
                    <p className="text-sm font-medium text-muted-foreground mb-2">Workforce</p>
                    <p className="text-lg font-semibold text-foreground">{selectedSite.workforce}</p>
                  </div>
                  <div className="text-center p-4 bg-secondary/30 rounded-lg">
                    <p className="text-sm font-medium text-muted-foreground mb-2">Updated</p>
                    <p className="text-lg font-semibold text-foreground">{selectedSite.lastUpdated}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Call to Action */}
          <Card className="bg-gradient-to-r from-hydrogen-green/10 to-tech-blue/10 border-0 mt-12">
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

      {/* Full Screen Map Dialog */}
      <Dialog open={isFullScreenOpen} onOpenChange={setIsFullScreenOpen}>
        <DialogContent className="max-w-[95vw] max-h-[95vh] w-[95vw] h-[95vh] p-0">
          <DialogHeader className="absolute top-4 left-4 z-50 bg-background/90 backdrop-blur-sm rounded-lg p-3 border">
            <DialogTitle className="flex items-center space-x-2">
              <Globe className="h-5 w-5 text-hydrogen-green" />
              <span>Full Screen Map</span>
            </DialogTitle>
          </DialogHeader>
          
          {/* Close Button */}
          <Button
            variant="outline"
            size="sm"
            className="absolute top-4 right-4 z-50 bg-background/90 backdrop-blur-sm border"
            onClick={() => setIsFullScreenOpen(false)}
          >
            <X className="w-4 h-4" />
          </Button>

                     {/* Map Controls */}
           <div className="absolute top-16 right-4 z-50 flex flex-col space-y-2">
             <Button
               variant="outline"
               size="sm"
               className="bg-background/90 backdrop-blur-sm border"
               onClick={handleZoomIn}
             >
               <ZoomIn className="w-4 h-4" />
             </Button>
             <Button
               variant="outline"
               size="sm"
               className="bg-background/90 backdrop-blur-sm border"
               onClick={handleZoomOut}
             >
               <ZoomOut className="w-4 h-4" />
             </Button>
             <Button
               variant="outline"
               size="sm"
               className="bg-background/90 backdrop-blur-sm border"
               onClick={handleHome}
             >
               <Home className="w-4 h-4" />
             </Button>
             <Button
               variant="outline"
               size="sm"
               className="bg-background/90 backdrop-blur-sm border"
               onClick={handleReset}
             >
               <RotateCcw className="w-4 h-4" />
             </Button>
           </div>

                     {/* Full Screen Map */}
           <div className="w-full h-full">
             <MapContainer 
               center={[21.1702, 72.8311]} 
               zoom={8} 
               style={{ height: "100%", width: "100%" }}
             >
               <MapController mapRef={fullScreenMapRef} />
               <TileLayer
                 url={getTileLayerUrl(mapView)}
                 attribution={getTileLayerAttribution(mapView)}
               />
             </MapContainer>
           </div>

          {/* Site Details in Full Screen */}
          {selectedSite && (
            <div className="absolute bottom-4 left-4 z-50 bg-background/90 backdrop-blur-sm rounded-lg p-4 border max-w-md">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-foreground">{selectedSite.name}</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedSite(null)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-muted-foreground">Type:</span>
                  <span className="ml-2 font-medium">{selectedSite.type}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Status:</span>
                  <span className="ml-2 font-medium">{selectedSite.status}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Capacity:</span>
                  <span className="ml-2 font-medium">{selectedSite.capacity} MW</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Efficiency:</span>
                  <span className="ml-2 font-medium">{selectedSite.efficiency}%</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Investment:</span>
                  <span className="ml-2 font-medium">{selectedSite.investment}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Workforce:</span>
                  <span className="ml-2 font-medium">{selectedSite.workforce}</span>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Mapping;
