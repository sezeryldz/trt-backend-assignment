import request from "supertest";
import { faker } from "@faker-js/faker";

import app from "../src/app";

describe("Emulating a User", function () {
  const user = {
    email: faker.internet.email(),
    password: faker.internet.password(),
    accessToken: null,
  };

  let selectedTask;

  it("Register", function (done) {
    request(app)
      .post("/users/register")
      .send(user)
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(201)
      .end(function (err, res) {
        if (err) {
          return done(err);
        }
        return done();
      });
  });

  it("Login", (done) => {
    request(app)
      .post("/users/login")
      .send({
        email: user.email,
        password: user.password,
      })
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(201)
      .end(function (err, res) {
        if (err) {
          return done(err);
        }
        user.accessToken = res.body.accessToken;
        console.log("Access Token: " + user.accessToken);
        return done();
      });
  });

  it("Reset Password", (done) => {
    const password = faker.internet.password();
    console.log("Old password: " + user.password);
    request(app)
      .post("/users/resetpassword")
      .send({
        password: password,
      })
      .set("Accept", "application/json")
      .set("Authorization", "Bearer " + user.accessToken)
      .expect("Content-Type", /json/)
      .expect(201)
      .end(function (err, res) {
        if (err) {
          return done(err);
        }
        user.password = password;
        console.log("New password: " + password);
        return done();
      });
  });

  //Runs it multiple times to generate some data.
  for (let i = 0; i < 15; i++) {
    it("Create A Task", (done) => {
      // Generate fake task data
      const fakeTask = {
        title: faker.lorem.words(3), // Generate a random title with 3 lorem words
        description: faker.lorem.sentences(2), // Generate a random description with 2 lorem sentences
        status: faker.helpers.arrayElement([
          "pending",
          "completed",
          "in progress",
        ]), // Pick a random status from the provided options
      };

      request(app)
        .post("/tasks")
        .send(fakeTask)
        .set("Accept", "application/json")
        .set("Authorization", "Bearer " + user.accessToken)
        .expect("Content-Type", /json/)
        .expect(201)
        .end(function (err, res) {
          if (err) {
            return done(err);
          }
          /* console.log(
            "Task: " + fakeTask.title + " has been created successfully."
          );*/
          return done();
        });
    });
  }

  it("List Tasks", (done) => {
    request(app)
      .get("/tasks")
      .set("Accept", "application/json")
      .set("Authorization", "Bearer " + user.accessToken)
      .expect("Content-Type", /json/)
      .expect(200)
      .end(function (err, res) {
        if (err) {
          return done(err);
        }
        //Select a random task from tasks to be used in the next steps.
        selectedTask = faker.helpers.arrayElement(res.body.tasks);
        return done();
      });
  });

  it("Select a Task", (done) => {
    request(app)
      .get("/tasks/" + selectedTask.id)
      .set("Accept", "application/json")
      .set("Authorization", "Bearer " + user.accessToken)
      .expect("Content-Type", /json/)
      .expect(200)
      .end(function (err, res) {
        if (err) {
          return done(err);
        }
        console.log("Selected task title: " + res.body.title);
        return done();
      });
  });

  it("Update a Task", (done) => {
    const fakeTask = {
      title: faker.lorem.words(3), // Generate a random title with 3 lorem words
      description: faker.lorem.sentences(2), // Generate a random description with 2 lorem sentences
      status: faker.helpers.arrayElement([
        "pending",
        "completed",
        "in progress",
      ]), // Pick a random status from the provided options
    };
    request(app)
      .put("/tasks/" + selectedTask.id)
      .send(fakeTask)
      .set("Accept", "application/json")
      .set("Authorization", "Bearer " + user.accessToken)
      .expect("Content-Type", /json/)
      .expect(200)
      .end(function (err, res) {
        if (err) {
          return done(err);
        }
        console.log(
          "Updated task title: " + selectedTask.title + " -> " + fakeTask.title
        );
        return done();
      });
  });

  it("Delete the Task", (done) => {
    request(app)
      .delete("/tasks/" + selectedTask.id)
      .set("Accept", "application/json")
      .set("Authorization", "Bearer " + user.accessToken)
      .expect("Content-Type", /json/)
      .expect(200)
      .end(function (err, res) {
        if (err) {
          return done(err);
        }
        console.log("Removed Task Title: " + res.body.title);
        return done();
      });
  });
});
