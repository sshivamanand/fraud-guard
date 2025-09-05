import React from 'react';
import { Shield, Upload, BarChart3, ArrowRight, CheckCircle } from 'lucide-react';

export default function LandingPage() {
  const handleGetStarted = () => {
    // Use React Router navigation here
    // Example: navigate('/predict');
    window.location.href = '/predict';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <nav className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Shield className="h-8 w-8 text-indigo-600" />
              <span className="text-xl font-bold text-gray-900">FraudGuard</span>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
        <div className="text-center">
          <div className="mb-8">
            <div className="relative inline-block">
              <div className="absolute inset-0 bg-indigo-600/20 rounded-full blur-xl"></div>
              <Shield className="relative h-16 w-16 sm:h-20 sm:w-20 text-indigo-600 mx-auto" />
            </div>
          </div>
          
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Detect Credit Card
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600"> Fraud</span>
          </h1>
          
          <p className="text-lg sm:text-xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
            A machine learning powered fraud detection. Upload CSV files for batch processing 
            and get an instant fraud alert.
          </p>

          {/* Quick Features */}
          <div className="grid sm:grid-cols-3 gap-6 mb-12">
            <div className="bg-white/70 backdrop-blur-sm p-6 rounded-xl border border-white/50 hover:bg-white/80 transition-all">
              <Upload className="h-8 w-8 text-blue-600 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">Upload CSV</h3>
              <p className="text-sm text-gray-600">Batch process multiple transactions</p>
            </div>
            
            <div className="bg-white/70 backdrop-blur-sm p-6 rounded-xl border border-white/50 hover:bg-white/80 transition-all">
              <BarChart3 className="h-8 w-8 text-green-600 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">ML Powered</h3>
              <p className="text-sm text-gray-600">Advanced neural network detection</p>
            </div>
            
            <div className="bg-white/70 backdrop-blur-sm p-6 rounded-xl border border-white/50 hover:bg-white/80 transition-all">
              <CheckCircle className="h-8 w-8 text-indigo-600 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">Instant Results</h3>
              <p className="text-sm text-gray-600">Get predictions in seconds</p>
            </div>
          </div>

          {/* CTA */}
          <div className="space-y-4">
            <button
              onClick={handleGetStarted}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold py-4 px-8 rounded-xl text-lg inline-flex items-center space-x-3 shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
            >
              <span>Start Detection</span>
              <ArrowRight className="h-5 w-5" />
            </button>
            <p className="text-sm text-gray-500">No registration required • Free to use</p>
          </div>
        </div>
      </main>

      {/* Background decoration */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-indigo-200/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-200/20 rounded-full blur-3xl"></div>
      </div>
    </div>
  );
}

