import React from 'react';
import { useAuth } from '../../hooks/useAuth';

const TestModeToggle: React.FC = () => {
  const { isTestMode, toggleTestMode } = useAuth();

  return (
    <div className="fixed bottom-4 right-4 bg-white p-3 rounded-lg shadow-lg border border-gray-200">
      <div className="flex items-center">
        <label htmlFor="test-mode-toggle" className="mr-3 text-sm font-medium text-gray-700">
          Test Mode
        </label>
        <button
          onClick={toggleTestMode}
          className={`relative inline-flex h-6 w-11 items-center rounded-full ${
            isTestMode ? 'bg-blue-600' : 'bg-gray-200'
          }`}
          id="test-mode-toggle"
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
              isTestMode ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>
      </div>
      {isTestMode && (
        <div className="mt-2 text-xs text-gray-500">
          <p>Test mode enabled. No login required.</p>
          <p>All data is simulated.</p>
        </div>
      )}
    </div>
  );
};

export default TestModeToggle;
