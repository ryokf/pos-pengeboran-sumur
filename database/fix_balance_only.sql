-- ==========================================
-- FIX: Remove Double Deduction Bug (Simple Version)
-- ==========================================
-- This script ONLY fixes the database side
-- Auto-payment logic is handled in frontend JavaScript
-- ==========================================

-- ==========================================
-- STEP 1: HAPUS TRIGGER YANG BERMASALAH
-- ==========================================

-- Drop trigger yang menyebabkan double deduction
DROP TRIGGER IF EXISTS trg_update_balance_invoice ON invoices;
DROP FUNCTION IF EXISTS update_balance_on_invoice();

RAISE NOTICE 'Removed problematic trigger: update_balance_on_invoice';

-- ==========================================
-- STEP 2: HAPUS DATABASE FUNCTIONS (TIDAK DIGUNAKAN LAGI)
-- ==========================================

-- Drop function yang akan diganti dengan frontend logic
DROP FUNCTION IF EXISTS pay_all_unpaid_invoices(UUID);
DROP FUNCTION IF EXISTS auto_pay_invoices_on_topup();
DROP TRIGGER IF EXISTS trg_auto_pay_invoices ON transactions;

RAISE NOTICE 'Removed database functions - logic moved to frontend';

-- ==========================================
-- STEP 3: PERBAIKI SALDO CUSTOMER (RECALCULATE)
-- ==========================================

-- Fungsi untuk recalculate saldo customer yang benar
-- Saldo = Total IN transactions - Total OUT transactions
DO $$
DECLARE
    customer_rec RECORD;
    total_in NUMERIC;
    total_out NUMERIC;
    correct_balance NUMERIC;
    fixed_count INTEGER := 0;
BEGIN
    -- Loop untuk setiap customer
    FOR customer_rec IN 
        SELECT id, name, current_balance FROM customers
    LOOP
        -- Hitung total transaksi IN (top-up, penyesuaian tambah)
        SELECT COALESCE(SUM(amount), 0) INTO total_in
        FROM transactions
        WHERE customer_id = customer_rec.id AND type = 'IN';
        
        -- Hitung total transaksi OUT (pembayaran, penyesuaian kurang)
        SELECT COALESCE(SUM(amount), 0) INTO total_out
        FROM transactions
        WHERE customer_id = customer_rec.id AND type = 'OUT';
        
        -- Saldo yang benar
        correct_balance := total_in - total_out;
        
        -- Update jika berbeda
        IF customer_rec.current_balance != correct_balance THEN
            UPDATE customers
            SET current_balance = correct_balance
            WHERE id = customer_rec.id;
            
            fixed_count := fixed_count + 1;
            
            RAISE NOTICE 'Fixed balance for customer "%": % -> %', 
                customer_rec.name, 
                customer_rec.current_balance, 
                correct_balance;
        END IF;
    END LOOP;
    
    RAISE NOTICE 'Total customers fixed: %', fixed_count;
END $$;

-- ==========================================
-- STEP 4: VERIFIKASI
-- ==========================================

-- Tampilkan saldo customer untuk verifikasi
SELECT 
    c.name,
    c.current_balance,
    COUNT(i.id) as total_invoices,
    COUNT(CASE WHEN i.status = 'Unpaid' THEN 1 END) as unpaid_invoices,
    COALESCE(SUM(CASE WHEN i.status = 'Unpaid' THEN i.total_amount ELSE 0 END), 0) as total_unpaid_amount
FROM customers c
LEFT JOIN invoices i ON i.customer_id = c.id
GROUP BY c.id, c.name, c.current_balance
ORDER BY c.name;

-- ==========================================
-- CATATAN PENTING
-- ==========================================

-- 1. Trigger 'update_balance_on_transaction' TETAP AKTIF
--    Trigger ini menambah/kurangi saldo saat transaksi IN/OUT dibuat
--    Ini BENAR dan tidak boleh dihapus

-- 2. Trigger 'update_balance_on_invoice' SUDAH DIHAPUS
--    Trigger ini yang menyebabkan double deduction
--    Invoice TIDAK LAGI otomatis mengurangi saldo saat dibuat

-- 3. AUTO-PAYMENT sekarang dilakukan di FRONTEND
--    Saat user top-up, frontend akan:
--    a. Insert transaction IN (top-up) -> Saldo bertambah
--    b. Call autoPayInvoicesAfterTopUp() -> Buat transaction OUT -> Saldo berkurang
--    c. Update invoice status menjadi 'Paid' jika lunas

-- 4. Function 'pay_all_unpaid_invoices' SUDAH DIHAPUS
--    Logic sekarang ada di customerService.js (frontend)
