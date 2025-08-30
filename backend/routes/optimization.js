import express from 'express';
import { asyncHandler } from '../middleware/errorHandler.js';
import { validateRequest, validateQuery } from '../middleware/validation.js';
import Optimization from '../models/Optimization.js';
import HydrogenPlant from '../models/HydrogenPlant.js';
import RenewableEnergy from '../models/RenewableEnergy.js';
import Infrastructure from '../models/Infrastructure.js';

const router = express.Router();

// @desc    Get all optimizations with pagination and filtering
// @route   GET /api/optimization
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
    priority
  } = req.query;

  // Build query
  const query = {};
  
  if (search) {
    query.$text = { $search: search };
  }
  
  if (type) query.type = type;
  if (status) query.status = status;
  if (priority) query['recommendations.priority'] = priority;

  // Execute query with pagination
  const skip = (page - 1) * limit;
  const sortOrder = order === 'asc' ? 1 : -1;
  
  const optimizations = await Optimization.find(query)
    .sort({ [sort]: sortOrder })
    .skip(skip)
    .limit(Number(limit))
    .select('-__v');

  const total = await Optimization.countDocuments(query);

  res.json({
    success: true,
    data: optimizations,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total,
      pages: Math.ceil(total / limit)
    }
  });
}));

// @desc    Get optimization by ID
// @route   GET /api/optimization/:id
// @access  Public
router.get('/:id', asyncHandler(async (req, res) => {
  const optimization = await Optimization.findById(req.params.id).select('-__v');
  
  if (!optimization) {
    return res.status(404).json({
      success: false,
      error: 'Optimization not found'
    });
  }

  res.json({
    success: true,
    data: optimization
  });
}));

// @desc    Create new optimization
// @route   POST /api/optimization
// @access  Private
router.post('/', validateRequest('createOptimization'), asyncHandler(async (req, res) => {
  const optimization = await Optimization.create(req.body);
  
  res.status(201).json({
    success: true,
    data: optimization
  });
}));

// @desc    Update optimization
// @route   PUT /api/optimization/:id
// @access  Private
router.put('/:id', asyncHandler(async (req, res) => {
  const optimization = await Optimization.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true
    }
  ).select('-__v');

  if (!optimization) {
    return res.status(404).json({
      success: false,
      error: 'Optimization not found'
    });
  }

  res.json({
    success: true,
    data: optimization
  });
}));

// @desc    Delete optimization
// @route   DELETE /api/optimization/:id
// @access  Private
router.delete('/:id', asyncHandler(async (req, res) => {
  const optimization = await Optimization.findByIdAndDelete(req.params.id);

  if (!optimization) {
    return res.status(404).json({
      success: false,
      error: 'Optimization not found'
    });
  }

  res.json({
    success: true,
    message: 'Optimization deleted successfully'
  });
}));

// @desc    Run site suitability analysis
// @route   POST /api/optimization/site-analysis
// @access  Private
router.post('/site-analysis', asyncHandler(async (req, res) => {
  const {
    location,
    parameters = {},
    user,
    project
  } = req.body;

  // Validate coordinates
  if (!location || !location.coordinates) {
    return res.status(400).json({
      success: false,
      error: 'Location coordinates are required'
    });
  }

  const startTime = new Date();
  
  try {
    // Extract parameters with defaults
    const weights = {
      renewableEnergy: parameters.weights?.renewableEnergy || 0.25,
      waterAvailability: parameters.weights?.waterAvailability || 0.20,
      transportConnectivity: parameters.weights?.transportConnectivity || 0.20,
      demandProximity: parameters.weights?.demandProximity || 0.15,
      regulatoryCompliance: parameters.weights?.regulatoryCompliance || 0.10,
      environmentalImpact: parameters.weights?.environmentalImpact || 0.10
    };

    const constraints = parameters.constraints || {};

    // Find nearby renewable energy sources
    const renewableSources = await RenewableEnergy.findWithinRadius(
      location.coordinates,
      constraints.maxDistanceToRenewable || 100
    );

    // Find nearby demand centers
    const demandCenters = await Infrastructure.find({
      type: 'demand-center',
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: location.coordinates
          },
          $maxDistance: (constraints.minDistanceToDemand || 50) * 1000
        }
      }
    });

    // Find nearby transport infrastructure
    const transportInfrastructure = await Infrastructure.find({
      type: { $in: ['road', 'railway', 'port', 'airport'] },
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: location.coordinates
          },
          $maxDistance: 50 * 1000 // 50 km
        }
      }
    });

    // Calculate scores for each criterion
    const renewableEnergyScore = calculateRenewableEnergyScore(renewableSources, location.coordinates, weights.renewableEnergy);
    const waterAvailabilityScore = calculateWaterAvailabilityScore(location.coordinates, weights.waterAvailability);
    const transportConnectivityScore = calculateTransportConnectivityScore(transportInfrastructure, weights.transportConnectivity);
    const demandProximityScore = calculateDemandProximityScore(demandCenters, location.coordinates, weights.demandProximity);
    const regulatoryComplianceScore = calculateRegulatoryComplianceScore(location.coordinates, weights.regulatoryCompliance);
    const environmentalImpactScore = calculateEnvironmentalImpactScore(location.coordinates, weights.environmentalImpact);

    // Calculate overall score
    const overallScore = Math.round(
      renewableEnergyScore.score +
      waterAvailabilityScore.score +
      transportConnectivityScore.score +
      demandProximityScore.score +
      regulatoryComplianceScore.score +
      environmentalImpactScore.score
    );

    // Create optimization result
    const optimizationData = {
      name: `Site Analysis - ${new Date().toLocaleDateString()}`,
      type: 'site-selection',
      status: 'completed',
      location,
      suitabilityScore: {
        overall: overallScore,
        breakdown: {
          renewableEnergy: renewableEnergyScore,
          waterAvailability: waterAvailabilityScore,
          transportConnectivity: transportConnectivityScore,
          demandProximity: demandProximityScore,
          regulatoryCompliance: regulatoryComplianceScore,
          environmentalImpact: environmentalImpactScore
        }
      },
      analysis: {
        renewableEnergySources: renewableSources.map(source => ({
          sourceId: source._id,
          type: source.type,
          distance: source.distanceTo ? source.distanceTo(location.coordinates) : null,
          capacity: source.capacity,
          capacityUnit: source.capacityUnit,
          contribution: renewableEnergyScore.score
        })),
        demandCenters: demandCenters.map(center => ({
          centerId: center._id,
          name: center.name,
          type: center.type,
          distance: center.distanceTo ? center.distanceTo(location.coordinates) : null,
          currentDemand: center.demandCenterFields?.hydrogenDemand?.current || 0,
          projectedDemand: center.demandCenterFields?.hydrogenDemand?.projected || 0,
          demandUnit: center.demandCenterFields?.hydrogenDemand?.unit || 'tons/day'
        })),
        transportInfrastructure: transportInfrastructure.map(infra => ({
          infrastructureId: infra._id,
          type: infra.type,
          distance: infra.distanceTo ? infra.distanceTo(location.coordinates) : null,
          capacity: infra.transportFields?.capacity || 'N/A',
          condition: 'good' // Default assumption
        }))
      },
      parameters: {
        weights,
        constraints,
        algorithm: 'multi-criteria-analysis'
      },
      execution: {
        startTime,
        endTime: new Date(),
        algorithm: 'multi-criteria-analysis',
        parameters: { weights, constraints }
      },
      user,
      project,
      recommendations: {
        priority: overallScore >= 80 ? 'high' : overallScore >= 60 ? 'medium' : 'low',
        actions: generateRecommendations(overallScore, {
          renewableEnergyScore,
          waterAvailabilityScore,
          transportConnectivityScore,
          demandProximityScore,
          regulatoryComplianceScore,
          environmentalImpactScore
        }),
        nextSteps: generateNextSteps(overallScore)
      }
    };

    const optimization = await Optimization.create(optimizationData);

    res.status(201).json({
      success: true,
      data: optimization,
      message: 'Site suitability analysis completed successfully'
    });

  } catch (error) {
    console.error('Site analysis error:', error);
    res.status(500).json({
      success: false,
      error: 'Site analysis failed',
      details: error.message
    });
  }
}));

// @desc    Get optimizations by score range
// @route   GET /api/optimization/score/:min/:max
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

  const optimizations = await Optimization.findByScoreRange(minScore, maxScore);

  res.json({
    success: true,
    data: optimizations,
    query: {
      minScore,
      maxScore,
      count: optimizations.length
    }
  });
}));

// @desc    Get optimizations by priority
// @route   GET /api/optimization/priority/:priority
// @access  Public
router.get('/priority/:priority', asyncHandler(async (req, res) => {
  const { priority } = req.params;
  
  if (!['high', 'medium', 'low'].includes(priority)) {
    return res.status(400).json({
      success: false,
      error: 'Priority must be high, medium, or low'
    });
  }

  const optimizations = await Optimization.findByPriority(priority);

  res.json({
    success: true,
    data: optimizations,
    query: {
      priority,
      count: optimizations.length
    }
  });
}));

// @desc    Get optimization statistics
// @route   GET /api/optimization/stats/overview
// @access  Public
router.get('/stats/overview', asyncHandler(async (req, res) => {
  const stats = await Optimization.aggregate([
    {
      $group: {
        _id: null,
        totalOptimizations: { $sum: 1 },
        avgScore: { $avg: '$suitabilityScore.overall' },
        avgExecutionTime: { $avg: '$execution.duration' }
      }
    }
  ]);

  const typeStats = await Optimization.aggregate([
    {
      $group: {
        _id: '$type',
        count: { $sum: 1 }
      }
    }
  ]);

  const statusStats = await Optimization.aggregate([
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 }
      }
    }
  ]);

  const priorityStats = await Optimization.aggregate([
    {
      $group: {
        _id: '$recommendations.priority',
        count: { $sum: 1 }
      }
    }
  ]);

  const scoreDistribution = await Optimization.aggregate([
    {
      $bucket: {
        groupBy: '$suitabilityScore.overall',
        boundaries: [0, 20, 40, 60, 80, 100],
        default: '100+',
        output: {
          count: { $sum: 1 },
          avgScore: { $avg: '$suitabilityScore.overall' }
        }
      }
    }
  ]);

  res.json({
    success: true,
    data: {
      overview: stats[0] || {},
      byType: typeStats,
      byStatus: statusStats,
      byPriority: priorityStats,
      scoreDistribution
    }
  });
}));

// Helper functions for scoring calculations
function calculateRenewableEnergyScore(sources, location, weight) {
  if (!sources || sources.length === 0) {
    return { score: 0, weight, factors: ['No renewable energy sources found'], details: 'No renewable energy sources within specified radius' };
  }

  let score = 0;
  const factors = [];
  
  // Score based on number of sources
  if (sources.length >= 5) score += 10;
  else if (sources.length >= 3) score += 7;
  else if (sources.length >= 1) score += 5;

  // Score based on total capacity
  const totalCapacity = sources.reduce((sum, source) => sum + (source.capacity || 0), 0);
  if (totalCapacity >= 1000) score += 10;
  else if (totalCapacity >= 500) score += 7;
  else if (totalCapacity >= 100) score += 5;

  // Score based on proximity
  const avgDistance = sources.reduce((sum, source) => {
    const distance = source.distanceTo ? source.distanceTo(location) : 50;
    return sum + distance;
  }, 0) / sources.length;

  if (avgDistance <= 10) score += 5;
  else if (avgDistance <= 25) score += 3;
  else if (avgDistance <= 50) score += 1;

  factors.push(`Found ${sources.length} renewable energy sources`);
  factors.push(`Total capacity: ${totalCapacity} MW`);
  factors.push(`Average distance: ${avgDistance.toFixed(1)} km`);

  return {
    score: Math.min(score, 25),
    weight,
    factors,
    details: `Multiple renewable energy sources available with good capacity and proximity`
  };
}

function calculateWaterAvailabilityScore(location, weight) {
  // This would typically integrate with water resource databases
  // For now, use a simplified scoring approach
  const score = 15; // Medium availability assumption
  
  return {
    score,
    weight,
    factors: ['Water availability assessment required'],
    details: 'Water availability needs to be verified through local water resource databases'
  };
}

function calculateTransportConnectivityScore(infrastructure, weight) {
  if (!infrastructure || infrastructure.length === 0) {
    return { score: 0, weight, factors: ['No transport infrastructure found'], details: 'Limited transport connectivity' };
  }

  let score = 0;
  const factors = [];
  
  // Score based on number of transport options
  const transportTypes = new Set(infrastructure.map(infra => infra.type));
  score += transportTypes.size * 5;

  // Score based on proximity
  const avgDistance = infrastructure.reduce((sum, infra) => {
    const distance = infra.distanceTo ? infra.distanceTo(location) : 50;
    return sum + distance;
  }, 0) / infrastructure.length;

  if (avgDistance <= 5) score += 10;
  else if (avgDistance <= 15) score += 7;
  else if (avgDistance <= 30) score += 5;

  factors.push(`Found ${transportTypes.size} transport infrastructure types`);
  factors.push(`Average distance: ${avgDistance.toFixed(1)} km`);

  return {
    score: Math.min(score, 20),
    weight,
    factors,
    details: `Good transport connectivity with multiple options available`
  };
}

function calculateDemandProximityScore(demandCenters, location, weight) {
  if (!demandCenters || demandCenters.length === 0) {
    return { score: 0, weight, factors: ['No demand centers found'], details: 'No nearby demand centers identified' };
  }

  let score = 0;
  const factors = [];
  
  // Score based on number of demand centers
  score += Math.min(demandCenters.length * 3, 9);

  // Score based on total demand
  const totalDemand = demandCenters.reduce((sum, center) => {
    return sum + (center.demandCenterFields?.hydrogenDemand?.current || 0);
  }, 0);

  if (totalDemand >= 100) score += 6;
  else if (totalDemand >= 50) score += 4;
  else if (totalDemand >= 10) score += 2;

  factors.push(`Found ${demandCenters.length} demand centers`);
  factors.push(`Total current demand: ${totalDemand} tons/day`);

  return {
    score: Math.min(score, 15),
    weight,
    factors,
    details: `Multiple demand centers with significant hydrogen demand`
  };
}

function calculateRegulatoryComplianceScore(location, weight) {
  // This would typically integrate with regulatory databases
  // For now, use a simplified scoring approach
  const score = 7; // Medium compliance assumption
  
  return {
    score,
    weight,
    factors: ['Regulatory compliance assessment required'],
    details: 'Regulatory compliance needs to be verified through local authorities'
  };
}

function calculateEnvironmentalImpactScore(location, weight) {
  // This would typically integrate with environmental databases
  // For now, use a simplified scoring approach
  const score = 8; // Medium environmental impact assumption
  
  return {
    score,
    weight,
    factors: ['Environmental impact assessment required'],
    details: 'Environmental impact needs to be assessed through environmental databases'
  };
}

function generateRecommendations(overallScore, scores) {
  const actions = [];
  
  if (overallScore < 60) {
    actions.push({
      action: 'Conduct detailed feasibility study',
      priority: 'high',
      timeline: '1-2 months',
      cost: 50000,
      responsible: 'Project Manager'
    });
  }

  if (scores.renewableEnergyScore.score < 15) {
    actions.push({
      action: 'Explore additional renewable energy sources',
      priority: 'high',
      timeline: '3-6 months',
      cost: 100000,
      responsible: 'Energy Specialist'
    });
  }

  if (scores.waterAvailabilityScore.score < 10) {
    actions.push({
      action: 'Investigate alternative water sources',
      priority: 'medium',
      timeline: '2-4 months',
      cost: 75000,
      responsible: 'Water Resources Specialist'
    });
  }

  if (scores.transportConnectivityScore.score < 10) {
    actions.push({
      action: 'Assess transport infrastructure improvements',
      priority: 'medium',
      timeline: '6-12 months',
      cost: 200000,
      responsible: 'Infrastructure Engineer'
    });
  }

  return actions;
}

function generateNextSteps(overallScore) {
  if (overallScore >= 80) {
    return [
      'Proceed with detailed engineering design',
      'Initiate environmental impact assessment',
      'Begin regulatory permitting process',
      'Develop detailed cost estimates'
    ];
  } else if (overallScore >= 60) {
    return [
      'Conduct additional feasibility studies',
      'Identify and address major constraints',
      'Explore alternative site options',
      'Reassess project scope and requirements'
    ];
  } else {
    return [
      'Consider alternative locations',
      'Reassess project feasibility',
      'Explore different technology options',
      'Consider project scope reduction'
    ];
  }
}

export default router;
