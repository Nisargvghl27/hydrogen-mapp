import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TrendingUp, DollarSign, BarChart3, Target, Zap, MapPin, Calculator, PieChart, LineChart, ArrowUpRight, ArrowDownRight, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Investments = () => {
  const navigate = useNavigate();
  
  const investmentMetrics = [
    {
      icon: DollarSign,
      title: "Total Investment",
      value: "$12.8B",
      change: "+18.5%",
      changeType: "positive",
      description: "vs. last quarter"
    },
    {
      icon: TrendingUp,
      title: "Average ROI",
      value: "16.8%",
      change: "+2.3%",
      changeType: "positive",
      description: "vs. last quarter"
    },
    {
      icon: Target,
      title: "Active Projects",
      value: "156",
      change: "+12",
      changeType: "positive",
      description: "vs. last quarter"
    },
    {
      icon: Zap,
      title: "Capacity Added",
      value: "2.4 GW",
      change: "+0.8 GW",
      changeType: "positive",
      description: "vs. last quarter"
    }
  ];

  const investmentOpportunities = [
    {
      name: "Solar Hydrogen Valley",
      location: "California, USA",
      investment: "$2.5B",
      capacity: "500 MW",
      roi: "18.5%",
      payback: "5.4 years",
      risk: "Low",
      status: "Open for Investment"
    },
    {
      name: "Wind Coast Facility",
      location: "Texas, USA",
      investment: "$1.8B",
      capacity: "300 MW",
      roi: "16.2%",
      payback: "6.1 years",
      risk: "Medium",
      status: "Open for Investment"
    },
    {
      name: "Hydro Hub Central",
      location: "Washington, USA",
      investment: "$2.1B",
      capacity: "400 MW",
      roi: "15.8%",
      payback: "6.3 years",
      risk: "Medium",
      status: "Open for Investment"
    }
  ];

  const marketTrends = [
    { month: "Jan", investment: 2.1, roi: 14.2 },
    { month: "Feb", investment: 2.8, roi: 15.1 },
    { month: "Mar", investment: 3.2, roi: 15.8 },
    { month: "Apr", investment: 2.9, roi: 16.1 },
    { month: "May", investment: 3.5, roi: 16.5 },
    { month: "Jun", investment: 4.2, roi: 16.8 }
  ];

  const sectorBreakdown = [
    { sector: "Production", percentage: 45, color: "text-hydrogen-green" },
    { sector: "Storage", percentage: 25, color: "text-tech-blue" },
    { sector: "Distribution", percentage: 20, color: "text-success-emerald" },
    { sector: "Transport", percentage: 10, color: "text-hydrogen-dark" }
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
              <TrendingUp className="w-4 h-4 text-hydrogen-green" />
              <span className="text-foreground">Investment Insights</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6">
              Investment
              <span className="block bg-gradient-to-r from-hydrogen-green to-tech-blue bg-clip-text text-transparent">
                & Financial Analysis
              </span>
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Data-driven investment recommendations and financial analysis for hydrogen infrastructure projects. 
              Make informed decisions with comprehensive ROI analysis and market insights.
            </p>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            {investmentMetrics.map((metric, index) => (
              <Card key={index} className="group hover:shadow-medium transition-all duration-300 border-0 bg-gradient-card">
                <CardContent className="p-6 text-center">
                  <div className="flex items-center justify-center mb-4">
                    <div className="p-3 bg-hydrogen-green/20 rounded-full">
                      <metric.icon className="h-6 w-6 text-hydrogen-green" />
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-foreground mb-2">{metric.value}</div>
                  <div className="flex items-center justify-center gap-2 mb-2">
                    {metric.changeType === "positive" ? (
                      <ArrowUpRight className="w-4 h-4 text-success-emerald" />
                    ) : (
                      <ArrowDownRight className="w-4 h-4 text-destructive" />
                    )}
                    <span className={`text-sm font-medium ${
                      metric.changeType === "positive" ? "text-success-emerald" : "text-destructive"
                    }`}>
                      {metric.change}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">{metric.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            {/* Investment Opportunities */}
            <Card className="group hover:shadow-medium transition-all duration-300 border-0 bg-gradient-card">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-hydrogen-green/20 rounded-lg">
                    <Target className="h-5 w-5 text-hydrogen-green" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">Investment Opportunities</CardTitle>
                    <CardDescription>Top hydrogen infrastructure projects available for investment</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {investmentOpportunities.map((opportunity, index) => (
                  <div key={index} className="p-4 bg-secondary/30 rounded-lg border-l-4 border-hydrogen-green">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold text-foreground">{opportunity.name}</h4>
                      <Badge variant="default">{opportunity.status}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{opportunity.location}</p>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <span className="text-muted-foreground">Investment:</span>
                        <span className="font-medium text-foreground ml-1">{opportunity.investment}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Capacity:</span>
                        <span className="font-medium text-foreground ml-1">{opportunity.capacity}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">ROI:</span>
                        <span className="font-medium text-foreground ml-1">{opportunity.roi}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Payback:</span>
                        <span className="font-medium text-foreground ml-1">{opportunity.payback}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-3">
                      <Badge variant="outline" className="text-xs">
                        Risk: {opportunity.risk}
                      </Badge>
                      <Button size="sm" variant="outline">
                        View Details
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Market Analysis */}
            <Card className="group hover:shadow-medium transition-all duration-300 border-0 bg-gradient-card">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-tech-blue/20 rounded-lg">
                    <BarChart3 className="h-5 w-5 text-tech-blue" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">Market Analysis</CardTitle>
                    <CardDescription>Investment trends and sector breakdown</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="trends" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 bg-secondary/50">
                    <TabsTrigger value="trends" className="data-[state=active]:bg-background">Trends</TabsTrigger>
                    <TabsTrigger value="sectors" className="data-[state=active]:bg-background">Sectors</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="trends" className="space-y-4 mt-4">
                    <div className="h-48 bg-gradient-to-br from-hydrogen-green/10 to-tech-blue/10 rounded-xl border border-border/50 flex items-center justify-center">
                      <div style={{ textAlign: "center" }}>
                        <LineChart className="h-12 w-12 text-hydrogen-green mx-auto mb-4 opacity-50" />
                        <h3 className="text-lg font-semibold text-foreground mb-2">Investment Trends</h3>
                        <p className="text-muted-foreground">Monthly investment and ROI trends</p>
                      </div>
                    </div>
                    <div className="text-center text-muted-foreground">
                      <p>Investment volume and ROI performance over time</p>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="sectors" className="space-y-4 mt-4">
                    <div className="h-48 bg-gradient-to-br from-success-emerald/10 to-hydrogen-green/10 rounded-xl border border-border/50 flex items-center justify-center">
                      <div style={{ textAlign: "center" }}>
                        <PieChart className="h-12 w-12 text-success-emerald mx-auto mb-4 opacity-50" />
                        <h3 className="text-lg font-semibold text-foreground mb-2">Sector Breakdown</h3>
                        <p className="text-muted-foreground">Investment distribution by sector</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      {sectorBreakdown.map((sector, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">{sector.sector}</span>
                          <span className={`text-sm font-medium ${sector.color}`}>{sector.percentage}%</span>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Financial Calculator */}
          <Card className="group hover:shadow-medium transition-all duration-300 border-0 bg-gradient-card mb-12">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-success-emerald/20 rounded-lg">
                  <Calculator className="h-5 w-5 text-success-emerald" />
                </div>
                <div>
                  <CardTitle className="text-xl">Investment Calculator</CardTitle>
                  <CardDescription>Calculate potential returns and payback periods</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">Initial Investment</label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <input
                        type="number"
                        placeholder="1,000,000"
                        className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-background focus:ring-2 focus:ring-hydrogen-green focus:border-transparent"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">Expected Annual Return (%)</label>
                    <input
                      type="number"
                      placeholder="15"
                      className="w-full px-4 py-2 border border-border rounded-lg bg-background focus:ring-2 focus:ring-hydrogen-green focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">Investment Period (Years)</label>
                    <input
                      type="number"
                      placeholder="10"
                      className="w-full px-4 py-2 border border-border rounded-lg bg-background focus:ring-2 focus:ring-hydrogen-green focus:border-transparent"
                    />
                  </div>
                  <Button className="w-full" variant="hero">
                    Calculate Returns
                  </Button>
                </div>
                
                <div className="bg-secondary/30 rounded-lg p-6">
                  <h4 className="font-semibold text-foreground mb-4">Projected Results</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Total Return:</span>
                      <span className="font-medium text-foreground">$4,045,558</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Annual Return:</span>
                      <span className="font-medium text-foreground">$404,556</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Payback Period:</span>
                      <span className="font-medium text-foreground">6.7 years</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">ROI:</span>
                      <span className="font-medium text-success-emerald">404.6%</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Call to Action */}
          <Card className="bg-gradient-to-r from-hydrogen-green/10 to-tech-blue/10 border-0">
            <CardContent className="pt-8">
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 text-hydrogen-green mb-4">
                  <TrendingUp className="h-6 w-6" />
                  <p className="font-semibold text-lg">Ready to Invest in Hydrogen?</p>
                </div>
                <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                  Access our comprehensive investment platform to discover opportunities, 
                  analyze returns, and make data-driven investment decisions in hydrogen infrastructure.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button variant="hero" size="lg" className="group">
                    Explore Opportunities
                    <TrendingUp className="w-5 h-5 group-hover:scale-110 transition-transform ml-2" />
                  </Button>
                  <Button variant="outline" size="lg">
                    Schedule Consultation
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

export default Investments;
