import { UserRepository } from '../repositories/UserRepository';
import { User, CreateUserRequest, UpdateUserRequest } from '../entities/User';
import { UserEntity } from '../entities/User';

export class UserService {
  private userRepository: UserRepository;

  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository;
  }

  async getAllUsers(): Promise<User[]> {
    try {
      return await this.userRepository.findAll();
    } catch (error) {
      throw new Error(`Service error: ${error}`);
    }
  }

  async getUserById(id: number): Promise<User | null> {
    try {
      if (!id || id <= 0) {
        throw new Error('Invalid user ID');
      }
      return await this.userRepository.findById(id);
    } catch (error) {
      throw new Error(`Service error: ${error}`);
    }
  }

  async createUser(userData: CreateUserRequest): Promise<User> {
    try {
      // Validate input data
      const validation = UserEntity.validate(userData);
      if (!validation.isValid) {
        throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
      }

      // Check if user with email already exists
      const existingUser = await this.userRepository.findByEmail(userData.email);
      if (existingUser) {
        throw new Error('User with this email already exists');
      }

      return await this.userRepository.create(userData);
    } catch (error) {
      throw new Error(`Service error: ${error}`);
    }
  }

  async updateUser(id: number, userData: UpdateUserRequest): Promise<User | null> {
    try {
      if (!id || id <= 0) {
        throw new Error('Invalid user ID');
      }

      // Check if user exists
      const existingUser = await this.userRepository.findById(id);
      if (!existingUser) {
        return null;
      }

      // If email is being updated, check if it's already taken
      if (userData.email && userData.email !== existingUser.email) {
        const userWithEmail = await this.userRepository.findByEmail(userData.email);
        if (userWithEmail) {
          throw new Error('User with this email already exists');
        }
      }

      return await this.userRepository.update(id, userData);
    } catch (error) {
      throw new Error(`Service error: ${error}`);
    }
  }

  async deleteUser(id: number): Promise<boolean> {
    try {
      if (!id || id <= 0) {
        throw new Error('Invalid user ID');
      }

      // Check if user exists
      const existingUser = await this.userRepository.findById(id);
      if (!existingUser) {
        return false;
      }

      return await this.userRepository.delete(id);
    } catch (error) {
      throw new Error(`Service error: ${error}`);
    }
  }

  async getUserByEmail(email: string): Promise<User | null> {
    try {
      if (!email || email.trim().length === 0) {
        throw new Error('Email is required');
      }

      return await this.userRepository.findByEmail(email);
    } catch (error) {
      throw new Error(`Service error: ${error}`);
    }
  }
} 