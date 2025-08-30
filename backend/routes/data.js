import express from 'express';
import multer from 'multer';
import csv from 'csv-parser';
import fs from 'fs';
import path from 'path';
import { asyncHandler } from '../middleware/errorHandler.js';
import HydrogenPlant from '../models/HydrogenPlant.js';
import RenewableEnergy from '../models/RenewableEnergy.js';
import Infrastructure from '../models/Infrastructure.js';

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = process.env.UPLOAD_PATH || './uploads';
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: process.env.MAX_FILE_SIZE || 10 * 1024 * 1024 // 10MB default
  },
  fileFilter: function (req, file, cb) {
    // Allow only CSV and JSON files
    if (file.mimetype === 'text/csv' || file.mimetype === 'application/json') {
      cb(null, true);
    } else {
      cb(new Error('Only CSV and JSON files are allowed'), false);
    }
  }
});

// @desc    Import data from CSV file
// @route   POST /api/data/import/csv
// @access  Private
router.post('/import/csv', upload.single('file'), asyncHandler(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      error: 'No file uploaded'
    });
  }

  const { dataType } = req.body; // hydrogen, renewable-energy, infrastructure
  const filePath = req.file.path;
  const results = [];
  const errors = [];

  try {
    // Read and parse CSV file
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (data) => {
        // Clean and validate data
        const cleanedData = cleanCSVData(data, dataType);
        if (cleanedData) {
          results.push(cleanedData);
        } else {
          errors.push({ row: results.length + 1, data, reason: 'Invalid data format' });
        }
      })
      .on('end', async () => {
        try {
          // Import data to appropriate model
          let importedData;
          switch (dataType) {
            case 'hydrogen':
              importedData = await HydrogenPlant.insertMany(results, { validateBeforeSave: true });
              break;
            case 'renewable-energy':
              importedData = await RenewableEnergy.insertMany(results, { validateBeforeSave: true });
              break;
            case 'infrastructure':
              importedData = await Infrastructure.insertMany(results, { validateBeforeSave: true });
              break;
            default:
              throw new Error('Invalid data type specified');
          }

          // Clean up uploaded file
          fs.unlinkSync(filePath);

          res.json({
            success: true,
            message: `Successfully imported ${importedData.length} records`,
            data: {
              imported: importedData.length,
              errors: errors.length,
              totalProcessed: results.length + errors.length
            },
            errors: errors.length > 0 ? errors : undefined
          });

        } catch (importError) {
          // Clean up uploaded file
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
          }

          res.status(500).json({
            success: false,
            error: 'Import failed',
            details: importError.message,
            processed: results.length,
            errors: errors.length
          });
        }
      })
      .on('error', (error) => {
        // Clean up uploaded file
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }

        res.status(500).json({
          success: false,
          error: 'CSV parsing failed',
          details: error.message
        });
      });

  } catch (error) {
    // Clean up uploaded file
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    res.status(500).json({
      success: false,
      error: 'File processing failed',
      details: error.message
    });
  }
}));

// @desc    Import data from JSON file
// @route   POST /api/data/import/json
// @access  Private
router.post('/import/json', upload.single('file'), asyncHandler(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      error: 'No file uploaded'
    });
  }

  const { dataType } = req.body;
  const filePath = req.file.path;

  try {
    // Read and parse JSON file
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const jsonData = JSON.parse(fileContent);

    if (!Array.isArray(jsonData)) {
      throw new Error('JSON file must contain an array of objects');
    }

    // Clean and validate data
    const results = [];
    const errors = [];

    jsonData.forEach((item, index) => {
      const cleanedData = cleanJSONData(item, dataType);
      if (cleanedData) {
        results.push(cleanedData);
      } else {
        errors.push({ row: index + 1, data: item, reason: 'Invalid data format' });
      }
    });

    // Import data to appropriate model
    let importedData;
    switch (dataType) {
      case 'hydrogen':
        importedData = await HydrogenPlant.insertMany(results, { validateBeforeSave: true });
        break;
      case 'renewable-energy':
        importedData = await RenewableEnergy.insertMany(results, { validateBeforeSave: true });
        break;
      case 'infrastructure':
        importedData = await Infrastructure.insertMany(results, { validateBeforeSave: true });
        break;
      default:
        throw new Error('Invalid data type specified');
    }

    // Clean up uploaded file
    fs.unlinkSync(filePath);

    res.json({
      success: true,
      message: `Successfully imported ${importedData.length} records`,
      data: {
        imported: importedData.length,
        errors: errors.length,
        totalProcessed: results.length + errors.length
      },
      errors: errors.length > 0 ? errors : undefined
    });

  } catch (error) {
    // Clean up uploaded file
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    res.status(500).json({
      success: false,
      error: 'JSON import failed',
      details: error.message
    });
  }
}));

// @desc    Export data to CSV
// @route   GET /api/data/export/csv
// @access  Private
router.get('/export/csv', asyncHandler(async (req, res) => {
  const { dataType, filters } = req.query;
  
  if (!dataType) {
    return res.status(400).json({
      success: false,
      error: 'Data type is required'
    });
  }

  try {
    let data;
    let filename;

    // Get data based on type and filters
    switch (dataType) {
      case 'hydrogen':
        data = await HydrogenPlant.find(buildQueryFilters(filters)).select('-__v');
        filename = 'hydrogen-plants.csv';
        break;
      case 'renewable-energy':
        data = await RenewableEnergy.find(buildQueryFilters(filters)).select('-__v');
        filename = 'renewable-energy.csv';
        break;
      case 'infrastructure':
        data = await Infrastructure.find(buildQueryFilters(filters)).select('-__v');
        filename = 'infrastructure.csv';
        break;
      default:
        return res.status(400).json({
          success: false,
          error: 'Invalid data type'
        });
    }

    // Convert to CSV format
    const csvData = convertToCSV(data);

    // Set response headers for file download
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-Length', Buffer.byteLength(csvData));

    res.send(csvData);

  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Export failed',
      details: error.message
    });
  }
}));

// @desc    Export data to JSON
// @route   GET /api/data/export/json
// @access  Private
router.get('/export/json', asyncHandler(async (req, res) => {
  const { dataType, filters } = req.query;
  
  if (!dataType) {
    return res.status(400).json({
      success: false,
      error: 'Data type is required'
    });
  }

  try {
    let data;
    let filename;

    // Get data based on type and filters
    switch (dataType) {
      case 'hydrogen':
        data = await HydrogenPlant.find(buildQueryFilters(filters)).select('-__v');
        filename = 'hydrogen-plants.json';
        break;
      case 'renewable-energy':
        data = await RenewableEnergy.find(buildQueryFilters(filters)).select('-__v');
        filename = 'renewable-energy.json';
        break;
      case 'infrastructure':
        data = await Infrastructure.find(buildQueryFilters(filters)).select('-__v');
        filename = 'infrastructure.json';
        break;
      default:
        return res.status(400).json({
          success: false,
          error: 'Invalid data type'
        });
    }

    // Set response headers for file download
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

    res.json({
      success: true,
      data: data,
      exportInfo: {
        dataType,
        recordCount: data.length,
        exportDate: new Date().toISOString(),
        filters: filters || 'none'
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Export failed',
      details: error.message
    });
  }
}));

// @desc    Get data statistics
// @route   GET /api/data/stats
// @access  Public
router.get('/stats', asyncHandler(async (req, res) => {
  try {
    const [hydrogenStats, renewableStats, infrastructureStats] = await Promise.all([
      HydrogenPlant.countDocuments(),
      RenewableEnergy.countDocuments(),
      Infrastructure.countDocuments()
    ]);

    const totalRecords = hydrogenStats + renewableStats + infrastructureStats;

    res.json({
      success: true,
      data: {
        totalRecords,
        breakdown: {
          hydrogenPlants: hydrogenStats,
          renewableEnergy: renewableStats,
          infrastructure: infrastructureStats
        },
        percentages: {
          hydrogenPlants: Math.round((hydrogenStats / totalRecords) * 100),
          renewableEnergy: Math.round((renewableStats / totalRecords) * 100),
          infrastructure: Math.round((infrastructureStats / totalRecords) * 100)
        }
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to get statistics',
      details: error.message
    });
  }
}));

// @desc    Validate data format
// @route   POST /api/data/validate
// @access  Private
router.post('/validate', asyncHandler(async (req, res) => {
  const { data, dataType } = req.body;

  if (!Array.isArray(data) || data.length === 0) {
    return res.status(400).json({
      success: false,
      error: 'Data must be a non-empty array'
    });
  }

  const validationResults = [];
  const errors = [];

  data.forEach((item, index) => {
    try {
      const validationResult = validateDataItem(item, dataType);
      if (validationResult.isValid) {
        validationResults.push({
          row: index + 1,
          status: 'valid',
          data: item
        });
      } else {
        errors.push({
          row: index + 1,
          status: 'invalid',
          data: item,
          errors: validationResult.errors
        });
      }
    } catch (error) {
      errors.push({
        row: index + 1,
        status: 'error',
        data: item,
        error: error.message
      });
    }
  });

  res.json({
    success: true,
    data: {
      totalRecords: data.length,
      validRecords: validationResults.length,
      invalidRecords: errors.length,
      validationResults,
      errors: errors.length > 0 ? errors : undefined
    }
  });
}));

// Helper functions
function cleanCSVData(data, dataType) {
  try {
    const cleaned = {};
    
    // Remove empty values and clean strings
    Object.keys(data).forEach(key => {
      if (data[key] && data[key].trim() !== '') {
        cleaned[key] = data[key].trim();
      }
    });

    // Convert numeric fields
    if (cleaned.capacity) cleaned.capacity = Number(cleaned.capacity);
    if (cleaned.longitude) cleaned.longitude = Number(cleaned.longitude);
    if (cleaned.latitude) cleaned.latitude = Number(cleaned.latitude);

    // Handle location field
    if (cleaned.longitude && cleaned.latitude) {
      cleaned.location = {
        type: 'Point',
        coordinates: [cleaned.longitude, cleaned.latitude]
      };
      delete cleaned.longitude;
      delete cleaned.latitude;
    }

    return cleaned;
  } catch (error) {
    return null;
  }
}

function cleanJSONData(data, dataType) {
  try {
    // Deep clean the data object
    const cleaned = JSON.parse(JSON.stringify(data));
    
    // Remove undefined and null values
    Object.keys(cleaned).forEach(key => {
      if (cleaned[key] === undefined || cleaned[key] === null) {
        delete cleaned[key];
      }
    });

    return cleaned;
  } catch (error) {
    return null;
  }
}

function buildQueryFilters(filters) {
  if (!filters) return {};

  try {
    const parsedFilters = JSON.parse(filters);
    const query = {};

    // Build MongoDB query from filters
    if (parsedFilters.search) {
      query.$text = { $search: parsedFilters.search };
    }

    if (parsedFilters.type) query.type = parsedFilters.type;
    if (parsedFilters.status) query.status = parsedFilters.status;
    if (parsedFilters.country) query['address.country'] = parsedFilters.country;
    if (parsedFilters.region) query['address.state'] = parsedFilters.region;

    if (parsedFilters.minScore || parsedFilters.maxScore) {
      query.feasibilityScore = {};
      if (parsedFilters.minScore) query.feasibilityScore.$gte = Number(parsedFilters.minScore);
      if (parsedFilters.maxScore) query.feasibilityScore.$lte = Number(parsedFilters.maxScore);
    }

    if (parsedFilters.minCapacity || parsedFilters.maxCapacity) {
      query.capacity = {};
      if (parsedFilters.minCapacity) query.capacity.$gte = Number(parsedFilters.minCapacity);
      if (parsedFilters.maxCapacity) query.capacity.$lte = Number(parsedFilters.maxCapacity);
    }

    return query;
  } catch (error) {
    return {};
  }
}

function convertToCSV(data) {
  if (!data || data.length === 0) return '';

  const headers = Object.keys(data[0]);
  const csvRows = [headers.join(',')];

  data.forEach(row => {
    const values = headers.map(header => {
      const value = row[header];
      if (value === null || value === undefined) return '';
      if (typeof value === 'object') return JSON.stringify(value);
      return String(value).replace(/"/g, '""');
    });
    csvRows.push(values.join(','));
  });

  return csvRows.join('\n');
}

function validateDataItem(item, dataType) {
  const errors = [];
  
  // Basic validation
  if (!item.name) errors.push('Name is required');
  if (!item.location) errors.push('Location is required');
  
  // Type-specific validation
  switch (dataType) {
    case 'hydrogen':
      if (!item.type) errors.push('Type is required');
      if (!item.capacity) errors.push('Capacity is required');
      if (!item.technology) errors.push('Technology is required');
      if (!item.renewableSource) errors.push('Renewable source is required');
      break;
      
    case 'renewable-energy':
      if (!item.type) errors.push('Type is required');
      if (!item.capacity) errors.push('Capacity is required');
      break;
      
    case 'infrastructure':
      if (!item.type) errors.push('Type is required');
      if (!item.category) errors.push('Category is required');
      break;
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

export default router;
