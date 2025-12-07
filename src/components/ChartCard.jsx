export default function ChartCard({ title, children, className = '' }) {
  return (
    <div className={`bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow ${className}`}>
      <h3 className="text-lg font-bold text-gray-800 mb-4">{title}</h3>
      {children}
    </div>
  );
}
