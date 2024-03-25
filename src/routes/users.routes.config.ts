import { CommonRoutesConfig } from "../common/common.routes.config"; // Importing CommonRoutesConfig for configuring routes
import UsersController from "../users/controllers/users.controller"; // Importing controller for users
import UsersMiddleware from "../users/middleware/users.middleware"; // Importing middleware for users
import express from "express"; // Importing express for creating routes

export class UsersRoutes extends CommonRoutesConfig {
  constructor(app: express.Application) {
    super(app, "UsersRoutes"); // Calling the constructor of the parent class
  }

  // Configuring routes for users
  configureRoutes(): express.Application {
    // Route for getting all users (accessible only with admin token)
    this.app
      .route("/users")
      .get(UsersMiddleware.adminTokenCheck, UsersController.listUsers);

    // Parameter middleware to extract user ID
    this.app.param("userId", UsersMiddleware.extractUserId);

    // Route for getting a user by ID (accessible only with admin token)
    this.app
      .route("/users/:userId")
      .get(
        UsersMiddleware.adminTokenCheck,
        UsersMiddleware.validateUserExists,
        UsersController.getUserById
      );

    // Route for deleting a user by ID (accessible only with admin token)
    this.app
      .route("/users/:userId")
      .delete(
        UsersMiddleware.adminTokenCheck,
        UsersMiddleware.validateUserExists,
        UsersController.removeUser
      );

    // Route for registering a new user
    // To register a user, email and password fields must be validated,
    // and the email must not already exist in the database
    this.app
      .route("/users/register")
      .post(
        UsersMiddleware.validateEmailField,
        UsersMiddleware.validatePasswordField,
        UsersMiddleware.validateSameEmailDoesntExist,
        UsersController.createUser
      );

    // Route for initiating Google login
    this.app.route("/users/login/google").get(UsersController.loginWithGoogle);

    // Route for handling Google login callback
    this.app
      .route("/users/login/google/callback")
      .get(UsersController.loginWithGoogleCallback);

    // Route for regular login
    // To log in, email field must be validated and email must be registered
    this.app
      .route("/users/login")
      .post(
        UsersMiddleware.validateEmailField,
        UsersMiddleware.validateEmailRegistered,
        UsersController.loginUser
      );

    // Route for resetting password
    // To reset password, password field must be validated and access token must be checked
    this.app
      .route("/users/resetpassword")
      .post(
        UsersMiddleware.validatePasswordField,
        UsersMiddleware.accessTokenCheck,
        UsersController.resetPassword
      );

    return this.app; // Returning the configured express application
  }
}
