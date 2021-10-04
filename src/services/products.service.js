const formatDate = require('../util/formatDate');

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


module.exports = {
    getProduct,
    getAllProducts,
    addProduct,
    deleteProduct,
}