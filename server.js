const sqlite3 = require('sqlite3');
const express = require("express");
const service = require('./service');

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

export const db = new sqlite3.Database('./emp_database.db');

app.use('/api', require('./routes'));

// app.all('*', (req, res) => {
//   res.sendFile(path.join(process.cwd(), '/client/dist/index.html'), (err) => {
//     if (err) {
//       res.status(500).send(err);
//     }
//   });
// });

const HTTP_PORT = 8000
app.listen(HTTP_PORT, () => {
    console.log("Server is listening on port " + HTTP_PORT);
});

const createDbTables = async () => {
        try {
            await service.createTables(db);
        } catch (err) {
            console.error('Something went wrong!', err);
        }
}
createDbTables();
