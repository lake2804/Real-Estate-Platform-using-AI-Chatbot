const request = require('supertest');
const app = require('../../app'); // Adjust path to your app.js
const mongoose = require('mongoose');
const Property = require('../../models/Property.cjs'); // Adjusted to .cjs as per original file structure
// const Project = require('../../models/Project.js'); // If creating related data

describe('Property Routes - Integration Tests', () => {
  let testProperty;

  beforeAll(async () => {
    if (mongoose.connection.readyState === 0) {
      // Ensure DB is connected, potentially via app.js or explicitly here if needed
    }
    await Property.deleteMany({});
    // await Project.deleteMany({}); // If projects are linked and need cleanup
  });

  beforeEach(async () => {
    // Create a sample property before each test that needs one
    const propertyData = {
      title: 'Test Property for Integration Test',
      description: 'A beautiful property for testing purposes.',
      propertyType: 'Villa',
      status: 'Sale',
      price: 500000,
      area: 250,
      bedrooms: 4,
      bathrooms: 3,
      location: {
        address: '123 Test St',
        city: 'Testville',
        zipCode: '12345',
      },
      features: ['Garden', 'Pool'],
      owner: new mongoose.Types.ObjectId(), // Mock an owner ID
      // Ensure all required fields from your Property model are present
      slug: 'test-property-for-integration-test', // Assuming slug is auto-generated or required
      images: ['image1.jpg', 'image2.jpg'], // Assuming images are required
      featured: false,
      tags: ['test', 'integration']
    };
    testProperty = await new Property(propertyData).save();
  });

  afterEach(async () => {
    await Property.deleteMany({});
    // await Project.deleteMany({});
  });

  afterAll(async () => {
    // await mongoose.connection.close(); // Optional: depends on test setup
  });

  describe('GET /api/properties', () => {
    it('should return 200 and an array of properties', async () => {
      const res = await request(app).get('/api/properties');
      expect(res.statusCode).toEqual(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data.properties)).toBe(true);
      expect(res.body.data.properties.length).toBeGreaterThan(0); // Since we add one in beforeEach
      expect(res.body.data.properties[0].title).toBe('Test Property for Integration Test');
    });
  });

  describe('GET /api/properties/:id', () => {
    it('should return 200 and the correct property if ID is valid', async () => {
      const res = await request(app).get(`/api/properties/${testProperty._id}`);
      expect(res.statusCode).toEqual(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.property.title).toBe('Test Property for Integration Test');
      expect(res.body.data.property._id.toString()).toEqual(testProperty._id.toString());
    });

    it('should return 404 if property ID does not exist', async () => {
      const nonExistentId = new mongoose.Types.ObjectId();
      const res = await request(app).get(`/api/properties/${nonExistentId}`);
      expect(res.statusCode).toEqual(404);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe('Property not found');
    });

    it('should return 400 for an invalid MongoDB ID format', async () => {
      const invalidId = 'invalid-id-format';
      const res = await request(app).get(`/api/properties/${invalidId}`);
      expect(res.statusCode).toEqual(400); // Or 500 depending on error handling for CastError
      expect(res.body.success).toBe(false);
      // The message might vary, e.g. "Invalid ID format" or relating to Cast to ObjectId failed
      expect(res.body.message).toMatch(/Cast to ObjectId failed|Invalid ID/i);
    });
  });
});
