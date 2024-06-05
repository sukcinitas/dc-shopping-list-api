const Database = require("better-sqlite3");

const userService = require("./services/users.service");
const listService = require("./services/lists.service");
const { hashPassword } = require("./util/passwordHashing");

const {
  createUsersTable,
  createProductsTable,
  createListsTable,
  createProductsInListsTable,
} = require("./queries");

const db = new Database("./emp_database.db");

// Fill with sample data
const createInfo = (db) => {
  try {
    // create default user
    const hashedPassword = hashPassword("userPassword");
    const { lastInsertRowid } = userService.register(
      db,
      "user",
      hashedPassword
    );
    // create several products
    const insertProduct = db.prepare(
      "INSERT INTO products (name, category, description, url, user_id) VALUES (?,?,?,?,?)"
    );
    insertProduct.run(
      "Ice cream",
      "Sweets",
      "Your favorite",
      "",
      lastInsertRowid
    );
    insertProduct.run(
      "Beef",
      "Meats",
      "",
      "https://images.unsplash.com/photo-1588168333986-5078d3ae3976?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8YmVlZnxlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
      lastInsertRowid
    );
    insertProduct.run(
      "Chicken Breast",
      "Meats",
      "",
      "https://images.unsplash.com/photo-1604503468506-a8da13d82791?ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8Y2hpY2tlbiUyMGJyZWFzdHxlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
      lastInsertRowid
    );

    // create list with products
    listService.addOrUpdateListAndProductsInList(
      db,
      {
        name: "Pirmadienio apsipirkimas",
        state: "active",
        list_id: undefined,
        items: [
          {
            product_id: 1,
            completed: "0",
            units: 2,
          },
          {
            product_id: 2,
            completed: "1",
            units: 1,
          },
        ],
      },
      lastInsertRowid
    );
  } catch (err) {
    console.log(err, "err");
  }
};

const createDbTables = async () => {
  try {
    db.prepare(createUsersTable).run();
    db.prepare(createProductsTable).run();
    db.prepare(createListsTable).run();
    db.prepare(createProductsInListsTable).run();

    // create default info
    createInfo(db);
  } catch (err) {
    console.error("Something went wrong!", err);
  }
};

module.exports = {
  db,
  createDbTables,
};
