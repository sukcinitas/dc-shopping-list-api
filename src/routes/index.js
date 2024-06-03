const app = require("express")();

app.use("/products", require("./products.route"));
app.use("/lists", require("./lists.route"));
app.use("/users", require("./users.route"));
app.use("/statistics", require("./statistics.route"));

module.exports = app;
