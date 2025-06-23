const express = require('express');
const userController = require('../controllers/userController');
const roleController = require('../controllers/roleController');

const router = express.Router();

// User routes
router.get('/users', userController.getAllUsers);
router.get('/users/:username', userController.getUserByUsername);
router.post('/users', userController.createUser);
router.put('/users/:username/roles', userController.updateUserRoles);
router.put('/users/:username/password', userController.changePassword);
router.put('/users/:username/lock', userController.toggleUserLock);
router.delete('/users/:username', userController.deleteUser);

// Role routes
router.get('/roles', roleController.getAllRoles);
router.get('/roles/:roleName', roleController.getRoleDetails);
router.post('/roles', roleController.createRole);
router.delete('/roles/:roleName', roleController.deleteRole);
router.post('/roles/:roleName/privileges', roleController.grantPrivilege);
router.delete('/roles/:roleName/privileges', roleController.revokePrivilege);

// Utility routes
router.get('/privileges', roleController.getAvailablePrivileges);
router.get('/databases', roleController.getAllDatabases);