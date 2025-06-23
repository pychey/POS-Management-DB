const roleRepository = require('../repositories/roleRepository');

class RoleController {
  async getAllRoles(req, res) {
    try {
      const result = await roleRepository.getAllRoles();
      
      if (result.success) {
        res.status(200).json({
          success: true,
          data: result.data,
          message: 'Roles retrieved successfully'
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Failed to retrieve roles',
          error: result.error
        });
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }

  async getRoleDetails(req, res) {
    try {
      const { roleName } = req.params;
      
      const privilegesResult = await roleRepository.getRolePrivileges(roleName);
      const usersResult = await roleRepository.getUsersWithRole(roleName);
      
      if (privilegesResult.success && usersResult.success) {
        res.status(200).json({
          success: true,
          data: {
            roleName,
            privileges: privilegesResult.data,
            users: usersResult.data
          },
          message: 'Role details retrieved successfully'
        });
      } else {
        res.status(404).json({
          success: false,
          message: 'Role not found or error retrieving details'
        });
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }

  async createRole(req, res) {
    try {
      const { roleName } = req.body;
      
      if (!roleName) {
        return res.status(400).json({
          success: false,
          message: 'Role name is required'
        });
      }

      const exists = await roleRepository.roleExists(roleName);
      if (exists) {
        return res.status(400).json({
          success: false,
          message: 'Role already exists'
        });
      }

      const result = await roleRepository.createRole(roleName);
      
      if (result.success) {
        res.status(201).json({
          success: true,
          message: 'Role created successfully',
          data: { roleName }
        });
      } else {
        res.status(400).json({
          success: false,
          message: 'Failed to create role',
          error: result.error
        });
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }

  async deleteRole(req, res) {
    try {
      const { roleName } = req.params;
      
      const result = await roleRepository.dropRole(roleName);
      
      if (result.success) {
        res.status(200).json({
          success: true,
          message: 'Role deleted successfully'
        });
      } else {
        res.status(400).json({
          success: false,
          message: 'Failed to delete role',
          error: result.error
        });
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }

  async grantPrivilege(req, res) {
    try {
      const { roleName } = req.params;
      const { privilege, database, table = '*' } = req.body;
      
      if (!privilege || !database) {
        return res.status(400).json({
          success: false,
          message: 'Privilege and database are required'
        });
      }

      const result = await roleRepository.grantPrivilegeToRole(
        privilege, database, table, roleName
      );
      
      if (result.success) {
        res.status(200).json({
          success: true,
          message: 'Privilege granted successfully',
          data: { roleName, privilege, database, table }
        });
      } else {
        res.status(400).json({
          success: false,
          message: 'Failed to grant privilege',
          error: result.error
        });
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }

  async revokePrivilege(req, res) {
    try {
      const { roleName } = req.params;
      const { privilege, database, table = '*' } = req.body;
      
      if (!privilege || !database) {
        return res.status(400).json({
          success: false,
          message: 'Privilege and database are required'
        });
      }

      const result = await roleRepository.revokePrivilegeFromRole(
        privilege, database, table, roleName
      );
      
      if (result.success) {
        res.status(200).json({
          success: true,
          message: 'Privilege revoked successfully'
        });
      } else {
        res.status(400).json({
          success: false,
          message: 'Failed to revoke privilege',
          error: result.error
        });
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }

  async getAvailablePrivileges(req, res) {
    try {
      const privileges = roleRepository.getAvailablePrivileges();
      
      res.status(200).json({
        success: true,
        data: privileges,
        message: 'Available privileges retrieved successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }

  // Get database tables
  async getDatabaseTables(req, res) {
    try {
      const { database } = req.params;
      
      const result = await roleRepository.getDatabaseTables(database);
      
      if (result.success) {
        res.status(200).json({
          success: true,
          data: result.data,
          message: 'Database tables retrieved successfully'
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Failed to retrieve database tables',
          error: result.error
        });
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }

  async getAllDatabases(req, res) {
    try {
      const result = await roleRepository.getAllDatabases();
      
      if (result.success) {
        res.status(200).json({
          success: true,
          data: result.data,
          message: 'Databases retrieved successfully'
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Failed to retrieve databases',
          error: result.error
        });
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }
}

module.exports = new RoleController();