import React from 'react';
import { useStore } from '../context/StoreContext';
import { CheckCircle2, AlertCircle, Info } from 'lucide-react';

export const Toast: React.FC = () => {
  const { toast } = useStore();

  if (!toast) return null;

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />,
    error: <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />,
    info: <Info className="w-5 h-5 text-blue-600 shrink-0" />,
  };

  const bgStyles = {
    success: 'bg-white border-emerald-200 text-slate-800',
    error: 'bg-white border-rose-200 text-slate-800',
    info: 'bg-white border-blue-200 text-slate-800',
  };

  const currentType = toast.type || 'success';

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-md animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div
        className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl border shadow-xl backdrop-blur-md ${bgStyles[currentType]}`}
      >
        {icons[currentType]}
        <p className="text-sm font-semibold text-slate-900">{toast.message}</p>
      </div>
    </div>
  );
};
