import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-[#f1f3ff] mt-10 shadow-[0_-1px_6px_rgba(0,0,0,0.03)] border-t border-[#dce2f7]">
      <div className="w-full px-4 sm:px-6 lg:px-10 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-1.5">
              <span className="font-title-md text-base text-[#9e001f] tracking-tight font-bold">
                SG TRANSIT LIVE
              </span>
            </div>
            <p className="font-body-sm text-xs text-[#5c403f] leading-relaxed">
              Authoritative, low-latency live bus telemetry and service arrival intelligence platform for commuters across Singapore.
            </p>
          </div>

          {/* Transit Helplines */}
          <div className="flex flex-col gap-1.5 text-xs">
            <span className="font-label-lg font-bold text-[#141b2b]">Transit Helplines</span>
            <span className="text-[#5c403f]">
              SBS Transit Hotline: <span className="text-[#9e001f] font-semibold">1800-287-2727</span>
            </span>
            <span className="text-[#5c403f]">
              SMRT Feedback: <span className="text-[#141b2b] font-semibold">1800-336-8900</span>
            </span>
            <span className="text-[#5c403f]">
              LTA Public Transport: <span className="text-[#141b2b] font-semibold">1800-225-5582</span>
            </span>
          </div>

          {/* Official Attributions */}
          <div className="flex flex-col gap-1.5 text-xs">
            <span className="font-label-lg font-bold text-[#141b2b]">Official Attributions</span>
            <p className="text-[#5c403f] leading-relaxed">
              Contains real-time public sector data governed by the Land Transport Authority (LTA) Open Data Licence and DataMall Dynamic APIs.
            </p>
          </div>

          {/* System Metadata */}
          <div className="flex flex-col gap-1.5 text-xs">
            <span className="font-label-lg font-bold text-[#141b2b]">System Metadata</span>
            <span className="text-[#5c403f]">
              Feed Latency: <span className="text-[#16A34A] font-semibold">1.2s (Realtime)</span>
            </span>
            <span className="text-[#5c403f]">
              Sync Time: <span className="text-[#141b2b] font-medium">Today, 14:32:08 SGT</span>
            </span>
            <span className="text-[#5c403f]">
              Version: <span className="text-[#141b2b] font-medium font-mono">v4.8.2-civic</span>
            </span>
          </div>
        </div>

        {/* Bottom copyright & legal */}
        <div className="mt-8 pt-4 border-t border-[#dce2f7] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#5c403f]">
          <p>© 2024 SG Transit Live. Designed for civic commuter velocity across Singapore.</p>
          <div className="flex items-center gap-6 flex-wrap">
            <a href="#terms" className="hover:text-[#141b2b] transition-colors">
              Terms of Service
            </a>
            <a href="#privacy" className="hover:text-[#141b2b] transition-colors">
              Privacy Safeguards
            </a>
            <a href="#licensing" className="hover:text-[#141b2b] transition-colors">
              LTA Data Licensing
            </a>
            <a href="#accessibility" className="hover:text-[#141b2b] transition-colors">
              Accessibility
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
