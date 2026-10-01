import React, { useState } from 'react';
import { BusStop } from '../types/transit';
import { POPULAR_BUS_STOPS } from '../data/transitData';

interface ChangeStopModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentStopCode: string;
  onSelectStop: (stop: BusStop) => void;
}

export const ChangeStopModal: React.FC<ChangeStopModalProps> = ({
  isOpen,
  onClose,
  currentStopCode,
  onSelectStop,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen) return null;

  const filteredStops = POPULAR_BUS_STOPS.filter(
    (s) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.code.includes(searchQuery) ||
      s.roadName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.callingServices.some((svc) => svc.includes(searchQuery))
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200">
        <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-[#f9f9ff]">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#9e001f]">pin_drop</span>
            <h3 className="font-headline-sm text-base text-[#141b2b]">Select Active Bus Stop</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <div className="p-4 border-b border-slate-100">
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-2.5 text-slate-400 text-[20px]">
              search
            </span>
            <input
              type="text"
              placeholder="Search by stop name, 5-digit code, or road..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-[#f1f3ff] rounded-xl text-sm border-none focus:ring-2 focus:ring-[#9e001f] focus:outline-none"
              autoFocus
            />
          </div>
        </div>

        <div className="max-h-[380px] overflow-y-auto p-2 space-y-1 divide-y divide-slate-50">
          {filteredStops.map((stop) => {
            const isSelected = stop.code === currentStopCode;
            return (
              <div
                key={stop.code}
                onClick={() => {
                  onSelectStop(stop);
                  onClose();
                }}
                className={`p-3 rounded-xl cursor-pointer transition-all flex items-start justify-between gap-3 ${
                  isSelected ? 'bg-[#ffdad8]/30 border border-[#c8102e]/30' : 'hover:bg-[#f1f3ff]'
                }`}
                role="button"
                tabIndex={0}
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs px-1.5 py-0.5 rounded bg-[#293040] text-white font-bold">
                      {stop.code}
                    </span>
                    <span className="font-title-md text-sm font-bold text-[#141b2b]">{stop.name}</span>
                    {stop.isSheltered && (
                      <span className="text-[10px] text-[#16A34A] bg-[#16A34A]/10 px-1.5 py-0.5 rounded font-medium">
                        Sheltered
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-[#5c403f] flex items-center gap-2">
                    <span>{stop.roadName}</span>
                    <span>•</span>
                    <span>{stop.distanceMetres}m away (~{stop.walkingMinutes} min)</span>
                  </div>
                  <div className="flex items-center gap-1 flex-wrap pt-1">
                    <span className="text-[11px] text-slate-400 mr-1">Buses:</span>
                    {stop.callingServices.slice(0, 7).map((svc) => (
                      <span
                        key={svc}
                        className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-700"
                      >
                        {svc}
                      </span>
                    ))}
                    {stop.callingServices.length > 7 && (
                      <span className="text-[10px] text-slate-400">+{stop.callingServices.length - 7} more</span>
                    )}
                  </div>
                </div>

                {isSelected ? (
                  <span className="bg-[#c8102e] text-white rounded-full p-1 text-xs">
                    <span className="material-symbols-outlined text-[16px]">check</span>
                  </span>
                ) : (
                  <button className="text-xs text-[#9e001f] font-semibold hover:underline shrink-0 pt-1">
                    Select
                  </button>
                )}
              </div>
            );
          })}
        </div>

        <div className="p-3 bg-[#f9f9ff] border-t border-slate-100 text-center">
          <span className="text-xs text-[#5c403f]">
            Detected via LTA Geolocation Network (accuracy ±4m)
          </span>
        </div>
      </div>
    </div>
  );
};
