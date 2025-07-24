import { Request, Response } from 'express';
import { UserService } from '../services/UserService';
import { CreateUserRequest, UpdateUserRequest } from '../entities/User';

export class UserController {
  private userService: UserService;

  constructor(userService: UserService) {
    this.userService = userService;
  }

  async getAllUsers(req: Request, res: Response): Promise<void> {
    try {
      const users = await this.userService.getAllUsers();
      res.status(200).json({
        success: true,
        data: users,
        message: 'Users retrieved successfully'
      });
    } catch (error) {
      console.error('Error in getAllUsers:', error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error'
      });
    }
  }

  async getUserById(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        res.status(400).json({
          success: false,
          error: 'Invalid user ID'
        });
        return;
      }

      const user = await this.userService.getUserById(id);
      
      if (!user) {
        res.status(404).json({
          success: false,
          error: 'User not found'
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: user,
        message: 'User retrieved successfully'
      });
    } catch (error) {
      console.error('Error in getUserById:', error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error'
      });
    }
  }

  async createUser(req: Request, res: Response): Promise<void> {
    try {
      const userData: CreateUserRequest = req.body;

      if (!userData.name || !userData.email) {
        res.status(400).json({
          success: false,
          error: 'Name and email are required'
        });
        return;
      }

      const user = await this.userService.createUser(userData);
      
      res.status(201).json({
        success: true,
        data: user,
        message: 'User created successfully'
      });
    } catch (error) {
      console.error('Error in createUser:', error);
      
      if (error instanceof Error && error.message.includes('already exists')) {
        res.status(409).json({
          success: false,
          error: error.message
        });
        return;
      }

      if (error instanceof Error && error.message.includes('Validation failed')) {
        res.status(400).json({
          success: false,
          error: error.message
        });
        return;
      }

      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error'
      });
    }
  }

  async updateUser(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        res.status(400).json({
          success: false,
          error: 'Invalid user ID'
        });
        return;
      }

      const userData: UpdateUserRequest = req.body;

      if (!userData.name && !userData.email) {
        res.status(400).json({
          success: false,
          error: 'At least one field (name or email) is required'
        });
        return;
      }

      const user = await this.userService.updateUser(id, userData);
      
      if (!user) {
        res.status(404).json({
          success: false,
          error: 'User not found'
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: user,
        message: 'User updated successfully'
      });
    } catch (error) {
      console.error('Error in updateUser:', error);
      
      if (error instanceof Error && error.message.includes('already exists')) {
        res.status(409).json({
          success: false,
          error: error.message
        });
        return;
      }

      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error'
      });
    }
  }

  async deleteUser(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        res.status(400).json({
          success: false,
          error: 'Invalid user ID'
        });
        return;
      }

      const deleted = await this.userService.deleteUser(id);
      
      if (!deleted) {
        res.status(404).json({
          success: false,
          error: 'User not found'
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'User deleted successfully'
      });
    } catch (error) {
      console.error('Error in deleteUser:', error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error'
      });
    }
  }
} 