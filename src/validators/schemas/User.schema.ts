import { ROLES } from "@/utils/commonType";
import { z } from "zod";
/**
 * Regex for
 * - at least one uppercase letter
 * - at least one lowercase letter
 * - at least one number
 * - at least one special character
 * - at least 6 characters long
 * - at most 26 characters long
 */
const pwdRegex =
  /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*()_\-+={}[\]:";'<>,.?\/~]).{6,26}$/;

const UserWithEmailPwdSchema = z.object({
  email: z
    .string({
      required_error: "Email is required",
    })
    .email("Not a valid email"),
  password: z
    .string()
    .trim()
    .regex(
      pwdRegex,
      `Password should satisfy: at least one uppercase letter,at least one lowercase letter,at least one number,at least one special character,at least 6 characters long,at most 26 characters long            
    `
    ),
  role: z.enum([ROLES.ADMIN, ROLES.MERCHANT, ROLES.CUSTOMER], {
    required_error: "Please select a role",
    invalid_type_error: `Roles must be one of ${ROLES.ADMIN}, ${ROLES.MERCHANT} or ${ROLES.CUSTOMER}`,
  }),
});

const EmailPwdSchema = UserWithEmailPwdSchema.omit({ role: true });

const RegisterUserSchema = UserWithEmailPwdSchema.omit({ role: true }).extend({
  callbackUrl: z.string().url("Please provide a callback url"),
});

const UrlRoleSchema = z.object({
  siteUrl: z.string().url("Please provide the callback site url"),
  role: z.enum([ROLES.MERCHANT, ROLES.CUSTOMER], {
    required_error: "Please select a role",
    invalid_type_error: `Roles must be one of ${ROLES.MERCHANT} or ${ROLES.CUSTOMER}`,
  }),
});

const UpdateUserSchema = z.object({
  email: z.string().email("Not a valid email").optional(),
  lastName: z.string().optional(),
  firstName: z.string().optional(),
  phoneNumber: z.string().email("Not a valid email").optional(),
  userName: z.string().optional(),
});

export {
  UpdateUserSchema,
  UserWithEmailPwdSchema,
  EmailPwdSchema,
  UrlRoleSchema,
  RegisterUserSchema,
};
