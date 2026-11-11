# Frontend Components & Backend Integration Guide
## સાકેત (Saket) - Gujarati ISL Inclusive Learning & Communication Platform

> **Overview:** This document provides the complete integration blueprint for connecting the React frontend components to the planned Node.js/Express REST API, PostgreSQL database, and future Python ML services (MediaPipe & Whisper).

---

## 1. Architecture Summary

```
                      +---------------------------------------+
                      |       React Client Application        |
                      |  (Vite + JavaScript + Tailwind CSS)   |
                      +-------------------+-------------------+
                                          |
        +---------------------------------+---------------------------------+
        |                                 |                                 |
        v                                 v                                 v
+------------------+             +------------------+             +--------------------+
| Node.js/Express  |             |  Web Speech API  |             |  Python ML Service |
|    REST API      |             | (gu-IN STT/TTS)  |             | (MediaPipe Hands & |
| (Auth, Content,  |             | (Browser Native) |             |  Whisper Gujarati) |
|   Analytics)     |             +------------------+             |   [Future / R&D]   |
| [Planned Backend]|                                              +--------------------+
+--------+---------+
         |
+--------v---------+
|    PostgreSQL    |
| (Supabase / S3)  |
+------------------+
```

---

## 2. Frontend Component Catalog & Backend Contract

### 2.1 Interactive Writing Pad
- **Component File:** [`src/components/student/WritingPad.jsx`](file:///Users/sahasra/asl-learning-app/src/components/student/WritingPad.jsx)
- **Primary Role:** Student
- **Description:** Touch and mouse-enabled HTML5 Canvas for students to trace and write Gujarati alphabets and numbers with stroke detection, clear, undo, and evaluation.
- **Frontend State:**
  - `targetLetter` (string): Current character to practice (e.g. `'ક'`, `'૧'`).
  - `targetWord` (string): Word name (`'કમળ'`).
  - `isDrawing` (boolean): Active drawing state.
  - `strokeCount` (number): Number of drawn strokes.
  - `showGuide` (boolean): Background watermark toggle.
- **Backend REST API:**
  - **Endpoint:** `POST /api/v1/exercises/writing/evaluate`
  - **Request Body:**
    ```json
    {
      "studentId": "stu-101",
      "targetLetter": "ક",
      "subject": "gujarati",
      "canvasImageBase64": "data:image/png;base64,iVBORw0KGgoAAA...",
      "strokeCount": 4
    }
    ```
  - **Response:**
    ```json
    {
      "success": true,
      "accuracy": 94,
      "earnedStars": 10,
      "feedbackMessage": "અદ્ભુત! સુંદર અને સ્પષ્ટ અક્ષર લેખન!",
      "attemptId": "att-1029"
    }
    ```
- **Database Tables:** `attempts`, `student_progress`

---

### 2.2 Gujarati Learning Module
- **Component File:** [`src/components/student/GujaratiModule.jsx`](file:///Users/sahasra/asl-learning-app/src/components/student/GujaratiModule.jsx)
- **Primary Role:** Student
- **Description:** Vowels (સ્વરો) & Consonants (વ્યંજનો) catalogue, numbers (૧ થી ૧૦), vocabulary words, ISL sign video modal, and conversational sentence breakdown.
- **Frontend State:**
  - `subTab`: `'alphabets'` | `'numbers'` | `'sentences'`
  - `selectedLetter`: Current alphabet object.
  - `selectedNumber`: Current number object.
  - `filterCategory`: `'all'` | `'consonant'` | `'vowel'`
- **Backend REST API:**
  - **Endpoint 1:** `GET /api/v1/curriculum/gujarati/alphabets`
    - Returns array of vowels & consonants with verified ISL video asset URLs and handshapes.
  - **Endpoint 2:** `GET /api/v1/curriculum/gujarati/numbers`
    - Returns numbers ૧ to ૧૦ with visual counter representations.
  - **Endpoint 3:** `GET /api/v1/curriculum/gujarati/sentences`
    - Returns approved daily sentences and ISL sign sequence breakdown.
- **Database Tables:** `lessons`, `sign_assets`, `curriculum_categories`

---

### 2.3 Mathematics Module
- **Component File:** [`src/components/student/MathModule.jsx`](file:///Users/sahasra/asl-learning-app/src/components/student/MathModule.jsx)
- **Primary Role:** Student
- **Description:** Gujarati tables (ઘડિયા ૨ અને ૫), four basic operations (`+`, `-`, `×`, `÷`) with visual object counters and ISL signs, plus assessment problems with Gujarati numerals.
- **Frontend State:**
  - `subTab`: `'tables'` | `'operations'` | `'practice'`
  - `selectedTable`: Active table object.
  - `activeProblemIdx`: Index of current practice problem.
  - `selectedOption`: Student's chosen answer.
- **Backend REST API:**
  - **Endpoint 1:** `GET /api/v1/curriculum/math/tables`
  - **Endpoint 2:** `POST /api/v1/exercises/math/submit`
    - **Request Body:**
      ```json
      {
        "studentId": "stu-101",
        "problemId": "p1",
        "selectedAnswer": "૭",
        "isCorrect": true
      }
      ```
    - **Response:**
      ```json
      {
        "success": true,
        "newAccuracy": 85,
        "earnedStars": 10
      }
      ```
- **Database Tables:** `math_problems`, `student_subject_stats`

---

### 2.4 Science Module
- **Component File:** [`src/components/student/ScienceModule.jsx`](file:///Users/sahasra/asl-learning-app/src/components/student/ScienceModule.jsx)
- **Primary Role:** Student
- **Description:** Science concept tutorials (Solar System / સૂર્યમંડળ, Photosynthesis / પ્રકાશસંશ્લેષણ, Water Cycle / જળચક્ર, States of Matter / દ્રવ્યની અવસ્થાઓ) with ISL tutorials, scientific vocabulary, writing pad integration, and comprehension quizzes.
- **Frontend State:**
  - `selectedLesson`: Active science lesson.
  - `activeTab`: `'concept'` | `'write'` | `'quiz'`
- **Backend REST API:**
  - **Endpoint 1:** `GET /api/v1/curriculum/science/lessons`
  - **Endpoint 2:** `POST /api/v1/exercises/science/submit`
- **Database Tables:** `science_lessons`, `science_quizzes`

---

### 2.5 Translation Module - Text to Sign
- **Component File:** [`src/components/translation/TextToSign.jsx`](file:///Users/sahasra/asl-learning-app/src/components/translation/TextToSign.jsx)
- **Roles:** Student, Teacher, Parent
- **Description:** Converts input Gujarati words and sentences into verified ISL sign video clips and sequences, with fallback fingerspelling for unrecognized words.
- **Backend REST API:**
  - **Endpoint:** `POST /api/v1/translation/text-to-isl`
  - **Request Body:** `{ "text": "નમસ્તે, મારું નામ આરવ છે." }`
  - **Response:**
    ```json
    {
      "tokens": [
        { "word": "નમસ્તે", "videoUrl": "https://.../namaste.mp4", "signDescription": "બંને હાથ જોડી..." },
        { "word": "આરવ", "isExactMatch": false, "fingerspell": ["આ", "ર", "વ"] }
      ]
    }
    ```
- **Database Tables:** `phrasebook`, `fingerspell_alphabet_signs`

---

### 2.6 Translation Module - Camera Sign Practice (Prototype)
- **Component File:** [`src/components/translation/SignRecognition.jsx`](file:///Users/sahasra/asl-learning-app/src/components/translation/SignRecognition.jsx)
- **Roles:** Student, Teacher
- **Description:** Camera preview mirror and hand guide overlay for signing practice, with selectable prototype reference signs to assemble Gujarati sentences. *(Note: Active AI/MediaPipe sign recognition model is not yet connected in the client prototype; the camera provides a mirror feed for self-practice).*
- **Future ML Microservice Contract (Planned):**
  - **WebSocket / REST Endpoint:** `POST /api/v1/ml/sign-recognition/predict`
  - **Payload:** 21 landmark coordinate triples `[[x, y, z], ...]`.
  - **Response:**
    ```json
    {
      "recognizedSign": "નમસ્તે",
      "isSupported": true
    }
    ```

---

### 2.7 Translation Module - Speech to Sign
- **Component File:** [`src/components/translation/SpeechToSign.jsx`](file:///Users/sahasra/asl-learning-app/src/components/translation/SpeechToSign.jsx)
- **Roles:** Student, Parent, Teacher
- **Description:** Listens to Gujarati speech via browser Web Speech API (`gu-IN`) when supported, transcribes to text, and displays matching ISL sign video clips from the curated phrasebook without fallback to unrelated signs.
- **Planned Backend Endpoint:** `POST /api/v1/ml/speech-to-text` (multipart/form-data audio blob for Whisper Gujarati when browser Web Speech API is unavailable).

---

### 2.8 Student Analytics & Report Card
- **Component File:** [`src/components/student/ReportCard.jsx`](file:///Users/sahasra/asl-learning-app/src/components/student/ReportCard.jsx)
- **Roles:** Student, Parent, Teacher
- **Description:** Comprehensive student report card tracking progress and accuracy in Gujarati, Math, and Science, weak areas, and teacher recommendations.
- **Backend Endpoint:** `GET /api/v1/analytics/students/:studentId/report-card`

---

### 2.9 Teacher Dashboard
- **Component File:** [`src/components/teacher/TeacherDashboard.jsx`](file:///Users/sahasra/asl-learning-app/src/components/teacher/TeacherDashboard.jsx)
- **Primary Role:** Teacher
- **Description:** Class overview, student performance table, topic strengths and weaknesses, and assignment creation modal.
- **Backend Endpoints:**
  - `GET /api/v1/teacher/classes/:classId/students`
  - `POST /api/v1/teacher/assignments`

---

### 2.10 Parent Portal
- **Component File:** [`src/components/parent/ParentDashboard.jsx`](file:///Users/sahasra/asl-learning-app/src/components/parent/ParentDashboard.jsx)
- **Primary Role:** Parent
- **Description:** Child's daily progress and streak summary, plus a curated sign cheat-sheet for parents to communicate without knowing sign language.
- **Backend Endpoint:** `GET /api/v1/parent/children/:childId/summary`

---

## 3. How to Connect Frontend to Real Backend (Step-by-Step)

1. **Environment Setup:**
   Create a `.env` file in the root:
   ```env
   VITE_API_BASE_URL=http://localhost:5000/api/v1
   VITE_ML_SERVICE_URL=http://localhost:8000
   ```

2. **Replace Mock State in Context:**
   In [`src/context/AppContext.jsx`](file:///Users/sahasra/asl-learning-app/src/context/AppContext.jsx), replace the initial state with `fetch()` calls on mount:
   ```javascript
   useEffect(() => {
     fetch(`${import.meta.env.VITE_API_BASE_URL}/analytics/students/stu-101/report-card`, {
       headers: { Authorization: `Bearer ${userToken}` }
     })
     .then(res => res.json())
     .then(data => setStudent(data));
   }, [userToken]);
   ```

3. **Writing Pad Cloud Storage:**
   In [`src/components/student/WritingPad.jsx`](file:///Users/sahasra/asl-learning-app/src/components/student/WritingPad.jsx), inside `evaluateWriting()`, send the canvas base64 image data to `POST /api/v1/exercises/writing/evaluate`.

4. **Speech Recognition Fallback:**
   In [`src/components/translation/SpeechToSign.jsx`](file:///Users/sahasra/asl-learning-app/src/components/translation/SpeechToSign.jsx), if `window.SpeechRecognition` is unsupported in a client browser, record audio using `MediaRecorder` and POST to `/api/v1/ml/speech-to-text`.

