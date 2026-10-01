import React, { useState, useEffect } from 'react';
import { BusService, BusStop, ServiceStopArrival } from '../types/transit';
import { INITIAL_BUS_SERVICES, ALL_SERVICES_AT_CURRENT_STOP } from '../data/transitData';

interface LiveBusArrivalScreenProps {
  currentStop: BusStop;
  onChangeStopClick: () => void;
  onOpenExpandedMap: () => void;
  onOpenAlertModal: (serviceNo: string) => void;
  onOpenShareModal: (serviceNo: string, arrival: string) => void;
  onSelectServiceForRouteExplorer?: (serviceNo: string) => void;
}

export const LiveBusArrivalScreen: React.FC<LiveBusArrivalScreenProps> = ({
  currentStop,
  onChangeStopClick,
  onOpenExpandedMap,
  onOpenAlertModal,
  onOpenShareModal,
  onSelectServiceForRouteExplorer,
}) => {
  const [selectedServiceNo, setSelectedServiceNo] = useState<string>('65');
  const [activeDirection, setActiveDirection] = useState<'dir1' | 'dir2'>('dir1');
  const [searchInput, setSearchInput] = useState<string>('65');
  const [isFavorites, setIsFavorites] = useState<Record<string, boolean>>({ '65': true });
  const [syncCountdown, setSyncCountdown] = useState<number>(18);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [showToast, setShowToast] = useState<string | null>(null);
  const [selectedFareType, setSelectedFareType] = useState<'adult' | 'student' | 'senior'>('adult');
  const [searchSuggestionsOpen, setSearchSuggestionsOpen] = useState(false);

  // Available services
  const availableServices = INITIAL_BUS_SERVICES;
  const currentService: BusService = availableServices[selectedServiceNo] || availableServices['65'];

  // Countdown timer simulation
  useEffect(() => {
    const timer = setInterval(() => {
      setSyncCountdown((prev) => {
        if (prev <= 1) {
          return 20; // reset
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const triggerManualRefresh = () => {
    setIsRefreshing(true);
    setSyncCountdown(20);
    setTimeout(() => {
      setIsRefreshing(false);
      triggerToast('LTA DataMall telemetry feed refreshed');
    }, 400);
  };

  const triggerToast = (msg: string) => {
    setShowToast(msg);
    setTimeout(() => setShowToast(null), 3000);
  };

  const handleSelectService = (serviceNo: string) => {
    if (availableServices[serviceNo]) {
      setSelectedServiceNo(serviceNo);
      setSearchInput(serviceNo);
    } else {
      // Set to 65 or fallback
      setSelectedServiceNo('65');
      setSearchInput(serviceNo);
      triggerToast(`Showing simulated arrivals for Bus ${serviceNo}`);
    }
    setSearchSuggestionsOpen(false);
  };

  const toggleFavorite = (serviceNo: string) => {
    setIsFavorites((prev) => {
      const next = !prev[serviceNo];
      triggerToast(next ? `Bus ${serviceNo} added to Daily Favorites` : `Bus ${serviceNo} removed from Favorites`);
      return { ...prev, [serviceNo]: next };
    });
  };

  const commonTrunkServices = ['65', '147', '190', '14', '166', '7', '106'];

  return (
    <div className="flex flex-col w-full">
      {/* Toast popup */}
      {showToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#141b2b] text-white text-xs px-4 py-2.5 rounded-xl shadow-xl flex items-center gap-2 border border-slate-700 animate-bounce">
          <span className="material-symbols-outlined text-[18px] text-[#16A34A]">check_circle</span>
          <span>{showToast}</span>
        </div>
      )}

      <div className="px-4 sm:px-6 lg:px-10 py-3 space-y-5">
        {/* Top Search & Nearest Stop Detection Banner */}
        <section className="bg-white rounded-xl shadow-md p-5 relative overflow-hidden border border-slate-100">
          <div className="absolute -right-16 -top-16 w-64 h-64 bg-[#ffdad8]/30 rounded-full blur-3xl pointer-events-none"></div>

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pb-3">
            {/* Geolocation & Nearest Stop Badge */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex items-center gap-1.5 bg-[#e1e8fd] px-3 py-1 rounded-full shadow-xs border border-[#dce2f7]">
                <span className="material-symbols-outlined text-[18px] text-[#9e001f]">near_me</span>
                <span className="font-label-sm text-[11px] text-[#141b2b] uppercase tracking-wider font-bold">
                  Nearest Stop Detected
                </span>
              </div>

              <div className="flex items-center gap-1.5 bg-[#e9edff] px-3 py-1 rounded-lg">
                <span className="font-label-md text-xs text-[#141b2b] font-semibold">{currentStop.name}</span>
                <span className="bg-[#293040] text-[#edf0ff] font-label-sm text-[11px] px-1.5 py-0.5 rounded font-mono font-bold">
                  {currentStop.code}
                </span>
                <span className="text-[#5c403f] font-body-sm text-xs">
                  • {currentStop.distanceMetres}m away (~{currentStop.walkingMinutes} min walk)
                </span>
              </div>

              <button
                type="button"
                onClick={onChangeStopClick}
                className="inline-flex items-center gap-1 font-label-md text-xs text-[#9e001f] hover:text-[#c8102e] px-2 py-1 rounded transition-colors font-semibold"
              >
                <span className="material-symbols-outlined text-[16px]">swap_horiz</span>
                <span>Change Stop</span>
              </button>

              <button
                type="button"
                onClick={() => triggerToast('GPS Satellite lock refreshed (±3.8m accuracy)')}
                className="inline-flex items-center gap-1 font-label-md text-xs text-[#00517d] hover:text-[#006aa1] px-2 py-1 rounded transition-colors font-semibold"
              >
                <span className="material-symbols-outlined text-[16px]">my_location</span>
                <span>GPS Active (±4m)</span>
              </button>
            </div>

            {/* Telemetry Clock & Auto-refresh status */}
            <div className="flex items-center gap-3 shrink-0">
              <div className="flex items-center gap-1.5 bg-[#f1f5f9] px-3 py-1.5 rounded-lg shadow-xs border border-slate-200">
                <span
                  className={`material-symbols-outlined text-[16px] text-[#16A34A] ${
                    isRefreshing ? 'animate-spin' : ''
                  }`}
                >
                  autorenew
                </span>
                <span className="font-label-sm text-xs text-[#5c403f]">
                  DataMall Sync: <strong className="text-[#141b2b] font-semibold">{syncCountdown}s</strong>
                </span>
              </div>

              <button
                type="button"
                onClick={triggerManualRefresh}
                className={`bg-[#e1e8fd] hover:bg-[#dce2f7] text-[#141b2b] p-2 rounded-lg transition-transform active:scale-95 shadow-xs ${
                  isRefreshing ? 'rotate-180 transition-transform duration-300' : ''
                }`}
                title="Instant Refresh Telemetry"
              >
                <span className="material-symbols-outlined text-[20px]">refresh</span>
              </button>
            </div>
          </div>

          {/* Live Bus Query Input & Omnibox Strip */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3 pt-1">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="material-symbols-outlined text-[24px] text-[#9e001f]">directions_bus</span>
              </div>
              <input
                type="text"
                value={searchInput}
                onChange={(e) => {
                  setSearchInput(e.target.value);
                  setSearchSuggestionsOpen(true);
                }}
                onFocus={() => setSearchSuggestionsOpen(true)}
                placeholder="Enter SG Bus Service (e.g. 65, 190, 147, 960)..."
                className="w-full pl-12 pr-28 py-3.5 bg-[#f1f3ff] focus:bg-white text-[#141b2b] font-headline-sm text-lg rounded-xl focus:outline-none focus:ring-2 focus:ring-[#9e001f] shadow-inner transition-all placeholder:text-[#906f6e]"
              />

              <div className="absolute inset-y-0 right-0 pr-2 flex items-center gap-1">
                <span className="bg-[#9e001f] text-white font-label-sm text-[11px] px-2 py-1 rounded uppercase tracking-wider font-bold">
                  Active
                </span>
                {searchInput && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchInput('');
                    }}
                    className="p-1 text-[#5c403f] hover:text-[#141b2b]"
                  >
                    <span className="material-symbols-outlined text-[18px]">cancel</span>
                  </button>
                )}
              </div>

              {/* Suggestions Dropdown */}
              {searchSuggestionsOpen && searchInput && (
                <div className="absolute left-0 right-0 top-full mt-1 bg-white rounded-xl shadow-xl border border-slate-200 z-30 max-h-48 overflow-y-auto divide-y divide-slate-100">
                  {Object.keys(availableServices)
                    .filter((key) => key.includes(searchInput))
                    .map((key) => {
                      const svc = availableServices[key];
                      return (
                        <div
                          key={key}
                          onClick={() => handleSelectService(key)}
                          className="p-3 hover:bg-[#f1f3ff] cursor-pointer flex items-center justify-between text-xs"
                          role="button"
                          tabIndex={0}
                        >
                          <div className="flex items-center gap-2">
                            <span className="bg-[#9e001f] text-white font-bold px-2 py-0.5 rounded font-mono">
                              {svc.serviceNo}
                            </span>
                            <span className="font-semibold text-[#141b2b]">
                              {svc.origin} ⇄ {svc.destination}
                            </span>
                          </div>
                          <span className="text-[#5c403f] text-[11px]">{svc.operator}</span>
                        </div>
                      );
                    })}
                </div>
              )}
            </div>

            {/* Direction Segment Switcher */}
            <div className="inline-flex bg-[#e9edff] p-1 rounded-xl shadow-xs shrink-0">
              <button
                type="button"
                onClick={() => setActiveDirection('dir1')}
                className={`px-3.5 py-2.5 rounded-lg font-label-md text-xs transition-all flex items-center gap-1.5 ${
                  activeDirection === 'dir1'
                    ? 'bg-[#9e001f] text-white font-bold shadow-xs'
                    : 'text-[#141b2b] hover:text-[#9e001f]'
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                <span>{currentService.direction1Name}</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveDirection('dir2')}
                className={`px-3.5 py-2.5 rounded-lg font-label-md text-xs transition-colors flex items-center gap-1.5 ${
                  activeDirection === 'dir2'
                    ? 'bg-[#9e001f] text-white font-bold shadow-xs'
                    : 'text-[#141b2b] hover:text-[#9e001f]'
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">arrow_back</span>
                <span>{currentService.direction2Name}</span>
              </button>
            </div>
          </div>

          {/* Quick Suggest Filter Chips */}
          <div className="flex items-center gap-2 mt-3 overflow-x-auto pb-1">
            <span className="font-label-sm text-[11px] text-[#5c403f] shrink-0 uppercase tracking-wider font-semibold">
              Common Trunk Services:
            </span>
            {commonTrunkServices.map((busNo) => {
              const isSelected = selectedServiceNo === busNo;
              return (
                <button
                  key={busNo}
                  type="button"
                  onClick={() => handleSelectService(busNo)}
                  className={`px-3.5 py-1 rounded-full font-label-md text-xs shadow-xs shrink-0 flex items-center gap-1 transition-all ${
                    isSelected
                      ? 'bg-[#293040] text-white font-bold'
                      : 'bg-[#e1e8fd] hover:bg-[#dce2f7] text-[#141b2b]'
                  }`}
                >
                  {isSelected && <span className="material-symbols-outlined text-[14px]">check</span>}
                  Bus {busNo}
                </button>
              );
            })}
          </div>
        </section>

        {/* Main Live Telemetry Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Left Column: Primary Queried Bus Detail Card (8 cols) */}
          <div className="lg:col-span-8 flex flex-col gap-5">
            {/* Live Arrival Hero Card */}
            <div className="bg-white rounded-xl shadow-lg p-5 relative overflow-hidden border border-slate-100">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-3 pb-3">
                {/* Bus Service Identification Plate */}
                <div className="flex items-start gap-4">
                  <div className="flex flex-col items-center justify-center bg-[#9e001f] text-white rounded-xl w-24 h-24 shadow-md shrink-0">
                    <span className="font-display-lg text-4xl tracking-tight font-extrabold leading-none">
                      {currentService.serviceNo}
                    </span>
                    <span className="font-label-sm text-[10px] uppercase tracking-widest mt-1 opacity-90 font-bold">
                      {currentService.category}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="bg-[#8d3f92]/10 text-[#8d3f92] font-label-md text-xs px-2 py-0.5 rounded font-semibold">
                        {currentService.operator}
                      </span>
                      <span className="bg-[#f1f5f9] text-[#5c403f] font-label-sm text-xs px-2 py-0.5 rounded">
                        SimplyGo Standard
                      </span>
                      <span className="inline-flex items-center gap-1 text-[#0284C7] font-label-sm text-xs font-medium">
                        <span className="material-symbols-outlined text-[14px]">accessible</span> WAB Certified
                      </span>
                    </div>

                    <h2 className="font-headline-md text-xl text-[#141b2b] font-bold tracking-tight">
                      {currentService.origin} ⇄ {currentService.destination}
                    </h2>

                    <p className="font-body-sm text-xs text-[#5c403f] flex items-center gap-1">
                      <span className="material-symbols-outlined text-[16px] text-[#9e001f]">route</span>
                      {currentService.via}
                    </p>
                  </div>
                </div>

                {/* Action Quick Tray */}
                <div className="flex items-center gap-1.5 shrink-0 self-start">
                  <button
                    type="button"
                    onClick={() => toggleFavorite(currentService.serviceNo)}
                    className="p-2.5 bg-[#f1f3ff] hover:bg-[#e1e8fd] text-[#9e001f] rounded-lg shadow-xs transition-transform active:scale-95"
                    title="Add to Daily Favorites"
                  >
                    <span
                      className="material-symbols-outlined text-[20px]"
                      style={{ fontVariationSettings: isFavorites[currentService.serviceNo] ? "'FILL' 1" : "'FILL' 0" }}
                    >
                      favorite
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onOpenAlertModal(currentService.serviceNo)}
                    className="p-2.5 bg-[#f1f3ff] hover:bg-[#e1e8fd] text-[#141b2b] rounded-lg shadow-xs transition-transform active:scale-95"
                    title="Set Push Alert 3 min before"
                  >
                    <span className="material-symbols-outlined text-[20px]">notifications_active</span>
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      onOpenShareModal(
                        currentService.serviceNo,
                        currentService.arrivals[0]?.estimatedMinutes === 1 ? '1 min' : `${currentService.arrivals[0]?.estimatedMinutes} mins`
                      )
                    }
                    className="p-2.5 bg-[#f1f3ff] hover:bg-[#e1e8fd] text-[#141b2b] rounded-lg shadow-xs transition-transform active:scale-95"
                    title="Share Stop ETA"
                  >
                    <span className="material-symbols-outlined text-[20px]">share</span>
                  </button>
                </div>
              </div>

              {/* Triple Arrival Real-time Telemetry Slots */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
                {/* 1st Bus (Arriving) */}
                <div className="bg-gradient-to-b from-[#16A34A]/10 via-white to-white rounded-xl p-3.5 shadow-xs relative overflow-hidden border border-[#16A34A]/20">
                  <div className="flex items-center justify-between">
                    <span className="font-label-sm text-[11px] uppercase tracking-wider text-[#16A34A] font-bold flex items-center gap-1">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#16A34A] opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-[#16A34A]"></span>
                      </span>
                      1st Bus Arrival
                    </span>
                    <span className="bg-[#00517d]/10 text-[#00517d] font-label-sm text-[11px] px-1.5 py-0.5 rounded font-mono font-bold">
                      {currentService.arrivals[0]?.plate || 'SG5902T'}
                    </span>
                  </div>

                  <div className="my-2">
                    <div className="flex items-baseline gap-1">
                      <span className="font-telemetry-time text-2xl text-[#16A34A] tracking-tight font-extrabold">
                        {currentService.arrivals[0]?.isArriving ? 'ARRIVING' : `${currentService.arrivals[0]?.estimatedMinutes} mins`}
                      </span>
                      <span className="font-title-md text-sm text-[#5c403f] font-medium">(1 min)</span>
                    </div>
                    <div className="w-full bg-[#f1f5f9] rounded-full h-1.5 mt-1 overflow-hidden">
                      <div className="bg-[#16A34A] h-1.5 rounded-full w-[94%]"></div>
                    </div>
                  </div>

                  {/* Metadata Pills */}
                  <div className="space-y-1.5 pt-1 border-t border-slate-100">
                    <div className="flex items-center justify-between text-xs">
                      <span className="inline-flex items-center gap-1 text-[#141b2b] font-medium">
                        <span className="material-symbols-outlined text-[16px] text-[#9e001f]">directions_bus</span>{' '}
                        {currentService.arrivals[0]?.deckName || 'Double Deck (DD)'}
                      </span>
                      <span className="inline-flex items-center gap-1 bg-[#16A34A]/10 text-[#16A34A] px-2 py-0.5 rounded-full font-label-sm text-[11px] font-semibold">
                        <span className="material-symbols-outlined text-[14px]">airline_seat_recline_normal</span> Seats Avail
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs">
                      <span className="inline-flex items-center gap-1 text-[#0284C7] font-label-sm text-[11px]">
                        <span className="material-symbols-outlined text-[16px]">accessible_forward</span> Wheelchair Ramp
                      </span>
                      <span className="bg-[#f1f5f9] text-[#5c403f] font-label-sm text-[11px] px-1.5 py-0.5 rounded">
                        ⚡ {currentService.arrivals[0]?.powertrain || 'EV Electric'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* 2nd Bus */}
                <div className="bg-[#f8fafc] rounded-xl p-3.5 shadow-xs border border-slate-200">
                  <div className="flex items-center justify-between">
                    <span className="font-label-sm text-[11px] uppercase tracking-wider text-[#5c403f] font-bold">
                      2nd Bus Arrival
                    </span>
                    <span className="bg-[#f1f5f9] text-[#5c403f] font-label-sm text-[11px] px-1.5 py-0.5 rounded font-mono font-bold">
                      {currentService.arrivals[1]?.plate || 'SG1840E'}
                    </span>
                  </div>

                  <div className="my-2">
                    <div className="flex items-baseline gap-1">
                      <span className="font-telemetry-time text-2xl text-[#141b2b] tracking-tight font-extrabold">
                        {currentService.arrivals[1]?.estimatedMinutes || 8} mins
                      </span>
                    </div>
                    <div className="w-full bg-[#f1f5f9] rounded-full h-1.5 mt-1 overflow-hidden">
                      <div className="bg-[#D97706] h-1.5 rounded-full w-[55%]"></div>
                    </div>
                  </div>

                  {/* Metadata Pills */}
                  <div className="space-y-1.5 pt-1 border-t border-slate-200">
                    <div className="flex items-center justify-between text-xs">
                      <span className="inline-flex items-center gap-1 text-[#141b2b] font-medium">
                        <span className="material-symbols-outlined text-[16px] text-[#9e001f]">directions_bus</span>{' '}
                        {currentService.arrivals[1]?.deckName || 'Double Deck (DD)'}
                      </span>
                      <span className="inline-flex items-center gap-1 bg-[#D97706]/10 text-[#D97706] px-2 py-0.5 rounded-full font-label-sm text-[11px] font-semibold">
                        <span className="material-symbols-outlined text-[14px]">person</span> Standing Avail
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs">
                      <span className="inline-flex items-center gap-1 text-[#0284C7] font-label-sm text-[11px]">
                        <span className="material-symbols-outlined text-[16px]">accessible_forward</span> Wheelchair Ramp
                      </span>
                      <span className="bg-[#f1f5f9] text-[#5c403f] font-label-sm text-[11px] px-1.5 py-0.5 rounded">
                        {currentService.arrivals[1]?.powertrain || 'Euro 6 Diesel'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* 3rd Bus */}
                <div className="bg-[#f8fafc] rounded-xl p-3.5 shadow-xs border border-slate-200">
                  <div className="flex items-center justify-between">
                    <span className="font-label-sm text-[11px] uppercase tracking-wider text-[#5c403f] font-bold">
                      3rd Bus Arrival
                    </span>
                    <span className="bg-[#f1f5f9] text-[#5c403f] font-label-sm text-[11px] px-1.5 py-0.5 rounded font-mono font-bold">
                      {currentService.arrivals[2]?.plate || 'SBS8831B'}
                    </span>
                  </div>

                  <div className="my-2">
                    <div className="flex items-baseline gap-1">
                      <span className="font-telemetry-time text-2xl text-[#141b2b] tracking-tight font-extrabold">
                        {currentService.arrivals[2]?.estimatedMinutes || 19} mins
                      </span>
                    </div>
                    <div className="w-full bg-[#f1f5f9] rounded-full h-1.5 mt-1 overflow-hidden">
                      <div className="bg-[#DC2626] h-1.5 rounded-full w-[25%]"></div>
                    </div>
                  </div>

                  {/* Metadata Pills */}
                  <div className="space-y-1.5 pt-1 border-t border-slate-200">
                    <div className="flex items-center justify-between text-xs">
                      <span className="inline-flex items-center gap-1 text-[#141b2b] font-medium">
                        <span className="material-symbols-outlined text-[16px] text-[#5c403f]">directions_bus</span>{' '}
                        {currentService.arrivals[2]?.deckName || 'Single Deck (SD)'}
                      </span>
                      <span className="inline-flex items-center gap-1 bg-[#DC2626]/10 text-[#DC2626] px-2 py-0.5 rounded-full font-label-sm text-[11px] font-semibold">
                        <span className="material-symbols-outlined text-[14px]">groups</span> Limited Standing
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs">
                      <span className="inline-flex items-center gap-1 text-[#0284C7] font-label-sm text-[11px]">
                        <span className="material-symbols-outlined text-[16px]">accessible_forward</span> Wheelchair Ramp
                      </span>
                      <span className="bg-[#f1f5f9] text-[#5c403f] font-label-sm text-[11px] px-1.5 py-0.5 rounded">
                        {currentService.arrivals[2]?.powertrain || 'Euro 5 Diesel'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Real-Time Progression Strip */}
              <div className="mt-5 pt-3 bg-[#f1f3ff] rounded-xl p-3.5 border border-[#e1e8fd]">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-label-sm text-[11px] uppercase tracking-wider text-[#141b2b] font-bold flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px] text-[#9e001f]">linear_scale</span>
                    Live Bus Progression Corridor ({currentService.direction1Name.replace('Dir 1: ', '')} Bound)
                  </span>
                  <span className="font-body-sm text-xs text-[#5c403f]">
                    Vehicle GPS: 140m before junction
                  </span>
                </div>

                {/* Progression Track Graphic */}
                <div className="relative py-2">
                  <div className="absolute top-1/2 left-0 right-0 h-1.5 bg-[#dce2f7] -translate-y-1/2 rounded-full"></div>
                  <div className="absolute top-1/2 left-0 w-2/5 h-1.5 bg-[#9e001f] -translate-y-1/2 rounded-full"></div>

                  <div className="relative flex items-center justify-between">
                    {/* Stop 1 */}
                    <div className="flex flex-col items-center text-center">
                      <div className="w-6 h-6 rounded-full bg-[#9e001f] text-white flex items-center justify-center shadow-xs text-[12px] font-bold">
                        ✓
                      </div>
                      <span className="font-label-sm text-[11px] text-[#5c403f] mt-1.5 max-w-[80px]">
                        Bef Bencoolen
                      </span>
                      <span className="font-body-sm text-[10px] text-[#5c403f]/70 font-mono">08069</span>
                    </div>

                    {/* Bus In Motion Marker */}
                    <div className="flex flex-col items-center relative -mt-3">
                      <div className="bg-[#9e001f] text-white px-2 py-0.5 rounded-full shadow-md flex items-center gap-1 animate-bounce">
                        <span className="material-symbols-outlined text-[14px]">directions_bus</span>
                        <span className="font-label-sm text-[11px] font-bold">{currentService.serviceNo}</span>
                      </div>
                      <div className="w-2.5 h-2.5 rounded-full bg-[#9e001f] mt-1"></div>
                      <span className="font-label-sm text-[11px] text-[#9e001f] font-semibold mt-0.5">
                        En Route (42 km/h)
                      </span>
                    </div>

                    {/* Current / Nearest Stop */}
                    <div className="flex flex-col items-center text-center">
                      <div className="w-7 h-7 rounded-full bg-[#c8102e] text-white flex items-center justify-center shadow-md ring-4 ring-[#c8102e]/20">
                        <span className="material-symbols-outlined text-[16px]">location_on</span>
                      </div>
                      <span className="font-label-md text-xs text-[#141b2b] font-bold mt-1 max-w-[90px]">
                        {currentStop.name}
                      </span>
                      <span className="font-label-sm text-[10px] text-[#9e001f] font-bold">YOU ARE HERE</span>
                    </div>

                    {/* Stop 3 */}
                    <div className="flex flex-col items-center text-center opacity-70">
                      <div className="w-5 h-5 rounded-full bg-white text-[#141b2b] flex items-center justify-center shadow-xs border border-slate-300">
                        <div className="w-2 h-2 rounded-full bg-[#906f6e]"></div>
                      </div>
                      <span className="font-label-sm text-[11px] text-[#5c403f] mt-1.5 max-w-[80px]">
                        MacDonald House
                      </span>
                      <span className="font-body-sm text-[10px] text-[#5c403f]/70 font-mono">08051</span>
                    </div>

                    {/* Stop 4 */}
                    <div className="flex flex-col items-center text-center opacity-70">
                      <div className="w-5 h-5 rounded-full bg-white text-[#141b2b] flex items-center justify-center shadow-xs border border-slate-300">
                        <div className="w-2 h-2 rounded-full bg-[#906f6e]"></div>
                      </div>
                      <span className="font-label-sm text-[11px] text-[#5c403f] mt-1.5 max-w-[80px]">
                        Winsland House
                      </span>
                      <span className="font-body-sm text-[10px] text-[#5c403f]/70 font-mono">08111</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Other Buses Serving This Stop (Comparison Board) */}
            <div className="bg-white rounded-xl shadow-md p-5 border border-slate-100">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="bg-[#293040] text-[#edf0ff] font-label-sm text-[11px] px-1.5 py-0.5 rounded font-mono font-bold">
                      {currentStop.code}
                    </span>
                    <h3 className="font-title-lg text-base text-[#141b2b] font-bold">
                      All Services Calling at {currentStop.name}
                    </h3>
                  </div>
                  <p className="font-body-sm text-xs text-[#5c403f]">
                    Live LTA DataMall streaming feed • Tap any service to inspect detailed headway
                  </p>
                </div>

                {/* Legend for capacity */}
                <div className="flex items-center gap-3 bg-[#f1f3ff] px-3 py-1 rounded-lg shrink-0 text-xs">
                  <span className="inline-flex items-center gap-1 font-label-sm text-[11px] text-[#16A34A] font-semibold">
                    <span className="w-2 h-2 rounded-full bg-[#16A34A]"></span> Seats
                  </span>
                  <span className="inline-flex items-center gap-1 font-label-sm text-[11px] text-[#D97706] font-semibold">
                    <span className="w-2 h-2 rounded-full bg-[#D97706]"></span> Standing
                  </span>
                  <span className="inline-flex items-center gap-1 font-label-sm text-[11px] text-[#DC2626] font-semibold">
                    <span className="w-2 h-2 rounded-full bg-[#DC2626]"></span> Crowded
                  </span>
                </div>
              </div>

              {/* Schedule Grid / Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                {ALL_SERVICES_AT_CURRENT_STOP.map((svc) => {
                  const isCrowded = svc.firstCrowding === 'crowded';
                  const isStanding = svc.firstCrowding === 'standing';
                  const crowdingColor = isCrowded
                    ? 'text-[#DC2626]'
                    : isStanding
                    ? 'text-[#D97706]'
                    : 'text-[#16A34A]';
                  const dotBg = isCrowded
                    ? 'bg-[#DC2626]'
                    : isStanding
                    ? 'bg-[#D97706]'
                    : 'bg-[#16A34A]';

                  return (
                    <div
                      key={svc.serviceNo}
                      onClick={() => handleSelectService(svc.serviceNo)}
                      className={`bg-[#f1f3ff] hover:bg-[#e9edff] p-3 rounded-xl transition-all shadow-xs flex items-center justify-between cursor-pointer border ${
                        selectedServiceNo === svc.serviceNo
                          ? 'border-[#9e001f] ring-1 ring-[#9e001f]'
                          : 'border-transparent'
                      }`}
                      role="button"
                      tabIndex={0}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="w-12 h-12 rounded-lg text-white flex items-center justify-center font-headline-sm text-lg font-extrabold shadow-xs"
                          style={{ backgroundColor: svc.accentColor || '#9e001f' }}
                        >
                          {svc.serviceNo}
                        </div>
                        <div>
                          <div className="font-label-md text-xs text-[#141b2b] font-semibold">
                            {svc.originDest}
                          </div>
                          <div className="font-body-sm text-[11px] text-[#5c403f] flex items-center gap-1">
                            <span className="material-symbols-outlined text-[14px]">directions_bus</span>{' '}
                            {svc.deck}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <div
                            className={`font-title-lg text-sm font-extrabold flex items-center justify-end gap-1 ${crowdingColor}`}
                          >
                            <span
                              className={`w-2 h-2 rounded-full ${dotBg} ${
                                svc.firstArrivalMin === 'ARR' ? 'animate-pulse' : ''
                              }`}
                            ></span>
                            {svc.firstArrivalMin === 'ARR' ? 'ARR' : `${svc.firstArrivalMin} min`}
                          </div>
                          <div className="font-label-sm text-[11px] text-[#5c403f]">
                            Next: {svc.nextArrivalMin} min
                          </div>
                        </div>

                        <span className="material-symbols-outlined text-[20px] text-slate-400">
                          chevron_right
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Walking Radius Map & Commuter Utilities (4 cols) */}
          <div className="lg:col-span-4 flex flex-col gap-5">
            {/* Walking Navigation Vector Schematic Card */}
            <div className="bg-white rounded-xl shadow-md p-5 flex flex-col border border-slate-100">
              <div className="flex items-center justify-between pb-2">
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[20px] text-[#9e001f]">
                    directions_walk
                  </span>
                  <h3 className="font-title-md text-sm text-[#141b2b] font-bold">Walking Radius to Stop</h3>
                </div>
                <span className="bg-[#16A34A]/10 text-[#16A34A] font-label-sm text-[11px] px-2 py-0.5 rounded font-semibold">
                  {currentStop.distanceMetres}m • {currentStop.walkingMinutes} min
                </span>
              </div>

              <p className="font-body-sm text-xs text-[#5c403f] mb-3">
                From current GPS fix via Dhoby Ghaut North Link underground linkway (fully sheltered).
              </p>

              {/* Embedded Stylized SVG Map of Dhoby Ghaut Vicinity */}
              <div className="relative w-full h-56 bg-[#f1f3ff] rounded-xl overflow-hidden shadow-inner border border-[#dce2f7]">
                <svg
                  className="w-full h-full"
                  viewBox="0 0 360 220"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {/* Map Background Base Grids / City Blocks */}
                  <rect x="20" y="20" width="130" height="70" rx="8" fill="#E1E8FD" opacity="0.6" />
                  <text x="30" y="45" fill="#5C403F" fontFamily="Inter" fontSize="10" fontWeight="600">
                    Plaza Singapura
                  </text>
                  <text x="30" y="58" fill="#906F6E" fontFamily="Inter" fontSize="9">
                    Atrium Mall Wing
                  </text>

                  <rect x="210" y="15" width="130" height="75" rx="8" fill="#E1E8FD" opacity="0.6" />
                  <text x="220" y="40" fill="#5C403F" fontFamily="Inter" fontSize="10" fontWeight="600">
                    MacDonald House
                  </text>
                  <text x="220" y="53" fill="#906F6E" fontFamily="Inter" fontSize="9">
                    Historic Landmark
                  </text>

                  <rect x="20" y="140" width="150" height="65" rx="8" fill="#E1E8FD" opacity="0.6" />
                  <text x="30" y="165" fill="#5C403F" fontFamily="Inter" fontSize="10" fontWeight="600">
                    The Cathay
                  </text>
                  <text x="30" y="178" fill="#906F6E" fontFamily="Inter" fontSize="9">
                    Handy Road Sector
                  </text>

                  <rect x="200" y="140" width="140" height="65" rx="8" fill="#E1E8FD" opacity="0.6" />
                  <text x="210" y="165" fill="#5C403F" fontFamily="Inter" fontSize="10" fontWeight="600">
                    SOTA Building
                  </text>
                  <text x="210" y="178" fill="#906F6E" fontFamily="Inter" fontSize="9">
                    School of the Arts
                  </text>

                  {/* Main Roads */}
                  <path d="M 0 108 L 360 108" stroke="#D3DAEF" strokeWidth="26" strokeLinecap="round" />
                  <text
                    x="130"
                    y="112"
                    fill="#712578"
                    fontFamily="Inter"
                    fontSize="10"
                    fontWeight="700"
                    letterSpacing="1"
                  >
                    ORCHARD ROAD
                  </text>
                  <path d="M 180 0 L 180 220" stroke="#D3DAEF" strokeWidth="20" />

                  {/* Walking Route Dotted Line */}
                  <path d="M 75 85 Q 85 108 175 108" stroke="#C8102E" strokeWidth="3" strokeDasharray="4 4" />

                  {/* MRT Exit Indicator */}
                  <circle cx="70" cy="85" r="7" fill="#00517D" />
                  <text x="67" y="88" fill="#FFFFFF" fontFamily="Inter" fontSize="9" fontWeight="800">
                    B
                  </text>

                  {/* Live Commuter Location Pulse Pin */}
                  <g transform="translate(70, 85)">
                    <circle cx="0" cy="0" r="14" fill="#0284C7" opacity="0.25">
                      <animate attributeName="r" values="6;16;6" dur="2s" repeatCount="indefinite" />
                      <animate attributeName="opacity" values="0.4;0.05;0.4" dur="2s" repeatCount="indefinite" />
                    </circle>
                    <circle cx="0" cy="0" r="4" fill="#0284C7" />
                  </g>

                  {/* Target Bus Stop Pin (Stop ID 08031) */}
                  <g transform="translate(180, 108)">
                    <circle cx="0" cy="0" r="9" fill="#C8102E" />
                    <circle cx="0" cy="0" r="4" fill="#FFFFFF" />
                  </g>

                  {/* Callout Pin Label */}
                  <rect
                    x="195"
                    y="93"
                    width="120"
                    height="28"
                    rx="6"
                    fill="#141B2B"
                    filter="drop-shadow(0 2px 4px rgba(0,0,0,0.15))"
                  />
                  <text x="203" y="106" fill="#FFFFFF" fontFamily="Inter" fontSize="9" fontWeight="700">
                    Bus Stop {currentStop.code}
                  </text>
                  <text x="203" y="116" fill="#16A34A" fontFamily="Inter" fontSize="8" fontWeight="600">
                    {currentStop.name}
                  </text>
                </svg>

                {/* Map Layer Overlay Controls */}
                <div className="absolute bottom-2 left-2 flex items-center gap-1 bg-white/90 backdrop-blur-md px-2 py-1 rounded text-[#141b2b] shadow-xs border border-slate-200">
                  <span className="material-symbols-outlined text-[14px] text-[#16A34A]">shield</span>
                  <span className="font-label-sm text-[10px] font-semibold">Sheltered Linkway Active</span>
                </div>

                <button
                  type="button"
                  onClick={onOpenExpandedMap}
                  className="absolute top-2 right-2 bg-white/90 hover:bg-white p-1 rounded-md shadow-xs text-[#141b2b] border border-slate-200"
                  title="Expand Interactive Map"
                >
                  <span className="material-symbols-outlined text-[16px]">open_in_full</span>
                </button>
              </div>

              <div className="flex items-center justify-between pt-2 text-xs text-[#5c403f]">
                <span>
                  MRT Interchanges: <strong>NS24 / NE6 / CC1</strong>
                </span>
                <span className="text-[#9e001f] font-semibold">Orchard Corridor</span>
              </div>
            </div>

            {/* Commuter Weather & Umbrella Advisory */}
            <div className="bg-gradient-to-br from-white to-[#e9edff] rounded-xl p-4 shadow-md flex items-start gap-3 border border-slate-100">
              <div className="w-10 h-10 rounded-xl bg-[#00517d]/10 text-[#00517d] flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[24px]">rainy</span>
              </div>
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-label-md text-xs text-[#141b2b] font-bold">NEA Weather Radar</span>
                  <span className="font-label-sm text-xs text-[#5c403f] font-semibold">29°C</span>
                </div>
                <p className="font-body-sm text-xs text-[#141b2b]">
                  Light shower expected in Orchard sector in 25 mins.
                </p>
                <span className="font-label-sm text-[11px] text-[#16A34A] flex items-center gap-1 font-semibold">
                  <span className="material-symbols-outlined text-[14px]">check_circle</span> All 8 downstream stops
                  feature covered LTA shelters.
                </span>
              </div>
            </div>

            {/* Operating Hours Schedule for Active Bus */}
            <div className="bg-white rounded-xl shadow-md p-5 border border-slate-100">
              <div className="flex items-center justify-between pb-2">
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[18px] text-[#9e001f]">schedule</span>
                  <h4 className="font-title-md text-sm text-[#141b2b] font-bold">
                    Operating Hours (Bus {currentService.serviceNo})
                  </h4>
                </div>
                <span className="bg-[#f1f5f9] font-label-sm text-[11px] text-[#5c403f] px-2 py-0.5 rounded font-semibold">
                  {currentService.operator}
                </span>
              </div>

              <div className="space-y-1 text-xs">
                <div className="flex items-center justify-between py-1.5 px-2 rounded bg-[#f8fafc]">
                  <span className="text-[#141b2b] font-medium">Mondays – Fridays</span>
                  <span className="text-[#141b2b] font-mono font-semibold">
                    {currentService.firstBusWeekday}
                  </span>
                </div>
                <div className="flex items-center justify-between py-1.5 px-2 rounded">
                  <span className="text-[#141b2b] font-medium">Saturdays</span>
                  <span className="text-[#141b2b] font-mono font-semibold">{currentService.firstBusSat}</span>
                </div>
                <div className="flex items-center justify-between py-1.5 px-2 rounded bg-[#f8fafc]">
                  <span className="text-[#141b2b] font-medium">Sundays & Public Holidays</span>
                  <span className="text-[#141b2b] font-mono font-semibold">{currentService.firstBusSun}</span>
                </div>
                <div className="flex items-center justify-between py-1.5 px-2 text-[#5c403f] text-[11px]">
                  <span>Peak Headway: {currentService.peakHeadway}</span>
                  <span>Off-Peak: {currentService.offPeakHeadway}</span>
                </div>
              </div>
            </div>

            {/* Fare Calculator Preview */}
            <div className="bg-white rounded-xl shadow-md p-5 border border-slate-100">
              <div className="flex items-center justify-between pb-2">
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[18px] text-[#9e001f]">credit_card</span>
                  <h4 className="font-title-md text-sm text-[#141b2b] font-bold">SimplyGo Distance Fare</h4>
                </div>
                <span className="bg-[#16A34A]/10 text-[#16A34A] font-label-sm text-[11px] px-2 py-0.5 rounded font-bold">
                  Distance-Based
                </span>
              </div>

              <div className="p-3.5 bg-[#f1f3ff] rounded-xl space-y-2 border border-[#e1e8fd]">
                {/* Concession selector tabs */}
                <div className="flex items-center gap-1 p-1 bg-white rounded-lg border border-slate-200">
                  <button
                    type="button"
                    onClick={() => setSelectedFareType('adult')}
                    className={`flex-1 py-1 text-[11px] font-semibold rounded ${
                      selectedFareType === 'adult'
                        ? 'bg-[#9e001f] text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Adult
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedFareType('student')}
                    className={`flex-1 py-1 text-[11px] font-semibold rounded ${
                      selectedFareType === 'student'
                        ? 'bg-[#9e001f] text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Student
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedFareType('senior')}
                    className={`flex-1 py-1 text-[11px] font-semibold rounded ${
                      selectedFareType === 'senior'
                        ? 'bg-[#9e001f] text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Senior / PWD
                  </button>
                </div>

                <div className="flex items-center justify-between text-xs pt-1">
                  <span className="text-[#5c403f]">
                    {selectedFareType === 'adult'
                      ? 'Adult (Card / SimplyGo Mobile):'
                      : selectedFareType === 'student'
                      ? 'Student Concession Fare:'
                      : 'Senior Citizen / PWD Concession:'}
                  </span>
                  <span className="text-[#9e001f] font-headline-sm text-lg font-bold">
                    {selectedFareType === 'adult' ? '$1.29' : selectedFareType === 'student' ? '$0.52' : '$0.75'}
                  </span>
                </div>

                <div className="pt-1 text-[11px] text-[#5c403f] leading-normal border-t border-slate-200">
                  Transfer rebate of $0.50 automatically applied if switching from Dhoby Ghaut MRT within 45 mins.
                </div>
              </div>
            </div>

            {/* Civic Transport Imagery Context */}
            <div className="relative rounded-xl overflow-hidden shadow-md h-36 bg-[#e9edff] border border-slate-200">
              <img
                className="w-full h-full object-cover"
                data-alt="Modern Singapore double decker red and green SBS Transit bus waiting at modern sheltered bus stop on Orchard Road with commuters boarding in daylight, high realism, crisp urban Singapore lighting."
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCJGdWZjXDXNH5AqRtI3ek7OOH9-UVpuL4Ua5hOdzo9QWQ4MkIxY-Mo8fOC91ysbfb1JB-bpi6gFVZ2Vp0THpwSzd0X99ruvd4ZBEZtOvxjgu527xvWmII28i3yLuZWkPfe5pmGz48FPef4XJydv3pNWsEZKisMVcyefdrOeWp2UulcQHBnJHMciqbMeHpMDBaLbO7vS7tFJZi7KAZ9-HxqomdmCiPFK7B8df-SZpmrUkqpLE_TR5zdfw"
                alt="Singapore SBS Transit Bus on Orchard Corridor"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#293040]/90 via-transparent to-transparent flex items-end p-4">
                <div className="text-[#edf0ff]">
                  <p className="font-label-md text-xs font-bold">LTA Commuter Velocity Project</p>
                  <p className="font-body-sm text-[11px] opacity-90">Telemetry synced with 5,800+ buses nationwide</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
