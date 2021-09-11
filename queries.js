// create tables
export const createProductsTable = 'CREATE TABLE products( \
    id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,\
    name VARCHAR(255) UNIQUE NOT NULL,\
    category VARCHAR(255)  NOT NULL,\
    description TEXT,\
    url VARCHAR(255),\
    deleted_at CURRENT_DATE,\
    user_id INTEGER,\
    FOREIGN KEY(user_id) REFERENCES users(id)\
)'

export const createListsTable = 'CREATE TABLE lists( \
    id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,\
    name VARCHAR(255) UNIQUE NOT NULL,\
    state VARCHAR(255) NOT NULL,\
    user_id INTEGER,\
    updated_at INTEGER,\
    FOREIGN KEY(user_id) REFERENCES users(id)\
)'

export const createProductsInListsTable = 'CREATE TABLE productsInLists( \
    id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,\
    units INTEGER,\
    list_id INTEGER,\
    product_id INTEGER,\
    completed VARCHAR(255),\
    FOREIGN KEY(list_id) REFERENCES lists(id)\
)'

export const createUsersTable = 'CREATE TABLE users( \
    id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,\
    username VARCHAR(255) NOT NULL,\
    password VARCHAR(255) NOT NULL,\
    email VARCHAR(255) NOT NULL\
)'
