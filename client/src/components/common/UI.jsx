export const Button = ({ children, variant = 'primary', className = '', loading = false, ...props }) => {
  const variants = {
    primary: 'bg-zinc-900 text-white hover:bg-zinc-800 shadow-sm',
    secondary: 'bg-white text-zinc-900 border border-zinc-200 hover:bg-zinc-50 shadow-sm',
    danger: 'bg-red-600 text-white hover:bg-red-700 shadow-sm',
    ghost: 'bg-transparent text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900',
  };

  return (
    <button 
      className={`px-4 py-2 rounded-md text-sm font-medium transition-all disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2 ${variants[variant]} ${className}`}
      disabled={loading}
      {...props}
    >
      {loading ? (
        <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : children}
    </button>
  );
};

export const Card = ({ children, className = '', ...props }) => (
  <div className={`bg-white rounded-lg border border-zinc-200 shadow-sm overflow-hidden ${className}`} {...props}>
    {children}
  </div>
);

export const Input = ({ label, error, className = '', ...props }) => (
  <div className="space-y-1.5 w-full">
    {label && <label className="block text-sm font-medium text-zinc-700">{label}</label>}
    <input 
      className={`w-full px-3 py-2 rounded-md border text-sm text-zinc-900 bg-white focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-900 transition-colors ${error ? 'border-red-500' : 'border-zinc-300'} ${className}`}
      {...props}
    />
    {error && <p className="text-xs text-red-500">{error}</p>}
  </div>
);

export const Badge = ({ children, variant = 'gray', className = '' }) => {
  const variants = {
    indigo: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    green: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    amber: 'bg-amber-50 text-amber-700 border-amber-200',
    red: 'bg-red-50 text-red-700 border-red-200',
    blue: 'bg-blue-50 text-blue-700 border-blue-200',
    gray: 'bg-zinc-100 text-zinc-700 border-zinc-200',
    dark: 'bg-zinc-800 text-zinc-100 border-zinc-900',
  };

  return (
    <span className={`px-2 py-0.5 rounded-md text-[11px] font-semibold uppercase tracking-wide border ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};
