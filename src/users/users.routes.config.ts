import { CommonRoutesConfig } from "../common/common.routes.config";
import UsersController from "./controllers/users.controller";
import UsersMiddleware from "./middleware/users.middleware";
import express from "express";

export class UsersRoutes extends CommonRoutesConfig {
  constructor(app: express.Application) {
    super(app, "UsersRoutes");
  }

  configureRoutes(): express.Application {
    this.app
      .route("/users")
      .get(UsersMiddleware.adminTokenCheck, UsersController.listUsers);

    this.app.param("userId", UsersMiddleware.extractUserId);
    this.app
      .route("/users/:userId")
      .get(
        UsersMiddleware.adminTokenCheck,
        UsersMiddleware.validateUserExists,
        UsersController.getUserById
      )
      .delete(
        UsersMiddleware.adminTokenCheck,
        UsersMiddleware.validateUserExists,
        UsersController.removeUser
      );

    this.app
      .route("/users/register")
      .post(
        UsersMiddleware.validateEmailField,
        UsersMiddleware.validatePasswordField,
        UsersMiddleware.validateSameEmailDoesntExist,
        UsersController.createUser
      );

    this.app.route("/users/login/google").get(UsersController.loginWithGoogle);

    this.app
      .route("/users/login/google/callback")
      .get(UsersController.loginWithGoogleCallback);

    this.app
      .route("/users/login")
      .post(
        UsersMiddleware.validateEmailField,
        UsersMiddleware.validateEmailRegistered,
        UsersController.loginUser
      );
    this.app
      .route("/users/resetpassword")
      .post(
        UsersMiddleware.validatePasswordField,
        UsersMiddleware.accessTokenCheck,
        UsersController.resetPassword
      );

    return this.app;
  }
}
