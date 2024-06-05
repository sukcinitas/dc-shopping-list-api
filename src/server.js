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
app.use(
  session({
    store: new SqliteStore({
      client: sessionDatabase,
      expired: {
        clear: true,
        intervalMs: 900000, //ms = 15min
      },
    }),
    secret: "millenium mambo",
    resave: false,
    saveUninitialized: true,
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
