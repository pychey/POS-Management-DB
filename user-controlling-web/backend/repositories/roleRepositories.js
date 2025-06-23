const { executeQuery } = require('../config/database');

class RoleRepository {
  // Get all roles
  async getAllRoles() {
    const query = `
      SELECT 
        User as role_name,
        Host as host,
        account_locked,
        password_expired
      FROM mysql.user 
      WHERE User IN (
        'database_admin', 'senior_developer', 'backend_developer', 
        'frontend_developer', 'data_analyst', 'qa_tester', 
        'intern_developer', 'intern_analyst'
      )
      ORDER BY User
    `;
    
    return await executeQuery(query);
  }

  // Get role privileges
  async getRolePrivileges(roleName) {
    const query = `
      SELECT 
        table_schema,
        table_name,
        privilege_type,
        is_grantable
      FROM information_schema.table_privileges 
      WHERE grantee = CONCAT("'", ?, "'@'%'")
      ORDER BY table_schema, table_name, privilege_type
    `;
    
    return await executeQuery(query, [roleName]);
  }

  // Create new role
  async createRole(roleName) {
    const query = `CREATE ROLE ?`;
    return await executeQuery(query, [roleName]);
  }

  // Drop role
  async dropRole(roleName) {
    const query = `DROP ROLE ?`;
    return await executeQuery(query, [roleName]);
  }

  // Grant privileges to role
  async grantPrivilegeToRole(privilege, database, table, roleName) {
    let query;
    if (table === '*') {
      query = `GRANT ${privilege} ON ${database}.* TO ?`;
    } else {
      query = `GRANT ${privilege} ON ${database}.${table} TO ?`;
    }
    return await executeQuery(query, [roleName]);
  }

  // Revoke privileges from role
  async revokePrivilegeFromRole(privilege, database, table, roleName) {
    let query;
    if (table === '*') {
      query = `REVOKE ${privilege} ON ${database}.* FROM ?`;
    } else {
      query = `REVOKE ${privilege} ON ${database}.${table} FROM ?`;
    }
    return await executeQuery(query, [roleName]);
  }

  // Get users assigned to role
  async getUsersWithRole(roleName) {
    const query = `
      SELECT 
        to_user as username,
        to_host as host
      FROM mysql.role_edges
      WHERE from_user = ?
    `;
    
    return await executeQuery(query, [roleName]);
  }

  // Get available privileges
  getAvailablePrivileges() {
    return [
      'SELECT', 'INSERT', 'UPDATE', 'DELETE', 
      'CREATE', 'DROP', 'ALTER', 'INDEX',
      'REFERENCES', 'TRIGGER', 'EXECUTE', 'SHOW VIEW'
    ];
  }

  // Get database tables for privilege assignment
  async getDatabaseTables(database = 'pos_provider_system') {
    const query = `
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = ?
      ORDER BY table_name
    `;
    
    return await executeQuery(query, [database]);
  }

  // Get all databases
  async getAllDatabases() {
    const query = `
      SELECT schema_name as database_name
      FROM information_schema.schemata
      WHERE schema_name NOT IN ('information_schema', 'performance_schema', 'mysql', 'sys')
      ORDER BY schema_name
    `;
    
    return await executeQuery(query);
  }

  // Check if role exists
  async roleExists(roleName) {
    const query = `
      SELECT COUNT(*) as count
      FROM mysql.user
      WHERE User = ? AND Host = '%'
    `;
    
    const result = await executeQuery(query, [roleName]);
    return result.success && result.data[0].count > 0;
  }
}

module.exports = new RoleRepository();