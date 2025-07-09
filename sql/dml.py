from faker import Faker
import random
import mysql.connector

faker = Faker()

conn = mysql.connector.connect(
    host='maglev.proxy.rlwy.net',
    port=41425,
    user='root',    
    password='zfZikcmJmTfiQOQKwToHWSJbaxBpmCpW',
    database='pos_management_db'
)

cursor = conn.cursor()

def get_ids(table_name, id_column):
    cursor.execute(f"SELECT {id_column} FROM {table_name}")
    return [row[0] for row in cursor.fetchall()]

for _ in range(100):
    name = faker.company()
    description = faker.text()
    cursor.execute("INSERT INTO pos_system (name, description) VALUES (%s, %s)", (name, description))

conn.commit()
print("Inserted 100 records into pos_system.")
pos_ids = get_ids("pos_system", "pos_id")

for _ in range(100):
    feature_name = faker.bs().capitalize()
    description = faker.text()
    cursor.execute("INSERT INTO pos_feature (feature_name, description) VALUES (%s, %s)", (feature_name, description))

conn.commit()
print("Inserted 100 records into pos_feature.")
feature_ids = get_ids("pos_feature", "feature_id")

for _ in range(100):
    pos_id = random.choice(pos_ids)
    plan_name = faker.word().capitalize() + " Plan"
    price_per_month = round(random.uniform(10, 200), 2)
    features_summary = faker.sentence()
    cursor.execute("""
        INSERT INTO pricing (pos_id, plan_name, price_per_month, features_summary)
        VALUES (%s, %s, %s, %s)
    """, (pos_id, plan_name, price_per_month, features_summary))

conn.commit()
print("Inserted 100 records into pricing.")
pricing_ids = get_ids("pricing", "pricing_id")

for _ in range(100):
    store_name = faker.company()
    owner_name = faker.name()
    email = faker.email()
    phone = faker.phone_number()[:20]
    address = faker.address().replace('\n', ', ')
    pricing_id = random.choice(pricing_ids)
    activated_at = faker.date_time_this_year()
    cursor.execute("""
        INSERT INTO store_client (store_name, owner_name, email, phone, address, pricing_id, activated_at)
        VALUES (%s, %s, %s, %s, %s, %s, %s)
    """, (store_name, owner_name, email, phone, address, pricing_id, activated_at))

conn.commit()
print("Inserted 100 records into store_client.")
store_ids = get_ids("store_client", "store_id")

for _ in range(100):
    store_id = random.choice(store_ids)
    pos_id = random.choice(pos_ids)
    pricing_id = random.choice(pricing_ids)
    amount = round(random.uniform(100, 2000), 2)
    cursor.execute("""
        INSERT INTO pos_sale (store_id, pos_id, pricing_id, amount)
        VALUES (%s, %s, %s, %s)
    """, (store_id, pos_id, pricing_id, amount))

conn.commit()
print("Inserted 100 records into pos_sale.")

inventory_ids = []
for _ in range(100):
    store_id = random.choice(store_ids)
    product_name = faker.word().capitalize()
    barcode = faker.unique.ean(length=13)
    quantity = random.randint(1, 100)
    unit_price = round(random.uniform(1, 50), 2)
    cursor.execute("""
        INSERT INTO store_inventory (store_id, product_name, barcode, quantity, unit_price)
        VALUES (%s, %s, %s, %s, %s)
    """, (store_id, product_name, barcode, quantity, unit_price))

conn.commit()
print("Inserted 100 records into store_inventory.")
inventory_ids = get_ids("store_inventory", "inventory_id")

transaction_ids = []
for _ in range(100):
    store_id = random.choice(store_ids)
    cursor.execute("INSERT INTO store_transaction (store_id) VALUES (%s)", (store_id,))

conn.commit()
print("Inserted 100 records into store_transaction.")
transaction_ids = get_ids("store_transaction", "transaction_id")

for _ in range(100):
    inventory_id = random.choice(inventory_ids)
    transaction_id = random.choice(transaction_ids)
    quantity = random.randint(1, 10)
    unit_price = round(random.uniform(5, 100), 2)
    cursor.execute("""
        INSERT INTO transaction_item (inventory_id, transaction_id, quantity, unit_price)
        VALUES (%s, %s, %s, %s)
    """, (inventory_id, transaction_id, quantity, unit_price))

conn.commit()
print("Inserted 100 records into transaction_item.")

for _ in range(100):
    pos_id = random.choice(pos_ids)
    feature_id = random.choice(feature_ids)
    cursor.execute("""
        INSERT INTO system_feature (pos_id, feature_id)
        VALUES (%s, %s)
    """, (pos_id, feature_id))

conn.commit()
print("Inserted 100 records into system_feature.")

cursor.close()
conn.close()

print("Data insertion completed successfully.")
