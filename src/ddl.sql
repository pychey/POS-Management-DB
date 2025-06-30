DROP DATABASE IF EXISTS pos_management_db;
DATABASE IF NOT EXISTS pos_management_db;
USE pos_management_db;

-- 1. POS System (Products you sell)
CREATE TABLE pos_system (
    pos_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. POS Features (for marketing, feature management)
CREATE TABLE pos_feature (
    feature_id INT AUTO_INCREMENT PRIMARY KEY,
    feature_name VARCHAR(150) NOT NULL,
    description TEXT
);

-- 3. Pricing Plans
CREATE TABLE pricing (
    pricing_id INT AUTO_INCREMENT PRIMARY KEY,
    pos_id INT,
    plan_name VARCHAR(100) NOT NULL,
    price_per_month DECIMAL(10, 2) NOT NULL,
    features_summary TEXT,
    FOREIGN KEY (pos_id) REFERENCES pos_system(pos_id)
);

-- 4. Store Clients (Your customers)
CREATE TABLE store_client (
    store_id INT AUTO_INCREMENT PRIMARY KEY,
    store_name VARCHAR(150) NOT NULL,
    owner_name VARCHAR(100),
    email VARCHAR(100),
    phone VARCHAR(20),
    address VARCHAR(255),
    pricing_id INT,
    activated_at TIMESTAMP,
    FOREIGN KEY (pricing_id) REFERENCES pricing(pricing_id)
);

-- 5. POS Sale (purchase records: when they bought the POS license)
CREATE TABLE pos_sale (
    sale_id INT AUTO_INCREMENT PRIMARY KEY,
    store_id INT,
    pos_id INT,
    pricing_id INT,
    amount DECIMAL(10,2),
    sale_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (store_id) REFERENCES store_client(store_id),
    FOREIGN KEY (pos_id) REFERENCES pos_system(pos_id),
    FOREIGN KEY (pricing_id) REFERENCES pricing(pricing_id)
);

-- 6. Store Inventory (Each store’s own stock)
CREATE TABLE store_inventory (
    inventory_id INT AUTO_INCREMENT PRIMARY KEY,
    store_id INT,
    product_name VARCHAR(150),
    barcode VARCHAR(50),
    quantity INT NOT NULL DEFAULT 0,
    unit_price DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (store_id) REFERENCES store_client(store_id)
);

-- 7. Store Transactions (Each sales record by store)
CREATE TABLE store_transaction (
    transaction_id INT AUTO_INCREMENT PRIMARY KEY,
    store_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (store_id) REFERENCES store_client(store_id)
);

-- 8. Transaction Items (Products in each transaction)
CREATE TABLE transaction_item (
    inventory_id INT,
    transaction_id INT,
    quantity INT NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (transaction_id) REFERENCES store_transaction(transaction_id),
    foreign key (inventory_id) references store_inventory(inventory_id)
);

-- 9. System_feature
create table system_feature(
	pos_id int,
	feature_id int,
	foreign key(pos_id) references pos_system(pos_id),
	foreign key(feature_id) references pos_feature(feature_id)
);