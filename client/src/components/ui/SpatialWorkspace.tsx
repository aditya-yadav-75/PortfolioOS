import React from 'react';

interface SpatialWorkspaceProps {
  children: React.ReactNode;
}

export const SpatialWorkspace: React.FC<SpatialWorkspaceProps> = ({ children }) => {
  return (
    <div className="relative min-h-screen w-full bg-[#08090B] overflow-x-hidden">
      {/* Subtle Spatial Vignette & Controlled Lighting Highlights */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        {/* Subtle ice blue glow at top right */}
        <div className="absolute -top-[20%] right-[10%] w-[600px] h-[600px] rounded-full bg-sky-500/[0.035] blur-[140px]" />
        {/* Subtle indigo depth glow at bottom left */}
        <div className="absolute -bottom-[20%] left-[5%] w-[650px] h-[650px] rounded-full bg-indigo-500/[0.025] blur-[160px]" />
      </div>

      {/* Main Layered Workspace Content */}
      <div className="relative z-10 flex min-h-screen">
        {children}
      </div>
    </div>
  );
};
