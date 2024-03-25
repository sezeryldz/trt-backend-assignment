import debug from "debug";
import { CreateUserDto } from "../dto/create.user.dto";
import { PrismaClient, User } from "@prisma/client";

/**
 * Debug instance for logging.
 */
const log: debug.IDebugger = debug("app:prisma-service");

/**
 * Prisma client instance.
 */
const prisma = new PrismaClient();

/**
 * Service class for handling user-related operations.
 */
class PrismaUsersService {
  constructor() {
    log("Created new instance of User");
  }

  /**
   * Creates a new user.
   * @param user The user data to create.
   * @returns The created user.
   */
  async create(user: CreateUserDto): Promise<{ user: User }> {
    const prismaUser = await prisma.user.create({
      data: {
        email: user.email,
        password: user.password,
      },
    });

    return {
      user: prismaUser,
    };
  }

  /**
   * Deletes a user by ID.
   * @param userId The ID of the user to delete.
   * @returns The deleted user.
   */
  async deleteById(userId: string): Promise<User | null> {
    const deleteUser = await prisma.user.delete({
      where: {
        id: userId,
      },
    });
    return deleteUser;
  }

  /**
   * Retrieves a list of all users.
   * @returns An array of users.
   */
  async listUsers(): Promise<User[]> {
    return await prisma.user.findMany();
  }

  /**
   * Retrieves a user by email.
   * @param email The email of the user to retrieve.
   * @returns The user if found, otherwise null.
   */
  async getUserByEmail(email: string): Promise<User | null> {
    return await prisma.user.findUnique({
      where: {
        email: email,
      },
    });
  }

  /**
   * Retrieves a user by ID.
   * @param id The ID of the user to retrieve.
   * @returns The user if found, otherwise null.
   */
  async getUserById(id: string): Promise<User | null> {
    return await prisma.user.findUnique({
      where: {
        id: id,
      },
    });
  }

  /**
   * Updates a user's password.
   * @param email The email of the user to update.
   * @param password The new password.
   * @returns The updated user.
   */
  async updatePassword(email: string, password: string): Promise<User | null> {
    return await prisma.user.update({
      where: {
        email: email,
      },
      data: {
        updatedAt: new Date().toISOString(),
        password: password,
      },
    });
  }
}

export default new PrismaUsersService();
