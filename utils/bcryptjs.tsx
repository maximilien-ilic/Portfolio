import bcrypt from "bcryptjs";
 
export function hashPassword(plainPassword: string) {
  return bcrypt.hash(plainPassword, 10).then((hashedPassword: string) => {
    return hashedPassword;
  });
}


export function checkPassword(userPassword: string, dbPassword: string) {
  return bcrypt.compare(userPassword, dbPassword).then((result: boolean) => {
    return result;
  });
}