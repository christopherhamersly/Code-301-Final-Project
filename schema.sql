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
  "api_id" VARCHAR(255),
  "name" VARCHAR(255),
  "summary" VARCHAR(10000),
  "img_medium" VARCHAR(1000),
  "latitude" VARCHAR(255),
  "longitude" VARCHAR(255),
  "length" VARCHAR(255),
  "ascent" VARCHAR(255),
  "high" VARCHAR(255),
  "difficulty" VARCHAR(255),
  "conditionstatus" VARCHAR(255),
  "stars" VARCHAR(255),
  "notes" VARCHAR(10000)
);


DROP TABLE IF EXISTS camping; 

CREATE TABLE camping (
  "id" SERIAL PRIMARY KEY,
  "api_id" VARCHAR(255),
  "image" VARCHAR(255),
  "name" VARCHAR(255),
  "latitude" DECIMAL(12, 9),
  "longitude" DECIMAL(12, 9),
  "description" VARCHAR(10000),
  "entrance_fees" VARCHAR(10000),
  "activities" VARCHAR(10000),
  "notes" VARCHAR(10000)
);


DROP TABLE IF EXISTS climbing;

CREATE TABLE climbing (
  "id" SERIAL PRIMARY KEY,
  "api_id" VARCHAR(255),
  "location" VARCHAR(255),
  "name" VARCHAR(255),
  "type" VARCHAR(255),
  "pitches" VARCHAR(255),
  "stars" VARCHAR(255),
  "latitude" DECIMAL(12, 9),
  "longitude" DECIMAL(12, 9),
  "img_medium" VARCHAR(255),
  "notes" VARCHAR(10000)
);


DROP TABLE IF EXISTS biking;

CREATE TABLE biking(
"id" SERIAL PRIMARY KEY,
"api_id" VARCHAR(255), 
"location" VARCHAR(255),
"name" VARCHAR(255),
"length" VARCHAR(255),
"summary" VARCHAR(10000),
"difficulty" VARCHAR(255),
"stars" VARCHAR(255)
);

