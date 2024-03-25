# trt-backend-assignment

## How to run the project

1. Install the required packages with: `yarn`
2. Rename the `.example-env` to `.env` then add the required data.
3. Generate a local prisma client with this command: `npx prisma generate`
4. Run the project with `yarn dev` or `yarn test`

## About the project

User task management API with social and normal logins. Users can register and login with email and password or Google login. Users can reset their own password, create tasks, list tasks with filtering, pagination, and sorting, and also delete or update tasks.

## Technical Side

- Entry point starts in `app.ts`, then loops through routes. To simplify the logic, we are using a `CommonRoutesConfig` abstract class.
- Routes get registered in the `routes` folder.
- Middlewares are used to validate and modify the incoming/outgoing data.
- Controllers implement services, JWT tokens for authorization, and DTOs (Data Transfer Objects) to compose the data while moving through logic.
- Logging the request data is done using Winston for more depth.

## Security

- Express throttling is used to limit each user to 50 requests per 15 minutes.
- CORS is implemented to protect the endpoints against XSS and CSRF.
- Usage of the latest version of MongoDB and Prisma together allows us to have bleeding-edge SQL protection.

## Social Login

Implements Google login, but with a very similar fashion, we can implement almost all other OAuth providers (GitHub, etc.).

## Documentation

- Code is very well documented, but to provide more information about API endpoints, a Postman collection with example requests is included.
- Postman Collection is in the main folder of the project: `Backend Api Postman Collection.json`

## Jest Super Tests

Emulates the user flow from start to finish.

## References

- [Prisma Documentation](https://www.prisma.io/docs)
- [Faker.js Documentation](https://fakerjs.dev/api/)
- [HTTP Status Codes](https://restfulapi.net/http-status-codes/)
- [Implementing Google Login in a Node.js Application](https://codeculturepro.medium.com/implementing-google-login-in-a-node-js-application-b6fbd98ce5e)
- [Testing Express API with Jest and Supertest](https://dev.to/franciscomendes10866/testing-express-api-with-jest-and-supertest-3gf)
- [Best Practices for REST API Design](https://stackoverflow.blog/2020/03/02/best-practices-for-rest-api-design/)
- [Secure REST API in Node.js](https://www.toptal.com/nodejs/secure-rest-api-in-nodejs#anatomy-of-a-rest-api)
- [Node.js Typescript REST API Pt. 1](https://www.toptal.com/express-js/nodejs-typescript-rest-api-pt-1)
- [Node.js Typescript REST API Pt. 2](https://www.toptal.com/express-js/nodejs-typescript-rest-api-pt-2)
