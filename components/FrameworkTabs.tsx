
import React from 'react';
import { Framework } from '../types';

interface FrameworkTabsProps {
  activeFramework: Framework;
  onSelectFramework: (framework: Framework) => void;
}

export const FrameworkTabs: React.FC<FrameworkTabsProps> = ({ activeFramework, onSelectFramework }) => {
  const frameworks = Object.values(Framework);

  return (
    <div className="border-b border-gray-700">
      <nav className="-mb-px flex space-x-6" aria-label="Tabs">
        {frameworks.map((framework) => (
          <button
            key={framework}
            onClick={() => onSelectFramework(framework)}
            className={`
              whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
              ${
                activeFramework === framework
                  ? 'border-indigo-500 text-indigo-400'
                  : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-500'
              }
              transition-colors duration-200 focus:outline-none
            `}
          >
            {framework}
          </button>
        ))}
      </nav>
    </div>
  );
};