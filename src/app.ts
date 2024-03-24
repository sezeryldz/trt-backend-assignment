import express from "express";
import * as http from "http";
import * as winston from "winston";
import * as expressWinston from "express-winston";
import cors from "cors";
import { CommonRoutesConfig } from "./common/common.routes.config";
import { UsersRoutes } from "./users/users.routes.config";
import debug from "debug";
import { rateLimit } from "express-rate-limit";

const app: express.Application = express();
const server: http.Server = http.createServer(app);
const port = 80;
const routes: Array<CommonRoutesConfig> = [];
const debugLog: debug.IDebugger = debug("app");

// Adding middleware to parse all incoming requests as JSON
app.use(express.json());

// Cross origin security
// Should be able to protect against cross-site scripting (XSS) and cross-site request forgery (CSRF).
app.use(
  cors({
    origin: "http://localhost",
  })
);

// This is for throttling requests
// 50 Request per 15 min.
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 50, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
  standardHeaders: "draft-7", // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
});

// Apply the rate limiting middleware to all requests.
app.use(limiter);

// Preparing the expressWinston logging middleware configuration,
// which will automatically log all HTTP requests handled by Express.js
const loggerOptions: expressWinston.LoggerOptions = {
  transports: [new winston.transports.Console()],
  format: winston.format.combine(
    winston.format.json(),
    winston.format.prettyPrint(),
    winston.format.colorize({ all: true })
  ),
};

if (!process.env.DEBUG) {
  loggerOptions.meta = false; // when not debugging, log requests as one-liners
}

// Initialize the logger with the above configuration
app.use(expressWinston.logger(loggerOptions));

// We are adding the UserRoutes to our array,
// After sending the Express.js application object to have the routes added to our app
routes.push(new UsersRoutes(app));

// Simple route to make sure everything is working properly
const runningMessage = `Server is running at http://localhost:${port}`;
app.get("/", (req: express.Request, res: express.Response) => {
  res.status(200).send(runningMessage);
});

server.listen(port, () => {
  routes.forEach((route: CommonRoutesConfig) => {
    debugLog(`Routes configured for ${route.getName()}`);
  });
  // our only exception to avoiding console.log(), because we
  // always want to know when the server is done starting up
  console.log(runningMessage);
});

// We are exporting the express app for tests
export default app;
