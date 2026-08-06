create extension if not exists "pgcrypto";

create table if not exists public.admin_users (
  user_id uuid primary key,
  email text unique,
  created_at timestamptz not null default now()
);

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.admin_users
    where admin_users.user_id = auth.uid()
  );
$$;

create table if not exists public.profiles (
  id text primary key default 'main',
  full_name text not null,
  role text,
  headline text,
  summary text,
  location text,
  email text,
  phone text,
  website text,
  linkedin text,
  telegram text,
  focus_area text,
  certifications text,
  hero_highlight_title text,
  snapshot_label text,
  cta_view_projects_text text,
  cta_contact_text text,
  cta_about_text text,
  cta_experience_text text,
  featured_projects_label text,
  featured_projects_title text,
  cta_projects_text text,
  core_skills_label text,
  core_skills_title text,
  cta_profile_text text,
  about_page_label text,
  about_page_title text,
  about_skills_label text,
  about_skills_title text,
  about_education_label text,
  about_education_title text,
  experience_page_label text,
  experience_page_title text,
  experience_page_intro text,
  certificates_page_label text,
  certificates_page_title text,
  certificates_page_intro text,
  projects_page_label text,
  projects_page_title text,
  projects_page_intro text,
  contact_page_label text,
  contact_page_title text,
  contact_page_intro text,
  contact_direct_label text,
  contact_direct_title text,
  photo_url text,
  footer_text text,
  footer_link_text text,
  footer_link text,
  updated_at timestamptz not null default now()
);

create table if not exists public.skills (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  category text,
  description text,
  level text,
  sort_order integer not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.experiences (
  id uuid primary key default gen_random_uuid(),
  organization text not null,
  role text not null,
  location text,
  period text,
  description text,
  highlights jsonb not null default '[]'::jsonb,
  sort_order integer not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  slug text unique,
  title text not null,
  category text,
  description text,
  tools jsonb not null default '[]'::jsonb,
  result text,
  image_url text,
  project_url text,
  repository_url text,
  sort_order integer not null default 0,
  featured boolean not null default false,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.projects add column if not exists slug text;
create unique index if not exists projects_slug_key on public.projects (slug);

create table if not exists public.certificates (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  issuer text,
  issued_at text,
  credential_url text,
  sort_order integer not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.education (
  id uuid primary key default gen_random_uuid(),
  school text not null,
  degree text,
  period text,
  description text,
  sort_order integer not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.articles (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text unique,
  excerpt text,
  content text,
  published_at text,
  sort_order integer not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.social_links (
  id uuid primary key default gen_random_uuid(),
  label text not null,
  url text not null,
  sort_order integer not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  message text not null,
  created_at timestamptz not null default now()
);

alter table public.admin_users enable row level security;
alter table public.profiles enable row level security;
alter table public.skills enable row level security;
alter table public.experiences enable row level security;
alter table public.projects enable row level security;
alter table public.certificates enable row level security;
alter table public.education enable row level security;
alter table public.articles enable row level security;
alter table public.social_links enable row level security;
alter table public.contact_messages enable row level security;

drop policy if exists "Admins can read admin list" on public.admin_users;
drop policy if exists "Public can read profiles" on public.profiles;
drop policy if exists "Admins can manage profiles" on public.profiles;
drop policy if exists "Public can read published skills" on public.skills;
drop policy if exists "Admins can manage skills" on public.skills;
drop policy if exists "Public can read published experiences" on public.experiences;
drop policy if exists "Admins can manage experiences" on public.experiences;
drop policy if exists "Public can read published projects" on public.projects;
drop policy if exists "Admins can manage projects" on public.projects;
drop policy if exists "Public can read published certificates" on public.certificates;
drop policy if exists "Admins can manage certificates" on public.certificates;
drop policy if exists "Public can read published education" on public.education;
drop policy if exists "Admins can manage education" on public.education;
drop policy if exists "Public can read published articles" on public.articles;
drop policy if exists "Admins can manage articles" on public.articles;
drop policy if exists "Public can read published social links" on public.social_links;
drop policy if exists "Admins can manage social links" on public.social_links;
drop policy if exists "Public can create messages" on public.contact_messages;
drop policy if exists "Admins can manage messages" on public.contact_messages;

create policy "Admins can read admin list"
on public.admin_users for select
to authenticated
using (public.is_admin());

create policy "Public can read profiles"
on public.profiles for select
to anon, authenticated
using (true);

create policy "Admins can manage profiles"
on public.profiles for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "Public can read published skills"
on public.skills for select
to anon, authenticated
using (published = true);

create policy "Admins can manage skills"
on public.skills for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "Public can read published experiences"
on public.experiences for select
to anon, authenticated
using (published = true);

create policy "Admins can manage experiences"
on public.experiences for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "Public can read published projects"
on public.projects for select
to anon, authenticated
using (published = true);

create policy "Admins can manage projects"
on public.projects for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "Public can read published certificates"
on public.certificates for select
to anon, authenticated
using (published = true);

create policy "Admins can manage certificates"
on public.certificates for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "Public can read published education"
on public.education for select
to anon, authenticated
using (published = true);

create policy "Admins can manage education"
on public.education for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "Public can read published articles"
on public.articles for select
to anon, authenticated
using (published = true);

create policy "Admins can manage articles"
on public.articles for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "Public can read published social links"
on public.social_links for select
to anon, authenticated
using (published = true);

create policy "Admins can manage social links"
on public.social_links for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "Public can create messages"
on public.contact_messages for insert
to anon, authenticated
with check (true);

create policy "Admins can manage messages"
on public.contact_messages for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

insert into public.profiles (
  id,
  full_name,
  role,
  headline,
  summary,
  location,
  email,
  phone,
  website,
  linkedin,
  telegram,
  focus_area,
  certifications,
  hero_highlight_title,
  snapshot_label,
  cta_view_projects_text,
  cta_contact_text,
  cta_about_text,
  cta_experience_text,
  featured_projects_label,
  featured_projects_title,
  cta_projects_text,
  core_skills_label,
  core_skills_title,
  cta_profile_text,
  photo_url,
  footer_text,
  footer_link_text,
  footer_link
) values (
  'main',
  'Bima Yusuf Dharmahita',
  'Early-Career IT Generalist',
  'IT Generalist dengan fokus manual software testing, Linux system administration, jaringan, dan keamanan informasi.',
  'Lulusan baru S1 Teknik Informatika dengan keahlian pada bidang administrasi umum, manual software testing, Red Hat Enterprise Linux, dan manajemen jaringan. Tersertifikasi Red Hat Certified System Administrator (RHCSA) dan Network Administrator Madya, serta memiliki pengalaman pengujian perangkat lunak manual dan penerapan ISO 27001 melalui magang di Disdukcapil Kota Malang.',
  'Banyumas, Jawa Tengah',
  'bimayusufdh@gmail.com',
  '087825249031',
  'https://bimayusufdh.bydh.my.id',
  'https://linkedin.com/in/bimayusufdh',
  'https://t.me/bimayusufdh',
  'Testing, Linux, Network',
  'RHCSA, Network Admin',
  'Testing, Linux, Network, dan Security Documentation.',
  'Professional Snapshot',
  'Lihat Project',
  'Hubungi Saya',
  'Baca Profil',
  'Lihat Pengalaman',
  'Featured Projects',
  'Project yang paling relevan',
  'Semua Project',
  'Core Skills',
  'Kemampuan utama',
  'Detail Profil',
  'About',
  'Profil Profesional',
  'Skills',
  'Kemampuan utama',
  'Education',
  'Pendidikan',
  'Experience',
  'Pengalaman',
  'Pengalaman testing, dokumentasi keamanan informasi, administrasi sistem, dan pengelolaan dokumen organisasi.',
  'Certificates',
  'Sertifikasi',
  'Kredensial yang mendukung fokus pada Linux system administration dan network administration.',
  'Projects',
  'Project Portofolio',
  'Kumpulan project yang menunjukkan pengalaman pada software testing, dokumentasi keamanan informasi, dan proses kerja teknis.',
  'Contact',
  'Mari Terhubung',
  'Terbuka untuk diskusi peluang kerja, project, dan kolaborasi profesional.',
  'Direct Contact',
  'Kontak profesional',
  'assets/profile.jpg',
  'Bima Yusuf Dharmahita',
  'bimayusufdh.bydh.my.id',
  'https://bimayusufdh.bydh.my.id'
) on conflict (id) do update set
  full_name = excluded.full_name,
  role = excluded.role,
  headline = excluded.headline,
  summary = excluded.summary,
  location = excluded.location,
  email = excluded.email,
  phone = excluded.phone,
  website = excluded.website,
  linkedin = excluded.linkedin,
  photo_url = excluded.photo_url,
  footer_text = excluded.footer_text,
  footer_link_text = excluded.footer_link_text,
  footer_link = excluded.footer_link;

insert into public.skills (title, category, description, level, sort_order, published) values
('Manual Software Testing', 'Teknis', 'Test case, pengujian fungsional, validasi fitur, dokumentasi hasil uji, dan pelaporan bug.', 'Core', 1, true),
('Linux System Administrator', 'Teknis', 'Administrasi Red Hat Enterprise Linux 9, jaringan dasar, storage, LVM, keamanan dasar, dan SELinux.', 'Certified', 2, true),
('Network Administrator', 'Teknis', 'Pemahaman administrasi jaringan dan praktik operasional jaringan pada lingkungan organisasi.', 'Certified', 3, true),
('Information Security', 'Teknis', 'Penyusunan SOP, manajemen risiko aplikasi, review kontrol keamanan, dan dokumentasi ISO 27001.', 'Applied', 4, true),
('Administrasi Dokumen', 'Operasional', 'Pengarsipan, penomoran dokumen, notulensi, surat resmi, proposal, dan laporan pertanggungjawaban.', 'Applied', 5, true),
('Komunikasi, Kolaborasi, Adaptasi', 'Non-Teknis', 'Terbiasa bekerja lintas tim, berdiskusi, melakukan revisi dokumen, dan menyelesaikan masalah.', 'Professional', 6, true),
('Bahasa Indonesia dan Inggris', 'Bahasa', 'Mampu berkomunikasi profesional dalam Bahasa Indonesia dan memahami Bahasa Inggris.', 'Working', 7, true);

insert into public.experiences (organization, role, location, period, description, highlights, sort_order, published) values
('Dinas Kependudukan dan Pencatatan Sipil Kota Malang', 'Software Tester - Magang MSIB Batch 7', 'Malang, Indonesia', 'September 2024 - Desember 2024', 'Bergabung dalam tim pengembangan aplikasi SIKAP sebagai Software Tester dan ikut mendukung penerapan ISO 27001 di lingkungan dinas.', '["Membuat test case, menjalankan pengujian manual, serta mencatat dan melaporkan bug kepada tim pengembang.", "Menyusun SOP operasional server dan dokumen manajemen risiko aplikasi SIAPEL dan LAPORPAK.", "Melakukan review dan verifikasi penerapan kontrol keamanan informasi untuk kebutuhan ISO 27001."]'::jsonb, 1, true),
('Infinite Learning', 'MSIB 5 - Red Hat Certified System Administrator, IBM AI & Cybersecurity', 'Online', 'Agustus 2023 - Desember 2023', 'Mengikuti studi independen dengan topik Red Hat system administration, IBM Artificial Intelligence, dan IBM Cybersecurity.', '["Mempelajari praktik AI practitioner untuk mendukung transformasi digital perusahaan.", "Mempelajari pendekatan cybersecurity practitioner untuk meningkatkan daya tahan keamanan siber.", "Melakukan administrasi RHEL 9, networking, physical storage, LVM, keamanan dasar, dan SELinux."]'::jsonb, 2, true),
('BEM-KM Fakultas Teknik dan Sains', 'Staf Sekretaris Kabinet', 'Purwokerto, Indonesia', 'Agustus 2023 - Mei 2024', 'Mengelola administrasi internal organisasi, dokumentasi resmi, dan kebutuhan surat-menyurat kabinet.', '["Mengelola penyimpanan, penomoran dokumen, dan notulensi rapat.", "Memelihara surat keputusan, laporan program kerja, surat masuk, surat keluar, dan dokumen resmi lainnya.", "Membuat surat undangan, proposal, LPJ, surat keputusan, dan dokumen organisasi lainnya."]'::jsonb, 3, true);

insert into public.projects (slug, title, category, description, tools, result, sort_order, featured, published) values
('sikap-manual-testing', 'Pengujian Manual Aplikasi SIKAP', 'Software Testing', 'Melakukan pengujian manual aplikasi SIKAP Disdukcapil Kota Malang, mencakup pembuatan dan eksekusi test case, validasi fungsionalitas, dokumentasi hasil uji, serta pelaporan bug ke tim pengembang.', '["Manual Testing", "Test Case", "Bug Report", "Functional Testing"]'::jsonb, 'Membantu tim pengembang memvalidasi fitur aplikasi dan mendokumentasikan temuan pengujian secara terstruktur.', 1, true, true),
('iso-27001-disdukcapil', 'Implementasi ISO 27001 Disdukcapil Kota Malang', 'Information Security', 'Terlibat langsung dalam penerapan standar keamanan informasi ISO 27001 dengan tugas penyusunan SOP operasional server, dokumen manajemen risiko aplikasi, serta review dan verifikasi kontrol keamanan informasi.', '["ISO 27001", "Risk Management", "SOP", "Security Control Review"]'::jsonb, 'Mendukung kesiapan dokumentasi dan kontrol keamanan informasi pada lingkungan dinas.', 2, true, true);

insert into public.certificates (title, issuer, sort_order, published) values
('Red Hat Certified System Administrator (RHCSA)', 'Red Hat', 1, true),
('Network Administrator Madya', 'BNSP / Lembaga Sertifikasi terkait', 2, true);

insert into public.education (school, degree, period, description, sort_order, published) values
('Universitas Muhammadiyah Purwokerto', 'S1 Teknik Informatika', '2021 - 2025', 'IPK 3,74', 1, true);

insert into public.social_links (label, url, sort_order, published) values
('LinkedIn', 'https://linkedin.com/in/bimayusufdh', 1, true),
('Email', 'mailto:bimayusufdh@gmail.com', 2, true);
