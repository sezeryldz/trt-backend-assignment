import express from "express";
import prismaTasksService from "../services/tasks.service";

/**
 * Middleware for handling task-related operations.
 */
class TaskMiddleware {
  /**
   * Middleware to validate required task fields.
   * @param req Request object
   * @param res Response object
   * @param next Next function
   */
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

  /**
   * Middleware to check if task belongs to the user making the request.
   * @param req Request object
   * @param res Response object
   * @param next Next function
   */
  async taskBelongsToUser(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    const taskId = req.params.taskId;
    const userId = req.body.userId;

    const task = await prismaTasksService.getTaskById(taskId);

    if (task && task.userId === userId) {
      next();
    } else {
      res.status(401).send({
        error: "Unauthorized access to task",
      });
    }
  }

  /**
   * Middleware to validate if a task with given ID exists.
   * @param req Request object
   * @param res Response object
   * @param next Next function
   */
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
