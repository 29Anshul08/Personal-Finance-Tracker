import React from 'react';
import { Database, AlertCircle, ExternalLink } from 'lucide-react';

const SupabaseSetup = () => {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `linear-gradient(rgba(59, 130, 246, 0.9), rgba(16, 185, 129, 0.9)), url('https://images.pexels.com/photos/3483098/pexels-photo-3483098.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop')`
        }}
      />
      
      {/* Overlay Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/30 via-transparent to-emerald-900/30" />
      
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="max-w-2xl w-full">
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/20 p-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Database className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Setup Required</h1>
              <p className="text-gray-600">Configure Supabase to start using FinanceTracker</p>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
              <div className="flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5" />
                <div>
                  <h3 className="text-sm font-medium text-amber-800">Database Configuration Needed</h3>
                  <p className="text-sm text-amber-700 mt-1">
                    To use this application, you need to set up Supabase for user authentication and data storage.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Quick Setup Steps:</h3>
                <ol className="space-y-3 text-sm text-gray-700">
                  <li className="flex items-start space-x-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-medium">1</span>
                    <div>
                      <span className="font-medium">Create a Supabase account</span>
                      <p className="text-gray-600">Visit supabase.com and create a free account</p>
                    </div>
                  </li>
                  <li className="flex items-start space-x-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-medium">2</span>
                    <div>
                      <span className="font-medium">Create a new project</span>
                      <p className="text-gray-600">Set up a new Supabase project for your finance tracker</p>
                    </div>
                  </li>
                  <li className="flex items-start space-x-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-medium">3</span>
                    <div>
                      <span className="font-medium">Get your API keys</span>
                      <p className="text-gray-600">Copy your project URL and anon key from the API settings</p>
                    </div>
                  </li>
                  <li className="flex items-start space-x-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-medium">4</span>
                    <div>
                      <span className="font-medium">Configure environment variables</span>
                      <p className="text-gray-600">Add your Supabase URL and key to the environment variables</p>
                    </div>
                  </li>
                </ol>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">Environment Variables Needed:</h4>
                <div className="bg-gray-900 rounded-md p-3 text-sm">
                  <code className="text-green-400">
                    VITE_SUPABASE_URL=your_project_url<br />
                    VITE_SUPABASE_ANON_KEY=your_anon_key
                  </code>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <a
                  href="https://supabase.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:from-blue-600 hover:to-blue-700 transition-all duration-200 flex items-center justify-center space-x-2"
                >
                  <span>Get Started with Supabase</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
                <button
                  onClick={() => window.location.reload()}
                  className="flex-1 bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-200 transition-all duration-200"
                >
                  Refresh Page
                </button>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-200">
              <h4 className="font-medium text-gray-900 mb-2">Demo Mode Available</h4>
              <p className="text-sm text-gray-600">
                The application will work in demo mode without Supabase, but data won't be persisted. 
                Set up Supabase for full functionality with user accounts and data storage.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupabaseSetup;