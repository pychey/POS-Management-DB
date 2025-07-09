// server.js

// 1. Import Dependencies
// =============================================================
import express from 'express';
import mysql from 'mysql2/promise';
import { faker } from '@faker-js/faker';

// 2. Express App Setup
// =============================================================
const app = express();
const port = 3000;

// 3. MySQL Database Connection Configuration
// =============================================================
// IMPORTANT: Replace with your actual MySQL connection details.
const dbConfig = {
    host: 'localhost', // or your database host
    user: 'root',      // your database username
    password: '',  // your database password
    database: 'pos_management_db'
};

// Helper function to get a database connection
async function getDbConnection() {
    try {
        const connection = await mysql.createConnection(dbConfig);
        console.log("Successfully connected to the database.");
        return connection;
    } catch (error) {
        console.error("Error connecting to the database:", error);
        throw error; // Re-throw the error to be caught by the caller
    }
}


// 4. Seeding Logic
// =============================================================
/**
 * Main function to seed the entire database.
 * It inserts data in a specific order to maintain referential integrity.
 */
async function seedDatabase() {
    let connection;
    try {
        connection = await getDbConnection();
        await connection.beginTransaction(); // Start a transaction

        console.log('--- Starting Database Seeding ---');

        // Clear existing data in the correct order to avoid foreign key constraint issues
        console.log('Clearing existing data...');
        await connection.execute('SET FOREIGN_KEY_CHECKS = 0;');
        await connection.execute('TRUNCATE TABLE system_feature');
        await connection.execute('TRUNCATE TABLE transaction_item');
        await connection.execute('TRUNCATE TABLE store_transaction');
        await connection.execute('TRUNCATE TABLE store_inventory');
        await connection.execute('TRUNCATE TABLE pos_sale');
        await connection.execute('TRUNCATE TABLE store_client');
        await connection.execute('TRUNCATE TABLE pricing');
        await connection.execute('TRUNCATE TABLE pos_feature');
        await connection.execute('TRUNCATE TABLE pos_system');
        await connection.execute('SET FOREIGN_KEY_CHECKS = 1;');
        console.log('Data cleared.');


        // --- 1. Seed POS Systems ---
        console.log('Seeding pos_system...');
        const posSystems = [];
        for (let i = 0; i < 3; i++) {
            const name = `RetailMaster POS ${faker.commerce.productAdjective()}`;
            const description = faker.lorem.sentence();
            const [result] = await connection.execute(
                'INSERT INTO pos_system (name, description) VALUES (?, ?)',
                [name, description]
            );
            posSystems.push(result.insertId);
        }
        console.log(`${posSystems.length} POS systems seeded.`);


        // --- 2. Seed POS Features ---
        console.log('Seeding pos_feature...');
        const posFeatures = [];
        const featureNames = [
            'Inventory Management', 'Sales Analytics', 'Customer Relationship Management',
            'Employee Management', 'E-commerce Integration', 'Multi-Store Support',
            'Barcode Scanning', 'Offline Mode', 'Customizable Receipts'
        ];
        for (const featureName of featureNames) {
            const description = faker.lorem.words(10);
            const [result] = await connection.execute(
                'INSERT INTO pos_feature (feature_name, description) VALUES (?, ?)',
                [featureName, description]
            );
            posFeatures.push(result.insertId);
        }
        console.log(`${posFeatures.length} POS features seeded.`);


        // --- 3. Link POS Systems with Features (system_feature) ---
        console.log('Seeding system_feature...');
        let systemFeatureLinks = 0;
        for (const posId of posSystems) {
            // Each POS gets 3 to 5 random features
            const featuresToLink = faker.helpers.arrayElements(posFeatures, faker.number.int({ min: 3, max: 5 }));
            for (const featureId of featuresToLink) {
                await connection.execute(
                    'INSERT INTO system_feature (pos_id, feature_id) VALUES (?, ?)',
                    [posId, featureId]
                );
                systemFeatureLinks++;
            }
        }
        console.log(`${systemFeatureLinks} system-feature links created.`);


        // --- 4. Seed Pricing Plans ---
        console.log('Seeding pricing...');
        const pricingPlans = [];
        const planNames = ['Basic', 'Pro', 'Enterprise'];
        for (const posId of posSystems) {
            for (let i = 0; i < planNames.length; i++) {
                const plan_name = planNames[i];
                const price_per_month = faker.commerce.price({ min: 29, max: 199, dec: 2 });
                const features_summary = `Includes ${i + 3} key features.`;
                const [result] = await connection.execute(
                    'INSERT INTO pricing (pos_id, plan_name, price_per_month, features_summary) VALUES (?, ?, ?, ?)',
                    [posId, plan_name, price_per_month, features_summary]
                );
                pricingPlans.push(result.insertId);
            }
        }
        console.log(`${pricingPlans.length} pricing plans seeded.`);


        // --- 5. Seed Store Clients ---
        console.log('Seeding store_client...');
        const storeClients = [];
        for (let i = 0; i < 50; i++) {
            const store_name = faker.company.name();
            const owner_name = faker.person.fullName();
            const email = faker.internet.email();
            const phone = faker.phone.number();
            const address = `${faker.location.streetAddress()}, ${faker.location.city()}`;
            const pricing_id = faker.helpers.arrayElement(pricingPlans);
            const activated_at = faker.date.past({ years: 2 });

            const [result] = await connection.execute(
                'INSERT INTO store_client (store_name, owner_name, email, phone, address, pricing_id, activated_at) VALUES (?, ?, ?, ?, ?, ?, ?)',
                [store_name, owner_name, email, phone, address, pricing_id, activated_at]
            );
            storeClients.push(result.insertId);
        }
        console.log(`${storeClients.length} store clients seeded.`);


        // --- 6. Seed POS Sales ---
        console.log('Seeding pos_sale...');
        let posSalesCount = 0;
        for (const storeId of storeClients) {
            // Get the pricing plan for this store
            const [[store]] = await connection.execute('SELECT pricing_id FROM store_client WHERE store_id = ?', [storeId]);
            const [[pricing]] = await connection.execute('SELECT pos_id, price_per_month FROM pricing WHERE pricing_id = ?', [store.pricing_id]);

            const sale_date = faker.date.past({ years: 1, refDate: store.activated_at });
            await connection.execute(
                'INSERT INTO pos_sale (store_id, pos_id, pricing_id, amount, sale_date) VALUES (?, ?, ?, ?, ?)',
                [storeId, pricing.pos_id, store.pricing_id, pricing.price_per_month, sale_date]
            );
            posSalesCount++;
        }
        console.log(`${posSalesCount} POS sales seeded.`);


        // --- 7. Seed Store Inventory ---
        console.log('Seeding store_inventory...');
        const inventoryItems = {}; // { store_id: [inventory_id_1, ...] }
        for (const storeId of storeClients) {
            inventoryItems[storeId] = [];
            // Each store has between 50 and 200 different products
            const productCount = faker.number.int({ min: 50, max: 200 });
            for (let i = 0; i < productCount; i++) {
                const product_name = faker.commerce.productName();
                const barcode = faker.string.alphanumeric(12).toUpperCase();
                const quantity = faker.number.int({ min: 10, max: 200 });
                const unit_price = faker.commerce.price({ min: 1, max: 500, dec: 2 });

                const [result] = await connection.execute(
                    'INSERT INTO store_inventory (store_id, product_name, barcode, quantity, unit_price) VALUES (?, ?, ?, ?, ?)',
                    [storeId, product_name, barcode, quantity, unit_price]
                );
                inventoryItems[storeId].push(result.insertId);
            }
        }
        console.log(`Inventory seeded for ${storeClients.length} stores.`);


        // --- 8. Seed Store Transactions and Transaction Items ---
        console.log('Seeding store_transactions and transaction_items...');
        let totalTransactions = 0;
        let totalTransactionItems = 0;
        for (const storeId of storeClients) {
            // Each store has between 100 and 500 transactions
            const transactionCount = faker.number.int({ min: 100, max: 500 });
            for (let i = 0; i < transactionCount; i++) {
                const created_at = faker.date.recent({ days: 365 });
                const [transResult] = await connection.execute(
                    'INSERT INTO store_transaction (store_id, created_at) VALUES (?, ?)',
                    [storeId, created_at]
                );
                const transactionId = transResult.insertId;
                totalTransactions++;

                // Each transaction has 1 to 5 items
                const itemsInTransaction = faker.number.int({ min: 1, max: 5 });
                const productsForTransaction = faker.helpers.arrayElements(inventoryItems[storeId], itemsInTransaction);

                for (const inventoryId of productsForTransaction) {
                    const [[item]] = await connection.execute('SELECT unit_price FROM store_inventory WHERE inventory_id = ?', [inventoryId]);
                    const quantity = faker.number.int({ min: 1, max: 3 });
                    await connection.execute(
                        'INSERT INTO transaction_item (inventory_id, transaction_id, quantity, unit_price) VALUES (?, ?, ?, ?)',
                        [inventoryId, transactionId, quantity, item.unit_price]
                    );
                    totalTransactionItems++;
                }
            }
        }
        console.log(`${totalTransactions} transactions and ${totalTransactionItems} transaction items seeded.`);


        await connection.commit(); // Commit the transaction
        console.log('--- Database Seeding Completed Successfully! ---');
        return "Database seeded successfully!";

    } catch (error) {
        console.error('--- Database Seeding Failed ---');
        console.error(error);
        if (connection) {
            await connection.rollback(); // Rollback on error
            console.log('Transaction rolled back.');
        }
        throw error;
    } finally {
        if (connection) {
            await connection.end(); // Close the connection
            console.log('Database connection closed.');
        }
    }
}


// 5. Express Route to Trigger Seeding
// =============================================================
app.get('/seed', async (req, res) => {
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.write('<h1>Starting database seed process...</h1>');
    res.write('<p>This may take a moment. Check the console for detailed progress.</p>');
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


// 6. Start the Server
// =============================================================
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
    console.log(`Visit http://localhost:${port}/seed to start the database seeding.`);
});
