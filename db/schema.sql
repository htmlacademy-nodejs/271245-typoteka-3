DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS publications CASCADE;
DROP TABLE IF EXISTS categories_publications CASCADE;
DROP TABLE IF EXISTS comments CASCADE;

CREATE TABLE categories(
	id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  title varchar(30) UNIQUE NOT NULL
);

CREATE TABLE users(
  id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  email varchar(255) UNIQUE NOT NULL,
  password_hash varchar(255) NOT NULL,
  firstname varchar(255) NOT NULL,
  lastname varchar(255) NOT NULL,
  avatar varchar(255)
);

CREATE TABLE publications(
  id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  title varchar(250) NOT NULL,
	picture varchar(255),
	created_at timestamp DEFAULT current_timestamp,
	announcement varchar(250) NOT NULL,
	main_text varchar(1000),
	user_id integer NOT NULL,  
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE categories_publications(
  category_id integer NOT NULL,
  publication_id integer NOT NULL,
  PRIMARY KEY (category_id, publication_id),
  FOREIGN KEY (category_id) REFERENCES categories(id),
  FOREIGN KEY (publication_id) REFERENCES publications(id)
);

CREATE TABLE comments(
  id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  publication_id integer NOT NULL,
  user_id integer NOT NULL,
  main_text text NOT NULL,
  created_at timestamp DEFAULT current_timestamp,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (publication_id) REFERENCES publications(id)
);

CREATE INDEX ON publications(title);
