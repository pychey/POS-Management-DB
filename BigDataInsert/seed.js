
// =============================================================
// FILE: seed.js
// =============================================================
// This file contains the core logic for seeding the database.
// *** UPDATED TO RUN FROM THE COMMAND LINE FOR LARGE DATASETS ***

import { getDbConnection } from './model.js';
import { faker } from '@faker-js/faker';

// --- Name lists for data generation ---
const cambodianLastNames = [
    'Sok', 'Chan', 'Chea', 'Kim', 'Lim', 'Nhem', 'Pich', 'Mao', 'Vong', 'Ly', 'Heng', 'Keo', 'Ouk', 'So', 'Prak',
    'Seng', 'Chhay', 'Lay', 'Kouch', 'Tep', 'Sao', 'Kong', 'Chhoun', 'Yim', 'Duong', 'Srun', 'Sar', 'Men', 'Sam',
    'Chhem', 'Ngo', 'Phan', 'Rith', 'Thy', 'Sorn', 'Touch', 'Long', 'Him', 'Nop', 'Chhum', 'Chhuon', 'Srey',
    'Kheng', 'Moul', 'Nguon', 'Phath', 'Som', 'Sourn', 'Suon', 'Tang', 'Thach', 'Than', 'Thea', 'Un', 'Van',
    'Yin', 'Yon', 'Youk', 'An', 'Buth', 'Chorn', 'Hong', 'Huy', 'Kry', 'Leang', 'Luy', 'Meas', 'Moeun', 'Mony',
    'Neth', 'Nhek', 'Nhim', 'Oeun', 'Phat', 'Sarin', 'Sokun', 'Son', 'Soth', 'Sothea', 'Tann', 'Thorn', 'Uk'
];
const cambodianFirstNames = [
    'Bopha', 'Sophea', 'Veasna', 'Dara', 'Vibol', 'Chantha', 'SreyNeang', 'Kosal', 'Sokha', 'Rathana', 'Pisey',
    'Channary', 'Sokunthea', 'Visal', 'Sokly', 'Vannak', 'Leakhena', 'Sotheara', 'Phanith', 'Makara', 'Sreypov',
    'Sokheng', 'Sreymom', 'Sokhom', 'Sophorn', 'Chinda', 'Maly', 'Samnang', 'Narith', 'Vireak', 'Sokmean',
    'Sreyleak', 'Sokna', 'Sokun', 'Vicheka', 'Sophat', 'Sreyneth', 'Sokchea', 'Theary', 'Sreytouch', 'Sokphorn',
    'Sokha', 'Rady', 'Sokkea', 'Sreynoch', 'Sokchhay', 'Sokunthy', 'Sokhim', 'Sreypich', 'Sokleng', 'Sokla',
    'Soklin', 'Sokleang', 'Sokchheng', 'Sokcheng', 'Sokchhan', 'Sokchhin', 'Sokchhun', 'Sokchhy', 'Sokchy',
    'Sokden', 'Sokdeth', 'Sokdin', 'Sokha', 'Sokhan', 'Sokhem', 'Sokhen', 'Sokhet', 'Sokhin', 'Sokhom', 'Sokhon',
    'Sokhor', 'Sokhour', 'Sokhourn', 'Sokhuy', 'Sokim', 'Sokin', 'Sokun', 'Sokunthea', 'Sokunthy', 'Sokurt',
    'Sokuy', 'Sokvy', 'Sokyan', 'Sokyat', 'Sokyong', 'Sokyou', 'Sokyuth'
];


/**
 * Seeds a specified number of store clients.
 * @param {number} count - The number of clients to create.
 */
async function seedClients(count) {
    const connection = await getDbConnection();
    try {
        console.log(`Seeding ${count} store clients...`);
        const [pricingPlans] = await connection.execute('SELECT id FROM pricing');
        if (pricingPlans.length === 0) {
            console.error('Error: No pricing plans found. Please seed base data first with `node seed.js base`.');
            return;
        }

        for (let i = 0; i < count; i++) {
            const owner_name = `${faker.helpers.arrayElement(cambodianFirstNames)} ${faker.helpers.arrayElement(cambodianLastNames)}`;
            const store_name = faker.company.name();
            const email = faker.internet.email({ firstName: owner_name.split(' ')[0], lastName: owner_name.split(' ')[1] });
            const phone = `+855 ${faker.phone.number('1#-###-####')}`;
            const address = `${faker.location.streetAddress()}, Phnom Penh`;
            const randomPricingPlan = faker.helpers.arrayElement(pricingPlans);
            const activated_at = faker.date.past({ years: 3 });
            await connection.execute(
                'INSERT INTO store_client (store_name, owner_name, email, phone, address, pricing_id, activated_at) VALUES (?, ?, ?, ?, ?, ?, ?)',
                [store_name, owner_name, email, phone, address, randomPricingPlan.id, activated_at]
            );
            if ((i + 1) % 1000 === 0) {
                console.log(`Inserted ${i + 1} / ${count} clients...`);
            }
        }
        console.log(`✅ Successfully seeded ${count} store clients.`);
    } finally {
        await connection.end();
    }
}


/**
 * Seeds a specified number of transactions. For millions of records, this is the key function.
 * @param {number} count - The number of transactions to create.
 */
async function seedTransactions(count) {
    const connection = await getDbConnection();
    try {
        console.log(`Seeding ${count} transactions...`);
        // *** FIX: Changed 'id' to 'store_id' to match the database schema ***
        const [clients] = await connection.execute('SELECT store_id, activated_at FROM store_client');
        const [inventory] = await connection.execute('SELECT inventory_id, store_id, unit_price FROM store_inventory');

        if (clients.length === 0 || inventory.length === 0) {
            console.error('Error: No clients or inventory found. Please seed base data and clients first.');
            return;
        }

        // Group inventory by store for quick lookup
        const inventoryByStore = inventory.reduce((acc, item) => {
            if (!acc[item.store_id]) {
                acc[item.store_id] = [];
            }
            acc[item.store_id].push(item);
            return acc;
        }, {});


        for (let i = 0; i < count; i++) {
            const randomClient = faker.helpers.arrayElement(clients);
            // *** FIX: Changed 'randomClient.id' to 'randomClient.store_id' ***
            const clientInventory = inventoryByStore[randomClient.store_id];

            if (!clientInventory || clientInventory.length === 0) {
                continue; // Skip if this client has no inventory
            }

            const created_at = faker.date.between({ from: randomClient.activated_at, to: new Date() });
            const [transResult] = await connection.execute(
                'INSERT INTO store_transaction (store_id, created_at) VALUES (?, ?)',
                // *** FIX: Changed 'randomClient.id' to 'randomClient.store_id' ***
                [randomClient.store_id, created_at]
            );
            const transactionId = transResult.insertId;

            const itemsInTransaction = faker.number.int({ min: 1, max: 5 });
            const productsForTransaction = faker.helpers.arrayElements(clientInventory, itemsInTransaction);

            for (const product of productsForTransaction) {
                const quantity = faker.number.int({ min: 1, max: 3 });
                await connection.execute(
                    'INSERT INTO transaction_item (inventory_id, transaction_id, quantity, unit_price) VALUES (?, ?, ?, ?)',
                    [product.inventory_id, transactionId, quantity, product.unit_price]
                );
            }

            if ((i + 1) % 10000 === 0) {
                console.log(`Inserted ${i + 1} / ${count} transactions...`);
            }
        }
        console.log(`✅ Successfully seeded ${count} transactions.`);
    } finally {
        await connection.end();
    }
}


/**
 * Seeds the base data (POS systems, features, pricing). This is small and should be run first.
 */
export async function seedBaseData() {
    const connection = await getDbConnection();
    try {
        console.log('--- Seeding Base Data (Systems, Features, Pricing) ---');
        await connection.execute('SET FOREIGN_KEY_CHECKS = 0;');
        await connection.execute('TRUNCATE TABLE system_feature');
        await connection.execute('TRUNCATE TABLE pricing');
        await connection.execute('TRUNCATE TABLE pos_feature');
        await connection.execute('TRUNCATE TABLE pos_system');
        await connection.execute('SET FOREIGN_KEY_CHECKS = 1;');

        // Seed POS Systems
        const posSystems = [];
        const numPosSystems = faker.number.int({ min: 2, max: 5 });
        for (let i = 0; i < numPosSystems; i++) {
            const name = `RetailPro ${faker.commerce.productAdjective()} v${faker.number.int({min:1, max:4})}.0`;
            const [result] = await connection.execute('INSERT INTO pos_system (name, description) VALUES (?, ?)', [name, faker.lorem.sentence()]);
            posSystems.push({ id: result.insertId });
        }
        console.log(`${posSystems.length} POS systems seeded.`);

        // Seed POS Features
        const posFeatures = [];
        const featureNames = ['Inventory Management', 'Sales Analytics', 'CRM', 'Employee Management', 'E-commerce', 'Multi-Store', 'Barcode Scanning', 'Offline Mode', 'Custom Receipts', 'Loyalty Program'];
        for (const featureName of featureNames) {
            const [result] = await connection.execute('INSERT INTO pos_feature (feature_name, description) VALUES (?, ?)', [featureName, faker.lorem.words(5)]);
            posFeatures.push(result.insertId);
        }
        console.log(`${posFeatures.length} POS features seeded.`);

        // Link features to systems
        for (const pos of posSystems) {
            const featuresToLink = faker.helpers.arrayElements(posFeatures, faker.number.int({ min: 3, max: 8 }));
            for (const featureId of featuresToLink) {
                await connection.execute('INSERT INTO system_feature (pos_id, feature_id) VALUES (?, ?)', [pos.id, featureId]);
            }
        }

        // Seed Pricing Plans
        const planNamePool = ['Starter', 'Growth', 'Business', 'Scale'];
        for (const pos of posSystems) {
            const numPlansForPos = faker.number.int({ min: 1, max: 4 });
            const planNamesToUse = faker.helpers.arrayElements(planNamePool, numPlansForPos);
            for (const planName of planNamesToUse) {
                await connection.execute(
                    'INSERT INTO pricing (pos_id, plan_name, price_per_month, features_summary) VALUES (?, ?, ?, ?)',
                    [pos.id, planName, faker.commerce.price({ min: 19, max: 249, dec: 2 }), `Includes ${faker.number.int({min:3, max:8})} features.`]
                );
            }
        }
        console.log(`Pricing plans seeded.`);
        console.log('✅ Base data seeded successfully.');
    } finally {
        await connection.end();
    }
}

/**
 * Seeds inventory for every existing client.
 */
async function seedAllInventory() {
    const connection = await getDbConnection();
    try {
        console.log('Seeding inventory for all clients...');
        await connection.execute('TRUNCATE TABLE store_inventory');
        // *** FIX: Changed 'id' to 'store_id' to match the database schema ***
        const [clients] = await connection.execute('SELECT store_id FROM store_client');

        if (clients.length === 0) {
            console.error('No clients found. Please seed clients first.');
            return;
        }

        for (const client of clients) {
            const productCount = faker.number.int({ min: 50, max: 300 });
            for (let i = 0; i < productCount; i++) {
                await connection.execute(
                    'INSERT INTO store_inventory (store_id, product_name, barcode, quantity, unit_price) VALUES (?, ?, ?, ?, ?)',
                    // *** FIX: Changed 'client.id' to 'client.store_id' ***
                    [client.store_id, faker.commerce.productName(), faker.string.alphanumeric(12).toUpperCase(), faker.number.int({ min: 0, max: 200 }), faker.commerce.price({ min: 1, max: 500, dec: 2 })]
                );
            }
        }
        console.log(`✅ Inventory seeded for ${clients.length} clients.`);
    } finally {
        await connection.end();
    }
}


// --- Command-Line Interface (CLI) Handler ---
const args = process.argv.slice(2);
const command = args[0];
const count = parseInt(args[1], 10);

(async () => {
    if (command === 'base') {
        await seedBaseData();
    } else if (command === 'clients' && count > 0) {
        await seedClients(count);
    } else if (command === 'inventory') {
        await seedAllInventory();
    } else if (command === 'transactions' && count > 0) {
        await seedTransactions(count);
    } else {
        console.log('--- POS Seeder CLI ---');
        console.log('Usage: node seed.js <command> [count]');
        console.log('\nCommands:');
        console.log('  base              - Seeds the small, essential data (systems, features, pricing). RUN THIS FIRST.');
        console.log('  clients <count>   - Seeds a specified number of store clients (e.g., 10000).');
        console.log('  inventory         - Seeds inventory for ALL existing clients.');
        console.log('  transactions <count> - Seeds a large number of transactions (e.g., 1000000).');
    }
})();

