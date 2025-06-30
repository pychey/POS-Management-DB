import pool from "../utils/database.js";

export async function getPrivilegeForRole(role) {
    const grantee = `'${role}'@'%'`;
    const [rows] = await pool.query(`
        SELECT CONCAT(privilege_type, ' ON *.*')
        FROM information_schema.user_privileges up
        WHERE up.grantee = ?
        UNION
        SELECT CONCAT(privilege_type, ' ON ', table_schema, '.', table_name) as privilege
        FROM information_schema.table_privileges tp
        WHERE tp.grantee = ?
    `, [grantee, grantee]);
    return rows;
}

export async function grantPrivilegeToRole(role, tableName, privilegeString) {
    await pool.query(`GRANT ${privilegeString} ON ${tableName} TO ?`, [role]);
    await pool.query(`FLUSH PRIVILEGES`);
}