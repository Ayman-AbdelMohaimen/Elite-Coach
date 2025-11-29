
# FluencyFlow | Elite AI Accent & Fluency Coach

**FluencyFlow** is an advanced AI-powered language coaching application designed to bridge the gap between knowing English and speaking it like a native. Unlike standard language apps that focus on vocabulary, FluencyFlow focuses on **Bio-mechanics (Articulation)**, **Muscle Memory**, and **Cognitive Recall Speed**.

---

## 🚀 Project Overview & Achievements

We have built a sophisticated React application fully integrated with Google's **Gemini 2.5 Flash API** to provide real-time, multimodal feedback.

### 🌟 Core Features Implemented

#### 1. Dual-Language & RTL Support
*   **Complete Localization**: The app is fully translated into English and Arabic.
*   **Adaptive Layout**: The UI automatically switches between LTR (Left-to-Right) and RTL (Right-to-Left) layouts, including directional icons (arrows, players), ensuring a native experience for Arab users.
*   **Theming**: Toggleable Dark/Light modes with persistent state.

#### 2. Phase 1: Articulation Lab (The Mechanics)
*   **AI Diagnostic Test**: Uses the standardized "Please call Stella" script. Gemini analyzes the audio to detect specific phonological weaknesses (TH sounds, R/L confusion, etc.) and generates a customized training plan.
*   **Minimal Pairs**: specialized drills for distinguishing similar sounds (P/B, F/V, S/Z) with physical "Focus" guides.
*   **Standard Drills**: Targeted sentences with detailed articulation instructions (e.g., "Tongue placement," "Vibration check").
*   **Gemini Analysis**: Returns a structured JSON response containing:
    *   Phonetic Accuracy Score (0-100).
    *   Intonation & Stress Score (0-100).
    *   Detailed Markdown feedback on physical mistakes.

#### 3. Phase 2: Muscle Memory Gym
*   **Warm-up Circuit**: A guided physical routine (Jaw Drop, Lip Trills, Tongue Circles) with animated countdown timers and instructional icons to prepare the articulators before speaking.
*   **Shadowing & Visemes**:
    *   **Visual Guide (SVG)**: A dynamic, anatomically correct SVG animation showing the side profile of the mouth/tongue position for specific sounds (TH, R, F, L).
    *   **Rhythm Analysis**: Feedback focuses on flow and speed rather than just pronunciation.

#### 4. Phase 3: Cognitive Recall (Speed)
*   **Rapid Fire Questions**: Evaluates the user's "Thinking Speed."
*   **Constraint**: Users must answer in full sentences under time pressure.
*   **Analysis**: Detects hesitation (translation gap) and grammar issues.

#### 5. Audio & Visualization
*   **Audio Recorder**: Custom hook (`useAudioRecorder`) managing browser permissions, Blob creation, and Base64 conversion for API transport.
*   **Waveform Visualizer**: A Canvas-based component (`AudioVisualizer`) that draws the user's audio pattern.
    *   **Comparison**: Displays a "Target Reference" pattern above the user's wave.
    *   **Color-Coded**: The waveform changes color (Red/Yellow/Green) based on the AI confidence score.
*   **Text-to-Speech (TTS)**: Integrated browser synthesis to read drills before recording.

#### 6. Settings & Customization
*   **Voice Selection**: Users can choose between Male and Female voices.
    *   *Logic*: Smart filtering attempts to find "David/Mark" for Male or "Zira/Google US" for Female, falling back gracefully.
*   **Speed Control**: Playback speed adjustment (0.75x, 1.0x, 1.25x) for practicing difficult phrases.

---

## 🛠 Technical Architecture

*   **Frontend**: React 19, TypeScript, Vite.
*   **Styling**: Tailwind CSS (with extensive custom animations for "breathing" and "floating" effects).
*   **AI Engine**: `@google/genai` SDK (Gemini 2.5 Flash).
    *   *Prompt Engineering*: Highly specific system instructions (`COACH_PERSONA`) ensuring the AI acts as a strict but encouraging dialect coach.
    *   *Structured Output*: Using JSON Schema enforcement to guarantee UI-compatible data from the LLM.
*   **Icons**: Lucide React.

---

## 🔮 Roadmap: Coming Soon

Based on recent brainstorming sessions, the following "Elite" features are planned for the next iteration:

### 1. Native Neural TTS (Gemini Integration)
*   **Current Issue**: Browser-based `speechSynthesis` is robotic and inconsistent across devices (Male voice often defaults to Female on some mobiles).
*   **Solution**: Migrate `playTextToSpeech` to use **Gemini API's Text-to-Speech**.
*   **Benefit**: Access to high-quality, human-like voices (Puck, Fenrir for Male / Kore, Aoede for Female) ensuring consistent "Native" audio references.

### 2. User Voice Cloning (The "Magic" Feature)
A revolutionary feature allowing users to hear *themselves* speaking fluently.

*   **Concept**:
    1.  **Calibration**: User records a 30-second sample in the Settings menu.
    2.  **Cloning**: The system creates a digital voice profile.
    3.  **Feedback Loop**: When a user fails a drill, they can click "Hear it in MY voice."
    4.  **Result**: The app plays the target sentence using the user's own voice clone, but with perfect native accent and intonation.
*   **Tech Path**:
    *   *Path A*: Gemini Speech-to-Speech (Style Transfer).
    *   *Path B*: Integration with **ElevenLabs API** (Instant Voice Cloning) for maximum realism.

### 3. Intonation Visualization (Pitch Perfect)
*   Visualizing the "Melody" of speech (Pitch contours) overlaying the user's recording against a native speaker's pitch curve to visually correct "Robotic" speech.

---

*English Doctor v3.1 - Built with ❤️ By Ayman AbdelMohaimen & AI.*
