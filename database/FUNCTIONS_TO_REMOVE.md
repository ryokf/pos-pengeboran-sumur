# Database Functions to Remove

Setelah menerapkan migration `fix_balance_only.sql`, berikut adalah daftar lengkap database functions yang **sudah dihapus** atau **perlu direview**:

## ✅ Sudah Dihapus oleh Migration Script

### 1. `update_balance_on_invoice()`

**Trigger:** `trg_update_balance_invoice`  
**Alasan:** Menyebabkan double deduction (saldo dikurangi 2x)  
**Status:** ✅ **SUDAH DIHAPUS**

**Sebelumnya:**

```sql
CREATE OR REPLACE FUNCTION update_balance_on_invoice()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE customers
    SET current_balance = current_balance - NEW.total_amount
    WHERE id = NEW.customer_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```

---

### 2. `pay_all_unpaid_invoices(UUID)`

**Alasan:** Logic dipindah ke frontend (`customerService.js`)  
**Status:** ✅ **SUDAH DIHAPUS**

**Diganti dengan:** Frontend function di `customerService.js` (lines 119-251)

**Sebelumnya:**

```sql
CREATE OR REPLACE FUNCTION pay_all_unpaid_invoices(p_customer_id UUID)
RETURNS TABLE(
    success BOOLEAN,
    message TEXT,
    invoices_paid INTEGER,
    total_amount_paid NUMERIC,
    new_balance NUMERIC
) AS $$
-- ... complex PL/pgSQL logic
$$ LANGUAGE plpgsql;
```

---

### 3. `auto_pay_invoices_on_topup()`

**Trigger:** `trg_auto_pay_invoices`  
**Alasan:** Auto-payment sekarang dilakukan di frontend saat `handleTopUp`  
**Status:** ✅ **SUDAH DIHAPUS**

**Diganti dengan:** `autoPayInvoicesAfterTopUp()` di `customerService.js`

**Sebelumnya:**

```sql
CREATE OR REPLACE FUNCTION auto_pay_invoices_on_topup()
RETURNS TRIGGER AS $$
-- ... auto-payment logic in database
$$ LANGUAGE plpgsql;
```

---

## ⚠️ Perlu Review (Optional)

### 4. `total_usage_m3(customers)`

**Alasan:** Bisa dihitung di frontend dengan query sederhana  
**Status:** ⚠️ **REVIEW NEEDED**

**Cara cek apakah masih digunakan:**

```sql
-- Cek apakah function masih ada
SELECT * FROM pg_proc WHERE proname = 'total_usage_m3';

-- Cek apakah ada query yang menggunakan function ini
-- (cek di frontend code)
grep -r "total_usage_m3" src/
```

**Jika tidak digunakan, hapus dengan:**

```sql
DROP FUNCTION IF EXISTS total_usage_m3(customers);
```

**Alternatif di frontend:**

```javascript
// Daripada menggunakan computed column dari database
const { data } = await supabase.from("customers").select("*, total_usage_m3"); // ❌ Database function

// Lebih baik hitung di frontend
const { data: customer } = await supabase.from("customers").select("id, name");

const { data: readings } = await supabase
  .from("meter_readings")
  .select("usage_amount")
  .eq("customer_id", customer.id);

const totalUsage = readings.reduce((sum, r) => sum + r.usage_amount, 0); // ✅ Frontend
```

---

## ✅ Tetap Dipertahankan (JANGAN DIHAPUS!)

### 1. `update_balance_on_transaction()`

**Trigger:** `trg_update_balance_transaction`  
**Alasan:** Trigger ini **BENAR** dan diperlukan untuk update saldo saat transaksi  
**Status:** ✅ **TETAP AKTIF**

**Logic:**

```sql
CREATE OR REPLACE FUNCTION update_balance_on_transaction()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.type = 'IN' THEN
        UPDATE customers
        SET current_balance = current_balance + NEW.amount
        WHERE id = NEW.customer_id;
    ELSIF NEW.type = 'OUT' THEN
        UPDATE customers
        SET current_balance = current_balance - NEW.amount
        WHERE id = NEW.customer_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```

**Kapan dijalankan:**

- Saat INSERT transaction dengan type='IN' → Saldo bertambah
- Saat INSERT transaction dengan type='OUT' → Saldo berkurang

---

### 2. `handle_meter_calculation()`

**Trigger:** `trg_meter_calc`  
**Alasan:** Menghitung `previous_value` dan `current_value` otomatis  
**Status:** ✅ **TETAP AKTIF**

**Logic:**

- Mengisi `previous_value` dari `current_value` terakhir
- Menghitung `current_value` dari `previous_value + usage_amount`

---

### 3. `handle_new_user()`

**Trigger:** `on_auth_user_created`  
**Alasan:** Auto-create profile saat user signup  
**Status:** ✅ **TETAP AKTIF**

---

## 📊 Summary

| Function                        | Status     | Action                           |
| ------------------------------- | ---------- | -------------------------------- |
| `update_balance_on_invoice`     | ❌ Removed | ✅ Already deleted by migration  |
| `pay_all_unpaid_invoices`       | ❌ Removed | ✅ Already deleted by migration  |
| `auto_pay_invoices_on_topup`    | ❌ Removed | ✅ Already deleted by migration  |
| `total_usage_m3`                | ⚠️ Review  | ⚠️ Check if used, then delete    |
| `update_balance_on_transaction` | ✅ Keep    | ✅ Essential for balance updates |
| `handle_meter_calculation`      | ✅ Keep    | ✅ Essential for meter readings  |
| `handle_new_user`               | ✅ Keep    | ✅ Essential for user signup     |

---

## 🔍 Verification Commands

**Check remaining functions:**

```sql
SELECT
    proname as function_name,
    pg_get_functiondef(oid) as definition
FROM pg_proc
WHERE pronamespace = 'public'::regnamespace
AND prokind = 'f'
ORDER BY proname;
```

**Check remaining triggers:**

```sql
SELECT
    tgname as trigger_name,
    tgrelid::regclass as table_name,
    pg_get_triggerdef(oid) as definition
FROM pg_trigger
WHERE tgname NOT LIKE 'pg_%'
ORDER BY tgname;
```

---

## ✅ Checklist

- [x] Remove `update_balance_on_invoice` trigger and function
- [x] Remove `pay_all_unpaid_invoices` function
- [x] Remove `auto_pay_invoices_on_topup` function and trigger
- [ ] Review `total_usage_m3` usage in frontend
- [ ] Delete `total_usage_m3` if not used
- [x] Verify essential triggers still active
- [x] Test auto-payment in frontend
