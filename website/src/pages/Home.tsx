import { Brain, Phone, Monitor, Cloud } from 'lucide-react';
import { Hero } from '../components/Hero';
import { Footer } from '../components/Footer';

export function Home() {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Hero Section */}
      <Hero />

      {/* How It Works Section */}
      <div className="max-w-6xl mx-auto px-6 py-24">
        <h2 className="text-3xl font-bold text-gray-900 mb-16 text-center">How It Works</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
          {[
            {
              icon: <Brain className="w-8 h-8 text-blue-600" />,
              title: "Create a Project",
              description: "Start a new project and choose what you want your AI to learn, like telling apart cats and dogs."
            },
            {
              icon: <Phone className="w-8 h-8 text-blue-600" />,
              title: "Add Examples",
              description: "Take or upload photos for each category. The more examples you add, the better your AI will learn."
            },
            {
              icon: <Monitor className="w-8 h-8 text-blue-600" />,
              title: "Train Your AI",
              description: "Watch your AI learn from your examples. Everything happens on your device - your photos stay private."
            },
            {
              icon: <Cloud className="w-8 h-8 text-blue-600" />,
              title: "Test & Learn",
              description: "Try your AI with new photos to see how well it learned. Great for understanding how AI makes decisions."
            }
          ].map((step, index) => (
            <div key={index} className="relative">
              <div className="flex flex-col items-center text-center">
                <div className="w-20 h-20 rounded-full bg-blue-50 flex items-center justify-center mb-6">
                  {step.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                <p className="text-gray-600 leading-relaxed">{step.description}</p>
              </div>
              {index < 3 && (
                <div className="hidden lg:block absolute top-10 left-full w-full">
                  <div className="w-full border-t-2 border-dashed border-gray-200" />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="mt-24 text-center">
          <a
            href="https://neuropocket.com"
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