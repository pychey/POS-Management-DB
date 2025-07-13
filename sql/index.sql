USE pos_management_db;

-- Performance Optimization: Indexing Strategy

-- 1. Primary Key Indexes (Already Created)

-- 2. Foreign Key Indexes for JOIN operations
CREATE INDEX idx_pricing_pos_id ON pricing(pos_id);
CREATE INDEX idx_store_client_pricing_id ON store_client(pricing_id);
CREATE INDEX idx_pos_sale_store_id ON pos_sale(store_id);
CREATE INDEX idx_pos_sale_pos_id ON pos_sale(pos_id);
CREATE INDEX idx_pos_sale_pricing_id ON pos_sale(pricing_id);
CREATE INDEX idx_store_inventory_store_id ON store_inventory(store_id);
CREATE INDEX idx_store_transaction_store_id ON store_transaction(store_id);
CREATE INDEX idx_transaction_item_transaction_id ON transaction_item(transaction_id);
CREATE INDEX idx_transaction_item_inventory_id ON transaction_item(inventory_id);
CREATE INDEX idx_system_feature_pos_id ON system_feature(pos_id);
CREATE INDEX idx_system_feature_feature_id ON system_feature(feature_id);

-- 3. Composite Indexes for complex queries
CREATE INDEX idx_store_transaction_store_date ON store_transaction(store_id, created_at);
CREATE INDEX idx_pos_sale_store_date ON pos_sale(store_id, sale_date);
CREATE INDEX idx_store_inventory_store_product ON store_inventory(store_id, product_name);
CREATE INDEX idx_transaction_item_inventory_quantity ON transaction_item(inventory_id, quantity);
CREATE INDEX idx_store_group ON store_client(store_id, store_name, owner_name);
CREATE INDEX idx_ti_all ON transaction_item(transaction_id,inventory_id, quantity, unit_price);
CREATE INDEX idx_store_transaction_txid ON store_transaction(transaction_id, store_id);

-- 4. Indexes for WHERE clause optimization
CREATE INDEX idx_store_client_email ON store_client(email);
CREATE INDEX idx_store_client_store_name ON store_client(store_name);
CREATE INDEX idx_store_inventory_barcode ON store_inventory(barcode);
CREATE INDEX idx_store_inventory_product_name ON store_inventory(product_name);
CREATE INDEX idx_pos_system_name ON pos_system(name);
CREATE INDEX idx_pos_feature_name ON pos_feature(feature_name);

-- 5. Indexes for ORDER BY operations
CREATE INDEX idx_store_transaction_created_at ON store_transaction(created_at);
CREATE INDEX idx_pos_sale_sale_date ON pos_sale(sale_date);
CREATE INDEX idx_store_client_activated_at ON store_client(activated_at);
CREATE INDEX idx_st_created_at_id ON store_transaction(created_at DESC, transaction_id, store_id);

-- 6. Indexes for aggregation queries
CREATE INDEX idx_store_inventory_store_price ON store_inventory(store_id, unit_price);
CREATE INDEX idx_transaction_item_quantity_price ON transaction_item(quantity, unit_price);
CREATE INDEX idx_inventory_store_qty_price ON store_inventory(store_id, quantity, unit_price);
CREATE INDEX idx_group_sum ON transaction_item(transaction_id, quantity, unit_price);

-- 7. Full-text search indexes (for future text search functionality)
CREATE FULLTEXT INDEX idx_store_inventory_product_search ON store_inventory(product_name, barcode);
CREATE FULLTEXT INDEX idx_store_client_search ON store_client(store_name, owner_name, email);

-- 8. Unique indexes for data integrity
CREATE UNIQUE INDEX idx_store_client_email_unique ON store_client(email);
CREATE UNIQUE INDEX idx_store_inventory_barcode_unique ON store_inventory(barcode);