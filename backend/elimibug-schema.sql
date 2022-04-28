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

CREATE TABLE "users" (
  "id" SERIAL PRIMARY KEY,
  "username" varchar UNIQUE NOT NULL,
  "password" varchar NOT NULL,
  "email" varchar NOT NULL,
  "first_name" varchar NOT NULL,
  "last_name" varchar NOT NULL,
  "is_admin" boolean NOT NULL DEFAULT 'FALSE'
);

CREATE TABLE "bug" (
  "id" SERIAL PRIMARY KEY,
  "project" varchar NOT NULL,
  "bug_name" varchar NOt NULL,
  "description" varchar NOT NULL,
  "priority" priority,
  -- user_id is the user assigned to bug, field is nullable, admin approval needed
  "user_id" int
    REFERENCES "users" On DELETE CASCADE,
  "last_status" bug_status
  
);

CREATE TABLE "status" (
  "id" SERIAL PRIMARY KEY,
  "user_id" int
  REFERENCES "users" ON DELETE CASCADE,
  "bug_id" int
  REFERENCEs "bug" ON DELETE CASCADE,
  "date" date NOT NULL,
  "bug_status" bug_status
);

CREATE TABLE "comment" (
  "id" SERIAL PRIMARY KEY,
  "bug_id" int,
  "user_id" int,
  "post" varchar NOT NULL,
  "date" date NOT NULL
);



COMMENT ON COLUMN "bug"."user_id" IS 'User assigned to bug, nullable, admin approval needed';

