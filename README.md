
# 🌊 FluencyFlow: Elite AI Accent Coach v3.1

> **Master the Art of Speech.**  
> An advanced, AI-powered language coaching platform designed to bridge the gap between knowing English and speaking it like a native.

![Version](https://img.shields.io/badge/version-3.1.0-emerald)
![Tech Stack](https://img.shields.io/badge/stack-React_19_|_TypeScript_|_Vite-blue)
![AI Engine](https://img.shields.io/badge/AI-Google_Gemini_2.5-orange)

## 📖 Overview

**FluencyFlow** is not just a language learning app; it is a **Bio-mechanical & Cognitive Training System**. Unlike traditional apps that focus on vocabulary, FluencyFlow targets the physical muscles of the mouth (Articulation) and the speed of neural recall (Cognitive Speed).

Built with **React 19**, **TypeScript**, and the **Google GenAI SDK**, it provides real-time, multimodal feedback on pronunciation, intonation, and fluency.

---

## 🌟 Key Features

### 1. 🧬 The Persona System (Adaptive Curriculum)
The app adapts its entire content database based on the user's professional profile:
- **Developer 👨‍💻**: Drills focusing on tech terms (*Kubernetes, Latency, Idempotency*).
- **Business 👔**: Drills for negotiation and strategy (*ROI, Synergy, Leverage*).
- **Academic 🎓**: Drills for research and logic (*Methodology, Correlation*).
- **Kids 🦁**: Fun, adventure-based drills.

### 2. 🗣️ Articulation Lab
- **AI Diagnostic**: Analyzes the "Please Call Stella" script to detect phonological weaknesses.
- **Minimal Pairs**: Targeted practice for confusing sounds (P/B, F/V).
- **Elite Keyword Hacking**: A "Terminal-style" module for mastering the hardest technical terms in your niche.

### 3. 💪 Muscle Gym
- **Warm-up Circuit**: Guided physical exercises (Jaw drops, Lip trills) to prepare articulators.
- **Shadowing**: Rhythm and flow training with visual guides.
- **Memory Game**: Cognitive warm-up to activate English thinking centers.

### 4. ⚡ Speed Drill (Cognitive Recall)
- **Rapid Fire**: Users must answer questions in under 5 seconds.
- **Analysis**: Detects "Translation Gap" (hesitation due to thinking in native language).

### 5. 🧪 Study Lab (Visual Context)
- **Text-to-Infographic**: Paste any text, and the AI (Gemini 2.5) generates a visual summary poster to help you learn the context visually.

---

## 🛠️ Technical Architecture

### Tech Stack
- **Frontend Framework**: React 19 (Functional Components, Hooks).
- **Build Tool**: Vite.
- **Language**: TypeScript (Strict Mode).
- **Styling**: Tailwind CSS (Custom "Glassmorphism" & "Neon" theme).
- **AI Integration**: `@google/genai` (Gemini 1.5/2.5 Flash Models).
- **Audio**: Native Web Audio API + MediaRecorder API.
- **Visuals**: HTML5 Canvas (Waveforms) + SVG (Viseme Guides).

### Project Structure
```bash
src/
├── components/       # Reusable UI components (Buttons, AudioPlayer, Header)
├── hooks/            # Custom Hooks (useAudioRecorder, useGeminiTTS)
├── services/         # API Layer (Gemini integration logic)
├── views/            # Main Application Screens (Home, Articulation, etc.)
├── types.ts          # TypeScript Interfaces & Enums (SessionState, UserStats)
├── constants.ts      # Static Data (Drills, Personas, Translations)
└── App.tsx           # Main Router & State Manager
```

### Core Logic Flow
1.  **State Management**: The app uses a global `SessionState` enum to manage navigation without client-side routing libraries, ensuring seamless transitions (SPA).
2.  **Audio Pipeline**:
    -   `useAudioRecorder`: Captures microphone input -> Converts to Blob -> Converts to Base64.
    -   `geminiService`: Sends Base64 audio + System Prompt to Gemini API.
    -   `Response`: Gemini returns JSON containing Score (0-100) and Markdown feedback.
3.  **Localization**: Fully supports RTL (Arabic) via a custom `lang` prop passed down to all components.

---

## 🚀 Installation & Setup

1.  **Clone the repository**
    ```bash
    git clone https://github.com/your-username/fluency-flow.git
    cd fluency-flow
    ```

2.  **Install Dependencies**
    ```bash
    npm install
    ```

3.  **Environment Setup**
    -   Create a `.env` file in the root directory.
    -   Add your Google Gemini API Key:
    ```env
    VITE_API_KEY=your_google_gemini_api_key_here
    ```

4.  **Run Development Server**
    ```bash
    npm run dev
    ```

---

## 🔒 Security Note (Important)

This is a **Client-Side Application**. The API Key is currently exposed in the frontend code for demonstration/hackathon purposes.
**For Production:**
1.  Migrate the `services/geminiService.ts` logic to a Backend (Node.js/Express or Firebase Functions).
2.  Use a proxy endpoint to hide the `API_KEY`.

---

## 📄 License

This project is licensed under the MIT License.

**Built with ❤️ by Ayman AbdelMohaimen & AI.**
