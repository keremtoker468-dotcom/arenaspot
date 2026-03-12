# Auth Fix — Email Onaysız Kayıt

## Problem
Supabase email confirmation açık. signUp() session dönmüyor → kullanıcı giriş yapamıyor.
Kullanıcı email onayı istemiyor, kayıt anında direkt giriş olmalı.

## Tasks

- [ ] Task 1: Auto-confirm trigger oluştur
  - **AC:** `auth.users` INSERT trigger'ı email_confirmed_at ve confirmed_at alanlarını otomatik doldurur
  - **AC:** `mcp__Supabase__execute_sql` ile doğrula: yeni user'ın email_confirmed_at NOT NULL
  - **AC:** Migration dosyası `00003_auto_confirm_email.sql` oluşturulur

- [ ] Task 2: Mevcut onaylanmamış kullanıcıları onayla
  - **AC:** `auth.users` tablosunda `email_confirmed_at IS NULL` olan tüm kullanıcılar onaylanır
  - **AC:** SQL ile doğrula: 0 unconfirmed user kalmalı

- [ ] Task 3: Signup flow'u güncelle — email onay ekranını kaldır
  - **AC:** AuthModal.tsx: signup sonrası direkt onboarding'e yönlendir (email onay ekranı kaldır)
  - **AC:** auth/page.tsx: aynı güncelleme
  - **AC:** `npm run build` hatasız

- [ ] Task 4: Build, commit, push
  - **AC:** `npm run build` başarılı
  - **AC:** Tüm değişiklikler commit edildi
  - **AC:** Push başarılı
