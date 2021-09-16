const { Database } = require('sqlite3');
const { createUsersTable, createProductsTable, createListsTable, createProductsInListsTable } = require('./queries');

function formatDate(date = new Date()) {
    const d = new Date(date),
        year = d.getFullYear();
    let month = '' + (d.getMonth() + 1),
        day = '' + d.getDate();
    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;
  
    return [year, month, day].join('-');
}

const createTables = async (db) => {
    return new Promise(function(resolve,reject){
        db.run(createUsersTable, (err) => {
            if (err) {
                return reject(err);
            }
            let insert = 'INSERT INTO users (username, password, email) VALUES (?,?,?)';
            db.run(insert, ["snowy", "iknownothing", "iknownothing@mail.com"]);
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

const getUser = async (db, id) => {
    return new Promise(function(resolve,reject){
        db.get(`SELECT * FROM users where id = ?`, [id], function(err,rows){
                if(err){return reject(err);}
                resolve(rows);
            });
    });
}

// Products
const getProduct = async (db, id) => {
    return new Promise(function(resolve,reject){
        db.get(`SELECT * FROM products WHERE id = ?`, [id], function(err,rows){
                if(err){return reject(err);}
                resolve(rows);
            });
    });
}

const getAllProducts = async (db, id) => {
    return new Promise(function(resolve,reject){
        db.all(`SELECT * FROM products WHERE user_id = ?`, [id], function(err,rows){
                if(err){return reject(err);}
                resolve(rows);
            });
    });
}

const addProduct = async(db, { name, url, description, category }, user_id = 1) => {
    return new Promise(function(resolve,reject){
        db.all(`INSERT INTO products (name, category, description, url, user_id) VALUES (?,?,?,?,?)`, [name, category, description, url, user_id], function(err,rows){
                if(err){return reject(err);}
                db.get('SELECT last_insert_rowid()', function(err, id) {
                    if(err){return reject(err);}
                    resolve(id);
                })
            });
    });
}

const deleteProduct = async(db, id) => {
    const date = formatDate(new Date());
    return new Promise(function(resolve,reject){
        db.all(`UPDATE products SET deleted_at = ? WHERE id = ?`, [date, id], function(err,rows){
                if(err){return reject(err);}
                resolve(rows);
            });
    });
}

// Lists
const getList = async (db, id) => {
    return new Promise(function(resolve,reject){
        db.get(`SELECT * FROM lists WHERE id = ?`, [id], function(err,row){
            if(err){return reject(err);}
            db.all(`SELECT a.id, a.units AS pieces, a.completed, b.id, b.name, b.description, b.url, b.category FROM productsInLists a LEFT JOIN products b ON a.product_id=b.id WHERE list_id = ?`, [row.id], function(err,rows){
                if(err){return reject(err);}
                resolve({...row, items: rows.map((item) => ({...item, completed: Boolean(parseInt(item.completed)) }))});
            });
        });
    });
}

const addOrUpdateListAndProductsInList = async(db, { name, state, id, items }, user_id = 1) => {
    return new Promise(function(resolve,reject){
        const items2 = [];
        db.all(`REPLACE INTO lists (name, state, id, updated_at, user_id) VALUES (?,?,?,?,?)`, [name, state, id, formatDate(new Date()), user_id], function(err,rows){
                if(err){return reject(err);}
                db.get('SELECT last_insert_rowid()', function(err, insert_id) {
                    if(err){return reject(err);}
                    const flatItems = items.map(({ id, units, product_id, completed, name, category }) => [id, units, product_id, completed, insert_id['last_insert_rowid()'], name, category]);
                    db.serialize(function(){
                        flatItems.forEach((item) => {
                            db.run('REPLACE INTO productsInLists (id, units, product_id, completed, list_id) VALUES (?,?,?,?,?)', [...item.slice(0, 4), insert_id['last_insert_rowid()']], function(err){
                                if(err) throw err;
                            });
                        });
                        db.all(`SELECT a.id, a.units AS pieces, a.completed, b.id as product_id, b.name, b.description, b.category FROM productsInLists a LEFT JOIN products b ON a.product_id=b.id WHERE list_id = ?`, [insert_id['last_insert_rowid()']], function(err,rows){
                            if(err){return reject(err);}
                            resolve({
                                list: {name, state, id: insert_id['last_insert_rowid()'], items: rows.map((item) => ({...item, completed: Boolean(parseInt(item.completed)) }))}
                            })
                        });
                    });
                });
        });
    });
}

const toggleProductInListCompletion = async(db, list_id, id, completed) => {
    return new Promise(function(resolve,reject){
        db.all(`UPDATE productsInLists SET completed = ? WHERE id = ?`, [String(completed), id], function(err,rows){
                if(err){return reject(err);}
                resolve(rows);
            });
    });
}

const getActiveList = async(db, user_id = 1) => {
    return new Promise(function(resolve,reject){
        db.get(`SELECT * FROM lists WHERE user_id = ? AND state = ?`, [user_id, 'active'], function(err,row){
            if(err){return reject(err);}
            if(!row) {
                resolve({});
                return;
            }
            db.all(`SELECT a.id, a.units AS pieces, a.completed, b.id as product_id, b.name, b.category FROM productsInLists a LEFT JOIN products b ON a.product_id=b.id WHERE list_id = ?`, [row.id], function(err,rows){
                if(err){return reject(err);}
                resolve({...row, items: rows.map((item) => ({...item, completed: Boolean(parseInt(item.completed)) }))});
            });
        });
    });
}

const updateListState = async(db, id, state) => {
    return new Promise(function(resolve,reject){
        db.all(`UPDATE lists SET state = ? WHERE id = ?`, [state, id], function(err,rows){
                if(err){return reject(err);}
                resolve(rows);
            });
    });
}

const getAllLists = async(db, user_id = 1) => {
    return new Promise(function(resolve,reject){
        db.all(`SELECT * FROM lists where user_id = ?`, [user_id], function(err,rows){
            if(err){return reject(err);}
                resolve(rows);
            });
    });
}

const getTopCategories = async(db, user_id = 1) => {
    return new Promise(function(resolve,reject){  
        db.get(`SELECT COUNT(b.id) AS count FROM productsInLists a LEFT JOIN products b ON a.product_id=b.id WHERE user_id = ?`, [user_id], function(err,rows){
            if(err){return reject(err);}
                const sum = rows.count;
                db.all(`SELECT b.category AS name, COUNT(b.category) * 100 / ? AS percent FROM productsInLists a LEFT JOIN products b ON a.product_id=b.id WHERE user_id = ? GROUP BY b.category LIMIT 3`, [sum, user_id], function(err,rows){
                    if(err){return reject(err);}
                        resolve(rows);
                    });
            });
    });
}

const getTopItems = async(db, user_id = 1) => {
    return new Promise(function(resolve,reject){  
        db.get(`SELECT COUNT(b.id) AS count FROM productsInLists a LEFT JOIN products b ON a.product_id=b.id WHERE user_id = ?`, [user_id], function(err,rows){
            if(err){return reject(err);}
                const sum = rows.count;
                db.all(`SELECT b.name, COUNT(b.name) * 100 / ? AS percent FROM productsInLists a LEFT JOIN products b ON a.product_id=b.id WHERE user_id = ? GROUP BY b.name LIMIT 3`, [sum, user_id], function(err,rows){
                    if(err){return reject(err);}
                        resolve(rows);
                    });
            });
    });
}

// all of this year
const getMonthlyStatistics = async(db, user_id = 1) => {
    return new Promise(function(resolve,reject){  
        const year = String(new Date().getFullYear());
        db.all(`SELECT strftime('%m', b.updated_at) AS month, COUNT(a.id) AS items FROM productsInLists a LEFT JOIN lists b ON a.list_id=b.id WHERE user_id = ? AND strftime('%Y', b.updated_at) = ? GROUP BY strftime('%m', b.updated_at)`, [user_id, year], function(err,rows){
            resolve(rows);
        });
    });  
}

module.exports = {
    createTables,
    getUser,
    getProduct,
    getAllProducts,
    addProduct,
    deleteProduct,
    getList,
    getActiveList,
    getAllLists,
    toggleProductInListCompletion,
    updateListState,
    getTopCategories,
    getTopItems,
    getMonthlyStatistics,
    addOrUpdateListAndProductsInList
}