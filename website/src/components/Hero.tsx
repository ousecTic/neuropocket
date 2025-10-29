import { Download, ChevronDown } from 'lucide-react';
import { useState } from 'react';

export function Hero() {
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <div className="bg-white" style={{ background: 'linear-gradient(180deg, #EFF6FF 0%, #FFFFFF 100%)' }}>
      <div className="mx-auto px-6 md:px-12 lg:px-16 py-24" style={{ maxWidth: 'var(--container-width)' }}>
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <div className="flex items-center gap-3">
              <img src="/neuropocket-logo.png" alt="NeuroPocket Logo" style={{ height: '48px', width: 'auto' }} />
              <h1 className="text-4xl font-bold" style={{ color: 'var(--text-color)' }}>NeuroPocket</h1>
            </div>
            <p className="text-2xl" style={{ color: 'var(--subtext-color)', lineHeight: '1.5' }}>
              Learn AI by building your own image recognition model. Works <strong>completely offline</strong> on mobile and desktop.
            </p>
            <div className="flex flex-wrap gap-4">
              <a
                href="https://neuropocket.netlify.app"
                className="inline-flex items-center gap-2 text-white px-8 py-4 text-lg font-medium transition-colors"
                style={{ 
                  backgroundColor: 'var(--primary-color)', 
                  borderRadius: '6px',
                  textDecoration: 'none'
                }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--primary-dark)'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'var(--primary-color)'}
              >
                Try Online
              </a>
              <div className="relative">
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="inline-flex items-center gap-2 bg-white px-8 py-4 text-lg font-medium transition-colors"
                  style={{ 
                    border: '1px solid var(--border-color)',
                    borderRadius: '6px',
                    color: 'var(--text-color)',
                    cursor: 'pointer'
                  }}
                >
                  <Download size={20} />
                  Download for Offline
                  <ChevronDown size={20} />
                </button>
                {showDropdown && (
                  <div 
                    className="absolute top-full mt-2 bg-white rounded-lg shadow-lg overflow-hidden"
                    style={{ 
                      border: '1px solid var(--border-color)',
                      minWidth: '250px',
                      zIndex: 50
                    }}
                  >
                    <a
                      href="https://github.com/ousecTic/neuropocket/releases/download/v1.2.1/Neuropocket.Setup.exe"
                      className="flex items-center gap-3 px-6 py-4 hover:bg-gray-50 transition-colors"
                      style={{ 
                        textDecoration: 'none',
                        color: 'var(--text-color)',
                        borderBottom: '1px solid var(--border-color)'
                      }}
                    >
                      <Download size={20} style={{ color: 'var(--primary-color)' }} />
                      <div>
                        <div className="font-semibold">Windows Desktop App</div>
                        <div className="text-sm" style={{ color: 'var(--subtext-color)' }}>Direct download (.exe file)</div>
                      </div>
                    </a>
                    <a
                      href="https://github.com/ousecTic/neuropocket/releases/download/v1.2.1/neuropocket.apk"
                      className="flex items-center gap-3 px-6 py-4 hover:bg-gray-50 transition-colors"
                      style={{ 
                        textDecoration: 'none',
                        color: 'var(--text-color)'
                      }}
                    >
                      <Download size={20} style={{ color: 'var(--primary-color)' }} />
                      <div>
                        <div className="font-semibold">Android Mobile App</div>
                        <div className="text-sm" style={{ color: 'var(--subtext-color)' }}>Direct download (.apk file)</div>
                      </div>
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden shadow-lg">
              <img
                src="/offline-demo.png"
                alt="Students from different schools exploring NeuroPocket as part of the offline-first AI curriculum at learnaianywhere.org"
                className="w-full h-full object-cover"
              />
            </div>
            <p className="text-sm text-gray-600">
              Students exploring NeuroPocket at{' '}
              <a 
                href="https://www.learnaianywhere.org" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                learnaianywhere.org
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}