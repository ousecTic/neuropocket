import { Brain, WifiOff, Database, Monitor } from 'lucide-react';
import { Hero } from '../components/Hero';
import { Footer } from '../components/Footer';

export function Home() {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Hero Section */}
      <Hero />

      {/* How It Works Section */}
      <div className="py-24 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6 md:px-12 lg:px-16">
          <h2 className="text-3xl font-bold text-center mb-16">How It Works</h2>
          <div className="space-y-16">
            {/* Step 1 */}
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold">1</div>
                  <h3 className="text-2xl font-semibold">Create a Project</h3>
                </div>
                <p className="text-gray-600 ml-11">Start by creating a new project and giving it a name.</p>
              </div>
              <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <img 
                  src="/step-1-create-project.png" 
                  alt="Step 1: Create a Project" 
                  className="w-full h-auto"
                />
              </div>
            </div>

            {/* Step 2 */}
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="bg-white rounded-lg shadow-lg overflow-hidden lg:order-1">
                <img 
                  src="/step-2-create-group.png" 
                  alt="Step 2: Define your Group" 
                  className="w-full h-auto"
                />
              </div>
              <div className="space-y-4 lg:order-2">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold">2</div>
                  <h3 className="text-2xl font-semibold">Define your Group</h3>
                </div>
                <p className="text-gray-600 ml-11">Create groups for each category you want the AI to recognize (e.g., "Plastic Cup", "Glass Cup").</p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold">3</div>
                  <h3 className="text-2xl font-semibold">Add Data to your Groups</h3>
                </div>
                <p className="text-gray-600 ml-11">Take photos for each group from different angles and upload them.</p>
              </div>
              <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <img 
                  src="/step-3-add-image.png" 
                  alt="Step 3: Add Data to your Groups" 
                  className="w-full h-auto"
                />
              </div>
            </div>

            {/* Step 4 */}
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="bg-white rounded-lg shadow-lg overflow-hidden lg:order-1">
                <img 
                  src="/step-4-train-model.png" 
                  alt="Step 4: Train the Model" 
                  className="w-full h-auto"
                />
              </div>
              <div className="space-y-4 lg:order-2">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold">4</div>
                  <h3 className="text-2xl font-semibold">Train the Model</h3>
                </div>
                <p className="text-gray-600 ml-11">Click "Train Model" and wait while the system analyzes patterns in your photos.</p>
              </div>
            </div>

            {/* Step 5 */}
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold">5</div>
                  <h3 className="text-2xl font-semibold">Test your Model</h3>
                </div>
                <p className="text-gray-600 ml-11">Test your trained model by uploading a new photo and see if it correctly identifies the group you created.</p>
              </div>
              <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <img 
                  src="/step-5-test-model.png" 
                  alt="Step 5: Test your Model" 
                  className="w-full h-auto"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Why Choose NeuroPocket */}
      <div className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6 md:px-12 lg:px-16">
          <h2 className="text-3xl font-bold text-center mb-16">Why Choose NeuroPocket?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center space-y-4">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
                <WifiOff className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold">Works Completely Offline</h3>
              <p className="text-gray-600">
                Unlike cloud-based tools, NeuroPocket runs entirely on your device. No internet required after installation.
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
                <Database className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold">Your Data Stays Private</h3>
              <p className="text-gray-600">
                All photos and models are stored locally on your device. Nothing is uploaded to servers or shared.
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
                <Monitor className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold">Mobile & Desktop Ready</h3>
              <p className="text-gray-600">
                Native apps for Windows, Android, and web browsers. Train AI models anywhere, anytime.
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