import pool from "../utils/database.js";

export async function getPrivilegeForRole(role) {
    const [rows] = await pool.execute(`
        SELECT CONCAT(privilege_type, ' ON ', 
                        CASE 
                        WHEN table_schema = '*' THEN '*.*'
                        ELSE CONCAT(table_schema, '.', table_name)
                        END) as privilege
        FROM information_schema.user_privileges up
        WHERE up.grantee = CONCAT("'", ?, "'@'%'")
        UNION
        SELECT CONCAT(privilege_type, ' ON ', table_schema, '.', table_name) as privilege
        FROM information_schema.table_privileges tp
        WHERE tp.grantee = CONCAT("'", ?, "'@'%'")
    `, [role, role]);
    return rows;
}

export async function grantPrivilegeToRole(role, table, privileges) {
    const privilegeString = privileges.join(', ');
    const tableName = `pos_management_db.${table}`;
    
    await pool.execute(`GRANT ${privilegeString} ON ${tableName} TO ?`, [role]);
    await pool.execute(`FLUSH PRIVILEGES`);
}