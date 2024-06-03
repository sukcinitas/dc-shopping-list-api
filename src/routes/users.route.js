const router = require("express").Router();
const service = require("../services/users.service");
const { db } = require("../database");
const { hashPassword, comparePassword } = require("../util/passwordHashing");

router.post("/register", async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const hashedPassword = hashPassword(password);
    const ans = await service.register(db, username, hashedPassword);
    res.status(200).json(ans);
  } catch (err) {
    console.error(err);

    let message = "";
    if (err?.errno === 19) {
      message = "Username is already in use!";
    }
    res.status(500).json(message);
  }
});

router.post("/login", async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const user = service.getUserByUsername(db, username);
    if (user && comparePassword(password, user.password)) {
      req.session.save(() => {
        req.session.user = {
          id: user.user_id,
        };
      });
      res.status(200).end();
    } else {
      throw new Error("User credentials are incorrect!");
    }
  } catch (err) {
    console.error(err);
    res.status(500).json(err.message);
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
