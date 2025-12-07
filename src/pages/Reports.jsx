export default function Reports() {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-800">Reports</h2>
        <p className="text-gray-600 mt-2">View and generate business reports</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Report Options */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">📊 Sales Report</h3>
          <p className="text-gray-600 mb-4">View detailed sales metrics and revenue trends</p>
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors">
            Generate Report
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">📈 Performance Report</h3>
          <p className="text-gray-600 mb-4">Analyze employee and service performance</p>
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors">
            Generate Report
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">💰 Revenue Report</h3>
          <p className="text-gray-600 mb-4">Detailed breakdown of revenue by service and customer</p>
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors">
            Generate Report
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">📋 Customer Report</h3>
          <p className="text-gray-600 mb-4">Customer acquisition and retention analysis</p>
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors">
            Generate Report
          </button>
        </div>
      </div>
    </div>
  );
}
