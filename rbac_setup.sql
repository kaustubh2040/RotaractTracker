-- ACTRA ROLE-BASED ADMINISTRATION & OWNERSHIP SYSTEM (RBAC) SETUP
-- PRESERVES 100% OF EXISTING SCHEMA AND DATA
-- THIS FILE IS PROVIDED FOR DOCUMENTATION AND AD-HOC CONFIGURATION PURPOSES.
-- DO NOT EXECUTE DESTRUCTIVE MIGRATIONS.

-- 1. Verify / Setup Users table columns (already existing in live database)
-- Column positions: TEXT[] (stores BOD titles like 'President', 'Secretary')
-- Column role: VARCHAR(20) (stores legacy 'admin' or 'member' statuses)

-- 2. Seed Application Owner
-- To ensure Kaustubh Patil is always present and active as the Application Owner:
-- (Uncomment and execute if the Owner record needs initialization or synchronization)

-- INSERT INTO public.users (id, name, role, positions)
-- VALUES (
--     'owner-permanent-anchor',
--     'Kaustubh Patil',
--     'admin',
--     ARRAY['Advisor']
-- )
-- ON CONFLICT (id) DO UPDATE 
-- SET name = 'Kaustubh Patil', role = 'admin';

-- 3. Transitioning Club President
-- When transitioning to a new Rotary Year (RIY), administrative access is automatically
-- assigned by updating positions. To change President:

-- Step A: Revoke President position from previous holder
-- UPDATE public.users 
-- SET positions = array_remove(positions, 'President') 
-- WHERE 'President' = any(positions);

-- Step B: Assign President position to new President
-- UPDATE public.users 
-- SET positions = array_append(positions, 'President') 
-- WHERE name = 'Name of New President';

-- 4. Transitioning Club Secretary
-- To change Club Secretary:

-- Step A: Revoke Secretary position from previous holder
-- UPDATE public.users 
-- SET positions = array_remove(positions, 'Secretary') 
-- WHERE 'Secretary' = any(positions);

-- Step B: Assign Secretary position to new Secretary
-- UPDATE public.users 
-- SET positions = array_append(positions, 'Secretary') 
-- WHERE name = 'Name of New Secretary';
