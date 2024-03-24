// Express to add types to the request/response objects from our controller functions
import express from "express";
// Newly created prisma services
import PrismaUsersService from "../services/prisma.users.service";
// The argon2 library for password hashing
import argon2 from "argon2";
// Utilizing debug with a custom context as described
import debug from "debug";
// Jsonwebtoken library is for generating jwt tokens
import jwt from "jsonwebtoken";

const log: debug.IDebugger = debug("app:users-controller");
class UsersController {
  async listUsers(req: express.Request, res: express.Response) {
    const users = await PrismaUsersService.listUsers();
    res.status(201).send(users);
  }
  async getUserById(req: express.Request, res: express.Response) {
    const user = await PrismaUsersService.getUserById(req.body.id);
    res.status(200).send(user);
  }

  async createUser(req: express.Request, res: express.Response) {
    req.body.password = await argon2.hash(req.body.password);
    const createdUser = await PrismaUsersService.create(req.body);
    res.status(201).send(createdUser);
  }

  async removeUser(req: express.Request, res: express.Response) {
    log(await PrismaUsersService.deleteById(req.body.id));
    res.status(200).send({
      message: `User ${req.body.id} removed succesfully`,
    });
  }

  async loginUser(req: express.Request, res: express.Response) {
    const currentUser = await PrismaUsersService.getUserByEmail(req.body.email);

    if (await argon2.verify(currentUser.password, req.body.password)) {
      const accessToken = jwt.sign(
        {
          // 1 Hour expiration time for the token
          exp: Math.floor(Date.now() / 1000) + 60 * 60,
          data: {
            email: currentUser.email,
          },
        },
        process.env.ACCESS_TOKEN_SECRET
      );

      res.status(201).send({
        message: "Logged in succesfully.",
        email: req.body.email,
        accessToken: accessToken,
      });
    } else {
      res.status(201).send({
        message: "Incorrect Password.",
      });
    }
  }

  async resetPassword(req: express.Request, res: express.Response) {
    const updatedUser = await PrismaUsersService.updatePassword(
      req.body.hostEmail,
      await argon2.hash(req.body.password)
    );
    res.status(201).send({
      message: updatedUser,
    });
  }
}

export default new UsersController();
