import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-4xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl">
            McDonald&apos;s Survey Solver
          </h1>
          <p className="mt-2 text-xl text-gray-600">
            Automatically complete your McDonald&apos;s survey and get your
            validation code
          </p>
        </div>
      </div>
    </header>
  );
};

export { Header };
