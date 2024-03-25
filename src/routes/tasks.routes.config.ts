import { CommonRoutesConfig } from "../common/common.routes.config";

import express from "express";
import TasksMiddleware from "../users/middleware/tasks.middleware";
import TasksController from "../users/controllers/tasks.controller";
import UsersMiddleware from "../users/middleware/users.middleware";

export class TasksRoutes extends CommonRoutesConfig {
  constructor(app: express.Application) {
    super(app, "TasksRoutes");
  }

  configureRoutes(): express.Application {
    this.app
      .route("/tasks/all")
      .get(UsersMiddleware.adminTokenCheck, TasksController.getAllTasks);

    this.app
      .route("/tasks")
      .post(
        UsersMiddleware.accessTokenCheck,
        TasksMiddleware.validateTaskFields,
        UsersMiddleware.includeUserId,
        TasksController.createTask
      )
      .get(
        UsersMiddleware.accessTokenCheck,
        UsersMiddleware.includeUserId,
        TasksController.getUsersTasks
      );

    this.app
      .route("/tasks/:taskId")
      .get(
        UsersMiddleware.accessTokenCheck,
        UsersMiddleware.includeUserId,
        TasksMiddleware.validateTaskExists,
        TasksMiddleware.taskBelongsToUser,
        TasksController.getTaskById
      )
      .put(
        UsersMiddleware.accessTokenCheck,
        UsersMiddleware.includeUserId,
        TasksMiddleware.validateTaskFields,
        TasksMiddleware.validateTaskExists,
        TasksMiddleware.taskBelongsToUser,
        TasksController.updateTask
      )
      .delete(
        UsersMiddleware.accessTokenCheck,
        UsersMiddleware.includeUserId,
        TasksMiddleware.validateTaskExists,
        TasksMiddleware.taskBelongsToUser,
        TasksController.deleteTask
      );

    return this.app;
  }
}
