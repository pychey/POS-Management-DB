import mysql from "mysql2/promise";

export const testUserConnection = async (req, res) => {
    const { username, host, password } = req.body;
    
    try {
        const testConnection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: username,
            password: password,
            database: process.env.DB_NAME,
            port: process.env.DB_PORT
        });
        
        await testConnection.connect();
        await testConnection.end();
        
        res.json({ success: true, message: `Successfully connected as ${username}@${host}` });
    } catch (error) {
        res.json({ success: false, error: error.message });
    }
};

export const testUserOperation = async (req, res) => {
    const { username, password, operation, table, data } = req.body;
    
    try {
        const testConnection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: username,
            password: password,
            database: process.env.DB_NAME,
            port: process.env.DB_PORT
        });
        
        await testConnection.connect();
        
        let result;
        switch (operation) {
            case 'SELECT':
                [result] = await testConnection.query(`SELECT * FROM ${table} LIMIT 5`);
                break;
            case 'INSERT':
                await testConnection.query(`INSERT INTO ${table} () VALUES ()`);
                result = 'INSERT successful';
                break;
            case 'UPDATE':
                await testConnection.query(`UPDATE ${table} SET dummy_column = 'test' WHERE 1=0`);
                result = 'UPDATE successful';
                break;
            case 'DELETE':
                await testConnection.query(`DELETE FROM ${table} WHERE 1=0`);
                result = 'DELETE successful';
                break;
            case 'CREATE':
                await testConnection.query(`CREATE TABLE ${table} (id INT)`);
                result = 'CREATE TABLE successful';
                break;
            default:
                throw new Error('Unknown operation');
        }
        
        await testConnection.end();
        res.json({ success: true, message: `${operation} operation successful` });
        
    } catch (error) {
        if (error.message.includes('denied')) return res.status(403).json({ success: false, error: error.message });
        res.json({ success: true, message: `Non-permission error occurred: ${error.message}`});
    }
};