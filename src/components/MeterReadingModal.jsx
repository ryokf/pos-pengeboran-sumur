import { useState, useEffect } from 'react';
import { formatDate } from '../utils';
import supabase from '../config/supabase';

export default function MeterReadingModal({
    isOpen,
    onClose,
    customerId,
    customerName,
    previousReading,
    existingReadings = [],
    onSubmit,
    submitting = false,
    defaultDataOnly = false
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
    const [adminFee, setAdminFee] = useState(0);

    // Jika tidak ada pembacaan sebelumnya, otomatis gunakan Mode Data Awal
    const hasNoPreviousReading = !previousReading;
    const [dataOnlyMode, setDataOnlyMode] = useState(defaultDataOnly || hasNoPreviousReading);

    // Load admin fee saat modal dibuka
    useEffect(() => {
        const loadPricingData = async () => {
            try {
                const { data: settings } = await supabase.from('app_settings').select('admin_fee').single();
                setAdminFee(settings?.admin_fee || 0);
            } catch (err) {
                console.error('Failed to load pricing data:', err);
            }
        };

        if (isOpen) {
            loadPricingData();
        }
    }, [isOpen]);

    if (!isOpen) return null;

    // Hitung biaya air berdasarkan usage (Flat 15k untuk 0-5m3, sisanya 3k/m3)
    const calculateWaterCost = (usage) => {
        if (usage < 0) return 0;

        if (usage <= 5) {
            return 15000; // Tagihan flat 15rb jika penggunaan 0 sampai 5m3
        } else {
            return usage * 3000; // Tagihan 3rb per m3 jika di atas 5m3
        }
    };

    const isMonthRecorded = (month, year) => {
        return existingReadings.some(
            reading => reading.period_month === month && reading.period_year === Number(year)
        );
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');

        // Validasi input
        const totalReading = Number.parseFloat(totalMeterReading);
        const previousValue = previousReading?.current_value || 0;

        if (isMonthRecorded(Number.parseInt(periodMonth), periodYear)) {
            const monthName = monthNames[Number.parseInt(periodMonth) - 1];
            setError(`Pencatatan untuk periode bulan ${monthName} ${periodYear} sudah ada.`);
            return;
        }

        if (!totalMeterReading || totalReading < 0) {
            setError('Total pembacaan meteran harus diisi');
            return;
        }

        if (totalReading < previousValue) {
            setError(`Total pembacaan tidak boleh kurang dari pembacaan sebelumnya (${previousValue} m³)`);
            return;
        }

        // HITUNG SEMUA DI FRONTEND
        const previous_value = previousValue;
        const current_value = totalReading;
        const usage_amount = totalReading - previousValue;

        let newReading;
        if (dataOnlyMode) {
            // Mode Data Awal: hanya kirim data meteran, tanpa billing
            newReading = {
                customer_id: customerId,
                reading_date: readingDate,
                period_month: Number.parseInt(periodMonth),
                period_year: Number.parseInt(periodYear),
                previous_value: previous_value,
                current_value: current_value,
                usage_amount: usage_amount,
                notes: notes || 'Data awal',
                _dataOnly: true  // Flag untuk memberitahu parent
            };
        } else {
            // Mode Normal: kirim data lengkap dengan billing
            const water_cost = calculateWaterCost(usage_amount);
            const total_amount = water_cost + adminFee;
            newReading = {
                customer_id: customerId,
                reading_date: readingDate,
                period_month: Number.parseInt(periodMonth),
                period_year: Number.parseInt(periodYear),
                previous_value: previous_value,
                current_value: current_value,
                usage_amount: usage_amount,
                water_cost: water_cost,
                admin_fee: adminFee,
                total_amount: total_amount,
                notes: notes || 'Pencatatan meteran',
                _dataOnly: false
            };
        }

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
        setDataOnlyMode(defaultDataOnly);
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
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full max-h-[90vh] overflow-y-auto">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">📊 Catat Meteran Baru</h3>

                {/* Mode Toggle */}
                <div className="mb-4 p-3 rounded-lg border-2 transition-all duration-200"
                    style={{ borderColor: dataOnlyMode ? '#f59e0b' : '#3b82f6', backgroundColor: dataOnlyMode ? '#fffbeb' : '#eff6ff' }}
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-semibold" style={{ color: dataOnlyMode ? '#92400e' : '#1e40af' }}>
                                {dataOnlyMode ? '📝 Mode Data Awal' : '📊 Mode Normal'}
                            </p>
                            <p className="text-xs mt-0.5" style={{ color: dataOnlyMode ? '#b45309' : '#3b82f6' }}>
                                {dataOnlyMode
                                    ? 'Hanya simpan data meteran, tanpa tagihan & saldo'
                                    : 'Simpan meteran + buat tagihan otomatis'
                                }
                            </p>
                        </div>
                        <button
                            type="button"
                            onClick={() => setDataOnlyMode(!dataOnlyMode)}
                            disabled={hasNoPreviousReading}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                                dataOnlyMode ? 'bg-amber-400' : 'bg-blue-600'
                            } ${hasNoPreviousReading ? 'opacity-60 cursor-not-allowed' : ''}`}
                        >
                            <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                    dataOnlyMode ? 'translate-x-6' : 'translate-x-1'
                                }`}
                            />
                        </button>
                    </div>

                    {/* Peringatan jika belum ada data sebelumnya */}
                    {hasNoPreviousReading && (
                        <div className="mt-2 pt-2 border-t border-amber-300">
                            <p className="text-xs text-amber-800 font-semibold">⚠️ Tidak ada data pembacaan sebelumnya</p>
                            <p className="text-xs text-amber-700 mt-0.5">
                                Mode Data Awal diaktifkan otomatis. Data ini akan menjadi titik awal perhitungan selisih untuk bulan berikutnya. Tidak ada tagihan yang dibuat.
                            </p>
                        </div>
                    )}
                </div>

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
                                {monthNames.map((name, index) => {
                                    const monthValue = index + 1;
                                    const isRecorded = isMonthRecorded(monthValue, periodYear);
                                    return (
                                        <option 
                                            key={monthValue} 
                                            value={monthValue}
                                            disabled={isRecorded}
                                        >
                                            {name} {isRecorded ? '(Sudah Dicatat)' : ''}
                                        </option>
                                    );
                                })}
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

                    {totalMeterReading && calculateUsageFromTotal() !== null && !dataOnlyMode && (
                        <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                            <p className="text-xs font-semibold text-gray-700 mb-2">📋 Preview Tagihan</p>
                            <div className="space-y-1 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Biaya Air:</span>
                                    <span className="font-semibold">Rp {calculateWaterCost(calculateUsageFromTotal()).toLocaleString('id-ID')}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Biaya Admin:</span>
                                    <span className="font-semibold">Rp {adminFee.toLocaleString('id-ID')}</span>
                                </div>
                                <div className="border-t border-green-200 pt-1 flex justify-between font-bold text-green-700">
                                    <span>Total Tagihan:</span>
                                    <span>Rp {(calculateWaterCost(calculateUsageFromTotal()) + adminFee).toLocaleString('id-ID')}</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {totalMeterReading && calculateUsageFromTotal() !== null && dataOnlyMode && (
                        <div className="p-3 bg-amber-50 rounded-lg border border-amber-200">
                            <p className="text-xs font-semibold text-amber-800 mb-1">📝 Mode Data Awal Aktif</p>
                            <p className="text-xs text-amber-700">Data meteran akan disimpan tanpa membuat tagihan dan tanpa mengubah saldo pelanggan.</p>
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
                            className={`flex-1 px-4 py-2 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                                dataOnlyMode
                                    ? 'bg-amber-500 hover:bg-amber-600'
                                    : 'bg-blue-600 hover:bg-blue-700'
                            }`}
                        >
                            {submitting ? 'Menyimpan...' : dataOnlyMode ? 'Simpan Data Awal' : 'Simpan'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
