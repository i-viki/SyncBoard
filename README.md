# SyncBoard

**SyncBoard** is a high-performance, real-time collaboration platform designed for instant text and file sharing across devices. Built with speed and simplicity in mind, it eliminates the overhead of accounts and complex setups, providing a frictionless digital workspace for developers, content creators, and teams.

![Status](https://img.shields.io/badge/Status-Production--Ready-success?style=flat)
![Privacy](https://img.shields.io/badge/Privacy-First-blue?style=flat)
![Security](https://img.shields.io/badge/Security-Encrypted_History-blueviolet?style=flat)
![Performance](https://img.shields.io/badge/Latency-Ultra--Low-orange?style=flat)
![UX](https://img.shields.io/badge/UI-Elite_Design_System-FF69B4?style=flat)

Developed with ☕

![Vite](https://img.shields.io/badge/Built_with-Vite-B73BFE?style=flat&logo=vite&logoColor=white)
![React](https://img.shields.io/badge/Library-React-20232A?style=flat&logo=react&logoColor=61DAFB)
![MUI](https://img.shields.io/badge/UI-Material%20UI-007FFF?style=flat&logo=mui&logoColor=white)
![Firebase](https://img.shields.io/badge/Backend-Firebase-ffca28?style=flat&logo=firebase&logoColor=black)
![Cloudinary](https://img.shields.io/badge/Storage-Cloudinary-3448C5?style=flat&logo=cloudinary&logoColor=white)
![Hosting](https://img.shields.io/badge/Hosting-Vercel-000000?style=flat&logo=vercel&logoColor=white)
![Language](https://img.shields.io/badge/Language-JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)
![License](https://img.shields.io/badge/License-MIT-green?style=flat)
![PWA](https://img.shields.io/badge/App-PWA-5A0FC8?style=flat&logo=pwa&logoColor=white)
![Auth](https://img.shields.io/badge/Auth-Anonymous-9cf?style=flat&logo=firebase&logoColor=white)
![Version](https://img.shields.io/badge/Version-1.2.1-orange?style=flat)

---

## Core Features

### Real-Time Synchronization
Experience zero-latency collaboration. Text entered into a board is instantly synchronized across all active participants using the same 5-character board code.
- **Performance Optimized**: Uses a 500ms debounced syncing engine to ensure database stability even during fast typing.

### Collaborative Presence & History
- **Live User Tracking**: Know who's online with real-time indicators showing active participants on the board.
- **Obfuscated Local History**: SyncBoard securely remembers your last 5 boards using **Base64-encoded local storage**. Quickly jump back into recent sessions without compromising privacy or plain-text readability in browser tools.

### Universal File Gallery
SyncBoard supports sharing up to **5 files** simultaneously.
- **Any Format**: Images, PDFs, Documents, Videos, and more (up to 10MB per file).
- **Hardened Downloads**: Advanced fetch-based blob download system for reliable transfers with correct names and extensions.
- **Gallery View**: Professional grid/list layout for managing multiple assets.
- **Drag & Drop**: Seamlessly drop files into the board for instant syncing.

### Self-Destruct Timer
Enhanced privacy with ephemeral sessions. Set a countdown timer (10m, 1h, 24h) to automatically clear the board's text and files once the time expires.

### Syntax Highlighting Editor
A professional-grade editing experience for code and notes.
- **Smart Auto-Detect**: Intelligent engine automatically identifies JavaScript, Python, Java, HTML, CSS, Markdown, and JSON.
- **Rich Highlighting**: Professional syntax coloring powered by PrismJS.
- **One-Tap Wipe**: Dedicated "Clear Board" functionality with toast verification for instant privacy.
- **Language Selector**: Instantly switch highlighting modes for different code formats.
- **Metrics**: Integrated word, character, and line counts.

### Board Security & Privacy
- **Anonymous Authentication**: Every visitor is silently authenticated via Firebase Anonymous Auth, enabling secure database rules without requiring sign-up or login.
- **Locking Mechanism**: Secure any board with a **6-digit PIN** using SHA-256 hashing.
- **Interaction Control**: Once locked, board editing is disabled for anyone without the correct PIN.
- **QR Code Sharing**: Generate a scannable code to instantly open boards on mobile devices.

### Progressive Web App (PWA) & Mobile UX
- **Native-Like Experience**: Install SyncBoard on your desktop or mobile device. Includes offline detection and update services.
- **Responsive Command Center**: Fully optimized mobile navigation with a premium glassmorphic side panel for board management and settings.
- **Adaptive Toolbar**: The editor toolbar intelligently wraps and adapts to small screens, ensuring full functionality on any device.

### Integrated Metrics
Stay on top of your content with real-time text analysis:
- Word count and character count tracking.
- Line number indicators for code-like editing.
- Automatic sanitization of file names for cross-system compatibility.

---

## Project Architecture

The codebase follows a modern, modular structure designed for scalability and maintainability:

```text
src/
├── components/
│   ├── common/      # Reusable UI (Navbar, Footer, Modals)
│   └── features/    # Core logic components (TextEditor, FilePanel)
├── services/        # Logic for Firebase, Cloudinary, Analytics, and Auth
├── utils/           # Helper functions (Sanitization, User ID, PIN Hashing)
├── constants/       # Static content, FAQs, and Developer data
├── config/          # Centralized configuration (Firebase init)
├── pages/           # Route-level components
└── assets/          # Static assets and icons
```

---

## Technology Stack

- **Frontend**: React 19 with Vite for lightning-fast builds.
- **Styling**: Material UI (MUI) with a custom handcrafted "Elite" theme engine.
- **Database**: Firebase Realtime Database with debounced syncing.
- **Auth**: Firebase Anonymous Authentication for secure, frictionless access.
- **Storage**: Cloudinary for optimized file management and delivery.
- **Communication**: EmailJS for reliable feedback and contact management.
- **Analytics**: Firebase Analytics for anonymous usage insights.

---

## Getting Started

### 1. Clone the Repository
```bash
git clone https://github.com/i-viki/SyncBoard.git
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Firebase Console Setup
- Enable **Anonymous Authentication** in Firebase Console → **Authentication → Sign-in method → Anonymous → Enable**.
- Configure **Realtime Database** security rules to require `auth != null`.

### 4. Environment Configuration
Create a `.env` file in the root directory based on `example.env`:
```env
# Firebase Configuration
VITE_APP_APIKEY=your_key
VITE_APP_AUTHDOMAIN=your_domain
VITE_APP_PROJECTID=your_id
VITE_APP_STORAGEBUCKET=your_bucket
VITE_APP_MESSAGINGSENDERID=your_sender_id
VITE_APP_APPID=your_app_id
VITE_APP_DATABASEURL=your_url
VITE_APP_MEASUREMENT_ID=your_measurement_id

# Cloudinary Configuration
VITE_APP_CLOUDINARY_CLOUD_NAME=your_name
VITE_APP_CLOUDINARY_CLOUD_UPLOAD_PRESET_NAME=your_preset

# EmailJS Configuration
VITE_APP_EMAILJSAPIKEY=your_public_key
VITE_APP_EMAILJSSERVICE_KEY=your_service_id
VITE_APP_EMAILJSTEMPLATE_KEY=your_template_id
```

### 5. Run Development Server
```bash
npm run dev
```

### 6. Build for Production
```bash
npm run build
```

---

## Maintainer

**Jayavignesh**  
Superuser & Lead Developer  
[Portfolio](https://jayavignesh.dev) | [LinkedIn](https://www.linkedin.com/in/jayavigneshj/)

---

## License

This project is licensed under the **MIT License**. See the `LICENSE` file for details.

---

**SyncBoard** — *Collaborate at the speed of thought.*
