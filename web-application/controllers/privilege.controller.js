import * as privilegeRepository from '../repositories/privilege.repository.js'

export const getPrivilegeForRole = async (req, res) => {
    const role = req.params.role;

    try {
        const rows = await privilegeRepository.getPrivilegeForRole(role);
        res.json(rows.map(row => row.privilege));
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export const grantPrivilegeToRole = async (req, res) => {
    const { role, table, privileges } = req.body;
    const privilegeString = privileges.join(', ');
    const tableName = `pos_management_db.${table}`;

    try {
        await privilegeRepository.grantPrivilegeToRole(role, tableName, privilegeString);
        res.json({ message: `Privileges ${privilegeString} granted to role ${role} on table ${table}` });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}