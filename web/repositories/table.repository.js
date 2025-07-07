import pool from "../utils/database.js";

export async function getTable() {
    const [rows] = await pool.query(`
        SELECT TABLE_NAME as name
        FROM information_schema.TABLES 
        WHERE TABLE_SCHEMA = 'pos_management_db'
        AND TABLE_TYPE = 'BASE TABLE'
        ORDER BY TABLE_NAME
    `);
    return rows;
}