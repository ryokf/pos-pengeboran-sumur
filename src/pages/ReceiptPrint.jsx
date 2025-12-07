import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { formatCurrency } from '../utils';

// Helper function to convert number to Indonesian words
function numberToWords(num) {
  const ones = ['', 'satu', 'dua', 'tiga', 'empat', 'lima', 'enam', 'tujuh', 'delapan', 'sembilan'];
  const teens = ['sepuluh', 'sebelas', 'dua belas', 'tiga belas', 'empat belas', 'lima belas', 'enam belas', 'tujuh belas', 'delapan belas', 'sembilan belas'];
  const tens = ['', '', 'dua puluh', 'tiga puluh', 'empat puluh', 'lima puluh', 'enam puluh', 'tujuh puluh', 'delapan puluh', 'sembilan puluh'];
  const scales = ['', 'ribu', 'juta', 'miliar', 'triliun'];

  if (num === 0) return 'nol';

  function convertBelowThousand(n) {
    if (n === 0) return '';
    if (n < 10) return ones[n];
    if (n < 20) return teens[n - 10];
    if (n < 100) {
      const ten = Math.floor(n / 10);
      const one = n % 10;
      return tens[ten] + (one > 0 ? ' ' + ones[one] : '');
    }
    const hundred = Math.floor(n / 100);
    const remainder = n % 100;
    return (hundred === 1 ? 'seratus' : ones[hundred] + ' ratus') + (remainder > 0 ? ' ' + convertBelowThousand(remainder) : '');
  }

  const parts = [];
  let scaleIndex = 0;

  while (num > 0) {
    const part = num % 1000;
    if (part > 0) {
      if (scaleIndex === 1 && part === 1) {
        parts.unshift('seribu');
      } else {
        const partWords = convertBelowThousand(part);
        parts.unshift(partWords + (scaleIndex > 0 ? ' ' + scales[scaleIndex] : ''));
      }
    }
    num = Math.floor(num / 1000);
    scaleIndex++;
  }

  return parts.join(' ').trim();
}

// Mock transaction data - in real app, this would come from database
const mockTransactions = {
  1: {
    id: 1,
    date: '2025-12-07',
    amount: 5000000,
    description: 'Pembayaran DP PT Maju Jaya',
    customer_name: 'PT Maju Jaya',
    is_receipt_printed: 0
  },
  3: {
    id: 3,
    date: '2025-12-05',
    amount: 3500000,
    description: 'Pembayaran Siti Nurhaliza',
    customer_name: 'Siti Nurhaliza',
    is_receipt_printed: 1
  },
  5: {
    id: 5,
    date: '2025-12-03',
    amount: 10500000,
    description: 'Pembayaran Lunas CV Bor Profesional',
    customer_name: 'CV Bor Profesional',
    is_receipt_printed: 0
  }
};

export default function ReceiptPrint() {
  const { transactionId } = useParams();
  const navigate = useNavigate();
  const [transaction, setTransaction] = useState(null);
  const [isDuplicate, setIsDuplicate] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call to mark receipt as printed
    const timer = setTimeout(() => {
      const mockTransaction = mockTransactions[transactionId];
      if (mockTransaction) {
        // Check if already printed (simulate database state)
        if (mockTransaction.is_receipt_printed === 1) {
          setIsDuplicate(true);
        }
        // Mark as printed (in real app, this would be an API call)
        mockTransaction.is_receipt_printed = 1;
        setTransaction(mockTransaction);
      }
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [transactionId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-600">Memuat data resi...</p>
      </div>
    );
  }

  if (!transaction) {
    return (
      <div className="p-8">
        <p className="text-red-600 font-semibold mb-4">Transaksi tidak ditemukan</p>
        <button
          onClick={() => navigate('/finance/cash-flow')}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Kembali ke Arus Kas
        </button>
      </div>
    );
  }

  const amountInWords = numberToWords(Math.floor(transaction.amount / 1000000)) + ' juta rupiah';

  return (
    <div className="bg-white min-h-screen p-8">
      {/* Print Controls */}
      <div className="flex gap-4 mb-8 no-print">
        <button
          onClick={() => window.print()}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
        >
          🖨️ Cetak Resi
        </button>
        <button
          onClick={() => navigate('/finance/cash-flow')}
          className="px-6 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 font-medium"
        >
          ← Kembali
        </button>
      </div>

      {/* Receipt Content */}
      <div className="max-w-2xl mx-auto">
        {/* Watermark for duplicates */}
        {isDuplicate && (
          <div className="fixed inset-0 flex items-center justify-center pointer-events-none opacity-20 z-0">
            <div className="text-red-500 text-9xl font-bold transform -rotate-45">
              COPY / DUPLICATE
            </div>
          </div>
        )}

        <div className="relative z-10 bg-white p-12 border-4 border-gray-800 shadow-lg">
          {/* Header */}
          <div className="text-center mb-8 pb-6 border-b-2 border-gray-800">
            <div className="text-4xl mb-2">⛏️</div>
            <h1 className="text-2xl font-bold">POS PENGEBORAN SUMUR</h1>
            <p className="text-sm text-gray-600">Jl. Merdeka No. 123, Jakarta</p>
            <p className="text-sm text-gray-600">Telp: (021) 123-4567</p>
          </div>

          {/* Receipt Title */}
          <div className="text-center mb-8">
            <h2 className="text-xl font-bold">KUITANSI PEMBAYARAN</h2>
            <p className="text-sm text-gray-600">No. Resi: RCP-{String(transaction.id).padStart(5, '0')}</p>
          </div>

          {/* Receipt Details */}
          <div className="space-y-4 mb-8">
            <div className="flex justify-between">
              <span className="font-semibold">Tanggal:</span>
              <span>{transaction.date}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold">Nama Pelanggan:</span>
              <span className="text-right font-medium">{transaction.customer_name}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold">Peruntukan:</span>
              <span className="text-right max-w-xs">{transaction.description}</span>
            </div>
          </div>

          {/* Amount */}
          <div className="mb-8 p-4 bg-gray-100 border-2 border-gray-800">
            <div className="text-center mb-4">
              <p className="text-sm text-gray-600 mb-1">Jumlah Uang</p>
              <p className="text-3xl font-bold text-gray-800">{formatCurrency(transaction.amount)}</p>
            </div>
            <div className="border-t-2 border-gray-800 pt-3 text-center">
              <p className="text-xs text-gray-600 mb-1">Terbilang:</p>
              <p className="font-semibold text-sm capitalize">{amountInWords}</p>
            </div>
          </div>

          {/* Signature Section */}
          <div className="grid grid-cols-2 gap-8 mt-12 pt-8 border-t-2 border-gray-800">
            <div className="text-center">
              <div className="mb-8 h-16"></div>
              <p className="text-sm font-semibold">Diterima oleh</p>
              <p className="text-xs text-gray-600">(Tanda Tangan & Nama Jelas)</p>
            </div>
            <div className="text-center">
              <div className="mb-8 h-16"></div>
              <p className="text-sm font-semibold">Diserahkan oleh</p>
              <p className="text-xs text-gray-600">(Tanda Tangan & Nama Jelas)</p>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center mt-12 pt-4 border-t border-gray-400">
            <p className="text-xs text-gray-500">Terima kasih atas pembayaran Anda</p>
            <p className="text-xs text-gray-500">Dokumen ini merupakan bukti pembayaran yang sah</p>
          </div>

          {/* Status Note */}
          {isDuplicate && (
            <div className="mt-6 p-4 bg-red-50 border border-red-300 rounded text-center">
              <p className="text-red-700 font-semibold text-sm">⚠️ COPY / DUPLIKAT</p>
              <p className="text-red-600 text-xs">Resi original sudah dicetak sebelumnya</p>
            </div>
          )}
        </div>
      </div>

      {/* Print Styles */}
      <style>{`
        @media print {
          body {
            margin: 0;
            padding: 0;
            background: white;
          }
          .no-print {
            display: none !important;
          }
          .print-page {
            page-break-after: always;
          }
        }
      `}</style>
    </div>
  );
}
