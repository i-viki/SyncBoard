# SyncBoard

**SyncBoard** is a high-performance, real-time collaboration platform designed for instant text and file sharing across devices. Built with speed and simplicity in mind, it eliminates the overhead of accounts and complex setups, providing a frictionless digital workspace for developers, content creators, and teams.

![Status](https://img.shields.io/badge/Status-Maintained-success?style=flat)
![Vite](https://img.shields.io/badge/Built_with-Vite-B73BFE?style=flat&logo=vite&logoColor=white)
![React](https://img.shields.io/badge/Library-React-20232A?style=flat&logo=react&logoColor=61DAFB)
![MUI](https://img.shields.io/badge/UI-Material%20UI-007FFF?style=flat&logo=mui&logoColor=white)
![Firebase](https://img.shields.io/badge/Backend-Firebase-ffca28?style=flat&logo=firebase&logoColor=black)
![Cloudinary](https://img.shields.io/badge/Storage-Cloudinary-3448C5?style=flat&logo=cloudinary&logoColor=white)
![Analytics](https://img.shields.io/badge/Analytics-Google-E37400?style=flat&logo=google-analytics&logoColor=white)
![Hosting](https://img.shields.io/badge/Hosting-Vercel-000000?style=flat&logo=vercel&logoColor=white)
![PWA](https://img.shields.io/badge/App-PWA-5A0FC8?style=flat&logo=pwa&logoColor=white)
![Notifications](https://img.shields.io/badge/Notifications-Sonner-000000?style=flat)
![Forms](https://img.shields.io/badge/Forms-React%20Hook%20Form-EC5990?style=flat&logo=reacthookform&logoColor=white)
![Validation](https://img.shields.io/badge/Validation-Yup-F28D35?style=flat)
![Emails](https://img.shields.io/badge/Emails-EmailJS-F1502F?style=flat)
![Language](https://img.shields.io/badge/Language-JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)
![License](https://img.shields.io/badge/License-MIT-green?style=flat)
![Version](https://img.shields.io/badge/Version-1.0.0-orange?style=flat)

---

## Core Features

### Real-Time Synchronization
Experience zero-latency collaboration. Text entered into a board is instantly synchronized across all active participants using the same 5-character board code. Powered by Firebase Realtime Database for true live updates.

### Universal File Sharing
SyncBoard supports the upload and sharing of any file type (Images, PDFs, Documents, Videos, etc.) up to **10MB**. 
- **Drag & Drop**: Seamlessly drop files into the board for instant sharing.
- **Cloudinary Integration**: High-speed global delivery and secure storage for shared assets.
- **Single Slot**: To maintain focus and performance, each board hosts one active file at a time.

### Board Security & Privacy
While SyncBoard is built for anonymity, it doesn't compromise on security:
- **Locking Mechanism**: Secure any board with a **6-digit PIN** using SHA-256 hashing.
- **Interaction Control**: Once locked, board editing is disabled for anyone without the correct PIN.
- **Anonymity**: No accounts, no email requirements, and no tracking of personal identifiable information.

### Progressive Web App (PWA)
Install SyncBoard on your desktop or mobile device for a native-like experience. Includes offline detection and update notification services to ensure you're always on the latest version.

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
├── services/        # Logic for Firebase, Cloudinary, and Analytics
├── utils/           # Helper functions (Sanitization, User ID)
├── constants/       # Static content, FAQs, and Developer data
├── config/          # Centralized configuration (Firebase init)
├── pages/           # Route-level components
└── assets/          # Static assets and icons
```

---

## Technology Stack

- **Frontend**: React 18 with Vite for lightning-fast builds.
- **Styling**: Material UI (MUI) with a custom dual-mode (Dark/Light) theme engine.
- **Database**: Firebase Realtime Database for live sync logic.
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

### 3. Environment Configuration
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

### 4. Run Development Server
```bash
npm run dev
```

### 5. Build for Production
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
