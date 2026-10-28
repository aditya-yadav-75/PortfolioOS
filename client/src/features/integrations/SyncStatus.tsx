import React from 'react';
import { CheckCircle2, AlertTriangle, AlertCircle, Clock } from 'lucide-react';
import { SheetsSyncLog } from '@portfolio-os/shared';

interface SyncStatusProps {
  logs: SheetsSyncLog[];
}

export const SyncStatus: React.FC<SyncStatusProps> = ({ logs }) => {
  if (logs.length === 0) {
    return (
      <div className="py-8 text-center text-xs text-[#737987]">
        No sync operations logged yet. Perform an export or import above.
      </div>
    );
  }

  return (
    <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
      {logs.map((log) => {
        const isSuccess = log.status === 'SUCCESS';
        const isWarning = log.status === 'WARNING';

        return (
          <div
            key={log.id}
            className="p-3 rounded-xl bg-white/[0.02] border border-white/5 flex items-start justify-between gap-3 text-xs"
          >
            <div className="flex items-start gap-2.5">
              {isSuccess ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              ) : isWarning ? (
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              )}
              <div>
                <div className="font-semibold text-white capitalize">
                  {log.action.replace('_', ' ')}
                  <span className="text-[10px] font-normal text-[#737987] ml-2">
                    ({log.items_synced} records synced)
                  </span>
                </div>
                {log.error_message && (
                  <div className="text-[11px] text-rose-300 mt-1 leading-snug">
                    {log.error_message}
                  </div>
                )}
                <div className="text-[10px] text-[#737987] flex items-center gap-1.5 mt-1">
                  <Clock className="w-3 h-3" />
                  {new Date(log.timestamp).toLocaleString()}
                </div>
              </div>
            </div>

            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                isSuccess
                  ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
                  : 'text-rose-400 bg-rose-500/10 border-rose-500/20'
              }`}
            >
              {log.status}
            </span>
          </div>
        );
      })}
    </div>
  );
};
