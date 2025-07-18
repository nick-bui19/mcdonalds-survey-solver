import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="text-center space-y-4">
          {/* Disclaimer */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-sm font-medium text-yellow-800 mb-2">
              Important Disclaimer
            </p>
            <p className="text-xs text-yellow-700">
              This tool is not affiliated with McDonald&apos;s Corporation. Use
              at your own risk and responsibility. Respect McDonald&apos;s terms
              of service (maximum 5 surveys per month per location). For
              educational and personal use only.
            </p>
          </div>

          {/* Links */}
          <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-600">
            <a
              href="https://www.mcdvoice.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gray-900 underline"
            >
              Official McDonald&apos;s Survey
            </a>
            <a
              href="https://github.com/nick-bui19/mcdonalds-survey-solver"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gray-900 underline"
            >
              GitHub Repository
            </a>
          </div>

          {/* Usage Guidelines */}
          <div className="text-xs text-gray-500 max-w-2xl mx-auto">
            <p className="mb-2 font-medium">Usage Guidelines:</p>
            <ul className="space-y-1 text-left">
              <li>• Only use with your own McDonald&apos;s receipts</li>
              <li>• Respect the 5-survey monthly limit per location</li>
              <li>• Codes are valid for 7 days from purchase date</li>
              <li>• Each code can only be used once</li>
              <li>• Tool is for educational purposes</li>
            </ul>
          </div>

          {/* Copyright */}
          <div className="pt-4 border-t border-gray-200">
            <p className="text-xs text-gray-400">
              Made for educational purposes • Not affiliated with
              McDonald&apos;s Corporation
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export { Footer };
