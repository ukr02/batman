import { Repository } from 'typeorm';
import { User, CreateUserRequest, UpdateUserRequest } from '../entities/User';

export class UserRepository {
  private repository: Repository<any>; // Using any since User is an interface

  constructor(repository: Repository<any>) {
    this.repository = repository;
  }

  async findAll(): Promise<User[]> {
    try {
      return await this.repository.find({
        order: { created_at: 'DESC' }
      });
    } catch (error) {
      throw new Error(`Failed to fetch users: ${error}`);
    }
  }

  async findById(id: number): Promise<User | null> {
    try {
      return await this.repository.findOne({ where: { id } });
    } catch (error) {
      throw new Error(`Failed to fetch user with id ${id}: ${error}`);
    }
  }

  async findByEmail(email: string): Promise<User | null> {
    try {
      return await this.repository.findOne({ where: { email } });
    } catch (error) {
      throw new Error(`Failed to fetch user with email ${email}: ${error}`);
    }
  }

  async create(userData: CreateUserRequest): Promise<User> {
    try {
      const user = this.repository.create({
        name: userData.name,
        email: userData.email
      });
      return await this.repository.save(user);
    } catch (error) {
      if (error instanceof Error && error.message.includes('duplicate key')) {
        throw new Error('Email already exists');
      }
      throw new Error(`Failed to create user: ${error}`);
    }
  }

  async update(id: number, userData: UpdateUserRequest): Promise<User | null> {
    try {
      const updateData: Partial<User> = {};

      if (userData.name !== undefined) {
        updateData.name = userData.name;
      }

      if (userData.email !== undefined) {
        updateData.email = userData.email;
      }

      if (Object.keys(updateData).length === 0) {
        return await this.findById(id);
      }

      await this.repository.update(id, updateData);
      return await this.findById(id);
    } catch (error) {
      if (error instanceof Error && error.message.includes('duplicate key')) {
        throw new Error('Email already exists');
      }
      throw new Error(`Failed to update user with id ${id}: ${error}`);
    }
  }

  async delete(id: number): Promise<boolean> {
    try {
      const result = await this.repository.delete(id);
      return result.affected ? result.affected > 0 : false;
    } catch (error) {
      throw new Error(`Failed to delete user with id ${id}: ${error}`);
    }
  }
} 