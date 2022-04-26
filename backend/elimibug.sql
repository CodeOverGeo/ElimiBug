\echo 'Delete and recreate elimibug db?'
\prompt 'Return for yes or control-C to cancel > ' foo

DROP DATABASE elimibug;
CREATE DATABASE elimibug;
\connect elimibug

\i elimibug-schema.sql
-- \i elimibug-seed.sql

-- \echo 'Delete and recreate elimibug_test db?'
-- \prompt 'Return for yes or control-C to cancel > ' foo

-- DROP DATABASE elimibug_test;
-- CREATE DATABASE elimibug_test;
-- \connect elimibug_test

-- \i elimibug-schema.sql
