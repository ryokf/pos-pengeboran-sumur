import { useState } from 'react';
import { formatDate } from '../utils';

export default function MeterReadingModal({
    isOpen,
    onClose,
    customerId,
    customerName,
    previousReading,
    onSubmit
}) {
    const today = new Date().toISOString().split('T')[0];
    const [readingDate, setReadingDate] = useState(today);
    const [meterValue, setMeterValue] = useState('');
    const [notes, setNotes] = useState('');
    const [error, setError] = useState('');

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');

        // Validation
        if (!meterValue || parseFloat(meterValue) < 0) {
            setError('Nilai meteran harus diisi dan tidak boleh negatif');
            return;
        }

        if (previousReading && parseFloat(meterValue) < previousReading.meterValue) {
            setError(`Nilai meteran harus lebih besar atau sama dengan pencatatan sebelumnya (${ previousReading.meterValue } m³)`);
            return;
        }

        // Submit the reading
        const newReading = {
            customerId,
            readingDate,
            meterValue: parseFloat(meterValue),
            recordedBy: 'Admin',
            notes: notes || 'Pencatatan meteran'
        };

        onSubmit(newReading);

        // Reset form
        setReadingDate(today);
        setMeterValue('');
        setNotes('');
        setError('');
    };

    const handleClose = () => {
        setReadingDate(today);
        setMeterValue('');
        setNotes('');
        setError('');
        onClose();
    };

    const calculatePreviewUsage = () => {
        if (!meterValue || !previousReading) return 0;
        return parseFloat(meterValue) - previousReading.meterValue;
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full mx-4">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">📊 Catat Meteran Baru</h3>

                <div className="mb-4 p-4 bg-blue-50 rounded-lg">
                    <p className="text-sm font-medium text-gray-700 mb-1">Pelanggan</p>
                    <p className="text-lg font-semibold text-gray-900">{customerName}</p>

                    {previousReading && (
                        <div className="mt-3 pt-3 border-t border-blue-200">
                            <p className="text-xs text-gray-600 mb-1">Pencatatan Terakhir</p>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-700">{formatDate(previousReading.readingDate)}</span>
                                <span className="text-sm font-bold text-blue-600">{previousReading.meterValue} m³</span>
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
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Nilai Meteran (m³)
                        </label>
                        <input
                            type="number"
                            step="0.1"
                            value={meterValue}
                            onChange={(e) => setMeterValue(e.target.value)}
                            placeholder="Masukkan nilai meteran"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>

                    {meterValue && previousReading && (
                        <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                            <p className="text-xs text-gray-600 mb-1">Penggunaan (Preview)</p>
                            <p className="text-lg font-bold text-green-600">
                                {calculatePreviewUsage().toFixed(1)} m³
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
                            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Simpan
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
