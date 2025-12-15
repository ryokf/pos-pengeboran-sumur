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

                {/* Billing Table */}
                <table className="w-full border-collapse mb-8">
                    <thead>
                        <tr className="bg-gray-800 text-white">
                            <th className="border border-gray-300 py-3 px-4 text-left">No</th>
                            <th className="border border-gray-300 py-3 px-4 text-left">Nama Pelanggan</th>
                            <th className="border border-gray-300 py-3 px-4 text-left">Alamat</th>
                            <th className="border border-gray-300 py-3 px-4 text-center">Ukuran Sumur</th>
                            <th className="border border-gray-300 py-3 px-4 text-center">Tarif/m³</th>
                            <th className="border border-gray-300 py-3 px-4 text-right">Tagihan</th>
                        </tr>
                    </thead>
                    <tbody>
                        {billingList.map((customer, index) => (
                            <tr key={customer.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                <td className="border border-gray-300 py-3 px-4 text-center">{index + 1}</td>
                                <td className="border border-gray-300 py-3 px-4">
                                    <div>
                                        <p className="font-medium text-gray-800">{customer.name}</p>
                                        <p className="text-xs text-gray-500">{customer.phone}</p>
                                    </div>
                                </td>
                                <td className="border border-gray-300 py-3 px-4 text-sm text-gray-600">
                                    {customer.address}
                                </td>
                                <td className="border border-gray-300 py-3 px-4 text-center">
                                    <span className="font-medium">{customer.wellSize}</span> m³
                                </td>
                                <td className="border border-gray-300 py-3 px-4 text-center text-sm">
                                    {formatCurrency(customer.pricePerM3)}
                                </td>
                                <td className="border border-gray-300 py-3 px-4 text-right font-bold text-blue-600">
                                    {formatCurrency(customer.monthlyCharge)}
                                </td>
                            </tr>
                        ))}
                        {/* Total Row */}
                        <tr className="bg-gray-200 font-bold">
                            <td colSpan="5" className="border border-gray-300 py-3 px-4 text-right">
                                TOTAL TAGIHAN
                            </td>
                            <td className="border border-gray-300 py-3 px-4 text-right text-blue-600">
                                {formatCurrency(totalBilling)}
                            </td>
                        </tr>
                    </tbody>
                </table>

                {/* Footer Notes */}
                <div className="mt-8 border-t-2 border-gray-300 pt-6">
                    <h3 className="font-bold text-gray-800 mb-3">Catatan:</h3>
                    <ul className="text-sm text-gray-600 space-y-1">
                        <li>• Tarif berjenjang: Sumur &lt; 5 m³ = Rp {PRICING_TIERS.SMALL_WELL_PRICE.toLocaleString('id-ID')}/m³</li>
                        <li>• Tarif berjenjang: Sumur ≥ 5 m³ = Rp {PRICING_TIERS.LARGE_WELL_PRICE.toLocaleString('id-ID')}/m³</li>
                        <li>• Pembayaran dapat dilakukan melalui transfer bank atau tunai di kantor</li>
                        <li>• Untuk informasi lebih lanjut, hubungi kantor kami</li>
                    </ul>
                </div>

                {/* Signature Section */}
                <div className="mt-12 grid grid-cols-2 gap-8">
                    <div className="text-center">
                        <p className="mb-16 text-sm text-gray-600">Mengetahui,</p>
                        <div className="border-t border-gray-800 pt-2">
                            <p className="font-medium">Manager</p>
                        </div>
                    </div>
                    <div className="text-center">
                        <p className="mb-16 text-sm text-gray-600">Dibuat oleh,</p>
                        <div className="border-t border-gray-800 pt-2">
                            <p className="font-medium">Admin</p>
                        </div>
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
