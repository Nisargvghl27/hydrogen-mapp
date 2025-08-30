import express from 'express';
import { asyncHandler } from '../middleware/errorHandler.js';
import { validateRequest, validateQuery } from '../middleware/validation.js';
import Infrastructure from '../models/Infrastructure.js';

const router = express.Router();

/**
 * ORDERING RULE:
 * 1. Complex/multi-parameter routes (radius, type/region, demand-centers, etc.)
 * 2. Specific named routes (/stats, /search, /connectivity, /bulk)
 * 3. Generic routes (/:id, CRUD)
 */

// ---------------- SPECIFIC ROUTES ----------------

// @desc    Get infrastructure within radius
// @route   GET /api/infrastructure/radius/:longitude/:latitude/:radius
router.get('/radius/:longitude/:latitude/:radius', asyncHandler(async (req, res) => {
  const { longitude, latitude, radius } = req.params;
  const center = [Number(longitude), Number(latitude)];
  const radiusKm = Number(radius);

  if (radiusKm > 1000) {
    return res.status(400).json({ success: false, error: 'Radius cannot exceed 1000 km' });
  }

  const infrastructure = await Infrastructure.findWithinRadius(center, radiusKm); // ✅ custom model method

  res.json({
    success: true,
    data: infrastructure,
    query: { center, radius: radiusKm, count: infrastructure.length }
  });
}));

// @desc    Get infrastructure by type and region
// @route   GET /api/infrastructure/type/:type/region/:region
router.get('/type/:type/region/:region', asyncHandler(async (req, res) => {
  const { type, region } = req.params;
  const infrastructure = await Infrastructure.findByTypeAndRegion(type, region); // ✅ custom model method

  res.json({ success: true, data: infrastructure, query: { type, region, count: infrastructure.length } });
}));

// @desc    Get infrastructure by type
router.get('/type/:type', asyncHandler(async (req, res) => {
  const { type } = req.params;
  const infrastructure = await Infrastructure.find({ type }).select('-__v');
  res.json({ success: true, data: infrastructure, query: { type, count: infrastructure.length } });
}));

// @desc    Get infrastructure by category (removed - simplified schema)
// router.get('/category/:category', asyncHandler(async (req, res) => {
//   const { category } = req.params;
//   const infrastructure = await Infrastructure.find({ category }).select('-__v');
//   res.json({ success: true, data: infrastructure, query: { category, count: infrastructure.length } });
// }));

// @desc    Get infrastructure by status
router.get('/status/:status', asyncHandler(async (req, res) => {
  const { status } = req.params;
  const infrastructure = await Infrastructure.find({ status }).select('-__v');
  res.json({ success: true, data: infrastructure, query: { status, count: infrastructure.length } });
}));

// @desc    Get infrastructure by region
router.get('/region/:country/:state?', asyncHandler(async (req, res) => {
  const { country, state } = req.params;
  const query = { 'address.country': country };
  if (state) query['address.state'] = state;

  const infrastructure = await Infrastructure.find(query).select('-__v');
  res.json({ success: true, data: infrastructure, query: { country, state: state || 'all', count: infrastructure.length } });
}));

// @desc    Get demand centers by industry type (removed - simplified schema)
// router.get('/demand-centers/industry/:industryType', asyncHandler(async (req, res) => {
//   const { industryType } = req.params;
//   const demandCenters = await Infrastructure.findDemandCentersByIndustry(industryType); // ✅ custom model method
//   res.json({ success: true, data: demandCenters, query: { industryType, count: demandCenters.length } });
// }));

// @desc    Get demand centers with hydrogen demand criteria (removed - simplified schema)
// router.get('/demand-centers/criteria', asyncHandler(async (req, res) => {
//   const { minDemand, maxDemand, demandType, industryType } = req.query;
//   const query = { type: 'demand-center' };

//   if (minDemand || maxDemand) {
//     query['demandCenterFields.hydrogenDemand.current'] = {};
//     if (minDemand) query['demandcenters.hydrogenDemand.current'].$gte = Number(minDemand);
//     if (maxDemand) query['demandCenterFields.hydrogenDemand.current'].$lte = Number(maxDemand);
//   }
//   if (demandType) query['demandCenterFields.demandType'] = demandType;
//   if (industryType) query['demandCenterFields.industryType'] = industryType;

//   const demandCenters = await Infrastructure.find(query).select('-__v');
//   res.json({ success: true, data: demandCenters, query: { type: 'demand-center', criteria: { minDemand, maxDemand, demandType, industryType }, count: demandCenters.length } });
// }));

// @desc    Get pipelines by commodity (removed - simplified schema)
// router.get('/pipelines/commodity/:commodity', asyncHandler(async (req, res) => {
//   const { commodity } = req.params;
//   const pipelines = await Infrastructure.find({ type: 'pipeline', 'pipelineFields.commodity': commodity }).select('-__v');
//   res.json({ success: true, data: pipelines, query: { type: 'pipeline', commodity, count: pipelines.length } });
// }));

// @desc    Get transport infrastructure by type
router.get('/transport/:transportType', asyncHandler(async (req, res) => {
  const { transportType } = req.params;
  const transportInfra = await Infrastructure.find({ type: transportType }).select('-__v');
  res.json({ success: true, data: transportInfra, query: { type: transportType, count: transportInfra.length } });
}));

// @desc    Get storage facilities by type (removed - simplified schema)
// router.get('/storage/type/:storageType', asyncHandler(async (req, res) => {
//   const { storageType } = req.params;
//   const storageFacilities = await Infrastructure.find({ type: 'storage-facility', 'storageFields.storageType': storageType }).select('-__v');
//   res.json({ success: true, data: storageFacilities, query: { type: 'storage-facility', storageType, count: storageFacilities.length } });
// }));

// @desc    Get refueling stations by fuel type (removed - simplified schema)
// router.get('/refueling/fuel/:fuelType', asyncHandler(async (req, res) => {
//   const { fuelType } = req.params;
//   const refuelingStations = await Infrastructure.find({ type: 'refueling-station', 'refuelingFields.fuelTypes': fuelType }).select('-__v');
//   res.json({ success: true, data: refuelingStations, query: { type: 'refueling-station', fuelType, count: refuelingStations.length } });
// }));

// @desc    Get infrastructure statistics
router.get('/stats/overview', asyncHandler(async (req, res) => {
  const stats = await Infrastructure.aggregate([{ $group: { _id: null, totalInfrastructure: { $sum: 1 } } }]);
  const typeStats = await Infrastructure.aggregate([{ $group: { _id: '$type', count: { $sum: 1 } } }]);
  const statusStats = await Infrastructure.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]);
  const countryStats = await Infrastructure.aggregate([
    { $group: { _id: '$address.country', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 10 }
  ]);

  res.json({ success: true, data: { overview: stats[0] || {}, byType: typeStats, byStatus: statusStats, byCountry: countryStats } });
}));

// @desc    Search infrastructure
router.get('/search/:query', asyncHandler(async (req, res) => {
  const { query } = req.params;
  const infrastructure = await Infrastructure.find({ $text: { $search: query } }, { score: { $meta: 'textScore' } }).sort({ score: { $meta: 'textScore' } }).select('-__v').limit(20);
  res.json({ success: true, data: infrastructure, query, count: infrastructure.length });
}));

// @desc    Get infrastructure connectivity analysis (removed - simplified schema)
// router.get('/connectivity/:id', asyncHandler(async (req, res) => {
//   const infra = await Infrastructure.findById(req.params.id);
//   if (!infra) return res.status(404).json({ success: false, error: 'Infrastructure not found' });

//   const connectivity = {
//     roadAccess: infra.connectivity?.roadAccess || false,
//     railAccess: infra.connectivity?.railAccess || false,
//     waterAccess: infra.connectivity?.waterAccess || false,
//     airAccess: infra.connectivity?.airAccess || false,
//     internetConnectivity: infra.connectivity?.internetConnectivity || false,
//     powerGridConnection: infra.connectivity?.powerGridConnection || false
//   };
//   const connectivityScore = Object.values(connectivity).filter(Boolean).length;
//   const maxScore = Object.keys(connectivity).length;

//   res.json({ success: true, data: { infrastructure: { id: infra._id, name: infra.name, type: infra.type, location: infra.location }, connectivity, connectivityScore, maxScore, percentage: Math.round((connectivityScore / maxScore) * 100) } });
// }));

// @desc    Bulk create infrastructure
router.post('/bulk', asyncHandler(async (req, res) => {
  const { infrastructure } = req.body;
  if (!Array.isArray(infrastructure) || infrastructure.length === 0) return res.status(400).json({ success: false, error: 'Infrastructure array is required and cannot be empty' });
  if (infrastructure.length > 100) return res.status(400).json({ success: false, error: 'Cannot create more than 100 infrastructure items at once' });

  const createdInfrastructure = await Infrastructure.insertMany(infrastructure, { validateBeforeSave: true });
  res.status(201).json({ success: true, data: createdInfrastructure, count: createdInfrastructure.length });
}));

// ---------------- GENERIC CRUD ROUTES ----------------

// @desc    Get all infrastructure (pagination + filtering)
router.get('/', validateQuery('queryParams'), asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, sort = 'createdAt', order = 'desc', search, type, status, country, region } = req.query;
  const query = {};
  if (search) query.$text = { $search: search };
  if (type) query.type = type;
  if (status) query.status = status;
  if (country) query['address.country'] = country;
  if (region) query['address.state'] = region;

  const skip = (page - 1) * limit;
  const sortOrder = order === 'asc' ? 1 : -1;

  const infrastructure = await Infrastructure.find(query).sort({ [sort]: sortOrder }).skip(skip).limit(Number(limit)).select('-__v');
  const total = await Infrastructure.countDocuments(query);

  res.json({ success: true, data: infrastructure, pagination: { page: Number(page), limit: Number(limit), total, pages: Math.ceil(total / limit) } });
}));

// @desc    Get infrastructure by ID
router.get('/:id', asyncHandler(async (req, res) => {
  const infra = await Infrastructure.findById(req.params.id).select('-__v');
  if (!infra) return res.status(404).json({ success: false, error: 'Infrastructure not found' });
  res.json({ success: true, data: infra });
}));

// @desc    Create infrastructure
router.post('/', validateRequest('createInfrastructure'), asyncHandler(async (req, res) => {
  const infra = await Infrastructure.create(req.body);
  res.status(201).json({ success: true, data: infra });
}));

// @desc    Update infrastructure
router.put('/:id', asyncHandler(async (req, res) => {
  const infra = await Infrastructure.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true }).select('-__v');
  if (!infra) return res.status(404).json({ success: false, error: 'Infrastructure not found' });
  res.json({ success: true, data: infra });
}));

// @desc    Delete infrastructure
router.delete('/:id', asyncHandler(async (req, res) => {
  const infra = await Infrastructure.findByIdAndDelete(req.params.id);
  if (!infra) return res.status(404).json({ success: false, error: 'Infrastructure not found' });
  res.json({ success: true, message: 'Infrastructure deleted successfully' });
}));

export default router;
