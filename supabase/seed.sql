-- Arenaspot seed data
-- These are sample profiles for development/demo purposes.
-- They use fixed UUIDs since they won't be linked to real auth.users in dev.

-- Insert sample athletes
INSERT INTO public.profiles (id, username, full_name, bio, city, age, role, fight_style, weight_class, record_w, record_l, record_d, is_verified, followers_count, gym_name)
VALUES
  ('00000000-0000-0000-0000-000000000001', 'kaandemir', 'Kaan Demir', 'Beykoz Spor Kulübü. 4 yıldır aktif dövüşçü, bölgesel şampiyon.', 'İstanbul', 24, 'athlete', 'MMA', 'Welterweight', 12, 2, 0, true, 1240, 'Beykoz Fight Club'),
  ('00000000-0000-0000-0000-000000000002', 'mertyilmaz', 'Mert Yılmaz', 'Ankara Dövüş Akademisi. Ulusal şampiyon 2023.', 'Ankara', 21, 'athlete', 'Kickboks', 'Lightweight', 8, 1, 1, false, 890, 'Ankara Fight Academy'),
  ('00000000-0000-0000-0000-000000000003', 'burakarslan', 'Burak Arslan', 'Profesyonel boksör. Ege şampiyonu 2022–2023.', 'İzmir', 27, 'athlete', 'Boks', 'Middleweight', 18, 4, 2, true, 3200, 'İzmir Boxing Gym'),
  ('00000000-0000-0000-0000-000000000004', 'emrecelik', 'Emre Çelik', 'Undefeated. Power Gym İstanbul.', 'İstanbul', 22, 'athlete', 'MMA', 'Featherweight', 5, 0, 0, false, 560, 'Power Gym Istanbul'),
  ('00000000-0000-0000-0000-000000000005', 'tarikozturk', 'Tarık Öztürk', 'Muay Thai uzmanı. Tayland''da eğitim aldı.', 'Bursa', 29, 'athlete', 'Muay Thai', 'Welterweight', 22, 6, 1, true, 2100, 'Bursa Muay Thai'),
  ('00000000-0000-0000-0000-000000000006', 'serkankurt', 'Serkan Kurt', 'Ankara Boks Kulübü. Milli takım aday kadrosu.', 'Ankara', 25, 'athlete', 'Boks', 'Heavyweight', 9, 3, 0, false, 1450, 'Ankara Boxing Club');

-- Insert sample PTs
INSERT INTO public.profiles (id, username, full_name, bio, city, role, fight_style, workplace, followers_count)
VALUES
  ('00000000-0000-0000-0000-000000000007', 'zeyneppt', 'Zeynep Arslan', 'Lisanslı PT ve kickboks antrenörü. Online ve yüz yüze çalışıyorum. Salonlara açık.', 'İstanbul', 'pt', 'Kickboks,Muay Thai', 'Power Gym Istanbul', 540),
  ('00000000-0000-0000-0000-000000000008', 'canyildiz', 'Can Yıldız', 'Bağımsız antrenör. Yeni gym iş birliklerine açığım.', 'Ankara', 'pt', 'MMA,Boks', 'Freelance', 320);
