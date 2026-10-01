import React, { useState } from 'react';

interface AlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  serviceNo: string;
  stopName: string;
  onConfirmAlert: (mins: number) => void;
}

export const AlertModal: React.FC<AlertModalProps> = ({
  isOpen,
  onClose,
  serviceNo,
  stopName,
  onConfirmAlert,
}) => {
  const [selectedMinutes, setSelectedMinutes] = useState(3);
  const [vibratePhone, setVibratePhone] = useState(true);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200">
        <div className="p-4 bg-[#f9f9ff] border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#c8102e]">notifications_active</span>
            <h3 className="font-headline-sm text-base text-[#141b2b]">Set Bus Arrival Alert</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <div className="p-5 space-y-4">
          <div className="bg-[#f1f3ff] p-3 rounded-xl flex items-center gap-3">
            <div className="w-12 h-12 bg-[#9e001f] text-white rounded-lg flex items-center justify-center font-display-lg text-xl font-bold shrink-0">
              {serviceNo}
            </div>
            <div>
              <p className="font-semibold text-sm text-[#141b2b]">Bus Service {serviceNo}</p>
              <p className="text-xs text-[#5c403f]">Calling at {stopName}</p>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-2">
              Notify me before bus reaches stop:
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[2, 3, 5].map((mins) => (
                <button
                  key={mins}
                  type="button"
                  onClick={() => setSelectedMinutes(mins)}
                  className={`py-2 px-3 rounded-xl border text-sm font-semibold transition-all ${
                    selectedMinutes === mins
                      ? 'border-[#c8102e] bg-[#ffdad8]/30 text-[#9e001f]'
                      : 'border-slate-200 hover:border-slate-300 text-slate-700'
                  }`}
                >
                  {mins} mins before
                </button>
              ))}
            </div>
          </div>

          <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer pt-1">
            <input
              type="checkbox"
              checked={vibratePhone}
              onChange={(e) => setVibratePhone(e.target.checked)}
              className="accent-[#c8102e] rounded"
            />
            <span>Enable vibration alert on device upon approach</span>
          </label>
        </div>

        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-200 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirmAlert(selectedMinutes);
              onClose();
            }}
            className="px-4 py-2 text-xs font-semibold text-white bg-[#c8102e] hover:bg-[#9e001f] rounded-lg shadow-sm transition-colors"
          >
            Set Telemetry Alert
          </button>
        </div>
      </div>
    </div>
  );
};
