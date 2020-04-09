CREATE TYPE share_types AS ENUM (
    'Audio',
    'Text',
);

ALTER TABLE share
  ADD COLUMN
    share_type share_types;