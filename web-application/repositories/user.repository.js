import pool from "../utils/database.js";

export async function getUser() {
    const [rows] = await pool.execute(`
        SELECT u.User as username, u.Host as host, 
                COALESCE(re.from_user, 'No Role') as role,
                IF(u.account_locked = 'Y', 'Locked', 'Active') as status
        FROM mysql.user u 
        LEFT JOIN mysql.role_edges re ON u.User = re.to_user AND u.Host = re.to_host
        WHERE u.User NOT IN ('root', 'mysql.sys', 'mysql.session', 'mysql.infoschema')
        ORDER BY u.User
    `);
    return rows;
}

export async function createUser(username, password, host, role) {
    await pool.execute(`CREATE USER '${username}'@'${host}' IDENTIFIED BY '${password}'`);
    await pool.execute(`GRANT '${role}' TO '${username}'@'${host}'`);
    await pool.execute(`SET DEFAULT ROLE '${role}' TO '${username}'@'${host}'`);
    await pool.execute(`FLUSH PRIVILEGES`);
}

export async function updateUser(username, host, newRole) {
    const [currentRoles] = await pool.execute(`
        SELECT from_user as role FROM mysql.role_edges 
        WHERE to_user = ? AND to_host = ?
    `, [username, host]);
    
    for (const roleRow of currentRoles) {
        await pool.execute(`REVOKE ? FROM '${username}'@'${host}'`, [roleRow.role]);
    }
    
    await pool.execute(`GRANT ? TO '${username}'@'${host}'`, [newRole]);
    await pool.execute(`SET DEFAULT ROLE ? TO '${username}'@'${host}'`, [newRole]);
    await pool.execute(`FLUSH PRIVILEGES`);
}

export async function deleteUser(username, host) {
    await pool.execute(`DROP USER '${username}'@'${host}'`);
    await pool.execute(`FLUSH PRIVILEGES`);
}