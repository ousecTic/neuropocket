export function Footer() {
  return (
    <div className="border-t bg-white" style={{ borderColor: 'var(--border-color)', backgroundColor: 'var(--bg-color)' }}>
      <div className="mx-auto px-6 py-8" style={{ maxWidth: 'var(--container-width)' }}>
        <div className="flex flex-col items-center gap-2">
          <p className="text-center text-sm" style={{ color: 'var(--subtext-color)' }}>
            Made with ❤️ by{' '}
            <a 
              href="https://www.learnaianywhere.org" 
              className="hover:underline"
              style={{ color: 'var(--primary-color)', textDecoration: 'none' }}
              target="_blank"
              rel="noopener noreferrer"
            >
              learnaianywhere.org
            </a>
          </p>
          <p className="text-center text-sm" style={{ color: 'var(--subtext-color)' }}>
            Contact:{' '}
            <a 
              href="mailto:contact@learnaianywhere.org"
              className="hover:underline"
              style={{ color: 'var(--primary-color)', textDecoration: 'none' }}
            >
              contact@learnaianywhere.org
            </a>
          </p>
          <p className="text-center text-sm" style={{ color: 'var(--subtext-color)' }}>
            Inspired by{' '}
            <a 
              href="https://teachablemachine.withgoogle.com/"
              className="hover:underline"
              style={{ color: 'var(--primary-color)', textDecoration: 'none' }}
              target="_blank"
              rel="noopener noreferrer"
            >
              Google's Teachable Machine
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}