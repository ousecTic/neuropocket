import { Monitor, Download, Database, WifiOff, Smartphone, AlertTriangle, ArrowLeft, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Support() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--bg-color)' }}>
      <div className="mx-auto px-6 md:px-12 lg:px-16 py-12" style={{ maxWidth: 'var(--container-width)' }}>
        <div className="mb-8">
          <Link 
            to="/"
            className="inline-flex items-center gap-2"
            style={{ color: 'var(--primary-color)', textDecoration: 'none' }}
          >
            <ArrowLeft size={20} />
            Back to Home
          </Link>
        </div>
        
        <div className="space-y-8">
          {/* Quick Start */}
          <div className="bg-white rounded-lg shadow-sm p-8">
            <h2 className="text-2xl font-bold mb-6" style={{ color: 'var(--text-color)', fontWeight: '600' }}>Get Started with NeuroPocket</h2>
            
            {/* Web Version */}
            <div className="mb-8">
              <div className="rounded-lg p-6 mb-6" style={{ backgroundColor: '#EFF6FF' }}>
                <div className="flex items-center gap-3 mb-6">
                  <Globe className="w-5 h-5" style={{ color: 'var(--primary-color)' }} />
                  <h4 className="text-lg font-semibold" style={{ color: 'var(--text-color)', fontWeight: '600' }}>Web App</h4>
                </div>
                <div className="space-y-4">
                  <a 
                    href="https://neuropocket.netlify.app"
                    className="inline-flex items-center gap-2 text-white px-4 py-2"
                    style={{ backgroundColor: 'var(--primary-color)', borderRadius: '6px', textDecoration: 'none' }}
                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--primary-dark)'}
                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'var(--primary-color)'}
                  >
                    <Globe className="w-5 h-5" />
                    Open NeuroPocket
                  </a>
                  <div className="flex items-start gap-2 p-3 rounded-lg" style={{ color: '#1e40af', backgroundColor: '#EFF6FF' }}>
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
              <h3 className="text-xl font-semibold mb-4" style={{ color: 'var(--text-color)', fontWeight: '600' }}>Native Apps for Better Performance</h3>
              <div className="grid md:grid-cols-2 gap-6">
                {/* Windows */}
                <div className="rounded-lg p-6" style={{ backgroundColor: 'var(--bg-color)' }}>
                  <div className="flex items-center gap-3 mb-4">
                    <Monitor className="w-6 h-6" style={{ color: 'var(--primary-color)' }} />
                    <h4 className="text-lg font-semibold" style={{ color: 'var(--text-color)', fontWeight: '600' }}>Windows App</h4>
                  </div>
                  <p className="mb-4" style={{ color: 'var(--subtext-color)' }}>
                    Enhanced desktop experience with better performance
                  </p>
                  <a 
                    href="https://github.com/ousecTic/neuropocket/releases/download/v1.2.1/Neuropocket.exe" 
                    className="inline-flex items-center gap-2 text-white px-4 py-2"
                    style={{ backgroundColor: 'var(--primary-color)', borderRadius: '6px', textDecoration: 'none' }}
                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--primary-dark)'}
                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'var(--primary-color)'}
                  >
                    <Download size={16} />
                    Download for Windows
                  </a>
                </div>

                {/* Android */}
                <div className="rounded-lg p-6" style={{ backgroundColor: 'var(--bg-color)' }}>
                  <div className="flex items-center gap-3 mb-4">
                    <Smartphone className="w-6 h-6" style={{ color: 'var(--primary-color)' }} />
                    <h4 className="text-lg font-semibold" style={{ color: 'var(--text-color)', fontWeight: '600' }}>Android App</h4>
                  </div>
                  <p className="mb-4" style={{ color: 'var(--subtext-color)' }}>
                    Full-featured mobile experience with better storage
                  </p>
                  <a 
                    href="https://github.com/ousecTic/neuropocket/releases/download/v1.2.1/neuropocket.apk" 
                    className="inline-flex items-center gap-2 text-white px-4 py-2"
                    style={{ backgroundColor: 'var(--primary-color)', borderRadius: '6px', textDecoration: 'none' }}
                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--primary-dark)'}
                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'var(--primary-color)'}
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
            <h2 className="text-2xl font-bold mb-6" style={{ color: 'var(--text-color)', fontWeight: '600' }}>Advanced Installation Options</h2>
            
            <div className="space-y-6">
              {/* PWA Installation */}
              <div>
                <h3 className="text-xl font-semibold mb-4" style={{ color: 'var(--text-color)', fontWeight: '600' }}>Install as an App (PWA)</h3>
                <div className="mt-12">
                  <div className="flex items-center gap-3 mb-4">
                    <Download className="w-5 h-5" style={{ color: 'var(--primary-color)' }} />
                    <h4 className="text-lg font-semibold" style={{ color: 'var(--text-color)', fontWeight: '600' }}>Install on Your Device</h4>
                  </div>
                  <p className="mb-4" style={{ color: 'var(--subtext-color)' }}>
                    After opening the web app, you can install it on your device to use it without internet and get quick access from your home screen:
                  </p>
                </div>
                
                <div className="grid md:grid-cols-3 gap-6">
                  {/* Chrome/Android */}
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h4 className="font-semibold mb-3" style={{ color: 'var(--text-color)', fontWeight: '600' }}>Chrome/Android</h4>
                    <ol className="space-y-2 text-sm">
                      <li style={{ color: 'var(--subtext-color)' }}>1. Open in Chrome</li>
                      <li style={{ color: 'var(--subtext-color)' }}>2. Tap menu (⋮)</li>
                      <li style={{ color: 'var(--subtext-color)' }}>3. "Install App"</li>
                    </ol>
                  </div>

                  {/* Safari iOS */}
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h4 className="font-semibold mb-3" style={{ color: 'var(--text-color)', fontWeight: '600' }}>Safari (iOS/iPadOS)</h4>
                    <ol className="space-y-2 text-sm">
                      <li style={{ color: 'var(--subtext-color)' }}>1. Open in Safari</li>
                      <li style={{ color: 'var(--subtext-color)' }}>2. Tap Share</li>
                      <li style={{ color: 'var(--subtext-color)' }}>3. "Add to Home Screen"</li>
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
                    <h4 className="font-semibold mb-3" style={{ color: 'var(--text-color)', fontWeight: '600' }}>Desktop Chrome</h4>
                    <ol className="space-y-2 text-sm">
                      <li style={{ color: 'var(--subtext-color)' }}>1. Open in Chrome</li>
                      <li style={{ color: 'var(--subtext-color)' }}>2. Click install icon in address bar</li>
                      <li style={{ color: 'var(--subtext-color)' }}>3. "Install"</li>
                    </ol>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Storage and Offline Support */}
          <div className="bg-white rounded-lg shadow-sm p-8">
            <h2 className="text-2xl font-bold mb-6" style={{ color: 'var(--text-color)', fontWeight: '600' }}>Storage & Offline Support</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <div className="flex items-start gap-3">
                  <Database className="w-6 h-6 mt-1" style={{ color: 'var(--primary-color)' }} />
                  <div>
                    <h3 className="font-semibold mb-2" style={{ color: 'var(--text-color)', fontWeight: '600' }}>Storage Behavior</h3>
                    <ul className="space-y-3">
                      <li className="flex items-start gap-2" style={{ color: 'var(--subtext-color)' }}>
                        <div className="w-1.5 h-1.5 rounded-full mt-2" style={{ backgroundColor: 'var(--primary-color)' }} />
                        <span><strong>Native Apps:</strong> Best storage persistence</span>
                      </li>
                      <li className="flex items-start gap-2" style={{ color: 'var(--subtext-color)' }}>
                        <div className="w-1.5 h-1.5 rounded-full mt-2" style={{ backgroundColor: 'var(--primary-color)' }} />
                        <span><strong>Web/PWA:</strong> Storage may be cleared by browser</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <div>
                <div className="flex items-start gap-3">
                  <WifiOff className="w-6 h-6 mt-1" style={{ color: 'var(--primary-color)' }} />
                  <div>
                    <h3 className="font-semibold mb-2" style={{ color: 'var(--text-color)', fontWeight: '600' }}>Offline Support</h3>
                    <ul className="space-y-3">
                      <li className="flex items-start gap-2" style={{ color: 'var(--subtext-color)' }}>
                        <div className="w-1.5 h-1.5 rounded-full mt-2" style={{ backgroundColor: 'var(--primary-color)' }} />
                        <span>All versions work offline after first load</span>
                      </li>
                      <li className="flex items-start gap-2" style={{ color: 'var(--subtext-color)' }}>
                        <div className="w-1.5 h-1.5 rounded-full mt-2" style={{ backgroundColor: 'var(--primary-color)' }} />
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