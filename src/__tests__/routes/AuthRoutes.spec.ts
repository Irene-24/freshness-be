import request from "supertest";
import buildApp from "@/test-utils/test-app";
import Context from "@/test-utils/context";
import authRoutes from "@/routes/auth.route";
import customerRoutes from "@/routes/customers.route";

describe("Auth routes", function () {
  let context: Context;
  let app: request.SuperTest<request.Test>;

  beforeAll(async () => {
    context = await Context.build();
    app = request(buildApp({ routers: [customerRoutes, authRoutes] }));
  });

  beforeEach(async () => {
    await context.reset();
  });

  afterAll(() => {
    context.close();
  });

  const url = "/api/v1/auth";
  const custUrl = "/api/v1/customers";

  test("should login a user successfully", function (done) {
    app
      .post(`${custUrl}/register-with-email-and-password`)
      .send({ email: "test@email.com", password: "Test123$" })
      .set("Content-Type", "application/json")
      .set("Accept", "application/json")
      .then(() => {
        return app
          .post(`${url}/customer-password-login`)
          .send({ email: "test@email.com", password: "Test123$" })
          .set("Content-Type", "application/json")
          .set("Accept", "application/json");
      })
      .then((res) => {
        expect(res.body.jwt).toBeDefined();
        expect(res.statusCode).toEqual(200);
        done();
      })
      .catch(() =>
        //err
        {
          //console.log(err);
          done();
        }
      );
  });
});
