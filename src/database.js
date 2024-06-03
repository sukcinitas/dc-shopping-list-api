const Database = require('better-sqlite3');

const formatDate = require('./util/formatDate');
const { createUsersTable, createProductsTable, createListsTable, createProductsInListsTable } = require('./queries');

const db = new Database('./emp_database.db');

const createTables = async (db) => {
    return new Promise(function(resolve,reject){
        db.run(createUsersTable, (err) => {
            if (err) {
                return reject(err);
            }
            let insert = 'INSERT INTO users (username, password) VALUES (?,?)';
            db.run(insert, ["snowy", "iknownothing"]);
        });
        db.run(createProductsTable, (err) => {
            if (err) {
                return reject(err);
            }
            let insert = 'INSERT INTO products (name, category, description, url, user_id) VALUES (?,?,?,?,?)';
            db.run(insert, ["Ice cream", "Sweets", "Your favorite", "", 1]);
            db.run(insert, ["Beef", "Meats", "", "https://images.unsplash.com/photo-1588168333986-5078d3ae3976?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8YmVlZnxlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60", 1]);
            db.run(insert, ["Chicken Breast", "Meats", "", "https://images.unsplash.com/photo-1604503468506-a8da13d82791?ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8Y2hpY2tlbiUyMGJyZWFzdHxlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60", 1]);
            db.run(insert, ["Pork 500g", "Meats", "", "", 1]);
        });
        db.run(createListsTable, (err) => {
            if (err) {
                return reject(err);
            }
            let insert = 'INSERT INTO lists (name, state, user_id, updated_at) VALUES (?,?,?, ?)';
            db.run(insert, ['Pirmadienio apsipirkimas', 'completed', 1, formatDate('2021-04-05')]);
            db.run(insert, ['Antradienio apsipirkimas', 'cancelled', 1, formatDate()]);
            db.run(insert, ['Tiesiausias kelias per grybus', 'active', 1, formatDate()]);
        });
        db.run(createProductsInListsTable, (err) => {
            if (err) {
                return reject(err);
            }
            let insert = 'INSERT INTO productsInLists (units, list_id, product_id, completed) VALUES (?,?,?,?)';
            db.run(insert, [1, 1, 1, "1"]);
            db.run(insert, [2, 1, 2, "1"]);
            db.run(insert, [3, 2, 1, "1"]);
            db.run(insert, [5, 3, 4, "1"]);
        });
        resolve('Tables created successfully!')
    });
        
}

const createDbTables = async () => {
        try {
            // TODO: check if tables exist
            // await createTables(db);
            db.prepare(createListsTable).run();
            db.prepare(createProductsInListsTable).run();
            db.prepare(createProductsTable).run();
            db.prepare(createUsersTable).run();
        } catch (err) {
            console.error('Something went wrong!', err);
        }
}

module.exports = {
    db, 
    createDbTables
}