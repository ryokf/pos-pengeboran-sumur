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
    const [usageAmount, setUsageAmount] = useState('');
    const [notes, setNotes] = useState('');
    const [error, setError] = useState('');

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');

        // Validation
        if (!usageAmount || parseFloat(usageAmount) < 0) {
            setError('Penggunaan air harus diisi dan tidak boleh negatif');
            return;
        }



        // Submit the reading with period
        const newReading = {
            customerId,
            readingDate,
            periodMonth: parseInt(periodMonth),
            periodYear: parseInt(periodYear),
            usageAmount: parseFloat(usageAmount),
            notes: notes || 'Pencatatan meteran'
        };

        onSubmit(newReading);

        // Reset form
        setReadingDate(today);
        setPeriodMonth(currentMonth);
        setPeriodYear(currentYear);
        setUsageAmount('');
        setNotes('');
        setError('');
    };

    const handleClose = () => {
        setReadingDate(today);
        setPeriodMonth(currentMonth);
        setPeriodYear(currentYear);
        setUsageAmount('');
        setNotes('');
        setError('');
        onClose();
    };

    const calculateCumulativeMeter = () => {
        if (!usageAmount) return null;
        const previousValue = previousReading?.current_value || 0;
        return previousValue + parseFloat(usageAmount);
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
                            Penggunaan Bulan Ini (m³)
                        </label>
                        <input
                            type="number"
                            step="0.1"
                            value={usageAmount}
                            onChange={(e) => setUsageAmount(e.target.value)}
                            placeholder="Masukkan penggunaan air (m³)"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                            disabled={submitting}
                        />
                    </div>

                    {usageAmount && calculateCumulativeMeter() !== null && (
                        <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                            <p className="text-xs text-gray-600 mb-1">Nilai Meteran Akan Menjadi</p>
                            <p className="text-lg font-bold text-blue-600">
                                {calculateCumulativeMeter().toFixed(1)} m³
                            </p>
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
