// create tables
const createProductsTable =
  "CREATE TABLE IF NOT EXISTS products( \
    product_id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,\
    name VARCHAR(255) NOT NULL,\
    category VARCHAR(255)  NOT NULL,\
    description TEXT,\
    url VARCHAR(255),\
    deleted_at CURRENT_DATE,\
    user_id INTEGER,\
    FOREIGN KEY(user_id) REFERENCES users(user_id),\
    UNIQUE(name, user_id, deleted_at)\
)";

const createListsTable =
  "CREATE TABLE IF NOT EXISTS lists( \
    list_id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,\
    name VARCHAR(255) NOT NULL,\
    state VARCHAR(255) NOT NULL,\
    user_id INTEGER,\
    updated_at INTEGER,\
    FOREIGN KEY(user_id) REFERENCES users(user_id)\
)";

const createProductsInListsTable =
  "CREATE TABLE IF NOT EXISTS productsInLists( \
    id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,\
    units INTEGER,\
    list_id INTEGER,\
    product_id INTEGER,\
    completed VARCHAR(255),\
    FOREIGN KEY(list_id) REFERENCES lists(list_id) ON UPDATE CASCADE\
)";

const createUsersTable =
  "CREATE TABLE IF NOT EXISTS users(\
    user_id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,\
    username VARCHAR(255) NOT NULL UNIQUE,\
    password VARCHAR(255) NOT NULL\
)";

module.exports = {
  createProductsTable,
  createListsTable,
  createProductsInListsTable,
  createUsersTable,
};
