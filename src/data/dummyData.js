// Dummy data for Sistem Kelola Tagihan Air (Water Billing Management System)

export const customers = [
  {
    id: 1,
    name: "Pelanggan 1",
    phone: "087123456789",
    email: "contact@majujaya.com",
    address: "Jl. Merdeka No. 123, Jakarta",
    wellId: 1,
    city: "Jakarta",
    type: "Corporate",
    wellSize: 8.5,
    saldo: -25000000,
    rt: "01"
  },
  {
    id: 2,
    name: "Pelanggan 2",
    phone: "081987654321",
    email: "budi@email.com",
    address: "Jl. Gatot Subroto No. 45, Bandung",
    wellId: 1,
    city: "Bandung",
    type: "Individual",
    wellSize: 3.2,
    saldo: 7000000,
    rt: "02"
  },
  {
    id: 3,
    name: "Pelanggan 3",
    phone: "085555555555",
    email: "info@borprofesional.com",
    address: "Jl. Ahmad Yani No. 78, Surabaya",
    wellId: 1,
    city: "Surabaya",
    type: "Corporate",
    wellSize: 6,
    saldo: -120000,
    rt: "01"
  },
  {
    id: 4,
    name: "Pelanggan 4",
    phone: "089111111111",
    email: "siti.nur@email.com",
    address: "Jl. Diponegoro No. 56, Medan",
    wellId: 2,
    city: "Medan",
    type: "Individual",
    wellSize: 4.5,
    saldo: 2000000,
    rt: "03"
  },
  {
    id: 5,
    name: "Pelanggan 5",
    phone: "082222222222",
    email: "hr@tambangemaspt.com",
    address: "Jl. Sudirman No. 99, Makassar",
    wellId: 3,
    city: "Makassar",
    type: "Corporate",
    wellSize: 12,
    saldo: 65000000,
    rt: "02"
  }
];

export const orders = [
  {
    id: "ORD-001",
    customerId: 1,
    customerName: "PT Maju Jaya",
    orderDate: "2025-12-01",
    deliveryDate: "2025-12-05",
    status: "Completed",
    projectName: "Sistem Kelola Tagihan Air Jakarta Timur",
    amount: 5000000,
    paymentStatus: "Paid",
    notes: "Lokasi Jakarta Timur"
  },
  {
    id: "ORD-002",
    customerId: 2,
    customerName: "Budi Santoso",
    orderDate: "2025-12-02",
    deliveryDate: "2025-12-04",
    status: "Drilling",
    projectName: "Sumur Pribadi Bandung",
    amount: 3500000,
    paymentStatus: "Partial",
    notes: "Pembayaran 50% sudah diterima"
  },
  {
    id: "ORD-003",
    customerId: 3,
    customerName: "CV Bor Profesional",
    orderDate: "2025-12-03",
    deliveryDate: "2025-12-08",
    status: "Drilling",
    projectName: "Proyek Besar Surabaya",
    amount: 10500000,
    paymentStatus: "Unpaid",
    notes: "Lokasi Surabaya, perlu survei lanjutan"
  },
  {
    id: "ORD-004",
    customerId: 4,
    customerName: "Siti Nurhaliza",
    orderDate: "2025-11-28",
    deliveryDate: "2025-12-02",
    status: "Completed",
    projectName: "Sumur Halaman Medan",
    amount: 2800000,
    paymentStatus: "Paid",
    notes: "Pengeboran di halaman rumah"
  },
  {
    id: "ORD-005",
    customerId: 5,
    customerName: "PT Tambang Emas",
    orderDate: "2025-12-04",
    deliveryDate: "2025-12-10",
    status: "Drilling",
    projectName: "Proyek Pertambangan Makassar",
    amount: 15000000,
    paymentStatus: "Pending",
    notes: "Proyek besar, lokasi pertambangan"
  }
];

export const wells = [
  {
    id: 1,
    name: "Sumur 1",
    location: "Jl. Merdeka No. 50, Jakarta",
    city: "Jakarta",
    status: "Active",
    installationDate: "2022-03-15",
    capacity: 50, // m³ per day
    monthlyProduction: 1200, // m³
    connectedCustomers: 3,
    description: "Sumur utama untuk area Jakarta dan Bandung"
  },
  {
    id: 2,
    name: "Sumur 2",
    location: "Jl. Pahlawan No. 88, Medan",
    city: "Medan",
    status: "Active",
    installationDate: "2022-06-20",
    capacity: 30, // m³ per day
    monthlyProduction: 750, // m³
    connectedCustomers: 1,
    description: "Sumur untuk area Medan"
  },
  {
    id: 3,
    name: "Sumur 3",
    location: "Jl. Veteran No. 120, Makassar",
    city: "Makassar",
    status: "Active",
    installationDate: "2023-01-10",
    capacity: 80, // m³ per day
    monthlyProduction: 2000, // m³
    connectedCustomers: 1,
    description: "Sumur besar untuk industri di Makassar"
  },
  {
    id: 4,
    name: "Sumur 4",
    location: "Jl. Kemerdekaan No. 45, Surabaya",
    city: "Surabaya",
    status: "Maintenance",
    installationDate: "2021-11-05",
    capacity: 40, // m³ per day
    monthlyProduction: 0, // Currently under maintenance
    connectedCustomers: 0,
    description: "Sumur sedang dalam perawatan rutin"
  }
];

// Comprehensive transaction data for financial reporting
export const transactions = [
  // December 2025
  {
    id: 1,
    date: '2025-12-15',
    category: 'Pembayaran Bulanan',
    type: 'IN',
    amount: 5000000,
    description: 'Pembayaran tagihan bulan Desember',
    customer_name: 'Pelanggan 1',
    recordedBy: 'Admin Budi'
  },
  {
    id: 2,
    date: '2025-12-14',
    category: 'Gaji Karyawan',
    type: 'OUT',
    amount: 8000000,
    description: 'Pembayaran gaji bulan Desember',
    customer_name: 'Internal',
    recordedBy: 'Admin Siti'
  },
  {
    id: 3,
    date: '2025-12-12',
    category: 'Pembayaran Bulanan',
    type: 'IN',
    amount: 3500000,
    description: 'Pembayaran tagihan bulan Desember',
    customer_name: 'Pelanggan 2',
    recordedBy: 'Admin Budi'
  },
  {
    id: 4,
    date: '2025-12-10',
    category: 'Perawatan Sumur',
    type: 'OUT',
    amount: 2500000,
    description: 'Biaya perawatan Sumur 1',
    customer_name: 'Internal',
    recordedBy: 'Admin Siti'
  },
  {
    id: 5,
    date: '2025-12-08',
    category: 'Pembayaran Bulanan',
    type: 'IN',
    amount: 10500000,
    description: 'Pembayaran tagihan bulan Desember',
    customer_name: 'Pelanggan 5',
    recordedBy: 'Admin Budi'
  },
  {
    id: 6,
    date: '2025-12-05',
    category: 'Operasional',
    type: 'OUT',
    amount: 1500000,
    description: 'Biaya operasional kantor',
    customer_name: 'Internal',
    recordedBy: 'Admin Siti'
  },
  {
    id: 7,
    date: '2025-12-03',
    category: 'Pembayaran Bulanan',
    type: 'IN',
    amount: 2800000,
    description: 'Pembayaran tagihan bulan Desember',
    customer_name: 'Pelanggan 4',
    recordedBy: 'Admin Budi'
  },

  // November 2025
  {
    id: 8,
    date: '2025-11-28',
    category: 'Pembayaran Bulanan',
    type: 'IN',
    amount: 4500000,
    description: 'Pembayaran tagihan bulan November',
    customer_name: 'Pelanggan 1',
    recordedBy: 'Admin Siti'
  },
  {
    id: 9,
    date: '2025-11-25',
    category: 'Gaji Karyawan',
    type: 'OUT',
    amount: 8000000,
    description: 'Pembayaran gaji bulan November',
    customer_name: 'Internal',
    recordedBy: 'Admin Budi'
  },
  {
    id: 10,
    date: '2025-11-22',
    category: 'Pembayaran Bulanan',
    type: 'IN',
    amount: 3200000,
    description: 'Pembayaran tagihan bulan November',
    customer_name: 'Pelanggan 2',
    recordedBy: 'Admin Siti'
  },
  {
    id: 11,
    date: '2025-11-20',
    category: 'Peralatan',
    type: 'OUT',
    amount: 3500000,
    description: 'Pembelian peralatan bor',
    customer_name: 'Internal',
    recordedBy: 'Admin Budi'
  },
  {
    id: 12,
    date: '2025-11-18',
    category: 'Pembayaran Bulanan',
    type: 'IN',
    amount: 9000000,
    description: 'Pembayaran tagihan bulan November',
    customer_name: 'Pelanggan 5',
    recordedBy: 'Admin Siti'
  },
  {
    id: 13,
    date: '2025-11-15',
    category: 'Operasional',
    type: 'OUT',
    amount: 1200000,
    description: 'Biaya listrik dan air',
    customer_name: 'Internal',
    recordedBy: 'Admin Budi'
  },
  {
    id: 14,
    date: '2025-11-10',
    category: 'Pembayaran Bulanan',
    type: 'IN',
    amount: 2700000,
    description: 'Pembayaran tagihan bulan November',
    customer_name: 'Pelanggan 4',
    recordedBy: 'Admin Siti'
  },
  {
    id: 15,
    date: '2025-11-05',
    category: 'Pembayaran Proyek',
    type: 'IN',
    amount: 5000000,
    description: 'Pembayaran proyek pengeboran',
    customer_name: 'Pelanggan 3',
    recordedBy: 'Admin Budi'
  },

  // October 2025
  {
    id: 16,
    date: '2025-10-30',
    category: 'Pembayaran Bulanan',
    type: 'IN',
    amount: 4200000,
    description: 'Pembayaran tagihan bulan Oktober',
    customer_name: 'Pelanggan 1',
    recordedBy: 'Admin Siti'
  },
  {
    id: 17,
    date: '2025-10-28',
    category: 'Gaji Karyawan',
    type: 'OUT',
    amount: 7500000,
    description: 'Pembayaran gaji bulan Oktober',
    customer_name: 'Internal',
    recordedBy: 'Admin Budi'
  },
  {
    id: 18,
    date: '2025-10-25',
    category: 'Pembayaran Bulanan',
    type: 'IN',
    amount: 3000000,
    description: 'Pembayaran tagihan bulan Oktober',
    customer_name: 'Pelanggan 2',
    recordedBy: 'Admin Siti'
  },
  {
    id: 19,
    date: '2025-10-22',
    category: 'Perawatan Sumur',
    type: 'OUT',
    amount: 2000000,
    description: 'Biaya perawatan Sumur 2',
    customer_name: 'Internal',
    recordedBy: 'Admin Budi'
  },
  {
    id: 20,
    date: '2025-10-20',
    category: 'Pembayaran Bulanan',
    type: 'IN',
    amount: 8500000,
    description: 'Pembayaran tagihan bulan Oktober',
    customer_name: 'Pelanggan 5',
    recordedBy: 'Admin Siti'
  },
  {
    id: 21,
    date: '2025-10-15',
    category: 'Operasional',
    type: 'OUT',
    amount: 1800000,
    description: 'Biaya operasional kantor',
    customer_name: 'Internal',
    recordedBy: 'Admin Budi'
  },
  {
    id: 22,
    date: '2025-10-12',
    category: 'Pembayaran Bulanan',
    type: 'IN',
    amount: 2600000,
    description: 'Pembayaran tagihan bulan Oktober',
    customer_name: 'Pelanggan 4',
    recordedBy: 'Admin Siti'
  },
  {
    id: 23,
    date: '2025-10-08',
    category: 'Pembayaran Proyek',
    type: 'IN',
    amount: 6000000,
    description: 'Pembayaran DP proyek baru',
    customer_name: 'Pelanggan 3',
    recordedBy: 'Admin Budi'
  },
  {
    id: 24,
    date: '2025-10-05',
    category: 'Peralatan',
    type: 'OUT',
    amount: 2500000,
    description: 'Pembelian suku cadang',
    customer_name: 'Internal',
    recordedBy: 'Admin Siti'
  },

  // September 2025
  {
    id: 25,
    date: '2025-09-30',
    category: 'Pembayaran Bulanan',
    type: 'IN',
    amount: 4000000,
    description: 'Pembayaran tagihan bulan September',
    customer_name: 'Pelanggan 1',
    recordedBy: 'Admin Budi'
  },
  {
    id: 26,
    date: '2025-09-28',
    category: 'Gaji Karyawan',
    type: 'OUT',
    amount: 7500000,
    description: 'Pembayaran gaji bulan September',
    customer_name: 'Internal',
    recordedBy: 'Admin Siti'
  },
  {
    id: 27,
    date: '2025-09-25',
    category: 'Pembayaran Bulanan',
    type: 'IN',
    amount: 2900000,
    description: 'Pembayaran tagihan bulan September',
    customer_name: 'Pelanggan 2',
    recordedBy: 'Admin Budi'
  },
  {
    id: 28,
    date: '2025-09-22',
    category: 'Perawatan Sumur',
    type: 'OUT',
    amount: 1800000,
    description: 'Biaya perawatan Sumur 3',
    customer_name: 'Internal',
    recordedBy: 'Admin Siti'
  },
  {
    id: 29,
    date: '2025-09-20',
    category: 'Pembayaran Bulanan',
    type: 'IN',
    amount: 8000000,
    description: 'Pembayaran tagihan bulan September',
    customer_name: 'Pelanggan 5',
    recordedBy: 'Admin Budi'
  },
  {
    id: 30,
    date: '2025-09-18',
    category: 'Operasional',
    type: 'OUT',
    amount: 1600000,
    description: 'Biaya operasional kantor',
    customer_name: 'Internal',
    recordedBy: 'Admin Siti'
  },
  {
    id: 31,
    date: '2025-09-15',
    category: 'Pembayaran Bulanan',
    type: 'IN',
    amount: 2500000,
    description: 'Pembayaran tagihan bulan September',
    customer_name: 'Pelanggan 4',
    recordedBy: 'Admin Budi'
  },
  {
    id: 32,
    date: '2025-09-12',
    category: 'Pembayaran Proyek',
    type: 'IN',
    amount: 4500000,
    description: 'Pembayaran cicilan proyek',
    customer_name: 'Pelanggan 3',
    recordedBy: 'Admin Siti'
  },
  {
    id: 33,
    date: '2025-09-10',
    category: 'Peralatan',
    type: 'OUT',
    amount: 3000000,
    description: 'Pembelian pompa air',
    customer_name: 'Internal',
    recordedBy: 'Admin Budi'
  },
  {
    id: 34,
    date: '2025-09-08',
    category: 'Operasional',
    type: 'OUT',
    amount: 900000,
    description: 'Biaya listrik',
    customer_name: 'Internal',
    recordedBy: 'Admin Siti'
  },
  {
    id: 35,
    date: '2025-09-05',
    category: 'Pembayaran Bulanan',
    type: 'IN',
    amount: 3800000,
    description: 'Pembayaran tagihan bulan September',
    customer_name: 'Pelanggan 1',
    recordedBy: 'Admin Budi'
  },

  // August 2025
  {
    id: 36,
    date: '2025-08-30',
    category: 'Pembayaran Bulanan',
    type: 'IN',
    amount: 3900000,
    description: 'Pembayaran tagihan bulan Agustus',
    customer_name: 'Pelanggan 1',
    recordedBy: 'Admin Siti'
  },
  {
    id: 37,
    date: '2025-08-28',
    category: 'Gaji Karyawan',
    type: 'OUT',
    amount: 7500000,
    description: 'Pembayaran gaji bulan Agustus',
    customer_name: 'Internal',
    recordedBy: 'Admin Budi'
  },
  {
    id: 38,
    date: '2025-08-25',
    category: 'Pembayaran Bulanan',
    type: 'IN',
    amount: 2800000,
    description: 'Pembayaran tagihan bulan Agustus',
    customer_name: 'Pelanggan 2',
    recordedBy: 'Admin Siti'
  },
  {
    id: 39,
    date: '2025-08-22',
    category: 'Perawatan Sumur',
    type: 'OUT',
    amount: 2200000,
    description: 'Biaya perawatan Sumur 1',
    customer_name: 'Internal',
    recordedBy: 'Admin Budi'
  },
  {
    id: 40,
    date: '2025-08-20',
    category: 'Pembayaran Bulanan',
    type: 'IN',
    amount: 7800000,
    description: 'Pembayaran tagihan bulan Agustus',
    customer_name: 'Pelanggan 5',
    recordedBy: 'Admin Siti'
  },
  {
    id: 41,
    date: '2025-08-18',
    category: 'Operasional',
    type: 'OUT',
    amount: 1400000,
    description: 'Biaya operasional kantor',
    customer_name: 'Internal',
    recordedBy: 'Admin Budi'
  },
  {
    id: 42,
    date: '2025-08-15',
    category: 'Pembayaran Bulanan',
    type: 'IN',
    amount: 2400000,
    description: 'Pembayaran tagihan bulan Agustus',
    customer_name: 'Pelanggan 4',
    recordedBy: 'Admin Siti'
  },
  {
    id: 43,
    date: '2025-08-12',
    category: 'Pembayaran Proyek',
    type: 'IN',
    amount: 5500000,
    description: 'Pembayaran proyek pengeboran',
    customer_name: 'Pelanggan 3',
    recordedBy: 'Admin Budi'
  },
  {
    id: 44,
    date: '2025-08-10',
    category: 'Peralatan',
    type: 'OUT',
    amount: 2800000,
    description: 'Pembelian peralatan bor',
    customer_name: 'Internal',
    recordedBy: 'Admin Siti'
  },
  {
    id: 45,
    date: '2025-08-08',
    category: 'Operasional',
    type: 'OUT',
    amount: 1100000,
    description: 'Biaya listrik dan air',
    customer_name: 'Internal',
    recordedBy: 'Admin Budi'
  },

  // July 2025
  {
    id: 46,
    date: '2025-07-30',
    category: 'Pembayaran Bulanan',
    type: 'IN',
    amount: 3700000,
    description: 'Pembayaran tagihan bulan Juli',
    customer_name: 'Pelanggan 1',
    recordedBy: 'Admin Siti'
  },
  {
    id: 47,
    date: '2025-07-28',
    category: 'Gaji Karyawan',
    type: 'OUT',
    amount: 7000000,
    description: 'Pembayaran gaji bulan Juli',
    customer_name: 'Internal',
    recordedBy: 'Admin Budi'
  },
  {
    id: 48,
    date: '2025-07-25',
    category: 'Pembayaran Bulanan',
    type: 'IN',
    amount: 2700000,
    description: 'Pembayaran tagihan bulan Juli',
    customer_name: 'Pelanggan 2',
    recordedBy: 'Admin Siti'
  },
  {
    id: 49,
    date: '2025-07-22',
    category: 'Perawatan Sumur',
    type: 'OUT',
    amount: 1900000,
    description: 'Biaya perawatan Sumur 2',
    customer_name: 'Internal',
    recordedBy: 'Admin Budi'
  },
  {
    id: 50,
    date: '2025-07-20',
    category: 'Pembayaran Bulanan',
    type: 'IN',
    amount: 7500000,
    description: 'Pembayaran tagihan bulan Juli',
    customer_name: 'Pelanggan 5',
    recordedBy: 'Admin Siti'
  },
  {
    id: 51,
    date: '2025-07-18',
    category: 'Operasional',
    type: 'OUT',
    amount: 1300000,
    description: 'Biaya operasional kantor',
    customer_name: 'Internal',
    recordedBy: 'Admin Budi'
  },
  {
    id: 52,
    date: '2025-07-15',
    category: 'Pembayaran Bulanan',
    type: 'IN',
    amount: 2300000,
    description: 'Pembayaran tagihan bulan Juli',
    customer_name: 'Pelanggan 4',
    recordedBy: 'Admin Siti'
  },
  {
    id: 53,
    date: '2025-07-12',
    category: 'Pembayaran Proyek',
    type: 'IN',
    amount: 4800000,
    description: 'Pembayaran DP proyek',
    customer_name: 'Pelanggan 3',
    recordedBy: 'Admin Budi'
  },
  {
    id: 54,
    date: '2025-07-10',
    category: 'Peralatan',
    type: 'OUT',
    amount: 3200000,
    description: 'Pembelian suku cadang',
    customer_name: 'Internal',
    recordedBy: 'Admin Siti'
  },
  {
    id: 55,
    date: '2025-07-08',
    category: 'Operasional',
    type: 'OUT',
    amount: 950000,
    description: 'Biaya listrik',
    customer_name: 'Internal',
    recordedBy: 'Admin Budi'
  },
  {
    id: 56,
    date: '2025-07-05',
    category: 'Pembayaran Bulanan',
    type: 'IN',
    amount: 3600000,
    description: 'Pembayaran tagihan bulan Juli',
    customer_name: 'Pelanggan 1',
    recordedBy: 'Admin Siti'
  },

  // Additional December 2025 transactions
  {
    id: 57,
    date: '2025-12-16',
    category: 'Pembayaran Bulanan',
    type: 'IN',
    amount: 4200000,
    description: 'Pembayaran tagihan bulan Desember',
    customer_name: 'Pelanggan 3',
    recordedBy: 'Admin Budi'
  },
  {
    id: 58,
    date: '2025-12-16',
    category: 'Operasional',
    type: 'OUT',
    amount: 850000,
    description: 'Biaya ATK dan perlengkapan kantor',
    customer_name: 'Internal',
    recordedBy: 'Admin Siti'
  },
  {
    id: 59,
    date: '2025-12-15',
    category: 'Peralatan',
    type: 'OUT',
    amount: 2200000,
    description: 'Pembelian selang dan pipa',
    customer_name: 'Internal',
    recordedBy: 'Admin Budi'
  },
  {
    id: 60,
    date: '2025-12-13',
    category: 'Pembayaran Proyek',
    type: 'IN',
    amount: 6500000,
    description: 'Pembayaran pelunasan proyek',
    customer_name: 'Pelanggan 3',
    recordedBy: 'Admin Siti'
  },
  {
    id: 61,
    date: '2025-12-11',
    category: 'Operasional',
    type: 'OUT',
    amount: 1100000,
    description: 'Biaya transportasi dan BBM',
    customer_name: 'Internal',
    recordedBy: 'Admin Budi'
  },
  {
    id: 62,
    date: '2025-12-09',
    category: 'Pembayaran Bulanan',
    type: 'IN',
    amount: 3300000,
    description: 'Pembayaran tagihan bulan Desember',
    customer_name: 'Pelanggan 2',
    recordedBy: 'Admin Siti'
  },
  {
    id: 63,
    date: '2025-12-07',
    category: 'Perawatan Sumur',
    type: 'OUT',
    amount: 1700000,
    description: 'Biaya perawatan Sumur 3',
    customer_name: 'Internal',
    recordedBy: 'Admin Budi'
  },
  {
    id: 64,
    date: '2025-12-06',
    category: 'Pembayaran Bulanan',
    type: 'IN',
    amount: 2900000,
    description: 'Pembayaran tagihan bulan Desember',
    customer_name: 'Pelanggan 4',
    recordedBy: 'Admin Siti'
  },
  {
    id: 65,
    date: '2025-12-04',
    category: 'Operasional',
    type: 'OUT',
    amount: 950000,
    description: 'Biaya internet dan telepon',
    customer_name: 'Internal',
    recordedBy: 'Admin Budi'
  },
  {
    id: 66,
    date: '2025-12-02',
    category: 'Pembayaran Bulanan',
    type: 'IN',
    amount: 9500000,
    description: 'Pembayaran tagihan bulan Desember',
    customer_name: 'Pelanggan 5',
    recordedBy: 'Admin Siti'
  },
  {
    id: 67,
    date: '2025-12-01',
    category: 'Peralatan',
    type: 'OUT',
    amount: 1800000,
    description: 'Pembelian alat ukur meter',
    customer_name: 'Internal',
    recordedBy: 'Admin Budi'
  }
];

// Meter readings for tracking water usage
export const meterReadings = [
  // Customer 1 (Pelanggan 1) - wellSize: 8.5 m³
  {
    id: 1,
    customerId: 1,
    readingDate: '2025-09-01',
    meterValue: 0.0,
    recordedBy: 'Admin',
    notes: 'Pencatatan awal',
    totalCost: 0 // Initial reading, no cost
  },
  {
    id: 2,
    customerId: 1,
    readingDate: '2025-10-01',
    meterValue: 8.5,
    recordedBy: 'Admin',
    notes: 'Pencatatan rutin bulan Oktober',
    totalCost: 42500 // 8.5 m³ × Rp 5,000 (>= 5 m³)
  },
  {
    id: 3,
    customerId: 1,
    readingDate: '2025-11-01',
    meterValue: 17.0,
    recordedBy: 'Admin',
    notes: 'Pencatatan rutin bulan November',
    totalCost: 42500 // 8.5 m³ × Rp 5,000
  },
  {
    id: 4,
    customerId: 1,
    readingDate: '2025-12-01',
    meterValue: 25.5,
    recordedBy: 'Admin',
    notes: 'Pencatatan rutin bulan Desember',
    totalCost: 42500 // 8.5 m³ × Rp 5,000
  },

  // Customer 2 (Pelanggan 2) - wellSize: 3.2 m³
  {
    id: 5,
    customerId: 2,
    readingDate: '2025-09-01',
    meterValue: 0.0,
    recordedBy: 'Admin',
    notes: 'Pencatatan awal',
    totalCost: 0 // Initial reading, no cost
  },
  {
    id: 6,
    customerId: 2,
    readingDate: '2025-10-01',
    meterValue: 3.2,
    recordedBy: 'Admin',
    notes: 'Pencatatan rutin bulan Oktober',
    totalCost: 9600 // 3.2 m³ × Rp 3,000 (< 5 m³)
  },
  {
    id: 7,
    customerId: 2,
    readingDate: '2025-11-01',
    meterValue: 6.4,
    recordedBy: 'Admin',
    notes: 'Pencatatan rutin bulan November',
    totalCost: 9600 // 3.2 m³ × Rp 3,000
  },
  {
    id: 8,
    customerId: 2,
    readingDate: '2025-12-01',
    meterValue: 9.6,
    recordedBy: 'Admin',
    notes: 'Pencatatan rutin bulan Desember',
    totalCost: 9600 // 3.2 m³ × Rp 3,000
  },

  // Customer 3 (Pelanggan 3) - wellSize: 6.0 m³
  {
    id: 9,
    customerId: 3,
    readingDate: '2025-09-01',
    meterValue: 0.0,
    recordedBy: 'Admin',
    notes: 'Pencatatan awal',
    totalCost: 0 // Initial reading, no cost
  },
  {
    id: 10,
    customerId: 3,
    readingDate: '2025-10-01',
    meterValue: 6.0,
    recordedBy: 'Admin',
    notes: 'Pencatatan rutin bulan Oktober',
    totalCost: 30000 // 6.0 m³ × Rp 5,000 (>= 5 m³)
  },
  {
    id: 11,
    customerId: 3,
    readingDate: '2025-11-01',
    meterValue: 12.0,
    recordedBy: 'Admin',
    notes: 'Pencatatan rutin bulan November',
    totalCost: 30000 // 6.0 m³ × Rp 5,000
  },
  {
    id: 12,
    customerId: 3,
    readingDate: '2025-12-01',
    meterValue: 18.0,
    recordedBy: 'Admin',
    notes: 'Pencatatan rutin bulan Desember',
    totalCost: 30000 // 6.0 m³ × Rp 5,000
  },

  // Customer 4 (Pelanggan 4) - wellSize: 4.5 m³
  {
    id: 13,
    customerId: 4,
    readingDate: '2025-09-01',
    meterValue: 0.0,
    recordedBy: 'Admin',
    notes: 'Pencatatan awal',
    totalCost: 0 // Initial reading, no cost
  },
  {
    id: 14,
    customerId: 4,
    readingDate: '2025-10-01',
    meterValue: 4.5,
    recordedBy: 'Admin',
    notes: 'Pencatatan rutin bulan Oktober',
    totalCost: 13500 // 4.5 m³ × Rp 3,000 (< 5 m³)
  },
  {
    id: 15,
    customerId: 4,
    readingDate: '2025-11-01',
    meterValue: 9.0,
    recordedBy: 'Admin',
    notes: 'Pencatatan rutin bulan November',
    totalCost: 13500 // 4.5 m³ × Rp 3,000
  },
  {
    id: 16,
    customerId: 4,
    readingDate: '2025-12-01',
    meterValue: 13.5,
    recordedBy: 'Admin',
    notes: 'Pencatatan rutin bulan Desember',
    totalCost: 13500 // 4.5 m³ × Rp 3,000
  },

  // Customer 5 (Pelanggan 5) - wellSize: 12.0 m³
  {
    id: 17,
    customerId: 5,
    readingDate: '2025-09-01',
    meterValue: 0.0,
    recordedBy: 'Admin',
    notes: 'Pencatatan awal',
    totalCost: 0 // Initial reading, no cost
  },
  {
    id: 18,
    customerId: 5,
    readingDate: '2025-10-01',
    meterValue: 12.0,
    recordedBy: 'Admin',
    notes: 'Pencatatan rutin bulan Oktober',
    totalCost: 60000 // 12.0 m³ × Rp 5,000 (>= 5 m³)
  },
  {
    id: 19,
    customerId: 5,
    readingDate: '2025-11-01',
    meterValue: 24.0,
    recordedBy: 'Admin',
    notes: 'Pencatatan rutin bulan November',
    totalCost: 60000 // 12.0 m³ × Rp 5,000
  },
  {
    id: 20,
    customerId: 5,
    readingDate: '2025-12-01',
    meterValue: 36.0,
    recordedBy: 'Admin',
    notes: 'Pencatatan rutin bulan Desember',
    totalCost: 60000 // 12.0 m³ × Rp 5,000
  }
];

export const dashboardStats = {
  totalCustomerBalance: 144000000, // Sum of all customer saldo
  cashOnHand: 45000000,
  activeProjects: 3, // Projects with 'Drilling' status
  overdueDebts: 0, // No longer tracking individual debts
  monthlyIncome: [
    { month: "Aug", income: 2500000, expense: 1200000 },
    { month: "Sep", income: 4200000, expense: 1800000 },
    { month: "Oct", income: 5800000, expense: 2500000 },
    { month: "Nov", income: 8100000, expense: 3200000 },
    { month: "Dec", income: 10000000, expense: 4000000 }
  ],
  // Status Operasional Utama
  pumpStatus: 'Hidup', // 'Hidup' atau 'Mati'
  complaintsTodayCount: 3, // Jumlah keluhan hari ini
  complaints: [
    { id: 1, type: 'Air mati', time: '08:30', resident: 'Warga RT 01' },
    { id: 2, type: 'Pipa bocor', time: '10:15', resident: 'Warga RT 02' },
    { id: 3, type: 'Air kecil', time: '14:45', resident: 'Warga RT 03' }
  ],
  newConnectionQueue: 2, // Jumlah antrian pasang baru
  
  // Efisiensi Air
  totalWaterUsageThisMonth: 248.5, // Total pemakaian warga bulan ini (m³)
  
  // Keuangan Rutin
  masjidCashBalance: 85000000 // Saldo kas operasional masjid
};

export const dummyData = {
  customers,
  orders,
  wells,
  dashboardStats,
  transactions,
  meterReadings
};

