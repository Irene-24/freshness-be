import request from "supertest";

import buildApp from "@/test-utils/test-app";
import Context from "@/test-utils/context";
import customerRoutes from "@/routes/customers.route";
import { ROLES } from "@/utils/commonType";

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

describe("Customer routes", function () {
  it("registers a user with a unique email and password", (done) => {
    app
      .post("/api/v1/customers")
      .send({ email: "test@email.com", password: "Test123$" })
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
      .post("/api/v1/customers")
      .send({ email: "test@email.com", password: "Test123$" })
      .set("Content-Type", "application/json")
      .set("Accept", "application/json")
      .end(() => {
        app
          .post("/api/v1/customers")
          .send({ email: "test@email.com", password: "Test123$" })
          .set("Content-Type", "application/json")
          .set("Accept", "application/json")
          .expect((res) => {
            expect(res.body.message).toContain(
              "Customer exists with this email"
            );
            expect(res.statusCode).toEqual(400);
          })
          .end(done);
      });
  });

  it("fails to register a user with an invalid password", (done) => {
    app
      .post("/api/v1/customers")
      .send({ email: "test@email.com", password: "Test123$" })
      .set("Content-Type", "application/json")
      .set("Accept", "application/json")
      .expect((res) => {
        expect(res.body.message).toContain("Invalid request");
        expect(res.statusCode).toEqual(400);
        expect(res.body.error).toBeDefined();
      })
      .end(done);
  });

  //update customer details

  //change avatar url

  //disable account

  //reset password

  //
});
