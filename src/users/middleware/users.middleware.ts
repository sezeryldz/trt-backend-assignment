import express from "express";
import userService from "../services/prisma.users.service";
//Simple email validation.
import * as EmailValidator from "email-validator";

// jsonwebtoken library is for generating jwt tokens
import jwt from "jsonwebtoken";

interface JWTI {
  exp: string;
  data: {
    email: string;
  };
}

class UsersMiddleware {
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

  async validatePasswordField(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    // Simple check if password is longer than two chacters / is exist.
    if (req.body && req.body.password && req.body.password.length > 2) {
      next();
    } else {
      res.status(400).send({
        error: "Missing or invalid required field; Password",
      });
    }
  }

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

  async extractUserId(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    req.body.id = req.params.userId;
    next();
  }

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
