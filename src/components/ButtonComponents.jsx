// Reusable button components

export function PrimaryButton({ children, onClick, disabled = false, className = '', ...props }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export function SecondaryButton({ children, onClick, disabled = false, className = '', ...props }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export function DangerButton({ children, onClick, disabled = false, className = '', ...props }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export function TextButton({ children, onClick, disabled = false, className = '', ...props }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`text-blue-600 hover:text-blue-700 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export function IconButton({ icon, onClick, disabled = false, className = '', title = '', ...props }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      {...props}
    >
      {icon}
    </button>
  );
}
