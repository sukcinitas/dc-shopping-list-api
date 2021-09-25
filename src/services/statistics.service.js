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
    getTopCategories,
    getTopItems,
    getMonthlyStatistics,
}