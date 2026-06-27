import React from 'react';


const AuthLayout = ({ children, title, description }) => {
  return (
    <div className="min-h-screen flex flex-col">
      
      
      <main className="flex-grow bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            {/* Left Side - Info */}
            <div>
              <h1 className="text-5xl font-bold text-gray-900 mb-6">
                {title}
              </h1>
              <p className="text-gray-600 text-lg leading-relaxed mb-8">
                {description}
              </p>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 font-bold">
                    1
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Create Your Account</h3>
                    <p className="text-gray-600 text-sm">Quick and easy registration process</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 font-bold">
                    2
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">File Your Complaint</h3>
                    <p className="text-gray-600 text-sm">Fill in details about the issue</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 font-bold">
                    3
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Track Progress</h3>
                    <p className="text-gray-600 text-sm">Monitor resolution in real-time</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Form */}
            <div className="bg-white rounded-lg shadow-lg p-8">
              {children}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AuthLayout;
