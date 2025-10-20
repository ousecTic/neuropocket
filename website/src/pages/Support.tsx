import { Monitor, Download, Database, WifiOff, Smartphone, AlertTriangle, ArrowLeft, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Support() {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-6xl mx-auto px-6 md:px-12 lg:px-16 py-12">
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
          {/* Quick Start */}
          <div className="bg-white rounded-lg shadow-sm p-8">
            <h2 className="text-2xl font-bold mb-6">Get Started with NeuroPocket</h2>
            
            {/* Web Version */}
            <div className="mb-8">
              <div className="bg-blue-50 rounded-lg p-6 mb-6">
                <div className="flex items-center gap-3 mb-6">
                  <Globe className="w-5 h-5 text-blue-600" />
                  <h4 className="text-lg font-semibold">Web App</h4>
                </div>
                <div className="space-y-4">
                  <a 
                    href="https://neuropocket.netlify.app"
                    className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                  >
                    <Globe className="w-5 h-5" />
                    Open NeuroPocket
                  </a>
                  <div className="flex items-start gap-2 text-blue-800 bg-blue-50 p-3 rounded-lg">
                    <WifiOff className="w-5 h-5 mt-0.5 flex-shrink-0" />
                    <div className="text-sm">
                      <p>Need offline access? Install NeuroPocket on your device to use it without internet. See options below.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Native Apps */}
            <div>
              <h3 className="text-xl font-semibold mb-4 text-gray-800">Native Apps for Better Performance</h3>
              <div className="grid md:grid-cols-2 gap-6">
                {/* Windows */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Monitor className="w-6 h-6 text-blue-600" />
                    <h4 className="text-lg font-semibold">Windows App</h4>
                  </div>
                  <p className="text-gray-600 mb-4">
                    Enhanced desktop experience with better performance
                  </p>
                  <a 
                    href="https://github.com/ousecTic/neuropocket/releases/download/v1.2.1/Neuropocket.Setup.exe" 
                    className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                  >
                    <Download size={16} />
                    Download for Windows
                  </a>
                </div>

                {/* Android */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Smartphone className="w-6 h-6 text-blue-600" />
                    <h4 className="text-lg font-semibold">Android App</h4>
                  </div>
                  <p className="text-gray-600 mb-4">
                    Full-featured mobile experience with better storage
                  </p>
                  <a 
                    href="https://github.com/ousecTic/neuropocket/releases/download/v1.2.1/neuropocket.apk" 
                    className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                  >
                    <Download size={16} />
                    Download APK
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Advanced Installation Options */}
          <div className="bg-white rounded-lg shadow-sm p-8">
            <h2 className="text-2xl font-bold mb-6">Advanced Installation Options</h2>
            
            <div className="space-y-6">
              {/* PWA Installation */}
              <div>
                <h3 className="text-xl font-semibold mb-4">Install as an App (PWA)</h3>
                <div className="mt-12">
                  <div className="flex items-center gap-3 mb-4">
                    <Download className="w-5 h-5 text-blue-600" />
                    <h4 className="text-lg font-semibold">Install on Your Device</h4>
                  </div>
                  <p className="text-gray-600 mb-4">
                    After opening the web app, you can install it on your device to use it without internet and get quick access from your home screen:
                  </p>
                </div>
                
                <div className="grid md:grid-cols-3 gap-6">
                  {/* Chrome/Android */}
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h4 className="font-semibold mb-3">Chrome/Android</h4>
                    <ol className="space-y-2 text-sm">
                      <li className="text-gray-600">1. Open in Chrome</li>
                      <li className="text-gray-600">2. Tap menu (⋮)</li>
                      <li className="text-gray-600">3. "Install App"</li>
                    </ol>
                  </div>

                  {/* Safari iOS */}
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h4 className="font-semibold mb-3">Safari (iOS/iPadOS)</h4>
                    <ol className="space-y-2 text-sm">
                      <li className="text-gray-600">1. Open in Safari</li>
                      <li className="text-gray-600">2. Tap Share</li>
                      <li className="text-gray-600">3. "Add to Home Screen"</li>
                    </ol>
                    <div className="mt-3">
                      <div className="flex items-start gap-2 text-amber-600 bg-amber-50 p-2 rounded text-sm">
                        <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        <span>Limited functionality on iOS/iPadOS</span>
                      </div>
                    </div>
                  </div>

                  {/* Desktop Chrome */}
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h4 className="font-semibold mb-3">Desktop Chrome</h4>
                    <ol className="space-y-2 text-sm">
                      <li className="text-gray-600">1. Open in Chrome</li>
                      <li className="text-gray-600">2. Click install icon in address bar</li>
                      <li className="text-gray-600">3. "Install"</li>
                    </ol>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Storage and Offline Support */}
          <div className="bg-white rounded-lg shadow-sm p-8">
            <h2 className="text-2xl font-bold mb-6">Storage & Offline Support</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <div className="flex items-start gap-3">
                  <Database className="w-6 h-6 text-blue-600 mt-1" />
                  <div>
                    <h3 className="font-semibold mb-2">Storage Behavior</h3>
                    <ul className="space-y-3">
                      <li className="flex items-start gap-2 text-gray-600">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-2" />
                        <span><strong>Native Apps:</strong> Best storage persistence</span>
                      </li>
                      <li className="flex items-start gap-2 text-gray-600">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-2" />
                        <span><strong>Web/PWA:</strong> Storage may be cleared by browser</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <div>
                <div className="flex items-start gap-3">
                  <WifiOff className="w-6 h-6 text-blue-600 mt-1" />
                  <div>
                    <h3 className="font-semibold mb-2">Offline Support</h3>
                    <ul className="space-y-3">
                      <li className="flex items-start gap-2 text-gray-600">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-2" />
                        <span>All versions work offline after first load</span>
                      </li>
                      <li className="flex items-start gap-2 text-gray-600">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-2" />
                        <span>Native apps provide the most reliable offline experience</span>
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