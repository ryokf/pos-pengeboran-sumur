import { useState } from 'react';
import { formatDate } from '../utils';

export default function MeterReadingModal({
    isOpen,
    onClose,
    customerId,
    customerName,
    previousReading,
    onSubmit,
    submitting = false
}) {
    const today = new Date().toISOString().split('T')[0];
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1;
    const currentYear = currentDate.getFullYear();

    const [readingDate, setReadingDate] = useState(today);
    const [periodMonth, setPeriodMonth] = useState(currentMonth);
    const [periodYear, setPeriodYear] = useState(currentYear);
    const [totalMeterReading, setTotalMeterReading] = useState('');
    const [notes, setNotes] = useState('');
    const [error, setError] = useState('');

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');

        // Validasi input
        const totalReading = Number.parseFloat(totalMeterReading);
        const previousValue = previousReading?.current_value || 0;

        if (!totalMeterReading || totalReading < 0) {
            setError('Total pembacaan meteran harus diisi');
            return;
        }

        if (totalReading < previousValue) {
            setError(`Total pembacaan tidak boleh kurang dari pembacaan sebelumnya (${previousValue} m³)`);
            return;
        }

        // Hitung usage_amount dari selisih dengan pembacaan sebelumnya
        const usage_amount = totalReading - previousValue;

        // DATA YANG DIKIRIM
        // currentnya adalah total kumulatif, usage_amount adalah selisih dengan sebelumnya
        const newReading = {
            customer_id: customerId,
            reading_date: readingDate,
            period_month: Number.parseInt(periodMonth),
            period_year: Number.parseInt(periodYear),
            current_value: totalReading, // Input adalah nilai total kumulatif
            usage_amount: usage_amount, // Calculated dari selisih
            notes: notes || 'Pencatatan meteran'
        };

        onSubmit(newReading);

        // Reset form
        setReadingDate(today);
        setPeriodMonth(currentMonth);
        setPeriodYear(currentYear);
        setTotalMeterReading('');
        setNotes('');
        setError('');
    };

    const handleClose = () => {
        setReadingDate(today);
        setPeriodMonth(currentMonth);
        setPeriodYear(currentYear);
        setTotalMeterReading('');
        setNotes('');
        setError('');
        onClose();
    };

    const calculateUsageFromTotal = () => {
        if (!totalMeterReading) return null;
        const previousValue = previousReading?.current_value || 0;
        const total = Number.parseFloat(totalMeterReading);
        const usage = total - previousValue;
        return usage >= 0 ? usage : null;
    };

    // Generate month options
    const monthNames = [
        'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
        'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];

    // Generate year options (current year and 2 years back)
    const yearOptions = [];
    for (let i = 0; i < 3; i++) {
        yearOptions.push(currentYear - i);
    }

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full mx-4">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">📊 Catat Meteran Baru</h3>

                <div className="mb-4 p-4 bg-blue-50 rounded-lg">
                    <p className="text-sm font-medium text-gray-700 mb-1">Pelanggan</p>
                    <p className="text-lg font-semibold text-gray-900">{customerName}</p>

                    {previousReading && (
                        <div className="mt-3 pt-3 border-t border-blue-200">
                            <p className="text-xs text-gray-600 mb-1">Pencatatan Terakhir</p>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-700">
                                    {formatDate(previousReading.reading_date)}
                                </span>
                                <span className="text-sm font-bold text-blue-600">
                                    {previousReading.current_value} m³
                                </span>
                            </div>
                        </div>
                    )}
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Tanggal Pencatatan
                        </label>
                        <input
                            type="date"
                            value={readingDate}
                            onChange={(e) => setReadingDate(e.target.value)}
                            max={today}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                            disabled={submitting}
                        />
                    </div>

                    {/* Period Selection */}
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Periode Bulan
                            </label>
                            <select
                                value={periodMonth}
                                onChange={(e) => setPeriodMonth(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                                disabled={submitting}
                            >
                                {monthNames.map((name, index) => (
                                    <option key={index + 1} value={index + 1}>
                                        {name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Tahun
                            </label>
                            <select
                                value={periodYear}
                                onChange={(e) => setPeriodYear(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                                disabled={submitting}
                            >
                                {yearOptions.map(year => (
                                    <option key={year} value={year}>
                                        {year}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Total Pembacaan Meteran (m³) <span className="text-red-500">*</span>
                        </label>
                        <p className="text-xs text-gray-600 mb-2">
                            Masukkan total kumulatif meteran dari awal, bukan hanya penggunaan bulan ini
                        </p>
                        <input
                            type="number"
                            step="0.1"
                            value={totalMeterReading}
                            onChange={(e) => setTotalMeterReading(e.target.value)}
                            placeholder="Contoh: 15 (jika bulan lalu 10, sekarang 5 lebih, masuk 15)"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                            disabled={submitting}
                        />
                    </div>

                    {totalMeterReading && calculateUsageFromTotal() !== null && (
                        <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <span className="text-xs text-gray-600">Pembacaan Sebelumnya:</span>
                                    <span className="text-sm font-semibold text-gray-700">{(previousReading?.current_value || 0).toFixed(1)} m³</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-xs text-gray-600">Pembacaan Baru:</span>
                                    <span className="text-sm font-semibold text-blue-600">{Number.parseFloat(totalMeterReading).toFixed(1)} m³</span>
                                </div>
                                <div className="border-t border-blue-200 pt-2 flex justify-between">
                                    <span className="text-xs text-gray-600 font-semibold">Penggunaan Bulan Ini:</span>
                                    <span className="text-lg font-bold text-green-600">{calculateUsageFromTotal().toFixed(1)} m³</span>
                                </div>
                            </div>
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Catatan (Opsional)
                        </label>
                        <textarea
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder="Tambahkan catatan jika diperlukan"
                            rows="3"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            disabled={submitting}
                        />
                    </div>

                    {error && (
                        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-sm text-red-600">{error}</p>
                        </div>
                    )}

                    <div className="flex gap-3 mt-6">
                        <button
                            type="button"
                            onClick={handleClose}
                            disabled={submitting}
                            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            disabled={submitting}
                            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {submitting ? 'Menyimpan...' : 'Simpan'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
