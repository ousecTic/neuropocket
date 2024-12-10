import React, { useState } from 'react';
import { Brain, Image, Play, Laptop, Phone, Monitor, Download, Database, RefreshCw, ChevronDown, ChevronUp, WifiOff, Cloud } from 'lucide-react';
import { Link } from 'react-router-dom';

interface AccordionProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

function Accordion({ title, children, defaultOpen = false }: AccordionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="bg-white shadow-sm rounded-lg overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-8 py-6 flex items-center justify-between bg-white hover:bg-gray-50 transition-colors"
      >
        <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
        {isOpen ? (
          <ChevronUp className="w-6 h-6 text-gray-600" />
        ) : (
          <ChevronDown className="w-6 h-6 text-gray-600" />
        )}
      </button>
      {isOpen && <div className="px-8 pb-8">{children}</div>}
    </div>
  );
}

export function HowItWorksPage() {
  const features = [
    {
      icon: <Phone className="w-8 h-8 text-blue-600" />,
      title: "Progressive Web App",
      description: "Install and use like a native app on any device - mobile, tablet, or desktop"
    },
    {
      icon: <WifiOff className="w-8 h-8 text-blue-600" />,
      title: "Works Offline",
      description: "Train and use your models without an internet connection"
    },
    {
      icon: <Cloud className="w-8 h-8 text-blue-600" />,
      title: "No Server Required",
      description: "Everything runs locally in your browser - your data stays on your device"
    },
    {
      icon: <Brain className="w-8 h-8 text-blue-600" />,
      title: "Machine Learning",
      description: "Uses TensorFlow.js for fast, efficient image classification"
    }
  ];

  const steps = [
    {
      icon: <Brain className="w-8 h-8 text-blue-600" />,
      title: "Create a Project",
      description: "Start by creating a new project for your image classification task. Each project can have multiple classes you want to identify."
    },
    {
      icon: <Image className="w-8 h-8 text-blue-600" />,
      title: "Add Training Data",
      description: "Upload images for each class you want to recognize. The more diverse images you add, the better your model will perform. Add at least 5 images per class."
    },
    {
      icon: <Laptop className="w-8 h-8 text-blue-600" />,
      title: "Train Your Model",
      description: "Train your custom model directly in your browser using transfer learning. The model runs entirely on your device - no data is sent to any server."
    },
    {
      icon: <Play className="w-8 h-8 text-blue-600" />,
      title: "Test and Use",
      description: "Test your trained model by uploading new images to see how well it recognizes your classes. The model works offline and can be used anytime."
    }
  ];

  const installInstructions = [
    {
      icon: <Phone className="w-8 h-8 text-blue-600" />,
      title: "Android Installation",
      steps: [
        "Open the website in Chrome",
        "Tap the menu button (three dots)",
        "Select 'Add to Home screen'",
        "Confirm by tapping 'Add'"
      ]
    },
    {
      icon: <Phone className="w-8 h-8 text-blue-600" />,
      title: "iOS Installation",
      steps: [
        "Open the website in Safari",
        "Tap the Share button",
        "Scroll down and tap 'Add to Home Screen'",
        "Tap 'Add' to confirm"
      ]
    },
    {
      icon: <Monitor className="w-8 h-8 text-blue-600" />,
      title: "Desktop Installation",
      steps: [
        "Open the website in Chrome",
        "Click the install icon in the address bar",
        "Click 'Install' in the prompt",
        "The app will open in its own window"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <Link 
            to="/"
            className="text-blue-600 hover:text-blue-800 inline-flex items-center gap-2"
          >
            ← Back to Projects
          </Link>
        </div>

        <div className="space-y-4">
          {/* Key Features */}
          <Accordion title="Key Features" defaultOpen={true}>
            <div className="text-center mb-8">
              <p className="mt-2 text-gray-600 text-lg">
                A powerful machine learning tool that works entirely in your browser
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <div key={index} className="relative">
                  <div className="flex flex-col items-center text-center">
                    <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center mb-4">
                      {feature.icon}
                    </div>
                    <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </div>
                  
                  {index < features.length - 1 && (
                    <div className="hidden lg:block absolute top-8 left-full w-full">
                      <div className="w-full border-t-2 border-dashed border-gray-200" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Accordion>

          {/* Basic Instructions */}
          <Accordion title="Getting Started">
            <div className="text-center mb-8">
              <p className="mt-2 text-gray-600 text-lg">
                Learn how to use Teachable Machine in four simple steps
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {steps.map((step, index) => (
                <div key={index} className="relative">
                  <div className="flex flex-col items-center text-center">
                    <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center mb-4">
                      {step.icon}
                    </div>
                    <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
                    <p className="text-gray-600">{step.description}</p>
                  </div>
                  
                  {index < steps.length - 1 && (
                    <div className="hidden lg:block absolute top-8 left-full w-full">
                      <div className="w-full border-t-2 border-dashed border-gray-200" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Accordion>

          {/* Installation Guide */}
          <Accordion title="Installation Guide">
            <div className="space-y-6">
              <div className="bg-blue-50 rounded-lg p-6 mb-6">
                <h3 className="text-lg font-semibold mb-2">Why Install as an App?</h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-2" />
                    <span>Access the app directly from your home screen</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-2" />
                    <span>Work offline without needing an internet connection</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-2" />
                    <span>Full-screen experience without browser interface</span>
                  </li>
                </ul>
              </div>

              <div className="grid md:grid-cols-3 gap-8">
                {installInstructions.map((platform, index) => (
                  <div key={index} className="bg-white rounded-lg p-6 shadow-sm">
                    <div className="flex items-center gap-3 mb-4">
                      {platform.icon}
                      <h3 className="text-lg font-semibold">{platform.title}</h3>
                    </div>
                    <ol className="space-y-2">
                      {platform.steps.map((step, stepIndex) => (
                        <li key={stepIndex} className="flex gap-2 text-gray-600">
                          <span className="text-blue-600 font-medium">{stepIndex + 1}.</span>
                          {step}
                        </li>
                      ))}
                    </ol>
                  </div>
                ))}
              </div>
            </div>
          </Accordion>

          {/* Offline Functionality */}
          <Accordion title="Offline Functionality">
            <div className="space-y-6">
              <div className="bg-blue-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4">How Offline Mode Works</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Download className="w-5 h-5 text-blue-600 mt-1" />
                    <div>
                      <p className="font-medium">Initial Setup</p>
                      <p className="text-gray-600">On your first visit, the app downloads and caches:</p>
                      <ul className="mt-2 ml-5 list-disc text-gray-600">
                        <li>Application files and resources</li>
                        <li>TensorFlow.js model for machine learning</li>
                        <li>Required scripts and styles</li>
                      </ul>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Database className="w-5 h-5 text-blue-600 mt-1" />
                    <div>
                      <p className="font-medium">Your Data</p>
                      <p className="text-gray-600">All your work is stored locally:</p>
                      <ul className="mt-2 ml-5 list-disc text-gray-600">
                        <li>Projects and images in IndexedDB</li>
                        <li>Trained models in browser storage</li>
                        <li>App settings in LocalStorage</li>
                      </ul>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <RefreshCw className="w-5 h-5 text-blue-600 mt-1" />
                    <div>
                      <p className="font-medium">Clearing Data</p>
                      <p className="text-gray-600">If you clear browser data:</p>
                      <ul className="mt-2 ml-5 list-disc text-gray-600">
                        <li>The app will automatically re-download required resources when you next go online</li>
                        <li>Your projects and models will be removed</li>
                        <li>Consider backing up important projects before clearing data</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Accordion>
        </div>
      </div>
    </div>
  );
}