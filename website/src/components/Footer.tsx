
export function Footer() {
  return (
    <div className="border-t border-gray-200 bg-white">
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="flex flex-col items-center gap-2">
          <p className="text-center text-gray-600">
            Made with ❤️ by{' '}
            <a 
              href="https://www.quacklearner.org" 
              className="text-blue-600 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Quacklearner
            </a>
          </p>
          <p className="text-sm text-gray-500">
            Inspired by{' '}
            <a 
              href="https://teachablemachine.withgoogle.com/"
              className="text-blue-600 hover:underline"
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