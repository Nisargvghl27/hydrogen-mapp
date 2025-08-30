import mongoose from "mongoose";

const infrastructureSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  industry: {
    type: String,
    trim: true
  },
  country: {
    type: String,
    trim: true
  },
  coordinates: {
    type: [Number], // [longitude, latitude]
    required: true
  }
}, {
  timestamps: true
});

// Geospatial index
infrastructureSchema.index({ coordinates: "2dsphere" });

const Infrastructure = mongoose.model("Infrastructure", infrastructureSchema);

export default Infrastructure;
