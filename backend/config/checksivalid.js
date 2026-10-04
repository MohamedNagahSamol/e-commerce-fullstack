import { check } from "express-validator";

const Check = [
  check("email", "Please provide a valid email").isEmail(),
  check(
    "password",
    "Password must be at least 8 characters with 1 upper case letter, 1 number and 1 special character",
  ).matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^a-zA-Z0-9])(?=.{8,})/),
];

export { Check };