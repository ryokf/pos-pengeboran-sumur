// Dummy data for POS Pengeboran Sumur (Well Drilling POS System)

export const customers = [
  {
    id: 1,
    name: "PT Maju Jaya",
    phone: "087123456789",
    email: "contact@majujaya.com",
    address: "Jl. Merdeka No. 123, Jakarta",
    city: "Jakarta",
    type: "Corporate",
    totalDeposit: 50000000,
    totalDebt: 25000000
  },
  {
    id: 2,
    name: "Budi Santoso",
    phone: "081987654321",
    email: "budi@email.com",
    address: "Jl. Gatot Subroto No. 45, Bandung",
    city: "Bandung",
    type: "Individual",
    totalDeposit: 15000000,
    totalDebt: 8000000
  },
  {
    id: 3,
    name: "CV Bor Profesional",
    phone: "085555555555",
    email: "info@borprofesional.com",
    address: "Jl. Ahmad Yani No. 78, Surabaya",
    city: "Surabaya",
    type: "Corporate",
    totalDeposit: 80000000,
    totalDebt: 35000000
  },
  {
    id: 4,
    name: "Siti Nurhaliza",
    phone: "089111111111",
    email: "siti.nur@email.com",
    address: "Jl. Diponegoro No. 56, Medan",
    city: "Medan",
    type: "Individual",
    totalDeposit: 20000000,
    totalDebt: 18000000
  },
  {
    id: 5,
    name: "PT Tambang Emas",
    phone: "082222222222",
    email: "hr@tambangemaspt.com",
    address: "Jl. Sudirman No. 99, Makassar",
    city: "Makassar",
    type: "Corporate",
    totalDeposit: 120000000,
    totalDebt: 55000000
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
    projectName: "Pengeboran Sumur Jakarta Timur",
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

export const inventory = [
  {
    id: 1,
    name: "Pipa Bor 4 Inch",
    unit: "Batang",
    stock: 5,
    minStock: 10,
    price: 2500000
  },
  {
    id: 2,
    name: "Mata Bor Diamond",
    unit: "Pcs",
    stock: 3,
    minStock: 8,
    price: 5000000
  },
  {
    id: 3,
    name: "Pompa Air Submersible",
    unit: "Unit",
    stock: 2,
    minStock: 5,
    price: 8000000
  },
  {
    id: 4,
    name: "Kabel Bor Kawat",
    unit: "Meter",
    stock: 150,
    minStock: 200,
    price: 75000
  },
  {
    id: 5,
    name: "Oli Mesin Bor",
    unit: "Liter",
    stock: 20,
    minStock: 50,
    price: 150000
  }
];

export const employees = [
  {
    id: 1,
    name: "Ahmad Hidayat",
    position: "Manager",
    phone: "081234567890",
    email: "ahmad@posbor.com",
    status: "Active",
    joinDate: "2023-01-15"
  },
  {
    id: 2,
    name: "Wawan Setiawan",
    position: "Operator Bor",
    phone: "082345678901",
    email: "wawan@posbor.com",
    status: "Active",
    joinDate: "2023-03-20"
  },
  {
    id: 3,
    name: "Randi Pratama",
    position: "Operator Bor",
    phone: "083456789012",
    email: "randi@posbor.com",
    status: "Active",
    joinDate: "2023-05-10"
  },
  {
    id: 4,
    name: "Sinta Dewi",
    position: "Admin",
    phone: "084567890123",
    email: "sinta@posbor.com",
    status: "Active",
    joinDate: "2023-07-01"
  },
  {
    id: 5,
    name: "Bambang Suryanto",
    position: "Teknisi",
    phone: "085678901234",
    email: "bambang@posbor.com",
    status: "On Leave",
    joinDate: "2023-08-15"
  }
];

export const dashboardStats = {
  totalCustomerBalance: 285000000 - 141000000, // Total Deposit - Total Debt
  cashOnHand: 45000000,
  activeProjects: 3, // Projects with 'Drilling' status
  overdueDebts: 18000000 + 35000000 + 55000000, // Sum of debts > 30 days
  monthlyIncome: [
    { month: "Aug", income: 2500000, expense: 1200000 },
    { month: "Sep", income: 4200000, expense: 1800000 },
    { month: "Oct", income: 5800000, expense: 2500000 },
    { month: "Nov", income: 8100000, expense: 3200000 },
    { month: "Dec", income: 10000000, expense: 4000000 }
  ]
};

export const dummyData = {
  customers,
  orders,
  inventory,
  employees,
  dashboardStats
};
