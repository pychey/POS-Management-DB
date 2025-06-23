const { executeQuery } = require('../config/database');

class UserRepository {
  async getAllUsers() {
    const query = `
      SELECT 
        u.User as username,
        u.Host as host,
        GROUP_CONCAT(DISTINCT re.from_user SEPARATOR ', ') as roles,
        u.account_locked,
        u.password_expired
      FROM mysql.user u
      LEFT JOIN mysql.role_edges re ON u.User = re.to_user AND u.Host = re.to_host
      WHERE u.User NOT IN ('mysql.sys', 'mysql.session', 'mysql.infoschema', 'root')
      GROUP BY u.User, u.Host
      ORDER BY u.User
    `;
    
    return await executeQuery(query);
  }

  async getUserByUsername(username) {
    const query = `
      SELECT 
        u.User as username,
        u.Host as host,
        u.account_locked,
        u.password_expired,
        u.password_last_changed,
        u.max_connections,
        u.max_user_connections
      FROM mysql.user u
      WHERE u.User = ?
    `;
    
    return await executeQuery(query, [username]);
  }

  async getUserRoles(username, host = '%') {
    const query = `
      SELECT from_user as role_name
      FROM mysql.role_edges
      WHERE to_user = ? AND to_host = ?
    `;
    
    return await executeQuery(query, [username, host]);
  }

  async createUser(username, password, host = '%') {
    const query = `CREATE USER ?@? IDENTIFIED BY ?`;
    return await executeQuery(query, [username, host, password]);
  }

  async dropUser(username, host = '%') {
    const query = `DROP USER ?@?`;
    return await executeQuery(query, [username, host]);
  }

  async grantRoleToUser(roleName, username, host = '%') {
    const query = `GRANT ? TO ?@?`;
    return await executeQuery(query, [roleName, username, host]);
  }

  async revokeRoleFromUser(roleName, username, host = '%') {
    const query = `REVOKE ? FROM ?@?`;
    return await executeQuery(query, [roleName, username, host]);
  }

  async setDefaultRole(roleName, username, host = '%') {
    const query = `SET DEFAULT ROLE ? TO ?@?`;
    return await executeQuery(query, [roleName, username, host]);
  }

  async changeUserPassword(username, newPassword, host = '%') {
    const query = `ALTER USER ?@? IDENTIFIED BY ?`;
    return await executeQuery(query, [username, host, newPassword]);
  }

  async lockUser(username, host = '%') {
    const query = `ALTER USER ?@? ACCOUNT LOCK`;
    return await executeQuery(query, [username, host]);
  }

  async unlockUser(username, host = '%') {
    const query = `ALTER USER ?@? ACCOUNT UNLOCK`;
    return await executeQuery(query, [username, host]);
  }

  async getUserPrivileges(username, host = '%') {
    try {
      const query = `
        SELECT 
          CONCAT('SHOW GRANTS FOR ''', ?, '''@''', ?, '''') as grant_query
      `;
      const result = await executeQuery(query, [username, host]);
      
      if (result.success && result.data.length > 0) {
        const grantQuery = result.data[0].grant_query;
        return await executeQuery(grantQuery);
      }
      
      return { success: false, error: 'Could not retrieve user privileges' };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Flush privileges
  async flushPrivileges() {
    const query = `FLUSH PRIVILEGES`;
    return await executeQuery(query);
  }
}

module.exports = new UserRepository();