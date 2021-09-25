const getUser = async (db, id) => {
    return new Promise(function(resolve,reject){
        db.get(`SELECT * FROM users where id = ?`, [id], function(err,rows){
                if(err){return reject(err);}
                resolve(rows);
            });
    });
}

module.exports = {
    getUser,
}