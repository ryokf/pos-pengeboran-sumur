// Dummy data for POS Pengeboran Sumur (Well Drilling POS System)

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
    saldo: -25000000
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
    saldo: 7000000
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
    saldo: -120000
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
    saldo: 2000000
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
    saldo: 65000000
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
  ]
};

export const dummyData = {
  customers,
  orders,
  wells,
  dashboardStats
};
