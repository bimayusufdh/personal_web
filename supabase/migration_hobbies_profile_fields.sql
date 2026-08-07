-- Jalankan sekali di Supabase SQL Editor untuk memperbarui database yang sudah ada.
alter table public.profiles add column if not exists hobbies_intro text;
alter table public.profiles add column if not exists hobbies_section_label text;
alter table public.profiles add column if not exists hobbies_section_title text;
alter table public.profiles add column if not exists hobbies_page_label text;
alter table public.profiles add column if not exists hobbies_page_title text;
alter table public.profiles add column if not exists hobbies_page_intro text;

-- Segarkan cache schema PostgREST agar kolom langsung dikenali API Supabase.
notify pgrst, 'reload schema';
