import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import RenewableEnergy from '../models/RenewableEnergy.js';

// ✅ Recreate __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') });

// Renewable energy data from the user
const renewableEnergyData = [
  {
    name: "Bangalore Solar Park",
    type: "solar",
    status: "operational",
    capacity: 200,
    capacityUnit: "MW",
    location: {
      type: "Point",
      coordinates: [77.5946, 12.9716]
    },
    address: {
      city: "Bangalore",
      state: "Karnataka",
      country: "India"
    },
    solarFields: {
      panelType: "monocrystalline",
      efficiency: 20.5,
      tiltAngle: 25,
      azimuth: 180,
      groundCoverageRatio: 0.45
    },
    environmentalImpact: {
      landUse: 500,
      carbonOffset: 150000,
      biodiversityImpact: "low"
    },
    gridConnection: {
      voltage: 220,
      distanceToGrid: 15,
      connectionType: "transmission"
    },
    performance: {
      annualGeneration: 300000,
      availability: 95,
      efficiency: 20
    },
    financial: {
      capitalCost: 120000000,
      operationalCost: 3000000,
      levelizedCost: 40,
      currency: "USD"
    },
    timeline: {
      startDate: "2019-01-01",
      completionDate: "2020-06-01",
      operationalDate: "2020-07-01",
      expectedLifespan: 25
    },
    contact: {
      owner: "Solar Future Pvt Ltd",
      email: "info@solarfuture.com"
    },
    metadata: {
      dataSource: "MNRE",
      accuracy: "high",
      updateFrequency: "yearly"
    }
  },
  {
    name: "Madrid Wind Farm",
    type: "wind",
    status: "operational",
    capacity: 500,
    capacityUnit: "MW",
    location: {
      type: "Point",
      coordinates: [-3.7038, 40.4168]
    },
    address: {
      city: "Madrid",
      state: "Madrid",
      country: "Spain"
    },
    windFields: {
      turbineType: "onshore",
      hubHeight: 120,
      rotorDiameter: 150,
      cutInSpeed: 3,
      cutOutSpeed: 25,
      ratedSpeed: 12
    },
    environmentalImpact: {
      landUse: 200,
      carbonOffset: 500000,
      biodiversityImpact: "medium"
    },
    gridConnection: {
      voltage: 400,
      distanceToGrid: 10,
      connectionType: "transmission"
    },
    performance: {
      annualGeneration: 1200000,
      availability: 97,
      efficiency: 45
    },
    financial: {
      capitalCost: 800000000,
      operationalCost: 20000000,
      levelizedCost: 50,
      currency: "USD"
    },
    timeline: {
      startDate: "2015-05-01",
      completionDate: "2017-12-01",
      operationalDate: "2018-01-01",
      expectedLifespan: 30
    },
    contact: {
      owner: "Wind Spain S.A.",
      email: "contact@windspain.es"
    },
    metadata: {
      dataSource: "European Energy Agency",
      accuracy: "high",
      updateFrequency: "yearly"
    }
  },
  {
    name: "Columbia Hydro Plant",
    type: "hydro",
    status: "operational",
    capacity: 1000,
    capacityUnit: "MW",
    location: {
      type: "Point",
      coordinates: [-120.7401, 47.7511]
    },
    address: {
      city: "Wenatchee",
      state: "Washington",
      country: "USA"
    },
    hydroFields: {
      damType: "reservoir",
      headHeight: 80,
      flowRate: 1200,
      reservoirCapacity: 1000000000
    },
    environmentalImpact: {
      landUse: 3000,
      carbonOffset: 2000000,
      biodiversityImpact: "high"
    },
    gridConnection: {
      voltage: 500,
      distanceToGrid: 2,
      connectionType: "transmission"
    },
    performance: {
      annualGeneration: 4000000,
      availability: 99,
      efficiency: 90
    },
    financial: {
      capitalCost: 3000000000,
      operationalCost: 100000000,
      levelizedCost: 20,
      currency: "USD"
    },
    timeline: {
      startDate: "2000-01-01",
      completionDate: "2005-06-01",
      operationalDate: "2006-01-01",
      expectedLifespan: 80
    },
    contact: {
      owner: "US Hydro Corp",
      email: "support@ushydro.com"
    },
    metadata: {
      dataSource: "US DOE",
      accuracy: "medium",
      updateFrequency: "yearly"
    }
  }
];

// Database connection
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`✅ MongoDB connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error('❌ Error connecting to MongoDB:', error.message);
    process.exit(1);
  }
};

// Populate database
const populateDatabase = async () => {
  try {
    console.log('🚀 Starting database population...');
    
    // Clear existing data
    await RenewableEnergy.deleteMany({});
    console.log('🗑️  Cleared existing renewable energy data');
    
    // Insert new data
    const result = await RenewableEnergy.insertMany(renewableEnergyData);
    console.log(`✅ Successfully inserted ${result.length} renewable energy sources`);
    
    // Display summary
    const stats = await RenewableEnergy.aggregate([
      {
        $group: {
          _id: '$type',
          count: { $sum: 1 },
          totalCapacity: { $sum: '$capacity' }
        }
      }
    ]);
    
    console.log('\n📊 Database Summary:');
    stats.forEach(stat => {
      console.log(`  ${stat._id}: ${stat.count} sources, ${stat.totalCapacity} MW total`);
    });
    
    console.log('\n🎉 Database population completed successfully!');
    
  } catch (error) {
    console.error('❌ Error populating database:', error.message);
  } finally {
    // Close connection
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
    process.exit(0);
  }
};

// Run the script
if (import.meta.url === `file://${process.argv[1]}`) {
  connectDB().then(() => populateDatabase());
}
