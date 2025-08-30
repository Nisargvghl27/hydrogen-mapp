import express from 'express';
import { asyncHandler } from '../middleware/errorHandler.js';
import { validateRequest, validateQuery } from '../middleware/validation.js';
import RenewableEnergy from '../models/RenewableEnergy.js';

const router = express.Router();

// @desc    Get all renewable energy sources with pagination and filtering
// @route   GET /api/renewable-energy
// @access  Public
router.get('/', validateQuery('queryParams'), asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    sort = 'createdAt',
    order = 'desc',
    search,
    type,
    status,
    country,
    region,
    minCapacity,
    maxCapacity
  } = req.query;

  // Build query
  const query = {};
  
  if (search) {
    query.$text = { $search: search };
  }
  
  if (type) query.type = type;
  if (status) query.status = status;
  if (country) query['address.country'] = country;
  if (region) query['address.state'] = region;
  
  if (minCapacity || maxCapacity) {
    query.capacity = {};
    if (minCapacity) query.capacity.$gte = Number(minCapacity);
    if (maxCapacity) query.capacity.$lte = Number(maxCapacity);
  }

  // Execute query with pagination
  const skip = (page - 1) * limit;
  const sortOrder = order === 'asc' ? 1 : -1;
  
  const sources = await RenewableEnergy.find(query)
    .sort({ [sort]: sortOrder })
    .skip(skip)
    .limit(Number(limit))
    .select('-__v');

  const total = await RenewableEnergy.countDocuments(query);

  res.json({
    success: true,
    data: sources,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total,
      pages: Math.ceil(total / limit)
    }
  });
}));

// @desc    Get renewable energy source by ID
// @route   GET /api/renewable-energy/:id
// @access  Public
router.get('/:id', asyncHandler(async (req, res) => {
  const source = await RenewableEnergy.findById(req.params.id).select('-__v');
  
  if (!source) {
    return res.status(404).json({
      success: false,
      error: 'Renewable energy source not found'
    });
  }

  res.json({
    success: true,
    data: source
  });
}));

// @desc    Create new renewable energy source
// @route   POST /api/renewable-energy
// @access  Private
router.post('/', validateRequest('createRenewableEnergy'), asyncHandler(async (req, res) => {
  const source = await RenewableEnergy.create(req.body);
  
  res.status(201).json({
    success: true,
    data: source
  });
}));

// @desc    Update renewable energy source
// @route   PUT /api/renewable-energy/:id
// @access  Private
router.put('/:id', asyncHandler(async (req, res) => {
  const source = await RenewableEnergy.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true
    }
  ).select('-__v');

  if (!source) {
    return res.status(404).json({
      success: false,
      error: 'Renewable energy source not found'
    });
  }

  res.json({
    success: true,
    data: source
  });
}));

// @desc    Delete renewable energy source
// @route   DELETE /api/renewable-energy/:id
// @access  Private
router.delete('/:id', asyncHandler(async (req, res) => {
  const source = await RenewableEnergy.findByIdAndDelete(req.params.id);

  if (!source) {
    return res.status(404).json({
      success: false,
      error: 'Renewable energy source not found'
    });
  }

  res.json({
    success: true,
    message: 'Renewable energy source deleted successfully'
  });
}));

// @desc    Get renewable energy sources within radius
// @route   GET /api/renewable-energy/radius/:longitude/:latitude/:radius
// @access  Public
router.get('/radius/:longitude/:latitude/:radius', asyncHandler(async (req, res) => {
  const { longitude, latitude, radius } = req.params;
  const center = [Number(longitude), Number(latitude)];
  const radiusKm = Number(radius);

  if (radiusKm > 1000) {
    return res.status(400).json({
      success: false,
      error: 'Radius cannot exceed 1000 km'
    });
  }

  const sources = await RenewableEnergy.findWithinRadius(center, radiusKm);

  res.json({
    success: true,
    data: sources,
    query: {
      center,
      radius: radiusKm,
      count: sources.length
    }
  });
}));

// @desc    Get renewable energy sources by type and region
// @route   GET /api/renewable-energy/type/:type/region/:region
// @access  Public
router.get('/type/:type/region/:region', asyncHandler(async (req, res) => {
  const { type, region } = req.params;
  
  const sources = await RenewableEnergy.findByTypeAndRegion(type, region);

  res.json({
    success: true,
    data: sources,
    query: {
      type,
      region,
      count: sources.length
    }
  });
}));

// @desc    Get renewable energy sources by type
// @route   GET /api/renewable-energy/type/:type
// @access  Public
router.get('/type/:type', asyncHandler(async (req, res) => {
  const { type } = req.params;
  
  const sources = await RenewableEnergy.find({ type }).select('-__v');

  res.json({
    success: true,
    data: sources,
    query: {
      type,
      count: sources.length
    }
  });
}));

// @desc    Get renewable energy sources by status
// @route   GET /api/renewable-energy/status/:status
// @access  Public
router.get('/status/:status', asyncHandler(async (req, res) => {
  const { status } = req.params;
  
  const sources = await RenewableEnergy.find({ status }).select('-__v');

  res.json({
    success: true,
    data: sources,
    query: {
      status,
      count: sources.length
    }
  });
}));

// @desc    Get renewable energy sources by region
// @route   GET /api/renewable-energy/region/:country/:state?
// @access  Public
router.get('/region/:country/:state?', asyncHandler(async (req, res) => {
  const { country, state } = req.params;
  const query = { 'address.country': country };
  
  if (state) {
    query['address.state'] = state;
  }

  const sources = await RenewableEnergy.find(query).select('-__v');

  res.json({
    success: true,
    data: sources,
    query: {
      country,
      state: state || 'all',
      count: sources.length
    }
  });
}));

// @desc    Get renewable energy sources statistics
// @route   GET /api/renewable-energy/stats/overview
// @access  Public
router.get('/stats/overview', asyncHandler(async (req, res) => {
  const stats = await RenewableEnergy.aggregate([
    {
      $group: {
        _id: null,
        totalSources: { $sum: 1 },
        totalCapacity: { $sum: '$capacity' },
        avgCapacity: { $avg: '$capacity' }
      }
    }
  ]);

  const typeStats = await RenewableEnergy.aggregate([
    {
      $group: {
        _id: '$type',
        count: { $sum: 1 },
        totalCapacity: { $sum: '$capacity' }
      }
    }
  ]);

  const statusStats = await RenewableEnergy.aggregate([
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 }
      }
    }
  ]);

  const countryStats = await RenewableEnergy.aggregate([
    {
      $group: {
        _id: '$address.country',
        count: { $sum: 1 },
        totalCapacity: { $sum: '$capacity' }
      }
    },
    {
      $sort: { totalCapacity: -1 }
    },
    {
      $limit: 10
    }
  ]);

  const performanceStats = await RenewableEnergy.aggregate([
    {
      $match: {
        'performance.capacityFactor': { $exists: true, $ne: null }
      }
    },
    {
      $group: {
        _id: null,
        avgCapacityFactor: { $avg: '$performance.capacityFactor' },
        avgEfficiency: { $avg: '$performance.efficiency' }
      }
    }
  ]);

  res.json({
    success: true,
    data: {
      overview: stats[0] || {},
      byType: typeStats,
      byStatus: statusStats,
      byCountry: countryStats,
      performance: performanceStats[0] || {}
    }
  });
}));

// @desc    Search renewable energy sources
// @route   GET /api/renewable-energy/search/:query
// @access  Public
router.get('/search/:query', asyncHandler(async (req, res) => {
  const { query } = req.params;
  
  const sources = await RenewableEnergy.find({
    $text: { $search: query }
  }, {
    score: { $meta: 'textScore' }
  })
  .sort({ score: { $meta: 'textScore' } })
  .select('-__v')
  .limit(20);

  res.json({
    success: true,
    data: sources,
    query,
    count: sources.length
  });
}));

// @desc    Get solar energy sources with specific criteria
// @route   GET /api/renewable-energy/solar/criteria
// @access  Public
router.get('/solar/criteria', asyncHandler(async (req, res) => {
  const { minEfficiency, maxTiltAngle, panelType } = req.query;
  
  const query = { type: 'solar' };
  
  if (minEfficiency) query['solarFields.efficiency'] = { $gte: Number(minEfficiency) };
  if (maxTiltAngle) query['solarFields.tiltAngle'] = { $lte: Number(maxTiltAngle) };
  if (panelType) query['solarFields.panelType'] = panelType;

  const sources = await RenewableEnergy.find(query).select('-__v');

  res.json({
    success: true,
    data: sources,
    query: {
      type: 'solar',
      criteria: { minEfficiency, maxTiltAngle, panelType },
      count: sources.length
    }
  });
}));

// @desc    Get wind energy sources with specific criteria
// @route   GET /api/renewable-energy/wind/criteria
// @access  Public
router.get('/wind/criteria', asyncHandler(async (req, res) => {
  const { turbineType, minHubHeight, maxRotorDiameter } = req.query;
  
  const query = { type: 'wind' };
  
  if (turbineType) query['windFields.turbineType'] = turbineType;
  if (minHubHeight) query['windFields.hubHeight'] = { $gte: Number(minHubHeight) };
  if (maxRotorDiameter) query['windFields.rotorDiameter'] = { $lte: Number(maxRotorDiameter) };

  const sources = await RenewableEnergy.find(query).select('-__v');

  res.json({
    success: true,
    data: sources,
    query: {
      type: 'wind',
      criteria: { turbineType, minHubHeight, maxRotorDiameter },
      count: sources.length
    }
  });
}));

// @desc    Get hydro energy sources with specific criteria
// @route   GET /api/renewable-energy/hydro/criteria
// @access  Public
router.get('/hydro/criteria', asyncHandler(async (req, res) => {
  const { damType, minHeadHeight, minFlowRate } = req.query;
  
  const query = { type: 'hydro' };
  
  if (damType) query['hydroFields.damType'] = damType;
  if (minHeadHeight) query['hydroFields.headHeight'] = { $gte: Number(minHeadHeight) };
  if (minFlowRate) query['hydroFields.flowRate'] = { $gte: Number(minFlowRate) };

  const sources = await RenewableEnergy.find(query).select('-__v');

  res.json({
    success: true,
    data: sources,
    query: {
      type: 'hydro',
      criteria: { damType, minHeadHeight, minFlowRate },
      count: sources.length
    }
  });
}));

// @desc    Get geothermal energy sources with specific criteria
// @route   GET /api/renewable-energy/geothermal/criteria
// @access  Public
router.get('/geothermal/criteria', asyncHandler(async (req, res) => {
  const { resourceType, minTemperature, maxWellDepth } = req.query;
  
  const query = { type: 'geothermal' };
  
  if (resourceType) query['geothermalFields.resourceType'] = resourceType;
  if (minTemperature) query['geothermalFields.temperature'] = { $gte: Number(minTemperature) };
  if (maxWellDepth) query['geothermalFields.wellDepth'] = { $lte: Number(maxWellDepth) };

  const sources = await RenewableEnergy.find(query).select('-__v');

  res.json({
    success: true,
    data: sources,
    query: {
      type: 'geothermal',
      criteria: { resourceType, minTemperature, maxWellDepth },
      count: sources.length
    }
  });
}));

// @desc    Get biomass energy sources with specific criteria
// @route   GET /api/renewable-energy/biomass/criteria
// @access  Public
router.get('/biomass/criteria', asyncHandler(async (req, res) => {
  const { feedstockType, conversionTechnology, availability } = req.query;
  
  const query = { type: 'biomass' };
  
  if (feedstockType) query['biomassFields.feedstockType'] = feedstockType;
  if (conversionTechnology) query['biomassFields.conversionTechnology'] = conversionTechnology;
  if (availability) query['biomassFields.feedstockAvailability'] = availability;

  const sources = await RenewableEnergy.find(query).select('-__v');

  res.json({
    success: true,
    data: sources,
    query: {
      type: 'biomass',
      criteria: { feedstockType, conversionTechnology, availability },
      count: sources.length
    }
  });
}));

// @desc    Bulk create renewable energy sources from CSV/JSON
// @route   POST /api/renewable-energy/bulk
// @access  Private
router.post('/bulk', asyncHandler(async (req, res) => {
  const { sources } = req.body;
  
  if (!Array.isArray(sources) || sources.length === 0) {
    return res.status(400).json({
      success: false,
      error: 'Sources array is required and cannot be empty'
    });
  }

  if (sources.length > 100) {
    return res.status(400).json({
      success: false,
      error: 'Cannot create more than 100 sources at once'
    });
  }

  const createdSources = await RenewableEnergy.insertMany(sources, {
    validateBeforeSave: true
  });

  res.status(201).json({
    success: true,
    data: createdSources,
    count: createdSources.length
  });
}));

export default router;
