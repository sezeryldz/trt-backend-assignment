import { CommonRoutesConfig } from "../common/common.routes.config"; // Importing CommonRoutesConfig for configuring routes
import express from "express"; // Importing express for creating routes
import TasksMiddleware from "../users/middleware/tasks.middleware"; // Importing middleware for tasks
import TasksController from "../users/controllers/tasks.controller"; // Importing controller for tasks
import UsersMiddleware from "../users/middleware/users.middleware"; // Importing middleware for users

export class TasksRoutes extends CommonRoutesConfig {
  constructor(app: express.Application) {
    super(app, "TasksRoutes"); // Calling the constructor of the parent class
  }

  // Configuring routes for tasks
  configureRoutes(): express.Application {
    // Route for getting all tasks (accessible only with admin token)
    this.app
      .route("/tasks/all")
      .get(UsersMiddleware.adminTokenCheck, TasksController.getAllTasks);

    // Route for creating a new task
    // To create a task, access token must be checked, task fields must be validated,
    // and user ID must be included
    this.app
      .route("/tasks")
      .post(
        UsersMiddleware.accessTokenCheck,
        TasksMiddleware.validateTaskFields,
        UsersMiddleware.includeUserId,
        TasksController.createTask
      );

    // Route for getting tasks for a specific user
    // To get user's tasks, access token must be checked and user ID must be included
    this.app
      .route("/tasks")
      .get(
        UsersMiddleware.accessTokenCheck,
        UsersMiddleware.includeUserId,
        TasksController.getUsersTasks
      );

    // Route for getting a specific task by ID
    // To get a task by ID, access token must be checked, user ID must be included,
    // task existence must be validated, and task must belong to the user
    this.app
      .route("/tasks/:taskId")
      .get(
        UsersMiddleware.accessTokenCheck,
        UsersMiddleware.includeUserId,
        TasksMiddleware.validateTaskExists,
        TasksMiddleware.taskBelongsToUser,
        TasksController.getTaskById
      );

    // Route for updating a task by ID
    // To update a task, access token must be checked, user ID must be included,
    // task fields must be validated, task existence must be validated,
    // and task must belong to the user
    this.app
      .route("/tasks/:taskId")
      .put(
        UsersMiddleware.accessTokenCheck,
        UsersMiddleware.includeUserId,
        TasksMiddleware.validateTaskFields,
        TasksMiddleware.validateTaskExists,
        TasksMiddleware.taskBelongsToUser,
        TasksController.updateTask
      );

    // Route for deleting a task by ID
    // To delete a task, access token must be checked, user ID must be included,
    // task existence must be validated, and task must belong to the user
    this.app
      .route("/tasks/:taskId")
      .delete(
        UsersMiddleware.accessTokenCheck,
        UsersMiddleware.includeUserId,
        TasksMiddleware.validateTaskExists,
        TasksMiddleware.taskBelongsToUser,
        TasksController.deleteTask
      );

    return this.app; // Returning the configured express application
  }
}
