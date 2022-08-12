--get a list of categories
SELECT id AS "Category ID", 
  title AS "Category name" 
FROM categories;

--get list of used categories
SELECT categories.id AS "Category ID", 
  categories.title AS "Category name" 
FROM categories 
  INNER JOIN categories_publications ON categories.id = categories_publications.category_id 
GROUP BY id 
ORDER BY id ASC;

--get list of used categories with publications quantity
SELECT categories.id AS "Category ID", 
  categories.title AS "Category name", 
  COUNT(categories_publications.category_id) AS "Publication quantity in category"
FROM categories_publications 
  RIGHT JOIN categories ON categories_publications.category_id = categories.id
GROUP BY categories.id, categories.title
ORDER BY id ASC;

--get a list of publications: ID, title, announcement, date, user first-/last-name, user email, comments quantity and category list
SELECT publications.id AS "ID", 
	publications.title AS "Title", 
	publications.announcement AS "Announcement", 
	publications.created_at AS "Date", 
	users.firstname AS "Firstname", 
	users.lastname AS "Lastname", 
	users.email AS "Email", 
	COUNT(comments.publication_id) AS "Comments quantity",
	STRING_AGG(DISTINCT categories.title, ', ') AS "Category list"
FROM publications 
	INNER JOIN users ON publications.user_id = users.id 
	INNER JOIN comments ON publications.id = comments.publication_id
	INNER JOIN categories_publications ON publications.id = categories_publications.publication_id
	INNER JOIN categories ON categories.id  = categories_publications.category_id 
GROUP BY publications.id, users.id
ORDER BY publications.created_at ASC;

--particular publication inforamtion
SELECT publications.id AS "ID", 
	publications.title AS "Title", 
	publications.announcement AS "Announcement", 
	publications.main_text AS "Text", 
	publications.created_at AS "Date", 
	publications.picture AS "Picture", 
	users.firstname AS "Firstname", 
	users.lastname AS "Lastname", 
	users.email AS "Email", 
	COUNT(comments.publication_id) AS "Comments quantity",
	STRING_AGG(DISTINCT categories.title, ', ') AS "Category list"
FROM publications 
	INNER JOIN users ON publications.user_id = users.id 
	INNER JOIN comments ON publications.id = comments.publication_id
	INNER JOIN categories_publications ON publications.id = categories_publications.publication_id
	INNER JOIN categories ON categories.id  = categories_publications.category_id 
WHERE publications.id = 2
GROUP BY publications.id, users.id;

--last 5 comments
SELECT comments.id AS "Comments ID", 
	comments.publication_id AS "Publication ID",
	CONCAT(users.firstname, ' ', users.lastname) AS "User fullname",
	comments.main_text AS "Comment text"
FROM comments
	INNER JOIN users ON comments.user_id = users.id
GROUP BY comments.id, users.id
ORDER BY comments.created_at ASC
LIMIT 5;

--last comments for particular publication
SELECT comments.id AS "Comments ID", 
	publications.id AS "Publication ID",
	CONCAT(users.firstname, ' ', users.lastname) AS "User fullname",
	comments.main_text AS "Comment text" 
FROM publications 
	INNER JOIN comments ON publications.id = comments.publication_id
	INNER JOIN users ON publications.user_id = users.id
WHERE publications.id = 3
ORDER BY comments.created_at ASC;

--update particulate publication's title
UPDATE publications
SET title = 'Как я встретил Новый год'
WHERE id = 1;
