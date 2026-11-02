import React from 'react';
import { useStore } from '../context/StoreContext';
import { CheckCircle, ShieldCheck, ShoppingBag, Copy, Check } from 'lucide-react';

interface OrderSuccessModalProps {
  onNavigate: (path: string) => void;
}

export const OrderSuccessModal: React.FC<OrderSuccessModalProps> = ({ onNavigate }) => {
  const { completedOrder, setCompletedOrder } = useStore();
  const [copied, setCopied] = React.useState(false);

  if (!completedOrder) return null;

  const handleCopyNumber = () => {
    navigator.clipboard.writeText(completedOrder.orderNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClose = () => {
    setCompletedOrder(null);
  };

  const handleGoToAdmin = () => {
    setCompletedOrder(null);
    onNavigate('/admin');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden text-slate-900 my-8 p-6 sm:p-8 text-center">
        {/* Animated Checkmark Badge */}
        <div className="w-16 h-16 rounded-3xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-5 shadow-md shadow-emerald-500/10">
          <CheckCircle className="w-9 h-9" />
        </div>

        <h2 className="text-2xl font-black text-slate-900 mb-1">Заказ успешно оформлен!</h2>
        <p className="text-xs text-slate-500 mb-6 max-w-sm mx-auto">
          Благодарим за покупку! Наш менеджер свяжется с вами для подтверждения доставки.
        </p>

        {/* Order Number Box */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 mb-6 flex flex-col items-center justify-center relative">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
            Номер вашего заказа
          </span>
          <div className="flex items-center gap-2">
            <span className="text-2xl sm:text-3xl font-black tracking-wider text-blue-600 font-mono">
              {completedOrder.orderNumber}
            </span>
            <button
              onClick={handleCopyNumber}
              className="p-1.5 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-700 transition-colors"
              title="Скопировать номер"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
          <span className="text-[11px] text-emerald-600 mt-1 font-bold">
            Статус: {completedOrder.status}
          </span>
        </div>

        {/* Order Details Preview */}
        <div className="bg-slate-50 rounded-2xl p-4 text-left border border-slate-200 text-xs mb-6 space-y-2">
          <div className="flex justify-between text-slate-600">
            <span>Получатель:</span>
            <span className="font-bold text-slate-900">{completedOrder.customerName}</span>
          </div>
          <div className="flex justify-between text-slate-600">
            <span>Телефон:</span>
            <span className="font-bold text-slate-900">{completedOrder.customerPhone}</span>
          </div>
          <div className="flex justify-between text-slate-600">
            <span>Адрес доставки:</span>
            <span className="font-medium text-slate-800 truncate max-w-[200px]">
              {completedOrder.customerCity}, {completedOrder.customerAddress}
            </span>
          </div>
          <div className="flex justify-between text-slate-600">
            <span>Позиций в заказе:</span>
            <span className="font-semibold text-slate-800">{completedOrder.items.length} шт.</span>
          </div>
          <div className="pt-2 border-t border-slate-200 flex justify-between font-black text-sm text-slate-900">
            <span>Сумма к оплате:</span>
            <span className="text-blue-600">{completedOrder.totalAmount.toLocaleString('ru-RU')} ₸</span>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-2.5">
          <button
            onClick={handleClose}
            className="w-full flex items-center justify-center gap-2 py-3.5 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-blue-600/20"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Вернуться в каталог</span>
          </button>

          <button
            onClick={handleGoToAdmin}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 text-xs font-semibold transition-colors"
          >
            <ShieldCheck className="w-4 h-4 text-slate-500" />
            <span>Просмотреть заказ в панели администратора</span>
          </button>
        </div>
      </div>
    </div>
  );
};
