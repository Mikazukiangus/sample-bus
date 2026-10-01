import React, { useState } from 'react';
import { NETWORK_DISRUPTIONS } from '../data/transitData';

export const ServiceDisruptionsScreen: React.FC = () => {
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const [feedbackCategory, setFeedbackCategory] = useState('bus_bunching');
  const [feedbackService, setFeedbackService] = useState('65');
  const [feedbackNote, setFeedbackNote] = useState('');

  const mrtLines = [
    { code: 'NSL', name: 'North-South Line', color: '#DC2626', status: 'Normal Service', headway: '2 - 3 mins' },
    { code: 'EWL', name: 'East-West Line', color: '#16A34A', status: 'Normal Service', headway: '2 - 3 mins' },
    { code: 'NEL', name: 'North East Line', color: '#8D3F92', status: 'Normal Service', headway: '3 - 4 mins' },
    { code: 'CCL', name: 'Circle Line', color: '#EA580C', status: 'Normal Service', headway: '3 - 5 mins' },
    { code: 'DTL', name: 'Downtown Line', color: '#0284C7', status: 'Normal Service', headway: '2.5 - 3.5 mins' },
    { code: 'TEL', name: 'Thomson-East Coast Line', color: '#92400E', status: 'Normal Service', headway: '4 - 5 mins' },
  ];

  const handleFeedbackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFeedbackSubmitted(true);
    setTimeout(() => {
      setFeedbackSubmitted(false);
      setFeedbackNote('');
    }, 4000);
  };

  return (
    <div className="px-4 sm:px-6 lg:px-10 py-5 space-y-6">
      {/* Header Banner */}
      <section className="bg-white rounded-2xl shadow-md p-6 border border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#16A34A] text-[28px]">
              check_circle
            </span>
            <h2 className="font-headline-md text-xl text-[#141b2b] font-bold">
              Singapore Transit Network Status: Operational
            </h2>
          </div>
          <p className="text-xs text-[#5c403f] mt-1">
            Real-time feed synchronized with LTA Operations Control Centre (OCC) • 99.8% On-Time Reliability
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            All Heavy Rail & Bus Trunks Nominal
          </span>
        </div>
      </section>

      {/* MRT Lines Headway Status Grid */}
      <section className="bg-white rounded-2xl shadow-md p-6 border border-slate-100 space-y-4">
        <h3 className="font-title-lg text-base text-[#141b2b] font-bold flex items-center gap-2">
          <span className="material-symbols-outlined text-[#00517d]">subway</span>
          MRT Rapid Transit Lines Status
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {mrtLines.map((line) => (
            <div
              key={line.code}
              className="p-3.5 rounded-xl bg-[#f8fafc] border border-slate-200 flex items-center justify-between"
            >
              <div className="flex items-center gap-2.5">
                <span
                  className="font-mono text-xs font-extrabold text-white px-2 py-1 rounded shadow-xs"
                  style={{ backgroundColor: line.color }}
                >
                  {line.code}
                </span>
                <div>
                  <span className="font-bold text-xs text-[#141b2b] block">{line.name}</span>
                  <span className="text-[11px] text-slate-500 font-mono">Headway: {line.headway}</span>
                </div>
              </div>

              <span className="text-[11px] font-bold text-[#16A34A] bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                {line.status}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Active Service Advisories & Maintenance Notices */}
      <section className="bg-white rounded-2xl shadow-md p-6 border border-slate-100 space-y-4">
        <h3 className="font-title-lg text-base text-[#141b2b] font-bold flex items-center gap-2">
          <span className="material-symbols-outlined text-[#c8102e]">warning</span>
          Operational Bulletins & Planned Maintenance
        </h3>

        <div className="space-y-3">
          {NETWORK_DISRUPTIONS.map((item) => (
            <div
              key={item.id}
              className="p-4 rounded-xl border border-slate-200 bg-[#f9f9ff] space-y-2"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-xs px-2 py-0.5 rounded bg-[#9e001f] text-white">
                    {item.lineOrService}
                  </span>
                  <h4 className="font-title-md text-sm font-bold text-[#141b2b]">{item.title}</h4>
                </div>
                <span className="text-xs text-slate-400 font-mono">{item.timestamp}</span>
              </div>

              <p className="text-xs text-[#5c403f] leading-relaxed">{item.description}</p>

              <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-t border-slate-100 text-xs">
                <span className="text-slate-600">
                  <strong>Advice for commuters:</strong> {item.alternativeTransport}
                </span>
                <span className="text-[11px] font-semibold text-[#00517d] bg-[#00517d]/10 px-2 py-0.5 rounded self-start sm:self-auto">
                  Status: {item.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Operator Helplines & Commuter Crowdsource Feedback */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Helplines Directory */}
        <section className="bg-white rounded-2xl shadow-md p-6 border border-slate-100 space-y-3">
          <h3 className="font-title-lg text-base text-[#141b2b] font-bold flex items-center gap-2">
            <span className="material-symbols-outlined text-[#9e001f]">call</span>
            Transit Helplines Directory
          </h3>

          <div className="space-y-2 text-xs">
            <div className="p-3 bg-[#f8fafc] rounded-xl flex items-center justify-between border border-slate-200">
              <div>
                <span className="font-bold text-[#141b2b] block">SBS Transit Customer Centre</span>
                <span className="text-slate-500">Bus & NEL / DTL inquiries</span>
              </div>
              <a
                href="tel:18002872727"
                className="font-mono font-bold text-[#9e001f] hover:underline"
              >
                1800-287-2727
              </a>
            </div>

            <div className="p-3 bg-[#f8fafc] rounded-xl flex items-center justify-between border border-slate-200">
              <div>
                <span className="font-bold text-[#141b2b] block">SMRT Transit Feedback</span>
                <span className="text-slate-500">NSL / EWL / CCL inquiries</span>
              </div>
              <a
                href="tel:18003368900"
                className="font-mono font-bold text-[#9e001f] hover:underline"
              >
                1800-336-8900
              </a>
            </div>

            <div className="p-3 bg-[#f8fafc] rounded-xl flex items-center justify-between border border-slate-200">
              <div>
                <span className="font-bold text-[#141b2b] block">LTA Public Transport Lost & Found</span>
                <span className="text-slate-500">Centrally administered database</span>
              </div>
              <a
                href="tel:18002255582"
                className="font-mono font-bold text-[#9e001f] hover:underline"
              >
                1800-225-5582
              </a>
            </div>
          </div>
        </section>

        {/* Crowdsource Telemetry Fault / Congestion Reporter */}
        <section className="bg-white rounded-2xl shadow-md p-6 border border-slate-100 space-y-3">
          <h3 className="font-title-lg text-base text-[#141b2b] font-bold flex items-center gap-2">
            <span className="material-symbols-outlined text-[#0284c7]">report</span>
            Commuter Telemetry Report
          </h3>
          <p className="text-xs text-[#5c403f]">
            Encountered bus bunching, faulty ramp, or unannounced stop skip? Submit an instant notification to LTA monitoring.
          </p>

          {feedbackSubmitted ? (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2 animate-fadeIn">
              <span className="material-symbols-outlined text-[20px] text-emerald-600">check_circle</span>
              <span>Report #LT-8921 received and dispatched to OCC dispatchers. Thank you!</span>
            </div>
          ) : (
            <form onSubmit={handleFeedbackSubmit} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Incident Category</label>
                  <select
                    value={feedbackCategory}
                    onChange={(e) => setFeedbackCategory(e.target.value)}
                    className="w-full p-2 bg-[#f1f3ff] rounded-xl border-none focus:ring-2 focus:ring-[#9e001f]"
                  >
                    <option value="bus_bunching">Bus Bunching (2+ buses)</option>
                    <option value="overcrowded">Severe Overcrowding / Denied Boarding</option>
                    <option value="ramp_fault">Wheelchair Ramp Inoperative</option>
                    <option value="arrival_mismatch">Display ETA Mismatch</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Bus Service #</label>
                  <input
                    type="text"
                    value={feedbackService}
                    onChange={(e) => setFeedbackService(e.target.value)}
                    className="w-full p-2 bg-[#f1f3ff] rounded-xl border-none focus:ring-2 focus:ring-[#9e001f] font-mono font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Additional Observations</label>
                <textarea
                  rows={2}
                  value={feedbackNote}
                  onChange={(e) => setFeedbackNote(e.target.value)}
                  placeholder="e.g. Bus SG5902T was delayed by 6 mins near Orchard Blvd junction..."
                  className="w-full p-2 bg-[#f1f3ff] rounded-xl border-none focus:ring-2 focus:ring-[#9e001f]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2 px-4 bg-[#9e001f] hover:bg-[#c8102e] text-white font-semibold rounded-xl transition-colors shadow-xs"
              >
                Transmit Telemetry Report
              </button>
            </form>
          )}
        </section>
      </div>
    </div>
  );
};
