import React, { useState } from 'react';
import {
  LayoutDashboard,
  FolderGit2,
  Sparkles,
  FileText,
  Sheet,
  Settings,
  Menu,
  X,
  Layers,
  Search,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export type NavigationTab =
  | 'overview'
  | 'portfolio'
  | 'job-matcher'
  | 'resume-studio'
  | 'sheets'
  | 'settings';

interface GlassNavigationProps {
  currentTab: NavigationTab;
  onSelectTab: (tab: NavigationTab) => void;
  onOpenSearch?: () => void;
}

interface NavItem {
  id: NavigationTab;
  label: string;
  icon: any;
  badge?: string;
}

export const GlassNavigation: React.FC<GlassNavigationProps> = ({
  currentTab,
  onSelectTab,
  onOpenSearch,
}) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems: NavItem[] = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'portfolio', label: 'My Portfolio', icon: FolderGit2 },
    { id: 'job-matcher', label: 'Job Matcher', icon: Sparkles, badge: 'AI' },
    { id: 'resume-studio', label: 'Resume Studio', icon: FileText },
    { id: 'sheets', label: 'Google Sheets', icon: Sheet },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <>
      {/* Desktop Floating Navigation Rail */}
      <aside className="hidden lg:flex flex-col justify-between w-64 h-[calc(100vh-2rem)] sticky top-4 ml-4 my-4 rounded-3xl glass-nav p-5 shrink-0 z-40">
        <div>
          {/* Logo / Brand */}
          <div className="flex items-center gap-3 px-2 py-3 mb-6">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-sky-400/20 to-sky-600/10 border border-sky-400/30 flex items-center justify-center text-sky-400 shadow-[0_0_12px_rgba(56,189,248,0.25)]">
              <Layers className="w-5 h-5 stroke-[2]" />
            </div>
            <div>
              <div className="text-sm font-semibold tracking-tight text-[#F3F4F6] flex items-center gap-1.5">
                PortfolioOS
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-sky-500/10 text-sky-400 border border-sky-500/20">v1.0</span>
              </div>
              <div className="text-[11px] text-[#737987]">Spatial Resume Engine</div>
            </div>
          </div>

          {/* Search Trigger Button */}
          {onOpenSearch && (
            <button
              onClick={onOpenSearch}
              className="w-full flex items-center justify-between px-3 py-2 mb-6 rounded-xl bg-white/[0.04] border border-white/10 hover:border-white/20 text-[#A0A5B0] hover:text-[#F3F4F6] transition-all text-xs"
            >
              <span className="flex items-center gap-2">
                <Search className="w-3.5 h-3.5" />
                Quick Search...
              </span>
              <kbd className="text-[10px] bg-white/10 px-1.5 py-0.5 rounded text-[#737987]">⌘K</kbd>
            </button>
          )}

          {/* Navigation Items */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectTab(item.id)}
                  className={`relative w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all duration-150 ${
                    isActive
                      ? 'text-white'
                      : 'text-[#A0A5B0] hover:text-white hover:bg-white/[0.05]'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="nav-active-pill"
                      className="absolute inset-0 rounded-xl bg-sky-500/15 border border-sky-400/30 shadow-[0_0_15px_rgba(56,189,248,0.15)]"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                  <Icon className={`w-4 h-4 relative z-10 stroke-[1.75] ${isActive ? 'text-sky-400' : ''}`} />
                  <span className="relative z-10">{item.label}</span>
                  {item.badge && (
                    <span className="relative z-10 ml-auto text-[10px] font-semibold px-1.5 py-0.5 rounded-md bg-sky-400/15 text-sky-400 border border-sky-400/30">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer info */}
        <div className="pt-4 border-t border-white/10 px-2 text-[11px] text-[#737987] flex items-center justify-between">
          <span>Semester III AI Tools</span>
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
        </div>
      </aside>

      {/* Mobile Top Navigation Bar */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-40 glass-nav border-b border-white/10 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-sky-500/20 border border-sky-400/30 flex items-center justify-center text-sky-400">
            <Layers className="w-4 h-4" />
          </div>
          <span className="text-sm font-semibold text-[#F3F4F6]">PortfolioOS</span>
        </div>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 rounded-xl bg-white/[0.05] border border-white/10 text-[#F3F4F6]"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </header>

      {/* Mobile Drawer Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <div className="lg:hidden fixed inset-0 z-50 flex">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-md"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-72 max-w-[80vw] h-full glass-panel-elevated p-6 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between pb-6 border-b border-white/10 mb-4">
                  <div className="flex items-center gap-2">
                    <Layers className="w-5 h-5 text-sky-400" />
                    <span className="font-semibold text-white">PortfolioOS</span>
                  </div>
                  <button onClick={() => setMobileOpen(false)}>
                    <X className="w-5 h-5 text-[#A0A5B0]" />
                  </button>
                </div>
                <nav className="space-y-1.5">
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = currentTab === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          onSelectTab(item.id);
                          setMobileOpen(false);
                        }}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium ${
                          isActive
                            ? 'bg-sky-500/20 text-white border border-sky-400/30'
                            : 'text-[#A0A5B0] hover:bg-white/[0.05] hover:text-white'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        <span>{item.label}</span>
                      </button>
                    );
                  })}
                </nav>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
