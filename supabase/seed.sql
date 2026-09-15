-- SUPABASE SEED DATA SCRIPT
-- This script creates the Admin and Client users, and populates the database with mock data.

create extension if not exists "pgcrypto";
create extension if not exists "uuid-ossp";

-- Define specific UUIDs to easily link relations
DO $$
DECLARE
    admin_id uuid;
    client_id uuid;
BEGIN

-- 1. CLEANUP (Optional, but good for starting fresh if you run this multiple times)
-- Warning: This deletes everything! We will only delete what we are about to insert to avoid full wipes if not intended, but usually a seed is clean.
DELETE FROM public.applications;
DELETE FROM public.workouts;
DELETE FROM public.client_results;
DELETE FROM public.resources;

-- 2. GET OR CREATE USERS IN auth.users
SELECT id INTO admin_id FROM auth.users WHERE email = 'mahmoudkonsowa678@gmail.com' LIMIT 1;
IF admin_id IS NULL THEN
    admin_id := '10000000-0000-0000-0000-000000000001';
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, recovery_sent_at, last_sign_in_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token, email_change, email_change_token_new, recovery_token
    ) VALUES
    ('00000000-0000-0000-0000-000000000000', admin_id, 'authenticated', 'authenticated', 'mahmoudkonsowa678@gmail.com', crypt('123456', gen_salt('bf')), now(), now(), now(), '{"provider": "email", "providers": ["email"]}', '{"full_name": "Admin Mahmoud"}', now(), now(), '', '', '', '');
END IF;

SELECT id INTO client_id FROM auth.users WHERE email = 'mahmoudkonsowa3030@gmail.com' LIMIT 1;
IF client_id IS NULL THEN
    client_id := '20000000-0000-0000-0000-000000000002';
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, recovery_sent_at, last_sign_in_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token, email_change, email_change_token_new, recovery_token
    ) VALUES
    ('00000000-0000-0000-0000-000000000000', client_id, 'authenticated', 'authenticated', 'mahmoudkonsowa3030@gmail.com', crypt('123456', gen_salt('bf')), now(), now(), now(), '{"provider": "email", "providers": ["email"]}', '{"full_name": "Client Mahmoud"}', now(), now(), '', '', '', '');
END IF;

-- Note: The trigger `on_auth_user_created` will automatically create `public.profiles` for these users.
-- We just need to update the role of the admin.
UPDATE public.profiles SET role = 'admin' WHERE id = admin_id;
UPDATE public.profiles SET role = 'client' WHERE id = client_id;

-- 3. INSERT MOCK APPLICATIONS (Leads/Prospects)
INSERT INTO public.applications (full_name, email, phone, date_of_birth, athlete_age, swimming_discipline, swimming_level, club, primary_goals, gym_access, preferred_training_frequency, status, notes) VALUES
('Ahmed Ali', 'ahmed.ali@example.com', '+201012345678', '2005-03-15', 21, 'Sprint Freestyle', 'National', 'Al Ahly', 'Improve start power and underwaters', 'Yes', '3 times/week', 'new', 'Interested in 1:1 coaching'),
('Sarah Hassan', 'sarah.h@example.com', '+201112345678', '2008-07-22', 18, 'Butterfly', 'Regional', 'Zamalek', 'Build shoulder stability and endurance', 'Yes', '2 times/week', 'reviewing', ''),
('Omar Tariq', 'omar.t@example.com', '+971501234567', '2003-11-05', 23, 'Breaststroke', 'Elite', 'Hamilton Aquatics', 'Peak for Olympics trials', 'Yes', '4 times/week', 'contacted', 'Sent email to schedule a call'),
('Youssef Ibrahim', 'youssef@example.com', '+966501234567', '2010-01-10', 16, 'IM', 'Club', 'Al Hilal', 'Overall strength', 'No', '2 times/week', 'rejected', 'Too young, referred to youth program'),
('Hana Mostafa', 'hana.m@example.com', '+201212345678', '2004-09-30', 22, 'Distance Free', 'National', 'Smouha', 'Improve flip turns and pull power', 'Yes', '3 times/week', 'client', 'Started program last week'),
('Ali Karim', 'ali.k@example.com', '+97450123456', '2006-05-18', 20, 'Backstroke', 'National', 'Qatar SC', 'Fix backstroke start', 'Yes', '3 times/week', 'waitlist', 'Waitlisted for August'),
('Mona Zaki', 'mona.z@example.com', '+201099998888', '2007-12-12', 19, 'Sprint Free', 'Club', 'Heliopolis', 'Drop 0.5s in 50m Free', 'Yes', '4 times/week', 'call_scheduled', 'Call on Tuesday');

-- 4. INSERT MOCK WORKOUTS (Training Plans)
INSERT INTO public.workouts (title, description, created_by, exercises) VALUES
('Explosive Starts Protocol', 'Focus on rate of force development (RFD) for the blocks.', admin_id, '[{"name": "Box Jumps", "sets": 4, "reps": 5, "rest": "90s", "notes": "Focus on max height"}, {"name": "Med Ball Slams", "sets": 3, "reps": 8, "rest": "60s"}]'),
('Core Power for Dolphin Kicks', 'Anti-extension and rotational power for underwater kicking.', admin_id, '[{"name": "Hanging Leg Raises", "sets": 3, "reps": 12, "rest": "60s"}, {"name": "Russian Twists with Med Ball", "sets": 3, "reps": 20, "rest": "45s"}, {"name": "Plank with plate pull", "sets": 3, "reps": 10, "rest": "60s"}]'),
('Shoulder Durability & Pre-hab', 'Preventing swimmer shoulder through targeted band work.', admin_id, '[{"name": "Band Pull Aparts", "sets": 3, "reps": 20, "rest": "45s"}, {"name": "Y-T-W Raises", "sets": 3, "reps": 10, "rest": "60s", "notes": "Light weight, focus on control"}]'),
('Max Strength Block 1', 'Building absolute strength for elite athletes.', admin_id, '[{"name": "Trap Bar Deadlift", "sets": 4, "reps": 4, "rest": "120s"}, {"name": "Weighted Pull-ups", "sets": 4, "reps": 5, "rest": "120s"}, {"name": "DB Bench Press", "sets": 3, "reps": 8, "rest": "90s"}]');

-- 5. INSERT MOCK WORKOUT SESSIONS (For the client)
INSERT INTO public.workout_sessions (client_id, workout_id, scheduled_date, completed, completed_at, rpe, client_notes, coach_feedback)
SELECT client_id, id, CURRENT_DATE - INTERVAL '2 days', true, CURRENT_DATE - INTERVAL '2 days', 8, 'Felt really strong on the deadlifts.', 'Great work, let''s increase weight next week.'
FROM public.workouts WHERE title = 'Max Strength Block 1' LIMIT 1;

INSERT INTO public.workout_sessions (client_id, workout_id, scheduled_date, completed)
SELECT client_id, id, CURRENT_DATE + INTERVAL '1 day', false
FROM public.workouts WHERE title = 'Explosive Starts Protocol' LIMIT 1;

-- 6. INSERT MOCK CLIENT RESULTS (Success Stories)
INSERT INTO public.client_results (client_name, achievement, image_url, display_order) VALUES
('Ahmed Ali', 'Dropped 1.2s in 100m Free', 'https://images.unsplash.com/photo-1530549387789-4c1017266635?auto=format&fit=crop&q=80', 1),
('Sarah Hassan', 'National Gold in 200m Fly', 'https://images.unsplash.com/photo-1519311965067-36d3e5f33d39?auto=format&fit=crop&q=80', 2),
('Omar Tariq', 'Improved underwater by 5m', 'https://images.unsplash.com/photo-1563299796-b729d0af54a5?auto=format&fit=crop&q=80', 3),
('Hana Mostafa', 'Qualified for Olympic Trials', 'https://images.unsplash.com/photo-1600965962361-9025ddcd974d?auto=format&fit=crop&q=80', 4),
('Youssef Ibrahim', 'Fixed shoulder injury, back to racing', 'https://images.unsplash.com/photo-1519311965067-36d3e5f33d39?auto=format&fit=crop&q=80', 5);

-- 7. INSERT MOCK RESOURCES (PDFs, Guides)
INSERT INTO public.resources (title, slug, description, type, price, file_url) VALUES
('The Swimmer''s Core Protocol', 'swimmers-core-protocol', 'A complete 4-week guide to building core power that translates to faster underwater kicks.', 'free', 0, 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'),
('Pre-Race Activation Routine', 'pre-race-activation', 'Dynamic warm-up protocol to do behind the blocks.', 'free', 0, 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'),
('Elite Dryland Programming (E-Book)', 'elite-dryland-ebook', 'Comprehensive 12-week off-season dryland program.', 'paid', 49.99, 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf');

-- 8. GRANT RESOURCES TO CLIENT
INSERT INTO public.user_assets (user_id, asset_type, asset_name, resource_id, status)
SELECT client_id, 'resource', title, id, 'active' FROM public.resources WHERE slug = 'elite-dryland-ebook';

END $$;
