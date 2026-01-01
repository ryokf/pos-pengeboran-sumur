-- Fix: Remove constraints on usage_amount column and ensure it accepts values

-- First, check if column exists and drop it if there are issues
-- Then recreate it with proper settings
DO $$ 
BEGIN
    -- Drop the column if it exists with wrong constraints
    IF EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'meter_readings' 
        AND column_name = 'usage_amount'
    ) THEN
        ALTER TABLE meter_readings DROP COLUMN usage_amount;
    END IF;
    
    -- Add the column with correct settings
    ALTER TABLE meter_readings 
    ADD COLUMN usage_amount DECIMAL(10, 2);
    
    -- Update existing records
    UPDATE meter_readings 
    SET usage_amount = COALESCE(current_value - previous_value, 0);
    
END $$;

-- Verify the column was created correctly
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'meter_readings' AND column_name = 'usage_amount';
