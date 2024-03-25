import express from "express";

// Define abstract class for common route configurations
export abstract class CommonRoutesConfig {
  app: express.Application; // Express application instance
  name: string; // Name of the route configuration

  // Constructor to initialize properties and configure routes
  constructor(app: express.Application, name: string) {
    this.app = app; // Set the Express application
    this.name = name; // Set the name of the route configuration
    this.configureRoutes(); // Call method to configure routes
  }

  // Method to get the name of the route configuration
  getName() {
    return this.name;
  }

  // Abstract method to be implemented by subclasses to configure routes
  abstract configureRoutes(): express.Application;
}
