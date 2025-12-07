# Dashboard - Quick Reference Guide

## Helicopter View Metrics

### 4 Main KPI Cards

#### 1. 💰 Total Saldo Pelanggan
- **Formula**: Σ(Total Deposit - Total Debt) for all customers
- **Current Value**: Rp 144M (285M deposit - 141M debt)
- **Purpose**: Shows net customer account balance
- **Action**: Monitor positive/negative trends

#### 2. 💵 Uang Kas Kantor
- **Value**: Rp 45M (Real cash on hand)
- **Purpose**: Quick view of available office cash
- **Action**: Track daily cash flow

#### 3. ⛏️ Proyek Aktif
- **Count**: 3 active drilling projects
- **Filter**: Orders with status = "Drilling"
- **Current Projects**:
  - Sumur Pribadi Bandung (Budi Santoso)
  - Proyek Besar Surabaya (CV Bor Profesional)
  - Proyek Pertambangan Makassar (PT Tambang Emas)
- **Purpose**: Real-time project pipeline view

#### 4. ⚠️ Piutang Macet
- **Value**: Rp 108M (Total debt across all customers)
- **Components**:
  - PT Maju Jaya: Rp 25M
  - Budi Santoso: Rp 8M
  - CV Bor Profesional: Rp 35M
  - Siti Nurhaliza: Rp 18M
  - PT Tambang Emas: Rp 55M
- **Purpose**: Identify payment collection focus

## Income vs Expense Chart

**Monthly Comparison** (Last 5 months):
- Green bars = Income (Revenue from projects)
- Red bars = Expense (Operating costs)
- Current trend: Profit margin improving

| Month | Income | Expense | Profit |
|-------|--------|---------|--------|
| Aug | Rp 2.5M | Rp 1.2M | Rp 1.3M |
| Sep | Rp 4.2M | Rp 1.8M | Rp 2.4M |
| Oct | Rp 5.8M | Rp 2.5M | Rp 3.3M |
| Nov | Rp 8.1M | Rp 3.2M | Rp 4.9M |
| Dec | Rp 10M | Rp 4M | Rp 6M |

## Action-Required Tables

### Top 5 Piutang Terbesar (High Priority)
**Purpose**: Immediate payment collection follow-up

| Rank | Customer | Type | Debt |
|------|----------|------|------|
| 1 | PT Tambang Emas | Corporate | Rp 55M |
| 2 | CV Bor Profesional | Corporate | Rp 35M |
| 3 | PT Maju Jaya | Corporate | Rp 25M |
| 4 | Siti Nurhaliza | Individual | Rp 18M |
| 5 | Budi Santoso | Individual | Rp 8M |

**Actions**:
- ☑️ Contact top 3 corporate customers for payment
- ☑️ Negotiate payment plans for large debts
- ☑️ Follow up on overdue invoices

### Top 5 Stok Barang Menipis (Procurement Alert)
**Purpose**: Inventory management and procurement planning

| Item | Current | Min | Status | Stock Value |
|------|---------|-----|--------|-------------|
| Mata Bor Diamond | 3 | 8 | 37.5% 🔴 | Rp 15M |
| Pompa Air Submersible | 2 | 5 | 40% 🔴 | Rp 16M |
| Oli Mesin Bor | 20 | 50 | 40% 🔴 | Rp 3M |
| Pipa Bor 4 Inch | 5 | 10 | 50% 🟠 | Rp 12.5M |
| Kabel Bor Kawat | 150 | 200 | 75% 🟠 | Rp 11.25M |

**Status Legend**:
- 🔴 Red (< 30%): Critical - Order immediately
- 🟠 Orange (30-100%): Low - Order soon
- 🟢 Green (> 100%): Good - Monitor

**Actions**:
- ☑️ Create purchase orders for critical items
- ☑️ Contact suppliers for delivery timeline
- ☑️ Adjust min stock levels based on usage

## Data Flow

```
Dashboard (View)
    ↓
    ├── customers → Calculates total balance & identifies debtors
    ├── orders → Filters active drilling projects
    └── inventory → Identifies low stock items
```

## How to Update

All dashboard data is **automatically calculated** from:
1. **Customers Data** (`src/data/dummyData.js`)
   - Update: `totalDeposit` and `totalDebt`
   - Effect: Saldo Pelanggan & Piutang Macet update automatically

2. **Orders Data** (`src/data/dummyData.js`)
   - Update: Add/remove orders with status "Drilling"
   - Effect: Proyek Aktif count updates automatically

3. **Dashboard Stats** (`src/data/dummyData.js`)
   - Update: `cashOnHand` and `monthlyIncome`
   - Effect: Cash & Income/Expense chart update

4. **Inventory Data** (`src/data/dummyData.js`)
   - Update: `stock` and `minStock` for items
   - Effect: Low stock table filters automatically

## Integration Ready

When connecting to API:
1. Replace dummy data with API calls in Dashboard.jsx
2. Add real-time data fetching with React hooks
3. Maintain same data structure for compatibility
4. Add data refresh intervals for live updates

Example:
```javascript
// Replace dummy data with API
useEffect(() => {
  fetchCustomers().then(setCustomers);
  fetchOrders().then(setOrders);
  fetchInventory().then(setInventory);
}, []);
```

---

**Last Updated**: December 7, 2025
**Version**: 2.0 (Revised with Business Intelligence focus)
