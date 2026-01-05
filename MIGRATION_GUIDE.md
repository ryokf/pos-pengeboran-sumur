# Migration Guide: Database Triggers to Frontend Logic

## Overview

This document explains the migration from database-driven business logic (triggers and functions) to frontend-driven logic in the water billing system.

## Changes Made

### 1. Database Schema Changes

**File:** `database_schema_no_triggers.sql`

**Removed:**

- ❌ `update_balance_on_transaction()` trigger function
- ❌ `trg_update_balance_transaction` trigger
- ❌ `update_balance_on_invoice()` trigger function
- ❌ `trg_update_balance_invoice` trigger
- ❌ `handle_meter_calculation()` trigger function
- ❌ `trg_meter_calc` trigger
- ❌ `handle_new_user()` trigger function (auth-related, can be kept if needed)

**Kept:**

- ✅ `total_usage_m3()` function - Read-only helper for querying, doesn't modify data

**Schema Changes:**

- `meter_readings` table columns `previous_value` and `current_value` are now regular columns (not generated)
- All columns accept manual input from frontend

### 2. Frontend Service Changes

**File:** `src/services/customerService.js`

#### A. `addTopUp()` Function

**Before:** Inserted transaction, relied on trigger to update balance
**After:**

1. Fetches current customer balance
2. Calculates new balance (current + top-up amount)
3. Updates customer balance in database
4. Creates transaction record
5. Rolls back balance if transaction insert fails

```javascript
// Old (trigger-dependent)
await supabase.from('transactions').insert([...])

// New (frontend-controlled)
const newBalance = currentBalance + amount;
await supabase.from('customers').update({ current_balance: newBalance })
await supabase.from('transactions').insert([...])
```

#### B. `addAdjustment()` Function

**Before:** Inserted transaction, relied on trigger to update balance
**After:**

1. Fetches current customer balance
2. Calculates adjustment (add or subtract)
3. Updates customer balance in database
4. Creates transaction record
5. Rolls back balance if transaction insert fails

```javascript
// Handles both positive and negative adjustments
const adjustmentAmount = type === "add" ? Math.abs(amount) : -Math.abs(amount);
const newBalance = currentBalance + adjustmentAmount;
```

#### C. `payAllUnpaidInvoices()` Function

**Before:** Created payment transactions, relied on trigger to deduct balance
**After:**

1. Fetches current customer balance
2. For each unpaid invoice:
   - Calculates payment amount
   - **Deducts from balance FIRST**
   - Updates customer balance in database
   - Creates payment transaction
   - Rolls back if transaction insert fails
   - Updates invoice status if fully paid

**Important Change:** Function signature changed from `payAllUnpaidInvoices(customerId, topUpValue)` to `payAllUnpaidInvoices(customerId)` - now uses customer balance from database instead of parameter.

#### D. `addMeterReading()` Function

**Before:** Inserted meter reading, relied on trigger to calculate previous/current values
**After:**

1. Fetches previous meter reading
2. Calculates `previous_value` (from last reading's `current_value`)
3. Calculates `current_value` (previous_value + usage_amount)
4. Inserts meter reading with calculated values
5. Calculates water cost based on pricing tiers
6. Creates invoice
7. **Deducts invoice amount from customer balance**

```javascript
// Frontend calculates meter values
const previous_value = previousReadings[0]?.current_value || 0;
const current_value = previous_value + usage_amount;

// Frontend deducts invoice from balance
const newBalance = currentBalance - totalAmount;
await supabase.from("customers").update({ current_balance: newBalance });
```

#### E. `autoPayInvoicesAfterTopUp()` Function

**Changed:** Removed `topUpValue` parameter since `payAllUnpaidInvoices` now uses customer balance directly.

```javascript
// Old
const autoPayInvoicesAfterTopUp = async (customerId, topUpValue) => {
  return await payAllUnpaidInvoices(customerId, topUpValue);
};

// New
const autoPayInvoicesAfterTopUp = async (customerId) => {
  return await payAllUnpaidInvoices(customerId);
};
```

### 3. Frontend Component Changes

**File:** `src/pages/CustomerDetail.jsx`

**Changed:** Updated `handleTopUp` to remove `topUpValue` parameter from `autoPayInvoicesAfterTopUp` call.

```javascript
// Old
const paymentResult = await autoPayInvoicesAfterTopUp(customerId, topUpValue);

// New
const paymentResult = await autoPayInvoicesAfterTopUp(customerId);
```

## Benefits of Frontend Logic

### 1. **Better Error Handling**

- Can implement rollback logic for failed operations
- More granular error messages
- Easier debugging with console logs

### 2. **Transparency**

- All business logic visible in code
- Easier to understand data flow
- No "magic" happening in database

### 3. **Flexibility**

- Easier to modify business rules
- Can add conditional logic based on UI state
- Better integration with frontend state management

### 4. **Testing**

- Can unit test business logic
- Easier to mock database calls
- Better integration testing capabilities

## Migration Steps

### Step 1: Backup Current Database

```sql
-- Create backup before migration
pg_dump your_database > backup_before_migration.sql
```

### Step 2: Run New Schema

```sql
-- Run the new schema file
psql your_database < database_schema_no_triggers.sql
```

### Step 3: Update Frontend Code

1. Replace `customerService.js` with updated version
2. Update `CustomerDetail.jsx` with new function calls
3. Test all functionality:
   - Top-up
   - Adjustments
   - Meter readings
   - Invoice payments

### Step 4: Verify Data Integrity

- Check customer balances are correct
- Verify invoices are created properly
- Confirm payments deduct from balance
- Test meter reading calculations

## Potential Issues & Solutions

### Issue 1: Race Conditions

**Problem:** Multiple simultaneous operations on same customer
**Solution:** Implement optimistic locking or queue operations

### Issue 2: Partial Failures

**Problem:** Balance updated but transaction insert fails
**Solution:** Implemented rollback logic in all functions

### Issue 3: Data Inconsistency

**Problem:** Manual database edits bypass frontend logic
**Solution:** Document that all changes must go through frontend, or create admin tools

## Testing Checklist

- [ ] Top-up adds to balance correctly
- [ ] Top-up auto-pays invoices
- [ ] Adjustments (add/deduct) work correctly
- [ ] Meter reading calculates previous/current values
- [ ] Invoice created with correct amount
- [ ] Invoice deducts from customer balance
- [ ] Payment transactions deduct from balance
- [ ] Invoice status updates to "Paid" when fully paid
- [ ] Rollback works when operations fail
- [ ] Multiple customers can be processed simultaneously

## Rollback Plan

If issues arise, you can rollback to the trigger-based system:

1. Restore database from backup
2. Revert `customerService.js` to previous version
3. Revert `CustomerDetail.jsx` to previous version
4. Run original SQL schema with triggers

## Notes

- The `total_usage_m3()` function is kept because it's read-only and doesn't modify data
- All balance updates now happen explicitly in frontend code
- Error handling includes rollback logic to maintain data integrity
- Console logs added for debugging payment and invoice operations
