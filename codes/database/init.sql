CREATE TABLE IF NOT EXISTS movements (
    id INT AUTO_INCREMENT PRIMARY KEY,
    prompt TEXT NOT NULL,
    tme DATE NOT NULL,
    sentence TEXT NOT NULL
);

INSERT INTO movements (prompt, tme, sentence) 
VALUES 
('First prompt', '2024-10-11', 'First sentence example.'),
('Second prompt', '2024-10-12', 'Second sentence example.'),
('Third prompt', '2024-10-13', 'Third sentence example.');
