import pool from "../utils/database.js";

export async function getUser() {
    const [rows] = await pool.query(`
        SELECT u.User as username, u.Host as host, 
                COALESCE(GROUP_CONCAT(re.from_user SEPARATOR ', '), 'No Role') as role,
                IF(u.account_locked = 'Y', 'Locked', 'Active') as status
        FROM mysql.user u 
        LEFT JOIN mysql.role_edges re ON u.User = re.to_user AND u.Host = re.to_host
        WHERE u.User NOT IN ('root', 'mysql.sys', 'mysql.session', 'mysql.infoschema')
        AND u.authentication_string != ''
        GROUP BY u.User, u.Host
        ORDER BY u.User
    `);
    return rows;
}

export async function createUser(username, password, host, role) {
    await pool.query(`CREATE USER '${username}'@'${host}' IDENTIFIED BY '${password}'`);
    
    if (role) {
        await pool.query(`GRANT '${role}' TO '${username}'@'${host}'`);
        await pool.query(`SET DEFAULT ROLE '${role}' TO '${username}'@'${host}'`);
    }
    
    await pool.query(`FLUSH PRIVILEGES`);
}

export async function grantRoleToUser(username, host, newRole) {
    await pool.query(`GRANT ? TO '${username}'@'${host}'`, [newRole]);
    await pool.query(`FLUSH PRIVILEGES`);
}

export async function revokeRoleFromUser(username, host, role) {
    await pool.query(`REVOKE ? FROM '${username}'@'${host}'`, [role]);
    await pool.query(`FLUSH PRIVILEGES`);
}

export async function updateUser(username, host, newRole) {
    const [currentRoles] = await pool.query(`
        SELECT from_user as role FROM mysql.role_edges 
        WHERE to_user = ? AND to_host = ?
    `, [username, host]);
    
    for (const roleRow of currentRoles) {
        await pool.query(`REVOKE ? FROM '${username}'@'${host}'`, [roleRow.role]);
    }
    
    await pool.query(`GRANT ? TO '${username}'@'${host}'`, [newRole]);
    await pool.query(`SET DEFAULT ROLE ? TO '${username}'@'${host}'`, [newRole]);
    await pool.query(`FLUSH PRIVILEGES`);
}

export async function deleteUser(username, host) {
    await pool.query(`DROP USER '${username}'@'${host}'`);
    await pool.query(`FLUSH PRIVILEGES`);
}