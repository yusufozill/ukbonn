CREATE DATABASE wordsdb;
USE wordsdb;

CREATE TABLE IF NOT EXISTS words (
    id INT AUTO_INCREMENT PRIMARY KEY,
    word VARCHAR(255) NOT NULL
);


INSERT INTO words (name) VALUES ('Sample Data 1'), ('Sample Data 2');
