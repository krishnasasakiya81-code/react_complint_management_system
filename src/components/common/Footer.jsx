import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
                <span className="text-white font-bold">G</span>
              </div>
              <span className="text-xl font-bold">GOVTRACK</span>
            </div>
            <p className="text-gray-400 text-sm">
              Official platform for public grievance redressal and service delivery monitoring. Committed to building a more transparent future.
            </p>
          </div>

          {/* Platform */}
          <div>
            <h3 className="text-lg font-semibold mb-4"></h3>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-white"></a></li>
              <li><a href="#" className="hover:text-white"></a></li>
              <li><a href="#" className="hover:text-white"></a></li>
              <li><a href="#" className="hover:text-white"></a></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-lg font-semibold mb-4"></h3>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-white"></a></li>
              <li><a href="#" className="hover:text-white"></a></li>
              <li><a href="#" className="hover:text-white"></a></li>
              <li><a href="#" className="hover:text-white"></a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4">CONTACT</h3>
            <ul className="space-y-2 text-gray-400">
              <li className="flex items-center gap-2">
                <span>1-800-GOV-HELP</span>
              </li>
              <li><a href="mailto:support@govtrack.gov" className="hover:text-white">support@govtrack.gov</a></li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-800 pt-8 mt-8">
          <div className="flex flex-col md:flex-row justify-between items-center text-gray-400 text-sm">
            <p>© 2024 GovTrack Official. All rights reserved.</p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <a href="#" className="hover:text-white">Privacy Policy</a>
              <a href="#" className="hover:text-white">Terms of Service</a>
              <a href="#" className="hover:text-white">Accessibility</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
