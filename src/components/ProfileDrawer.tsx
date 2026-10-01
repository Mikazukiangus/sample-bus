import React from 'react';

interface ProfileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProfileDrawer: React.FC<ProfileDrawerProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/40 backdrop-blur-xs">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-4 bg-[#f9f9ff] border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#c8102e]">account_circle</span>
              <h3 className="font-headline-sm text-base text-[#141b2b]">SimplyGo Commuter Profile</h3>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-1 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>

          <div className="p-5 flex-1 overflow-y-auto space-y-5">
            {/* User Identity Banner */}
            <div className="flex items-center gap-4 bg-[#f1f3ff] p-4 rounded-2xl border border-[#e1e8fd]">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCw2zGIAciSPqyYxZbi6crrGlVWkE7-O2OpVRVKZ9ypgaiuyN1qoqDUPRIXmrj-JY_7jhwORm8_RwMt88iY8-_xMgzE9WBzIS9Zn8PmqyjiukpaJ7XwklvLzrJ3xuET1CUkc1Tt-KqQpdirXuM1PaVdltiyGmMbHVYnJV-nZdyVGtx4wZSOIWMkUrXOOUHZzJ3fWF--xZnJ2YoCVan7OXvEIbDhm7gnnyylaOghKwo3gYJbiYsn2oJ6xw"
                alt="Tan Wei Lin"
                className="w-16 h-16 rounded-full object-cover shadow-sm ring-2 ring-white"
              />
              <div className="space-y-0.5">
                <div className="flex items-center gap-1.5">
                  <h4 className="font-title-lg text-base font-bold text-[#141b2b]">Tan Wei Lin</h4>
                  <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-1.5 py-0.5 rounded">
                    Verified
                  </span>
                </div>
                <p className="text-xs text-[#5c403f]">Adult Standard • SimplyGo Contactless</p>
                <p className="text-[11px] text-slate-500 font-mono">CAN: 1000 8920 4412 9011</p>
              </div>
            </div>

            {/* SimplyGo Virtual Card Card */}
            <div className="bg-gradient-to-br from-[#9e001f] to-[#c8102e] rounded-2xl p-5 text-white shadow-lg relative overflow-hidden">
              <div className="absolute top-0 right-0 w-36 h-36 bg-white/10 rounded-full blur-xl pointer-events-none"></div>
              <div className="flex items-center justify-between text-xs opacity-90 mb-4">
                <span className="tracking-wider uppercase font-semibold">SimplyGo EZ-Link Digital</span>
                <span className="bg-white/20 px-2 py-0.5 rounded text-[11px] font-mono">Auto-Topup $20 Active</span>
              </div>
              <div className="space-y-1 mb-4">
                <span className="text-xs opacity-80">Available Travel Balance</span>
                <div className="font-display-lg text-3xl font-extrabold tracking-tight">$24.80</div>
              </div>
              <div className="flex items-center justify-between text-xs pt-2 border-t border-white/20">
                <span className="font-mono">•••• 9011</span>
                <span className="text-emerald-300 font-medium flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                  NFC Express Ready
                </span>
              </div>
            </div>

            {/* Recent Transit History */}
            <div className="space-y-2">
              <h5 className="font-title-md text-xs font-bold text-[#141b2b] uppercase tracking-wider">
                Recent Commuter Trips
              </h5>
              <div className="space-y-2">
                <div className="p-3 bg-[#f8fafc] rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                  <div>
                    <div className="flex items-center gap-1.5 font-semibold text-[#141b2b]">
                      <span className="bg-[#9e001f] text-white px-1.5 py-0.5 rounded font-mono text-[10px]">65</span>
                      <span>Dhoby Ghaut Stn → Orchard Blvd</span>
                    </div>
                    <span className="text-[11px] text-slate-400">Today, 13:14 • Bus (2.1 km)</span>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-[#141b2b]">$1.09</span>
                    <span className="block text-[10px] text-emerald-600 font-medium">Rebate -$0.50</span>
                  </div>
                </div>

                <div className="p-3 bg-[#f8fafc] rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                  <div>
                    <div className="flex items-center gap-1.5 font-semibold text-[#141b2b]">
                      <span className="bg-[#00517d] text-white px-1.5 py-0.5 rounded font-mono text-[10px]">MRT</span>
                      <span>Raffles Place → Dhoby Ghaut</span>
                    </div>
                    <span className="text-[11px] text-slate-400">Today, 12:45 • North South Line</span>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-[#141b2b]">$1.29</span>
                    <span className="block text-[10px] text-slate-400">Full Fare</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Preferences */}
            <div className="p-4 bg-[#f1f3ff] rounded-2xl border border-[#e1e8fd] space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-700 font-medium">Fare Concession Scheme</span>
                <span className="font-bold text-[#141b2b]">Standard Adult</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-700 font-medium">Auto-Reload Threshold</span>
                <span className="font-bold text-[#141b2b]">Below $5.00</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-700 font-medium">LTA Travel Smart Rewards</span>
                <span className="font-bold text-emerald-600">840 pts earned</span>
              </div>
            </div>
          </div>

          <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs">
            <button
              type="button"
              className="text-[#9e001f] font-semibold hover:underline"
            >
              Export Statement (PDF)
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-[#141b2b] text-white rounded-lg font-medium hover:bg-black transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
