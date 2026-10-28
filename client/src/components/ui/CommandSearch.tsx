import React, { useState, useEffect } from 'react';
import { Search, LayoutDashboard, FolderGit2, Sparkles, FileText, Sheet, Settings, ArrowRight } from 'lucide-react';
import { Modal } from './Modal';
import { NavigationTab } from './GlassNavigation';

interface CommandSearchProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTab: (tab: NavigationTab) => void;
}

export const CommandSearch: React.FC<CommandSearchProps> = ({
  isOpen,
  onClose,
  onSelectTab,
}) => {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const items: { id: NavigationTab; label: string; desc: string; icon: any; category: string }[] = [
    { id: 'overview', label: 'Overview Dashboard', desc: 'Summary metrics, recent resumes & quick links', icon: LayoutDashboard, category: 'Navigation' },
    { id: 'portfolio', label: 'My Portfolio', desc: 'Manage skills, projects, experience & education', icon: FolderGit2, category: 'Data' },
    { id: 'job-matcher', label: 'Job Description Matcher', desc: 'AI-assisted JD extraction & portfolio evidence match', icon: Sparkles, category: 'AI Tools' },
    { id: 'resume-studio', label: 'Resume Studio', desc: 'Split-screen resume builder, PDF generator & versioning', icon: FileText, category: 'Studio' },
    { id: 'sheets', label: 'Google Sheets Integration', desc: 'Bi-directional sync and worksheet tabs management', icon: Sheet, category: 'Integrations' },
    { id: 'settings', label: 'System Settings', desc: 'API status, demo seed data & JSON backups', icon: Settings, category: 'Preferences' },
  ];

  const filtered = items.filter(
    (item) =>
      item.label.toLowerCase().includes(query.toLowerCase()) ||
      item.desc.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Command Center" maxWidth="md">
      <div className="space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#737987]" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search commands, destinations, tools..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl glass-input text-xs text-white placeholder:text-[#737987]"
            autoFocus
          />
        </div>

        <div className="space-y-1 max-h-72 overflow-y-auto pt-2">
          {filtered.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onSelectTab(item.id);
                  onClose();
                }}
                className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-white/[0.06] transition-colors text-left group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-white/[0.05] border border-white/10 text-sky-400 group-hover:bg-sky-500/20 transition-colors">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-medium text-[#F3F4F6]">{item.label}</div>
                    <div className="text-[11px] text-[#737987]">{item.desc}</div>
                  </div>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-[#737987] group-hover:text-white group-hover:translate-x-0.5 transition-all" />
              </button>
            );
          })}
          {filtered.length === 0 && (
            <div className="py-8 text-center text-xs text-[#737987]">
              No results found for "{query}"
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};
