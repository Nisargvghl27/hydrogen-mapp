# Hydrogen Infrastructure Mapping Platform - Backend

A comprehensive backend API for the Green Hydrogen Infrastructure Mapping and Optimization Platform. This backend provides geospatial data management, optimization algorithms, and data import/export capabilities for hydrogen infrastructure planning.

## 🚀 Features

- **Geospatial Data Management**: Store and query hydrogen plants, renewable energy sources, and infrastructure with MongoDB geospatial indexing
- **Site Suitability Analysis**: Multi-criteria decision making for optimal hydrogen plant locations
- **Data Import/Export**: Support for CSV and JSON data formats
- **RESTful API**: Comprehensive endpoints for all data operations
- **Validation & Error Handling**: Robust input validation and error management
- **Performance Optimization**: Geospatial queries and text search capabilities

## 🏗️ Architecture

```
backend/
├── models/           # MongoDB schemas and models
├── routes/           # API route handlers
├── middleware/       # Custom middleware (validation, error handling)
├── server.js         # Main Express server
├── package.json      # Dependencies and scripts
└── env.example       # Environment configuration template
```

## 🛠️ Technology Stack

- **Runtime**: Node.js (v18+)
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Validation**: Joi schema validation
- **File Upload**: Multer for CSV/JSON processing
- **Security**: Helmet, CORS, rate limiting
- **Logging**: Morgan HTTP request logger

## 📋 Prerequisites

- Node.js 18.0.0 or higher
- MongoDB 5.0 or higher
- npm or yarn package manager

## 🚀 Quick Start

### 1. Clone and Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Copy environment configuration
cp env.example .env

# Edit .env file with your configuration
```

### 2. Environment Configuration

Edit the `.env` file with your settings:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/hydrogen-mapp

# Frontend URL
FRONTEND_URL=http://localhost:3000

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here

# API Keys
MAPBOX_ACCESS_TOKEN=your-mapbox-access-token
```

### 3. Start the Server

```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start

# Health check
curl http://localhost:5000/health
```

## 📊 Database Models

### HydrogenPlant
- Plant information (type, capacity, technology)
- Geospatial location data
- Feasibility scoring
- Environmental and regulatory data

### RenewableEnergy
- Renewable energy sources (solar, wind, hydro, etc.)
- Capacity and performance metrics
- Location and environmental impact

### Infrastructure
- Transport networks, pipelines, demand centers
- Connectivity analysis
- Performance and financial data

### Optimization
- Site suitability analysis results
- Multi-criteria decision making
- Recommendations and next steps

## 🔌 API Endpoints

### Base URL: `http://localhost:5000/api`

#### Hydrogen Plants
```
GET    /hydrogen                    # List all plants with filtering
GET    /hydrogen/:id               # Get plant by ID
POST   /hydrogen                   # Create new plant
PUT    /hydrogen/:id               # Update plant
DELETE /hydrogen/:id               # Delete plant
GET    /hydrogen/radius/:lng/:lat/:radius  # Find plants within radius
GET    /hydrogen/stats/overview    # Get statistics
```

#### Renewable Energy
```
GET    /renewable-energy           # List all sources
GET    /renewable-energy/:id       # Get source by ID
POST   /renewable-energy           # Create new source
GET    /renewable-energy/type/:type # Get by energy type
GET    /renewable-energy/radius/:lng/:lat/:radius # Find within radius
```

#### Infrastructure
```
GET    /infrastructure             # List all infrastructure
GET    /infrastructure/:id         # Get by ID
POST   /infrastructure             # Create new infrastructure
GET    /infrastructure/type/:type  # Get by type
GET    /infrastructure/demand-centers/criteria # Demand center analysis
```

#### Optimization
```
GET    /optimization               # List all optimizations
POST   /optimization/site-analysis # Run site suitability analysis
GET    /optimization/score/:min/:max # Get by score range
GET    /optimization/stats/overview # Get statistics
```

#### Data Management
```
POST   /data/import/csv           # Import CSV data
POST   /data/import/json          # Import JSON data
GET    /data/export/csv           # Export to CSV
GET    /data/export/json          # Export to JSON
GET    /data/stats                # Get data statistics
```

## 🔍 Usage Examples

### Site Suitability Analysis

```bash
curl -X POST http://localhost:5000/api/optimization/site-analysis \
  -H "Content-Type: application/json" \
  -d '{
    "location": {
      "type": "Point",
      "coordinates": [-122.4194, 37.7749]
    },
    "parameters": {
      "weights": {
        "renewableEnergy": 0.3,
        "waterAvailability": 0.25,
        "transportConnectivity": 0.2,
        "demandProximity": 0.15,
        "regulatoryCompliance": 0.1
      }
    },
    "user": {
      "id": "user123",
      "name": "John Doe"
    },
    "project": {
      "id": "proj456",
      "name": "San Francisco Hydrogen Hub"
    }
  }'
```

### Find Hydrogen Plants Near Location

```bash
curl "http://localhost:5000/api/hydrogen/radius/-122.4194/37.7749/50"
```

### Import CSV Data

```bash
curl -X POST http://localhost:5000/api/data/import/csv \
  -F "file=@hydrogen-plants.csv" \
  -F "dataType=hydrogen"
```

## 📁 Data Import Formats

### Hydrogen Plant CSV Format
```csv
name,type,capacity,technology,renewableSource,longitude,latitude,status
"Green Hydrogen Plant 1",electrolysis,100,alkaline,solar,-122.4194,37.7749,planned
"Wind Hydrogen Facility",electrolysis,50,PEM,wind,-122.4000,37.7800,operational
```

### Renewable Energy CSV Format
```csv
name,type,capacity,longitude,latitude,status
"Solar Farm Alpha",solar,500,-122.4194,37.7749,operational
"Wind Farm Beta",wind,200,-122.4000,37.7800,operational
```

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Run specific test file
npm test -- --grep "hydrogen"
```

## 🔒 Security Features

- **Input Validation**: Joi schema validation for all endpoints
- **Rate Limiting**: Configurable rate limiting per IP
- **CORS Protection**: Configurable cross-origin resource sharing
- **Helmet Security**: Security headers and protection
- **Error Handling**: Comprehensive error handling without information leakage

## 📈 Performance Features

- **Geospatial Indexing**: MongoDB 2dsphere indexes for location queries
- **Text Search**: Full-text search capabilities
- **Pagination**: Efficient data pagination
- **Compression**: Response compression for large datasets
- **Caching**: Ready for Redis integration

## 🚀 Deployment

### Production Build

```bash
# Install production dependencies
npm ci --only=production

# Set environment variables
export NODE_ENV=production
export MONGODB_URI=mongodb://your-production-db

# Start server
npm start
```

### Docker Deployment

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | `5000` |
| `NODE_ENV` | Environment mode | `development` |
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/hydrogen-mapp` |
| `FRONTEND_URL` | Frontend application URL | `http://localhost:3000` |
| `JWT_SECRET` | JWT signing secret | Required |
| `MAPBOX_ACCESS_TOKEN` | Mapbox API token | Optional |

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the API documentation
- Review the example requests

## 🔮 Roadmap

- [ ] Real-time data streaming
- [ ] Advanced optimization algorithms
- [ ] Machine learning integration
- [ ] Multi-tenant support
- [ ] Advanced analytics dashboard
- [ ] Integration with external GIS services
