import React, { useState } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { Download, Smartphone, X, Share, PlusSquare } from 'lucide-react';

interface PWAInstallButtonProps {
  variant?: 'header' | 'mobile' | 'banner';
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({ variant = 'header' }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  // If already running as an installed PWA on home screen, do not show button
  if (isInstalled) {
    return null;
  }

  const handleInstallClick = () => {
    if (isInstallable) {
      install();
    } else if (isIOS) {
      setShowIOSGuide(true);
    } else {
      // In browsers without prompt yet or desktop Chrome before event fires
      setShowIOSGuide(true);
    }
  };

  return (
    <>
      {variant === 'header' && (
        <button
          onClick={handleInstallClick}
          className="hidden sm:flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 border border-blue-200 text-blue-700 text-xs font-bold rounded-xl shadow-xs transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
          title="Установить приложение TechStore на телефон или ПК"
        >
          <div className="w-5 h-5 rounded-md bg-blue-600 text-white flex items-center justify-center shrink-0">
            <Download className="w-3 h-3" />
          </div>
          <span>Приложение</span>
        </button>
      )}

      {variant === 'mobile' && (
        <button
          onClick={handleInstallClick}
          className="w-full flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 text-blue-900 text-xs font-bold shadow-xs"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center">
              <Download className="w-4 h-4" />
            </div>
            <div className="text-left">
              <p className="font-extrabold text-blue-900">Установить TechStore</p>
              <p className="text-[11px] font-normal text-blue-700">Работает быстро и офлайн</p>
            </div>
          </div>
          <span className="px-2.5 py-1 bg-blue-600 text-white rounded-lg text-[10px] font-bold">
            Установить
          </span>
        </button>
      )}

      {/* iOS & Browser Installation Guide Modal */}
      {showIOSGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl border border-slate-200 text-slate-900 relative">
            <button
              onClick={() => setShowIOSGuide(false)}
              className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
                <Smartphone className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-black text-slate-900">Установка TechStore</h3>
                <p className="text-xs text-slate-500">Добавьте приложение на экран</p>
              </div>
            </div>

            <div className="space-y-3 text-xs text-slate-700 bg-slate-50 p-4 rounded-2xl border border-slate-200 leading-relaxed">
              <div className="flex items-start gap-2.5">
                <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold shrink-0 text-xs mt-0.5">
                  1
                </div>
                <p>
                  Нажмите кнопку <strong>«Поделиться»</strong> <Share className="w-3.5 h-3.5 inline mx-1 text-blue-600" /> в панели браузера Safari или меню браузера Chrome.
                </p>
              </div>
              <div className="flex items-start gap-2.5">
                <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold shrink-0 text-xs mt-0.5">
                  2
                </div>
                <p>
                  Прокрутите вниз и выберите пункт <strong>«На экран «Домой»»</strong> <PlusSquare className="w-3.5 h-3.5 inline mx-1 text-blue-600" />.
                </p>
              </div>
              <div className="flex items-start gap-2.5">
                <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold shrink-0 text-xs mt-0.5">
                  3
                </div>
                <p>
                  Нажмите <strong>«Добавить»</strong> в правом верхнем углу. Иконка TechStore появится на вашем рабочем столе!
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowIOSGuide(false)}
              className="mt-5 w-full rounded-xl bg-blue-600 py-3 text-xs font-bold text-white hover:bg-blue-700 transition shadow-md shadow-blue-600/20"
            >
              Понятно, закрыть
            </button>
          </div>
        </div>
      )}
    </>
  );
};
