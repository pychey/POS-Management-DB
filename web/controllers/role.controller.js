import * as roleRepository from '../repositories/role.repository.js'

export const getRole = async (req, res) => {
    try {
        const rows = await roleRepository.getRole();
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export const createRole = async (req, res) => {
    const { roleName } = req.body;

    try {
        await roleRepository.createRole(roleName);
        res.json({ message: `Role ${roleName} created successfully` });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export const deleteRole = async (req, res) => {
    const { roleName } = req.params;

    try {        
        await roleRepository.deleteRole(roleName);
        res.json({ message: `Role ${roleName} deleted successfully` });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}