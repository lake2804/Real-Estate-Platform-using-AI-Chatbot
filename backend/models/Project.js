import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  title: {
    type: String // Keep as regular field
  },
  description: {
    type: String,
    required: true
  },
  developer: {
    name: String,
    description: String,
    contact: {
      phone: String,
      email: String,
      website: String
    }
  },
  location: {
    address: String,
    district: String,
    city: String,
    coordinates: {
      lat: Number,
      lng: Number
    }
  },
  status: {
    type: String,
    enum: ['planning', 'under-construction', 'completed', 'pre-launch', 'active', 'upcoming'],
    default: 'planning'
  },
  pricing: {
    priceFrom: Number,
    priceTo: Number
  },
  units: {
    total: Number,
    available: Number,
    sold: Number
  },
  timeline: {
    launchDate: Date,
    completionDate: Date
  },
  amenities: [String],
  images: [{
    url: String,
    alt: String,
    isPrimary: Boolean
  }],
  floors: Number,
  blocks: Number,
  area: Number,
  apartments: Number,
  isFeatured: {
    type: Boolean,
    default: false
  },
  views: {
    type: Number,
    default: Date.now
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

const Project = mongoose.model('Project', projectSchema);
module.exports =  Project;