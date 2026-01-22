-- Enable UUID extension if not enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Table for Flagship Events (Generative System)
CREATE TABLE IF NOT EXISTS flagship_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    flyer_url TEXT,
    description TEXT,
    date_range TEXT,
    is_active BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Table for Subevents linked to a specific Flagship Event
CREATE TABLE IF NOT EXISTS subevents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    flagship_event_id UUID REFERENCES flagship_events(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    flyer_url TEXT,
    description TEXT,
    date TEXT,
    registration_fee TEXT,
    google_form_url TEXT,
    rulebook_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Add helpful comments
COMMENT ON TABLE flagship_events IS 'Stores major recurring or one-time flagship events like Avahan.';
COMMENT ON TABLE subevents IS 'Stores specific competitions or activities occurring within a flagship event.';