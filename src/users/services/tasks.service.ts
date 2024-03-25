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

  async getUsersTasksWithPagination(
    userId: string,
    filters: any,
    orderBy: any,
    startIndex: number,
    endIndex: number
  ): Promise<{ data: Task[]; count: number }> {
    const tasks = await prisma.task.findMany({
      where: {
        ...filters,
        userId: userId,
      },
      orderBy: { createdAt: orderBy },
      skip: startIndex,
      take: endIndex - startIndex,
    });

    const count = await prisma.task.count({
      where: {
        ...filters,
        userId: userId,
      },
    });

    return { data: tasks, count };
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
