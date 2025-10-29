import { Hero } from '../components/Hero';
import { Footer } from '../components/Footer';

export function Home() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--bg-color-white)' }}>
      {/* Hero Section */}
      <Hero />

      {/* How It Works Section */}
      <div className="py-24" style={{ backgroundColor: 'white' }}>
        <div className="mx-auto px-6 md:px-12 lg:px-16" style={{ maxWidth: 'var(--container-width)' }}>
          <h2 className="text-3xl font-bold text-center mb-16" style={{ color: 'var(--text-color)', fontWeight: '600' }}>How It Works</h2>
          <div className="space-y-12">
            {/* Step 1 */}
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="text-white w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg" style={{ backgroundColor: 'var(--primary-color)' }}>1</div>
                  <h3 className="text-2xl font-semibold" style={{ color: 'var(--text-color)', fontWeight: '600' }}>Add Data</h3>
                </div>
                <p className="ml-11" style={{ color: 'var(--subtext-color)' }}>Upload images and organize them into groups for each category you want the AI to recognize.</p>
              </div>
              <div className="bg-white rounded-lg shadow-lg overflow-hidden" style={{ maxWidth: '600px', marginLeft: 'auto', marginRight: 'auto' }}>
                <img 
                  src="/step-3-add-image.png" 
                  alt="Step 1: Add Data" 
                  className="w-full h-auto"
                />
              </div>
            </div>

            {/* Step 2 */}
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="bg-white rounded-lg shadow-lg overflow-hidden lg:order-1" style={{ maxWidth: '600px', marginLeft: 'auto', marginRight: 'auto' }}>
                <img 
                  src="/step-4-train-model.png" 
                  alt="Step 2: Train Model" 
                  className="w-full h-auto"
                />
              </div>
              <div className="space-y-4 lg:order-2">
                <div className="flex items-center gap-3">
                  <div className="text-white w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg" style={{ backgroundColor: 'var(--primary-color)' }}>2</div>
                  <h3 className="text-2xl font-semibold" style={{ color: 'var(--text-color)', fontWeight: '600' }}>Train Model</h3>
                </div>
                <p className="ml-11" style={{ color: 'var(--subtext-color)' }}>Click "Train Model" and let the AI analyze patterns from your images.</p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="text-white w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg" style={{ backgroundColor: 'var(--primary-color)' }}>3</div>
                  <h3 className="text-2xl font-semibold" style={{ color: 'var(--text-color)', fontWeight: '600' }}>Test Model</h3>
                </div>
                <p className="ml-11" style={{ color: 'var(--subtext-color)' }}>Test your trained model with new images and see how well it recognizes what you taught it.</p>
              </div>
              <div className="bg-white rounded-lg shadow-lg overflow-hidden" style={{ maxWidth: '600px', marginLeft: 'auto', marginRight: 'auto' }}>
                <img 
                  src="/step-5-test-model.png" 
                  alt="Step 3: Test Model" 
                  className="w-full h-auto"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}