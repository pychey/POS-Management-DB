import pool from "../utils/database.js";

export async function getRole() {
    const [rows] = await pool.execute(`
        SELECT User as name, 
       	    (SELECT COUNT(*) FROM mysql.role_edges WHERE from_user = User) as userCount
        FROM mysql.user
        WHERE authentication_string = ''
        ORDER BY User
    `);
    return rows;
}

export async function createRole(roleName) {
    await pool.execute(`CREATE ROLE ?`, [roleName]);
    await pool.execute(`FLUSH PRIVILEGES`);
}

export async function deleteRole(roleName) {
    await pool.execute(`DROP ROLE ?`, [roleName]);
    await pool.execute(`FLUSH PRIVILEGES`);
}