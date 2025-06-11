const { register, login } = require('../../controllers/auth.controller');
const User = require('../../models/User.js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Mock dependencies
jest.mock('../../models/User.js', () => ({
  findOne: jest.fn(),
  findByIdAndUpdate: jest.fn(), // Added for login's lastLogin update
  // Mocking the constructor and save method for 'new User()'
  // This is a common pattern: the default export is the constructor.
  default: jest.fn().mockImplementation(() => ({
    save: jest.fn().mockResolvedValue(true), // Mock instance save method
    _id: 'mocked_user_id', // Mocked instance properties
    role: 'user',
    email: 'test@example.com',
    fullName: 'Test User'
  }))
}));

// Need to ensure 'User' itself is also mockable for 'new User()'
// The above 'default' export handles 'new User()'.
// If User.create or static User.save were used, they'd be mocked directly on the User object.


jest.mock('bcryptjs', () => ({
  compare: jest.fn(),
  genSalt: jest.fn(() => Promise.resolve('mocked_salt')), // genSalt is async
  hash: jest.fn(() => Promise.resolve('mocked_hashed_password')), // hash is async
}));

jest.mock('jsonwebtoken', () => ({
  sign: jest.fn(() => 'mocked_jwt_token'),
}));

describe('Auth Controller - Unit Tests', () => {
  let mockReq, mockRes;

  beforeEach(() => {
    // Reset mocks for each test
    jest.clearAllMocks();

    mockReq = {
      body: {},
    };
    mockRes = {
      status: jest.fn().mockReturnThis(), // Allows chaining .status().json()
      json: jest.fn(),
    };
  });

  describe('Register', () => {
    it('should register a new user successfully', async () => {
      mockReq.body = {
        fullName: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        phone: '1234567890'
      };

      User.findOne.mockResolvedValue(null); // User does not exist
      // bcrypt.hash is already mocked to resolve
      // User constructor and save are mocked

      await register(mockReq, mockRes);

      expect(User.findOne).toHaveBeenCalledWith({ email: 'test@example.com'.toLowerCase() });
      expect(bcrypt.hash).toHaveBeenCalledWith('password123', 'mocked_salt'); // Salt is resolved from genSalt
      // Check if 'new User()' was called
      expect(User.default).toHaveBeenCalledWith({
        fullName: 'Test User',
        email: 'test@example.com'.toLowerCase(),
        password: 'mocked_hashed_password',
        phone: '1234567890',
        role: 'user', // default role in controller
        isActive: true // default in controller
      });
      // Check if instance.save() was called - User.default() returns an object with a mock save()
      // This depends on how User model is structured and mocked.
      // If User.default is the constructor, its result will have .save().
      // This test assumes the User mock is set up for `new User().save()` to work.
      // A more specific check would be: expect(User.default.mock.results[0].value.save).toHaveBeenCalled();

      expect(jwt.sign).toHaveBeenCalledWith({ id: 'mocked_user_id' /* from mocked User instance */ }, process.env.JWT_SECRET, { expiresIn: '7d' });
      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({
        success: true,
        message: 'User registered successfully',
        data: expect.objectContaining({
          token: 'mocked_jwt_token',
          user: expect.objectContaining({ email: 'test@example.com' }),
        }),
      }));
    });

    it('should return 400 if user already exists', async () => {
      mockReq.body = { fullName: 'Test User', email: 'test@example.com', password: 'password123' };
      User.findOne.mockResolvedValue({ email: 'test@example.com' }); // User exists

      await register(mockReq, mockRes);

      expect(User.findOne).toHaveBeenCalledWith({ email: 'test@example.com'.toLowerCase() });
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'User with this email already exists',
      });
    });

    it('should return 400 for missing required fields', async () => {
      mockReq.body = { email: 'test@example.com' }; // Missing fullName and password

      await register(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'Please provide all required fields: fullName, email, password',
      });
    });
     it('should return 400 for password less than 6 characters', async () => {
      mockReq.body = { fullName:'Test User', email: 'test@example.com', password:'123' };

      await register(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'Password must be at least 6 characters long',
      });
    });
  });

  describe('Login', () => {
    it('should login an existing user successfully', async () => {
      mockReq.body = { email: 'test@example.com', password: 'password123' };
      const mockUser = {
        _id: 'mocked_user_id',
        email: 'test@example.com',
        password: 'hashed_password_from_db',
        role: 'user',
        isActive: true,
        save: jest.fn().mockResolvedValue(true) // for lastLogin update
      };
      User.findOne.mockResolvedValue(mockUser);
      bcrypt.compare.mockResolvedValue(true); // Password matches

      await login(mockReq, mockRes);

      expect(User.findOne).toHaveBeenCalledWith({ email: 'test@example.com'.toLowerCase(), isActive: true });
      expect(bcrypt.compare).toHaveBeenCalledWith('password123', 'hashed_password_from_db');
      expect(mockUser.save).toHaveBeenCalled(); // To update lastLogin
      expect(jwt.sign).toHaveBeenCalledWith({ id: 'mocked_user_id' }, process.env.JWT_SECRET, { expiresIn: '7d' });
      expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({
        success: true,
        message: 'Login successful',
        data: expect.objectContaining({ token: 'mocked_jwt_token' }),
      }));
    });

    it('should return 401 if user not found', async () => {
      mockReq.body = { email: 'test@example.com', password: 'password123' };
      User.findOne.mockResolvedValue(null); // User not found

      await login(mockReq, mockRes);

      expect(User.findOne).toHaveBeenCalledWith({ email: 'test@example.com'.toLowerCase(), isActive: true });
      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'Invalid email or password',
      });
    });

    it('should return 401 for incorrect password', async () => {
      mockReq.body = { email: 'test@example.com', password: 'wrongpassword' };
      const mockUser = { _id: 'mocked_user_id', email: 'test@example.com', password: 'hashed_password_from_db', isActive: true };
      User.findOne.mockResolvedValue(mockUser);
      bcrypt.compare.mockResolvedValue(false); // Password does not match

      await login(mockReq, mockRes);

      expect(User.findOne).toHaveBeenCalledWith({ email: 'test@example.com'.toLowerCase(), isActive: true });
      expect(bcrypt.compare).toHaveBeenCalledWith('wrongpassword', 'hashed_password_from_db');
      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'Invalid email or password',
      });
    });

    it('should return 400 for missing email or password', async () => {
      mockReq.body = { email: 'test@example.com' }; // Missing password

      await login(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'Please provide email and password',
      });
    });
  });
});
