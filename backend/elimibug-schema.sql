-- Approval needed to set status to 'approved', 'ready for release', and 'released'

CREATE TYPE "bug_status" AS ENUM (
  'submitted',
  'approved',
  'in_progress',
  'tested',
  'ready_for_release',
  'released'
);

CREATE TYPE "priority" AS ENUM (
  'high',
  'medium',
  'low'
);

CREATE TABLE "Users" (
  "id" SERIAL PRIMARY KEY,
  "user_name" varchar UNIQUE NOT NULL,
  "encrypted_password" varchar(20) NOT NULL,
  "email" varchar NOT NULL,
  "date_joined" timestamp NOT NULL,
  "first_name" varchar NOT NULL,
  "last_name" varchar NOT NULL,
  "admin" boolean NOT NULL
);

CREATE TABLE "Bug" (
  "id" SERIAL PRIMARY KEY,
  "project" varchar NOT NULL,
  "description" varchar NOT NULL,
  "prority" priority,
  -- user_id is the user assigned to bug, field is nullable, admin approval needed
  "user_id" int,
  -- exp_comp_date is expected completion date, field is nullable, admin approval needed
  "exp_comp_date" date,
  "last_status" bug_status
  
);

CREATE TABLE "Status" (
  "id" SERIAL PRIMARY KEY,
  "user_id" int,
  "bug_id" int,
  "date" date NOT NULL,
  "bug_status" bug_status
);

CREATE TABLE "Comment" (
  "id" SERIAL PRIMARY KEY,
  "bug_id" int,
  "user_id" int,
  "post" varchar NOT NULL,
  "date" date NOT NULL
);

ALTER TABLE "Bug" ADD FOREIGN KEY ("id") REFERENCES "Status" ("bug_id");

ALTER TABLE "Bug" ADD FOREIGN KEY ("id") REFERENCES "Comment" ("bug_id");

ALTER TABLE "Users" ADD FOREIGN KEY ("id") REFERENCES "Comment" ("user_id");

COMMENT ON COLUMN "Bug"."user_id" IS 'User assigned to bug, nullable, admin approval needed';

COMMENT ON COLUMN "Bug"."exp_comp_date" IS 'nullable, admin approval needed';
