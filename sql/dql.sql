USE pos_management_db;

-- Query 1: Complex Join - Get all store information with their POS system and pricing details
SELECT 
    sc.store_name,
    sc.owner_name,
    sc.email,
    ps.name as pos_system_name,
    p.plan_name,
    p.price_per_month,
    sc.activated_at
FROM store_client sc
JOIN pricing p ON sc.pricing_id = p.pricing_id
JOIN pos_system ps ON p.pos_id = ps.pos_id
ORDER BY sc.activated_at DESC;

-- Query 2: Aggregation with GROUP BY - Total revenue by POS system
SELECT 
    ps.name as pos_system_name,
    COUNT(ps_sale.sale_id) as total_sales,
    SUM(ps_sale.amount) as total_revenue,
    AVG(ps_sale.amount) as average_sale_amount
FROM pos_sale ps_sale
JOIN pos_system ps ON ps_sale.pos_id = ps.pos_id
GROUP BY ps.pos_id, ps.name
ORDER BY total_revenue DESC;

-- Query 3: Subquery - Find stores with above-average inventory value
SELECT 
    sc.store_name,
    sc.owner_name,
    SUM(si.quantity * si.unit_price) as total_inventory_value
FROM store_client sc
JOIN store_inventory si ON sc.store_id = si.store_id
GROUP BY sc.store_id, sc.store_name, sc.owner_name
HAVING SUM(si.quantity * si.unit_price) > (
    SELECT AVG(store_total.total_value)
    FROM (
        SELECT SUM(quantity * unit_price) as total_value
        FROM store_inventory
        GROUP BY store_id
    ) as store_total
)
ORDER BY total_inventory_value DESC;

-- Query 4: Complex JOIN with multiple conditions - Get transaction details with product information
SELECT 
    st.transaction_id,
    sc.store_name,
    si.product_name,
    ti.quantity,
    ti.unit_price,
    (ti.quantity * ti.unit_price) as total_amount,
    st.created_at
FROM store_transaction st
JOIN store_client sc ON st.store_id = sc.store_id
JOIN transaction_item ti ON st.transaction_id = ti.transaction_id
JOIN store_inventory si ON ti.inventory_id = si.inventory_id
WHERE st.created_at >= '2024-01-01'
ORDER BY st.created_at DESC;

-- Query 5: Window Function - Rank stores by total sales revenue
SELECT 
    sc.store_name,
    sc.owner_name,
    SUM(ps_sale.amount) as total_revenue,
    RANK() OVER (ORDER BY SUM(ps_sale.amount) DESC) as revenue_rank,
    DENSE_RANK() OVER (ORDER BY SUM(ps_sale.amount) DESC) as dense_revenue_rank
FROM store_client sc
LEFT JOIN pos_sale ps_sale ON sc.store_id = ps_sale.store_id
GROUP BY sc.store_id, sc.store_name, sc.owner_name
ORDER BY total_revenue DESC;

-- Query 6: Subquery with EXISTS - Find POS systems that have all features
SELECT 
    ps.name as pos_system_name,
    ps.description
FROM pos_system ps
WHERE NOT EXISTS (
    SELECT 1 
    FROM pos_feature pf
    WHERE NOT EXISTS (
        SELECT 1 
        FROM system_feature sf 
        WHERE sf.pos_id = ps.pos_id AND sf.feature_id = pf.feature_id
    )
);

-- Query 7: Complex aggregation with CASE - Sales performance by month
SELECT 
    YEAR(st.created_at) as year,
    MONTH(st.created_at) as month,
    COUNT(DISTINCT st.store_id) as active_stores,
    COUNT(st.transaction_id) as total_transactions,
    SUM(ti.quantity * ti.unit_price) as total_sales,
    CASE 
        WHEN SUM(ti.quantity * ti.unit_price) > 1000 THEN 'High Performance'
        WHEN SUM(ti.quantity * ti.unit_price) > 500 THEN 'Medium Performance'
        ELSE 'Low Performance'
    END as performance_category
FROM store_transaction st
JOIN transaction_item ti ON st.transaction_id = ti.transaction_id
GROUP BY YEAR(st.created_at), MONTH(st.created_at)
ORDER BY year DESC, month DESC;

-- Query 8: Self-JOIN - Compare pricing plans within same POS system
SELECT 
    p1.plan_name as plan1_name,
    p1.price_per_month as plan1_price,
    p2.plan_name as plan2_name,
    p2.price_per_month as plan2_price,
    (p2.price_per_month - p1.price_per_month) as price_difference,
    ps.name as pos_system_name
FROM pricing p1
JOIN pricing p2 ON p1.pos_id = p2.pos_id AND p1.pricing_id < p2.pricing_id
JOIN pos_system ps ON p1.pos_id = ps.pos_id
ORDER BY price_difference DESC;

-- Query 9: Subquery with IN - Find stores with high-value transactions
SELECT 
    sc.store_name,
    sc.owner_name,
    COUNT(st.transaction_id) as transaction_count,
    AVG(transaction_total.total_amount) as avg_transaction_value
FROM store_client sc
JOIN store_transaction st ON sc.store_id = st.store_id
JOIN (
    SELECT 
        transaction_id,
        SUM(quantity * unit_price) as total_amount
    FROM transaction_item
    GROUP BY transaction_id
) transaction_total ON st.transaction_id = transaction_total.transaction_id
WHERE transaction_total.total_amount IN (
    SELECT SUM(quantity * unit_price) as total_amount
    FROM transaction_item
    GROUP BY transaction_id
    HAVING SUM(quantity * unit_price) > 50
)
GROUP BY sc.store_id, sc.store_name, sc.owner_name
ORDER BY avg_transaction_value DESC;

-- Query 10: Complex query with multiple aggregations - Feature usage analysis
SELECT 
    pf.feature_name,
    COUNT(DISTINCT sf.pos_id) as pos_systems_with_feature,
    COUNT(DISTINCT ps_sale.store_id) as stores_using_feature,
    SUM(ps_sale.amount) as total_revenue_from_feature,
    ROUND(
        (COUNT(DISTINCT sf.pos_id) * 100.0 / (SELECT COUNT(*) FROM pos_system)), 2
    ) as feature_adoption_percentage
FROM pos_feature pf
LEFT JOIN system_feature sf ON pf.feature_id = sf.feature_id
LEFT JOIN pos_sale ps_sale ON sf.pos_id = ps_sale.pos_id
GROUP BY pf.feature_id, pf.feature_name
ORDER BY feature_adoption_percentage DESC;

-- Query 11: Performance Analysis - Store inventory turnover
SELECT 
    sc.store_name,
    COUNT(si.inventory_id) as total_products,
    SUM(si.quantity) as total_stock,
    SUM(si.quantity * si.unit_price) as inventory_value,
    COUNT(ti.transaction_id) as sales_transactions,
    CASE 
        WHEN COUNT(ti.transaction_id) > 0 THEN 
            ROUND(SUM(si.quantity * si.unit_price) / COUNT(ti.transaction_id), 2)
        ELSE 0 
    END as inventory_per_transaction
FROM store_client sc
LEFT JOIN store_inventory si ON sc.store_id = si.store_id
LEFT JOIN transaction_item ti ON si.inventory_id = ti.inventory_id
GROUP BY sc.store_id, sc.store_name
ORDER BY inventory_per_transaction DESC;

-- Query 12: Time-based analysis - Monthly growth trends
SELECT 
    YEAR(st.created_at) as year,
    MONTH(st.created_at) as month,
    COUNT(st.transaction_id) as transactions,
    SUM(ti.quantity * ti.unit_price) as revenue,
    LAG(SUM(ti.quantity * ti.unit_price)) OVER (ORDER BY YEAR(st.created_at), MONTH(st.created_at)) as prev_month_revenue,
    CASE 
        WHEN LAG(SUM(ti.quantity * ti.unit_price)) OVER (ORDER BY YEAR(st.created_at), MONTH(st.created_at)) > 0 THEN
            ROUND(
                ((SUM(ti.quantity * ti.unit_price) - LAG(SUM(ti.quantity * ti.unit_price)) OVER (ORDER BY YEAR(st.created_at), MONTH(st.created_at))) / 
                LAG(SUM(ti.quantity * ti.unit_price)) OVER (ORDER BY YEAR(st.created_at), MONTH(st.created_at))) * 100, 2
            )
        ELSE 0 
    END as growth_percentage
FROM store_transaction st
JOIN transaction_item ti ON st.transaction_id = ti.transaction_id
GROUP BY YEAR(st.created_at), MONTH(st.created_at)
ORDER BY year DESC, month DESC; 