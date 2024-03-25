// Import necessary modules
import express from "express";
import argon2 from "argon2"; // For password hashing
import jwt from "jsonwebtoken"; // For generating JWT tokens
import debug from "debug"; // For debugging purposes
import PrismaUsersService from "../services/users.service"; // Prisma service for user-related operations
import googleAuthService from "../services/google.auth.service"; // Google authentication service

// Set up debug logging
const log: debug.IDebugger = debug("app:users-controller");

// Define UsersController class
class UsersController {
  /**
   * List all users
   * @param req Express Request object
   * @param res Express Response object
   */
  async listUsers(req: express.Request, res: express.Response) {
    const users = await PrismaUsersService.listUsers();
    res.status(201).send(users);
  }

  /**
   * Get user by ID
   * @param req Express Request object
   * @param res Express Response object
   */
  async getUserById(req: express.Request, res: express.Response) {
    const user = await PrismaUsersService.getUserById(req.body.id);
    res.status(200).send(user);
  }

  /**
   * Create a new user
   * @param req Express Request object
   * @param res Express Response object
   */
  async createUser(req: express.Request, res: express.Response) {
    // Hash the password before storing
    req.body.password = await argon2.hash(req.body.password);
    const createdUser = await PrismaUsersService.create(req.body);
    res.status(201).send(createdUser);
  }

  /**
   * Remove a user
   * @param req Express Request object
   * @param res Express Response object
   */
  async removeUser(req: express.Request, res: express.Response) {
    log(await PrismaUsersService.deleteById(req.body.id));
    res.status(200).send({
      message: `User ${req.body.id} removed successfully`,
    });
  }

  /**
   * Login user with email and password
   * @param req Express Request object
   * @param res Express Response object
   */
  async loginUser(req: express.Request, res: express.Response) {
    const currentUser = await PrismaUsersService.getUserByEmail(req.body.email);

    // Verify password
    if (await argon2.verify(currentUser.password, req.body.password)) {
      // Generate access token
      const accessToken = jwt.sign(
        {
          // Set token expiration time to 1 hour
          exp: Math.floor(Date.now() / 1000) + 60 * 60,
          data: {
            email: currentUser.email,
          },
        },
        process.env.ACCESS_TOKEN_SECRET
      );

      // Send success response with access token
      res.status(201).send({
        message: "Logged in successfully.",
        email: req.body.email,
        accessToken: accessToken,
      });
    } else {
      // Send error response for incorrect password
      res.status(201).send({
        message: "Incorrect Password.",
      });
    }
  }

  /**
   * Initiate Google login process
   * @param req Express Request object
   * @param res Express Response object
   */
  loginWithGoogle(req: express.Request, res: express.Response) {
    res.redirect(googleAuthService.oAuthLink());
  }

  /**
   * Handle Google login callback
   * @param req Express Request object
   * @param res Express Response object
   */
  async loginWithGoogleCallback(req, res) {
    const { code } = req.query;
    try {
      // Perform Google OAuth callback
      const userData = await googleAuthService.oAuthCallback(code);
      const user = await PrismaUsersService.getUserByEmail(userData.email);
      if (!user) {
        // Create new user if not found
        const createdUser = await PrismaUsersService.create({
          email: userData.email,
        });
        // Send success response
        res.status(201).send({
          message: "Logged in successfully.",
          accessCode: userData.accessToken,
          email: createdUser.user.email,
        });
      } else {
        // Send success response
        res.status(201).send({
          message: "Logged in successfully.",
          accessCode: userData.accessToken,
          email: user.email,
        });
      }
    } catch (error) {
      console.error("Error:", error.message);
    }
  }

  /**
   * Reset user password
   * @param req Express Request object
   * @param res Express Response object
   */
  async resetPassword(req: express.Request, res: express.Response) {
    // Update password with new hashed password
    const updatedUser = await PrismaUsersService.updatePassword(
      req.body.hostEmail,
      await argon2.hash(req.body.password)
    );
    // Send success response
    res.status(201).send({
      message: updatedUser,
    });
  }
}

// Export an instance of UsersController
export default new UsersController();
