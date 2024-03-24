import debug from "debug";
import { CreateUserDto } from "../dto/create.user.dto";
import { PrismaClient } from "@prisma/client";
const log: debug.IDebugger = debug("app:prisma-service");
const prisma = new PrismaClient();

class PrismaUsersService {
  constructor() {
    log("Created new instance of User");
  }

  async create(user: CreateUserDto) {
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

  async deleteById(userId: string) {
    const deleteUser = await prisma.user.delete({
      where: {
        id: userId,
      },
    });
    return deleteUser;
  }

  async listUsers() {
    return await prisma.user.findMany();
  }

  async getUserByEmail(email: string) {
    return await prisma.user.findUnique({
      where: {
        email: email,
      },
    });
  }

  async getUserById(id: string) {
    return await prisma.user.findUnique({
      where: {
        id: id,
      },
    });
  }

  async updatePassword(email: string, password: string) {
    return await prisma.user.update({
      where: {
        email: email,
      },
      data: {
        password: password,
      },
    });
  }
}

export default new PrismaUsersService();
