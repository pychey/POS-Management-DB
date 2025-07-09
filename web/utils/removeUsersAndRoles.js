import mysql from "mysql2/promise";

// Security At Its Highest Form

const pool = mysql.createPool({
    host: 'maglev.proxy.rlwy.net',
    user: 'root',
    password: 'zfZikcmJmTfiQOQKwToHWSJbaxBpmCpW',
    database: 'pos_management_db',
    port: 41425,
    multipleStatements: true
});

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