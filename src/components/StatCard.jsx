export default function StatCard({ title, value, icon, trend }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-gray-600 text-sm font-medium">{title}</p>
          <p className="text-3xl font-bold text-gray-800 mt-2">{value}</p>
          <p className="text-xs text-green-600 mt-2">{trend}</p>
        </div>
        <div className="text-4xl">{icon}</div>
      </div>
    </div>
  );
}
