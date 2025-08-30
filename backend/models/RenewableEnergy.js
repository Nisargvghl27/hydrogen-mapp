import mongoose from 'mongoose';

const renewableEnergySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    enum: ['solar', 'wind', 'hydro', 'geothermal', 'biomass', 'tidal', 'wave'],
    required: true
  },
  status: {
    type: String,
    enum: ['operational', 'under-construction', 'planned', 'decommissioned'],
    default: 'operational'
  },
  capacity: {
    type: Number,
    required: true
  },
  capacityUnit: {
    type: String,
    enum: ['MW', 'GW', 'MWh', 'GWh'],
    default: 'MW'
  },
  location: {
    type: {
      type: String,
      enum: ['Point', 'Polygon'],
      default: 'Point'
    },
    coordinates: {
      type: mongoose.Schema.Types.Mixed, // Can be [lng, lat] for Point or [[[lng, lat]]] for Polygon
      required: true
    }
  },
  address: {
    street: String,
    city: String,
    state: String,
    country: String,
    postalCode: String
  },
  // Solar specific fields
  solarFields: {
    panelType: {
      type: String,
      enum: ['monocrystalline', 'polycrystalline', 'thin-film', 'concentrated', 'other']
    },
    efficiency: Number, // percentage
    tiltAngle: Number, // degrees
    azimuth: Number, // degrees
    groundCoverageRatio: Number
  },
  // Wind specific fields
  windFields: {
    turbineType: {
      type: String,
      enum: ['onshore', 'offshore', 'vertical-axis', 'horizontal-axis']
    },
    hubHeight: Number, // meters
    rotorDiameter: Number, // meters
    cutInSpeed: Number, // m/s
    cutOutSpeed: Number, // m/s
    ratedSpeed: Number // m/s
  },
  // Hydro specific fields
  hydroFields: {
    damType: {
      type: String,
      enum: ['reservoir', 'run-of-river', 'pumped-storage', 'tidal']
    },
    headHeight: Number, // meters
    flowRate: Number, // m³/s
    reservoirCapacity: Number // m³
  },
  // Geothermal specific fields
  geothermalFields: {
    wellDepth: Number, // meters
    temperature: Number, // °C
    flowRate: Number, // L/s
    resourceType: {
      type: String,
      enum: ['vapor-dominated', 'liquid-dominated', 'hot-dry-rock']
    }
  },
  // Biomass specific fields
  biomassFields: {
    feedstockType: {
      type: String,
      enum: ['wood', 'agricultural-residues', 'energy-crops', 'municipal-waste', 'animal-waste']
    },
    conversionTechnology: {
      type: String,
      enum: ['combustion', 'gasification', 'anaerobic-digestion', 'pyrolysis']
    },
    feedstockAvailability: {
      type: String,
      enum: ['high', 'medium', 'low']
    }
  },
  // Environmental and regulatory information
  environmentalImpact: {
    landUse: Number, // hectares
    carbonOffset: Number, // tons CO2/year
    biodiversityImpact: {
      type: String,
      enum: ['low', 'medium', 'high']
    }
  },
  regulatoryStatus: {
    permits: [{
      type: String,
      status: String,
      expiryDate: Date
    }],
    environmentalAssessments: [{
      type: String,
      status: String,
      completionDate: Date
    }]
  },
  // Infrastructure connectivity
  gridConnection: {
    voltage: Number, // kV
    distanceToGrid: Number, // km
    connectionType: {
      type: String,
      enum: ['transmission', 'distribution', 'microgrid', 'off-grid']
    }
  },
  // Performance metrics
  performance: {
    capacityFactor: Number, // percentage
    availability: Number, // percentage
    efficiency: Number, // percentage
    annualGeneration: Number, // MWh
    peakGeneration: Number, // MW
    downtime: Number // hours/year
  },
  // Financial information
  financial: {
    capitalCost: Number, // USD
    operationalCost: Number, // USD/year
    levelizedCost: Number, // USD/MWh
    currency: {
      type: String,
      default: 'USD'
    }
  },
  // Timeline
  timeline: {
    startDate: Date,
    completionDate: Date,
    operationalDate: Date,
    expectedLifespan: Number // years
  },
  // Contact and ownership
  contact: {
    owner: String,
    operator: String,
    email: String,
    phone: String,
    website: String
  },
  // Data quality and source
  metadata: {
    dataSource: String,
    lastUpdated: {
      type: Date,
      default: Date.now
    },
    accuracy: {
      type: String,
      enum: ['high', 'medium', 'low'],
      default: 'medium'
    },
    updateFrequency: {
      type: String,
      enum: ['real-time', 'hourly', 'daily', 'weekly', 'monthly', 'yearly']
    }
  }
}, {
  timestamps: true
});

// Create geospatial index
renewableEnergySchema.index({ location: '2dsphere' });

// Create text index for search
renewableEnergySchema.index({
  name: 'text',
  'address.city': 'text',
  'address.state': 'text',
  'address.country': 'text',
  type: 'text'
});

// Virtual for formatted address
renewableEnergySchema.virtual('formattedAddress').get(function() {
  const addr = this.address;
  if (!addr) return '';
  
  const parts = [addr.street, addr.city, addr.state, addr.country].filter(Boolean);
  return parts.join(', ');
});

// Method to calculate distance to another point
renewableEnergySchema.methods.distanceTo = function(coordinates) {
  if (this.location.type === 'Point') {
    const R = 6371; // Earth's radius in km
    const lat1 = this.location.coordinates[1];
    const lon1 = this.location.coordinates[0];
    const lat2 = coordinates[1];
    const lon2 = coordinates[0];
    
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }
  return null; // For polygon locations, distance calculation is more complex
};

// Static method to find renewable energy sources within radius
renewableEnergySchema.statics.findWithinRadius = function(center, radiusKm, type = null) {
  const query = {
    location: {
      $near: {
        $geometry: {
          type: 'Point',
          coordinates: center
        },
        $maxDistance: radiusKm * 1000
      }
    }
  };
  
  if (type) {
    query.type = type;
  }
  
  return this.find(query);
};

// Static method to find renewable energy sources by type and region
renewableEnergySchema.statics.findByTypeAndRegion = function(type, region) {
  return this.find({
    type: type,
    'address.country': region
  });
};

// Pre-save middleware to calculate performance metrics
renewableEnergySchema.pre('save', function(next) {
  // Calculate capacity factor if annual generation and capacity are available
  if (this.performance && this.performance.annualGeneration && this.capacity) {
    const hoursInYear = 8760;
    const capacityInMW = this.capacityUnit === 'GW' ? this.capacity * 1000 : this.capacity;
    this.performance.capacityFactor = (this.performance.annualGeneration / (capacityInMW * hoursInYear)) * 100;
  }
  
  next();
});

const RenewableEnergy = mongoose.model('RenewableEnergy', renewableEnergySchema);

export default RenewableEnergy;
