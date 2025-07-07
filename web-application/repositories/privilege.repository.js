import pool from "../utils/database.js";

export async function getPrivilegeForRole(role) {
    const grantee = `'${role}'@'%'`;
    const [rows] = await pool.query(`
        WITH user_level AS (
            SELECT CONCAT(privilege_type, ' ON *.*') AS privilege
            FROM information_schema.user_privileges
            WHERE grantee = ?
        ),
        schema_level AS (
            SELECT CONCAT(privilege_type, ' ON ', table_schema, '.*') AS privilege,
                   privilege_type,
                   table_schema
            FROM information_schema.schema_privileges
            WHERE grantee = ?
        ),
        table_level AS (
            SELECT CONCAT(privilege_type, ' ON ', table_schema, '.', table_name) AS privilege,
                   privilege_type,
                   table_schema
            FROM information_schema.table_privileges
            WHERE grantee = ?
        )
        SELECT privilege FROM user_level
        UNION
        SELECT s.privilege
        FROM schema_level s
        LEFT JOIN user_level u
            ON CONCAT(s.privilege_type, ' ON *.*') = u.privilege
        WHERE u.privilege IS NULL
        UNION
        SELECT t.privilege
        FROM table_level t
        LEFT JOIN user_level u
            ON CONCAT(t.privilege_type, ' ON *.*') = u.privilege
        LEFT JOIN schema_level s
            ON t.privilege_type = s.privilege_type AND t.table_schema = s.table_schema
        WHERE u.privilege IS NULL AND s.privilege IS NULL
    `, [grantee, grantee, grantee]);
    return rows;
}

export async function getPrivilegeForUser(username, host) {
    const grantee = `'${username}'@'${host}'`;
    const [rows] = await pool.query(`
        WITH user_level AS (
            SELECT CONCAT(privilege_type, ' ON *.*') AS privilege
            FROM information_schema.user_privileges
            WHERE grantee = ?
        ),
        schema_level AS (
            SELECT CONCAT(privilege_type, ' ON ', table_schema, '.*') AS privilege,
                   privilege_type,
                   table_schema
            FROM information_schema.schema_privileges
            WHERE grantee = ?
        ),
        table_level AS (
            SELECT CONCAT(privilege_type, ' ON ', table_schema, '.', table_name) AS privilege,
                   privilege_type,
                   table_schema
            FROM information_schema.table_privileges
            WHERE grantee = ?
        )
        SELECT privilege FROM user_level
        UNION
        SELECT s.privilege
        FROM schema_level s
        LEFT JOIN user_level u
            ON CONCAT(s.privilege_type, ' ON *.*') = u.privilege
        WHERE u.privilege IS NULL
        UNION
        SELECT t.privilege
        FROM table_level t
        LEFT JOIN user_level u
            ON CONCAT(t.privilege_type, ' ON *.*') = u.privilege
        LEFT JOIN schema_level s
            ON t.privilege_type = s.privilege_type AND t.table_schema = s.table_schema
        WHERE u.privilege IS NULL AND s.privilege IS NULL
    `, [grantee, grantee, grantee]);
    return rows;
}

export async function grantPrivilegeToRole(role, tableName, privilegeString) {
    console.log(privilegeString, tableName, role);
    if (privilegeString == 'ALL PRIVILEGES WITH GRANT OPTION') await pool.query(`GRANT ALL PRIVILEGES ON ${tableName} TO ? WITH GRANT OPTION`, [role]);
    else if (privilegeString === 'ALL PRIVILEGES') await pool.query(`GRANT ALL PRIVILEGES ON ${tableName} TO ?`, [role]);
    else await pool.query(`GRANT ${privilegeString} ON ${tableName} TO ?`, [role]);
    await pool.query(`FLUSH PRIVILEGES`);
}