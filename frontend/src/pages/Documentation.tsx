import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BookOpen, 
  Map, 
  Database, 
  Code, 
  Lightbulb, 
  Target, 
  Zap, 
  Globe, 
  Layers, 
  TrendingUp,
  FileText,
  GitBranch,
  Server,
  Monitor,
  Shield,
  Users
} from "lucide-react";

const Documentation = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/30">
      {/* Hero Section */}
      <section className="relative py-16 lg:py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-hydrogen-green/10 via-tech-blue/10 to-success-emerald/10"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-hydrogen-green/20 to-tech-blue/20 backdrop-blur-sm rounded-full px-6 py-3 text-sm font-medium mb-6">
              <BookOpen className="w-4 h-4 text-hydrogen-green" />
              <span className="text-foreground">Project Documentation</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6">
              Green Hydrogen Infrastructure
              <span className="block bg-gradient-to-r from-hydrogen-green to-tech-blue bg-clip-text text-transparent">
                Mapping & Optimization
              </span>
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
              A comprehensive digital platform for green hydrogen infrastructure mapping, 
              combining geospatial analysis with industrial and regulatory data to accelerate 
              project planning and investment decisions.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-4 bg-secondary/50 mb-8">
              <TabsTrigger value="overview" className="data-[state=active]:bg-background">Overview</TabsTrigger>
              <TabsTrigger value="architecture" className="data-[state=active]:bg-background">Architecture</TabsTrigger>
              <TabsTrigger value="technology" className="data-[state=active]:bg-background">Technology</TabsTrigger>
              <TabsTrigger value="approach" className="data-[state=active]:bg-background">Approach</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-8">
              {/* Problem Statement */}
              <Card className="group hover:shadow-medium transition-all duration-300 border-0 bg-gradient-card">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-red-500/20 rounded-lg">
                      <Target className="h-5 w-5 text-red-500" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">Problem Statement</CardTitle>
                      <CardDescription>Challenges in hydrogen infrastructure development</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground leading-relaxed">
                    Hydrogen infrastructure development faces significant challenges including lack of coordinated mapping tools, 
                    data silos across regions, and difficulty in assessing real-time feasibility of projects. A digital mapping 
                    solution can consolidate geospatial, industrial, and environmental datasets to support planning and investment decisions.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                      <h4 className="font-semibold text-red-700 mb-2">Lack of Coordination</h4>
                      <p className="text-sm text-red-600">No unified mapping tools across regions</p>
                    </div>
                    <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                      <h4 className="font-semibold text-orange-700 mb-2">Data Silos</h4>
                      <p className="text-sm text-orange-600">Fragmented data across different regions</p>
                    </div>
                    <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                      <h4 className="font-semibold text-yellow-700 mb-2">Feasibility Assessment</h4>
                      <p className="text-sm text-yellow-600">Difficulty in real-time project evaluation</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Key Conditions */}
              <Card className="group hover:shadow-medium transition-all duration-300 border-0 bg-gradient-card">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-hydrogen-green/20 rounded-lg">
                      <Lightbulb className="h-5 w-5 text-hydrogen-green" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">Key Conditions for Growth</CardTitle>
                      <CardDescription>Factors influencing hydrogen ecosystem success</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[
                      { title: "Renewable Energy Proximity", desc: "Solar, wind, and hydro power sources", icon: Zap, color: "text-yellow-500" },
                      { title: "Water Resources", desc: "Access to water for electrolysis", icon: Globe, color: "text-blue-500" },
                      { title: "Industrial Clusters", desc: "Steel, cement, refineries demanding hydrogen", icon: Target, color: "text-red-500" },
                      { title: "Transport Connectivity", desc: "Roads, pipelines, ports", icon: TrendingUp, color: "text-green-500" },
                      { title: "Government Policies", desc: "Incentives and land-use permissions", icon: Shield, color: "text-purple-500" },
                      { title: "Environmental Constraints", desc: "Protected areas, emission zones", icon: Layers, color: "text-emerald-500" }
                    ].map((condition, index) => (
                      <div key={index} className="p-4 bg-secondary/30 rounded-lg border border-border/50">
                        <div className="flex items-center space-x-3 mb-3">
                          <condition.icon className={`h-5 w-5 ${condition.color}`} />
                          <h4 className="font-semibold text-foreground">{condition.title}</h4>
                        </div>
                        <p className="text-sm text-muted-foreground">{condition.desc}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Technology Tab */}
            <TabsContent value="technology" className="space-y-8">
              <Card className="group hover:shadow-medium transition-all duration-300 border-0 bg-gradient-card">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-tech-blue/20 rounded-lg">
                      <Code className="h-5 w-5 text-tech-blue" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">Technology Stack</CardTitle>
                      <CardDescription>Modern technologies powering the platform</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[
                      { name: "React.js", category: "Frontend", icon: Monitor, color: "text-blue-500" },
                      { name: "Node.js", category: "Backend", icon: Server, color: "text-green-500" },
                      { name: "Express", category: "Backend", icon: Code, color: "text-gray-500" },
                      { name: "MongoDB", category: "Database", icon: Database, color: "text-green-600" },
                      { name: "PostGIS", category: "Database", icon: Layers, color: "text-blue-600" },
                      { name: "Mapbox", category: "Maps", icon: Map, color: "text-purple-500" },
                      { name: "Leaflet", category: "Maps", icon: Globe, color: "text-green-500" },
                      { name: "GeoJSON", category: "Data Format", icon: FileText, color: "text-orange-500" }
                    ].map((tech, index) => (
                      <div key={index} className="p-4 bg-secondary/30 rounded-lg border border-border/50 text-center">
                        <tech.icon className={`h-8 w-8 mx-auto mb-3 ${tech.color}`} />
                        <h4 className="font-semibold text-foreground mb-1">{tech.name}</h4>
                        <Badge variant="outline" className="text-xs">{tech.category}</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Architecture Tab */}
            <TabsContent value="architecture" className="space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {[
                  {
                    title: "Data Sources",
                    items: ["Open datasets: renewable energy zones (solar, wind)", "Hydrogen plants, pipelines, roads, ports", "Demand centers, regulatory zones", "Formats: CSV, GeoJSON, APIs, satellite layers"],
                    icon: Database,
                    color: "text-blue-500"
                  },
                  {
                    title: "Data Layer",
                    items: ["Ingest and clean data using ETL pipeline", "Store in geospatial database (PostGIS/MongoDB)", "GeoJSON format for spatial data"],
                    icon: Layers,
                    color: "text-green-500"
                  },
                  {
                    title: "Decision Model",
                    items: ["Proximity to renewable energy", "Distance to demand centers", "Transport connectivity", "Policy/regulation constraints", "Site suitability scoring"],
                    icon: Target,
                    color: "text-purple-500"
                  },
                  {
                    title: "Backend API",
                    items: ["Node.js/Express serving processed data", "REST endpoints for datasets", "Model results and recommendations", "Real-time data updates"],
                    icon: Server,
                    color: "text-orange-500"
                  },
                  {
                    title: "Frontend Dashboard",
                    items: ["React + Mapbox/Leaflet visualization", "Interactive map layers", "Existing assets overlay", "Renewable resources mapping"],
                    icon: Monitor,
                    color: "text-cyan-500"
                  }
                ].map((component, index) => (
                  <Card key={index} className="group hover:shadow-medium transition-all duration-300 border-0 bg-gradient-card">
                    <CardHeader>
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 ${component.color.replace('text-', 'bg-')}/20 rounded-lg`}>
                          <component.icon className={`h-5 w-5 ${component.color}`} />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{component.title}</CardTitle>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {component.items.map((item, itemIndex) => (
                          <li key={itemIndex} className="flex items-start space-x-2">
                            <div className="w-1.5 h-1.5 bg-muted-foreground rounded-full mt-2 flex-shrink-0"></div>
                            <span className="text-sm text-muted-foreground">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Approach Tab */}
            <TabsContent value="approach" className="space-y-8">
              <Card className="group hover:shadow-medium transition-all duration-300 border-0 bg-gradient-card">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-success-emerald/20 rounded-lg">
                      <GitBranch className="h-5 w-5 text-success-emerald" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">Implementation Approach</CardTitle>
                      <CardDescription>Step-by-step development methodology</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-foreground mb-4">Thought Process</h3>
                    <div className="space-y-4">
                      {[
                        { step: "1", title: "Ecosystem Understanding", desc: "Analyze hydrogen production, storage, transport, and demand points" },
                        { step: "2", title: "Data Layer Identification", desc: "Identify renewable energy sources, infrastructure, demand centers, transport logistics, and regulatory zones" },
                        { step: "3", title: "Data Integration", desc: "Collect, clean, and integrate datasets into a GIS-enabled platform" },
                        { step: "4", title: "AI/ML Analysis", desc: "Apply models to analyze cost, proximity, and demand for optimal site recommendations" },
                        { step: "5", title: "Visualization & Decision Support", desc: "Interactive map dashboard with filters and scoring for data-driven investment decisions" }
                      ].map((item, index) => (
                        <div key={index} className="flex items-start space-x-4">
                          <div className="flex-shrink-0 w-8 h-8 bg-hydrogen-green/20 rounded-full flex items-center justify-center">
                            <span className="text-sm font-bold text-hydrogen-green">{item.step}</span>
                          </div>
                          <div>
                            <h4 className="font-semibold text-foreground mb-1">{item.title}</h4>
                            <p className="text-sm text-muted-foreground">{item.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Conclusion */}
              <Card className="group hover:shadow-medium transition-all duration-300 border-0 bg-gradient-to-r from-hydrogen-green/10 to-tech-blue/10">
                <CardContent className="pt-8">
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-2 text-hydrogen-green mb-4">
                      <Target className="h-6 w-6" />
                      <p className="font-semibold text-lg">Conclusion</p>
                    </div>
                    <p className="text-muted-foreground mb-6 max-w-3xl mx-auto leading-relaxed">
                      A structured digital mapping solution for green hydrogen can accelerate project planning and 
                      investment decisions. By combining geospatial analysis with industrial and regulatory data, 
                      stakeholders can identify the most promising hubs for hydrogen adoption and growth. This platform 
                      enables companies, policymakers, and investors to make data-driven decisions for the future of 
                      sustainable energy infrastructure.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <Button variant="hero" size="lg" className="group">
                        Access Platform
                        <Map className="w-5 h-5 group-hover:scale-110 transition-transform ml-2" />
                      </Button>
                      <Button variant="outline" size="lg">
                        View Demo
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </div>
  );
};

export default Documentation;
