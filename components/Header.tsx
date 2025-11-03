import React from 'react';
import { CubeIcon } from './icons';

const Header: React.FC = () => {
  return (
    <header className="bg-white/80 backdrop-blur-sm sticky top-0 z-10 shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center">
            <CubeIcon className="h-10 w-10 text-indigo-600" />
            <div className="ml-4">
              <h1 className="text-2xl font-bold text-gray-900">AI Warehouse Optimizer</h1>
              <p className="text-sm text-gray-500">Smart Storage Location Assignment (SLAP)</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;