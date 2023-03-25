import bcrypt from "bcrypt";

const saltRounds = 10;

async function comparePwd(password: string, hashedPassword: string) {
  try {
    const match = await bcrypt.compare(password, hashedPassword);
    return match;
  } catch {
    return false;
  }
}

async function hashPwd(password: string) {
  try {
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
  } catch (error) {
    throw new Error("Unable to process password");
  }
}

export { comparePwd, hashPwd };
