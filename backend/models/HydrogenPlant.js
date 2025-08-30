import mongoose from 'mongoose';

const hydrogenPlantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    enum: ['electrolysis', 'steam-methane-reforming', 'biomass-gasification', 'thermochemical'],
    required: true
  },
  status: {
    type: String,
    enum: ['operational', 'under-construction', 'planned', 'decommissioned'],
    default: 'planned'
  },
  capacity: {
    type: Number, // in MW or tons/day
    required: true
  },
  capacityUnit: {
    type: String,
    enum: ['MW', 'tons/day', 'kg/hour'],
    default: 'MW'
  },
  technology: {
    type: String,
    enum: ['alkaline', 'PEM', 'SOEC', 'other'],
    required: true
  },
  renewableSource: {
    type: String,
    enum: ['solar', 'wind', 'hydro', 'geothermal', 'biomass', 'mixed', 'grid'],
    required: true
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true,
      validate: {
        validator: function(v) {
          return v.length === 2 && 
                 v[0] >= -180 && v[0] <= 180 && 
                 v[1] >= -90 && v[1] <= 90;
        },
        message: 'Coordinates must be valid longitude and latitude values'
      }
    }
  },
  address: {
    street: String,
    city: String,
    state: String,
    country: String,
    postalCode: String
  },
  waterAvailability: {
    type: String,
    enum: ['high', 'medium', 'low', 'unknown'],
    default: 'unknown'
  },
  waterSource: {
    type: String,
    enum: ['groundwater', 'surface-water', 'desalination', 'recycled', 'other']
  },
  transportConnectivity: {
    roads: { type: Boolean, default: false },
    railways: { type: Boolean, default: false },
    ports: { type: Boolean, default: false },
    pipelines: { type: Boolean, default: false }
  },
  demandCenters: [{
    name: String,
    distance: Number, // in km
    demandType: {
      type: String,
      enum: ['industrial', 'transport', 'power-generation', 'residential']
    }
  }],
  regulatoryZones: [{
    name: String,
    type: String,
    restrictions: [String]
  }],
  environmentalConstraints: [{
    type: String,
    description: String,
    severity: {
      type: String,
      enum: ['low', 'medium', 'high', 'critical']
    }
  }],
  incentives: [{
    name: String,
    type: String,
    value: String,
    expiryDate: Date
  }],
  feasibilityScore: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  costEstimates: {
    capitalCost: Number, // in USD
    operationalCost: Number, // in USD/year
    currency: {
      type: String,
      default: 'USD'
    }
  },
  timeline: {
    startDate: Date,
    completionDate: Date,
    operationalDate: Date
  },
  contact: {
    company: String,
    email: String,
    phone: String,
    website: String
  },
  documents: [{
    name: String,
    url: String,
    type: String,
    uploadDate: Date
  }],
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
    }
  }
}, {
  timestamps: true
});

// Create geospatial index for location queries
hydrogenPlantSchema.index({ location: '2dsphere' });

// Create text index for search functionality
hydrogenPlantSchema.index({
  name: 'text',
  'address.city': 'text',
  'address.state': 'text',
  'address.country': 'text',
  technology: 'text'
});

// Virtual for formatted address
hydrogenPlantSchema.virtual('formattedAddress').get(function() {
  const addr = this.address;
  if (!addr) return '';
  
  const parts = [addr.street, addr.city, addr.state, addr.country].filter(Boolean);
  return parts.join(', ');
});

// Method to calculate distance to another point
hydrogenPlantSchema.methods.distanceTo = function(coordinates) {
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
};

// Static method to find plants within radius
hydrogenPlantSchema.statics.findWithinRadius = function(center, radiusKm) {
  return this.find({
    location: {
      $near: {
        $geometry: {
          type: 'Point',
          coordinates: center
        },
        $maxDistance: radiusKm * 1000 // Convert km to meters
      }
    }
  });
};

// Pre-save middleware to update feasibility score
hydrogenPlantSchema.pre('save', function(next) {
  // Simple feasibility scoring algorithm
  let score = 0;
  
  // Renewable source scoring
  const renewableScores = {
    'solar': 25, 'wind': 25, 'hydro': 20, 'geothermal': 20,
    'biomass': 15, 'mixed': 20, 'grid': 5
  };
  score += renewableScores[this.renewableSource] || 0;
  
  // Water availability scoring
  const waterScores = { 'high': 20, 'medium': 15, 'low': 10, 'unknown': 5 };
  score += waterScores[this.waterAvailability];
  
  // Transport connectivity scoring
  const transportScore = Object.values(this.transportConnectivity)
    .filter(Boolean).length * 5;
  score += Math.min(transportScore, 20);
  
  // Demand centers scoring
  const demandScore = this.demandCenters.length * 3;
  score += Math.min(demandScore, 15);
  
  this.feasibilityScore = Math.min(score, 100);
  next();
});

const HydrogenPlant = mongoose.model('HydrogenPlant', hydrogenPlantSchema);

export default HydrogenPlant;
