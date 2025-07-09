
// =============================================================
// FILE: README.md
// =============================================================
// *** UPDATED WITH CLI INSTRUCTIONS ***

# POS Management Database Seeder

This project is an Express.js application designed to populate a MySQL database with realistic fake data. It includes a web interface for small, sample seeds and a powerful **Command-Line Interface (CLI)** for generating millions of records.

## Prerequisites

- [Node.js](https://nodejs.org/)
- A running [MySQL](https://www.mysql.com/) server

## Installation & Configuration

1.  **Install Dependencies:**
    ```bash
    npm install express mysql2 @faker-js/faker
    ```
2.  **Configure Database:**
    Open `model.js` and update the `dbConfig` object with your MySQL credentials.

## How to Seed Data (Recommended Flow)

For generating millions of records, follow these steps in your terminal.

### Step 1: Seed the Base Data

This is a required first step. It creates the POS systems, features, and pricing plans that other data depends on.

```bash
node seed.js base
```

### Step 2: Seed Store Clients

Now, generate the clients. You can create as many as you need.

```bash
# Example: Create 10,000 clients
node seed.js clients 10000
```

### Step 3: Seed Inventory for All Clients

This command will go through every client you just created and give them a random amount of inventory.

```bash
node seed.js inventory
```

### Step 4: Seed Millions of Transactions

This is the final step for generating a massive dataset. It will randomly create transactions for the clients you created.

```bash
# Example: Create 2,000,000 transactions
node seed.js transactions 2000000
```

This process can be run multiple times. For example, you can add more clients later and then run the inventory and transaction commands again.

## Using the Web Interface (for Testing)

You can still run the web server for quick tests.

1.  **Start the server:**
    ```bash
    node index.js
    ```
2.  **Visit in browser:**
    Open `http://localhost:3000/seed`. This will only run the **Step 1 (base)** seed. It will not generate millions of records.
