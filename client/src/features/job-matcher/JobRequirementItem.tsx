import React from 'react';
import { CheckCircle2, AlertTriangle, XCircle, ArrowUpRight } from 'lucide-react';
import { RequirementMatch } from '@portfolio-os/shared';

interface JobRequirementItemProps {
  match: RequirementMatch;
  onToggleInclusion?: (reqId: string) => void;
  isIncluded?: boolean;
}

export const JobRequirementItem: React.FC<JobRequirementItemProps> = ({
  match,
  onToggleInclusion,
  isIncluded = true,
}) => {
  const statusConfig = {
    MATCHED: {
      label: 'Matched',
      color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
      icon: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />,
    },
    PARTIALLY_MATCHED: {
      label: 'Partially Matched',
      color: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
      icon: <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />,
    },
    NOT_EVIDENCED: {
      label: 'Not Evidenced',
      color: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
      icon: <XCircle className="w-3.5 h-3.5 text-rose-400 shrink-0" />,
    },
  }[match.status];

  return (
    <div className="p-4 rounded-xl glass-panel-subtle border border-white/10 space-y-3 transition-all hover:border-white/20">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-2.5">
          {statusConfig.icon}
          <div>
            <div className="text-xs font-semibold text-white leading-snug">
              {match.requirement_text}
            </div>
            <div className="text-[10px] text-[#737987] uppercase tracking-wider mt-0.5">
              Category: {match.category.replace('_', ' ')}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${statusConfig.color}`}>
            {statusConfig.label} {match.confidence_score > 0 ? `(${match.confidence_score}%)` : ''}
          </span>
          {onToggleInclusion && (
            <input
              type="checkbox"
              checked={isIncluded}
              onChange={() => onToggleInclusion(match.requirement_id)}
              className="rounded bg-black/40 border-white/20 text-sky-500 focus:ring-0 w-3.5 h-3.5 cursor-pointer"
              title="Include evidence in resume generation"
            />
          )}
        </div>
      </div>

      {/* Rationale */}
      <p className="text-[11px] text-[#A0A5B0] leading-relaxed pl-6">
        {match.rationale}
      </p>

      {/* Cited Portfolio Evidence */}
      {match.evidence && match.evidence.length > 0 && (
        <div className="pl-6 pt-2 border-t border-white/5 space-y-1.5">
          <span className="text-[10px] text-[#737987] uppercase tracking-wider font-medium block">
            Supporting Evidence ({match.evidence.length})
          </span>
          <div className="space-y-1">
            {match.evidence.map((ev, idx) => (
              <div key={idx} className="flex items-start gap-1.5 text-xs text-[#F3F4F6] bg-white/[0.02] p-2 rounded-lg border border-white/5">
                <ArrowUpRight className="w-3 h-3 text-sky-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-sky-400 capitalize text-[11px]">{ev.record_type}: </span>
                  <span className="text-white text-[11px] font-medium">{ev.record_title}</span>
                  <p className="text-[10px] text-[#A0A5B0] mt-0.5">{ev.relevance_explanation}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
