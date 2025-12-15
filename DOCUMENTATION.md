# POS Pengeboran Sumur - Dokumentasi Project

## 📋 Deskripsi Project

**POS Pengeboran Sumur** adalah aplikasi web Point of Sale (POS) yang dirancang khusus untuk mengelola bisnis pengeboran dan distribusi air sumur. Aplikasi ini membantu mengelola pelanggan, tagihan bulanan, arus kas, dan operasional bisnis air sumur.

## 🎯 Tujuan Aplikasi

Aplikasi ini dibuat untuk:

- Mengelola data pelanggan yang berlangganan air sumur
- Memproses tagihan bulanan otomatis dengan sistem tarif berjenjang
- Mencatat dan memantau arus kas kantor
- Menyediakan dashboard untuk monitoring bisnis
- Mencetak resi pembayaran untuk pelanggan

## 🛠️ Teknologi yang Digunakan

### Frontend Framework

- **React 19.2.0** - Library JavaScript untuk membangun UI
- **React Router DOM 7.10.1** - Routing dan navigasi
- **Vite 7.2.4** - Build tool dan development server

### Styling

- **Tailwind CSS 4.1.17** - Utility-first CSS framework
- **@tailwindcss/vite** - Plugin Tailwind untuk Vite

### Development Tools

- **ESLint** - Linting dan code quality
- **Vite Plugin React** - Fast Refresh untuk development

## 📁 Struktur Project

\`\`\`
pos-pengeboran-sumur/
├── src/
│ ├── components/ # Komponen reusable
│ │ ├── BottomNavbar.jsx # Navigasi mobile (bottom)
│ │ ├── Sidebar.jsx # Navigasi desktop (sidebar)
│ │ ├── Header.jsx # Header aplikasi
│ │ ├── StatCard.jsx # Card untuk statistik
│ │ ├── ChartCard.jsx # Card untuk chart
│ │ ├── FormComponents.jsx # Input, Filter, Search
│ │ ├── ButtonComponents.jsx # Tombol reusable
│ │ ├── TableComponents.jsx # Komponen tabel
│ │ └── index.js # Export komponen
│ │
│ ├── pages/ # Halaman aplikasi
│ │ ├── Dashboard.jsx # Halaman dashboard
│ │ ├── Customers.jsx # Daftar pelanggan
│ │ ├── CustomerDetail.jsx # Detail pelanggan
│ │ ├── CashFlow.jsx # Arus kas kantor
│ │ ├── Billing.jsx # Proses tagihan bulanan
│ │ ├── ReceiptPrint.jsx # Cetak resi
│ │ └── Settings.jsx # Pengaturan
│ │
│ ├── hooks/ # Custom React hooks
│ │ ├── useDataFilter.js # Hook untuk filter & search
│ │ ├── useNavigation.js # Hook untuk navigasi
│ │ └── index.js # Export hooks
│ │
│ ├── utils/ # Utility functions
│ │ ├── constants.js # Konstanta & utilities
│ │ └── index.js # Export utilities
│ │
│ ├── data/ # Data dummy
│ │ └── dummyData.js # Data pelanggan, sumur, dll
│ │
│ ├── layouts/ # Layout components
│ │ └── MainLayout.jsx # Layout utama
│ │
│ ├── main.jsx # Entry point
│ ├── App.jsx # Root component
│ └── index.css # Global styles
│
├── public/ # Static assets
├── package.json # Dependencies
├── vite.config.js # Vite configuration
└── README.md # Project readme
\`\`\`

## 🎨 Fitur Utama

### 1. Dashboard

**Path:** \`/\`

Menampilkan ringkasan bisnis:

- Total saldo pelanggan
- Uang kas kantor
- Jumlah sumur aktif
- Piutang macet
- Grafik pemasukan vs pengeluaran bulanan
- 5 pelanggan dengan piutang terbesar

**File:** \`src/pages/Dashboard.jsx\`

### 2. Manajemen Pelanggan

**Path:** \`/customers\`

Fitur:

- Daftar semua pelanggan
- Search berdasarkan nama, email, telepon
- Filter berdasarkan tipe (Individual/Corporate)
- Informasi sumur yang digunakan
- Total penggunaan air (m³)
- Saldo pelanggan (positif/negatif)
- Tombol untuk melihat detail pelanggan

**File:** \`src/pages/Customers.jsx\`

### 3. Detail Pelanggan

**Path:** \`/customers/:customerId\`

Menampilkan:

- Informasi lengkap pelanggan
- Kontak dan alamat
- Sumur yang digunakan
- Riwayat transaksi
- Status saldo

**File:** \`src/pages/CustomerDetail.jsx\`

### 4. Arus Kas Kantor

**Path:** \`/finance/cash-flow\`

Fitur:

- Daftar transaksi masuk dan keluar
- Total pemasukan
- Total pengeluaran
- Saldo kas
- Cetak resi untuk transaksi masuk
- Kategori transaksi (Pembayaran Bulanan, Gaji, dll)

**File:** \`src/pages/CashFlow.jsx\`

### 5. Tagihan Bulanan

**Path:** \`/finance/billing\`

Fitur:

- Proses tagihan bulanan otomatis
- Sistem tarif berjenjang:
  - Sumur < 5 m³: Rp 3.000/m³
  - Sumur ≥ 5 m³: Rp 5.000/m³
- Daftar pelanggan yang akan ditagih
- Total potensi tagihan
- Simulasi proses billing

**File:** \`src/pages/Billing.jsx\`

### 6. Cetak Resi

**Path:** \`/finance/receipt/:transactionId/print\`

Mencetak resi pembayaran untuk pelanggan dengan informasi:

- Nomor resi
- Tanggal transaksi
- Nama pelanggan
- Jumlah pembayaran
- Keterangan

**File:** \`src/pages/ReceiptPrint.jsx\`

### 7. Pengaturan

**Path:** \`/settings\`

Halaman untuk konfigurasi aplikasi (dalam pengembangan)

**File:** \`src/pages/Settings.jsx\`

## 🔧 Komponen Reusable

### Navigation Components

- **Sidebar** - Navigasi desktop dengan icon dan label
- **BottomNavbar** - Navigasi mobile di bagian bawah

### Form Components

- **SearchInput** - Input pencarian
- **FilterSelect** - Dropdown filter
- **FilterBar** - Kombinasi search + filter + tombol aksi
- **PageHeader** - Header halaman dengan title & description
- **StatusBadge** - Badge untuk status
- **EmptyState** - Tampilan ketika data kosong

### Button Components

- **PrimaryButton** - Tombol utama
- **SecondaryButton** - Tombol sekunder
- **DangerButton** - Tombol untuk aksi berbahaya
- **TextButton** - Tombol text only
- **IconButton** - Tombol dengan icon

### Table Components

- **TableHeader** - Header tabel
- **DataTable** - Tabel data
- **TableRow** - Baris tabel
- **TableCell** - Cell tabel

### Card Components

- **StatCard** - Card untuk menampilkan statistik
- **ChartCard** - Card untuk chart

## 🎣 Custom Hooks

### useDataFilter

**File:** \`src/hooks/useDataFilter.js\`

Hook untuk filtering dan searching data dengan fitur:

- Search berdasarkan predicate custom
- Filter berdasarkan kriteria
- State management untuk search term dan filter value

**Usage:**
\`\`\`javascript
const {
searchTerm,
setSearchTerm,
filterValue,
setFilterValue,
filteredData
} = useDataFilter(data, {
searchPredicate: (item, term) => matchesSearch(term, item.name),
filterPredicate: (item, filter) => filter === 'All' || item.type === filter
});
\`\`\`

### useNavigation

**File:** \`src/hooks/useNavigation.js\`

Hook untuk navigasi dengan fitur:

- Deteksi active route
- Current path

**Usage:**
\`\`\`javascript
const { isActive, currentPath } = useNavigation();
\`\`\`

## 🛠️ Utility Functions

### File: \`src/utils/constants.js\`

#### STATUS_COLORS

Mapping warna untuk berbagai status:

- Payment status: Paid, Partial, Unpaid
- General status: Active
- Customer types: Individual, Corporate

#### FILTER_OPTIONS

Opsi filter untuk berbagai halaman:

- \`paymentStatus\`: ['All', 'Paid', 'Partial', 'Unpaid', 'Pending']
- \`customerType\`: ['All', 'Individual', 'Corporate']

#### PRICING_TIERS

Konfigurasi tarif berjenjang:

- \`SMALL_WELL_THRESHOLD\`: 5 m³
- \`SMALL_WELL_PRICE\`: Rp 3.000/m³
- \`LARGE_WELL_PRICE\`: Rp 5.000/m³

#### MENU_ITEMS

Daftar menu navigasi aplikasi

#### Functions:

- **getStatusColor(status)** - Mendapatkan class warna untuk status
- **formatCurrency(amount)** - Format angka ke format Rupiah
- **matchesSearch(searchTerm, ...fields)** - Helper untuk search
- **calculateMonthlyBilling(wellSize)** - Hitung tagihan bulanan
- **getInitials(name)** - Ekstrak inisial dari nama

## 📊 Data Structure

### Customer

\`\`\`javascript
{
id: number,
name: string,
phone: string,
email: string,
address: string,
wellId: number, // Referensi ke wells
city: string,
type: 'Individual' | 'Corporate',
wellSize: number, // dalam m³
saldo: number // positif = deposit, negatif = hutang
}
\`\`\`

### Well

\`\`\`javascript
{
id: number,
name: string,
location: string,
city: string,
status: 'Active' | 'Maintenance' | 'Inactive',
installationDate: string,
capacity: number,
monthlyProduction: number,
connectedCustomers: number,
description: string
}
\`\`\`

### Order

\`\`\`javascript
{
id: number,
customerName: string,
location: string,
depth: number,
diameter: number,
status: 'Completed' | 'Drilling' | 'Pending',
startDate: string,
endDate: string,
totalCost: number,
paymentStatus: 'Paid' | 'Partial' | 'Unpaid',
notes: string
}
\`\`\`

## 🎨 Design System

### Colors

- **Primary:** Blue (#2563EB)
- **Success:** Green (#10B981)
- **Danger:** Red (#EF4444)
- **Warning:** Orange/Yellow
- **Gray Scale:** Gray-50 to Gray-900

### Typography

- **Font Family:** System fonts (default)
- **Sizes:** text-xs, text-sm, text-base, text-lg, text-xl, text-2xl, text-3xl

### Spacing

Menggunakan Tailwind spacing scale (0.25rem increments)

### Border Radius

- \`rounded\`: 0.25rem
- \`rounded-lg\`: 0.5rem
- \`rounded-full\`: 9999px

## 🚀 Cara Menjalankan

### Prerequisites

- Node.js (v18 atau lebih baru)
- npm atau yarn

### Installation

\`\`\`bash

# Clone repository

git clone [repository-url]

# Masuk ke directory

cd pos-pengeboran-sumur

# Install dependencies

npm install
\`\`\`

### Development

\`\`\`bash

# Jalankan development server

npm run dev

# Aplikasi akan berjalan di http://localhost:5173

\`\`\`

### Build Production

\`\`\`bash

# Build untuk production

npm run build

# Preview production build

npm run preview
\`\`\`

### Linting

\`\`\`bash

# Run ESLint

npm run lint
\`\`\`

## 📱 Responsive Design

Aplikasi menggunakan breakpoint Tailwind CSS:

- **Mobile:** < 768px (Bottom navbar)
- **Desktop:** ≥ 768px (Sidebar)

### Mobile Features

- Bottom navigation bar
- Optimized table layout
- Touch-friendly buttons

### Desktop Features

- Sidebar navigation
- Wider table layout
- Hover effects

## 🔐 Best Practices

### Code Organization

- Komponen dipisahkan berdasarkan fungsi
- Custom hooks untuk logic reusable
- Utility functions di folder terpisah
- Konstanta terpusat

### Performance

- Component lazy loading (jika diperlukan)
- Memoization untuk expensive calculations
- Efficient re-renders

### Code Quality

- ESLint untuk code consistency
- Proper component naming
- Clear file structure
- Commented code removed

## 🔄 State Management

Saat ini menggunakan:

- **React useState** - Local component state
- **React Router** - Routing state
- **Custom hooks** - Shared logic

## 📝 Future Enhancements

Fitur yang bisa ditambahkan:

- [ ] Backend integration (API)
- [ ] Authentication & authorization
- [ ] Real-time notifications
- [ ] Export data (PDF, Excel)
- [ ] Advanced reporting
- [ ] Multi-language support
- [ ] Dark mode
- [ ] Mobile app (React Native)

## 🤝 Contributing

Untuk berkontribusi:

1. Fork repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Create Pull Request

## 📄 License

[Specify license here]

## 👥 Contact

[Contact information]

---

**Last Updated:** December 2025  
**Version:** 1.0.0
