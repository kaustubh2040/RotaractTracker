-- ACTRA Flagship Event System Schema Setup
-- This script is designed to be backward-compatible and safe for production.

-- 1. Enable UUID Extension (standard for Supabase)
-- Ensures we can generate unique identifiers for new records.
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Create FLAGSHIP_EVENTS Table
-- This table handles the top-level event details (e.g., Avahan 6.0)
CREATE TABLE IF NOT EXISTS flagship_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Event Identity
    name TEXT NOT NULL,
    flyer_url TEXT, -- Stores the public URL from Supabase Storage
    description TEXT,
    
    -- Timing details (represented as text for flexibility, e.g., "15th - 20th Oct")
    date_range TEXT,
    
    -- Status Flag: Controls public visibility on the Home Page and dedicated page
    is_active BOOLEAN DEFAULT false,
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Create SUBEVENTS Table
-- Stores specific activities or competitions linked to a Flagship event
CREATE TABLE IF NOT EXISTS subevents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Linkage: Each subevent belongs to exactly one flagship event
    -- ON DELETE CASCADE ensures sub-data is cleaned up if the parent flagship is deleted
    flagship_event_id UUID REFERENCES flagship_events(id) ON DELETE CASCADE,
    
    -- Subevent Identity
    name TEXT NOT NULL,
    flyer_url TEXT, -- Individual flyer for the specific sub-activity
    description TEXT,
    
    -- Specific Timing (e.g., "Oct 16, 10:00 AM")
    date TEXT,
    
    -- Financials (Stored as text to allow formatting like "Free" or "₹100")
    registration_fee TEXT DEFAULT '0',
    
    -- External Portals
    google_form_url TEXT, -- Direct link to registration form
    rulebook_url TEXT,    -- Link to Google Drive or PDF
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Enable Row Level Security (RLS)
-- Crucial for production safety. Default state is "locked".
-- Policies must be created in the Supabase Dashboard to allow read/write access.
ALTER TABLE flagship_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE subevents ENABLE ROW LEVEL SECURITY;

-- 5. Helper Documentation
-- Adding comments ensures clarity when browsing via the Supabase SQL Editor or Dashboard.
COMMENT ON TABLE flagship_events IS 'Root table for major club flagship events like Avahan.';
COMMENT ON COLUMN flagship_events.is_active IS 'Controls whether the event is displayed on the public home page.';
COMMENT ON COLUMN flagship_events.flyer_url IS 'Public storage URL for the main event banner.';

COMMENT ON TABLE subevents IS 'Activity/Competition level details nested under a specific Flagship Event.';
COMMENT ON COLUMN subevents.google_form_url IS 'External link to the registration portal for this specific activity.';
COMMENT ON COLUMN subevents.rulebook_url IS 'Link to the official rulebook document for participants.';