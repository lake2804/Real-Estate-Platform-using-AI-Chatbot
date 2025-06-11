const request = require('supertest');
const app = require('../../app'); // Adjust path to your app.js
const mongoose = require('mongoose');
const User = require('../../models/User.js');

// Ensure JWT_SECRET is set for tests, if not already in environment
process.env.JWT_SECRET = process.env.JWT_SECRET || 'test_secret_key_for_jest';

describe('Auth Routes - Integration Tests', () => {
  // Connect to a test database or ensure the existing one is used carefully
  beforeAll(async () => {
    // It's better to use a separate test database or an in-memory one.
    // For this example, we'll assume MONGODB_URI is set (e.g., via .env)
    // and app.js handles the connection.
    // We will clear the User collection before each test suite run.
    if (mongoose.connection.readyState === 0) {
        // This might be needed if app.js doesn't auto-connect or if you run tests standalone
        // However, app.js should ideally handle its own DB connection.
        // await mongoose.connect(process.env.MONGODB_URI);
    }
    await User.deleteMany({});
  });

  afterEach(async () => {
    // Clean up users after each test to ensure test independence
    await User.deleteMany({});
  });

  afterAll(async () => {
    // Disconnect mongoose if this test suite initiated the connection.
    // If app.js manages the connection, it might handle its own disconnection,
    // or you might leave it open if other test suites need it.
    // await mongoose.connection.close();
  });

  describe('POST /api/auth/register', () => {
    it('should register a new user successfully and return 201', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          fullName: 'Test User',
          email: 'test@example.com',
          password: 'password123',
          phone: '1234567890',
        });
      expect(res.statusCode).toEqual(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.token).toBeDefined();
      expect(res.body.data.user.email).toBe('test@example.com');
    });

    it('should return 400 if email already exists', async () => {
      // First, create a user
      await User.create({
        fullName: 'Existing User',
        email: 'existing@example.com',
        password: 'password123', // In a real scenario, this would be hashed by the model/service
      });

      const res = await request(app)
        .post('/api/auth/register')
        .send({
          fullName: 'Another User',
          email: 'existing@example.com', // Same email
          password: 'password456',
        });
      expect(res.statusCode).toEqual(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe('User with this email already exists');
    });

    it('should return 400 for incomplete data (missing password)', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          fullName: 'Test User Incomplete',
          email: 'incomplete@example.com',
          // password missing
        });
      expect(res.statusCode).toEqual(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe('Please provide all required fields: fullName, email, password');
    });
  });

  describe('POST /api/auth/login', () => {
    beforeEach(async () => {
      // Register a user to test login
      // Note: The password here is plain text. The actual registration endpoint
      // would hash it. For login testing, we need a user in the DB with a
      // known (hashed) password. The register endpoint itself handles hashing.
      await request(app)
        .post('/api/auth/register')
        .send({
            fullName: 'Login TestUser',
            email: 'login@example.com',
            password: 'loginpassword123'
        });
    });

    it('should login an existing user successfully and return 200', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'login@example.com',
          password: 'loginpassword123',
        });
      expect(res.statusCode).toEqual(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.token).toBeDefined();
      expect(res.body.data.user.email).toBe('login@example.com');
    });

    it('should return 401 for non-existent email', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'wrongemail@example.com',
          password: 'loginpassword123',
        });
      expect(res.statusCode).toEqual(401);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe('Invalid email or password');
    });

    it('should return 401 for incorrect password', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'login@example.com',
          password: 'wrongpassword',
        });
      expect(res.statusCode).toEqual(401);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe('Invalid email or password');
    });
  });
});
