import { Brain, Phone, Monitor, Cloud, WifiOff } from 'lucide-react';
import { Hero } from '../components/Hero';
import { Footer } from '../components/Footer';

export function Home() {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Hero Section */}
      <Hero />

      {/* How It Works Section */}
      <div className="py-24 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center space-y-4">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
                <Brain className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold">Train Your Model</h3>
              <p className="text-gray-600">
                Take or upload photos to teach the AI what to recognize. Everything happens right on your device - no data is sent to servers.
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
                <WifiOff className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold">Works Without Internet</h3>
              <p className="text-gray-600">
                Install NeuroPocket as an app on your device to use it anytime, even when you don't have internet access.
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
                <Monitor className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold">Use Anywhere</h3>
              <p className="text-gray-600">
                Available as a web app, desktop app, or mobile app. Your models are stored locally for privacy and quick access.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="py-24 bg-white">
        <div className="text-center">
          <a
            href="https://neuropocket.netlify.app"
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Start Learning
            <Brain size={24} />
          </a>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}