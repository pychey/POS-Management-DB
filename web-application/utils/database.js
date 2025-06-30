import mysql from "mysql2/promise";

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '@123Pychey',
    database: 'pos_management_db',
    multipleStatements: true
});

export default pool;

