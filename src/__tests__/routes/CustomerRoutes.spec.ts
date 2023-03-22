import request from "supertest";

import buildApp from "@/test-utils/test-app";
import Context from "@/test-utils/context";
import customerRoutes from "@/routes/customers.route";
import { serializeError } from "serialize-error";

// import UserRepo from "@/repo/User.repo";

let context: Context;

beforeAll(async () => {
  context = await Context.build();
});

beforeEach(async () => {
  await context.reset();
});

afterAll(() => {
  context.close();
});

describe("Customer routes", function () {
  it("registers a user with a unique email and password", (done) => {
    request(buildApp({ routers: customerRoutes }))
      .post("/api/v1/customers")
      .send({ email: "test@email.com", password: "Test123$" })
      .set("Content-Type", "application/json")
      .set("Accept", "application/json")
      .expect((res) => {
        expect(res.body.message).toEqual("Created customer");
        expect(res.statusCode).toEqual(201);
      })
      .end(done);
  });
});
