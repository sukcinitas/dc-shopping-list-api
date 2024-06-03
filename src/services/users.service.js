const getUser = (db, id) => {
  return db.prepare(`SELECT * FROM users where id = ?`).get(id);
};

const getUserByUsername = (db, username) => {
  return db.prepare(`SELECT * FROM users where username = ?`).get(username);
};

const register = (db, username, hashedPassword) => {
  return db
    .prepare(`INSERT INTO users(username, password) VALUES(?,?)`)
    .run(username, hashedPassword);
};

module.exports = {
  getUser,
  getUserByUsername,
  register,
};
