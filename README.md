# NeuroPocket: Offline Image Classification PWA

NeuroPocket is a Progressive Web Application (PWA) that enables offline image classification using machine learning. Built with React, TypeScript, and TensorFlow.js, it allows users to create and train custom image classification models directly in their browser, with full offline functionality.

## 🌟 Features

- **Fully Offline Capable**: Train and use models without an internet connection
- **Cross-Platform Support**: 
  - Native Android app
  - PWA support for iOS and desktop
  - Web browser access
- **Custom Model Training**: Create and train your own image classification models
- **Real-Time Classification**: Instant predictions using device camera or uploaded images
- **Persistent Storage**: Save models and data locally
- **Responsive Design**: Works seamlessly across all device sizes

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Android Studio (for native Android development)

### Installation

1. Clone the repository:
```bash
git clone [your-repository-url]
cd offline-bolt-teachable-machine
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

### Building for Production

#### Web/PWA Build
```bash
npm run build
```

#### Android Build
```bash
npm run build
npx cap sync android
npx cap open android
```

## 🛠️ Technology Stack

- **Frontend Framework**: React with TypeScript
- **Styling**: TailwindCSS
- **ML Framework**: TensorFlow.js
- **Mobile Framework**: Capacitor
- **Build Tool**: Vite
- **State Management**: React Context API
- **Storage**: IndexedDB/LocalStorage

## 📱 Platform Support

### Android
- Native app available through APK
- Full offline functionality
- Persistent storage

### iOS/iPadOS
- Install as PWA through Safari
- Note: Subject to Safari's storage limitations

### Desktop
- Install as PWA through Chrome
- Access via any modern web browser

## 🧪 Development

### Project Structure
```
src/
├── components/     # Reusable UI components
├── pages/         # Main application pages
├── hooks/         # Custom React hooks
├── utils/         # Utility functions
├── styles/        # Global styles
└── types/         # TypeScript type definitions
```

### Key Components
- `CreateProjectDialog`: Handles new project creation
- `ModelTrainer`: Manages model training process
- `ImageClassifier`: Handles real-time classification
- `StorageManager`: Manages offline data persistence

## 📝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Support

For support and questions, please open an issue in the GitHub repository.
