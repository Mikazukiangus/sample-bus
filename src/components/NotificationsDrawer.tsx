import React from 'react';
import { COMMUTER_NOTIFICATIONS } from '../data/transitData';

interface NotificationsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onMarkAllRead: () => void;
}

export const NotificationsDrawer: React.FC<NotificationsDrawerProps> = ({
  isOpen,
  onClose,
  onMarkAllRead,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/40 backdrop-blur-xs">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          {/* Drawer Header */}
          <div className="p-4 bg-[#f9f9ff] border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#c8102e]">notifications</span>
              <div>
                <h3 className="font-headline-sm text-base text-[#141b2b]">Transit Bulletins</h3>
                <span className="text-xs text-[#5c403f]">LTA & SBS Transit Broadcasts</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onMarkAllRead}
                className="text-xs text-[#9e001f] font-semibold hover:underline"
              >
                Mark all read
              </button>
              <button
                type="button"
                onClick={onClose}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>
          </div>

          {/* List of notifications */}
          <div className="p-4 flex-1 overflow-y-auto space-y-3">
            {COMMUTER_NOTIFICATIONS.map((item) => (
              <div
                key={item.id}
                className={`p-3.5 rounded-xl border transition-all ${
                  item.unread
                    ? 'bg-[#ffdad8]/20 border-[#c8102e]/30'
                    : 'bg-[#f8fafc] border-slate-200'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-title-md text-xs font-bold text-[#141b2b]">
                    {item.title}
                  </span>
                  <span className="text-[11px] text-slate-400 font-mono">{item.time}</span>
                </div>
                <p className="text-xs text-[#5c403f] leading-relaxed">{item.content}</p>
              </div>
            ))}
          </div>

          {/* Drawer Footer */}
          <div className="p-4 bg-slate-50 border-t border-slate-100 text-xs text-center text-slate-500">
            Automated alerts via LTA DataMall v5.0 API gateway
          </div>
        </div>
      </div>
    </div>
  );
};
