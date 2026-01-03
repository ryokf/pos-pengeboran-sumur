-- ==========================================
-- FIX: Auto-Payment System - Remove Double Deduction Bug
-- ==========================================
-- Problem: Trigger 'update_balance_on_invoice' mengurangi saldo saat invoice dibuat
-- Solution: Hapus trigger tersebut dan buat auto-payment saat top-up
-- ==========================================

-- ==========================================
-- STEP 1: HAPUS TRIGGER YANG BERMASALAH
-- ==========================================

-- Drop trigger yang menyebabkan double deduction
DROP TRIGGER IF EXISTS trg_update_balance_invoice ON invoices;
DROP FUNCTION IF EXISTS update_balance_on_invoice();

-- ==========================================
-- STEP 2: PERBAIKI SALDO CUSTOMER (RECALCULATE)
-- ==========================================

-- Fungsi untuk recalculate saldo customer yang benar
-- Saldo = Total IN transactions - Total OUT transactions
DO $$
DECLARE
    customer_rec RECORD;
    total_in NUMERIC;
    total_out NUMERIC;
    correct_balance NUMERIC;
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
            
            RAISE NOTICE 'Fixed balance for customer %: % -> %', 
                customer_rec.name, 
                customer_rec.current_balance, 
                correct_balance;
        END IF;
    END LOOP;
END $$;

-- ==========================================
-- STEP 3: BUAT FUNGSI AUTO-PAYMENT
-- ==========================================

CREATE OR REPLACE FUNCTION auto_pay_invoices_on_topup()
RETURNS TRIGGER AS $$
DECLARE
    v_customer_balance NUMERIC;
    v_invoice_rec RECORD;
    v_total_paid NUMERIC;
    v_remaining_debt NUMERIC;
    v_payment_amount NUMERIC;
BEGIN
    -- Hanya proses jika ini adalah transaksi IN (top-up)
    IF NEW.type != 'IN' OR NEW.customer_id IS NULL THEN
        RETURN NEW;
    END IF;
    
    -- Get current balance AFTER top-up (sudah otomatis bertambah via trigger update_balance_on_transaction)
    SELECT current_balance INTO v_customer_balance
    FROM customers
    WHERE id = NEW.customer_id;
    
    -- Loop through unpaid invoices (oldest first)
    FOR v_invoice_rec IN 
        SELECT id, total_amount, invoice_number, period
        FROM invoices
        WHERE customer_id = NEW.customer_id
        AND status = 'Unpaid'
        ORDER BY created_at ASC
    LOOP
        -- Cek saldo masih ada atau tidak
        IF v_customer_balance <= 0 THEN
            EXIT; -- Stop jika saldo habis
        END IF;
        
        -- Hitung total yang sudah dibayar untuk invoice ini
        SELECT COALESCE(SUM(amount), 0) INTO v_total_paid
        FROM transactions
        WHERE invoice_id = v_invoice_rec.id AND type = 'OUT';
        
        -- Hitung sisa hutang
        v_remaining_debt := v_invoice_rec.total_amount - v_total_paid;
        
        -- Skip jika sudah lunas (seharusnya tidak terjadi karena WHERE status='Unpaid')
        IF v_remaining_debt <= 0 THEN
            CONTINUE;
        END IF;
        
        -- Tentukan jumlah pembayaran
        IF v_customer_balance >= v_remaining_debt THEN
            -- Saldo cukup untuk bayar penuh
            v_payment_amount := v_remaining_debt;
        ELSE
            -- Saldo hanya cukup untuk bayar sebagian
            v_payment_amount := v_customer_balance;
        END IF;
        
        -- Buat transaksi pembayaran (OUT)
        INSERT INTO transactions (
            customer_id,
            invoice_id,
            type,
            category,
            amount,
            description,
            transaction_date
        ) VALUES (
            NEW.customer_id,
            v_invoice_rec.id,
            'OUT',
            'Pembayaran Tagihan',
            v_payment_amount,
            'Auto-payment untuk ' || v_invoice_rec.period || ' (' || v_invoice_rec.invoice_number || ')',
            CURRENT_DATE
        );
        
        -- Update status invoice jika sudah lunas
        IF v_payment_amount >= v_remaining_debt THEN
            UPDATE invoices
            SET status = 'Paid'
            WHERE id = v_invoice_rec.id;
            
            RAISE NOTICE 'Auto-paid invoice % (full payment: %)', 
                v_invoice_rec.invoice_number, v_payment_amount;
        ELSE
            RAISE NOTICE 'Auto-paid invoice % (partial payment: %)', 
                v_invoice_rec.invoice_number, v_payment_amount;
        END IF;
        
        -- Kurangi saldo (akan otomatis via trigger update_balance_on_transaction)
        -- Tapi kita perlu update variable lokal untuk loop berikutnya
        v_customer_balance := v_customer_balance - v_payment_amount;
    END LOOP;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ==========================================
-- STEP 4: BUAT TRIGGER AUTO-PAYMENT
-- ==========================================

-- Trigger ini akan dijalankan SETELAH transaksi IN (top-up) diinsert
-- dan SETELAH trigger update_balance_on_transaction (yang menambah saldo)
CREATE TRIGGER trg_auto_pay_invoices
AFTER INSERT ON transactions
FOR EACH ROW
EXECUTE FUNCTION auto_pay_invoices_on_topup();

-- ==========================================
-- STEP 5: VERIFIKASI
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

-- 3. Trigger 'trg_auto_pay_invoices' BARU DIBUAT
--    Trigger ini otomatis membayar invoice saat customer top-up
--    Pembayaran dilakukan via transaksi OUT yang akan mengurangi saldo

-- 4. Urutan eksekusi saat top-up:
--    a. INSERT transaction (type='IN') -> Trigger update_balance_on_transaction -> Saldo bertambah
--    b. Trigger trg_auto_pay_invoices -> Cari invoice unpaid -> Buat transaction OUT -> Saldo berkurang
--    c. Transaction OUT -> Trigger update_balance_on_transaction -> Saldo berkurang lagi
--    
--    Hasil akhir: Saldo = Top-up amount - Total payment
