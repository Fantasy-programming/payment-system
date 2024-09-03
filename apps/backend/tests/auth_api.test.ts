// import supertest from "supertest";
// import { beforeAll, afterAll, afterEach, expect, describe, it } from "bun:test";
// import {
//   MongoDBContainer,
//   StartedMongoDBContainer,
// } from "@testcontainers/mongodb";
//
// import { createUser } from "../src/script/users";
// import { DB } from "../src/utils/mongo";
// import { Scheduler } from "../src/utils/pulse";
// import { createApp } from "../src/app";

// describe("When there is one user in the database", () => {
//   let mongodbContainer: StartedMongoDBContainer;
//   let db: DB;
//   let scheduler: Scheduler;
//
//   beforeAll(async () => {
//     // start the container
//     mongodbContainer = await new MongoDBContainer("mongo:6.0.1").start();
//     const connectionString = `${mongodbContainer.getConnectionString()}?directConnection=true`;
//
//     // setup the dependencies
//     db = new DB();
//     db.setMongoUri(connectionString);
//     scheduler = new Scheduler(db);
//
//     // create a user
//     await db.init();
//     await createUser();
//     await db.close();
//   });
//
//   afterEach(async () => {
//     await db.close();
//     await scheduler.close();
//   });
//
//   afterAll(async () => {
//     await mongodbContainer?.stop();
//   });
//
//   it("user login works with right credential", async () => {
//     const app = await createApp({ db, scheduler });
//     const api = supertest(app);
//
//     const response = await api
//       .post("/api/auth/login")
//       .send({ email: "test123@gmail.com", password: "123456User@" });
//
//     expect(response.status).toBe(200);
//     expect(response.headers["content-type"]).toMatch(/application\/json/);
//   });

// it("user login fails with wrong password or email", async () => {
//   const app = await createApp({ db, scheduler });
//   const api = supertest(app);
//
//   const response = await api
//     .post("/api/auth/login")
//     .send({ email: "test123@gmail.com", password: "123456User@33" });
//
//   expect(response.status).toBe(401);
//   expect(response.headers["content-type"]).toMatch(/application\/json/);
//   expect(response.body.error).toBe("Invalid email or password");
// });

// it("user login fails with missing object request", async () => {
//   const app = await createApp({ db, scheduler });
//   const api = supertest(app);
//
//   const emailRes = await api
//     .post("/api/auth/login")
//     .send({ email: "test123@gmail.com" });
//
//   const passRes = await api
//     .post("/api/auth/login")
//     .send({ password: "123456User@33" });
//
//   expect(emailRes.status).toBe(400);
//   expect(passRes.status).toBe(400);
//
//   expect(emailRes.headers["content-type"]).toMatch(/application\/json/);
//   expect(passRes.headers["content-type"]).toMatch(/application\/json/);
// });
// });
