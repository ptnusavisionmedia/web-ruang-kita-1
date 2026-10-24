-- RuangKita — akun DEMO untuk testing (user + admin).
-- Jalankan di Supabase SQL Editor SETELAH 001_schema.sql. Aman dijalankan berulang.
--
--   Pengguna : demo.user@ruangkita.test   / Demo12345
--   Admin    : demo.admin@ruangkita.test  / Admin12345
--
-- PENTING: hapus akun ini sebelum production (lihat bagian bawah file).

-- Pembaruan trigger pelindung role (sama dengan di migration) agar skrip ini jalan
-- walau 001_schema.sql dijalankan versi lama.
create or replace function public.protect_profile_role()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  -- Pengguna biasa tidak boleh menaikkan role sendiri. Perubahan dari SQL Editor / Table Editor /
  -- service role (auth.uid() null) dan dari admin tetap diizinkan.
  if new.role is distinct from old.role and auth.uid() is not null and not public.is_admin() then
    new.role = old.role;
  end if;
  return new;
end;
$$;

do $$
declare
  rec record;
  uid uuid;
begin
  for rec in
    select * from (values
      ('demo.user@ruangkita.test',  'Demo12345',  'Pengguna Demo', 'user'),
      ('demo.admin@ruangkita.test', 'Admin12345', 'Admin Demo',    'admin')
    ) as t(email, pass, full_name, role)
  loop
    select id into uid from auth.users where email = rec.email;

    if uid is null then
      uid := gen_random_uuid();

      insert into auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at,
        confirmation_token, recovery_token, email_change, email_change_token_new
      ) values (
        '00000000-0000-0000-0000-000000000000', uid, 'authenticated', 'authenticated',
        rec.email, extensions.crypt(rec.pass, extensions.gen_salt('bf')), now(),
        '{"provider":"email","providers":["email"]}'::jsonb,
        jsonb_build_object('full_name', rec.full_name),
        now(), now(), '', '', '', ''
      );

      insert into auth.identities (
        id, user_id, provider_id, provider, identity_data, last_sign_in_at, created_at, updated_at
      ) values (
        gen_random_uuid(), uid, uid::text, 'email',
        jsonb_build_object('sub', uid::text, 'email', rec.email, 'email_verified', true),
        now(), now(), now()
      );
    end if;

    -- Profil dibuat otomatis oleh trigger on_auth_user_created; pastikan ada lalu set role.
    insert into public.profiles (id, full_name, role)
    values (uid, rec.full_name, rec.role)
    on conflict (id) do update set full_name = excluded.full_name, role = excluded.role;
  end loop;
end $$;

-- Cek hasilnya:
-- select u.email, p.full_name, p.role, u.email_confirmed_at is not null as confirmed
--   from auth.users u join public.profiles p on p.id = u.id
--  where u.email like '%@ruangkita.test';

-- ------------------------------------------------------------
-- Menghapus akun demo (hapus tanda komentar):
-- delete from auth.users where email in ('demo.user@ruangkita.test', 'demo.admin@ruangkita.test');
-- ------------------------------------------------------------
