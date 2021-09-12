const sqlite3 = require('sqlite3');
const service = require('./service');

const db = new sqlite3.Database('./emp_database.db');

const createDbTables = async () => {
        try {
            await service.createTables(db);
        } catch (err) {
            console.error('Something went wrong!', err);
        }
}

module.exports = {
    db, 
    createDbTables
}