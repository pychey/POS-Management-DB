drop database if exists pos_management_db;
create database if not exists pos_management_db;
use pos_management_db;

create table pos_system (
    pos_id int auto_increment primary key,
    name varchar(100) not null,
    description text,
    created_at timestamp default current_timestamp
);

create table pos_feature (
    feature_id int auto_increment primary key,
    feature_name varchar(150) not null,
    description text
);

create table pricing (
    pricing_id int auto_increment primary key,
    pos_id int,
    plan_name varchar(100) not null,
    price_per_month decimal(10, 2) not null,
    features_summary text,
    foreign key (pos_id) references pos_system(pos_id)
);

create table store_client (
    store_id int auto_increment primary key,
    store_name varchar(150) not null,
    owner_name varchar(100),
    email varchar(100),
    phone varchar(20),
    address varchar(255),
    pricing_id int,
    activated_at timestamp,
    foreign key (pricing_id) references pricing(pricing_id)
);

create table pos_sale (
    sale_id int auto_increment primary key,
    store_id int,
    pos_id int,
    pricing_id int,
    amount decimal(10,2),
    sale_date timestamp default current_timestamp,
    foreign key (store_id) references store_client(store_id),
    foreign key (pos_id) references pos_system(pos_id),
    foreign key (pricing_id) references pricing(pricing_id)
);

create table store_inventory (
    inventory_id int auto_increment primary key,
    store_id int,
    product_name varchar(150),
    barcode varchar(50),
    quantity int not null default 0,
    unit_price decimal(10, 2) not null,
    foreign key (store_id) references store_client(store_id)
);

create table store_transaction (
    transaction_id int auto_increment primary key,
    store_id int,
    created_at timestamp default current_timestamp,
    foreign key (store_id) references store_client(store_id)
);

create table transaction_item (
    inventory_id int,
    transaction_id int,
    quantity int not null,
    unit_price decimal(10,2) not null,
    foreign key (transaction_id) references store_transaction(transaction_id),
    foreign key (inventory_id) references store_inventory(inventory_id)
);

create table system_feature(
    pos_id int,
    feature_id int,
    foreign key(pos_id) references pos_system(pos_id),
    foreign key(feature_id) references pos_feature(feature_id)
);