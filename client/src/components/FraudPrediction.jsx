import React, { useState } from 'react';
import { Shield, ArrowRight, Upload, Loader2, AlertCircle, CheckCircle } from 'lucide-react';

export default function FraudPredictor() {
  const [csvFile, setCsvFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [predictions, setPredictions] = useState(null);
  const [error, setError] = useState(null);

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  const handleFileChange = (e) => {
    setCsvFile(e.target.files[0]);
    setPredictions(null);
    setError(null);
  };

  const handleFormSubmit = async () => {
    if (!csvFile) {
      alert('Please select a CSV file');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    setPredictions(null);

    try {
      const formData = new FormData();
      formData.append('file', csvFile);

      const response = await fetch(BACKEND_URL + "/predict", {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      setPredictions(
          data.predictions.map((prob, idx) => ({
          Transaction: idx + 1,
          FraudProbability: prob
          }))
      );
      
      if (data.error) {
        throw new Error(data.error);
      }
    } catch (err) {
      console.error('Error:', err);
      setError(err.message || 'An error occurred while processing your file');
    } finally {
      setIsLoading(false);
    }
  };

  // Reset to initial state
  const handleReset = () => {
    setCsvFile(null);
    setPredictions(null);
    setError(null);
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
            {predictions && (
              <button>
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
        {!predictions ? (
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
                Predict
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600"> Fraud</span>
              </h2>
              <p className="text-lg text-gray-600 max-w-xl mx-auto leading-relaxed">
                Upload a CSV file for machine learning powered fraud prediction.
              </p>
              <p className="text-lg text-gray-600 max-w-xl mx-auto leading-relaxed">
                For sample datasets click <a target="_blank" href="https://drive.google.com/drive/folders/15EUolln8tcZqibOarcczinTeVUnt8oeJ?usp=sharing" className='text-blue-600 underline hover:cursor-pointer'>here.</a>
              </p>
            </div>
            
            <div className="bg-white/70 backdrop-blur-md p-8 sm:p-10 rounded-3xl shadow-xl border border-white/50">
              {/* Error Message */}
              {error && (
                <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-center space-x-3">
                  <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
                  <div>
                    <p className="text-red-700 font-medium">Error</p>
                    <p className="text-red-600">{error}</p>
                  </div>
                </div>
              )}

              {/* CSV Upload */}
              <div className="relative">
                <div className="flex flex-col items-center justify-center p-12 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-indigo-500 hover:bg-gray-50/50 transition-all">
                  <Upload className="h-12 w-12 text-gray-400 mb-4" />
                  <p className="text-gray-700 mb-2 font-medium text-lg">
                    {csvFile ? csvFile.name : "Drag & drop your CSV file here"}
                  </p>
                  <p className="text-gray-500">or click to browse</p>
                  <input 
                    type="file" 
                    onChange={handleFileChange} 
                    accept=".csv" 
                    className="absolute inset-0 opacity-0 cursor-pointer" 
                  />
                </div>
              </div>
              
              {/* Submit Button */}
              <div className="mt-10 text-center">
                <button
                  onClick={handleFormSubmit}
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold py-4 px-8 rounded-xl text-lg inline-flex items-center space-x-3 shadow-lg hover:shadow-xl transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  disabled={isLoading || !csvFile}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      <span>Analyzing...</span>
                    </>
                  ) : (
                    <>
                      <span>Predict Fraud</span>
                      <ArrowRight className="h-5 w-5" />
                    </>
                  )}
                </button>
                {!isLoading && (
                  <p className="text-sm text-gray-500 mt-4">Powered by machine learning • Instant results</p>
                )}
              </div>
            </div>
          </div>
        ) : (
          // Results Display - Now consistent with initial render styling
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
                Analysis
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600"> Complete</span>
              </h2>
              <p className="text-lg text-gray-600 max-w-xl mx-auto leading-relaxed">
                Analyzed {predictions.length} transactions from {csvFile.name}
              </p>
            </div>

            <div className="bg-white/70 backdrop-blur-md p-8 sm:p-10 rounded-3xl shadow-xl border border-white/50">
              {/* Summary Stats */}
              <div className="grid grid-cols-3 gap-6 mb-8">
                <div className="text-center p-4 bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-2xl border border-indigo-200/50">
                  <p className="text-2xl font-bold text-indigo-600">{predictions.length}</p>
                  <p className="text-sm font-medium text-indigo-700 mt-1">Total</p>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-red-50 to-red-100 rounded-2xl border border-red-200/50">
                  <p className="text-2xl font-bold text-red-600">
                    {predictions.filter(p => p.FraudProbability > 0.5).length}
                  </p>
                  <p className="text-sm font-medium text-red-700 mt-1">High Risk</p>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-2xl border border-green-200/50">
                  <p className="text-2xl font-bold text-green-600">
                    {predictions.filter(p => p.FraudProbability <= 0.5).length}
                  </p>
                  <p className="text-sm font-medium text-green-700 mt-1">Low Risk</p>
                </div>
              </div>

              {/* Results Table Container */}
              <div className="bg-white/50 backdrop-blur-sm rounded-2xl border border-gray-200/50 overflow-hidden">
                <div className="p-6 border-b border-gray-200/50 bg-gradient-to-r from-gray-50/80 to-gray-100/80">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-6 w-6 text-green-500" />
                    <h3 className="text-xl font-semibold text-gray-900">Fraud Predictions</h3>
                  </div>
                </div>
                
                <div className="overflow-x-auto max-h-96">
                  <table className="w-full">
                    <thead className="bg-gradient-to-r from-gray-50/80 to-gray-100/80 sticky top-0">
                      <tr>
                        {predictions[0] && Object.keys(predictions[0]).map((key) => (
                          <th key={key} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            {key}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200/50">
                      {predictions.slice(0, 100).map((row, index) => (
                        <tr key={index} className="hover:bg-indigo-50/30 transition-colors">
                          {Object.values(row).map((value, cellIndex) => (
                            <td key={cellIndex} className="px-6 py-4 whitespace-nowrap text-sm">
                              {Object.keys(row)[cellIndex] === 'FraudProbability' ? (
                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                                  value > 0.5 
                                    ? 'bg-gradient-to-r from-red-100 to-red-200 text-red-800 border border-red-300/50' 
                                    : 'bg-gradient-to-r from-green-100 to-green-200 text-green-800 border border-green-300/50'
                                }`}>
                                  {(value * 100).toFixed(1)}%
                                </span>
                              ) : (
                                <span className="text-gray-900 font-medium">
                                  {typeof value === 'number' ? value.toFixed(0) : value}
                                </span>
                              )}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {predictions.length > 100 && (
                    <div className="p-4 bg-gradient-to-r from-gray-50/80 to-gray-100/80 text-center border-t border-gray-200/50">
                      <p className="text-sm text-gray-500 font-medium">
                        Showing first 100 of {predictions.length} transactions
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Button */}
              <div className="mt-8 text-center">
                <button
                  onClick={handleReset}
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold py-4 px-8 rounded-xl text-lg inline-flex items-center space-x-3 shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
                >
                  <span>Analyze New File</span>
                  <ArrowRight className="h-5 w-5" />
                </button>
                <p className="text-sm text-gray-500 mt-4">Upload another CSV for analysis</p>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Background decoration */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-indigo-200/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-200/20 rounded-full blur-3xl"></div>
      </div>
    </div>
  );
}