CREATE TABLE todos(
   ID  SERIAL PRIMARY KEY,
   task           VARCHAR(100)      NOT NULL,
   completed BOOLEAN NOT NULL DEFAULT false
);