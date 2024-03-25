import express from "express";
import userService from "../services/users.service";
import * as EmailValidator from "email-validator";
import jwt from "jsonwebtoken";

interface JWTI {
  exp: string;
  data: {
    email: string;
  };
}

/**
 * Middleware for handling user-related operations.
 */
class UsersMiddleware {
  /**
   * Middleware to validate email field.
   * @param req Request object
   * @param res Response object
   * @param next Next function
   */
  async validateEmailField(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    if (req.body && req.body.email && EmailValidator.validate(req.body.email)) {
      next();
    } else {
      res.status(400).send({
        error: "Missing or invalid required field; Email",
      });
    }
  }

  /**
   * Middleware to validate password field.
   * @param req Request object
   * @param res Response object
   * @param next Next function
   */
  async validatePasswordField(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    if (req.body && req.body.password && req.body.password.length > 2) {
      next();
    } else {
      res.status(400).send({
        error: "Missing or invalid required field; Password",
      });
    }
  }

  /**
   * Middleware to check if email is already registered.
   * @param req Request object
   * @param res Response object
   * @param next Next function
   */
  async validateSameEmailDoesntExist(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    const user = await userService.getUserByEmail(req.body.email);
    if (user) {
      res.status(400).send({ error: "Email is in usage." });
    } else {
      next();
    }
  }

  /**
   * Middleware to check if email is registered.
   * @param req Request object
   * @param res Response object
   * @param next Next function
   */
  async validateEmailRegistered(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    const user = await userService.getUserByEmail(req.body.email);
    if (user) {
      next();
    } else {
      res.status(400).send({ error: "Email is not registered." });
    }
  }

  /**
   * Middleware to validate if email belongs to the same user.
   * @param req Request object
   * @param res Response object
   * @param next Next function
   */
  async validateSameEmailBelongToSameUser(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    const user = await userService.getUserByEmail(req.body.email);
    if (user.id === req.params.userId) {
      next();
    } else {
      res.status(400).send({ error: "Invalid email" });
    }
  }

  /**
   * Middleware to validate if a user with given ID exists.
   * @param req Request object
   * @param res Response object
   * @param next Next function
   */
  async validateUserExists(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    const user = await userService.getUserById(req.params.userId);
    if (user) {
      next();
    } else {
      res.status(404).send({
        error: `User ${req.params.userId} not found`,
      });
    }
  }

  /**
   * Middleware to include user ID in the request body.
   * @param req Request object
   * @param res Response object
   * @param next Next function
   */
  async includeUserId(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    const user = await userService.getUserByEmail(req.body.hostEmail);
    req.body.userId = user.id;
    next();
  }

  /**
   * Middleware to extract user ID from request parameters.
   * @param req Request object
   * @param res Response object
   * @param next Next function
   */
  async extractUserId(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    req.body.id = req.params.userId;
    next();
  }

  /**
   * Middleware to check admin token.
   * @param req Request object
   * @param res Response object
   * @param next Next function
   */
  async adminTokenCheck(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    const bearerHeader = req.headers["authorization"];
    if (typeof bearerHeader !== "undefined") {
      const adminToken = bearerHeader.split(" ")[1];

      if (adminToken == process.env.API_ADMIN_KEY) {
        next();
      } else {
        res.status(404).send({
          error: `Permission denied!`,
        });
      }
    } else {
      res.status(404).send({
        error: `Request must include the admin token.`,
      });
    }
  }

  /**
   * Middleware to check access token.
   * @param req Request object
   * @param res Response object
   * @param next Next function
   */
  async accessTokenCheck(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    const bearerHeader = req.headers["authorization"];
    if (typeof bearerHeader !== "undefined") {
      const bearer = bearerHeader.split(" ");
      const bearerToken = bearer[1];
      jwt.verify(
        bearerToken,
        process.env.ACCESS_TOKEN_SECRET,
        async function (err, decoded) {
          if (err) {
            res.status(401).send({
              message: "Token Expired",
            });
          } else {
            // Casting token
            req.body.hostEmail = (<JWTI>(<unknown>decoded)).data.email;
            next();
          }
        }
      );
    } else {
      res.status(401).send({
        message: "Request should include access token.",
      });
    }
  }
}

export default new UsersMiddleware();
