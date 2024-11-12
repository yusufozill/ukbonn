CREATE TABLE IF NOT EXISTS movements (
    id INT AUTO_INCREMENT PRIMARY KEY,
    prompt TEXT NOT NULL,
    date DATE NOT NULL,
    sentence TEXT NOT NULL
)CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

INSERT INTO movements (prompt, date, sentence) 
VALUES 
('First prompt', '2024-10-11', 'First sentence example.'),
('Second prompt', '2024-10-12', 'Second sentence example.'),
('Third prompt', '2024-10-13', 'Third sentence example.');

CREATE TABLE learned_words (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT DEFAULT 1,                   -- Sabit kullanıcı kimliği
    de VARCHAR(255),
    en VARCHAR(255),
    tr VARCHAR(255),
    part_of_speech VARCHAR(50),
    article VARCHAR(10),
    gender VARCHAR(10),
    example TEXT,
    learned_date DATE,
    review_count INT DEFAULT 0,
    last_reviewed DATE,
    mastered BOOLEAN DEFAULT FALSE,
    strength_score INT DEFAULT 0,            -- Öğrenme gücü puanı
    last_correct DATE,                       -- En son doğru cevaplanma tarihi
    difficulty VARCHAR(50),                  -- Kelimenin sıklık seviyesi (örneğin, "Çok sık", "yagın", "nadir")
    category VARCHAR(50),                    -- Tematik veya gramer kategorisi
    grade VARCHAR(5)                         -- Dil seviyesi (örneğin, "A1", "A2", "B1")
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

INSERT INTO learned_words (de, en, part_of_speech, article, gender, example, learned_date,category,grade)
VALUES
    ('Haus', 'house', 'noun', 'das', 'neuter', 'Das Haus ist groß.', '2024-10-25' ,'Home', "A1"),
    ('Auto', 'car', 'noun', 'das', 'neuter', 'Das Auto ist schnell.', '2024-10-25' ,'Transportation', "A1"),
    ('Tisch', 'table', 'noun', 'der', 'masculine', 'Der Tisch ist aus Holz.', '2024-10-25' ,'Furniture', "A1"),
    ('Stuhl', 'chair', 'noun', 'der', 'masculine', 'Der Stuhl ist bequem.', '2024-10-25' ,'Furniture', "A1"),
    ('Buch', 'book', 'noun', 'das', 'neuter', 'Das Buch ist interessant.', '2024-10-25' ,'Education', "A1"),
    ('Hund', 'dog', 'noun', 'der', 'masculine', 'Der Hund ist süß.', '2024-10-25' ,'Animals', "A1"),
    ('Katze', 'cat', 'noun', 'die', 'feminine', 'Die Katze ist faul.', '2024-10-25' ,'Animals', "A1"),
    ('Mann', 'man', 'noun', 'der', 'masculine', 'Der Mann ist groß.', '2024-10-25' ,'People', "A1");
    



CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user TEXT NOT NULL,
    date DATE NOT NULL,
    mail TEXT NOT NULL
)CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

INSERT INTO users (user, date, mail) 
VALUES 
('Micheal Jordan', '2024-10-12', '1mailto@hotmail.com'),
('Kobe Bryant', '2024-10-13', '2mailto@hotmail.com'),
('Lebron James', '2024-10-14', '3mailto@hotmail.com'),
('Stephen Curry', '2024-10-15', '4mailto@hotmail.com'),
('Kevin Durant', '2024-10-16', '5mailto@hotmail.com'),
('Kawhi Leonard', '2024-10-17', '6mailto@hotmail.com'),
('James Harden', '2024-10-18', '7mailto@hotmail.com'),
('Anthony Davis', '2024-10-19', '8mailto@hotmail.com'),
('Giannis Antetokounmpo', '2024-10-20', '9mailto@hotmail.com'),
('Luka Doncic', '2024-10-21', '10mailto@hotmail.com'),
('Damian Lillard', '2024-10-22', '11mailto@hotmail.com'),
('Jayson Tatum', '2024-10-23', '12mailto@hotmail.com'),
('Jimmy Butler', '2024-10-24', '13mailto@hotmail.com'),
('Paul George', '2024-10-25', '14mailto@hotmail.com'),
('Klay Thompson', '2024-10-26', '15mailto@hotmail.com'),
('Devin Booker', '2024-10-27', '16mailto@hotmail.com'),
('Donovan Mitchell', '2024-10-28', '17mailto@hotmail.com'),
('Zion Williamson', '2024-10-29', '18mailto@hotmail.com'),
('Rudy Gobert', '2024-10-30', '19mailto@hotmail.com'),
('Ben Simmons', '2024-10-31', '20mailto@hotmail.com'),
('Joel Embiid', '2024-11-01', '21mailto@hotmail.com'),
('Nikola Jokic', '2024-11-02', '22mailto@hotmail.com'),
('Russell Westbrook', '2024-11-03', '23mailto@hotmail.com'),
('Kyrie Irving', '2024-11-04', '24mailto@hotmail.com'),
('Kemba Walker', '2024-11-05', '25mailto@hotmail.com'),
('Chris Paul', '2024-11-06', '26mailto@hotmail.com'),
('DeMar DeRozan', '2024-11-07', '27mailto@hotmail.com'),
('Karl-Anthony Towns', '2024-11-08', '28mailto@hotmail.com'),
('Trae Young', '2024-11-09', '29mailto@hotmail.com'),
('CJ McCollum', '2024-11-10', '30mailto@hotmail.com'),
('Bradley Beal', '2024-11-11', '31mailto@hotmail.com'),
('Victor Oladipo', '2024-11-12', '32mailto@hotmail.com'),
('DeAndre Ayton', '2024-11-13', '33mailto@hotmail.com'),
('Jamal Murray', '2024-11-14', '34mailto@hotmail.com'),
('Pascal Siakam', '2024-11-15', '35mailto@hotmail.com'),
('John Wall', '2024-11-16', '36mailto@hotmail.com'),
('Derrick Rose', '2024-11-17', '37mailto@hotmail.com'),
('DAngelo Russell', '2024-11-18', '38mailto@hotmail.com'),
('Kyle Lowry', '2024-11-19', '39mailto@hotmail.com'),
('Gordon Hayward', '2024-11-20', '40mailto@hotmail.com'),
('Kristaps Porzingis', '2024-11-21', '41mailto@hotmail.com'),
('LaMarcus Aldridge', '2024-11-22', '42mailto@hotmail.com'),
('Blake Griffin', '2024-11-23', '43mailto@hotmail.com'),
('Zach LaVine', '2024-11-24', '44mailto@hotmail.com'),
('Kevin Love', '2024-11-25', '45mailto@hotmail.com'),
('DeMarcus Cousins', '2024-11-26', '46mailto@hotmail.com'),
('Carmelo Anthony', '2024-11-27', '47mailto@hotmail.com'),
('Andre Drummond', '2024-11-28', '48mailto@hotmail.com'),
('Steven Adams', '2024-11-29', '49mailto@hotmail.com'),
('Jrue Holiday', '2024-11-30', '50mailto@hotmail.com'),
('Eric Bledsoe', '2024-12-01', '51mailto@hotmail.com'),
('Ricky Rubio', '2024-12-02', '52mailto@hotmail.com'),
('Lou Williams', '2024-12-03', '53mailto@hotmail.com'),
('Danilo Gallinari', '2024-12-04', '54mailto@hotmail.com'),
('Tobias Harris', '2024-12-05', '55mailto@hotmail.com'),
('Serge Ibaka', '2024-12-06', '56mailto@hotmail.com'),
('Marc Gasol', '2024-12-07', '57mailto@hotmail.com'),
('Dwight Howard', '2024-12-08', '58mailto@hotmail.com'),
('Rajon Rondo', '2024-12-09', '59mailto@hotmail.com'),
('JJ Redick', '2024-12-10', '60mailto@hotmail.com'),
('Derrick Favors', '2024-12-11', '61mailto@hotmail.com'),
('Joe Ingles', '2024-12-12', '62mailto@hotmail.com'),
('Dennis Schroder', '2024-12-13', '63mailto@hotmail.com'),
('Montrezl Harrell', '2024-12-14', '64mailto@hotmail.com'),
('Derrick White', '2024-12-15', '65mailto@hotmail.com'),
('Patty Mills', '2024-12-16', '66mailto@hotmail.com'),
('Jakob Poeltl', '2024-12-17', '67mailto@hotmail.com'),
('Dejounte Murray', '2024-12-18', '68mailto@hotmail.com'),
('Lonnie Walker', '2024-12-19', '69mailto@hotmail.com');
