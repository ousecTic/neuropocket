import { Phone, Monitor, Download, Database, WifiOff, Smartphone, AlertTriangle, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Support() {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-6xl mx-auto px-6 py-12">
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
            
            {/* Android Section */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold mb-4 text-gray-800">Android</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-gray-50 rounded-lg p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Smartphone className="w-6 h-6 text-blue-600" />
                    <h4 className="text-lg font-semibold">Native App (Recommended)</h4>
                  </div>
                  <p className="text-gray-600 mb-4">
                    For the best experience with persistent storage:
                  </p>
                  <ol className="space-y-2 mb-4">
                    <li className="flex gap-2 text-gray-600">
                      <span className="text-blue-600 font-medium">1.</span>
                      Download the APK file
                    </li>
                    <li className="flex gap-2 text-gray-600">
                      <span className="text-blue-600 font-medium">2.</span>
                      Open the APK file
                    </li>
                    <li className="flex gap-2 text-gray-600">
                      <span className="text-blue-600 font-medium">3.</span>
                      Follow installation prompts
                    </li>
                  </ol>
                  <div>
                    <a 
                      href="#" 
                      className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                      onClick={(e) => {
                        e.preventDefault();
                        alert('APK download coming soon!');
                      }}
                    >
                      <Download size={16} />
                      Download APK
                    </a>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Phone className="w-6 h-6 text-blue-600" />
                    <h4 className="text-lg font-semibold">PWA Alternative</h4>
                  </div>
                  <p className="text-gray-600 mb-4">
                    Install as a Progressive Web App:
                  </p>
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
              </div>
            </div>

            {/* iOS Section */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold mb-4 text-gray-800">iOS / iPadOS</h3>
              <div className="bg-gray-50 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Phone className="w-6 h-6 text-blue-600" />
                  <h4 className="text-lg font-semibold">Safari Installation</h4>
                </div>
                <div className="mb-4">
                  <div className="flex items-start gap-2 text-amber-600 bg-amber-50 p-3 rounded-lg mb-4">
                    <AlertTriangle className="w-5 h-5 mt-0.5" />
                    <p className="text-sm">
                      Note: iOS Safari has storage limitations for web apps. Your data may be cleared by the browser, requiring you to reconnect to restore the app.
                    </p>
                  </div>
                </div>
                <ol className="space-y-2">
                  <li className="flex gap-2 text-gray-600">
                    <span className="text-blue-600 font-medium">1.</span>
                    Open in Safari (required)
                  </li>
                  <li className="flex gap-2 text-gray-600">
                    <span className="text-blue-600 font-medium">2.</span>
                    Tap the Share button
                  </li>
                  <li className="flex gap-2 text-gray-600">
                    <span className="text-blue-600 font-medium">3.</span>
                    Choose "Add to Home Screen"
                  </li>
                </ol>
              </div>
            </div>

            {/* Desktop Section */}
            <div>
              <h3 className="text-xl font-semibold mb-4 text-gray-800">Desktop</h3>
              <div className="bg-gray-50 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Monitor className="w-6 h-6 text-blue-600" />
                  <h4 className="text-lg font-semibold">Chrome Installation</h4>
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

          {/* Storage and Offline Support */}
          <div className="bg-white rounded-lg shadow-sm p-8">
            <h2 className="text-2xl font-bold mb-6">Storage & Offline Support</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <div className="flex items-start gap-3 mb-6">
                  <Database className="w-6 h-6 text-blue-600 mt-1" />
                  <div>
                    <h3 className="font-semibold mb-2">Storage Behavior</h3>
                    <p className="text-gray-600 mb-3">
                      Storage persistence varies by platform:
                    </p>
                    <ul className="space-y-3">
                      <li className="flex items-start gap-2 text-gray-600">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-2" />
                        <span><strong>Android App:</strong> Permanent storage, unaffected by browser clearing</span>
                      </li>
                      <li className="flex items-start gap-2 text-gray-600">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-2" />
                        <span><strong>PWA:</strong> Data persists until browser storage is cleared</span>
                      </li>
                      <li className="flex items-start gap-2 text-gray-600">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-2" />
                        <span><strong>iOS Safari:</strong> Subject to browser storage limitations</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <div>
                <div className="flex items-start gap-3">
                  <WifiOff className="w-6 h-6 text-blue-600 mt-1" />
                  <div>
                    <h3 className="font-semibold mb-2">Offline Functionality</h3>
                    <p className="text-gray-600 mb-3">
                      After initial installation:
                    </p>
                    <ul className="space-y-3">
                      <li className="flex items-start gap-2 text-gray-600">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-2" />
                        <span>Create and manage projects offline</span>
                      </li>
                      <li className="flex items-start gap-2 text-gray-600">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-2" />
                        <span>Train and use AI models without internet</span>
                      </li>
                      <li className="flex items-start gap-2 text-gray-600">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-2" />
                        <span>Internet needed only if storage is cleared</span>
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