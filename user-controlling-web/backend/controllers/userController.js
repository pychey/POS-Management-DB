const userRepository = require('../repositories/userRepository');

class UserController {
  async getAllUsers(req, res) {
    try {
      const result = await userRepository.getAllUsers();
      
      if (result.success) {
        res.status(200).json({
          success: true,
          data: result.data,
          message: 'Users retrieved successfully'
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Failed to retrieve users',
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

  async getUserByUsername(req, res) {
    try {
      const { username } = req.params;
      
      const userResult = await userRepository.getUserByUsername(username);
      const rolesResult = await userRepository.getUserRoles(username);
      
      if (userResult.success && rolesResult.success) {
        const userData = userResult.data[0];
        const userRoles = rolesResult.data.map(role => role.role_name);
        
        res.status(200).json({
          success: true,
          data: {
            ...userData,
            roles: userRoles
          },
          message: 'User details retrieved successfully'
        });
      } else {
        res.status(404).json({
          success: false,
          message: 'User not found'
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

  async createUser(req, res) {
    try {
      const { username, password, host = '%', roles = [] } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({
          success: false,
          message: 'Username and password are required'
        });
      }

      const createResult = await userRepository.createUser(username, password, host);
      
      if (!createResult.success) {
        return res.status(400).json({
          success: false,
          message: 'Failed to create user',
          error: createResult.error
        });
      }

      if (roles.length > 0) {
        for (const role of roles) {
          await userRepository.grantRoleToUser(role, username, host);
          await userRepository.setDefaultRole(role, username, host);
        }
      }

      await userRepository.flushPrivileges();

      res.status(201).json({
        success: true,
        message: 'User created successfully',
        data: { username, host, roles }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }

  async updateUserRoles(req, res) {
    try {
      const { username } = req.params;
      const { roles, host = '%' } = req.body;
      
      const currentRolesResult = await userRepository.getUserRoles(username, host);
      const currentRoles = currentRolesResult.success ? 
        currentRolesResult.data.map(role => role.role_name) : [];
      
      for (const role of currentRoles) {
        await userRepository.revokeRoleFromUser(role, username, host);
      }
      
      for (const role of roles) {
        await userRepository.grantRoleToUser(role, username, host);
      }
      
      if (roles.length > 0) {
        await userRepository.setDefaultRole(roles[0], username, host);
      }
      
      await userRepository.flushPrivileges();
      
      res.status(200).json({
        success: true,
        message: 'User roles updated successfully',
        data: { username, roles }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }

  async deleteUser(req, res) {
    try {
      const { username } = req.params;
      const { host = '%' } = req.body;
      
      const result = await userRepository.dropUser(username, host);
      
      if (result.success) {
        await userRepository.flushPrivileges();
        
        res.status(200).json({
          success: true,
          message: 'User deleted successfully'
        });
      } else {
        res.status(400).json({
          success: false,
          message: 'Failed to delete user',
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

  async changePassword(req, res) {
    try {
      const { username } = req.params;
      const { newPassword, host = '%' } = req.body;
      
      if (!newPassword) {
        return res.status(400).json({
          success: false,
          message: 'New password is required'
        });
      }
      
      const result = await userRepository.changeUserPassword(username, newPassword, host);
      
      if (result.success) {
        await userRepository.flushPrivileges();
        
        res.status(200).json({
          success: true,
          message: 'Password changed successfully'
        });
      } else {
        res.status(400).json({
          success: false,
          message: 'Failed to change password',
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

  async toggleUserLock(req, res) {
    try {
      const { username } = req.params;
      const { action, host = '%' } = req.body;
      
      let result;
      if (action === 'lock') {
        result = await userRepository.lockUser(username, host);
      } else if (action === 'unlock') {
        result = await userRepository.unlockUser(username, host);
      } else {
        return res.status(400).json({
          success: false,
          message: 'Invalid action. Use "lock" or "unlock"'
        });
      }
      
      if (result.success) {
        await userRepository.flushPrivileges();
        
        res.status(200).json({
          success: true,
          message: `User ${action}ed successfully`
        });
      } else {
        res.status(400).json({
          success: false,
          message: `Failed to ${action} user`,
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

module.exports = new UserController();