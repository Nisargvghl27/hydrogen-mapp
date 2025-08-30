import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Building2, 
  Users, 
  Landmark, 
  TrendingUp,
  ArrowRight,
  CheckCircle
} from "lucide-react";

const UseCases = () => {
  const userTypes = [
    {
      icon: Building2,
      title: "Energy Companies",
      description: "Identify optimal locations for hydrogen production facilities and infrastructure investments",
      benefits: [
        "Site suitability analysis",
        "Investment risk assessment", 
        "ROI optimization",
        "Regulatory compliance mapping"
      ],
      color: "border-hydrogen-green"
    },
    {
      icon: Landmark,
      title: "Government & Policy Makers",
      description: "Strategic planning for national hydrogen infrastructure development and policy implementation",
      benefits: [
        "National infrastructure planning",
        "Policy impact assessment",
        "Regional development prioritization",
        "Environmental impact analysis"
      ],
      color: "border-tech-blue"
    },
    {
      icon: Users,
      title: "Infrastructure Planners",
      description: "Comprehensive analysis tools for sustainable hydrogen ecosystem development",
      benefits: [
        "Multi-criteria site evaluation",
        "Transport network optimization",
        "Demand forecasting integration",
        "Environmental constraint mapping"
      ],
      color: "border-success-emerald"
    }
  ];

  const keyConditions = [
    "Proximity to renewable energy sources (solar, wind, hydro)",
    "Access to water resources for electrolysis",
    "Nearness to industrial clusters demanding hydrogen",
    "Transport connectivity (roads, pipelines, ports)",
    "Government policies, incentives, and land-use permissions",
    "Environmental constraints and protected areas"
  ];

  return (
    <section id="use-cases" className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-foreground mb-4">
            Empowering Key Stakeholders
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Tailored solutions for different user groups in the hydrogen ecosystem
          </p>
        </div>

        {/* User Types Grid */}
        <div className="grid lg:grid-cols-3 gap-8 mb-20">
          {userTypes.map((userType, index) => (
            <Card key={index} className={`group hover:shadow-large transition-all duration-300 border-2 ${userType.color} hover:border-primary`}>
              <CardHeader className="text-center pb-6">
                <div className="mx-auto mb-4 p-3 bg-secondary rounded-full w-fit">
                  <userType.icon className="w-8 h-8 text-primary" />
                </div>
                <CardTitle className="text-xl font-bold text-foreground">
                  {userType.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-muted-foreground text-center">
                  {userType.description}
                </p>
                
                <div className="space-y-3">
                  <h4 className="font-semibold text-foreground text-sm uppercase tracking-wide">
                    Key Benefits
                  </h4>
                  <ul className="space-y-2">
                    {userType.benefits.map((benefit, idx) => (
                      <li key={idx} className="flex items-center space-x-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
                        <span className="text-muted-foreground">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  Learn More
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Key Conditions Section */}
        <div className="bg-gradient-to-r from-secondary to-secondary/50 rounded-3xl p-8 lg:p-12">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-3xl font-bold text-foreground">
                  Critical Success Factors
                </h3>
                <p className="text-lg text-muted-foreground">
                  Our platform evaluates essential conditions that influence hydrogen infrastructure success:
                </p>
              </div>
              
              <ul className="space-y-4">
                {keyConditions.map((condition, index) => (
                  <li key={index} className="flex items-start space-x-3">
                    <TrendingUp className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-foreground font-medium">{condition}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="text-center space-y-6">
              <div className="bg-white rounded-2xl p-8 shadow-medium">
                <div className="text-4xl font-bold text-primary mb-2">360°</div>
                <div className="text-lg font-semibold text-foreground mb-2">Comprehensive Analysis</div>
                <div className="text-muted-foreground">
                  Multi-dimensional evaluation of all critical factors for informed decision making
                </div>
              </div>
              
              <Button variant="data" size="lg" className="w-full">
                Start Analysis
                <ArrowRight className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default UseCases;