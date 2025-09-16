import React from 'react';
import { AppSidebar } from './AppSidebar';
import { AppHeader } from './AppHeader';

export const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="h-screen bg-background flex overflow-hidden">
      {/* Fixed Sidebar */}
      <div className="fixed left-0 top-0 h-full z-30">
        <AppSidebar />
      </div>
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col ml-64">
        {/* Fixed Header */}
        <div className="fixed top-0 right-0 left-64 z-20">
          <AppHeader />
        </div>
        
        {/* Scrollable Main Content */}
        <main className="flex-1 overflow-auto pt-16 bg-background">
          <div className="p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};
