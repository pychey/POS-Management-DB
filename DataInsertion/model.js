
// =============================================================
// FILE: model.js
// =============================================================
// This file handles the database connection.

import mysql from 'mysql2/promise';

// IMPORTANT: Replace with your actual MySQL connection details.
// For a real application, these should come from environment variables.
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
        console.log("Successfully connected to the database.");
        return connection;
    } catch (error) {
        console.error("Error connecting to the database:", error);
        throw error; // Re-throw the error to be caught by the caller
    }
}

