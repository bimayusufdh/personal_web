# Portfolio CMS - Bima Yusuf Dharmahita

Website portfolio pribadi multi-page dengan public page, morph transition, dan dashboard CRUD di `/baim`.

## Stack

- Hosting: Vercel Static Hosting
- Domain: `bimayusufdh.bydh.my.id`
- Database: Supabase PostgreSQL
- Auth: Supabase Auth
- Admin: `https://bimayusufdh.bydh.my.id/baim`

## Preview Lokal

Jalankan dari folder project:

```powershell
python -m http.server 3000
```

Buka:

```text
http://localhost:3000
http://localhost:3000/baim
```

Selama Supabase belum dikonfigurasi, admin memakai mode demo lokal berbasis `localStorage`.

## Struktur Halaman

```text
/                  Overview utama
/about             Profil, skill, dan pendidikan
/experience        Pengalaman lengkap
/projects          Semua project
/projects/:slug    Detail project
/certificates      Sertifikasi
/contact           Kontak dan form pesan
/baim              Dashboard CRUD privat
```

## Setup Supabase

1. Buat project baru di Supabase.
2. Buka SQL Editor.
3. Jalankan isi file `supabase/schema.sql`.
4. Buat user admin di Authentication.
5. Ambil `user_id` admin dari tabel Auth users.
6. Jalankan query ini di SQL Editor:

```sql
insert into public.admin_users (user_id, email)
values ('USER_ID_DARI_SUPABASE', 'email-admin@example.com');
```

7. Isi `assets/config.js`:

```js
window.SUPABASE_CONFIG = {
  url: "https://PROJECT_ID.supabase.co",
  anonKey: "SUPABASE_ANON_KEY",
};
```

## DNS Hostinger

Untuk subdomain:

```text
Type: CNAME
Name: bimayusufdh
Value: cname.vercel-dns.com
TTL: 14400
```

Tambahkan custom domain ini di Vercel:

```text
bimayusufdh.bydh.my.id
```

## Deploy Vercel

Import folder ini sebagai project Vercel. Karena ini static site, tidak perlu build command.

Jika Vercel meminta output directory, gunakan:

```text
.
```
