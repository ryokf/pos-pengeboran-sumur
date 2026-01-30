-- ==========================================
-- FIX: Hapus Trigger yang Menyebabkan Double Update Balance
-- ==========================================
-- 
-- MASALAH:
-- Saldo pelanggan bertambah 2x lipat karena ada 2 mekanisme update:
-- 1. Manual update di frontend (JavaScript)
-- 2. Automatic update via database trigger (PostgreSQL)
--
-- SOLUSI:
-- Hapus trigger database, biarkan frontend yang handle update balance
-- ==========================================

-- 1. Hapus Trigger Update Balance saat Insert Transaction
DROP TRIGGER IF EXISTS trg_update_balance_transaction ON transactions;
DROP FUNCTION IF EXISTS update_balance_on_transaction();

-- 2. Hapus Trigger Update Balance saat Insert Invoice
DROP TRIGGER IF EXISTS trg_update_balance_invoice ON invoices;
DROP FUNCTION IF EXISTS update_balance_on_invoice();

-- ==========================================
-- CATATAN:
-- ==========================================
-- Setelah menjalankan script ini:
-- ✅ Trigger otomatis untuk update balance akan DIHAPUS
-- ✅ Frontend akan sepenuhnya mengontrol update balance
-- ✅ Bug double update akan HILANG
--
-- Trigger yang TETAP AKTIF (tidak dihapus):
-- ✅ trg_meter_calc - Auto calculate meter readings
-- ✅ on_auth_user_created - Auto create user profile
-- ==========================================

-- Verifikasi: Cek trigger yang masih aktif
SELECT 
    trigger_name,
    event_object_table,
    action_statement
FROM information_schema.triggers
WHERE event_object_schema = 'public'
ORDER BY event_object_table, trigger_name;
