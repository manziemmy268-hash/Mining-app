import React from 'react';

// --- Enterprise Action: Button ---
export const Button = ({ children, variant = 'primary', className = '', ...props }) => {
  const variants = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    danger: 'btn-danger',
  };

  return (
    <button className={`btn ${variants[variant] || 'btn-primary'} ${className}`} {...props}>
      {children}
    </button>
  );
};

// --- Professional Surface: Card ---
export const Card = ({ children, title, className = '', headerActions }) => {
  return (
    <div className={`card ${className}`}>
      {(title || headerActions) && (
        <div className="card-title">
          {title && <span>{title}</span>}
          {headerActions && <div className="ml-auto">{headerActions}</div>}
        </div>
      )}
      <div className="relative">
        {children}
      </div>
    </div>
  );
};

// --- Secure Input Field ---
export const Input = ({ label, error, className = '', ...props }) => {
  return (
    <div className={`input-group ${className}`}>
      {label && <label>{label}</label>}
      <input {...props} />
      {error && <p className="text-danger text-[10px] font-black uppercase tracking-widest mt-2">{error}</p>}
    </div>
  );
};

// --- Operations Select ---
export const Select = ({ label, options = [], className = '', ...props }) => {
  return (
    <div className={`input-group ${className}`}>
      {label && <label>{label}</label>}
      <select {...props}>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
};

// --- Professional Shimmer Loader ---
export const Skeleton = ({ width = '100%', height = '1rem', borderRadius = '4px', className = '' }) => (
  <div 
    className={`shimmer ${className}`} 
    style={{ width, height, borderRadius, marginBottom: '0.5rem' }}
  />
);
