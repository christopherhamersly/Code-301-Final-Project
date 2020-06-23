DROP TABLE IF EXISTS locations;

CREATE TABLE locations (
  "id" SERIAL PRIMARY KEY,
  "search_query" VARCHAR(255),
  "display_name" VARCHAR(255),
  "lat" DECIMAL(12, 9),
  "lon" DECIMAL(12, 9)
);


DROP TABLE IF EXISTS trails;

CREATE TABLE trails (
  "id" SERIAL PRIMARY KEY,
  "name" VARCHAR(255),
  "summary" VARCHAR(10000),
  "img_medium" VARCHAR(255),
  "latitude" DECIMAL(12, 9),
  "longitude" DECIMAL(12, 9),
  "length" DECIMAL(7, 2),
  "ascent" DECIMAL(7, 2),
  "high" DECIMAL(7, 2),
  "difficulty" VARCHAR(255),
  "conditionstatus" VARCHAR(255),
  "stars" DECIMAL(2,1)
);



