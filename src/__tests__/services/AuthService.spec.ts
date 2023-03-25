import UserRepo, { ExtendedInfo } from "@/repo/User.repo";
import AuthService from "@/services/Auth.service";
import { ROLES } from "@/utils/commonType";
import * as passwordUtils from "@/utils/password";

jest.mock("@/repo/User.repo", () => ({
  findByEmail: jest.fn(),
}));

describe("Auth Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  test("Can login a customer with email and password - success", async () => {
    (UserRepo.findByEmail as jest.Mock).mockResolvedValue(
      Promise.resolve({
        id: "id",
        email: "test@email.com",
        role: ROLES.CUSTOMER,
        password: "password",
      })
    );

    const mock = jest.spyOn(passwordUtils, "comparePwd");
    mock.mockName("comparePwd").mockImplementation(() => Promise.resolve(true));

    const result = (await AuthService.customerPasswordLogin(
      "test@email.com",
      "Test123$"
    )) as { isCorrectPwd: boolean; user: ExtendedInfo };

    expect(result).toHaveProperty("isCorrectPwd");
    expect(result).toHaveProperty("user");

    expect(result.isCorrectPwd).toEqual(true);
    expect(result.user.email).toEqual("test@email.com");
    expect(result.user.password).toEqual("password");
    expect(result.user.role).toEqual(ROLES.CUSTOMER);
    mock.mockRestore();
  });
});
