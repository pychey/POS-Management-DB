// =============================================================
// FILE: index.js
// =============================================================
// This is the main entry point of the application.
// *** UPDATED TO RUN A SMALL SAMPLE SEED AND GUIDE USER TO CLI ***

import express from 'express';
import { seedBaseData } from './seed.js'; // We only need the base seeder here now

// Express App Setup
const app = express();
const port = 3000;

// Express Route to Trigger a SMALL, SAFE Seeding for testing
app.get('/seed', async (req, res) => {
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.write('<h1>Starting BASE data seed process...</h1>');
    res.write('<p>This will seed a small amount of safe data (Systems, Features, Pricing). Check the console for progress.</p>');
    res.write('<h3>For large data insertion (millions of records), please use the command-line tool. See README.md for instructions.</h3>');
    res.write('<pre>');

    try {
        // Only run the small, fast base seeder from the web
        await seedBaseData();
        res.write('\nBase data seeded successfully!\n');
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
            <p>Click the link below to populate the database with a small sample of base data.</p>
            <a href="/seed" style="font-size: 1.2em; padding: 10px 20px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px;">
                Seed Base Data
            </a>
            <p style="margin-top: 20px;">For generating millions of records, please use the command-line interface.</p>
        </body>
    `);
});

// Start the Server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
    console.log('Visit http://localhost:3000/seed to run a small sample seed.');
    console.log('Use `node seed.js` in your terminal for large-scale seeding options.');
});
