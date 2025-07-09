// =============================================================
// FILE: model.js
// =============================================================
// This file handles the database connection.
// (No changes in this file)

import mysql from 'mysql2/promise';

// --- CHANGE HERE: Update with your database credentials ---
const dbConfig = {
    host: 'localhost', // or your database host
    user: 'root',      // your database username
    password: '',  // your database password
    database: 'pos_management_db'
};

/**
 * Creates and returns a connection to the MySQL database.
 * @returns {Promise<mysql.Connection>} A promise that resolves to a database connection object.
 */
export async function getDbConnection() {
    try {
        const connection = await mysql.createConnection(dbConfig);
        return connection;
    } catch (error) {
        console.error("Error connecting to the database:", error);
        throw error;
    }
}
