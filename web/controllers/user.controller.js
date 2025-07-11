import * as userRepository from '../repositories/user.repository.js'

export const getUsers = async (req, res) => {
    try {
        const rows = await userRepository.getUser();
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const createUser = async (req, res) => {
    const { username, password, host, role } = req.body;

    try {
        await userRepository.createUser(username, password, host, role);
        
        const message = role 
            ? `User ${username} created successfully with role ${role}`
            : `User ${username} created successfully without role`;
            
        res.json({ message });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export const grantRoleToUser = async (req, res) => {
    const { username, host } = req.params;
    const { newRole } = req.body;

    try {
        await userRepository.grantRoleToUser(username, host, newRole);
        res.json({ message: `Role ${newRole} granted to user ${username}@${host}` });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export const revokeRoleFromUser = async (req, res) => {
    const { username, host } = req.params;
    const { role } = req.body;

    try {
        await userRepository.revokeRoleFromUser(username, host, role);
        res.json({ message: `Role ${role} revoked from user ${username}@${host}` });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export const updateUser = async (req, res) => {
    const { username, host } = req.params;
    const { newRole } = req.body;

    try {
        await userRepository.updateUser(username, host, newRole);
        res.json({ message: `User ${username} role updated to ${newRole}` });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export const deleteUser = async (req, res) => {
    const { username, host } = req.params;

    try {
        userRepository.deleteUser(username, host);
        res.json({ message: `User ${username}@${host} deleted successfully` });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}