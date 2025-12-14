import { Footer } from '../components/Footer';
import { Link } from 'react-router-dom';

export function Privacy() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--bg-color-white)' }}>
      {/* Header */}
      <div className="bg-white border-b" style={{ borderColor: 'var(--border-color)' }}>
        <div className="mx-auto px-6 md:px-12 lg:px-16 py-6" style={{ maxWidth: 'var(--container-width)' }}>
          <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity" style={{ textDecoration: 'none' }}>
            <img src="/neuropocket-logo.png" alt="NeuroPocket Logo" style={{ height: '32px', width: 'auto' }} />
            <span className="text-xl font-bold" style={{ color: 'var(--text-color)' }}>NeuroPocket</span>
          </Link>
        </div>
      </div>

      {/* Content */}
      <div className="py-16 md:py-24">
        <div className="mx-auto px-6 md:px-12 lg:px-16" style={{ maxWidth: '800px' }}>
          <h1 className="text-4xl font-bold mb-8" style={{ color: 'var(--text-color)' }}>
            Privacy & Safety
          </h1>

          <div className="space-y-8" style={{ color: 'var(--subtext-color)', lineHeight: '1.7' }}>
            {/* Main Privacy Statement */}
            <section>
              <h2 className="text-2xl font-semibold mb-4" style={{ color: 'var(--text-color)' }}>
                Your data never leaves your device
              </h2>
              <p className="mb-4">
                Whether you use the online or offline app, your photos and AI models stay on your device. 
                We never see them, store them, or have any access to them.
              </p>
              <p>
                When you upload an image or train a model, everything happens locally in your browser or app. 
                Nothing is sent to our servers because there are no servers.
              </p>
            </section>

            {/* For Educators */}
            <section>
              <h2 className="text-2xl font-semibold mb-4" style={{ color: 'var(--text-color)' }}>
                Safe for classroom use
              </h2>
              <p className="mb-4">
                NeuroPocket is designed for educational environments. Since all data stays on the device, 
                there's no risk of student data being collected, shared, or stored on external servers.
              </p>
              
              <div className="space-y-4">
                <div>
                  <p className="font-medium mb-1" style={{ color: 'var(--text-color)' }}>
                    No accounts or personal information required
                  </p>
                  <p>
                    Students can start using NeuroPocket immediately without creating accounts, 
                    providing email addresses, or sharing any personal information.
                  </p>
                </div>

                <div>
                  <p className="font-medium mb-1" style={{ color: 'var(--text-color)' }}>
                    Complete control over data
                  </p>
                  <p>
                    Students and teachers can delete any image or project at any time. 
                    Deletion is permanent and happens only on their device.
                  </p>
                </div>
              </div>
            </section>

            {/* Best Practices */}
            <section>
              <h2 className="text-2xl font-semibold mb-4" style={{ color: 'var(--text-color)' }}>
                Best practices
              </h2>
              <p className="mb-4">
                While NeuroPocket is private by design, we recommend these practices for classroom use:
              </p>
              <ul className="space-y-2 ml-6" style={{ listStyleType: 'disc' }}>
                <li>Use images of objects, animals, or drawings rather than photos of people</li>
                <li>Remind students that while their data is private, they should still use appropriate images</li>
                <li>Each device stores its own data. Projects aren't shared between devices</li>
              </ul>
            </section>

            {/* Technical Details */}
            <section>
              <h2 className="text-2xl font-semibold mb-4" style={{ color: 'var(--text-color)' }}>
                Technical details
              </h2>
              <p className="mb-4">
                NeuroPocket uses your browser's IndexedDB to store images and models locally. 
                All machine learning happens in your browser using TensorFlow.js. No data is ever 
                transmitted to external servers.
              </p>
              <p>
                The app is open source. You can review the code on{' '}
                <a 
                  href="https://github.com/ousecTic/neuropocket" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="underline hover:no-underline"
                  style={{ color: 'var(--primary-color)' }}
                >
                  GitHub
                </a>{' '}
                to verify that no data collection occurs.
              </p>
            </section>

            {/* Contact */}
            <section className="pt-8 border-t" style={{ borderColor: 'var(--border-color)' }}>
              <p>
                Questions about privacy or safety?{' '}
                <a 
                  href="https://github.com/ousecTic/neuropocket/issues" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="underline hover:no-underline"
                  style={{ color: 'var(--primary-color)' }}
                >
                  Open an issue on GitHub
                </a>
              </p>
            </section>
          </div>

          {/* Back to Home */}
          <div className="mt-12 pt-8 border-t" style={{ borderColor: 'var(--border-color)' }}>
            <Link 
              to="/" 
              className="inline-flex items-center gap-2 hover:opacity-80 transition-opacity"
              style={{ color: 'var(--primary-color)', textDecoration: 'none' }}
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
