CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 20 örnek kullanıcı verisi ekle
INSERT INTO users (username, email) VALUES
('User 1', 'user1@example.com'),
('User 2', 'user2@example.com'),
('User 3', 'user3@example.com'),
('User 4', 'user4@example.com'),
('User 5', 'user5@example.com'),
('User 6', 'user6@example.com'),
('User 7', 'user7@example.com'),
('User 8', 'user8@example.com'),
('User 9', 'user9@example.com'),
('User 10', 'user10@example.com'),
('User 11', 'user11@example.com'),
('User 12', 'user12@example.com'),
('User 13', 'user13@example.com'),
('User 14', 'user14@example.com'),
('User 15', 'user15@example.com'),
('User 16', 'user16@example.com'),
('User 17', 'user17@example.com'),
('User 18', 'user18@example.com'),
('User 19', 'user19@example.com'),
('User 20', 'user20@example.com');