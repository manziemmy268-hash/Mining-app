import React from 'react';

const Toast = ({ toasts }) => {
  return (
    <div className="toast-container">
      {toasts.map((t) => (
        <div key={t.id} className="toast flex items-center gap-4">
          <div className="flex-shrink-0 w-2 h-2 rounded-full bg-emerald shadow-[0_0_8px_var(--emerald)]"></div>
          {t.message}
        </div>
      ))}
    </div>
  );
};

export default Toast;
