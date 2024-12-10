import { Link } from 'react-router-dom';
import { ArrowLeft, Phone, Monitor, Download, Database, RefreshCw, WifiOff } from 'lucide-react';

export function Support() {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="mb-8">
          <Link 
            to="/"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800"
          >
            <ArrowLeft size={20} />
            Back to Home
          </Link>
        </div>

        <div className="space-y-8">
          {/* Installation Guide */}
          <div className="bg-white rounded-lg shadow-sm p-8">
            <h2 className="text-2xl font-bold mb-6">Install NeuroPocket</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-gray-50 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Phone className="w-6 h-6 text-blue-600" />
                  <h3 className="text-lg font-semibold">Android</h3>
                </div>
                <ol className="space-y-2">
                  <li className="flex gap-2 text-gray-600">
                    <span className="text-blue-600 font-medium">1.</span>
                    Open in Chrome
                  </li>
                  <li className="flex gap-2 text-gray-600">
                    <span className="text-blue-600 font-medium">2.</span>
                    Tap the menu (⋮)
                  </li>
                  <li className="flex gap-2 text-gray-600">
                    <span className="text-blue-600 font-medium">3.</span>
                    Select "Add to Home screen"
                  </li>
                </ol>
              </div>

              <div className="bg-gray-50 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Phone className="w-6 h-6 text-blue-600" />
                  <h3 className="text-lg font-semibold">iPhone/iPad</h3>
                </div>
                <ol className="space-y-2">
                  <li className="flex gap-2 text-gray-600">
                    <span className="text-blue-600 font-medium">1.</span>
                    Open in Safari
                  </li>
                  <li className="flex gap-2 text-gray-600">
                    <span className="text-blue-600 font-medium">2.</span>
                    Tap Share button
                  </li>
                  <li className="flex gap-2 text-gray-600">
                    <span className="text-blue-600 font-medium">3.</span>
                    Choose "Add to Home Screen"
                  </li>
                </ol>
              </div>

              <div className="bg-gray-50 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Monitor className="w-6 h-6 text-blue-600" />
                  <h3 className="text-lg font-semibold">Computer</h3>
                </div>
                <ol className="space-y-2">
                  <li className="flex gap-2 text-gray-600">
                    <span className="text-blue-600 font-medium">1.</span>
                    Open in Chrome
                  </li>
                  <li className="flex gap-2 text-gray-600">
                    <span className="text-blue-600 font-medium">2.</span>
                    Click install icon in address bar
                  </li>
                  <li className="flex gap-2 text-gray-600">
                    <span className="text-blue-600 font-medium">3.</span>
                    Click "Install"
                  </li>
                </ol>
              </div>
            </div>
          </div>

          {/* Offline Support */}
          <div className="bg-white rounded-lg shadow-sm p-8">
            <h2 className="text-2xl font-bold mb-6">How Offline Support Works</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <div className="flex items-start gap-3 mb-6">
                  <Download className="w-6 h-6 text-blue-600 mt-1" />
                  <div>
                    <h3 className="font-semibold mb-2">First Visit</h3>
                    <p className="text-gray-600">
                      When you first use NeuroPocket, it saves everything needed to work offline:
                    </p>
                    <ul className="mt-2 space-y-2 text-gray-600">
                      <li className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                        The app itself
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                        AI model for image recognition
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Database className="w-6 h-6 text-blue-600 mt-1" />
                  <div>
                    <h3 className="font-semibold mb-2">Your Data</h3>
                    <p className="text-gray-600">
                      Everything you create stays on your device:
                    </p>
                    <ul className="mt-2 space-y-2 text-gray-600">
                      <li className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                        Your projects and images
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                        Trained AI models
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <div>
                <div className="flex items-start gap-3 mb-6">
                  <WifiOff className="w-6 h-6 text-blue-600 mt-1" />
                  <div>
                    <h3 className="font-semibold mb-2">Working Offline</h3>
                    <p className="text-gray-600">
                      Once installed, you can use NeuroPocket without internet:
                    </p>
                    <ul className="mt-2 space-y-2 text-gray-600">
                      <li className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                        Create new projects
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                        Add and organize images
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                        Train and test AI models
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <RefreshCw className="w-6 h-6 text-blue-600 mt-1" />
                  <div>
                    <h3 className="font-semibold mb-2">Clearing Data</h3>
                    <p className="text-gray-600">
                      If you clear your browser data:
                    </p>
                    <ul className="mt-2 space-y-2 text-gray-600">
                      <li className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                        The app will automatically re-download when you next visit
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                        Your projects and models will be removed
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}