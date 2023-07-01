import request from "supertest";

import buildApp from "@/test-utils/test-app";
import Context from "@/test-utils/context";
import customerRoutes from "@/routes/customers.route";
import { ROLES } from "@/utils/commonType";

const url = "/api/v1/customers";

describe("Customer routes", function () {
  let context: Context;
  let app: request.SuperTest<request.Test>;

  beforeAll(async () => {
    context = await Context.build();
    app = request(buildApp({ routers: customerRoutes }));
  });

  beforeEach(async () => {
    await context.reset();
  });

  afterAll(() => {
    context.close();
  });

  const customerBody = {
    email: "test@email.com",
    password: "Test123$",
    callbackUrl: "https://example.com/",
  };

  it("registers a user with a unique email and password", (done) => {
    app
      .post(`${url}/register-with-email-and-password`)
      .send(customerBody)
      .set("Content-Type", "application/json")
      .set("Accept", "application/json")
      .expect((res) => {
        expect(res.body.message).toEqual("Created customer");
        expect(res.body.data.id).toBeDefined();
        expect(res.body.data.role).toEqual(ROLES.CUSTOMER);
        expect(res.statusCode).toEqual(201);
      })
      .end(done);
  });

  it("fails to register a user with an existing email", (done) => {
    app
      .post(`${url}/register-with-email-and-password`)
      .send(customerBody)
      .set("Content-Type", "application/json")
      .set("Accept", "application/json")
      .then(() => {
        return app
          .post(`${url}/register-with-email-and-password`)
          .send(customerBody)
          .set("Content-Type", "application/json")
          .set("Accept", "application/json");
      })
      .then((res) => {
        expect(res.text).toMatch(/email already exists/gi);
        expect(res.statusCode).toEqual(400);
        done();
      })
      .catch((err) => {
        console.log(err);
        done();
      });
  });

  it("fails to register a user with an invalid password", (done) => {
    app
      .post(`${url}/register-with-email-and-password`)
      .send({
        email: "test@email.com",
        password: "Test123",
        callbackUrl: "https://example.com/",
      })
      .set("Content-Type", "application/json")
      .set("Accept", "application/json")
      .expect((res) => {
        expect(res.text).toMatch(/Invalid request/gi);
        expect(res.statusCode).toEqual(400);
      })
      .end(done);
  });

  //get all customers => only by admin

  // it("fails to list customers if user role is not ADMIN", (done) => {
  //   app
  //     .get(url)
  //     .set("Content-Type", "application/json")
  //     .set("Accept", "application/json")
  //     .expect((res) => {
  //       expect(res.statusCode).toEqual(403);
  //     })
  //     .end(done);
  // });

  // it("fails to list customers if user role is not signed in", (done) => {
  //   app
  //     .get(url)
  //     .set("Content-Type", "application/json")
  //     .set("Accept", "application/json")
  //     .expect((res) => {
  //       expect(res.statusCode).toEqual(401);
  //     })
  //     .end(done);
  // });

  // it("returns a list of customers", (done) => {
  //   app
  //     .get(url)
  //     .set("Content-Type", "application/json")
  //     .set("Accept", "application/json")
  //     .expect((res) => {
  //       expect(res.statusCode).toEqual(200);
  //       expect(res.body).toHaveProperty("data");
  //     })
  //     .end(done);
  // });

  //update customer details

  //change avatar url

  //disable account

  //reset password

  //
});
