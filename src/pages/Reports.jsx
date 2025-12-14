export default function Reports() {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-800">Laporan</h2>
        <p className="text-gray-600 mt-2">Lihat dan buat laporan bisnis</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Report Options */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">📊 Laporan Penjualan</h3>
          <p className="text-gray-600 mb-4">Lihat metrik penjualan rinci dan tren pendapatan</p>
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors">
            Buat Laporan
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">📈 Laporan Kinerja</h3>
          <p className="text-gray-600 mb-4">Analisis kinerja karyawan dan layanan</p>
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors">
            Buat Laporan
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">💰 Laporan Pendapatan</h3>
          <p className="text-gray-600 mb-4">Rincian pendapatan berdasarkan layanan dan pelanggan</p>
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors">
            Buat Laporan
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">📋 Laporan Pelanggan</h3>
          <p className="text-gray-600 mb-4">Analisis akuisisi dan retensi pelanggan</p>
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors">
            Buat Laporan
          </button>
        </div>
      </div>
    </div>
  );
}
