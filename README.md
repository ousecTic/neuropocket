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
git clone repo
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

## Development Setup

### Initial Setup
```bash
# Install dependencies
npm install

# Build the web app
npm run build

# Add platforms
npx cap add @capacitor-community/electron  # Add Electron support
npx cap add android                       # Add Android support (optional)
```

### Development Workflow

#### Web Development
```bash
# Start development server
npm run dev
```

#### Electron Development
```bash
# After making changes to the main web app:
npm run build                              # Build the web app
npx cap copy @capacitor-community/electron # Copy web assets to electron

# Start Electron app in development mode
cd electron
npm run electron:start-live
```

#### Android Development
```bash
# After making changes to the main web app:
npm run build    # Build the web app
npx cap sync     # Sync changes to Android

# Open in Android Studio
npx cap open android
```

#### Building Applications

##### Electron
```bash
cd electron
npm run electron:make
```
The built application will be available in the `electron/dist` directory.

##### Android
Open the project in Android Studio and use the Build menu to create APK or Android App Bundle.

## Example Image Library
Kids can fill a group with built-in example pictures ("Pick Examples" on a group)
instead of taking photos, and test their trained model with one ("Pick Example" on
the Model tab). The library is
183 kid-safe Tiny ImageNet classes, 30 images each, packed into one sprite sheet per
class in `public/library/` (~7 MB), with the class list in `src/library/libraryManifest.json`.
The single-file offline build embeds only the "best pick" classes.

These files are committed. To rebuild them from the filtered dataset folder:
```bash
npm run build:library -- <path-to-neuropocket_dataset>
```
This also writes `shipped_review.html` next to the dataset showing every shipped image.
To hand-pick or drop specific images, add `scripts/library-overrides.json`
(`{ "<class name>": { "include": [...], "exclude": [...] } }`); included images come
first, so the first one becomes the class's cover picture.

## Project Structure
- `/src` - Main web application code
- `/electron` - Electron-specific code and configuration
  - `/electron/src` - Electron main process code
  - `/electron/app` - Built web app (don't edit directly)

## Important Notes
- The electron folder should be kept in version control as it contains custom configurations
- The android folder should NOT be kept in version control - each developer should create their own using `npx cap add android`
- Always run appropriate sync commands after making changes to the main web application:
  - For Electron: `npm run build && npx cap copy @capacitor-community/electron`
  - For Android: `npm run build && npx cap sync`
- Window size and other Electron-specific configurations can be found in `electron/src/index.ts`

## .gitignore Recommendations
```
# Android
/android

# Electron build outputs
/electron/dist
/electron/build
/electron/node_modules

# General
node_modules
dist
.env
```

## 📝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 🚀 Releasing

Releases are automated. Open a pull request into `main`; once the CI gate
passes, the PR is auto-merged (squash), the patch version is bumped
automatically, and a new GitHub release is published with the Windows
installer (`.exe`) and Android app (`.apk`) attached.

- Bump the **minor** or **major** version by including `[minor]` or `[major]`
  in the PR title.
- Merge a change **without** cutting an app release by including
  `[skip release]` in the PR title (useful for docs/CI-only changes).
- To release manually, push a tag like `v1.6.0`, or use the **Release
  (manual)** workflow's "Run workflow" button for a draft test build.

### Signing the Android app

Every release APK is signed with one permanent key. Android only installs a new
version over an old one when both are signed with the same key, so **never lose
or replace this key**: without it, everyone would have to uninstall NeuroPocket
(losing their projects) before installing a new version.

The key lives in four repository secrets. Releases stop with an error if they are
missing. To set them up once, in PowerShell, with the JDK's `keytool` and the
GitHub CLI:

```powershell
# 1. Make the key. It asks for a password; use the same one when asked for the key password.
keytool -genkeypair -v -keystore neuropocket-release.jks -alias neuropocket -keyalg RSA -keysize 4096 -validity 36500 -dname "CN=NeuroPocket, O=Learn AI Anywhere"

# 2. Store it as secrets (the password ones ask for it).
gh secret set ANDROID_KEYSTORE_BASE64 --repo ousecTic/neuropocket --body ([Convert]::ToBase64String([IO.File]::ReadAllBytes("neuropocket-release.jks")))
gh secret set ANDROID_KEYSTORE_PASSWORD --repo ousecTic/neuropocket
gh secret set ANDROID_KEY_PASSWORD --repo ousecTic/neuropocket
gh secret set ANDROID_KEY_ALIAS --repo ousecTic/neuropocket --body neuropocket
```

3. Back up `neuropocket-release.jks` and its password in two safe places (for
   example a password manager and an encrypted drive). Don't commit it; `*.jks` is
   git-ignored.

Releases up to v1.8.0 were debug builds, each signed with a different throwaway
key. Phones with one of those installed need to uninstall it once before
installing a signed version; after that, updates install normally.

To build a signed APK locally, set `NP_KEYSTORE_FILE` (the path to the `.jks`),
`NP_KEYSTORE_PASSWORD`, `NP_KEY_ALIAS` and `NP_KEY_PASSWORD`, then run
`./gradlew assembleRelease` in `android/`.

## 🌍 Translations

NeuroPocket is available in English, Español, Français, Português, العربية, हिन्दी, Kiswahili, دری (Dari), پښتو (Pashto) and اردو (Urdu). Locale files live in `src/i18n/locales/`.

- **Dari and Pashto** were translated by [Darakht-e Danesh Academi](https://darakhtdanesh.org), a program of Right to Learn Afghanistan.
- **Urdu** is machine-generated and awaiting review by a native speaker.

Want to help translate? Open an issue or email contact@learnaianywhere.org. Contributors who opt in are credited on the website, under the name they choose.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Support

For support and questions, please open an issue in the GitHub repository.
