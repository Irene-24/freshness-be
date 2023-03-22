// import request from "supertest";

import Context from "@/test-utils/context";
import config from "@/src/config";
// import buildApp from "@/test-utils/test-app";

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

describe("first jj", () => {
  it("test db", async () => {
    expect(config.env).toEqual("test");
    expect(context.roleName).toBeDefined();
  });
});

/**
 * buildApp = (routes:: Router) = {
 * 
 * let app = createApp()
 * app.use(api/v1/, routes())
 * 
 return app
 * 
 * }
 * 
 */
