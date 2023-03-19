import { UserInfo } from "@/dto/User.dto";
import UserRepo from "@/repo/User.repo";
import UserService from "@/services/User.service";
import { ROLES } from "@/utils/commonType";

jest.mock("@/repo/User.repo", () => ({
  create: jest.fn(),
}));

describe("User Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  test("Can create new customer with email and password - success", async () => {
    (UserRepo.create as jest.Mock).mockResolvedValue(
      Promise.resolve({
        id: "id",
        email: "test@email.com",
        role: ROLES.CUSTOMER,
      })
    );

    const result = (await UserService.customerCreateWithEmailPwd({
      email: "test@email.com",
      password: "Test123$",
    })) as UserInfo;

    expect(result).toHaveProperty("id");
    expect(result).toHaveProperty("email");

    expect(result).toHaveProperty("role");
    expect(result.role).toEqual(ROLES.CUSTOMER);

    expect(result.email).toBe("test@email.com");
  });

  test("Invalid customer details email/password should fail", async () => {
    const user = {
      email: "test@test.com",
      password: "pass123",
      role: ROLES.CUSTOMER,
    };

    const result = async () =>
      await UserService.customerCreateWithEmailPwd(user);

    expect(UserRepo.create as jest.Mock).not.toHaveBeenCalled();

    expect(result).rejects.toThrow(
      "Unable to create user with password and email"
    );
  });
});
