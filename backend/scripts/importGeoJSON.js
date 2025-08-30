import fs from "fs";
import mongoose from "mongoose";
import Infrastructure from "./models/Infrastructure.js"; // your schema

// 1. MongoDB connection
mongoose.connect("mongodb://localhost:27017/hydrogen-mapp", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.once("open", () => {
  console.log("✅ MongoDB connected");
});

// 2. Load GeoJSON file
const geojsonData = JSON.parse(fs.readFileSync("industrial_clusters[1].geojson", "utf-8"));

// 3. Parse & Insert Features
async function importData() {
  if (!geojsonData.features) {
    console.error("❌ Invalid GeoJSON format");
    process.exit(1);
  }

  const docs = geojsonData.features.map((feature) => {
    return {
      name: feature.properties?.name || "Unknown",
      industry: feature.properties?.industry || null,
      country: feature.properties?.country || null,
      coordinates: feature.geometry?.coordinates || [],
    };
  });

  try {
    await Infrastructure.insertMany(docs);
    console.log(`✅ Imported ${docs.length} records into MongoDB`);
    process.exit();
  } catch (err) {
    console.error("❌ Error inserting data:", err);
    process.exit(1);
  }
}

importData();
