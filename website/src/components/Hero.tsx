import { Link } from 'react-router-dom';
import { Brain, Phone, Monitor, WifiOff, Cloud, ArrowRight } from 'lucide-react';

export function Hero() {
  return (
    <div className="bg-white">
      <div className="max-w-6xl mx-auto px-6 md:px-12 lg:px-16 py-24">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <div className="flex items-center gap-3">
              <Brain size={48} className="text-blue-600" />
              <h1 className="text-4xl font-bold text-gray-900">NeuroPocket</h1>
            </div>
            <p className="text-2xl text-gray-600">
              Learn how AI works by teaching it to recognize images - works on mobile, desktop, and offline.
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2 text-gray-600">
                <Phone size={20} className="text-blue-600" />
                <span>Works on Mobile</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Monitor size={20} className="text-blue-600" />
                <span>Works on Desktop</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <WifiOff size={20} className="text-blue-600" />
                <span>Works Offline</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Cloud size={20} className="text-blue-600" />
                <span>Keeps Data Private</span>
              </div>
            </div>
            <div className="flex flex-wrap gap-4">
              <a
                href="https://neuropocket.netlify.app"
                className="inline-flex items-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Get Started
                <Brain size={24} />
              </a>
              <Link
                to="/install"
                className="inline-flex items-center gap-2 bg-white border-2 border-gray-200 px-8 py-4 rounded-lg text-lg font-medium hover:bg-gray-50 transition-colors"
              >
                Install App
                <ArrowRight size={24} />
              </Link>
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
              {' '}— part of our offline-first AI curriculum
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}