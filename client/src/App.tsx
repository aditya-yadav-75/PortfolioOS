import React, { useState } from 'react';
import { ToastProvider } from './components/ui/Toast';
import { SpatialWorkspace } from './components/ui/SpatialWorkspace';
import { GlassNavigation, NavigationTab } from './components/ui/GlassNavigation';
import { CommandSearch } from './components/ui/CommandSearch';

import { OverviewView } from './features/dashboard/OverviewView';
import { PortfolioView } from './features/portfolio/PortfolioView';
import { JobMatcherView } from './features/job-matcher/JobMatcherView';
import { ResumeStudioView } from './features/resume-studio/ResumeStudioView';
import { GoogleSheetsView } from './features/integrations/GoogleSheetsView';
import { SettingsView } from './features/settings/SettingsView';

export const AppContent: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<NavigationTab>('overview');
  const [openedResumeId, setOpenedResumeId] = useState<string | undefined>(undefined);
  const [presetRole, setPresetRole] = useState<'frontend' | 'ai_ml' | undefined>(undefined);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const handleOpenResume = (id: string) => {
    setOpenedResumeId(id);
    setPresetRole(undefined);
    setCurrentTab('resume-studio');
  };

  const handleSendToStudio = (role: 'frontend' | 'ai_ml') => {
    setPresetRole(role);
    setOpenedResumeId(undefined);
    setCurrentTab('resume-studio');
  };

  return (
    <SpatialWorkspace>
      {/* Navigation Rail */}
      <GlassNavigation
        currentTab={currentTab}
        onSelectTab={(tab) => {
          setCurrentTab(tab);
          if (tab !== 'resume-studio') {
            setOpenedResumeId(undefined);
            setPresetRole(undefined);
          }
        }}
        onOpenSearch={() => setIsSearchOpen(true)}
      />

      {/* Central Spatial Content Workspace */}
      <main className="flex-1 w-full min-w-0 p-4 sm:p-6 lg:p-8 pt-20 lg:pt-6 overflow-y-auto">
        {currentTab === 'overview' && (
          <OverviewView
            onNavigate={setCurrentTab}
            onOpenResume={handleOpenResume}
          />
        )}
        {currentTab === 'portfolio' && <PortfolioView />}
        {currentTab === 'job-matcher' && (
          <JobMatcherView
            onNavigate={setCurrentTab}
            onSendToStudio={handleSendToStudio}
          />
        )}
        {currentTab === 'resume-studio' && (
          <ResumeStudioView
            initialResumeId={openedResumeId}
            presetRole={presetRole}
          />
        )}
        {currentTab === 'sheets' && <GoogleSheetsView />}
        {currentTab === 'settings' && <SettingsView />}
      </main>

      {/* Command Search Overlay */}
      <CommandSearch
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectTab={setCurrentTab}
      />
    </SpatialWorkspace>
  );
};

export default function App() {
  return (
    <ToastProvider>
      <AppContent />
    </ToastProvider>
  );
}
