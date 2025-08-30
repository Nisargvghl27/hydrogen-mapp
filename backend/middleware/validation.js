import Joi from 'joi';
import { ApiError } from './errorHandler.js';

// Validation schemas for different endpoints
const schemas = {
  // Hydrogen Plant schemas
  createHydrogenPlant: Joi.object({
    name: Joi.string().required().trim().min(2).max(100),
    type: Joi.string().valid('electrolysis', 'steam-methane-reforming', 'biomass-gasification', 'thermochemical').required(),
    status: Joi.string().valid('operational', 'under-construction', 'planned', 'decommissioned'),
    capacity: Joi.number().positive().required(),
    capacityUnit: Joi.string().valid('MW', 'tons/day', 'kg/hour'),
    technology: Joi.string().valid('alkaline', 'PEM', 'SOEC', 'other').required(),
    renewableSource: Joi.string().valid('solar', 'wind', 'hydro', 'geothermal', 'biomass', 'mixed', 'grid').required(),
    location: Joi.object({
      type: Joi.string().valid('Point').default('Point'),
      coordinates: Joi.array().items(Joi.number()).length(2).required()
    }).required(),
    address: Joi.object({
      street: Joi.string().trim(),
      city: Joi.string().trim(),
      state: Joi.string().trim(),
      country: Joi.string().trim(),
      postalCode: Joi.string().trim()
    }),
    waterAvailability: Joi.string().valid('high', 'medium', 'low', 'unknown'),
    waterSource: Joi.string().valid('groundwater', 'surface-water', 'desalination', 'recycled', 'other'),
    transportConnectivity: Joi.object({
      roads: Joi.boolean(),
      railways: Joi.boolean(),
      ports: Joi.boolean(),
      pipelines: Joi.boolean()
    }),
    demandCenters: Joi.array().items(Joi.object({
      name: Joi.string().required(),
      distance: Joi.number().positive(),
      demandType: Joi.string().valid('industrial', 'transport', 'power-generation', 'residential')
    })),
    regulatoryZones: Joi.array().items(Joi.object({
      name: Joi.string().required(),
      type: Joi.string(),
      restrictions: Joi.array().items(Joi.string())
    })),
    environmentalConstraints: Joi.array().items(Joi.object({
      type: Joi.string().required(),
      description: Joi.string(),
      severity: Joi.string().valid('low', 'medium', 'high', 'critical')
    })),
    incentives: Joi.array().items(Joi.object({
      name: Joi.string().required(),
      type: Joi.string(),
      value: Joi.string(),
      expiryDate: Joi.date()
    })),
    costEstimates: Joi.object({
      capitalCost: Joi.number().positive(),
      operationalCost: Joi.number().positive(),
      currency: Joi.string().default('USD')
    }),
    timeline: Joi.object({
      startDate: Joi.date(),
      completionDate: Joi.date(),
      operationalDate: Joi.date()
    }),
    contact: Joi.object({
      company: Joi.string().trim(),
      email: Joi.string().email(),
      phone: Joi.string().trim(),
      website: Joi.string().uri()
    }),
    metadata: Joi.object({
      dataSource: Joi.string().trim(),
      accuracy: Joi.string().valid('high', 'medium', 'low')
    })
  }),

  updateHydrogenPlant: Joi.object({
    name: Joi.string().trim().min(2).max(100),
    type: Joi.string().valid('electrolysis', 'steam-methane-reforming', 'biomass-gasification', 'thermochemical'),
    status: Joi.string().valid('operational', 'under-construction', 'planned', 'decommissioned'),
    capacity: Joi.number().positive(),
    capacityUnit: Joi.string().valid('MW', 'tons/day', 'kg/hour'),
    technology: Joi.string().valid('alkaline', 'PEM', 'SOEC', 'other'),
    renewableSource: Joi.string().valid('solar', 'wind', 'hydro', 'geothermal', 'biomass', 'mixed', 'grid'),
    location: Joi.object({
      type: Joi.string().valid('Point'),
      coordinates: Joi.array().items(Joi.number()).length(2)
    }),
    address: Joi.object({
      street: Joi.string().trim(),
      city: Joi.string().trim(),
      state: Joi.string().trim(),
      country: Joi.string().trim(),
      postalCode: Joi.string().trim()
    }),
    waterAvailability: Joi.string().valid('high', 'medium', 'low', 'unknown'),
    waterSource: Joi.string().valid('groundwater', 'surface-water', 'desalination', 'recycled', 'other'),
    transportConnectivity: Joi.object({
      roads: Joi.boolean(),
      railways: Joi.boolean(),
      ports: Joi.boolean(),
      pipelines: Joi.boolean()
    }),
    demandCenters: Joi.array().items(Joi.object({
      name: Joi.string().required(),
      distance: Joi.number().positive(),
      demandType: Joi.string().valid('industrial', 'transport', 'power-generation', 'residential')
    })),
    regulatoryZones: Joi.array().items(Joi.object({
      name: Joi.string().required(),
      type: Joi.string(),
      restrictions: Joi.array().items(Joi.string())
    })),
    environmentalConstraints: Joi.array().items(Joi.object({
      type: Joi.string().required(),
      description: Joi.string(),
      severity: Joi.string().valid('low', 'medium', 'high', 'critical')
    })),
    incentives: Joi.array().items(Joi.object({
      name: Joi.string().required(),
      type: Joi.string(),
      value: Joi.string(),
      expiryDate: Joi.date()
    })),
    costEstimates: Joi.object({
      capitalCost: Joi.number().positive(),
      operationalCost: Joi.number().positive(),
      currency: Joi.string()
    }),
    timeline: Joi.object({
      startDate: Joi.date(),
      completionDate: Joi.date(),
      operationalDate: Joi.date()
    }),
    contact: Joi.object({
      company: Joi.string().trim(),
      email: Joi.string().email(),
      phone: Joi.string().trim(),
      website: Joi.string().uri()
    }),
    metadata: Joi.object({
      dataSource: Joi.string().trim(),
      accuracy: Joi.string().valid('high', 'medium', 'low')
    })
  }),

  // Renewable Energy schemas
  createRenewableEnergy: Joi.object({
    name: Joi.string().required().trim().min(2).max(100),
    type: Joi.string().valid('solar', 'wind', 'hydro', 'geothermal', 'biomass', 'tidal', 'wave').required(),
    status: Joi.string().valid('operational', 'under-construction', 'planned', 'decommissioned'),
    capacity: Joi.number().positive().required(),
    capacityUnit: Joi.string().valid('MW', 'GW', 'MWh', 'GWh'),
    location: Joi.object({
      type: Joi.string().valid('Point', 'Polygon').default('Point'),
      coordinates: Joi.any().required()
    }).required(),
    address: Joi.object({
      street: Joi.string().trim(),
      city: Joi.string().trim(),
      state: Joi.string().trim(),
      country: Joi.string().trim(),
      postalCode: Joi.string().trim()
    }),
    solarFields: Joi.object({
      panelType: Joi.string().valid('monocrystalline', 'polycrystalline', 'thin-film', 'concentrated', 'other'),
      efficiency: Joi.number().min(0).max(100),
      tiltAngle: Joi.number().min(0).max(90),
      azimuth: Joi.number().min(0).max(360),
      groundCoverageRatio: Joi.number().min(0).max(1)
    }),
    windFields: Joi.object({
      turbineType: Joi.string().valid('onshore', 'offshore', 'vertical-axis', 'horizontal-axis'),
      hubHeight: Joi.number().positive(),
      rotorDiameter: Joi.number().positive(),
      cutInSpeed: Joi.number().positive(),
      cutOutSpeed: Joi.number().positive(),
      ratedSpeed: Joi.number().positive()
    }),
    hydroFields: Joi.object({
      damType: Joi.string().valid('reservoir', 'run-of-river', 'pumped-storage', 'tidal'),
      headHeight: Joi.number().positive(),
      flowRate: Joi.number().positive(),
      reservoirCapacity: Joi.number().positive()
    }),
    geothermalFields: Joi.object({
      wellDepth: Joi.number().positive(),
      temperature: Joi.number().positive(),
      flowRate: Joi.number().positive(),
      resourceType: Joi.string().valid('vapor-dominated', 'liquid-dominated', 'hot-dry-rock')
    }),
    biomassFields: Joi.object({
      feedstockType: Joi.string().valid('wood', 'agricultural-residues', 'energy-crops', 'municipal-waste', 'animal-waste'),
      conversionTechnology: Joi.string().valid('combustion', 'gasification', 'anaerobic-digestion', 'pyrolysis'),
      feedstockAvailability: Joi.string().valid('high', 'medium', 'low')
    }),
    environmentalImpact: Joi.object({
      landUse: Joi.number().positive(),
      carbonOffset: Joi.number(),
      biodiversityImpact: Joi.string().valid('low', 'medium', 'high')
    }),
    gridConnection: Joi.object({
      voltage: Joi.number().positive(),
      distanceToGrid: Joi.number().positive(),
      connectionType: Joi.string().valid('transmission', 'distribution', 'microgrid', 'off-grid')
    }),
    performance: Joi.object({
      capacityFactor: Joi.number().min(0).max(100),
      availability: Joi.number().min(0).max(100),
      efficiency: Joi.number().min(0).max(100),
      annualGeneration: Joi.number().positive(),
      peakGeneration: Joi.number().positive(),
      downtime: Joi.number().positive()
    }),
    financial: Joi.object({
      capitalCost: Joi.number().positive(),
      operationalCost: Joi.number().positive(),
      levelizedCost: Joi.number().positive(),
      currency: Joi.string().default('USD')
    }),
    timeline: Joi.object({
      startDate: Joi.date(),
      completionDate: Joi.date(),
      operationalDate: Joi.date(),
      expectedLifespan: Joi.number().positive()
    }),
    contact: Joi.object({
      owner: Joi.string().trim(),
      operator: Joi.string().trim(),
      email: Joi.string().email(),
      phone: Joi.string().trim(),
      website: Joi.string().uri()
    }),
    metadata: Joi.object({
      dataSource: Joi.string().trim(),
      accuracy: Joi.string().valid('high', 'medium', 'low'),
      updateFrequency: Joi.string().valid('real-time', 'hourly', 'daily', 'weekly', 'monthly', 'yearly')
    })
  }),

  // Infrastructure schemas
  createInfrastructure: Joi.object({
    name: Joi.string().required().trim().min(2).max(100),
    type: Joi.string().valid('pipeline', 'road', 'railway', 'port', 'airport', 'demand-center', 'storage-facility', 'refueling-station').required(),
    status: Joi.string().valid('operational', 'under-construction', 'planned', 'decommissioned', 'maintenance'),
    location: Joi.object({
      type: Joi.string().valid('Point', 'LineString', 'Polygon').default('Point'),
      coordinates: Joi.any().required()
    }).required(),
    address: Joi.object({
      city: Joi.string().trim(),
      state: Joi.string().trim(),
      country: Joi.string().trim()
    }),
    metadata: Joi.object({
      dataSource: Joi.string().trim(),
      accuracy: Joi.string().valid('high', 'medium', 'low')
    })
  }),

  // Optimization schemas
  createOptimization: Joi.object({
    name: Joi.string().required().trim().min(2).max(100),
    type: Joi.string().valid('site-selection', 'route-optimization', 'capacity-planning', 'cost-optimization', 'environmental-impact').required(),
    location: Joi.object({
      type: Joi.string().valid('Point', 'Polygon').default('Point'),
      coordinates: Joi.any().required()
    }).required(),
    parameters: Joi.object({
      weights: Joi.object({
        renewableEnergy: Joi.number().min(0).max(1).default(0.25),
        waterAvailability: Joi.number().min(0).max(1).default(0.20),
        transportConnectivity: Joi.number().min(0).max(1).default(0.20),
        demandProximity: Joi.number().min(0).max(1).default(0.15),
        regulatoryCompliance: Joi.number().min(0).max(1).default(0.10),
        environmentalImpact: Joi.number().min(0).max(1).default(0.10)
      }),
      constraints: Joi.object({
        minDistanceToDemand: Joi.number().positive(),
        maxDistanceToRenewable: Joi.number().positive(),
        minWaterAvailability: Joi.string().valid('high', 'medium', 'low'),
        maxEnvironmentalImpact: Joi.string().valid('low', 'medium', 'high')
      }),
      algorithm: Joi.string().valid('multi-criteria-analysis', 'genetic-algorithm', 'linear-programming', 'other')
    }),
    user: Joi.object({
      id: Joi.string().required(),
      name: Joi.string().trim(),
      email: Joi.string().email()
    }),
    project: Joi.object({
      id: Joi.string().required(),
      name: Joi.string().trim(),
      description: Joi.string().trim()
    })
  }),

  // Query parameters schemas
  queryParams: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(10),
    sort: Joi.string().valid('name', 'createdAt', 'updatedAt', 'feasibilityScore', 'capacity'),
    order: Joi.string().valid('asc', 'desc').default('desc'),
    search: Joi.string().trim(),
    type: Joi.string().trim(),
    status: Joi.string().trim(),
    country: Joi.string().trim(),
    region: Joi.string().trim(),
    minScore: Joi.number().min(0).max(100),
    maxScore: Joi.number().min(0).max(100),
    minCapacity: Joi.number().positive(),
    maxCapacity: Joi.number().positive(),
    technology: Joi.string().trim(),
    renewableSource: Joi.string().trim(),
    waterAvailability: Joi.string().trim(),
    industryType: Joi.string().trim(),
    demandType: Joi.string().trim()
  }),

  // Geospatial query schemas
  geospatialQuery: Joi.object({
    longitude: Joi.number().min(-180).max(180).required(),
    latitude: Joi.number().min(-90).max(90).required(),
    radius: Joi.number().positive().max(1000).default(50), // km
    type: Joi.string().trim(),
    category: Joi.string().trim(),
    status: Joi.string().trim()
  }),

  // Pagination schemas
  pagination: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(10),
    sort: Joi.string().trim(),
    order: Joi.string().valid('asc', 'desc').default('desc')
  })
};

// Validation middleware factory
export const validateRequest = (schemaName) => {
  return (req, res, next) => {
    const schema = schemas[schemaName];
    if (!schema) {
      return next(new ApiError(`Validation schema '${schemaName}' not found`, 500));
    }

    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
      allowUnknown: false
    });

    if (error) {
      const errorMessage = error.details.map(detail => detail.message).join(', ');
      return next(new ApiError(`Validation error: ${errorMessage}`, 400));
    }

    // Replace req.body with validated data
    req.body = value;
    next();
  };
};

// Query validation middleware
export const validateQuery = (schemaName) => {
  return (req, res, next) => {
    const schema = schemas[schemaName];
    if (!schema) {
      return next(new ApiError(`Validation schema '${schemaName}' not found`, 500));
    }

    const { error, value } = schema.validate(req.query, {
      abortEarly: false,
      stripUnknown: true,
      allowUnknown: false
    });

    if (error) {
      const errorMessage = error.details.map(detail => detail.message).join(', ');
      return next(new ApiError(`Query validation error: ${errorMessage}`, 400));
    }

    // Replace req.query with validated data
    req.query = value;
    next();
  };
};

// Coordinate validation helper
export const validateCoordinates = (coordinates) => {
  if (!Array.isArray(coordinates) || coordinates.length !== 2) {
    return false;
  }
  
  const [longitude, latitude] = coordinates;
  return (
    typeof longitude === 'number' && longitude >= -180 && longitude <= 180 &&
    typeof latitude === 'number' && latitude >= -90 && latitude <= 90
  );
};

// Export schemas for use in other parts of the application
export { schemas };
