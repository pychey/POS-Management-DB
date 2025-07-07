import pool from './database.js';

const removeUsersAndRoles = async () => {
    const [rows] = await pool.execute(`
        SELECT CONCAT('DROP USER \`', user, '\`@\`', host, '\`;') AS Drop_Statement
        FROM mysql.user
        WHERE user NOT IN (
            'mysql.infoschema',
            'mysql.session',
            'mysql.sys',
            'root'
        );
    `);
    
    for (const row of rows) await pool.execute(row.Drop_Statement);

    console.log(rows);
}

removeUsersAndRoles();