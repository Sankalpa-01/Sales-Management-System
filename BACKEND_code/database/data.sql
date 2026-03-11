-- -- Create the main tables for your system
-- CREATE TABLE IF NOT EXISTS users (
--     user_id INT AUTO_INCREMENT PRIMARY KEY,
--     username VARCHAR(255) NOT NULL,
--     email VARCHAR(255) UNIQUE NOT NULL,
--     password_hash VARCHAR(255) NOT NULL,
--     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
-- );

-- CREATE TABLE IF NOT EXISTS customers (
--     customer_id INT AUTO_INCREMENT PRIMARY KEY,
--     username VARCHAR(255) NOT NULL,
--     email VARCHAR(255) NOT NULL,
--     phone VARCHAR(20),
--     address TEXT,
--     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
-- );

-- CREATE TABLE IF NOT EXISTS products (
--     product_id INT AUTO_INCREMENT PRIMARY KEY,
--     product_name VARCHAR(255) NOT NULL,
--     product_description TEXT,
--     price DECIMAL(10, 2) NOT NULL,
--     stock_quantity INT NOT NULL,
--     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
-- );

-- CREATE TABLE IF NOT EXISTS sales (
--     sale_id INT AUTO_INCREMENT PRIMARY KEY,
--     user_id INT,
--     customer_id INT,
--     total_amount DECIMAL(10, 2) NOT NULL,
--     sale_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
--     FOREIGN KEY (user_id) REFERENCES users(user_id),
--     FOREIGN KEY (customer_id) REFERENCES customers(customer_id)
-- );

-- CREATE TABLE IF NOT EXISTS sales_items (
--     sale_item_id INT AUTO_INCREMENT PRIMARY KEY,
--     sale_id INT,
--     product_id INT,
--     quantity INT NOT NULL,
--     price DECIMAL(10, 2) NOT NULL,
--     FOREIGN KEY (sale_id) REFERENCES sales(sale_id) ON DELETE CASCADE,
--     FOREIGN KEY (product_id) REFERENCES products(product_id)
-- );

CREATE TABLE IF NOT EXISTS users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS customers (
    customer_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    address TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS products (
    product_id INT AUTO_INCREMENT PRIMARY KEY,
    product_name VARCHAR(255) NOT NULL,
    product_description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    stock_quantity INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS sales (
    sale_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    customer_id INT,
    total_amount DECIMAL(10, 2) NOT NULL,
    sale_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (customer_id) REFERENCES customers(customer_id)
);

CREATE TABLE IF NOT EXISTS sales_items (
    sale_item_id INT AUTO_INCREMENT PRIMARY KEY,
    sale_id INT,
    product_id INT,
    quantity INT NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (sale_id) REFERENCES sales(sale_id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(product_id)
);

CREATE TABLE IF NOT EXISTS payment (
    payment_id INT AUTO_INCREMENT PRIMARY KEY,
    sale_id INT,
    amount_paid DECIMAL(10, 2) NOT NULL,
    payment_method VARCHAR(50) NOT NULL,
    payment_status VARCHAR(50) DEFAULT 'Completed',
    payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (sale_id) REFERENCES sales(sale_id) ON DELETE CASCADE
);

-- 1. Create the User (if not already there)
INSERT IGNORE INTO users (user_id, username, email, password_hash)
VALUES (1, 'admin', 'admin@example.com', 'hashed_pass');

-- 2. Create the Customer (This is what is missing!)
INSERT IGNORE INTO customers (customer_id, username, email, phone, address)
VALUES (1, 'Initial Customer', 'customer@example.com', '9876543210', 'Bhubaneswar, Odisha');