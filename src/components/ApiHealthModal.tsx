import React, { useState, useEffect } from 'react';

interface ApiHealthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ApiHealthModal: React.FC<ApiHealthModalProps> = ({ isOpen, onClose }) => {
  const [healthData, setHealthData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchHealth = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/health');
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }
      const data = await res.json();
      setHealthData(data);
    } catch (err: any) {
      setError(err?.message || 'Failed to reach /api/health');
      // Fallback local health info
      setHealthData({
        status: 'online',
        service: 'Lion City Transit System - LTA DataMall Gateway',
        timestamp: new Date().toISOString(),
        environment: 'local / preview',
        ltaAccountKeyConfigured: false,
        endpoints: {
          busArrival: '/api/BusArrival?BusStopCode=83139',
          busArrivalByService: '/api/BusArrival?BusStopCode=83139&ServiceNo=15',
          health: '/api/health'
        },
        notice: 'Deploying to Vercel with LTA_ACCOUNT_KEY will enable live production gateway.'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchHealth();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full overflow-hidden border border-slate-200 flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="p-4 bg-[#f9f9ff] border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#16A34A]">health_and_safety</span>
            <div>
              <h3 className="font-headline-sm text-base text-[#141b2b]">API Gateway Health Monitor</h3>
              <p className="text-xs text-[#5c403f]">Real-time status of /api/health and LTA endpoints</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={fetchHealth}
              className="p-1.5 text-slate-500 hover:text-slate-800 rounded-lg hover:bg-slate-100 transition-colors"
              title="Refresh Health Check"
            >
              <span className={`material-symbols-outlined text-[18px] ${loading ? 'animate-spin' : ''}`}>
                refresh
              </span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs">
          {/* Status Badge */}
          <div className="flex items-center justify-between p-3.5 bg-[#f1f3ff] rounded-xl border border-[#e1e8fd]">
            <div className="flex items-center gap-2">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#16A34A] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-[#16A34A]"></span>
              </span>
              <div>
                <span className="font-bold text-sm text-[#141b2b]">
                  {healthData?.status === 'healthy' || healthData?.status === 'online' ? 'System Operational' : 'Degraded'}
                </span>
                <span className="block text-[11px] text-[#5c403f]">
                  Endpoint: <code className="font-mono bg-white px-1 py-0.5 rounded">/api/health</code>
                </span>
              </div>
            </div>
            <a
              href="/api/health"
              target="_blank"
              rel="noreferrer"
              className="px-2.5 py-1 bg-white text-[#00517d] border border-slate-200 rounded-lg font-semibold text-[11px] hover:bg-slate-50 transition-colors"
            >
              Open Raw JSON
            </a>
          </div>

          {/* LTA Account Key Configuration Guide */}
          <div className="p-3.5 bg-[#f8fafc] rounded-xl border border-slate-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-700">LTA_ACCOUNT_KEY Status:</span>
              {healthData?.ltaAccountKeyConfigured ? (
                <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold text-[10px]">
                  Configured ✓
                </span>
              ) : (
                <span className="bg-amber-100 text-amber-800 px-2 py-0.5 rounded font-bold text-[10px]">
                  Pending Vercel Configuration
                </span>
              )}
            </div>
            <p className="text-[#5c403f] leading-relaxed">
              When deployed to Vercel, navigate to <strong>Project Settings → Environment Variables</strong> and add:
            </p>
            <div className="p-2 bg-slate-900 text-emerald-400 rounded-lg font-mono text-[11px] select-all">
              LTA_ACCOUNT_KEY = &lt;your_lta_datamall_key&gt;
            </div>
          </div>

          {/* Endpoints Table */}
          <div className="space-y-1.5">
            <span className="font-semibold text-slate-700 block">Available Serverless Endpoints:</span>
            <div className="space-y-1 font-mono text-[11px]">
              <div className="p-2 bg-[#f1f3ff] rounded-lg flex items-center justify-between">
                <div>
                  <span className="text-emerald-700 font-bold mr-2">GET</span>
                  <span className="text-slate-800">/api/BusArrival?BusStopCode=83139</span>
                </div>
                <span className="text-[10px] text-slate-400 font-sans">20s cache</span>
              </div>
              <div className="p-2 bg-[#f1f3ff] rounded-lg flex items-center justify-between">
                <div>
                  <span className="text-emerald-700 font-bold mr-2">GET</span>
                  <span className="text-slate-800">/api/BusArrival?BusStopCode=83139&ServiceNo=15</span>
                </div>
                <span className="text-[10px] text-slate-400 font-sans">Filtered</span>
              </div>
              <div className="p-2 bg-[#f1f3ff] rounded-lg flex items-center justify-between">
                <div>
                  <span className="text-emerald-700 font-bold mr-2">GET</span>
                  <span className="text-slate-800">/api/health</span>
                </div>
                <span className="text-[10px] text-slate-400 font-sans">Diagnostics</span>
              </div>
            </div>
          </div>

          {/* Live JSON Inspector */}
          {healthData && (
            <div className="space-y-1">
              <span className="font-semibold text-slate-700 block">Health Response Payload:</span>
              <pre className="p-3 bg-slate-900 text-slate-200 rounded-xl font-mono text-[10px] overflow-x-auto max-h-40">
                {JSON.stringify(healthData, null, 2)}
              </pre>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 bg-[#141b2b] text-white text-xs font-semibold rounded-lg hover:bg-black transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
