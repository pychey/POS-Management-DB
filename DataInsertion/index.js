
// =============================================================
// FILE: index.js
// =============================================================
// This is the main entry point of the application.

import express from 'express';
import { seedDatabase } from './seed.js';

// Express App Setup
const app = express();
const port = 3000;

// Express Route to Trigger Seeding
app.get('/seed', async (req, res) => {
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.write('<h1>Starting database seed process...</h1>');
    res.write('<p>This may take a moment. Check the server console for detailed progress.</p>');
    res.write('<pre>');

    try {
        const message = await seedDatabase();
        res.write(`\n${message}\n`);
        res.write('</pre><h2>✅ Seeding Complete!</h2>');
        res.end();
    } catch (error) {
        res.write(`\n❌ Error during seeding:\n${error.stack}\n`);
        res.write('</pre><h2>❌ Seeding Failed. Check console for details.</h2>');
        res.end();
    }
});

// Default route
app.get('/', (req, res) => {
    res.send(`
        <body style="font-family: sans-serif; text-align: center; padding-top: 50px;">
            <h1>POS Management DB Seeder</h1>
            <p>Click the link below to populate the database with fake data.</p>
            <a href="/seed" style="font-size: 1.2em; padding: 10px 20px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px;">
                Seed Database
            </a>
        </body>
    `);
});

// Start the Server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
    console.log(`Visit http://localhost:${port}/seed to start the database seeding.`);
});
