import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { AuthService } from '../services/authService';
import { User } from '../models/User';
import bcrypt from 'bcryptjs';

describe('Auth Service', () => {
  let authService: AuthService;

  beforeEach(() => {
    authService = new AuthService();
  });

  it('should register a new user', async () => {
    const userData = {
      email: 'test@example.com',
      password: 'password123',
      firstName: 'Test',
      lastName: 'User',
      phone: '+1234567890'
    };

    const mockUser = {
      _id: 'userId',
      ...userData,
      password: await bcrypt.hash(userData.password, 10),
      save: jest.fn().mockResolvedValue(true)
    };

    User.findOne = jest.fn().mockResolvedValue(null);
    (User as any).create = jest.fn().mockResolvedValue(mockUser);

    const result = await authService.register(userData);

    expect(result.user.email).toBe(userData.email);
    expect(result.token).toBeDefined();
  });

  it('should prevent duplicate email registration', async () => {
    const userData = {
      email: 'existing@example.com',
      password: 'password123',
      firstName: 'Test',
      lastName: 'User',
      phone: '+1234567890'
    };

    User.findOne = jest.fn().mockResolvedValue({ email: userData.email });

    await expect(authService.register(userData)).rejects.toThrow(
      'Email already registered'
    );
  });

  it('should login user with correct credentials', async () => {
    const loginData = {
      email: 'test@example.com',
      password: 'password123'
    };

    const hashedPassword = await bcrypt.hash(loginData.password, 10);
    const mockUser = {
      _id: 'userId',
      email: loginData.email,
      password: hashedPassword
    };

    User.findOne = jest.fn().mockResolvedValue(mockUser);

    const result = await authService.login(loginData.email, loginData.password);

    expect(result.token).toBeDefined();
    expect(result.user.email).toBe(loginData.email);
  });

  it('should reject login with incorrect password', async () => {
    const loginData = {
      email: 'test@example.com',
      password: 'wrongpassword'
    };

    const hashedPassword = await bcrypt.hash('correctpassword', 10);
    const mockUser = {
      _id: 'userId',
      email: loginData.email,
      password: hashedPassword
    };

    User.findOne = jest.fn().mockResolvedValue(mockUser);

    await expect(
      authService.login(loginData.email, loginData.password)
    ).rejects.toThrow('Invalid credentials');
  });
});