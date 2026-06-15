-- Create database and users table for the app
-- Import this file in phpMyAdmin or run via MySQL CLI

CREATE DATABASE IF NOT EXISTS `db_auth` CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `db_auth`;

CREATE TABLE IF NOT EXISTS `users` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `username` VARCHAR(100) DEFAULT NULL,
  `email` VARCHAR(255) NOT NULL UNIQUE,
  `password` VARCHAR(255) NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE IF NOT EXISTS `products` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(150) NOT NULL,
  `origin` VARCHAR(150) NOT NULL,
  `price` INT UNSIGNED NOT NULL,
  `unit` VARCHAR(50) NOT NULL DEFAULT '250gr',
  `image_url` TEXT NOT NULL,
  `alt_text` VARCHAR(150) DEFAULT NULL,
  `sort_order` INT UNSIGNED NOT NULL DEFAULT 0,
  `is_active` TINYINT(1) NOT NULL DEFAULT 1,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY `uniq_products_name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE IF NOT EXISTS `cart_items` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT UNSIGNED NOT NULL,
  `product_id` INT UNSIGNED NOT NULL,
  `qty` INT UNSIGNED NOT NULL DEFAULT 1,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY `uniq_user_product_cart` (`user_id`, `product_id`),
  KEY `idx_cart_user` (`user_id`),
  KEY `idx_cart_product` (`product_id`),
  CONSTRAINT `fk_cart_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_cart_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `products` (`id`, `name`, `origin`, `price`, `unit`, `image_url`, `alt_text`, `sort_order`, `is_active`) VALUES
(1, 'Aceh Gayo', 'Aceh Tengah, Sumatra', 150000, '250gr', 'https://plus.unsplash.com/premium_photo-1666976503799-4ef00906ab2b?w=600&auto=format&fit=crop&q=60', 'Aceh Gayo', 1, 1),
(2, 'Toraja', 'Sulawesi Selatan', 140000, '250gr', 'https://images.unsplash.com/photo-1660071139672-55a1607f72fe?w=600&auto=format&fit=crop&q=60', 'Toraja', 2, 1),
(3, 'Kintamani Bali', 'Kintamani, Bali', 160000, '250gr', 'https://images.unsplash.com/photo-1672570050756-4f1953bde478?w=600&auto=format&fit=crop&q=60', 'Kintamani Bali', 3, 1),
(4, 'Flores Bajawa', 'Ngada, Nusa Tenggara Timur', 155000, '250gr', 'https://images.unsplash.com/photo-1561986845-fbeb7f7913d8?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', 'Flores Bajawa', 4, 1),
(5, 'Papua Wamena', 'Lembah Baliem, Papua', 175000, '250gr', 'https://images.pexels.com/photos/36249837/pexels-photo-36249837.jpeg', 'Papua Wamena', 5, 1),
(6, 'Mandailing Natal', 'Tapanuli Selatan, Sumatra', 145000, '250gr', 'https://media.istockphoto.com/id/1337868547/id/foto/biji-kopi-merah-organik-100-di-tangan-dan-keranjang-petani-di-pertanian-nasional-chiang-mai.webp?a=1&b=1&s=612x612&w=0&k=20&c=jLuwT2qgJDlcClSiL5AP825NlJ9EI8knPQWc4xLcng8=', 'Mandailing Natal', 6, 1)
ON DUPLICATE KEY UPDATE
  `origin` = VALUES(`origin`),
  `price` = VALUES(`price`),
  `unit` = VALUES(`unit`),
  `image_url` = VALUES(`image_url`),
  `alt_text` = VALUES(`alt_text`),
  `sort_order` = VALUES(`sort_order`),
  `is_active` = VALUES(`is_active`);

-- Example: to add a user with a hashed password, generate the hash in PHP:
-- <?php echo password_hash('password123', PASSWORD_DEFAULT); ?>
-- Then INSERT like:
-- INSERT INTO users (username, email, password) VALUES ('demo', 'demo@example.com', '<PASTE_HASH_HERE>');
