import * as tableRepository from '../repositories/table.repository.js'

export const getTables = async (req, res) => {
    try {
        const rows = await tableRepository.getTable();
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}