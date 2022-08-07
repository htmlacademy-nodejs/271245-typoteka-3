INSERT INTO users(email, password_hash, firstname, lastname, avatar) VALUES
('test1@ya.ru', '5f4dcc3b5aa765d61d8327deb882cf99', 'Test1_fistname', 'Test1_lastname', 'test_avatar_1.png'),
('test2@google.ru', '5f4dcc3b5aa765d61d8327deb882cf99', 'Test2_fistname', 'Test2_lastname', 'test_avatar_2.png');

INSERT INTO categories(title) VALUES
('Программирование'),
('Мемология'),
('Крипта'),
('Разное'),
('Музыка');

--disable it in case there are no users DT in the DB yet
ALTER TABLE publications DISABLE TRIGGER ALL;
INSERT INTO publications(title, picture, announcement, main_text, user_id) VALUES
('Как достигнуть успеха', 'test_picture_1.png', 'Возьмите новую книгу и закрепите все упражнения на практике.', 'А потом можете идти отдыхать!', 1),
('Как отличить хороший мем от плохого?', NULL, 'Тут детальная инструкция как отличать качественные мемы от плохих.', 'Обманул - таких инструкций нет. Это либо дано, либо не дано!', 2),
('Тестовый заголовок', NULL, 'Тестовый анонс.', NULL, 1),
('Хочешь похудеть?', 'test_picture_2.озп', 'Советы по быстрому похудению.', 'Если хочешь похудеть, то надо меньше кушать и больше двигаться!', 1);
ALTER TABLE publications ENABLE TRIGGER ALL;

--disable it in case there are no categories/publications DT in the DB yet
ALTER TABLE categories_publications DISABLE TRIGGER ALL;
INSERT INTO categories_publications(category_id, publication_id) VALUES
(1, 1),
(2, 1),
(2, 2),
(2, 3),
(3, 2),
(4, 4),
(5, 4);
ALTER TABLE categories_publications ENABLE TRIGGER ALL;

--disable it in case there are no publications/users DT in the DB yet
ALTER TABLE comments DISABLE TRIGGER ALL;
INSERT INTO comments(publication_id, user_id, main_text) VALUES
(1, 1, 'Комментарий от 1-го пользователя по 1-ой публикации'),
(4, 1, 'Комментарий от 1-го пользователя по 4-ой публикации'),
(1, 2, 'Комментарий от 2-го пользователя по 1-ой публикации'),
(3, 2, 'Комментарий от 2-го пользователя по 3-ой публикации'),
(2, 2, 'Комментарий от 2-го пользователя по 2-ой публикации'),
(1, 1, 'Комментарий от 1-го пользователя по 1-ой публикации'),
(4, 1, 'Комментарий от 1-го пользователя по 4-ой публикации');
ALTER TABLE comments ENABLE TRIGGER ALL;
