create table if not exists test_table (
  id uuid primary key default gen_random_uuid()
);
