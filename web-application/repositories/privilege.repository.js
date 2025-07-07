import pool from "../utils/database.js";

export async function getPrivilegeForRole(role) {
    const grantee = `'${role}'@'%'`;
    const [rows] = await pool.query(`
        SELECT CONCAT(privilege_type, ' ON *.*') AS privilege
        FROM information_schema.user_privileges
        WHERE grantee = ?
        UNION
        SELECT CONCAT(privilege_type, ' ON ', table_schema, '.*') AS privilege
        FROM information_schema.schema_privileges
        WHERE grantee = ?
        UNION
        SELECT CONCAT(privilege_type, ' ON ', table_schema, '.', table_name) AS privilege
        FROM information_schema.table_privileges
        WHERE grantee = ?
    `, [grantee, grantee, grantee]);
    return rows;
}

export async function grantPrivilegeToRole(role, tableName, privilegeString) {
    if (privilegeString == 'ALL PRIVILEGES WITH GRANT OPTION') await pool.query(`GRANT ALL PRIVILEGES ON ${tableName} TO ? WITH GRANT OPTION`, [role]);
    else if (privilegeString === 'ALL PRIVILEGES') await pool.query(`GRANT ALL PRIVILEGES ON ${tableName} TO ?`, [role]);
    else await pool.query(`GRANT ${privilegeString} ON ${tableName} TO ?`, [role]);
    await pool.query(`FLUSH PRIVILEGES`);
}