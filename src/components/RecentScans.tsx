import React from 'react';
import { History, ShieldCheck, AlertTriangle, ArrowRight, Trash2, ArrowLeftRight } from 'lucide-react';
import type { RecentScanItem } from '../types.js';

interface RecentScansProps {
  items: RecentScanItem[];
  onSelectScan: (url: string) => void;
  onCompareScan: (url: string) => void;
  onClearHistory: () => void;
}

export const RecentScans: React.FC<RecentScansProps> = ({
  items,
  onSelectScan,
  onCompareScan,
  onClearHistory,
}) => {
  if (items.length === 0) return null;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold text-sm">
          <History className="w-4 h-4 text-emerald-500" />
          <span>Recent Site Inspections</span>
          <span className="text-xs text-slate-400 font-normal">({items.length})</span>
        </div>
        <button
          onClick={onClearHistory}
          className="text-xs text-slate-400 hover:text-rose-500 flex items-center gap-1 transition-colors"
          title="Clear search history"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Clear</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {items.map((item) => (
          <div
            key={item.id}
            className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 flex flex-col justify-between space-y-2 group hover:border-emerald-400 dark:hover:border-emerald-600 transition-colors"
          >
            <div className="flex items-start justify-between gap-2">
              <div
                onClick={() => onSelectScan(item.url)}
                className="cursor-pointer flex-1 min-w-0"
              >
                <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate group-hover:text-emerald-600 dark:group-hover:text-emerald-400">
                  {item.domain}
                </h4>
                <p className="text-[10px] text-slate-400">
                  {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
              <span
                className={`px-2 py-0.5 text-[10px] font-extrabold rounded-md flex-shrink-0 ${
                  item.threatLevel === 'safe'
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                    : item.threatLevel === 'caution'
                    ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                    : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                }`}
              >
                {item.score}/100
              </span>
            </div>

            <div className="flex items-center justify-between pt-1 border-t border-slate-100 dark:border-slate-800/80 text-[11px]">
              <button
                onClick={() => onSelectScan(item.url)}
                className="text-emerald-600 dark:text-emerald-400 font-semibold hover:underline flex items-center gap-1"
              >
                <span>View</span>
                <ArrowRight className="w-3 h-3" />
              </button>
              <button
                onClick={() => onCompareScan(item.domain)}
                className="text-slate-500 hover:text-slate-900 dark:hover:text-slate-200 flex items-center gap-1 font-medium"
                title="Load into comparison"
              >
                <ArrowLeftRight className="w-3 h-3" />
                <span>Compare</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
