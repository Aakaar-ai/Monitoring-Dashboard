import React from 'react';
import { Clock, Sparkles, Zap } from 'lucide-react';

interface ComingSoonOverlayProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
  showAnimation?: boolean;
}

export const ComingSoonOverlay: React.FC<ComingSoonOverlayProps> = ({
  children,
  title = "Coming Soon",
  description = "This feature is currently under development and will be available soon.",
  showAnimation = true
}) => {
  return (
    <div className="relative h-[90vh] overflow-hidden">
      {/* Original content with blur */}
      <div className="filter blur-sm pointer-events-none select-none h-full overflow-hidden">
        {children}
      </div>
      
      {/* Translucent overlay */}
      <div className="absolute inset-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm flex items-center justify-center z-10 h-screen">
        <div className="text-center max-w-lg mx-auto p-8">
          {/* Animated icon */}
          <div className="relative mb-6">
            <div className={`
              inline-flex items-center justify-center w-20 h-20 
              bg-gradient-to-br from-blue-500 to-purple-600 
              rounded-full shadow-lg
              ${showAnimation ? 'animate-pulse' : ''}
            `}>
              <Clock className="w-10 h-10 text-white" />
            </div>
            
            {/* Floating sparkles animation */}
            {showAnimation && (
              <>
                <Sparkles className="absolute -top-2 -right-2 w-6 h-6 text-yellow-400 animate-bounce" />
                <Zap className="absolute -bottom-1 -left-2 w-5 h-5 text-blue-400 animate-ping" />
              </>
            )}
          </div>
          
          {/* Title */}
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
            {title}
          </h3>
          
          {/* Description */}
          <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
            {description}
          </p>
          
          {/* Progress indicator */}
          <div className="space-y-3">
            {/* <div className="flex items-center justify-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
              <span>In Development</span>
            </div> */}
            
            {/* Progress bar */}
            {/* <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-1000 ease-out"
                style={{ width: '65%' }}
              ></div>
            </div>
            <p className="text-xs text-gray-400 dark:text-gray-500">65% Complete</p> */}
          </div>
        </div>
      </div>
    </div>
  );
};
