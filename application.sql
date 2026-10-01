-- =====================================================================
-- Real Estate Property Management System (MySQL Database Script)
-- Capgemini Capstone Layered System Architecture
-- =====================================================================

CREATE DATABASE IF NOT EXISTS `realestate_db` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `realestate_db`;

-- Drop existing tables in reverse dependency order if recreating
SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS `inquiries`;
DROP TABLE IF EXISTS `payments`;
DROP TABLE IF EXISTS `bookings`;
DROP TABLE IF EXISTS `properties`;
DROP TABLE IF EXISTS `users`;
SET FOREIGN_KEY_CHECKS = 1;

-- 1. Users Table
CREATE TABLE `users` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255) NOT NULL UNIQUE,
    `password` VARCHAR(255) NOT NULL,
    `role` VARCHAR(50) NOT NULL,
    `phone_number` VARCHAR(50),
    `address` VARCHAR(255),
    `avatar_url` VARCHAR(255),
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 2. Properties Table
CREATE TABLE `properties` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `title` VARCHAR(255) NOT NULL,
    `description` TEXT,
    `price` DECIMAL(12, 2) NOT NULL,
    `type` VARCHAR(50) NOT NULL,
    `status` VARCHAR(50) NOT NULL DEFAULT 'AVAILABLE',
    `address` VARCHAR(255) NOT NULL,
    `city` VARCHAR(255) NOT NULL,
    `state` VARCHAR(255),
    `zip_code` VARCHAR(50),
    `country` VARCHAR(100) DEFAULT 'India',
    `bedrooms` INT DEFAULT 1,
    `bathrooms` INT DEFAULT 1,
    `area_sq_ft` DOUBLE DEFAULT 0.0,
    `image_url` VARCHAR(1000),
    `featured` BOOLEAN DEFAULT FALSE,
    `owner_id` BIGINT NOT NULL,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT `fk_properties_owner` FOREIGN KEY (`owner_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 3. Bookings Table
CREATE TABLE `bookings` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `property_id` BIGINT NOT NULL,
    `user_id` BIGINT NOT NULL,
    `start_date` DATE NOT NULL,
    `end_date` DATE NOT NULL,
    `total_price` DECIMAL(12, 2) NOT NULL,
    `status` VARCHAR(50) NOT NULL DEFAULT 'PENDING',
    `special_requests` VARCHAR(1000),
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT `fk_bookings_property` FOREIGN KEY (`property_id`) REFERENCES `properties` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_bookings_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 4. Payments Table
CREATE TABLE `payments` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `booking_id` BIGINT NOT NULL,
    `amount` DECIMAL(12, 2) NOT NULL,
    `payment_date` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `payment_method` VARCHAR(50) NOT NULL,
    `status` VARCHAR(50) NOT NULL DEFAULT 'PENDING',
    `transaction_id` VARCHAR(255) NOT NULL UNIQUE,
    CONSTRAINT `fk_payments_booking` FOREIGN KEY (`booking_id`) REFERENCES `bookings` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 5. Inquiries Table
CREATE TABLE `inquiries` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `property_id` BIGINT NOT NULL,
    `user_id` BIGINT NOT NULL,
    `subject` VARCHAR(255) NOT NULL,
    `message` TEXT NOT NULL,
    `response` TEXT,
    `status` VARCHAR(50) NOT NULL DEFAULT 'OPEN',
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `replied_at` DATETIME,
    CONSTRAINT `fk_inquiries_property` FOREIGN KEY (`property_id`) REFERENCES `properties` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_inquiries_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =====================================================================
-- Seed Data
-- Passwords below are BCrypt encrypted for: Password@123
-- =====================================================================

INSERT INTO `users` (`id`, `name`, `email`, `password`, `role`, `phone_number`, `address`, `avatar_url`, `created_at`) VALUES
(1, 'System Administrator', 'admin@realestate.com', '$2a$10$wTOCw4lB7i4kQG3oZ218ieD2pE4B48cGyXyL4q7i1l6/3u0Yf5c4u', 'ROLE_ADMIN', '+91 98765 43210', '100 MG Road, Bangalore', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150', NOW()),
(2, 'Sarah Jenkins (Premier Homes)', 'owner@realestate.com', '$2a$10$wTOCw4lB7i4kQG3oZ218ieD2pE4B48cGyXyL4q7i1l6/3u0Yf5c4u', 'ROLE_OWNER', '+91 98123 45678', '42 Residency Road, Bangalore', 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150', NOW()),
(3, 'Rajesh Kumar (Apex Realty)', 'rajesh.broker@realestate.com', '$2a$10$wTOCw4lB7i4kQG3oZ218ieD2pE4B48cGyXyL4q7i1l6/3u0Yf5c4u', 'ROLE_OWNER', '+91 99887 76655', '12 Bandra Kurla Complex, Mumbai', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150', NOW()),
(4, 'Alex Morgan', 'customer@realestate.com', '$2a$10$wTOCw4lB7i4kQG3oZ218ieD2pE4B48cGyXyL4q7i1l6/3u0Yf5c4u', 'ROLE_CUSTOMER', '+91 91234 56780', '15 Koramangala, Bangalore', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150', NOW()),
(5, 'Priya Sharma', 'priya.tenant@realestate.com', '$2a$10$wTOCw4lB7i4kQG3oZ218ieD2pE4B48cGyXyL4q7i1l6/3u0Yf5c4u', 'ROLE_CUSTOMER', '+91 93456 78901', '88 Hitec City, Hyderabad', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150', NOW()),
(6, 'Rahul Varma', 'rahul.techie@realestate.com', '$2a$10$wTOCw4lB7i4kQG3oZ218ieD2pE4B48cGyXyL4q7i1l6/3u0Yf5c4u', 'ROLE_CUSTOMER', '+91 97788 11223', '45 Powell Street, Pune', 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150', NOW()),
(7, 'Ananya Sen', 'ananya.design@realestate.com', '$2a$10$wTOCw4lB7i4kQG3oZ218ieD2pE4B48cGyXyL4q7i1l6/3u0Yf5c4u', 'ROLE_CUSTOMER', '+91 98451 22334', '7 Salt Lake Sector V, Kolkata', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150', NOW());

INSERT INTO `properties` (`id`, `title`, `description`, `price`, `type`, `status`, `address`, `city`, `state`, `zip_code`, `country`, `bedrooms`, `bathrooms`, `area_sq_ft`, `image_url`, `featured`, `owner_id`, `created_at`) VALUES
(1, 'The Grand Azure Luxury Penthouse', 'Spectacular 4-bedroom panoramic sky penthouse overlooking the city skyline. Features floor-to-ceiling glass windows, private infinity pool, Italian marble flooring, and smart automation system.', 85000.00, 'PENTHOUSE', 'AVAILABLE', '77 Indiranagar 100ft Road', 'Bangalore', 'Karnataka', '560038', 'India', 4, 4, 3800.0, 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200', TRUE, 2, NOW()),
(2, 'Modern Seafront Villa with Garden', 'Exquisite 5-bedroom waterfront villa with landscaped zen gardens, private beach access, chef\'s gourmet kitchen, and double car garage in prime coastal location.', 145000.00, 'VILLA', 'AVAILABLE', '104 Marine Drive Promenade', 'Mumbai', 'Maharashtra', '400020', 'India', 5, 5, 5200.0, 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200', TRUE, 3, NOW()),
(3, 'Urban Loft in Tech Corridor', 'Sleek and contemporary 2-bedroom loft apartment. High exposed concrete ceilings, hardwood floors, high-speed fiber internet, and access to modern gym and co-working lounge.', 32000.00, 'APARTMENT', 'AVAILABLE', '18 Outer Ring Road, Bellandur', 'Bangalore', 'Karnataka', '560103', 'India', 2, 2, 1450.0, 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200', FALSE, 2, NOW()),
(4, 'Silicon Heights Premium Commercial Office', 'Grade-A modern commercial office space ready for tech enterprise or startup. Features central HVAC, biometric security, 4 conference rooms, and 24/7 power backup.', 210000.00, 'COMMERCIAL', 'AVAILABLE', '9th Floor, Cyber Gateway, Hitec City', 'Hyderabad', 'Telangana', '500081', 'India', 0, 4, 6500.0, 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200', TRUE, 3, NOW()),
(5, 'Serene Green Valley Garden House', 'Charming 3-bedroom family bungalow surrounded by lush greenery and fruit orchards. Features quiet neighborhood, solar heating, and spacious backyard patio.', 45000.00, 'HOUSE', 'RENTED', '29 Koregaon Park Lane 4', 'Pune', 'Maharashtra', '411001', 'India', 3, 3, 2600.0, 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=1200', FALSE, 2, NOW()),
(6, 'Minimalist Studio Suite near Central Mall', 'Bright, fully furnished modern studio with high-end appliances, modular wardrobe, Queen plush bed, and 50-inch 4K TV. Ideal for solo professionals.', 18500.00, 'STUDIO', 'AVAILABLE', '502 Connaught Place Outer Circle', 'Delhi', 'Delhi', '110001', 'India', 1, 1, 620.0, 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200', FALSE, 3, NOW()),
(7, 'The Palms Royal 4BHK Villa with Private Pool', 'Tropical sanctuary offering 4 master ensuite bedrooms, heated infinity swimming pool, outdoor barbecue gazebo, and 24/7 private concierge service.', 95000.00, 'VILLA', 'AVAILABLE', '14 Candolim Beach Road', 'Goa', 'Goa', '403515', 'India', 4, 4, 4500.0, 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=1200', TRUE, 2, NOW()),
(8, 'Signature Tower Luxury High-Rise Condo', 'Opulent 3-bedroom condominium with Arabian sea vistas, Italian designer modular kitchen, high-speed elevators, and Olympic-sized clubhouse pool.', 65000.00, 'CONDO', 'AVAILABLE', '88 Worli Sea Face', 'Mumbai', 'Maharashtra', '400018', 'India', 3, 3, 2100.0, 'https://images.unsplash.com/photo-1567496898669-ee935f5f647a?w=1200', TRUE, 3, NOW()),
(9, 'CyberCity Tech Park Executive Office Suite', 'Prestigious commercial office suite in the heart of the IT corridor. High capacity fiber backbones, executive boardroom, cafeteria, and basement parking for 20 vehicles.', 180000.00, 'COMMERCIAL', 'AVAILABLE', 'Block C, EPIP Zone, Whitefield', 'Bangalore', 'Karnataka', '560066', 'India', 0, 6, 5800.0, 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=1200', FALSE, 2, NOW()),
(10, 'Eco-Living 3BHK Duplex in Jubilee Hills', 'Sustainable luxury home featuring rooftop solar power, rainwater harvesting, double-height living room, private garden, and electric vehicle charging station.', 52000.00, 'HOUSE', 'AVAILABLE', 'Road No. 36, Jubilee Hills', 'Hyderabad', 'Telangana', '500033', 'India', 3, 3, 2900.0, 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200', TRUE, 3, NOW()),
(11, 'Seaside Serenity Luxury 2BHK Apartment', 'Breathtaking Bay of Bengal views from your private balcony. Fully air-conditioned, teakwood wardrobes, designer lighting, and secure gated community.', 38000.00, 'APARTMENT', 'AVAILABLE', '22 East Coast Road, Neelankarai', 'Chennai', 'Tamil Nadu', '600115', 'India', 2, 2, 1600.0, 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200', FALSE, 2, NOW()),
(12, 'Heritage Victorian Garden Townhouse', 'Colonial charm meets contemporary comfort. High ceilings, polished Burma teak woodwork, sprawling front lawn, and serene residential ambiance.', 42000.00, 'HOUSE', 'AVAILABLE', '15 Ballygunge Circular Road', 'Kolkata', 'West Bengal', '700019', 'India', 4, 3, 3100.0, 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=1200', FALSE, 3, NOW());

INSERT INTO `bookings` (`id`, `property_id`, `user_id`, `start_date`, `end_date`, `total_price`, `status`, `special_requests`, `created_at`) VALUES
(1, 1, 4, DATE_ADD(CURDATE(), INTERVAL 3 DAY), DATE_ADD(CURDATE(), INTERVAL 33 DAY), 85000.00, 'CONFIRMED', 'Request early key handover on arrival day.', NOW()),
(2, 3, 5, DATE_ADD(CURDATE(), INTERVAL 7 DAY), DATE_ADD(CURDATE(), INTERVAL 37 DAY), 32000.00, 'PENDING', 'Would love to check if covered car parking is included.', NOW()),
(3, 2, 4, DATE_ADD(CURDATE(), INTERVAL 10 DAY), DATE_ADD(CURDATE(), INTERVAL 100 DAY), 435000.00, 'PENDING', 'Corporate relocation lease request. Need copy of company rental lease agreement.', NOW()),
(4, 7, 5, DATE_ADD(CURDATE(), INTERVAL 5 DAY), DATE_ADD(CURDATE(), INTERVAL 35 DAY), 95000.00, 'CONFIRMED', 'Family vacation retreat. Please arrange airport transfer if possible.', NOW()),
(5, 8, 6, DATE_ADD(CURDATE(), INTERVAL 14 DAY), DATE_ADD(CURDATE(), INTERVAL 379 DAY), 780000.00, 'PENDING', '1-year lease agreement requested. Ready for immediate security deposit transfer.', NOW()),
(6, 4, 7, DATE_ADD(CURDATE(), INTERVAL 1 DAY), DATE_ADD(CURDATE(), INTERVAL 181 DAY), 1260000.00, 'CONFIRMED', 'Commercial lease for AI startup headquarters. Requires 24/7 building access card.', NOW()),
(7, 6, 6, DATE_SUB(CURDATE(), INTERVAL 60 DAY), DATE_SUB(CURDATE(), INTERVAL 1 DAY), 37000.00, 'COMPLETED', 'Solo tech professional short-term lease.', NOW());

INSERT INTO `payments` (`id`, `booking_id`, `amount`, `payment_date`, `payment_method`, `status`, `transaction_id`) VALUES
(1, 1, 85000.00, DATE_SUB(NOW(), INTERVAL 4 HOUR), 'CREDIT_CARD', 'SUCCESS', 'TXN-8F92A14E'),
(2, 4, 95000.00, DATE_SUB(NOW(), INTERVAL 1 DAY), 'UPI', 'SUCCESS', 'TXN-4B889C21'),
(3, 6, 1260000.00, DATE_SUB(NOW(), INTERVAL 2 DAY), 'NET_BANKING', 'SUCCESS', 'TXN-91E550DF'),
(4, 7, 37000.00, DATE_SUB(NOW(), INTERVAL 60 DAY), 'DEBIT_CARD', 'SUCCESS', 'TXN-1A099FE8');

INSERT INTO `inquiries` (`id`, `property_id`, `user_id`, `subject`, `message`, `response`, `status`, `created_at`, `replied_at`) VALUES
(1, 1, 4, 'Penthouse Maintenance Charges and Club Membership', 'Hi Sarah, does the monthly rent include maintenance charges and clubhouse access?', 'Hello Alex! Yes, all monthly maintenance fees, pool upkeep, and 2 clubhouse membership cards are included.', 'REPLIED', DATE_SUB(NOW(), INTERVAL 1 DAY), DATE_SUB(NOW(), INTERVAL 1 DAY)),
(2, 2, 5, 'Pet Policy and Security Deposit for Waterfront Villa', 'Hello Rajesh, we have a golden retriever. Is this property pet-friendly?', NULL, 'OPEN', NOW(), NULL),
(3, 7, 6, 'Power Generator and Solar Backup in Goa Villa', 'Hi Sarah, does the Candolim villa have full generator backup during monsoons?', 'Hello Rahul! Yes, we have a heavy-duty 30kVA automatic generator backup system.', 'REPLIED', DATE_SUB(NOW(), INTERVAL 8 HOUR), DATE_SUB(NOW(), INTERVAL 8 HOUR)),
(4, 4, 7, 'Dual Internet ISP Terminations and Server Room Specs', 'Hello Rajesh, does the commercial office space have dual ISP redundancy?', 'Hi Ananya, yes, Tata Teleservices and Airtel Enterprise fiber are both pre-connected.', 'REPLIED', DATE_SUB(NOW(), INTERVAL 18 HOUR), DATE_SUB(NOW(), INTERVAL 18 HOUR)),
(5, 8, 4, 'Covered Parking Slots for 2 Vehicles', 'Is there an option for two dedicated covered car parking slots in Worli Tower?', NULL, 'OPEN', NOW(), NULL);
