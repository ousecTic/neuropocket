import { Hero } from '../components/Hero';
import { Footer } from '../components/Footer';

// Organizations that translated NeuroPocket.
const TRANSLATION_PARTNERS = [
  {
    name: 'Darakht-e Danesh Academi',
    org: 'a program of Right to Learn Afghanistan',
    languages: 'Dari · Pashto',
    url: 'https://darakhtdanesh.org',
    logo: '/partners/darakht-e-danesh.svg',
  },
];

// Individual translators. Only list people who opted in, using the name they chose.
const TRANSLATION_CONTRIBUTORS: { name: string; languages: string }[] = [];

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

      {/* Languages Section */}
      <div className="py-24" style={{ backgroundColor: '#EFF6FF' }}>
        <div className="mx-auto px-6 md:px-12 lg:px-16 text-center" style={{ maxWidth: 'var(--container-width)' }}>
          <h2 className="text-3xl font-bold mb-4" style={{ color: 'var(--text-color)', fontWeight: '600' }}>
            Now Available in Your Language
          </h2>
          <p className="mb-12 text-lg mx-auto" style={{ color: 'var(--subtext-color)', maxWidth: '640px' }}>
            NeuroPocket now speaks 10 languages, with right-to-left support for Arabic, Dari, Pashto and Urdu. Pick your language right inside the app — your choice is remembered, and it all works offline.
            {' '}Dari and Pashto translations by{' '}
            <a href="#translation-partners" className="hover:underline" style={{ color: 'var(--primary-color)', textDecoration: 'none' }}>
              Darakht-e Danesh Academi
            </a>
            .
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {[
              'English',
              'Español',
              'Français',
              'Português',
              'العربية',
              'हिन्दी',
              'Kiswahili',
              'دری',
              'پښتو',
              'اردو',
            ].map((lang) => (
              <span
                key={lang}
                className="px-5 py-2 text-base font-medium bg-white"
                style={{
                  border: '1px solid var(--border-color)',
                  borderRadius: '9999px',
                  color: 'var(--text-color)',
                }}
              >
                {lang}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Translation Partners Section */}
      <div id="translation-partners" className="py-24" style={{ backgroundColor: 'white' }}>
        <div className="mx-auto px-6 md:px-12 lg:px-16 text-center" style={{ maxWidth: 'var(--container-width)' }}>
          <h2 className="text-3xl font-bold mb-4" style={{ color: 'var(--text-color)', fontWeight: '600' }}>
            Translation Partners
          </h2>
          <p className="mb-12 text-lg mx-auto" style={{ color: 'var(--subtext-color)', maxWidth: '640px' }}>
            NeuroPocket is translated by people and organizations who want AI learning available in every language. Thank you.
          </p>
          <div className="flex flex-wrap justify-center gap-6">
            {TRANSLATION_PARTNERS.map((partner) => (
              <a
                key={partner.name}
                href={partner.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center gap-3 px-8 py-6 bg-white rounded-lg hover:shadow-md transition-shadow"
                style={{ border: '1px solid var(--border-color)', textDecoration: 'none', maxWidth: '320px' }}
              >
                <img src={partner.logo} alt={partner.name} className="h-12 w-auto" />
                <div>
                  <p className="font-semibold" style={{ color: 'var(--text-color)' }}>{partner.name}</p>
                  <p className="text-sm" style={{ color: 'var(--subtext-color)' }}>{partner.org}</p>
                  <p className="text-sm mt-1" style={{ color: 'var(--primary-color)' }}>{partner.languages}</p>
                </div>
              </a>
            ))}
          </div>
          {TRANSLATION_CONTRIBUTORS.length > 0 && (
            <div className="mt-12">
              <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-color)' }}>Contributors</h3>
              <ul className="flex flex-wrap justify-center gap-x-6 gap-y-2" style={{ color: 'var(--subtext-color)' }}>
                {TRANSLATION_CONTRIBUTORS.map((person) => (
                  <li key={person.name}>
                    {person.name} <span className="text-sm">({person.languages})</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}