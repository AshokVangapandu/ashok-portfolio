-- Alter contact_messages table to drop old columns and add the new column
alter table public.contact_messages
  drop column if exists company,
  drop column if exists phone_number,
  add column submitted_from text not null default 'Portfolio Website' check (char_length(trim(submitted_from)) > 0);
