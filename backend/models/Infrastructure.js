import mongoose from 'mongoose';

const infrastructureSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    enum: ['pipeline', 'road', 'railway', 'port', 'airport', 'demand-center', 'storage-facility', 'refueling-station'],
    required: true
  },
  category: {
    type: String,
    enum: ['transport', 'energy', 'industrial', 'commercial', 'residential'],
    required: true
  },
  status: {
    type: String,
    enum: ['operational', 'under-construction', 'planned', 'decommissioned', 'maintenance'],
    default: 'operational'
  },
  location: {
    type: {
      type: String,
      enum: ['Point', 'LineString', 'Polygon'],
      default: 'Point'
    },
    coordinates: {
      type: mongoose.Schema.Types.Mixed,
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
  // Pipeline specific fields
  pipelineFields: {
    diameter: Number, // inches
    material: {
      type: String,
      enum: ['steel', 'plastic', 'composite', 'other']
    },
    pressure: Number, // psi
    flowCapacity: Number, // m³/day
    commodity: {
      type: String,
      enum: ['hydrogen', 'natural-gas', 'oil', 'water', 'other']
    },
    length: Number, // km
    startPoint: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point'
      },
      coordinates: [Number]
    },
    endPoint: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point'
      },
      coordinates: [Number]
    }
  },
  // Transport network fields
  transportFields: {
    roadType: {
      type: String,
      enum: ['highway', 'arterial', 'collector', 'local', 'other']
    },
    railType: {
      type: String,
      enum: ['freight', 'passenger', 'high-speed', 'light-rail', 'other']
    },
    portType: {
      type: String,
      enum: ['cargo', 'passenger', 'fishing', 'military', 'other']
    },
    airportType: {
      type: String,
      enum: ['international', 'domestic', 'regional', 'private', 'other']
    },
    capacity: Number,
    capacityUnit: String
  },
  // Demand center fields
  demandCenterFields: {
    demandType: {
      type: String,
      enum: ['industrial', 'transport', 'power-generation', 'residential', 'commercial', 'agricultural']
    },
    hydrogenDemand: {
      current: Number, // tons/day
      projected: Number, // tons/day
      unit: {
        type: String,
        default: 'tons/day'
      }
    },
    industryType: {
      type: String,
      enum: ['steel', 'cement', 'chemicals', 'refining', 'glass', 'food-processing', 'other']
    },
    operationalHours: Number, // hours/day
    seasonalVariation: {
      type: String,
      enum: ['none', 'low', 'medium', 'high']
    }
  },
  // Storage facility fields
  storageFields: {
    storageType: {
      type: String,
      enum: ['underground', 'above-ground', 'cryogenic', 'compressed-gas', 'liquid', 'other']
    },
    capacity: Number,
    capacityUnit: String,
    pressure: Number, // psi
    temperature: Number, // °C
    safetyFeatures: [String]
  },
  // Refueling station fields
  refuelingFields: {
    fuelTypes: [{
      type: String,
      enum: ['hydrogen', 'electric', 'natural-gas', 'biodiesel', 'other']
    }],
    dailyCapacity: Number, // vehicles/day
    operatingHours: Number, // hours/day
    paymentMethods: [String],
    amenities: [String]
  },
  // Connectivity and accessibility
  connectivity: {
    roadAccess: { type: Boolean, default: false },
    railAccess: { type: Boolean, default: false },
    waterAccess: { type: Boolean, default: false },
    airAccess: { type: Boolean, default: false },
    internetConnectivity: { type: Boolean, default: false },
    powerGridConnection: { type: Boolean, default: false }
  },
  // Environmental and regulatory information
  environmentalImpact: {
    landUse: Number, // hectares
    noiseLevel: Number, // dB
    airQualityImpact: {
      type: String,
      enum: ['low', 'medium', 'high']
    },
    waterQualityImpact: {
      type: String,
      enum: ['low', 'medium', 'high']
    }
  },
  regulatoryStatus: {
    permits: [{
      type: String,
      status: String,
      expiryDate: Date,
      issuingAuthority: String
    }],
    environmentalAssessments: [{
      type: String,
      status: String,
      completionDate: Date
    }],
    zoning: {
      type: String,
      enum: ['industrial', 'commercial', 'residential', 'mixed-use', 'agricultural', 'other']
    }
  },
  // Performance and operational metrics
  performance: {
    availability: Number, // percentage
    efficiency: Number, // percentage
    throughput: Number,
    throughputUnit: String,
    downtime: Number, // hours/year
    maintenanceFrequency: Number // days
  },
  // Financial information
  financial: {
    capitalCost: Number, // USD
    operationalCost: Number, // USD/year
    maintenanceCost: Number, // USD/year
    revenue: Number, // USD/year
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
    expectedLifespan: Number, // years
    lastMaintenance: Date,
    nextMaintenance: Date
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
infrastructureSchema.index({ location: '2dsphere' });

// Create text index for search
infrastructureSchema.index({
  name: 'text',
  'address.city': 'text',
  'address.state': 'text',
  'address.country': 'text',
  type: 'text',
  category: 'text'
});

// Virtual for formatted address
infrastructureSchema.virtual('formattedAddress').get(function() {
  const addr = this.address;
  if (!addr) return '';
  
  const parts = [addr.street, addr.city, addr.state, addr.country].filter(Boolean);
  return parts.join(', ');
});

// Method to calculate distance to another point
infrastructureSchema.methods.distanceTo = function(coordinates) {
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
  return null;
};

// Static method to find infrastructure within radius
infrastructureSchema.statics.findWithinRadius = function(center, radiusKm, type = null, category = null) {
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
  
  if (type) query.type = type;
  if (category) query.category = category;
  
  return this.find(query);
};

// Static method to find infrastructure by type and region
infrastructureSchema.statics.findByTypeAndRegion = function(type, region) {
  return this.find({
    type: type,
    'address.country': region
  });
};

// Static method to find demand centers by industry type
infrastructureSchema.statics.findDemandCentersByIndustry = function(industryType) {
  return this.find({
    type: 'demand-center',
    'demandCenterFields.industryType': industryType
  });
};

const Infrastructure = mongoose.model('Infrastructure', infrastructureSchema);

export default Infrastructure;
