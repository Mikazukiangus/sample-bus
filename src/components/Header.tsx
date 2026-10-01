import React from 'react';

export type ActiveScreen = 'live-bus-arrival' | 'route-explorer' | 'nearby-stops' | 'service-disruptions';
export type AppLanguage = 'EN' | '中文' | 'Melayu' | 'தமிழ்';

interface HeaderProps {
  activeScreen: ActiveScreen;
  onSelectScreen: (screen: ActiveScreen) => void;
  language: AppLanguage;
  onChangeLanguage: (lang: AppLanguage) => void;
  unreadCount: number;
  onOpenNotifications: () => void;
  onOpenProfile: () => void;
  onOpenHealthModal?: () => void;
  currentStopName: string;
}

export const Header: React.FC<HeaderProps> = ({
  activeScreen,
  onSelectScreen,
  language,
  onChangeLanguage,
  unreadCount,
  onOpenNotifications,
  onOpenProfile,
  onOpenHealthModal,
  currentStopName,
}) => {
  return (
    <header className="fixed top-0 w-full z-50 bg-[#ffffff]/95 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
      <div className="h-20 w-full px-4 sm:px-6 lg:px-10 flex items-center justify-between gap-4">
        {/* Brand Lockup */}
        <div 
          className="flex items-center gap-3 shrink-0 cursor-pointer" 
          onClick={() => onSelectScreen('live-bus-arrival')}
          role="button"
          tabIndex={0}
        >
          <img
            alt="SG Transit Live Logo"
            className="h-8 w-auto object-contain"
            src="https://lh3.googleusercontent.com/aida/AEtjO1XKkT90chpYrqIcEJYYU--JyRK5Smqo0bRVNahKWq5CZi9OBrnLWlagQLTJ5tX8sRxHx0qVv7XlU_zruCiOG6SgmTodGwb1NRauj9MSXj7ujM0HT8g5OX0E4qwd1NIMedKlR6p3h7cewUOcUAg3F-ALkSkJDwDrpfRkKktxx-TngCQSUxwEmES725OryBd3qTkiuwhXHCUlH04P3OMTsuyty7jHmvlglyW5admXn1by9Z8tB4SAyfbp-7W1"
          />
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-title-lg text-[#9e001f] tracking-tight font-bold">SG TRANSIT</span>
              <span className="bg-[#c8102e] text-white font-label-sm px-1.5 py-0.5 rounded text-[11px] font-bold">LIVE</span>
            </div>
            <span className="font-label-sm text-[#5c403f] text-[11px]">Smart Bus Telemetry • LTA Connected</span>
          </div>
        </div>

        {/* Desktop Screen Navigation */}
        <nav className="hidden xl:flex items-center gap-1 shrink-0">
          <button
            type="button"
            onClick={() => onSelectScreen('live-bus-arrival')}
            className={`px-3.5 py-2 transition-colors rounded-lg font-label-lg text-sm ${
              activeScreen === 'live-bus-arrival'
                ? 'bg-[#c8102e] text-white font-semibold shadow-sm'
                : 'text-[#5c403f] hover:bg-[#e1e8fd] hover:text-[#141b2b]'
            }`}
          >
            {language === '中文' ? '实时公交到达' : language === 'Melayu' ? 'Ketibaan Bas' : language === 'தமிழ்' ? 'பேருந்து வருகை' : 'Live Bus Arrival'}
          </button>
          <button
            type="button"
            onClick={() => onSelectScreen('route-explorer')}
            className={`px-3.5 py-2 transition-colors rounded-lg font-label-lg text-sm ${
              activeScreen === 'route-explorer'
                ? 'bg-[#c8102e] text-white font-semibold shadow-sm'
                : 'text-[#5c403f] hover:bg-[#e1e8fd] hover:text-[#141b2b]'
            }`}
          >
            {language === '中文' ? '路线探险' : language === 'Melayu' ? 'Peneroka Laluan' : language === 'தமிழ்' ? 'வழி ஆய்வு' : 'Route Explorer'}
          </button>
          <button
            type="button"
            onClick={() => onSelectScreen('nearby-stops')}
            className={`px-3.5 py-2 transition-colors rounded-lg font-label-lg text-sm ${
              activeScreen === 'nearby-stops'
                ? 'bg-[#c8102e] text-white font-semibold shadow-sm'
                : 'text-[#5c403f] hover:bg-[#e1e8fd] hover:text-[#141b2b]'
            }`}
          >
            {language === '中文' ? '附近站点' : language === 'Melayu' ? 'Hentian Berdekatan' : language === 'தமிழ்' ? 'அருகிலுள்ள நிறுத்தங்கள்' : 'Nearby Stops'}
          </button>
          <button
            type="button"
            onClick={() => onSelectScreen('service-disruptions')}
            className={`px-3.5 py-2 transition-colors rounded-lg font-label-lg text-sm ${
              activeScreen === 'service-disruptions'
                ? 'bg-[#c8102e] text-white font-semibold shadow-sm'
                : 'text-[#5c403f] hover:bg-[#e1e8fd] hover:text-[#141b2b]'
            }`}
          >
            {language === '中文' ? '服务中断与通告' : language === 'Melayu' ? 'Gangguan Perkhidmatan' : language === 'தமிழ்' ? 'சேவை அறிவிப்புகள்' : 'Service Disruptions'}
          </button>
        </nav>

        {/* Right Action Tray: GPS, Language, Notifications, Commuter Profile */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Current GPS Sector Pill */}
          <div className="hidden lg:flex items-center gap-1.5 bg-[#f1f3ff] px-3 py-1 rounded-full shadow-[0_1px_4px_rgba(0,0,0,0.02)] border border-[#e1e8fd]">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#16A34A] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#16A34A]"></span>
            </span>
            <span className="font-label-sm text-[11px] text-[#5c403f]">Current:</span>
            <span className="font-label-sm text-[11px] text-[#141b2b] font-medium truncate max-w-[170px]">
              {currentStopName} (GPS Active)
            </span>
          </div>

          {/* Multilingual Selector */}
          <div className="flex items-center gap-0.5 bg-[#F1F5F9] p-0.5 rounded-lg border border-slate-200">
            {(['EN', '中文', 'Melayu', 'தமிழ்'] as AppLanguage[]).map((lang) => (
              <button
                key={lang}
                type="button"
                onClick={() => onChangeLanguage(lang)}
                className={`px-1.5 py-0.5 font-label-sm text-[11px] rounded transition-all ${
                  language === lang
                    ? 'bg-white text-[#141b2b] shadow-sm font-bold'
                    : 'text-[#5c403f] hover:text-[#141b2b]'
                }`}
              >
                {lang}
              </button>
            ))}
          </div>

          {/* Notifications Trigger */}
          <button
            type="button"
            onClick={onOpenNotifications}
            className="relative p-2 text-[#5c403f] hover:text-[#141b2b] hover:bg-[#f1f3ff] rounded-full transition-colors"
            title="LTA & Commuter Notifications"
          >
            <span className="material-symbols-outlined text-[22px]">notifications</span>
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 inline-flex items-center justify-center w-4 h-4 text-[10px] font-bold text-white bg-[#c8102e] rounded-full">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Commuter Profile Avatar */}
          <button
            type="button"
            onClick={onOpenProfile}
            className="relative rounded-full ring-2 ring-transparent hover:ring-[#c8102e] transition-all focus:outline-none"
            title="SimplyGo Commuter Profile & Card Balance"
          >
            <img
              alt="Commuter Profile"
              className="w-8 h-8 rounded-full object-cover shrink-0 border border-slate-200"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCw2zGIAciSPqyYxZbi6crrGlVWkE7-O2OpVRVKZ9ypgaiuyN1qoqDUPRIXmrj-JY_7jhwORm8_RwMt88iY8-_xMgzE9WBzIS9Zn8PmqyjiukpaJ7XwklvLzrJ3xuET1CUkc1Tt-KqQpdirXuM1PaVdltiyGmMbHVYnJV-nZdyVGtx4wZSOIWMkUrXOOUHZzJ3fWF--xZnJ2YoCVan7OXvEIbDhm7gnnyylaOghKwo3gYJbiYsn2oJ6xw"
            />
          </button>
        </div>
      </div>

      {/* Sub-Header Operational Strip */}
      <div className="bg-[#e1e8fd] px-4 sm:px-6 lg:px-10 py-1.5 flex items-center justify-between border-t border-[#dce2f7] text-xs">
        <div className="flex items-center gap-2 overflow-hidden">
          <span className="bg-[#9e001f] font-label-sm text-[10px] text-white uppercase px-1.5 py-0.5 rounded shrink-0 font-bold">
            Transit Notice
          </span>
          <p className="font-body-sm text-xs text-[#5c403f] truncate">
            All SBS Transit and SMRT trunk & feeder routes operational • LTA real-time feed synced
          </p>
        </div>
        <div className="hidden md:flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={onOpenHealthModal}
            className="flex items-center gap-1.5 text-[#16A34A] hover:text-emerald-700 font-medium text-xs bg-white/70 hover:bg-white px-2 py-0.5 rounded-md border border-[#dce2f7] transition-colors"
            title="Inspect /api/health endpoint status"
          >
            <span className="material-symbols-outlined text-[16px]">sensors</span>
            <span className="font-label-sm text-xs text-[#141b2b] font-semibold">DataMall 5.0 Feed</span>
            <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1 py-0.2 rounded font-mono font-bold">
              /api/health
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Screen Tab Bar */}
      <div className="xl:hidden flex items-center justify-around border-t border-slate-200 bg-white px-2 py-1.5 overflow-x-auto">
        <button
          type="button"
          onClick={() => onSelectScreen('live-bus-arrival')}
          className={`px-2.5 py-1 text-xs rounded-md whitespace-nowrap font-medium ${
            activeScreen === 'live-bus-arrival' ? 'bg-[#c8102e] text-white' : 'text-[#5c403f]'
          }`}
        >
          Arrivals
        </button>
        <button
          type="button"
          onClick={() => onSelectScreen('route-explorer')}
          className={`px-2.5 py-1 text-xs rounded-md whitespace-nowrap font-medium ${
            activeScreen === 'route-explorer' ? 'bg-[#c8102e] text-white' : 'text-[#5c403f]'
          }`}
        >
          Routes
        </button>
        <button
          type="button"
          onClick={() => onSelectScreen('nearby-stops')}
          className={`px-2.5 py-1 text-xs rounded-md whitespace-nowrap font-medium ${
            activeScreen === 'nearby-stops' ? 'bg-[#c8102e] text-white' : 'text-[#5c403f]'
          }`}
        >
          Nearby
        </button>
        <button
          type="button"
          onClick={() => onSelectScreen('service-disruptions')}
          className={`px-2.5 py-1 text-xs rounded-md whitespace-nowrap font-medium ${
            activeScreen === 'service-disruptions' ? 'bg-[#c8102e] text-white' : 'text-[#5c403f]'
          }`}
        >
          Disruptions
        </button>
      </div>
    </header>
  );
};
