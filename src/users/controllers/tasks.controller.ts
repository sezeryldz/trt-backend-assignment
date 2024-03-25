import { Request, Response } from "express";
import prismaTasksService from "../services/prisma.tasks.service";
import CreateTaskDto from "../dto/create.task.dto";

class TaskController {
  async createTask(req: Request, res: Response) {
    console.log(req);
    try {
      const taskData: CreateTaskDto = req.body;
      const task = await prismaTasksService.createTask(
        req.body.userId,
        taskData
      );
      res.status(201).json(task);
    } catch (error) {
      res.status(500).json({ message: "Error: " + error });
    }
  }

  async getAllTasks(req: Request, res: Response) {
    try {
      const tasks = await prismaTasksService.getAllTasks();
      res.json(tasks);
    } catch (error) {
      res.status(500).json({ message: "Error: " + error });
    }
  }

  async getUsersTasks(req: Request, res: Response) {
    try {
      const tasks = await prismaTasksService.getUsersTasks(req.body.userId);
      res.json(tasks);
    } catch (error) {
      res.status(500).json({ message: "Error: " + error });
    }
  }

  async getTaskById(req: Request, res: Response) {
    try {
      const taskId = req.params.taskId;
      const task = await prismaTasksService.getTaskById(taskId);
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
      const updatedTask = await prismaTasksService.updateTask(
        taskId,
        updatedTaskData
      );
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
      const deletedTask = await prismaTasksService.deleteTask(taskId);
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
