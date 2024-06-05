const router = require("express").Router();
const service = require("../services/users.service");
const { db } = require("../database");
const { hashPassword, comparePassword } = require("../util/passwordHashing");

router.post("/register", async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const hashedPassword = hashPassword(password);
    const { lastInsertRowid: user_id } = await service.register(
      db,
      username,
      hashedPassword
    );
    const result = await service.getUser(db, user_id);
    res
      .status(200)
      .json({ username: result.username, user_id: result.user_id });
  } catch (err) {
    console.error(err, err.code);

    if (err?.code === "SQLITE_CONSTRAINT_UNIQUE") {
      return res.status(409).json("Username is already in use!");
    }
    res.status(500).end();
  }
});

router
  .route("/login")
  .get(async (req, res, next) => {
    try {
      if (!req.session.user?.id) {
        return res.status(404).json("User not found!");
      }
      const { username, user_id } = service.getUser(db, req.session.user.id);
      return res.status(200).json({ username, user_id });
    } catch (err) {
      console.log(err);
      res.status(500).end();
    }
  })
  .post(async (req, res, next) => {
    try {
      const { username, password } = req.body;
      const user = service.getUserByUsername(db, username);
      if (user && comparePassword(password, user.password)) {
        req.session.save(() => {
          req.session.user = {
            id: user.user_id,
          };
        });
        const { username, user_id } = user;
        res.status(200).json({ username, user_id });
      } else {
        res.status(401).json({ message: "User credentials are incorrect!" });
      }
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: err.message });
    }
  });

router.get("/logout", async (req, res, next) => {
  try {
    req.session.destroy();
    res.status(200).end();
  } catch (err) {
    res.status(500).end(err.message);
  }
});

module.exports = router;
