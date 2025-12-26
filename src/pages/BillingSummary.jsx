import { dummyData, meterReadings } from '../data/dummyData';
import { calculateMonthlyBilling, PRICING_TIERS, formatCurrency, getLatestMeterReading, getPreviousMeterReading, calculateUsage } from '../utils';

export default function BillingSummary() {
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
    const summaryList = dummyData.customers
        .filter(c => c.saldo > 0)
        .map(customer => {
            const monthlyCharge = calculateMonthlyBilling(customer.wellSize);
            const pricePerM3 = customer.wellSize < PRICING_TIERS.SMALL_WELL_THRESHOLD
                ? PRICING_TIERS.SMALL_WELL_PRICE
                : PRICING_TIERS.LARGE_WELL_PRICE;

            // Get meter readings for water usage
            const latestReading = getLatestMeterReading(customer.id, meterReadings);
            const previousReading = latestReading
                ? getPreviousMeterReading(customer.id, meterReadings, latestReading.readingDate)
                : null;
            
            // Calculate water usage this month
            const currentMonthUsage = calculateUsage(latestReading, previousReading);
            
            // Calculate total usage before this month
            const totalUsageBeforeThisMonth = previousReading ? previousReading.meterValue : 0;

            return {
                ...customer,
                monthlyCharge,
                pricePerM3,
                latestReading,
                previousReading,
                currentMonthUsage,
                totalUsageBeforeThisMonth
            };
        });

    const totalBilling = summaryList.reduce((sum, c) => sum + c.monthlyCharge, 0);
    const totalWaterUsage = summaryList.reduce((sum, c) => sum + c.currentMonthUsage, 0);

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
                    🖨️ Cetak Rekap
                </button>
            </div>

            {/* Printable Content */}
            <div className="max-w-6xl mx-auto p-8">
                {/* Header */}
                <div className="text-center mb-8 border-b-2 border-gray-800 pb-6">
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">SISTEM KELOLA TAGIHAN AIR</h1>
                    <p className="text-lg text-gray-600">Rekap Resi Bulanan</p>
                    <p className="text-md text-gray-600 mt-2">Periode: {currentMonth}</p>
                    <p className="text-sm text-gray-500 mt-1">Dicetak pada: {currentDate}</p>
                </div>

                {/* Summary Statistics */}
                <div className="grid grid-cols-4 gap-4 mb-8 bg-gray-50 p-6 rounded-lg border border-gray-200">
                    <div className="text-center">
                        <p className="text-sm text-gray-600 font-medium mb-1">Total Pelanggan</p>
                        <p className="text-3xl font-bold text-gray-800">{summaryList.length}</p>
                    </div>
                    <div className="text-center">
                        <p className="text-sm text-gray-600 font-medium mb-1">Total Tagihan</p>
                        <p className="text-2xl font-bold text-blue-600">{formatCurrency(totalBilling)}</p>
                    </div>
                    <div className="text-center">
                        <p className="text-sm text-gray-600 font-medium mb-1">Total Penggunaan Air</p>
                        <p className="text-2xl font-bold text-green-600">{totalWaterUsage.toFixed(2)} m³</p>
                    </div>
                    <div className="text-center">
                        <p className="text-sm text-gray-600 font-medium mb-1">Rata-rata Tagihan</p>
                        <p className="text-2xl font-bold text-purple-600">{formatCurrency(totalBilling / summaryList.length)}</p>
                    </div>
                </div>

                {/* Details Table */}
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    <table className="w-full border-collapse border border-gray-300">
                        <thead className="bg-gray-800 text-white">
                            <tr>
                                <th className="border border-gray-300 px-4 py-3 text-left font-semibold">No.</th>
                                <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Nama Pelanggan</th>
                                <th className="border border-gray-300 px-4 py-3 text-center font-semibold">Ukuran Sumur</th>
                                <th className="border border-gray-300 px-4 py-3 text-center font-semibold">Penggunaan Bulan Ini</th>
                                <th className="border border-gray-300 px-4 py-3 text-center font-semibold">Tarif/m³</th>
                                <th className="border border-gray-300 px-4 py-3 text-right font-semibold">Total Tagihan</th>
                            </tr>
                        </thead>
                        <tbody>
                            {summaryList.map((customer, index) => (
                                <tr key={customer.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                    <td className="border border-gray-300 px-4 py-3 text-center">{index + 1}</td>
                                    <td className="border border-gray-300 px-4 py-3">
                                        <p className="font-medium text-gray-900">{customer.name}</p>
                                        <p className="text-xs text-gray-600">{customer.phone}</p>
                                    </td>
                                    <td className="border border-gray-300 px-4 py-3 text-center">{customer.wellSize} m³</td>
                                    <td className="border border-gray-300 px-4 py-3 text-center font-semibold text-green-600">
                                        {customer.currentMonthUsage.toFixed(2)} m³
                                    </td>
                                    <td className="border border-gray-300 px-4 py-3 text-center">
                                        {formatCurrency(customer.pricePerM3)}
                                    </td>
                                    <td className="border border-gray-300 px-4 py-3 text-right font-bold text-blue-600">
                                        {formatCurrency(customer.monthlyCharge)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                        <tfoot>
                            <tr className="bg-gray-800 text-white font-bold">
                                <td colSpan="5" className="border border-gray-300 px-4 py-3 text-right">
                                    TOTAL:
                                </td>
                                <td className="border border-gray-300 px-4 py-3 text-right">
                                    {formatCurrency(totalBilling)}
                                </td>
                            </tr>
                        </tfoot>
                    </table>
                </div>

                {/* Footer Notes */}
                <div className="mt-8 text-center border-t-2 border-gray-800 pt-6">
                    <p className="text-sm text-gray-600 mb-2">Dokumen ini adalah ringkasan resi tagihan bulan {currentMonth}</p>
                    <p className="text-xs text-gray-500">Untuk informasi lebih detail, silakan cetak daftar tagihan lengkap</p>
                </div>
            </div>

            {/* Print Styles */}
            <style>{`
        @media print {
          .no-print {
            display: none !important;
          }
          
          body {
            margin: 0;
            padding: 0;
            background: white;
          }
          
          @page {
            margin: 1cm;
            size: A4;
          }
          
          table {
            page-break-inside: avoid;
          }
        }
      `}</style>
        </div>
    );
}
