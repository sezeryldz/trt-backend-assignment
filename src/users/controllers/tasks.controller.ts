import { Request, Response } from "express";
import TaskService from "../services/tasks.service";
import CreateTaskDto from "../dto/create.task.dto";

class TaskController {
  async createTask(req: Request, res: Response) {
    try {
      const taskData: CreateTaskDto = req.body;
      const task = await TaskService.createTask(req.body.userId, taskData);
      res.status(201).json(task);
    } catch (error) {
      res.status(500).json({ message: "Error: " + error });
    }
  }

  async getAllTasks(req: Request, res: Response) {
    try {
      const tasks = await TaskService.getAllTasks();
      res.json(tasks);
    } catch (error) {
      res.status(500).json({ message: "Error: " + error });
    }
  }

  async getUsersTasks(req: Request, res: Response) {
    try {
      const userId = req.body.userId;
      const {
        page = 1,
        limit = 10,
        status = "in progress",
        orderBy = "asc",
      } = req.body;

      // Define filters based on the request body
      const filters: any = { userId };
      if (status) {
        filters.status = status;
      }

      // Calculate pagination parameters
      const startIndex =
        (parseInt(page as string) - 1) * parseInt(limit as string);
      const endIndex = parseInt(page as string) * parseInt(limit as string);

      // Retrieve tasks with applied filters and pagination
      const tasks = await TaskService.getUsersTasksWithPagination(
        userId,
        filters,
        orderBy,
        startIndex,
        endIndex
      );

      // Prepare response with pagination metadata
      const response: any = {};
      if (endIndex < tasks.count) {
        response.next = {
          page: parseInt(page as string) + 1,
          limit: parseInt(limit as string),
        };
      }
      if (startIndex > 0) {
        response.prev = {
          page: parseInt(page as string) - 1,
          limit: parseInt(limit as string),
        };
      }
      response.totalPages = Math.ceil(tasks.count / parseInt(limit as string));
      response.tasks = tasks.data;

      res.json(response);
    } catch (error) {
      res.status(500).json({ message: "Error: " + error });
    }
  }

  async getTaskById(req: Request, res: Response) {
    try {
      const taskId = req.params.taskId;
      const task = await TaskService.getTaskById(taskId);
      if (!task) {
        res.status(404).json({ message: "Task not found" });
        return;
      }
      res.json(task);
    } catch (error) {
      res.status(500).json({ message: "Error: " + error });
    }
  }

  async updateTask(req: Request, res: Response) {
    try {
      const taskId = req.params.taskId;
      const updatedTaskData: CreateTaskDto = req.body;
      const updatedTask = await TaskService.updateTask(taskId, updatedTaskData);
      if (!updatedTask) {
        res.status(404).json({ message: "Task not found" });
        return;
      }
      res.json(updatedTask);
    } catch (error) {
      res.status(500).json({ message: "Error: " + error });
    }
  }

  async deleteTask(req: Request, res: Response) {
    try {
      const taskId = req.params.taskId;
      const deletedTask = await TaskService.deleteTask(taskId);
      if (!deletedTask) {
        res.status(404).json({ message: "Task not found" });
        return;
      }
      res.json(deletedTask);
    } catch (error) {
      res.status(500).json({ message: "Error: " + error });
    }
  }
}

export default new TaskController();
