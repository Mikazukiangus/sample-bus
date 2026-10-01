import React, { useState } from 'react';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  serviceNo: string;
  stopName: string;
  nextArrival: string;
}

export const ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  onClose,
  serviceNo,
  stopName,
  nextArrival,
}) => {
  const [copied, setCopied] = useState(false);
  const shareText = `Bus ${serviceNo} is arriving in ${nextArrival} at ${stopName} via SG Transit Live!`;
  const shareUrl = window.location.href;

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(`${shareText}\n${shareUrl}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200">
        <div className="p-4 bg-[#f9f9ff] border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#c8102e]">share</span>
            <h3 className="font-headline-sm text-base text-[#141b2b]">Share Live Bus Telemetry</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <div className="p-5 space-y-4">
          <div className="bg-[#f1f3ff] p-3 rounded-xl border border-[#e1e8fd]">
            <p className="text-xs text-[#5c403f] font-medium">Broadcast Message:</p>
            <p className="text-sm font-semibold text-[#141b2b] mt-1">{shareText}</p>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={shareUrl}
              className="flex-1 bg-slate-100 px-3 py-2 rounded-xl text-xs text-slate-700 font-mono truncate border-none"
            />
            <button
              type="button"
              onClick={handleCopy}
              className="px-3 py-2 bg-[#9e001f] text-white rounded-xl text-xs font-semibold hover:bg-[#c8102e] transition-colors flex items-center gap-1 shrink-0"
            >
              <span className="material-symbols-outlined text-[16px]">
                {copied ? 'check' : 'content_copy'}
              </span>
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>

          <div className="pt-2">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-2">
              Quick Share
            </span>
            <div className="grid grid-cols-2 gap-2 text-xs font-medium">
              <a
                href={`https://wa.me/?text=${encodeURIComponent(`${shareText} ${shareUrl}`)}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-2 py-2 px-3 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-xl transition-colors border border-emerald-200"
              >
                <span>WhatsApp</span>
              </a>
              <a
                href={`https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-2 py-2 px-3 bg-sky-50 text-sky-700 hover:bg-sky-100 rounded-xl transition-colors border border-sky-200"
              >
                <span>Telegram</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
