const express = require("express");
const session = require("express-session");
const sqlite = require("better-sqlite3");
const SqliteStore = require("better-sqlite3-session-store")(session);
require("dotenv").config();
const cors = require("cors");

const database = require("./database");
const sessionDatabase = new sqlite("sessions.db", { verbose: console.log });

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set("trust proxy", 1);
app.use(
  session({
    name: "kernel_panic",
    store: new SqliteStore({
      client: sessionDatabase,
      expired: {
        clear: true,
        intervalMs: 9000000, //ms = 150min
      },
    }),
    cookie: {
      httpOnly: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 9000000,
    },
    secret: "millenium mambo",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(
  cors({
    origin:
      process.env.NODE_ENV === "production"
        ? process.env.ORIGIN
        : "http://localhost:4000",
    credentials: true,
  })
);

app.use("/api", require("./routes"));

app.all("*", function (req, res) {
  res.status(404).send("Not found!");
});

database.createDbTables();

const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log("Server is listening on port " + port);
});
