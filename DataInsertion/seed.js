
// // =============================================================
// // FILE: seed.js
// // =============================================================
// // This file contains the core logic for seeding the database.

// import { getDbConnection } from './model.js';
// import { faker } from '@faker-js/faker';

// /**
//  * Main function to seed the entire database.
//  * It clears existing data and inserts new fake data in the correct order
//  * to maintain referential integrity.
//  * @returns {Promise<string>} A promise that resolves to a success message.
//  */
// export async function seedDatabase() {
//     let connection;
//     try {
//         connection = await getDbConnection();
//         await connection.beginTransaction(); // Start a transaction

//         console.log('--- Starting Database Seeding ---');

//         // Clear existing data
//         console.log('Clearing existing data...');
//         await connection.execute('SET FOREIGN_KEY_CHECKS = 0;');
//         await connection.execute('TRUNCATE TABLE system_feature');
//         await connection.execute('TRUNCATE TABLE transaction_item');
//         await connection.execute('TRUNCATE TABLE store_transaction');
//         await connection.execute('TRUNCATE TABLE store_inventory');
//         await connection.execute('TRUNCATE TABLE pos_sale');
//         await connection.execute('TRUNCATE TABLE store_client');
//         await connection.execute('TRUNCATE TABLE pricing');
//         await connection.execute('TRUNCATE TABLE pos_feature');
//         await connection.execute('TRUNCATE TABLE pos_system');
//         await connection.execute('SET FOREIGN_KEY_CHECKS = 1;');
//         console.log('Data cleared.');

//         // --- 1. Seed POS Systems ---
//         console.log('Seeding pos_system...');
//         const posSystems = [];
//         for (let i = 0; i < 3; i++) {
//             const name = `RetailMaster POS ${faker.commerce.productAdjective()}`;
//             const description = faker.lorem.sentence();
//             const [result] = await connection.execute(
//                 'INSERT INTO pos_system (name, description) VALUES (?, ?)',
//                 [name, description]
//             );
//             posSystems.push(result.insertId);
//         }
//         console.log(`${posSystems.length} POS systems seeded.`);

//         // --- 2. Seed POS Features ---
//         console.log('Seeding pos_feature...');
//         const posFeatures = [];
//         const featureNames = [
//             'Inventory Management', 'Sales Analytics', 'Customer Relationship Management',
//             'Employee Management', 'E-commerce Integration', 'Multi-Store Support',
//             'Barcode Scanning', 'Offline Mode', 'Customizable Receipts'
//         ];
//         for (const featureName of featureNames) {
//             const description = faker.lorem.words(10);
//             const [result] = await connection.execute(
//                 'INSERT INTO pos_feature (feature_name, description) VALUES (?, ?)',
//                 [featureName, description]
//             );
//             posFeatures.push(result.insertId);
//         }
//         console.log(`${posFeatures.length} POS features seeded.`);

//         // --- 3. Link POS Systems with Features (system_feature) ---
//         console.log('Seeding system_feature...');
//         let systemFeatureLinks = 0;
//         for (const posId of posSystems) {
//             const featuresToLink = faker.helpers.arrayElements(posFeatures, faker.number.int({ min: 3, max: 5 }));
//             for (const featureId of featuresToLink) {
//                 await connection.execute(
//                     'INSERT INTO system_feature (pos_id, feature_id) VALUES (?, ?)',
//                     [posId, featureId]
//                 );
//                 systemFeatureLinks++;
//             }
//         }
//         console.log(`${systemFeatureLinks} system-feature links created.`);

//         // --- 4. Seed Pricing Plans ---
//         console.log('Seeding pricing...');
//         const pricingPlans = [];
//         const planNames = ['Basic', 'Pro', 'Enterprise'];
//         for (const posId of posSystems) {
//             for (let i = 0; i < planNames.length; i++) {
//                 const plan_name = planNames[i];
//                 const price_per_month = faker.commerce.price({ min: 29, max: 199, dec: 2 });
//                 const features_summary = `Includes ${i + 3} key features.`;
//                 const [result] = await connection.execute(
//                     'INSERT INTO pricing (pos_id, plan_name, price_per_month, features_summary) VALUES (?, ?, ?, ?)',
//                     [posId, plan_name, price_per_month, features_summary]
//                 );
//                 pricingPlans.push(result.insertId);
//             }
//         }
//         console.log(`${pricingPlans.length} pricing plans seeded.`);

//         // --- 5. Seed Store Clients ---
//         console.log('Seeding store_client...');
//         const storeClients = [];
//         for (let i = 0; i < 50; i++) {
//             const store_name = faker.company.name();
//             const owner_name = faker.person.fullName();
//             const email = faker.internet.email();
//             const phone = faker.phone.number();
//             const address = `${faker.location.streetAddress()}, ${faker.location.city()}`;
//             const pricing_id = faker.helpers.arrayElement(pricingPlans);
//             const activated_at = faker.date.past({ years: 2 });
//             const [result] = await connection.execute(
//                 'INSERT INTO store_client (store_name, owner_name, email, phone, address, pricing_id, activated_at) VALUES (?, ?, ?, ?, ?, ?, ?)',
//                 [store_name, owner_name, email, phone, address, pricing_id, activated_at]
//             );
//             storeClients.push(result.insertId);
//         }
//         console.log(`${storeClients.length} store clients seeded.`);

//         // --- 6. Seed POS Sales ---
//         console.log('Seeding pos_sale...');
//         let posSalesCount = 0;
//         for (const storeId of storeClients) {
//             const [[store]] = await connection.execute('SELECT pricing_id, activated_at FROM store_client WHERE store_id = ?', [storeId]);
//             const [[pricing]] = await connection.execute('SELECT pos_id, price_per_month FROM pricing WHERE pricing_id = ?', [store.pricing_id]);
//             const sale_date = faker.date.past({ years: 1, refDate: store.activated_at });
//             await connection.execute(
//                 'INSERT INTO pos_sale (store_id, pos_id, pricing_id, amount, sale_date) VALUES (?, ?, ?, ?, ?)',
//                 [storeId, pricing.pos_id, store.pricing_id, pricing.price_per_month, sale_date]
//             );
//             posSalesCount++;
//         }
//         console.log(`${posSalesCount} POS sales seeded.`);

//         // --- 7. Seed Store Inventory ---
//         console.log('Seeding store_inventory...');
//         const inventoryItems = {};
//         for (const storeId of storeClients) {
//             inventoryItems[storeId] = [];
//             const productCount = faker.number.int({ min: 50, max: 200 });
//             for (let i = 0; i < productCount; i++) {
//                 const product_name = faker.commerce.productName();
//                 const barcode = faker.string.alphanumeric(12).toUpperCase();
//                 const quantity = faker.number.int({ min: 10, max: 200 });
//                 const unit_price = faker.commerce.price({ min: 1, max: 500, dec: 2 });
//                 const [result] = await connection.execute(
//                     'INSERT INTO store_inventory (store_id, product_name, barcode, quantity, unit_price) VALUES (?, ?, ?, ?, ?)',
//                     [storeId, product_name, barcode, quantity, unit_price]
//                 );
//                 inventoryItems[storeId].push(result.insertId);
//             }
//         }
//         console.log(`Inventory seeded for ${storeClients.length} stores.`);

//         // --- 8. Seed Store Transactions and Transaction Items ---
//         console.log('Seeding store_transactions and transaction_items...');
//         let totalTransactions = 0;
//         let totalTransactionItems = 0;
//         for (const storeId of storeClients) {
//             const transactionCount = faker.number.int({ min: 100, max: 500 });
//             for (let i = 0; i < transactionCount; i++) {
//                 const created_at = faker.date.recent({ days: 365 });
//                 const [transResult] = await connection.execute(
//                     'INSERT INTO store_transaction (store_id, created_at) VALUES (?, ?)',
//                     [storeId, created_at]
//                 );
//                 const transactionId = transResult.insertId;
//                 totalTransactions++;

//                 const itemsInTransaction = faker.number.int({ min: 1, max: 5 });
//                 const productsForTransaction = faker.helpers.arrayElements(inventoryItems[storeId], itemsInTransaction);

//                 for (const inventoryId of productsForTransaction) {
//                     const [[item]] = await connection.execute('SELECT unit_price FROM store_inventory WHERE inventory_id = ?', [inventoryId]);
//                     const quantity = faker.number.int({ min: 1, max: 3 });
//                     await connection.execute(
//                         'INSERT INTO transaction_item (inventory_id, transaction_id, quantity, unit_price) VALUES (?, ?, ?, ?)',
//                         [inventoryId, transactionId, quantity, item.unit_price]
//                     );
//                     totalTransactionItems++;
//                 }
//             }
//         }
//         console.log(`${totalTransactions} transactions and ${totalTransactionItems} transaction items seeded.`);

//         await connection.commit();
//         console.log('--- Database Seeding Completed Successfully! ---');
//         return "Database seeded successfully!";

//     } catch (error) {
//         console.error('--- Database Seeding Failed ---');
//         console.error(error);
//         if (connection) {
//             await connection.rollback();
//             console.log('Transaction rolled back.');
//         }
//         throw error;
//     } finally {
//         if (connection) {
//             await connection.end();
//             console.log('Database connection closed.');
//         }
//     }
// }





// =============================================================
// FILE: seed.js
// =============================================================
// This file contains the core logic for seeding the database.
// *** UPDATED WITH COMMENTS FOR EASY CUSTOMIZATION ***

import { getDbConnection } from './model.js';
import { faker } from '@faker-js/faker';

/**
 * Main function to seed the entire database.
 * It clears existing data and inserts new fake data in the correct order
 * to maintain referential integrity.
 * @returns {Promise<string>} A promise that resolves to a success message.
 */
export async function seedDatabase() {
    let connection;
    try {
        connection = await getDbConnection();
        await connection.beginTransaction(); // Start a transaction

        console.log('--- Starting Database Seeding ---');

        // Clear existing data
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

        // // --- CHANGE HERE: Customize the names used for data generation ---
        // const cambodianLastNames = ['Sok', 'Chan', 'Chea', 'Kim', 'Lim', 'Nhem', 'Pich', 'Mao', 'Vong'];
        // const cambodianFirstNames = ['Bopha', 'Sophea', 'Veasna', 'Dara', 'Vibol', 'Chantha', 'SreyNeang', 'Kosal', 'Sokha'];
 // --- CHANGE HERE: Customize the names used for data generation ---
        // *** NEW: Expanded list of names for more variety ***
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

        // --- 1. Seed POS Systems ---
        console.log('Seeding pos_system...');
        const posSystems = [];
        // --- CHANGE HERE: Adjust the min/max number of POS systems to create ---
        const numPosSystems = faker.number.int({ min: 2, max: 5 });
        for (let i = 0; i < numPosSystems; i++) {
            const name = `RetailPro ${faker.commerce.productAdjective()} v${faker.number.int({min:1, max:4})}.0`;
            const description = faker.lorem.sentence();
            const [result] = await connection.execute(
                'INSERT INTO pos_system (name, description) VALUES (?, ?)',
                [name, description]
            );
            posSystems.push({ id: result.insertId, name: name });
        }
        console.log(`${posSystems.length} POS systems seeded.`);

        // --- 2. Seed POS Features ---
        console.log('Seeding pos_feature...');
        const posFeatures = [];
        // --- CHANGE HERE: Add, remove, or edit the possible feature names ---
        const featureNames = [
            'Inventory Management', 'Sales Analytics', 'Customer Relationship Management',
            'Employee Management', 'E-commerce Integration', 'Multi-Store Support',
            'Barcode Scanning', 'Offline Mode', 'Customizable Receipts', 'Loyalty Program',
            'Reporting Tools', 'Tax Management', 'Mobile Access', 'Kitchen Display System'
        ];
        // --- CHANGE HERE: Adjust the min/max number of features to select from the list above ---
        const featuresToCreate = faker.helpers.arrayElements(featureNames, faker.number.int({ min: 8, max: featureNames.length }));
        for (const featureName of featuresToCreate) {
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
        for (const pos of posSystems) {
            // --- CHANGE HERE: Adjust the min/max number of features to link to each POS system ---
            const featuresToLink = faker.helpers.arrayElements(posFeatures, faker.number.int({ min: 3, max: 8 }));
            for (const featureId of featuresToLink) {
                await connection.execute(
                    'INSERT INTO system_feature (pos_id, feature_id) VALUES (?, ?)',
                    [pos.id, featureId]
                );
                systemFeatureLinks++;
            }
        }
        console.log(`${systemFeatureLinks} system-feature links created.`);

        // --- 4. Seed Pricing Plans ---
        console.log('Seeding pricing...');
        const pricingPlans = [];
        // --- CHANGE HERE: Add, remove, or edit the possible pricing plan names ---
        const planNamePool = ['Starter', 'Growth', 'Business', 'Scale', 'Ultimate', 'Premium', 'Standard'];
        for (const pos of posSystems) {
            // --- CHANGE HERE: Adjust the min/max number of pricing plans for each POS system ---
            const numPlansForPos = faker.number.int({ min: 1, max: 4 });
            const planNamesToUse = faker.helpers.arrayElements(planNamePool, numPlansForPos);
            for (const planName of planNamesToUse) {
                const price_per_month = faker.commerce.price({ min: 19, max: 249, dec: 2 });
                const features_summary = `Includes ${faker.number.int({min:3, max:8})} key features.`;
                const [result] = await connection.execute(
                    'INSERT INTO pricing (pos_id, plan_name, price_per_month, features_summary) VALUES (?, ?, ?, ?)',
                    [pos.id, planName, price_per_month, features_summary]
                );
                pricingPlans.push({ id: result.insertId, pos_id: pos.id, price: price_per_month });
            }
        }
        console.log(`${pricingPlans.length} pricing plans seeded.`);

        // --- 5. Seed Store Clients ---
        console.log('Seeding store_client...');
        const storeClients = [];
        // --- CHANGE HERE: Adjust the min/max number of store clients to create ---
        const numClients = faker.number.int({ min: 40, max: 75 });
        for (let i = 0; i < numClients; i++) {
            // --- CHANGE HERE: Customize how client data is generated ---
            const owner_name = `${faker.helpers.arrayElement(cambodianFirstNames)} ${faker.helpers.arrayElement(cambodianLastNames)}`;
            const store_name = faker.company.name();
            const email = faker.internet.email({ firstName: owner_name.split(' ')[0], lastName: owner_name.split(' ')[1] });
            const phone = `+855 ${faker.phone.number('1#-###-####')}`; // Cambodia phone format
            const address = `${faker.location.streetAddress()}, Phnom Penh`; // Change "Phnom Penh" for other cities
            const randomPricingPlan = faker.helpers.arrayElement(pricingPlans);
            const activated_at = faker.date.past({ years: 3 });
            const [result] = await connection.execute(
                'INSERT INTO store_client (store_name, owner_name, email, phone, address, pricing_id, activated_at) VALUES (?, ?, ?, ?, ?, ?, ?)',
                [store_name, owner_name, email, phone, address, randomPricingPlan.id, activated_at]
            );
            storeClients.push({ id: result.insertId, pricing_id: randomPricingPlan.id, activated_at: activated_at });
        }
        console.log(`${storeClients.length} store clients seeded.`);

        // --- 6. Seed POS Sales ---
        console.log('Seeding pos_sale...');
        let posSalesCount = 0;
        for (const client of storeClients) {
            // --- CHANGE HERE: Adjust the probability (0.9 = 90%) that a client has a sale record ---
            if (Math.random() < 0.9) {
                const pricingInfo = pricingPlans.find(p => p.id === client.pricing_id);
                if (pricingInfo) {
                    const sale_date = faker.date.between({ from: client.activated_at, to: new Date() });
                    await connection.execute(
                        'INSERT INTO pos_sale (store_id, pos_id, pricing_id, amount, sale_date) VALUES (?, ?, ?, ?, ?)',
                        [client.id, pricingInfo.pos_id, pricingInfo.id, pricingInfo.price, sale_date]
                    );
                    posSalesCount++;
                }
            }
        }
        console.log(`${posSalesCount} POS sales seeded.`);

        // --- 7. Seed Store Inventory ---
        console.log('Seeding store_inventory...');
        const inventoryItems = {};
        for (const client of storeClients) {
            inventoryItems[client.id] = [];
            // --- CHANGE HERE: Adjust the min/max number of inventory products per store ---
            const productCount = faker.number.int({ min: 30, max: 250 });
            for (let i = 0; i < productCount; i++) {
                const product_name = faker.commerce.productName();
                const barcode = faker.string.alphanumeric(12).toUpperCase();
                const quantity = faker.number.int({ min: 0, max: 200 });
                const unit_price = faker.commerce.price({ min: 1, max: 500, dec: 2 });
                const [result] = await connection.execute(
                    'INSERT INTO store_inventory (store_id, product_name, barcode, quantity, unit_price) VALUES (?, ?, ?, ?, ?)',
                    [client.id, product_name, barcode, quantity, unit_price]
                );
                inventoryItems[client.id].push(result.insertId);
            }
        }
        console.log(`Inventory seeded for ${storeClients.length} stores.`);

        // --- 8. Seed Store Transactions and Transaction Items ---
        console.log('Seeding store_transactions and transaction_items...');
        let totalTransactions = 0;
        let totalTransactionItems = 0;
        for (const client of storeClients) {
            // --- CHANGE HERE: Adjust the min/max number of transactions per store ---
            const transactionCount = faker.number.int({ min: 50, max: 600 });
            for (let i = 0; i < transactionCount; i++) {
                const created_at = faker.date.between({ from: client.activated_at, to: new Date() });
                const [transResult] = await connection.execute(
                    'INSERT INTO store_transaction (store_id, created_at) VALUES (?, ?)',
                    [client.id, created_at]
                );
                const transactionId = transResult.insertId;
                totalTransactions++;

                // --- CHANGE HERE: Adjust the min/max number of items within a single transaction ---
                const itemsInTransaction = faker.number.int({ min: 1, max: 5 });
                if (inventoryItems[client.id] && inventoryItems[client.id].length > 0) {
                    const productsForTransaction = faker.helpers.arrayElements(inventoryItems[client.id], itemsInTransaction);

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
        }
        console.log(`${totalTransactions} transactions and ${totalTransactionItems} transaction items seeded.`);

        await connection.commit();
        console.log('--- Database Seeding Completed Successfully! ---');
        return "Database seeded successfully!";

    } catch (error) {
        console.error('--- Database Seeding Failed ---');
        console.error(error);
        if (connection) {
            await connection.rollback();
            console.log('Transaction rolled back.');
        }
        throw error;
    } finally {
        if (connection) {
            await connection.end();
            console.log('Database connection closed.');
        }
    }
}

