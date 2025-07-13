from faker import Faker
import random
import mysql.connector
from datetime import datetime

faker = Faker()

conn = mysql.connector.connect(
    host='localhost',
    port=3306,
    user='root',
    password='@123Pychey',
    database='pos_management_db'
)
cursor = conn.cursor()

NUM_POS_SYSTEM = 5000
NUM_POS_FEATURE = 30000
NUM_PRICING = 15000
NUM_STORE_CLIENT = 50000
NUM_POS_SALE = 500000
NUM_STORE_INVENTORY = 1000000
NUM_STORE_TRANSACTION = 700000
NUM_TRANSACTION_ITEM = 1200000
NUM_SYSTEM_FEATURE = 10000

BATCH_SIZE = 5

def get_ids(table_name, id_column):
    cursor.execute(f"SELECT {id_column} FROM {table_name}")
    return [row[0] for row in cursor.fetchall()]

for _ in range(BATCH_SIZE): 
    for _ in range(NUM_POS_SYSTEM // BATCH_SIZE):
        name = faker.company()
        description = faker.text()
        cursor.execute("INSERT INTO pos_system (name, description) VALUES (%s, %s)", (name, description))
    print(f"Inserted {NUM_POS_SYSTEM // BATCH_SIZE} records in this inner loop for pos_system. (NOT SAVED YET)")

conn.commit()
print(f"Inserted {NUM_POS_SYSTEM} records into pos_system. (SAVED)")
pos_ids = get_ids("pos_system", "pos_id")

for _ in range(BATCH_SIZE):
    for _ in range(NUM_POS_FEATURE // BATCH_SIZE):
        feature_name = faker.bs().capitalize()
        description = faker.text()
        cursor.execute("INSERT INTO pos_feature (feature_name, description) VALUES (%s, %s)", (feature_name, description))
    print(f"Inserted {NUM_POS_FEATURE // BATCH_SIZE} records in this inner loop for pos_feature. (NOT SAVED YET)")

conn.commit()
print(f"Inserted {NUM_POS_FEATURE} records into pos_feature. (SAVED)")
feature_ids = get_ids("pos_feature", "feature_id")

for _ in range(BATCH_SIZE):
    for _ in range(NUM_PRICING // BATCH_SIZE):
        pos_id = random.choice(pos_ids)
        plan_name = faker.word().capitalize() + " Plan"
        price_per_month = round(random.uniform(10, 200), 2)
        features_summary = faker.sentence()
        cursor.execute("""
            INSERT INTO pricing (pos_id, plan_name, price_per_month, features_summary)
            VALUES (%s, %s, %s, %s)
        """, (pos_id, plan_name, price_per_month, features_summary))
    print(f"Inserted {NUM_PRICING // BATCH_SIZE} records in this inner loop for pricing. (NOT SAVED YET)")

conn.commit()
print(f"Inserted {NUM_PRICING} records into pricing. (SAVED)")
pricing_ids = get_ids("pricing", "pricing_id")

for _ in range(BATCH_SIZE):
    for _ in range(NUM_STORE_CLIENT // BATCH_SIZE):
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
    print(f"Inserted {NUM_STORE_CLIENT // BATCH_SIZE} records in this inner loop for store_client. (NOT SAVED YET)")

conn.commit()
print(f"Inserted {NUM_STORE_CLIENT} records into store_client. (SAVED)")
store_ids = get_ids("store_client", "store_id")

for _ in range(BATCH_SIZE):
    for _ in range(NUM_POS_SALE // BATCH_SIZE):
        store_id = random.choice(store_ids)
        pos_id = random.choice(pos_ids)
        pricing_id = random.choice(pricing_ids)
        amount = round(random.uniform(100, 2000), 2)
        cursor.execute("""
            INSERT INTO pos_sale (store_id, pos_id, pricing_id, amount)
            VALUES (%s, %s, %s, %s)
        """, (store_id, pos_id, pricing_id, amount))
    print(f"Inserted {NUM_POS_SALE // BATCH_SIZE} records in this inner loop for pos_sale. (NOT SAVED YET)")

conn.commit()
print(f"Inserted {NUM_POS_SALE} records into pos_sale. (SAVED)")

for _ in range(BATCH_SIZE):
    for _ in range(NUM_STORE_INVENTORY // BATCH_SIZE):
        store_id = random.choice(store_ids)
        product_name = faker.word().capitalize()
        barcode = faker.unique.ean(length=13)
        quantity = random.randint(1, 100)
        unit_price = round(random.uniform(1, 50), 2)
        cursor.execute("""
            INSERT INTO store_inventory (store_id, product_name, barcode, quantity, unit_price)
            VALUES (%s, %s, %s, %s, %s)
        """, (store_id, product_name, barcode, quantity, unit_price))
    print(f"Inserted {NUM_STORE_INVENTORY // BATCH_SIZE} records in this inner loop for store_inventory. (NOT SAVED YET)")

conn.commit()
print(f"Inserted {NUM_STORE_INVENTORY} records into store_inventory. (SAVED)")
inventory_ids = get_ids("store_inventory", "inventory_id")

for _ in range(BATCH_SIZE):
    for _ in range(NUM_STORE_TRANSACTION // BATCH_SIZE):
        store_id = random.choice(store_ids)
        cursor.execute("INSERT INTO store_transaction (store_id) VALUES (%s)", (store_id,))
    print(f"Inserted {NUM_STORE_TRANSACTION // BATCH_SIZE} records in this inner loop for store_transaction. (NOT SAVED YET)")

conn.commit()
print(f"Inserted {NUM_STORE_TRANSACTION} records into store_transaction. (SAVED)")
transaction_ids = get_ids("store_transaction", "transaction_id")

for _ in range(BATCH_SIZE):
    for _ in range(NUM_TRANSACTION_ITEM // BATCH_SIZE):
        inventory_id = random.choice(inventory_ids)
        transaction_id = random.choice(transaction_ids)
        quantity = random.randint(1, 10)
        unit_price = round(random.uniform(5, 100), 2)
        cursor.execute("""
            INSERT INTO transaction_item (inventory_id, transaction_id, quantity, unit_price)
            VALUES (%s, %s, %s, %s)
        """, (inventory_id, transaction_id, quantity, unit_price))
    print(f"Inserted {NUM_TRANSACTION_ITEM // BATCH_SIZE} records in this inner loop for transaction_item. (NOT SAVED YET)")

conn.commit()
print(f"Inserted {NUM_TRANSACTION_ITEM} records into transaction_item. (SAVED)")

for _ in range(BATCH_SIZE):
    for _ in range(NUM_SYSTEM_FEATURE // BATCH_SIZE):
        pos_id = random.choice(pos_ids)
        feature_id = random.choice(feature_ids)
        cursor.execute("""
            INSERT INTO system_feature (pos_id, feature_id)
            VALUES (%s, %s)
        """, (pos_id, feature_id))
    print(f"Inserted {NUM_SYSTEM_FEATURE // BATCH_SIZE} records in this inner loop for system_feature. (NOT SAVED YET)")

conn.commit()
print(f"Inserted {NUM_SYSTEM_FEATURE} records into system_feature. (SAVED)")

cursor.close()
conn.close()

print("Data insertion completed successfully.")