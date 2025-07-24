import { Router } from 'express';
import { UserController } from '../controllers/UserController';
import { UserService } from '../services/UserService';
import { UserRepository } from '../repositories/UserRepository';
import { AppDataSource } from '../database/data-source';

export const createUserRoutes = () => {
  const router = Router();

  // Initialize dependencies with TypeORM repositories
  const userRepository = new UserRepository(AppDataSource.getRepository('users'));
  const userService = new UserService(userRepository);
  const userController = new UserController(userService);

  // Bind controller methods to preserve 'this' context
  const getAllUsers = userController.getAllUsers.bind(userController);
  const getUserById = userController.getUserById.bind(userController);
  const createUser = userController.createUser.bind(userController);
  const updateUser = userController.updateUser.bind(userController);
  const deleteUser = userController.deleteUser.bind(userController);

  // User CRUD endpoints
  router.get("/", getAllUsers);
  router.get("/:id", getUserById);
  router.post("/", createUser);
  router.put("/:id", updateUser);
  router.delete("/:id", deleteUser);

  return router;
}; 