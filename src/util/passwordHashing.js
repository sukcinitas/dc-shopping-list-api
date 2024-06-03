const { compareSync, hashSync } = require("bcryptjs");

const pepperCode = '7510016265 7204971188';
const pepperEnv = process.env.PEPPER;
const pepper = `${pepperCode}${pepperEnv}`;

function hashPassword(password) {
  return hashSync(`${password}${pepper}`, 10);
}

function comparePassword(
  assumedPassword,
  hashedPassword,
) {
  return compareSync(`${assumedPassword}${pepper}`, hashedPassword);
}

module.exports = {
    hashPassword,
    comparePassword
}
