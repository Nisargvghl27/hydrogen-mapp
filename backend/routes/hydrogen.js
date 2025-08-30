import express from 'express';
import { asyncHandler } from '../middleware/errorHandler.js';
import { validateRequest, validateQuery } from '../middleware/validation.js';
import HydrogenPlant from '../models/HydrogenPlant.js';

const router = express.Router();

// @desc    Get all hydrogen plants with pagination and filtering
// @route   GET /api/hydrogen
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
    minScore,
    maxScore,
    minCapacity,
    maxCapacity,
    technology,
    renewableSource,
    waterAvailability
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
  if (technology) query.technology = technology;
  if (renewableSource) query.renewableSource = renewableSource;
  if (waterAvailability) query.waterAvailability = waterAvailability;
  
  if (minScore || maxScore) {
    query.feasibilityScore = {};
    if (minScore) query.feasibilityScore.$gte = Number(minScore);
    if (maxScore) query.feasibilityScore.$lte = Number(maxScore);
  }
  
  if (minCapacity || maxCapacity) {
    query.capacity = {};
    if (minCapacity) query.capacity.$gte = Number(minCapacity);
    if (maxCapacity) query.capacity.$lte = Number(maxCapacity);
  }

  // Execute query with pagination
  const skip = (page - 1) * limit;
  const sortOrder = order === 'asc' ? 1 : -1;
  
  const plants = await HydrogenPlant.find(query)
    .sort({ [sort]: sortOrder })
    .skip(skip)
    .limit(Number(limit))
    .select('-__v');

  const total = await HydrogenPlant.countDocuments(query);

  res.json({
    success: true,
    data: plants,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total,
      pages: Math.ceil(total / limit)
    }
  });
}));

// @desc    Get hydrogen plant by ID
// @route   GET /api/hydrogen/:id
// @access  Public
router.get('/:id', asyncHandler(async (req, res) => {
  const plant = await HydrogenPlant.findById(req.params.id).select('-__v');
  
  if (!plant) {
    return res.status(404).json({
      success: false,
      error: 'Hydrogen plant not found'
    });
  }

  res.json({
    success: true,
    data: plant
  });
}));

// @desc    Create new hydrogen plant
// @route   POST /api/hydrogen
// @access  Private
router.post('/', validateRequest('createHydrogenPlant'), asyncHandler(async (req, res) => {
  const plant = await HydrogenPlant.create(req.body);
  
  res.status(201).json({
    success: true,
    data: plant
  });
}));

// @desc    Update hydrogen plant
// @route   PUT /api/hydrogen/:id
// @access  Private
router.put('/:id', validateRequest('updateHydrogenPlant'), asyncHandler(async (req, res) => {
  const plant = await HydrogenPlant.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true
    }
  ).select('-__v');

  if (!plant) {
    return res.status(404).json({
      success: false,
      error: 'Hydrogen plant not found'
    });
  }

  res.json({
    success: true,
    data: plant
  });
}));

// @desc    Delete hydrogen plant
// @route   DELETE /api/hydrogen/:id
// @access  Private
router.delete('/:id', asyncHandler(async (req, res) => {
  const plant = await HydrogenPlant.findByIdAndDelete(req.params.id);

  if (!plant) {
    return res.status(404).json({
      success: false,
      error: 'Hydrogen plant not found'
    });
  }

  res.json({
    success: true,
    message: 'Hydrogen plant deleted successfully'
  });
}));

// @desc    Get hydrogen plants within radius
// @route   GET /api/hydrogen/radius/:longitude/:latitude/:radius
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

  const plants = await HydrogenPlant.findWithinRadius(center, radiusKm);

  res.json({
    success: true,
    data: plants,
    query: {
      center,
      radius: radiusKm,
      count: plants.length
    }
  });
}));

// @desc    Get hydrogen plants by region
// @route   GET /api/hydrogen/region/:country/:state?
// @access  Public
router.get('/region/:country/:state?', asyncHandler(async (req, res) => {
  const { country, state } = req.params;
  const query = { 'address.country': country };
  
  if (state) {
    query['address.state'] = state;
  }

  const plants = await HydrogenPlant.find(query).select('-__v');

  res.json({
    success: true,
    data: plants,
    query: {
      country,
      state: state || 'all',
      count: plants.length
    }
  });
}));

// @desc    Get hydrogen plants by technology
// @route   GET /api/hydrogen/technology/:technology
// @access  Public
router.get('/technology/:technology', asyncHandler(async (req, res) => {
  const { technology } = req.params;
  
  const plants = await HydrogenPlant.find({ technology }).select('-__v');

  res.json({
    success: true,
    data: plants,
    query: {
      technology,
      count: plants.length
    }
  });
}));

// @desc    Get hydrogen plants by renewable source
// @route   GET /api/hydrogen/source/:source
// @access  Public
router.get('/source/:source', asyncHandler(async (req, res) => {
  const { source } = req.params;
  
  const plants = await HydrogenPlant.find({ renewableSource: source }).select('-__v');

  res.json({
    success: true,
    data: plants,
    query: {
      renewableSource: source,
      count: plants.length
    }
  });
}));

// @desc    Get hydrogen plants by status
// @route   GET /api/hydrogen/status/:status
// @access  Public
router.get('/status/:status', asyncHandler(async (req, res) => {
  const { status } = req.params;
  
  const plants = await HydrogenPlant.find({ status }).select('-__v');

  res.json({
    success: true,
    data: plants,
    query: {
      status,
      count: plants.length
    }
  });
}));

// @desc    Get hydrogen plants by feasibility score range
// @route   GET /api/hydrogen/score/:min/:max
// @access  Public
router.get('/score/:min/:max', asyncHandler(async (req, res) => {
  const { min, max } = req.params;
  const minScore = Number(min);
  const maxScore = Number(max);

  if (minScore > maxScore) {
    return res.status(400).json({
      success: false,
      error: 'Minimum score cannot be greater than maximum score'
    });
  }

  const plants = await HydrogenPlant.find({
    feasibilityScore: {
      $gte: minScore,
      $lte: maxScore
    }
  }).select('-__v');

  res.json({
    success: true,
    data: plants,
    query: {
      minScore,
      maxScore,
      count: plants.length
    }
  });
}));

// @desc    Get hydrogen plants statistics
// @route   GET /api/hydrogen/stats/overview
// @access  Public
router.get('/stats/overview', asyncHandler(async (req, res) => {
  const stats = await HydrogenPlant.aggregate([
    {
      $group: {
        _id: null,
        totalPlants: { $sum: 1 },
        totalCapacity: { $sum: '$capacity' },
        avgFeasibilityScore: { $avg: '$feasibilityScore' },
        avgCapacity: { $avg: '$capacity' }
      }
    }
  ]);

  const statusStats = await HydrogenPlant.aggregate([
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 }
      }
    }
  ]);

  const technologyStats = await HydrogenPlant.aggregate([
    {
      $group: {
        _id: '$technology',
        count: { $sum: 1 }
      }
    }
  ]);

  const renewableSourceStats = await HydrogenPlant.aggregate([
    {
      $group: {
        _id: '$renewableSource',
        count: { $sum: 1 }
      }
    }
  ]);

  const countryStats = await HydrogenPlant.aggregate([
    {
      $group: {
        _id: '$address.country',
        count: { $sum: 1 }
      }
    },
    {
      $sort: { count: -1 }
    },
    {
      $limit: 10
    }
  ]);

  res.json({
    success: true,
    data: {
      overview: stats[0] || {},
      byStatus: statusStats,
      byTechnology: technologyStats,
      byRenewableSource: renewableSourceStats,
      byCountry: countryStats
    }
  });
}));

// @desc    Search hydrogen plants
// @route   GET /api/hydrogen/search/:query
// @access  Public
router.get('/search/:query', asyncHandler(async (req, res) => {
  const { query } = req.params;
  
  const plants = await HydrogenPlant.find({
    $text: { $search: query }
  }, {
    score: { $meta: 'textScore' }
  })
  .sort({ score: { $meta: 'textScore' } })
  .select('-__v')
  .limit(20);

  res.json({
    success: true,
    data: plants,
    query,
    count: plants.length
  });
}));

// @desc    Get nearby demand centers for a hydrogen plant
// @route   GET /api/hydrogen/:id/demand-centers
// @access  Public
router.get('/:id/demand-centers', asyncHandler(async (req, res) => {
  const plant = await HydrogenPlant.findById(req.params.id);
  
  if (!plant) {
    return res.status(404).json({
      success: false,
      error: 'Hydrogen plant not found'
    });
  }

  // This would typically query the Infrastructure model for demand centers
  // For now, return the demand centers stored in the plant document
  res.json({
    success: true,
    data: plant.demandCenters || [],
    plantLocation: plant.location
  });
}));

// @desc    Get nearby renewable energy sources for a hydrogen plant
// @route   GET /api/hydrogen/:id/renewable-sources
// @access  Public
router.get('/:id/renewable-sources', asyncHandler(async (req, res) => {
  const plant = await HydrogenPlant.findById(req.params.id);
  
  if (!plant) {
    return res.status(404).json({
      success: false,
      error: 'Hydrogen plant not found'
    });
  }

  // This would typically query the RenewableEnergy model
  // For now, return basic information
  res.json({
    success: true,
    data: {
      renewableSource: plant.renewableSource,
      plantLocation: plant.location
    }
  });
}));

// @desc    Bulk create hydrogen plants from CSV/JSON
// @route   POST /api/hydrogen/bulk
// @access  Private
router.post('/bulk', asyncHandler(async (req, res) => {
  const { plants } = req.body;
  
  if (!Array.isArray(plants) || plants.length === 0) {
    return res.status(400).json({
      success: false,
      error: 'Plants array is required and cannot be empty'
    });
  }

  if (plants.length > 100) {
    return res.status(400).json({
      success: false,
      error: 'Cannot create more than 100 plants at once'
    });
  }

  const createdPlants = await HydrogenPlant.insertMany(plants, {
    validateBeforeSave: true
  });

  res.status(201).json({
    success: true,
    data: createdPlants,
    count: createdPlants.length
  });
}));

export default router;
