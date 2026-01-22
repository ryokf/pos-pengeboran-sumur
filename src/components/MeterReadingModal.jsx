import { useState, useEffect } from 'react';
import { formatDate } from '../utils';
import supabase from '../config/supabase';

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
    const [pricingTiers, setPricingTiers] = useState([]);
    const [adminFee, setAdminFee] = useState(0);

    // Load pricing tiers dan admin fee saat modal dibuka
    useEffect(() => {
        if (isOpen) {
            loadPricingData();
        }
    }, [isOpen]);

    const loadPricingData = async () => {
        try {
            const { data: tiers } = await supabase.from('pricing_tiers').select('*').order('min_usage');
            const { data: settings } = await supabase.from('app_settings').select('admin_fee').single();
            
            setPricingTiers(tiers || []);
            setAdminFee(settings?.admin_fee || 0);
        } catch (err) {
            console.error('Failed to load pricing data:', err);
        }
    };

    if (!isOpen) return null;

    // Hitung biaya air berdasarkan usage dan pricing tier
    const calculateWaterCost = (usage) => {
        if (usage <= 0 || pricingTiers.length === 0) return 0;

        let applicableTier = pricingTiers[0];
        for (const tier of pricingTiers) {
            if (usage >= tier.min_usage) {
                if (tier.max_usage === null || usage <= tier.max_usage) {
                    applicableTier = tier;
                    break;
                } else if (usage > tier.max_usage) {
                    applicableTier = tier;
                }
            }
        }
        return usage * applicableTier.price_per_m3;
    };

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

        // HITUNG SEMUA DI FRONTEND
        const previous_value = previousValue;
        const current_value = totalReading;
        const usage_amount = totalReading - previousValue;
        const water_cost = calculateWaterCost(usage_amount);
        const total_amount = water_cost + adminFee;

        // DATA LENGKAP DIKIRIM KE BACKEND
        const newReading = {
            customer_id: customerId,
            reading_date: readingDate,
            period_month: Number.parseInt(periodMonth),
            period_year: Number.parseInt(periodYear),
            previous_value: previous_value,           // Dihitung di frontend
            current_value: current_value,             // Dihitung di frontend
            usage_amount: usage_amount,               // Dihitung di frontend
            water_cost: water_cost,                   // Dihitung di frontend (billing)
            admin_fee: adminFee,                      // Dari database
            total_amount: total_amount,               // Dihitung di frontend (billing)
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

                    {totalMeterReading && calculateUsageFromTotal() !== null && (
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
