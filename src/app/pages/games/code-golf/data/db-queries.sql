CREATE TABLE IF NOT EXISTS challenges (
    id TEXT PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS challenges_en (
    challenge_id TEXT PRIMARY KEY REFERENCES challenges(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS challenges_ru (
    challenge_id TEXT PRIMARY KEY REFERENCES challenges(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT NOT NULL
);

INSERT INTO challenges (id) VALUES
('cg_001'), ('cg_002'), ('cg_003'), ('cg_004'), ('cg_005'),
('cg_006'), ('cg_007'), ('cg_008'), ('cg_009'), ('cg_010'),
('cg_011'), ('cg_012'), ('cg_013'), ('cg_014'), ('cg_015'),
('cg_016'), ('cg_017'), ('cg_018'), ('cg_019'), ('cg_020');

INSERT INTO challenges_en (challenge_id, title, description) VALUES
('cg_001', 'Brevity is the Soul of Wit', 'Write a function that returns the sum of two numbers.'),
('cg_002', 'Even or Odd', 'Return true if a number is even, and false otherwise.'),
('cg_003', 'String Inversion', 'Reverse a string using minimum characters.'),
('cg_004', 'Maximum of Three', 'Return the largest of three numbers.'),
('cg_005', 'Void Filter', 'Remove null and undefined values from an array.'),
('cg_006', 'Hardcore: No Loops', 'Sum an array without using "for" or "while".'),
('cg_007', 'Repeat Me', 'Repeat a string N times using a built-in method.'),
('cg_008', 'Arithmetic Mean', 'Calculate the average value of numbers in an array.'),
('cg_009', 'One-Line Factorial', 'Implement factorial calculation.'),
('cg_010', 'Palindrome Detector', 'Return true if the word reads the same in both directions.'),
('cg_011', 'Unique Set', 'Remove duplicates from an array.'),
('cg_012', 'Capitalize It', 'Make the first letter of a string uppercase.'),
('cg_013', 'Vowel Detector', 'Count the number of vowels in a string using regex.'),
('cg_014', 'Fibonacci Numbers', 'Return the n-th number of the Fibonacci sequence.'),
('cg_015', 'Password Generator', 'Return a random 8-character string.'),
('cg_016', 'Longest Word Search', 'Find the longest word in a string.'),
('cg_017', 'Range Array', 'Create an array from 1 to N without a loop.'),
('cg_018', 'Prime Number Check', 'Return true if the number is prime.'),
('cg_019', 'Flattening', 'Turn an array of arrays into a flat array.'),
('cg_020', 'FizzBuzz Golf', 'The classic FizzBuzz in as few bytes as possible.');

INSERT INTO challenges_ru (challenge_id, title, description) VALUES
('cg_001', 'Краткость — сестра таланта', 'Напишите функцию, которая возвращает сумму двух чисел.'),
('cg_002', 'Чет или нечет', 'Верните true, если число четное, и false в противном случае.'),
('cg_003', 'Инверсия строки', 'Разверните строку, используя минимум символов.'),
('cg_004', 'Максимум из трех', 'Верните наибольшее из трех чисел.'),
('cg_005', 'Фильтр пустоты', 'Удалите null и undefined значения из массива.'),
('cg_006', 'Hardcore: Без циклов', 'Суммируйте массив без использования "for" или "while".'),
('cg_007', 'Повтори меня', 'Повторите строку N раз встроенным методом.'),
('cg_008', 'Среднее арифметическое', 'Вычислите среднее значение чисел в массиве.'),
('cg_009', 'Факториал в одну строку', 'Реализуйте вычисление факториала.'),
('cg_010', 'Детектор палиндромов', 'Проверьте, читается ли слово одинаково в обе стороны.'),
('cg_011', 'Уникальный набор', 'Удалите дубликаты из массива.'),
('cg_012', 'Заглавные буквы', 'Сделайте первую букву строки заглавной.'),
('cg_013', 'Детектор гласных', 'Посчитайте количество гласных через regex.'),
('cg_014', 'Числа Фибоначчи', 'Верните n-ное число последовательности Фибоначчи.'),
('cg_015', 'Генератор пароля', 'Создайте случайную строку из 8 символов.'),
('cg_016', 'Поиск самого длинного слова', 'Найдите самое длинное слово в строке.'),
('cg_017', 'Массив из диапазона', 'Создайте массив от 1 до N без явного цикла.'),
('cg_018', 'Проверка на простое число', 'Верните true, если число простое.'),
('cg_019', 'Сплющивание', 'Превратите многомерный массив в плоский.'),
('cg_020', 'FizzBuzz Golf', 'Классический FizzBuzz в минимальном количестве байт.');


CREATE OR REPLACE FUNCTION get_localized_challenge(lang TEXT)
RETURNS TABLE (id TEXT, title TEXT, description TEXT) AS $$
BEGIN
    IF lang = 'ru' THEN
        RETURN QUERY
        SELECT c.id, t.title, t.description
        FROM challenges c JOIN challenges_ru t ON c.id = t.challenge_id
        ORDER BY RANDOM() LIMIT 1;
    ELSE
        RETURN QUERY
        SELECT c.id, t.title, t.description
        FROM challenges c JOIN challenges_en t ON c.id = t.challenge_id
        ORDER BY RANDOM() LIMIT 1;
    END IF;
END;
$$ LANGUAGE plpgsql STABLE;
