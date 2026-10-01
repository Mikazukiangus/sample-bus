import React, { useState } from 'react';

interface ExpandedMapModalProps {
  isOpen: boolean;
  onClose: () => void;
  stopName: string;
  stopCode: string;
}

export const ExpandedMapModal: React.FC<ExpandedMapModalProps> = ({
  isOpen,
  onClose,
  stopName,
  stopCode,
}) => {
  const [showShelteredLayer, setShowShelteredLayer] = useState(true);
  const [showMrtLayer, setShowMrtLayer] = useState(true);
  const [zoomLevel, setZoomLevel] = useState(1);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full overflow-hidden border border-slate-200 flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-[#f9f9ff]">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#9e001f]">map</span>
            <div>
              <h3 className="font-headline-sm text-base text-[#141b2b]">
                Dhoby Ghaut Commuter Corridor Schematics
              </h3>
              <p className="text-xs text-[#5c403f]">
                Underground linkways, bus stop totems & MRT exit connectors
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setZoomLevel((prev) => Math.min(prev + 0.2, 1.8))}
              className="p-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg text-xs"
              title="Zoom In"
            >
              <span className="material-symbols-outlined text-[18px]">zoom_in</span>
            </button>
            <button
              type="button"
              onClick={() => setZoomLevel((prev) => Math.max(prev - 0.2, 0.8))}
              className="p-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg text-xs"
              title="Zoom Out"
            >
              <span className="material-symbols-outlined text-[18px]">zoom_out</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors ml-2"
            >
              <span className="material-symbols-outlined text-[22px]">close</span>
            </button>
          </div>
        </div>

        {/* Layer Controls Bar */}
        <div className="px-4 py-2 bg-slate-50 border-b border-slate-100 flex items-center gap-4 text-xs flex-wrap">
          <span className="font-semibold text-slate-600">Active Layers:</span>
          <label className="flex items-center gap-1.5 cursor-pointer">
            <input
              type="checkbox"
              checked={showShelteredLayer}
              onChange={(e) => setShowShelteredLayer(e.target.checked)}
              className="accent-[#16A34A] rounded"
            />
            <span className="text-[#16A34A] font-medium">Covered / Sheltered Linkways</span>
          </label>
          <label className="flex items-center gap-1.5 cursor-pointer">
            <input
              type="checkbox"
              checked={showMrtLayer}
              onChange={(e) => setShowMrtLayer(e.target.checked)}
              className="accent-[#00517d] rounded"
            />
            <span className="text-[#00517d] font-medium">MRT Station Exits (A, B, C, D)</span>
          </label>
          <div className="ml-auto text-slate-500 font-mono text-[11px]">
            Target Stop: <span className="font-bold text-slate-800">{stopCode} ({stopName})</span>
          </div>
        </div>

        {/* Map Canvas */}
        <div className="relative flex-1 bg-[#f1f3ff] overflow-auto min-h-[420px] flex items-center justify-center p-6">
          <div
            style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'center center' }}
            className="transition-transform duration-200 ease-out"
          >
            <svg
              className="w-[720px] h-[400px] rounded-xl bg-white shadow-md border border-slate-200"
              viewBox="0 0 720 400"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Grids and city blocks */}
              <rect x="30" y="30" width="220" height="120" rx="12" fill="#E1E8FD" opacity="0.7" />
              <text x="50" y="70" fill="#5C403F" fontFamily="Inter" fontSize="14" fontWeight="700">Plaza Singapura</text>
              <text x="50" y="90" fill="#906F6E" fontFamily="Inter" fontSize="12">Atrium Mall & Cinema Complex</text>
              <text x="50" y="110" fill="#16A34A" fontFamily="Inter" fontSize="11" fontWeight="600">Direct Basement MRT Link</text>

              <rect x="420" y="25" width="260" height="130" rx="12" fill="#E1E8FD" opacity="0.7" />
              <text x="440" y="65" fill="#5C403F" fontFamily="Inter" fontSize="14" fontWeight="700">MacDonald House</text>
              <text x="440" y="85" fill="#906F6E" fontFamily="Inter" fontSize="12">Historic National Monument</text>
              <text x="440" y="105" fill="#00517D" fontFamily="Inter" fontSize="11" fontWeight="600">Near Orchard Greenway</text>

              <rect x="30" y="240" width="240" height="120" rx="12" fill="#E1E8FD" opacity="0.7" />
              <text x="50" y="280" fill="#5C403F" fontFamily="Inter" fontSize="14" fontWeight="700">The Cathay</text>
              <text x="50" y="300" fill="#906F6E" fontFamily="Inter" fontSize="12">Handy Road Sector / Mount Sophia</text>
              <text x="50" y="320" fill="#8D3F92" fontFamily="Inter" fontSize="11" fontWeight="600">Bus 64 / 65 connection</text>

              <rect x="420" y="240" width="260" height="120" rx="12" fill="#E1E8FD" opacity="0.7" />
              <text x="440" y="280" fill="#5C403F" fontFamily="Inter" fontSize="14" fontWeight="700">SOTA Building</text>
              <text x="440" y="300" fill="#906F6E" fontFamily="Inter" fontSize="12">School of the Arts Singapore</text>
              <text x="440" y="320" fill="#5C403F" fontFamily="Inter" fontSize="11">Prinsep St Arts Corridor</text>

              {/* Major Thoroughfares */}
              <path d="M 0 190 L 720 190" stroke="#D3DAEF" strokeWidth="48" strokeLinecap="round" />
              <text x="260" y="196" fill="#712578" fontFamily="Inter" fontSize="14" fontWeight="800" letterSpacing="3">
                ORCHARD ROAD
              </text>
              <path d="M 340 0 L 340 400" stroke="#D3DAEF" strokeWidth="36" />
              <text x="350" y="380" fill="#5C403F" fontFamily="Inter" fontSize="11" fontWeight="600">HANDY RD</text>

              {/* Sheltered Walkways Layer */}
              {showShelteredLayer && (
                <g>
                  <path
                    d="M 120 145 Q 160 190 350 190"
                    stroke="#16A34A"
                    strokeWidth="6"
                    strokeDasharray="6 4"
                    opacity="0.85"
                  />
                  <rect x="180" y="150" width="130" height="22" rx="4" fill="#DCFCE7" stroke="#16A34A" strokeWidth="1" />
                  <text x="188" y="165" fill="#166534" fontFamily="Inter" fontSize="10" fontWeight="700">
                    ☂ Sheltered Underpass
                  </text>
                </g>
              )}

              {/* MRT Interchanges & Exits */}
              {showMrtLayer && (
                <g>
                  {/* Exit B */}
                  <circle cx="120" cy="140" r="14" fill="#00517D" />
                  <text x="115" y="145" fill="#FFFFFF" fontFamily="Inter" fontSize="14" fontWeight="800">B</text>
                  <text x="75" y="170" fill="#00517D" fontFamily="Inter" fontSize="11" fontWeight="700">MRT Exit B</text>

                  {/* Exit A */}
                  <circle cx="360" cy="310" r="12" fill="#00517D" />
                  <text x="356" y="314" fill="#FFFFFF" fontFamily="Inter" fontSize="12" fontWeight="800">A</text>
                  <text x="380" y="314" fill="#00517D" fontFamily="Inter" fontSize="10" fontWeight="600">Exit A (Handy)</text>

                  {/* Exit D */}
                  <circle cx="210" cy="50" r="12" fill="#00517D" />
                  <text x="206" y="54" fill="#FFFFFF" fontFamily="Inter" fontSize="12" fontWeight="800">D</text>
                  <text x="230" y="54" fill="#00517D" fontFamily="Inter" fontSize="10" fontWeight="600">Exit D (Plaza Sing)</text>
                </g>
              )}

              {/* Current Commuter GPS Pulse */}
              <g transform="translate(120, 140)">
                <circle cx="0" cy="0" r="24" fill="#0284C7" opacity="0.3">
                  <animate attributeName="r" values="10;32;10" dur="2.4s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.4;0.05;0.4" dur="2.4s" repeatCount="indefinite" />
                </circle>
                <circle cx="0" cy="0" r="7" fill="#0284C7" />
                <circle cx="0" cy="0" r="3" fill="#FFFFFF" />
              </g>

              {/* Walking Route Path */}
              <path
                d="M 120 140 Q 150 190 350 190"
                stroke="#C8102E"
                strokeWidth="4"
                strokeDasharray="6 6"
              />

              {/* Target Bus Stop Pin (Stop 08031) */}
              <g transform="translate(350, 190)">
                <circle cx="0" cy="0" r="16" fill="#C8102E" />
                <circle cx="0" cy="0" r="7" fill="#FFFFFF" />
              </g>

              {/* Stop Callout Card */}
              <rect x="380" y="165" width="210" height="50" rx="8" fill="#141B2B" filter="drop-shadow(0 4px 8px rgba(0,0,0,0.2))" />
              <text x="395" y="186" fill="#FFFFFF" fontFamily="Inter" fontSize="12" fontWeight="700">
                Bus Stop {stopCode}
              </text>
              <text x="395" y="202" fill="#16A34A" fontFamily="Inter" fontSize="11" fontWeight="600">
                {stopName} • 120m (~2 min)
              </text>
            </svg>
          </div>
        </div>

        {/* Footer Summary */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#16A34A] text-[18px]">verified</span>
            <span>All subterranean passages feature step-free ramps, tactile guidance, and elevator connectivity.</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-[#c8102e] text-white rounded-lg font-medium hover:bg-[#9e001f] transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};
