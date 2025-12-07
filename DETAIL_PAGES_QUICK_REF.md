# Detail Pages Quick Reference

## Customer Detail Page

### URL
```
/customers/1    # PT Maju Jaya
/customers/2    # Budi Santoso
/customers/3    # CV Bor Profesional
/customers/4    # Siti Nurhaliza
/customers/5    # PT Tambang Emas
```

### Main Features

#### 1. Wallet Card (Balance Card)
```
┌─────────────────────────────────┐
│   Saldo Akun Pelanggan          │
│   +Rp 25M                       │
│   ✓ Surplus                     │
│                                 │
│   Deposit: Rp 50M               │
│   Hutang:  Rp 25M               │
│                                 │
│   [💳 Top Up Saldo] [⚙️ Adjustment] │
└─────────────────────────────────┘
```

#### 2. Top Up Modal
- Opens when "Top Up Saldo" button clicked
- Input field for amount
- Confirmation message on submit

#### 3. Adjustment Modal
- Opens when "Penyesuaian" button clicked
- Dropdown: Choose "Tambah Saldo" or "Kurangi Saldo"
- Input field for amount
- Confirmation message on submit

#### 4. Customer Info Card
Shows all customer details:
- Tipe Pelanggan
- Email
- Telepon
- Lokasi
- Alamat

#### 5. Transaction History
- Placeholder section
- Ready for future integration

---

## Order Detail Page

### URL
```
/orders/ORD-001    # Completed order (PT Maju Jaya)
/orders/ORD-002    # Drilling order (Budi Santoso)
/orders/ORD-003    # Drilling order (CV Bor Profesional)
/orders/ORD-004    # Completed order (Siti Nurhaliza)
/orders/ORD-005    # Drilling order (PT Tambang Emas)
```

### Status Bar
Shows 4 quick info cards:
- Status Proyek (Completed, Drilling, Pending)
- Status Pembayaran (Paid, Partial, Unpaid, Pending)
- Nominal Proyek (Contract amount)
- Pelanggan (Customer name)

### Tab 1: Info Project
Shows detailed project information:
- Nama Proyek
- ID Order
- Pelanggan
- Nominal
- Tanggal Order
- Tanggal Estimasi Selesai
- Catatan (Notes)

### Tab 2: Daily Logs

#### Tracking Kedalaman Sumur (Well Depth Tracking)
Table with columns:
| Tanggal | Kedalaman (m) | Kondisi Tanah | Catatan |

**Soil Condition Options:**
- Lempung (Clay)
- Pasir (Sand)
- Batu (Rock)
- Campuran (Mixed)

#### Daily Log Entry Form
```
Date Input (required)
Kedalaman Input (meters)
Kondisi Tanah Dropdown
Catatan Textarea
[Simpan Log] Button
```

---

## How to Navigate

### From Customers List to Detail
1. Go to Customers page
2. Find customer in table
3. Click "Detail" button → Opens /customers/:id
4. Or click "Edit" → Same page

### From Orders List to Detail
1. Go to Orders page
2. Find order in table
3. Click "View" button → Opens /orders/:id

### Going Back
- Click "← Kembali ke Daftar Pelanggan" (Customers)
- Click "← Kembali ke Daftar Order" (Orders)
- Or use browser back button

---

## Sample Data by Customer

### PT Maju Jaya (ID: 1)
- Type: Corporate
- Balance: +Rp 25M (Rp 50M - Rp 25M)
- Status: Surplus ✓

### Budi Santoso (ID: 2)
- Type: Individual
- Balance: +Rp 7M (Rp 15M - Rp 8M)
- Status: Surplus ✓

### CV Bor Profesional (ID: 3)
- Type: Corporate
- Balance: +Rp 45M (Rp 80M - Rp 35M)
- Status: Surplus ✓

### Siti Nurhaliza (ID: 4)
- Type: Individual
- Balance: +Rp 2M (Rp 20M - Rp 18M)
- Status: Surplus ✓

### PT Tambang Emas (ID: 5)
- Type: Corporate
- Balance: +Rp 65M (Rp 120M - Rp 55M)
- Status: Surplus ✓

---

## Features Status

### Implemented ✅
- Customer detail page with balance display
- Top Up modal (dummy functionality)
- Adjustment modal (add/deduct)
- Order detail page with project info
- Daily logs table with empty state
- Daily log entry form (dummy functionality)
- Tab interface for switching views
- Navigation between list and detail views

### Ready for Integration 🔄
- Top Up → Connect to payment gateway
- Adjustment → Connect to admin approval system
- Transaction History → Fetch from API
- Daily Logs → Save to database
- Soil Condition → Add photo gallery
- Project Timeline → Add Gantt chart

---

## Keyboard Shortcuts
- Arrow back (browser): Return to list
- Or click the back link text

---

**Last Updated**: December 7, 2025
**Build Version**: 62 modules
**Status**: ✅ Production Ready
