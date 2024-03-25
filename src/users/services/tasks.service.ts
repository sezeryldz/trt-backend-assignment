import debug from "debug";
import CreateTaskDto from "../dto/create.task.dto";
import { PrismaClient, Task } from "@prisma/client";

/**
 * Debug instance for logging.
 */
const log: debug.IDebugger = debug("app:prisma-service");

/**
 * Prisma client instance.
 */
const prisma = new PrismaClient();

/**
 * Service class for handling tasks.
 */
class TaskService {
  constructor() {
    log("Created new instance of TaskService");
  }

  /**
   * Creates a new task.
   * @param userId The ID of the user creating the task.
   * @param taskData The data for the new task.
   * @returns The created task.
   */
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

  /**
   * Retrieves tasks for a specific user with pagination.
   * @param userId The ID of the user.
   * @param filters Additional filters for querying tasks.
   * @param orderBy Sorting order for the tasks.
   * @param startIndex Starting index for pagination.
   * @param endIndex Ending index for pagination.
   * @returns An object containing the tasks and total count.
   */
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

  /**
   * Retrieves all tasks.
   * @returns An array of tasks.
   */
  async getAllTasks(): Promise<Task[]> {
    return await prisma.task.findMany();
  }

  /**
   * Retrieves a task by its ID.
   * @param taskId The ID of the task to retrieve.
   * @returns The task object if found, otherwise null.
   */
  async getTaskById(taskId: string): Promise<Task | null> {
    return await prisma.task.findUnique({
      where: {
        id: taskId,
      },
    });
  }

  /**
   * Updates a task with new data.
   * @param taskId The ID of the task to update.
   * @param updatedTaskData The updated data for the task.
   * @returns The updated task if successful, otherwise null.
   */
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

  /**
   * Deletes a task by its ID.
   * @param taskId The ID of the task to delete.
   * @returns The deleted task if successful, otherwise null.
   */
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
