import mongoose from 'mongoose';

const optimizationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    enum: ['site-selection', 'route-optimization', 'capacity-planning', 'cost-optimization', 'environmental-impact'],
    required: true
  },
  status: {
    type: String,
    enum: ['in-progress', 'completed', 'failed', 'cancelled'],
    default: 'in-progress'
  },
  location: {
    type: {
      type: String,
      enum: ['Point', 'Polygon'],
      default: 'Point'
    },
    coordinates: {
      type: mongoose.Schema.Types.Mixed,
      required: true
    }
  },
  // Site suitability analysis results
  suitabilityScore: {
    overall: {
      type: Number,
      min: 0,
      max: 100,
      required: true
    },
    breakdown: {
      renewableEnergy: {
        score: { type: Number, min: 0, max: 25 },
        weight: { type: Number, min: 0, max: 1, default: 0.25 },
        factors: [String],
        details: String
      },
      waterAvailability: {
        score: { type: Number, min: 0, max: 20 },
        weight: { type: Number, min: 0, max: 1, default: 0.20 },
        factors: [String],
        details: String
      },
      transportConnectivity: {
        score: { type: Number, min: 0, max: 20 },
        weight: { type: Number, min: 0, max: 1, default: 0.20 },
        factors: [String],
        details: String
      },
      demandProximity: {
        score: { type: Number, min: 0, max: 15 },
        weight: { type: Number, min: 0, max: 1, default: 0.15 },
        factors: [String],
        details: String
      },
      regulatoryCompliance: {
        score: { type: Number, min: 0, max: 10 },
        weight: { type: Number, min: 0, max: 1, default: 0.10 },
        factors: [String],
        details: String
      },
      environmentalImpact: {
        score: { type: Number, min: 0, max: 10 },
        weight: { type: Number, min: 0, max: 1, default: 0.10 },
        factors: [String],
        details: String
      }
    }
  },
  // Detailed analysis results
  analysis: {
    renewableEnergySources: [{
      sourceId: { type: mongoose.Schema.Types.ObjectId, ref: 'RenewableEnergy' },
      type: String,
      distance: Number, // km
      capacity: Number,
      capacityUnit: String,
      contribution: Number // percentage to overall score
    }],
    waterResources: {
      availability: {
        type: String,
        enum: ['high', 'medium', 'low', 'unknown']
      },
      source: String,
      distance: Number, // km
      quality: {
        type: String,
        enum: ['excellent', 'good', 'fair', 'poor']
      },
      treatmentRequired: Boolean,
      estimatedCost: Number // USD/m³
    },
    transportInfrastructure: [{
      infrastructureId: { type: mongoose.Schema.Types.ObjectId, ref: 'Infrastructure' },
      type: String,
      distance: Number, // km
      capacity: String,
      condition: {
        type: String,
        enum: ['excellent', 'good', 'fair', 'poor']
      }
    }],
    demandCenters: [{
      centerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Infrastructure' },
      name: String,
      type: String,
      distance: Number, // km
      currentDemand: Number,
      projectedDemand: Number,
      demandUnit: String
    }],
    regulatoryConstraints: [{
      type: String,
      description: String,
      severity: {
        type: String,
        enum: ['low', 'medium', 'high', 'critical']
      },
      impact: String,
      mitigation: String
    }],
    environmentalFactors: [{
      factor: String,
      impact: {
        type: String,
        enum: ['positive', 'negative', 'neutral']
      },
      severity: {
        type: String,
        enum: ['low', 'medium', 'high', 'critical']
      },
      mitigation: String
    }]
  },
  // Cost analysis
  costAnalysis: {
    capitalCosts: {
      landAcquisition: Number, // USD
      construction: Number, // USD
      equipment: Number, // USD
      permits: Number, // USD
      total: Number // USD
    },
    operationalCosts: {
      energy: Number, // USD/year
      water: Number, // USD/year
      maintenance: Number, // USD/year
      labor: Number, // USD/year
      total: Number // USD/year
    },
    levelizedCost: Number, // USD/MWh or USD/kg
    paybackPeriod: Number, // years
    netPresentValue: Number, // USD
    internalRateOfReturn: Number // percentage
  },
  // Risk assessment
  riskAssessment: {
    technical: {
      score: { type: Number, min: 1, max: 5 },
      factors: [String],
      mitigation: [String]
    },
    financial: {
      score: { type: Number, min: 1, max: 5 },
      factors: [String],
      mitigation: [String]
    },
    regulatory: {
      score: { type: Number, min: 1, max: 5 },
      factors: [String],
      mitigation: [String]
    },
    environmental: {
      score: { type: Number, min: 1, max: 5 },
      factors: [String],
      mitigation: [String]
    },
    overall: {
      type: Number,
      min: 1,
      max: 5
    }
  },
  // Recommendations
  recommendations: {
    priority: {
      type: String,
      enum: ['high', 'medium', 'low'],
      required: true
    },
    actions: [{
      action: String,
      priority: String,
      timeline: String,
      cost: Number,
      responsible: String
    }],
    nextSteps: [String],
    alternatives: [{
      location: String,
      coordinates: [Number],
      score: Number,
      pros: [String],
      cons: [String]
    }]
  },
  // Optimization parameters used
  parameters: {
    weights: {
      renewableEnergy: { type: Number, default: 0.25 },
      waterAvailability: { type: Number, default: 0.20 },
      transportConnectivity: { type: Number, default: 0.20 },
      demandProximity: { type: Number, default: 0.15 },
      regulatoryCompliance: { type: Number, default: 0.10 },
      environmentalImpact: { type: Number, default: 0.10 }
    },
    constraints: {
      minDistanceToDemand: Number, // km
      maxDistanceToRenewable: Number, // km
      minWaterAvailability: String,
      maxEnvironmentalImpact: String
    },
    algorithm: {
      type: String,
      enum: ['multi-criteria-analysis', 'genetic-algorithm', 'linear-programming', 'other']
    },
    iterations: Number,
    convergence: Number
  },
  // Execution details
  execution: {
    startTime: Date,
    endTime: Date,
    duration: Number, // seconds
    algorithm: String,
    parameters: mongoose.Schema.Types.Mixed,
    logs: [String],
    errors: [String]
  },
  // User and project information
  user: {
    id: String,
    name: String,
    email: String
  },
  project: {
    id: String,
    name: String,
    description: String
  },
  // Metadata
  metadata: {
    version: String,
    dataSources: [String],
    lastUpdated: {
      type: Date,
      default: Date.now
    },
    accuracy: {
      type: String,
      enum: ['high', 'medium', 'low'],
      default: 'medium'
    }
  }
}, {
  timestamps: true
});

// Create geospatial index
optimizationSchema.index({ location: '2dsphere' });

// Create text index for search
optimizationSchema.index({
  name: 'text',
  type: 'text',
  'recommendations.priority': 'text'
});

// Virtual for execution duration
optimizationSchema.virtual('executionDuration').get(function() {
  if (this.execution.startTime && this.execution.endTime) {
    return (this.execution.endTime - this.execution.startTime) / 1000; // seconds
  }
  return null;
});

// Method to calculate weighted score
optimizationSchema.methods.calculateWeightedScore = function() {
  const breakdown = this.suitabilityScore.breakdown;
  let weightedScore = 0;
  
  Object.keys(breakdown).forEach(key => {
    const component = breakdown[key];
    weightedScore += (component.score * component.weight);
  });
  
  return Math.round(weightedScore);
};

// Pre-save middleware to update overall score
optimizationSchema.pre('save', function(next) {
  if (this.suitabilityScore.breakdown) {
    this.suitabilityScore.overall = this.calculateWeightedScore();
  }
  
  if (this.execution.startTime && this.execution.endTime) {
    this.execution.duration = (this.execution.endTime - this.execution.startTime) / 1000;
  }
  
  next();
});

// Static method to find optimizations by score range
optimizationSchema.statics.findByScoreRange = function(minScore, maxScore) {
  return this.find({
    'suitabilityScore.overall': {
      $gte: minScore,
      $lte: maxScore
    }
  });
};

// Static method to find optimizations by priority
optimizationSchema.statics.findByPriority = function(priority) {
  return this.find({
    'recommendations.priority': priority
  });
};

const Optimization = mongoose.model('Optimization', optimizationSchema);

export default Optimization;
