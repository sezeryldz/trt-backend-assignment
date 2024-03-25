import express from "express";
import prismaTasksService from "../services/tasks.service";

class TaskMiddleware {
  async validateTaskFields(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    if (req.body && req.body.title && req.body.description && req.body.status) {
      next();
    } else {
      res.status(400).send({
        error: "Missing required fields; Title, Description, or Status",
      });
    }
  }

  async taskBelongsToUser(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    const taskId = req.params.taskId;
    const userId = req.body.userId; // Assuming you have userId in the request body
    const task = await prismaTasksService.getTaskById(taskId);
    if (task && task.userId === userId) {
      next();
    } else {
      res.status(401).send({
        error: "Unauthorized access to task",
      });
    }
  }

  async validateTaskExists(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    const taskId = req.params.taskId;
    const task = await prismaTasksService.getTaskById(taskId);
    if (task) {
      next();
    } else {
      res.status(404).send({
        error: `Task ${taskId} not found`,
      });
    }
  }
}

export default new TaskMiddleware();
