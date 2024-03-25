import debug from "debug";
import CreateTaskDto from "../dto/create.task.dto"; // Define this DTO as per your requirements
import { PrismaClient, Task } from "@prisma/client";

const log: debug.IDebugger = debug("app:prisma-service");
const prisma = new PrismaClient();

class TaskService {
  constructor() {
    log("Created new instance of TaskService");
  }

  async createTask(userId: string, taskData: CreateTaskDto): Promise<Task> {
    const task = await prisma.task.create({
      data: {
        title: taskData.title,
        description: taskData.description,
        status: taskData.status,
        user: { connect: { id: userId } },
      },
    });
    return task;
  }

  async getUsersTasks(userId: string): Promise<Task[]> {
    return await prisma.task.findMany({
      where: {
        userId: userId,
      },
    });
  }

  async getAllTasks(): Promise<Task[]> {
    return await prisma.task.findMany();
  }

  async getTaskById(taskId: string): Promise<Task | null> {
    return await prisma.task.findUnique({
      where: {
        id: taskId,
      },
    });
  }

  async updateTask(
    taskId: string,
    updatedTaskData: CreateTaskDto
  ): Promise<Task | null> {
    const updatedTask = await prisma.task.update({
      where: {
        id: taskId,
      },
      data: {
        title: updatedTaskData.title,
        description: updatedTaskData.description,
        status: updatedTaskData.status,
      },
    });
    return updatedTask;
  }

  async deleteTask(taskId: string): Promise<Task | null> {
    const deletedTask = await prisma.task.delete({
      where: {
        id: taskId,
      },
    });
    return deletedTask;
  }
}

export default new TaskService();
