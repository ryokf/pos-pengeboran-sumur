# Database Migration - Auto-Payment System

## Cara Menjalankan Migration

### 1. Buka Supabase Dashboard

- Login ke [Supabase Dashboard](https://supabase.com/dashboard)
- Pilih project Anda
- Klik **SQL Editor** di sidebar kiri

### 2. Jalankan Script Migration

- Buka file `auto_payment_trigger.sql`
- Copy seluruh isi file
- Paste ke SQL Editor di Supabase
- Klik **Run** atau tekan `Ctrl+Enter` (Windows/Linux) atau `Cmd+Enter` (Mac)

### 3. Verifikasi Hasil

Setelah script berhasil dijalankan, Anda akan melihat:

- **NOTICE messages** yang menunjukkan customer mana saja yang saldo-nya diperbaiki
- **Query result** yang menampilkan ringkasan saldo dan invoice setiap customer

### 4. Cek Perubahan

```sql
-- Cek saldo customer
SELECT name, current_balance FROM customers;

-- Cek invoice yang belum dibayar
SELECT customer_id, invoice_number, period, total_amount, status
FROM invoices
WHERE status = 'Unpaid';

-- Cek transaksi terakhir
SELECT * FROM transactions
ORDER BY created_at DESC
LIMIT 10;
```

## Apa yang Dilakukan Script Ini?

### ✅ STEP 1: Hapus Trigger Bermasalah

Menghapus trigger `update_balance_on_invoice` yang menyebabkan saldo customer berkurang 2 kali.

### ✅ STEP 2: Perbaiki Saldo Customer

Recalculate saldo semua customer berdasarkan transaksi yang sebenarnya:

- Saldo = Total IN (top-up) - Total OUT (pembayaran)

### ✅ STEP 3: Buat Fungsi Auto-Payment

Fungsi yang otomatis membayar invoice saat customer top-up:

- Bayar invoice dari yang paling lama
- Jika saldo cukup → bayar penuh, status invoice = 'Paid'
- Jika saldo tidak cukup → bayar sebagian, status tetap 'Unpaid'

### ✅ STEP 4: Buat Trigger Auto-Payment

Trigger yang memanggil fungsi auto-payment setiap kali ada transaksi IN (top-up).

## Testing

Setelah migration, test dengan scenario berikut:

### Test 1: Auto-payment saat top-up

```sql
-- Buat customer test dengan invoice
INSERT INTO customers (id, name, current_balance)
VALUES ('test-001', 'Test Customer', 0);

INSERT INTO invoices (customer_id, invoice_number, period, total_amount, status)
VALUES ('test-001', 'INV/TEST/001', 'Januari 2026', 50000, 'Unpaid');

-- Top-up 100,000
INSERT INTO transactions (customer_id, type, category, amount)
VALUES ('test-001', 'IN', 'Top Up', 100000);

-- Cek hasil
SELECT current_balance FROM customers WHERE id = 'test-001';
-- Expected: 50000 (100000 - 50000)

SELECT status FROM invoices WHERE customer_id = 'test-001';
-- Expected: 'Paid'

-- Cleanup
DELETE FROM transactions WHERE customer_id = 'test-001';
DELETE FROM invoices WHERE customer_id = 'test-001';
DELETE FROM customers WHERE id = 'test-001';
```

## Rollback (Jika Diperlukan)

Jika ada masalah dan ingin rollback:

```sql
-- 1. Hapus trigger auto-payment
DROP TRIGGER IF EXISTS trg_auto_pay_invoices ON transactions;
DROP FUNCTION IF EXISTS auto_pay_invoices_on_topup();

-- 2. Restore trigger lama (TIDAK DISARANKAN - ini yang bermasalah!)
-- Jangan jalankan ini kecuali benar-benar diperlukan
```

## Catatan Penting

⚠️ **Backup Data**: Pastikan Anda sudah backup data sebelum menjalankan migration

⚠️ **Production**: Jika ini production database, test dulu di development/staging

✅ **Safe to Run**: Script ini aman dijalankan berkali-kali (idempotent)
