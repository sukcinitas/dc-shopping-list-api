import { createUsersTable, createProductsTable, createListsTable, createProductsInListsTable } from './queries';

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

export const createTables = async (db) => {
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
            db.run(insert, ['Pirmadienio apsipirkimas', 'completed', 1, formatDate('2020-04-05')]);
            db.run(insert, ['Antradienio apsipirkimas', 'cancelled', 1, formatDate()]);
            db.run(insert, ['Tiesiausias kelias per grybus', 'active', 1, formatDate()]);
        });
        db.run(createProductsInListsTable, (err) => {
            if (err) {
                return reject(err);
            }
            let insert = 'INSERT INTO productsInLists (units, list_id, product_id, completed) VALUES (?,?,?,?)';
            db.run(insert, [4, 1, 1, 1]);
            db.run(insert, [4, 2, 1, 1]);
            db.run(insert, [4, 3, 4, 1]);
            db.run(insert, [4, 4, 2, 1]);
            db.run(insert, [4, 4, 3, 1]);
        });
        resolve('Tables created successfully!')
    });
        
}

export const getUser = async (db, id) => {
    return new Promise(function(resolve,reject){
        db.get(`SELECT * FROM users where id = ?`, [id], function(err,rows){
                if(err){return reject(err);}
                resolve(rows);
            });
    });
}

// Products
export const getProduct = async (db, id) => {
    return new Promise(function(resolve,reject){
        db.get(`SELECT * FROM products WHERE id = ?`, [id], function(err,rows){
                if(err){return reject(err);}
                resolve(rows);
            });
    });
}

export const getAllProducts = async (db, id) => {
    return new Promise(function(resolve,reject){
        db.all(`SELECT * FROM products WHERE user_id = ?`, [id], function(err,rows){
                if(err){return reject(err);}
                resolve(rows);
            });
    });
}

export const addProduct = async(db, { name, url, description, category }, user_id = 1) => {
    return new Promise(function(resolve,reject){
        db.all(`INSERT INTO products (name, category, description, url, user_id) VALUES (?,?,?,?,?)`, [name, category, description, url, user_id], function(err,rows){
                if(err){return reject(err);}
                resolve(rows);
            });
    });
}

export const deleteProduct = async(db, id) => {
    const date = formatDate(new Date());
    return new Promise(function(resolve,reject){
        db.all(`UPDATE products SET deleted_at = ? WHERE id = ?`, [id], function(err,rows){
                if(err){return reject(err);}
                resolve(rows);
            });
    });
}

// Lists
export const getList = async (db, id) => {
    return new Promise(function(resolve,reject){
        db.get(`SELECT * FROM lists WHERE id = ?`, [id], function(err,row){
            if(err){return reject(err);}
            db.get(`SELECT a.id, a.units, a.completed, a.product_id, b.id, b.name FROM productsInLists a LEFT JOIN products b ON a.product_id=b.id WHERE list_id = ?`, [row.id], function(err,rows){
                if(err){return reject(err);}
                resolve({...row, items: rows});
            });
        });
    });
}

export const getActiveList = async(db, user_id = 1) => {
    return new Promise(function(resolve,reject){
        db.get(`SELECT * FROM lists WHERE user_id = ? AND state = ?`, [user_id, 'active'], function(err,row){
            db.get(`SELECT a.id, a.units, a.completed, a.product_id, b.id, b.name FROM productsInLists a LEFT JOIN products b ON a.product_id=b.id WHERE list_id = ?`, [row.id], function(err,rows){
                if(err){return reject(err);}
                resolve({...row, items: rows});
            });
        });
    });
}

export const updateListState = async(db, id, state) => {
    return new Promise(function(resolve,reject){
        db.all(`UPDATE lists SET state = ? WHERE id = ?`, [id, state], function(err,rows){
                if(err){return reject(err);}
                resolve(rows);
            });
    });
}

export const getAllLists = async(db, user_id = 1) => {
    return new Promise(function(resolve,reject){
        db.all(`SELECT * FROM lists where user_id = ?`, [user_id], function(err,rows){
            if(err){return reject(err);}
                resolve(rows);
            });
    });
}

export const getTopCategories = async(db, user_id = 1) => {
    return new Promise(function(resolve,reject){  
        db.get(`SELECT COUNT(b.id) AS count FROM productsInLists a LEFT JOIN products b ON a.product_id=b.id WHERE user_id = ?`, [user_id], function(err,rows){
            if(err){return reject(err);}
                const sum = rows.count;
                db.all(`SELECT b.category, COUNT(b.category) * 100 / ? AS percent FROM productsInLists a LEFT JOIN products b ON a.product_id=b.id WHERE user_id = ? GROUP BY b.category LIMIT 5`, [sum, user_id], function(err,rows){
                    if(err){return reject(err);}
                        resolve(rows);
                    });
            });
    });
}

export const getTopItems = async(db, user_id = 1) => {
    return new Promise(function(resolve,reject){  
        db.get(`SELECT COUNT(b.id) AS count FROM productsInLists a LEFT JOIN products b ON a.product_id=b.id WHERE user_id = ?`, [user_id], function(err,rows){
            if(err){return reject(err);}
                const sum = rows.count;
                db.all(`SELECT b.name, COUNT(b.name) * 100 / ? AS percent FROM productsInLists a LEFT JOIN products b ON a.product_id=b.id WHERE user_id = ? GROUP BY b.name LIMIT 5`, [sum, user_id], function(err,rows){
                    if(err){return reject(err);}
                        resolve(rows);
                    });
            });
    });
}

// all of this year
export const getMonthlyStatistics = async(db, user_id = 1) => {
    return new Promise(function(resolve,reject){  
        const year = String(new Date().getFullYear());
        db.all(`SELECT strftime('%m', b.updated_at) AS month, COUNT(a.id) AS items FROM productsInLists a LEFT JOIN lists b ON a.list_id=b.id WHERE user_id = ? AND strftime('%Y', b.updated_at) = ? GROUP BY strftime('%m', b.updated_at)`, [user_id, year], function(err,rows){
            resolve(rows);
        });
    });  
}