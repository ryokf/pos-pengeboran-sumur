import { dummyData } from '../data/dummyData';
import { calculateMonthlyBilling, PRICING_TIERS, formatCurrency } from '../utils/constants';

export default function BillingPrint() {
    const currentDate = new Date().toLocaleDateString('id-ID', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    const currentMonth = new Date().toLocaleDateString('id-ID', {
        month: 'long',
        year: 'numeric'
    });

    // Get active customers with billing info
    const billingList = dummyData.customers
        .filter(c => c.saldo > 0)
        .map(customer => {
            const monthlyCharge = calculateMonthlyBilling(customer.wellSize);
            const pricePerM3 = customer.wellSize < PRICING_TIERS.SMALL_WELL_THRESHOLD
                ? PRICING_TIERS.SMALL_WELL_PRICE
                : PRICING_TIERS.LARGE_WELL_PRICE;

            return {
                ...customer,
                monthlyCharge,
                pricePerM3
            };
        });

    const totalBilling = billingList.reduce((sum, c) => sum + c.monthlyCharge, 0);

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="min-h-screen bg-white">
            {/* Print Button - Hidden when printing */}
            <div className="no-print fixed top-4 right-4 z-50">
                <button
                    onClick={handlePrint}
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-blue-700 transition-colors font-medium"
                >
                    🖨️ Cetak Dokumen
                </button>
            </div>

            {/* Printable Content */}
            <div className="max-w-4xl mx-auto p-8">
                {/* Header */}
                <div className="text-center mb-8 border-b-2 border-gray-800 pb-6">
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">POS PENGEBORAN SUMUR</h1>
                    <p className="text-lg text-gray-600">Daftar Tagihan Bulanan</p>
                    <p className="text-md text-gray-600 mt-2">Periode: {currentMonth}</p>
                    <p className="text-sm text-gray-500 mt-1">Dicetak pada: {currentDate}</p>
                </div>

                {/* Summary Info */}
                <div className="grid grid-cols-2 gap-4 mb-6 bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <div>
                        <p className="text-sm text-gray-600">Total Pelanggan</p>
                        <p className="text-2xl font-bold text-gray-800">{billingList.length}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-sm text-gray-600">Total Tagihan</p>
                        <p className="text-2xl font-bold text-blue-600">{formatCurrency(totalBilling)}</p>
                    </div>
                </div>

                {/* Customer Cards with Cut Lines */}
                <div className="space-y-0">
                    {billingList.map((customer, index) => (
                        <div key={customer.id}>
                            {/* Customer Card */}
                            <div className="border-2 border-gray-800 p-6 bg-white">
                                {/* Header Row */}
                                <div className="flex justify-between items-start mb-4 pb-3 border-b-2 border-gray-300">
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-800">{customer.name}</h3>
                                        <p className="text-sm text-gray-600">{customer.phone}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs text-gray-500 mb-1">No. {index + 1}</p>
                                        <p className="text-xs text-gray-500">Periode: {currentMonth}</p>
                                    </div>
                                </div>

                                {/* Details Grid */}
                                <div className="grid grid-cols-2 gap-4 mb-4">
                                    <div>
                                        <p className="text-xs text-gray-500 mb-1">Alamat</p>
                                        <p className="text-sm font-medium text-gray-800">{customer.address}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 mb-1">Ukuran Sumur</p>
                                        <p className="text-sm font-medium text-gray-800">{customer.wellSize} m³</p>
                                    </div>
                                </div>

                                {/* Billing Info */}
                                <div className="bg-gray-100 p-4 rounded border border-gray-300">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-sm text-gray-600">Tarif per m³:</span>
                                        <span className="text-sm font-semibold text-gray-800">{formatCurrency(customer.pricePerM3)}</span>
                                    </div>
                                    <div className="flex justify-between items-center pt-2 border-t border-gray-300">
                                        <span className="text-base font-bold text-gray-800">TOTAL TAGIHAN:</span>
                                        <span className="text-2xl font-bold text-blue-600">{formatCurrency(customer.monthlyCharge)}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Cut Line - Only show between cards, not after the last one */}
                            {index < billingList.length - 1 && (
                                <div className="relative py-4">
                                    <div className="border-t-2 border-dashed border-gray-400"></div>
                                    <div className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white px-2">
                                        <span className="text-xs text-gray-400">✂️ Potong di sini</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Summary Footer */}
                <div className="mt-8 pt-6 border-t-4 border-gray-800">
                    <div className="flex justify-between items-center bg-gray-800 text-white p-4 rounded">
                        <span className="text-lg font-bold">TOTAL KESELURUHAN ({billingList.length} Pelanggan):</span>
                        <span className="text-2xl font-bold">{formatCurrency(totalBilling)}</span>
                    </div>
                </div>
            </div>

            {/* Print Styles */}
            <style>{`
        @media print {
          .no-print {
            display: none !important;
          }
          
          body {
            print-color-adjust: exact;
            -webkit-print-color-adjust: exact;
          }
          
          @page {
            margin: 1cm;
          }
        }
      `}</style>
        </div>
    );
}
