import React, { useState } from 'react';
import { BUS_65_ROUTE_STOPS, INITIAL_BUS_SERVICES } from '../data/transitData';
import { RouteStopDetail } from '../types/transit';

interface RouteExplorerScreenProps {
  onSelectStopCode: (code: string) => void;
}

export const RouteExplorerScreen: React.FC<RouteExplorerScreenProps> = ({ onSelectStopCode }) => {
  const [selectedService, setSelectedService] = useState<string>('65');
  const [activeDirection, setActiveDirection] = useState<'dir1' | 'dir2'>('dir1');
  const [stopFilter, setStopFilter] = useState<string>('');

  const service = INITIAL_BUS_SERVICES[selectedService] || INITIAL_BUS_SERVICES['65'];
  const allStops: RouteStopDetail[] = BUS_65_ROUTE_STOPS;

  const filteredStops = allStops.filter(
    (s) =>
      s.name.toLowerCase().includes(stopFilter.toLowerCase()) ||
      s.code.includes(stopFilter) ||
      s.road.toLowerCase().includes(stopFilter.toLowerCase()) ||
      s.mrtConnections.some((m) => m.toLowerCase().includes(stopFilter.toLowerCase()))
  );

  return (
    <div className="px-4 sm:px-6 lg:px-10 py-5 space-y-6">
      {/* Route Explorer Header Card */}
      <section className="bg-white rounded-2xl shadow-md p-6 border border-slate-100 relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-[#9e001f] text-white rounded-2xl flex items-center justify-center font-display-lg text-3xl font-extrabold shadow-md shrink-0">
              {service.serviceNo}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="bg-[#8d3f92]/10 text-[#8d3f92] font-label-md text-xs px-2 py-0.5 rounded font-bold">
                  {service.operator}
                </span>
                <span className="bg-[#e9edff] text-[#00517d] font-label-sm text-xs px-2 py-0.5 rounded font-semibold">
                  Trunk Route
                </span>
                <span className="text-xs text-[#16A34A] font-semibold flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-[#16A34A]"></span> 18 Active Fleet Units En Route
                </span>
              </div>
              <h2 className="font-headline-md text-xl text-[#141b2b] font-bold mt-1">
                {service.origin} ⇄ {service.destination}
              </h2>
              <p className="text-xs text-[#5c403f] mt-0.5">{service.via}</p>
            </div>
          </div>

          {/* Quick Service Switcher */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-semibold text-slate-500">Popular Routes:</span>
            {['65', '147', '190', '14', '166', '7', '106'].map((svcNo) => (
              <button
                key={svcNo}
                type="button"
                onClick={() => setSelectedService(svcNo)}
                className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                  selectedService === svcNo
                    ? 'bg-[#9e001f] text-white shadow-xs'
                    : 'bg-[#f1f3ff] text-slate-700 hover:bg-[#e1e8fd]'
                }`}
              >
                Bus {svcNo}
              </button>
            ))}
          </div>
        </div>

        {/* Route Stats Ribbon */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 text-xs">
          <div className="bg-[#f8fafc] p-3 rounded-xl border border-slate-200">
            <span className="text-slate-500 block">Total Route Distance</span>
            <span className="font-bold text-sm text-[#141b2b]">27.1 km (One-Way)</span>
          </div>
          <div className="bg-[#f8fafc] p-3 rounded-xl border border-slate-200">
            <span className="text-slate-500 block">Estimated Travel Time</span>
            <span className="font-bold text-sm text-[#141b2b]">~68 mins end-to-end</span>
          </div>
          <div className="bg-[#f8fafc] p-3 rounded-xl border border-slate-200">
            <span className="text-slate-500 block">Calling Bus Stops</span>
            <span className="font-bold text-sm text-[#141b2b]">24 Designated Stops</span>
          </div>
          <div className="bg-[#f8fafc] p-3 rounded-xl border border-slate-200">
            <span className="text-slate-500 block">Service Frequency</span>
            <span className="font-bold text-sm text-[#16A34A]">Every 6 - 9 mins</span>
          </div>
        </div>

        {/* Direction Switcher & Search Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4">
          <div className="inline-flex bg-[#e9edff] p-1 rounded-xl w-full sm:w-auto">
            <button
              type="button"
              onClick={() => setActiveDirection('dir1')}
              className={`flex-1 sm:flex-initial px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                activeDirection === 'dir1'
                  ? 'bg-[#9e001f] text-white shadow-xs'
                  : 'text-[#141b2b] hover:text-[#9e001f]'
              }`}
            >
              Dir 1: Towards HarbourFront Int
            </button>
            <button
              type="button"
              onClick={() => setActiveDirection('dir2')}
              className={`flex-1 sm:flex-initial px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                activeDirection === 'dir2'
                  ? 'bg-[#9e001f] text-white shadow-xs'
                  : 'text-[#141b2b] hover:text-[#9e001f]'
              }`}
            >
              Dir 2: Towards Tampines Int
            </button>
          </div>

          <div className="relative w-full sm:w-72">
            <span className="material-symbols-outlined absolute left-3 top-2.5 text-slate-400 text-[18px]">
              search
            </span>
            <input
              type="text"
              placeholder="Filter stops or MRT station..."
              value={stopFilter}
              onChange={(e) => setStopFilter(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-[#f1f3ff] rounded-xl text-xs focus:ring-2 focus:ring-[#9e001f] focus:outline-none"
            />
          </div>
        </div>
      </section>

      {/* Stop Sequence Interactive List */}
      <section className="bg-white rounded-2xl shadow-md p-6 border border-slate-100">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h3 className="font-title-lg text-base text-[#141b2b] font-bold">
              Complete Stop Schedule & Real-Time Tracking
            </h3>
            <p className="text-xs text-[#5c403f]">
              Click any stop to jump directly to its live arrival board
            </p>
          </div>
          <span className="text-xs text-slate-500 font-mono">
            Showing {filteredStops.length} of {allStops.length} stops
          </span>
        </div>

        <div className="relative pt-6">
          {/* Vertical connecting line */}
          <div className="absolute left-[39px] top-8 bottom-8 w-1 bg-[#dce2f7]"></div>

          <div className="space-y-4">
            {filteredStops.map((stop) => {
              const isCurrentStop = stop.code === '08031';
              return (
                <div
                  key={stop.code}
                  className={`relative flex items-start gap-4 p-3 rounded-2xl transition-all ${
                    isCurrentStop
                      ? 'bg-[#ffdad8]/30 border border-[#c8102e]/30 shadow-xs'
                      : 'hover:bg-[#f1f3ff]'
                  }`}
                >
                  {/* Sequence Node */}
                  <div
                    className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 shadow-xs ${
                      isCurrentStop
                        ? 'bg-[#c8102e] text-white ring-4 ring-[#c8102e]/20'
                        : stop.hasBusApproaching
                        ? 'bg-[#16A34A] text-white ring-4 ring-[#16A34A]/20'
                        : 'bg-white border-2 border-slate-300 text-slate-700'
                    }`}
                  >
                    {stop.seq}
                  </div>

                  {/* Stop Details */}
                  <div className="flex-1 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono text-xs font-bold px-1.5 py-0.5 rounded bg-[#293040] text-white">
                          {stop.code}
                        </span>
                        <span className="font-title-md text-sm font-bold text-[#141b2b]">
                          {stop.name}
                        </span>
                        {isCurrentStop && (
                          <span className="text-[10px] bg-[#c8102e] text-white px-2 py-0.5 rounded font-bold uppercase tracking-wider">
                            You Are Here
                          </span>
                        )}
                        {stop.hasBusApproaching && (
                          <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold flex items-center gap-1">
                            <span className="material-symbols-outlined text-[12px]">directions_bus</span>
                            Bus {stop.busPlateApproaching} Arriving
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-[#5c403f] flex items-center gap-2">
                        <span>{stop.road}</span>
                        <span>•</span>
                        <span>Stage {stop.fareStage}</span>
                        <span>•</span>
                        <span>{stop.distKm.toFixed(1)} km from terminus</span>
                      </div>
                    </div>

                    {/* MRT Interchange Badges & Action */}
                    <div className="flex items-center gap-3 shrink-0">
                      {stop.mrtConnections.length > 0 && (
                        <div className="flex items-center gap-1">
                          {stop.mrtConnections.map((mrt) => (
                            <span
                              key={mrt}
                              className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-[#00517d] text-white shadow-xs"
                            >
                              {mrt}
                            </span>
                          ))}
                        </div>
                      )}

                      <button
                        type="button"
                        onClick={() => onSelectStopCode(stop.code)}
                        className="px-3 py-1 text-xs font-semibold text-[#9e001f] bg-white border border-[#9e001f]/30 hover:bg-[#ffdad8]/30 rounded-lg transition-colors"
                      >
                        Inspect Stop
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
};
