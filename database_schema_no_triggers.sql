-- ==========================================
-- CLEAN DATABASE SCHEMA - NO TRIGGERS/FUNCTIONS
-- All business logic handled in frontend
-- ==========================================

-- ==========================================
-- 1. RESET DATABASE
-- ==========================================
DROP SCHEMA public CASCADE;
CREATE SCHEMA public;

-- ==========================================
-- 2. ENUM TYPES
-- ==========================================
CREATE TYPE user_role AS ENUM ('admin', 'staff', 'technician');
CREATE TYPE customer_status AS ENUM ('active', 'inactive', 'suspended');
CREATE TYPE pump_status AS ENUM ('Hidup', 'Mati', 'Maintenance');
CREATE TYPE trans_type AS ENUM ('IN', 'OUT');
CREATE TYPE complaint_status AS ENUM ('Open', 'In Progress', 'Resolved');
CREATE TYPE invoice_status AS ENUM ('Unpaid', 'Paid', 'Cancelled');

-- ==========================================
-- 3. CONFIGURATION TABLES
-- ==========================================

CREATE TABLE app_settings (
    id SERIAL PRIMARY KEY,
    company_name TEXT NOT NULL DEFAULT 'Sistem Kelola Tagihan Air Masjid',
    address TEXT,
    phone TEXT,
    email TEXT,
    admin_fee NUMERIC DEFAULT 2500,
    is_notification_enabled BOOLEAN DEFAULT true,
    current_pump_status pump_status DEFAULT 'Hidup',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE pricing_tiers (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL, 
    min_usage INT DEFAULT 0,
    max_usage INT, 
    price_per_m3 NUMERIC NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================
-- 4. CUSTOMER & METER TABLES
-- ==========================================

CREATE TABLE customers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    phone TEXT,
    email TEXT,
    address TEXT,
    city TEXT,
    rt TEXT,
    rw TEXT,
    status customer_status DEFAULT 'active',
    meter_number TEXT,
    current_balance NUMERIC DEFAULT 0,
    join_date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Meter Readings Table (No triggers - frontend handles calculations)
CREATE TABLE meter_readings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
    period_month INT NOT NULL,
    period_year INT NOT NULL,
    reading_date DATE DEFAULT CURRENT_DATE,
    previous_value NUMERIC NOT NULL DEFAULT 0,
    current_value NUMERIC NOT NULL,
    usage_amount NUMERIC NOT NULL,
    notes TEXT,
    recorded_by UUID,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================
-- 5. FINANCIAL TABLES
-- ==========================================

CREATE TABLE invoices (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    customer_id UUID REFERENCES customers(id),
    reading_id UUID REFERENCES meter_readings(id),
    invoice_number TEXT,
    period TEXT,
    amount NUMERIC NOT NULL,
    admin_fee NUMERIC DEFAULT 0, 
    total_amount NUMERIC NOT NULL,
    status invoice_status DEFAULT 'Unpaid',
    due_date DATE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE transactions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    customer_id UUID REFERENCES customers(id),
    invoice_id UUID REFERENCES invoices(id), 
    type trans_type NOT NULL,
    category TEXT NOT NULL, 
    amount NUMERIC NOT NULL,
    description TEXT,
    transaction_date DATE DEFAULT CURRENT_DATE,
    recorded_by UUID,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================
-- 6. OPERATIONAL TABLES
-- ==========================================

CREATE TABLE complaints (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    customer_id UUID REFERENCES customers(id),
    type TEXT NOT NULL, 
    description TEXT,
    status complaint_status DEFAULT 'Open',
    reported_at TIMESTAMPTZ DEFAULT NOW(),
    resolved_at TIMESTAMPTZ,
    technician_notes TEXT
);

CREATE TABLE profiles (
    id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
    full_name TEXT,
    role user_role DEFAULT 'staff',
    avatar_url TEXT,
    updated_at TIMESTAMPTZ
);

-- ==========================================
-- 7. COMPUTED COLUMN FUNCTION (Read-only helper)
-- ==========================================

-- This is a read-only helper function for querying total usage
-- It does NOT modify data, so it's safe to keep
CREATE OR REPLACE FUNCTION total_usage_m3(customer_row customers)
RETURNS NUMERIC AS $$
  SELECT COALESCE(SUM(usage_amount), 0)
  FROM meter_readings
  WHERE customer_id = customer_row.id;
$$ LANGUAGE sql STABLE;

GRANT EXECUTE ON FUNCTION total_usage_m3(customers) TO anon, authenticated, service_role;

-- ==========================================
-- 8. INITIAL DATA (SEEDING)
-- ==========================================

INSERT INTO app_settings (company_name, admin_fee, current_pump_status) 
VALUES ('Tirta Masjid Berkah', 2500, 'Hidup');

INSERT INTO pricing_tiers (name, min_usage, max_usage, price_per_m3) 
VALUES 
('Rumah Tangga - Rendah', 0, 5, 3000), 
('Rumah Tangga - Tinggi', 5, 999999, 5000);

-- ==========================================
-- 9. PERMISSIONS
-- ==========================================

GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role;

ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO anon, authenticated, service_role;

-- ==========================================
-- 10. SECURITY (RLS DISABLED)
-- ==========================================

ALTER TABLE customers DISABLE ROW LEVEL SECURITY;
ALTER TABLE transactions DISABLE ROW LEVEL SECURITY;
ALTER TABLE meter_readings DISABLE ROW LEVEL SECURITY;
ALTER TABLE invoices DISABLE ROW LEVEL SECURITY;
ALTER TABLE app_settings DISABLE ROW LEVEL SECURITY;
ALTER TABLE pricing_tiers DISABLE ROW LEVEL SECURITY;
ALTER TABLE complaints DISABLE ROW LEVEL SECURITY;
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;
