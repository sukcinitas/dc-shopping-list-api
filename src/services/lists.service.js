const formatDate = require('../util/formatDate');

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
                        db.all(`DELETE FROM productsInLists WHERE list_id = ?`, [id]);
                        flatItems.forEach((item) => {
                            db.run('INSERT INTO productsInLists (id, units, product_id, completed, list_id) VALUES (?,?,?,?,?)', [...item.slice(0, 4), insert_id['last_insert_rowid()']], function(err){
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

module.exports = {
    getList,
    getActiveList,
    getAllLists,
    toggleProductInListCompletion,
    updateListState,
    addOrUpdateListAndProductsInList
}