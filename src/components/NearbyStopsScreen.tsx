import React, { useState } from 'react';
import { BusStop } from '../types/transit';
import { POPULAR_BUS_STOPS } from '../data/transitData';

interface NearbyStopsScreenProps {
  currentStopCode: string;
  onSelectStop: (stop: BusStop) => void;
  onNavigateToArrivals: () => void;
}

export const NearbyStopsScreen: React.FC<NearbyStopsScreenProps> = ({
  currentStopCode,
  onSelectStop,
  onNavigateToArrivals,
}) => {
  const [filterSheltered, setFilterSheltered] = useState(false);
  const [serviceSearch, setServiceSearch] = useState('');

  const nearbyList = POPULAR_BUS_STOPS.filter((stop) => {
    if (filterSheltered && !stop.isSheltered) return false;
    if (serviceSearch && !stop.callingServices.some((s) => s.includes(serviceSearch))) return false;
    return true;
  });

  return (
    <div className="px-4 sm:px-6 lg:px-10 py-5 space-y-6">
      {/* Header Banner */}
      <section className="bg-white rounded-2xl shadow-md p-6 border border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#9e001f] text-[28px]">
              near_me
            </span>
            <h2 className="font-headline-md text-xl text-[#141b2b] font-bold">
              Nearby Stops Within Walking Radius
            </h2>
          </div>
          <p className="text-xs text-[#5c403f] mt-1">
            Grounded by GPS Fix: Orchard / Dhoby Ghaut Corridor (Accurate to ±4m)
          </p>
        </div>

        {/* Filter controls */}
        <div className="flex items-center gap-3 flex-wrap">
          <label className="flex items-center gap-2 text-xs text-slate-700 bg-[#f1f3ff] px-3 py-2 rounded-xl cursor-pointer">
            <input
              type="checkbox"
              checked={filterSheltered}
              onChange={(e) => setFilterSheltered(e.target.checked)}
              className="accent-[#16A34A] rounded"
            />
            <span className="font-medium text-[#16A34A]">100% Sheltered Walkways Only</span>
          </label>

          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-2 text-slate-400 text-[18px]">
              search
            </span>
            <input
              type="text"
              placeholder="Filter by Bus # (e.g. 65)..."
              value={serviceSearch}
              onChange={(e) => setServiceSearch(e.target.value)}
              className="pl-9 pr-3 py-1.5 bg-[#f1f3ff] rounded-xl text-xs focus:ring-2 focus:ring-[#9e001f] focus:outline-none"
            />
          </div>
        </div>
      </section>

      {/* Grid of Nearby Bus Stops */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {nearbyList.map((stop) => {
          const isCurrent = stop.code === currentStopCode;
          return (
            <div
              key={stop.code}
              className={`bg-white rounded-2xl p-5 shadow-md border transition-all flex flex-col justify-between ${
                isCurrent
                  ? 'border-[#c8102e] ring-2 ring-[#c8102e]/20'
                  : 'border-slate-100 hover:border-slate-300 hover:shadow-lg'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-[#293040] text-white">
                        {stop.code}
                      </span>
                      {isCurrent && (
                        <span className="bg-[#c8102e] text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                          Active Pin
                        </span>
                      )}
                    </div>
                    <h3 className="font-title-lg text-base font-bold text-[#141b2b] mt-1">
                      {stop.name}
                    </h3>
                    <p className="text-xs text-[#5c403f]">{stop.roadName}</p>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="font-bold text-sm text-[#00517d] block">
                      {stop.distanceMetres}m
                    </span>
                    <span className="text-[11px] text-slate-500 font-medium">
                      ~{stop.walkingMinutes} min walk
                    </span>
                  </div>
                </div>

                {/* Features & Accessibility */}
                <div className="flex items-center gap-2 flex-wrap text-xs">
                  {stop.isSheltered ? (
                    <span className="inline-flex items-center gap-1 text-[11px] text-[#16A34A] bg-[#16A34A]/10 px-2 py-0.5 rounded font-semibold">
                      <span className="material-symbols-outlined text-[14px]">shield</span> Fully Covered
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[11px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded font-medium">
                      Open Street
                    </span>
                  )}

                  {stop.mrtInterchanges && stop.mrtInterchanges.length > 0 && (
                    <span className="inline-flex items-center gap-1 text-[11px] text-[#00517d] bg-[#00517d]/10 px-2 py-0.5 rounded font-semibold">
                      <span className="material-symbols-outlined text-[14px]">train</span>
                      {stop.mrtInterchanges.join(' / ')}
                    </span>
                  )}
                </div>

                {/* Calling Services Badges */}
                <div>
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
                    Calling Services ({stop.callingServices.length}):
                  </span>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {stop.callingServices.map((svc) => (
                      <span
                        key={svc}
                        className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-[#f1f3ff] text-slate-800 border border-slate-200"
                      >
                        {svc}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Card Action */}
              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => {
                    onSelectStop(stop);
                    onNavigateToArrivals();
                  }}
                  className={`w-full py-2 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                    isCurrent
                      ? 'bg-[#141b2b] text-white'
                      : 'bg-[#9e001f] text-white hover:bg-[#c8102e] shadow-xs'
                  }`}
                >
                  <span className="material-symbols-outlined text-[16px]">
                    {isCurrent ? 'check' : 'visibility'}
                  </span>
                  <span>{isCurrent ? 'Viewing Live Telemetry' : 'Set as Active Stop'}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
