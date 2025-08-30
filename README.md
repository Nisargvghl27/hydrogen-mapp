# Green Hydrogen Infrastructure Mapping and Optimization Platform

A comprehensive digital platform for green hydrogen infrastructure mapping, site suitability analysis, and optimization. This platform consolidates geospatial, industrial, and environmental datasets to support planning and investment decisions in the hydrogen ecosystem.

## 🎯 Problem Statement

Hydrogen infrastructure development faces challenges such as:
- Lack of coordinated mapping tools
- Data silos across regions
- Difficulty in assessing real-time feasibility of projects
- Complex multi-criteria decision making for site selection

## 🚀 Solution Overview

This platform provides:
- **Interactive geospatial visualization** of potential hydrogen hubs using Mapbox
- **Integration of renewable energy datasets**, water availability, and demand clusters
- **Filtering and ranking** based on key feasibility conditions
- **AI/ML-powered site suitability analysis** using multi-criteria decision models
- **Scenario analysis** for scaling infrastructure investments

## 🏗️ System Architecture

```
hydrogen-mapp/
├── frontend/          # React.js frontend application
│   ├── src/          # Source code
│   ├── public/       # Static assets
│   └── package.json  # Frontend dependencies
├── backend/           # Node.js/Express backend API
│   ├── models/       # MongoDB schemas
│   ├── routes/       # API endpoints
│   ├── middleware/   # Custom middleware
│   └── server.js     # Express server
└── README.md         # This file
```

## 🛠️ Technology Stack

### Frontend
- **React.js** - Responsive and dynamic UI
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Modern styling framework
- **Shadcn/ui** - High-quality UI components
- **Mapbox** - Interactive mapping and geospatial visualization

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database with geospatial support
- **Mongoose** - MongoDB object modeling
- **Joi** - Data validation
- **Multer** - File upload handling

## 📊 Key Features

### 1. Geospatial Data Management
- Store and query hydrogen plants, renewable energy sources, and infrastructure
- Geospatial indexing for efficient location-based queries
- Support for Point, LineString, and Polygon geometries

### 2. Site Suitability Analysis
- Multi-criteria decision making algorithm
- Weighted scoring based on:
  - Proximity to renewable energy sources (25%)
  - Water availability (20%)
  - Transport connectivity (20%)
  - Demand proximity (15%)
  - Regulatory compliance (10%)
  - Environmental impact (10%)

### 3. Data Integration
- Import/export capabilities for CSV and JSON formats
- Bulk data operations
- Data validation and cleaning
- Real-time data updates

### 4. Interactive Mapping
- Overlay multiple data layers
- Filter and search capabilities
- Distance and radius queries
- Custom styling and theming

## 🚀 Quick Start

### Prerequisites
- Node.js 18.0.0 or higher
- MongoDB 5.0 or higher
- npm or yarn package manager

### 1. Clone the Repository
```bash
git clone <repository-url>
cd hydrogen-mapp
```

### 2. Backend Setup
```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Copy environment configuration
cp env.example .env

# Edit .env file with your configuration
# Set MONGODB_URI, JWT_SECRET, etc.

# Start the backend server
npm run dev
```

The backend will start on `http://localhost:5000`

### 3. Frontend Setup
```bash
# Open a new terminal and navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start the frontend development server
npm run dev
```

The frontend will start on `http://localhost:3000`

### 4. Verify Installation
- Backend health check: `http://localhost:5000/health`
- Frontend: `http://localhost:3000`
- API base: `http://localhost:5000/api`

## 📁 Project Structure

### Frontend (`/frontend`)
```
frontend/
├── src/
│   ├── components/     # Reusable UI components
│   ├── pages/         # Page components
│   ├── hooks/         # Custom React hooks
│   ├── lib/           # Utility functions
│   └── assets/        # Images and static files
├── public/            # Public assets
├── package.json       # Dependencies
└── README.md          # Frontend documentation
```

### Backend (`/backend`)
```
backend/
├── models/            # MongoDB schemas
│   ├── HydrogenPlant.js
│   ├── RenewableEnergy.js
│   ├── Infrastructure.js
│   └── Optimization.js
├── routes/            # API endpoints
│   ├── hydrogen.js
│   ├── renewableEnergy.js
│   ├── infrastructure.js
│   ├── optimization.js
│   └── data.js
├── middleware/        # Custom middleware
│   ├── errorHandler.js
│   └── validation.js
├── server.js          # Main server file
├── package.json       # Dependencies
└── README.md          # Backend documentation
```

## 🔌 API Endpoints

### Base URL: `http://localhost:5000/api`

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/health` | GET | Server health check |
| `/hydrogen` | GET/POST | Hydrogen plant management |
| `/renewable-energy` | GET/POST | Renewable energy sources |
| `/infrastructure` | GET/POST | Infrastructure assets |
| `/optimization` | GET/POST | Site suitability analysis |
| `/data/import/*` | POST | Data import (CSV/JSON) |
| `/data/export/*` | GET | Data export (CSV/JSON) |

## 📊 Data Models

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
    }
  }'
```

### Find Hydrogen Plants Near Location
```bash
curl "http://localhost:5000/api/hydrogen/radius/-122.4194/37.7749/50"
```

## 🧪 Testing

### Backend Testing
```bash
cd backend
npm test
```

### Frontend Testing
```bash
cd frontend
npm test
```

## 🚀 Deployment

### Development
```bash
# Backend
cd backend && npm run dev

# Frontend (new terminal)
cd frontend && npm run dev
```

### Production
```bash
# Backend
cd backend && npm start

# Frontend
cd frontend && npm run build
npm run preview
```

## 🔒 Security Features

- Input validation using Joi schemas
- Rate limiting per IP address
- CORS protection
- Security headers with Helmet
- Comprehensive error handling

## 📈 Performance Features

- MongoDB geospatial indexing
- Full-text search capabilities
- Response compression
- Efficient pagination
- Ready for Redis caching integration

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the API documentation in `/backend/README.md`
- Review the frontend documentation in `/frontend/README.md`

## 🔮 Roadmap

- [ ] Real-time data streaming
- [ ] Advanced optimization algorithms
- [ ] Machine learning integration
- [ ] Multi-tenant support
- [ ] Advanced analytics dashboard
- [ ] Integration with external GIS services
- [ ] Mobile application
- [ ] API rate limiting and authentication
- [ ] Advanced reporting and analytics

## 📚 Additional Resources

- [Backend Documentation](./backend/README.md)
- [Frontend Documentation](./frontend/README.md)
- [API Reference](./backend/README.md#api-endpoints)
- [Data Models](./backend/README.md#database-models)

## 🙏 Acknowledgments

- Open source community for the excellent tools and libraries
- Hydrogen industry experts for domain knowledge
- GIS and mapping communities for geospatial expertise
