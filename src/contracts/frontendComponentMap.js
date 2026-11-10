/**
 * Frontend Components & Backend Integration Contract Map
 * ========================================================
 * This file maps every frontend UI component to its exact backend REST API endpoints,
 * database tables, ML microservices, and step-by-step instructions for wiring up
 * real backend functionality.
 */

export const FRONTEND_COMPONENTS_MAP = {
  app_metadata: {
    name: "સાકેત (Saket) - Gujarati ISL Inclusive Learning & Communication Platform",
    version: "1.0.0",
    client_stack: "React (JavaScript) + Vite + Tailwind CSS + Web Speech API + Canvas",
    backend_stack: "Node.js + Express REST API + PostgreSQL + Python ML Service (MediaPipe & Whisper)"
  },

  components: [
    {
      id: "writing_pad",
      componentName: "WritingPad",
      filePath: "src/components/student/WritingPad.jsx",
      role: ["student"],
      category: "Interactive Canvas & Assessment",
      description: "Touch and mouse-enabled HTML5 canvas allowing deaf students to trace and write Gujarati alphabets and numbers with stroke detection, clear, undo, and accuracy evaluation.",
      propsAndState: {
        props: {
          targetLetter: { type: "string", description: "Target character to trace (e.g., 'ક', '૧', 'સૂર્ય')", required: true },
          targetWord: { type: "string", description: "Associated word (e.g., 'કમળ')", required: true },
          letterMeaning: { type: "string", description: "Context and meaning", required: false },
          onSignClick: { type: "function", description: "Callback to open sign video modal", required: false }
        },
        state: [
          "isDrawing: boolean",
          "strokeCount: number",
          "showGuide: boolean (trace watermark)",
          "penColor: string",
          "penWidth: number",
          "isEraser: boolean",
          "scoreResult: { score: number, message: string, stars: number }",
          "history: ImageData[] (for undo)"
        ]
      },
      backendEndpoints: [
        {
          method: "POST",
          url: "/api/v1/exercises/writing/evaluate",
          purpose: "Evaluate student canvas stroke image using OCR or stroke comparison model and store score in DB",
          requestHeaders: { "Authorization": "Bearer <JWT_TOKEN>", "Content-Type": "application/json" },
          requestBody: {
            studentId: "stu-101",
            targetLetter: "ક",
            subject: "gujarati",
            canvasImageBase64: "data:image/png;base64,iVBORw0KGgoAAAANSUh...",
            strokeCount: 4
          },
          responseSchema: {
            success: true,
            accuracy: 94,
            earnedStars: 10,
            feedbackMessageGujarati: "અદ્ભુત! સુંદર અને સ્પષ્ટ અક્ષર લેખન!",
            attemptId: "att-9981"
          }
        }
      ],
      databaseTables: [
        "attempts (id, student_id, exercise_id, score, accuracy, canvas_blob_url, created_at)",
        "student_progress (student_id, subject_id, total_stars, completed_lessons)"
      ]
    },

    {
      id: "gujarati_module",
      componentName: "GujaratiModule",
      filePath: "src/components/student/GujaratiModule.jsx",
      role: ["student"],
      category: "Curriculum Module",
      description: "Alphabet and numbers catalogue, vocabulary words, ISL sign video integration, and sentence construction exercises.",
      propsAndState: {
        state: [
          "subTab: 'alphabets' | 'numbers' | 'sentences'",
          "selectedLetter: Object (active alphabet item)",
          "selectedNumber: Object (active number item)",
          "filterCategory: 'all' | 'consonant' | 'vowel'"
        ]
      },
      backendEndpoints: [
        {
          method: "GET",
          url: "/api/v1/curriculum/gujarati/alphabets",
          purpose: "Fetch all Gujarati vowels and consonants with verified ISL video URLs and handshape details",
          responseSchema: [
            {
              id: "ka",
              letter: "ક",
              type: "consonant",
              word: "કમળ",
              wordEnglish: "Kamal (Lotus)",
              signDescription: "string",
              handShape: "string",
              videoUrl: "https://storage.provider.com/isl/ka.mp4",
              verifiedBy: "ISLRTC Certified Sign Educator"
            }
          ]
        },
        {
          method: "GET",
          url: "/api/v1/curriculum/gujarati/numbers",
          purpose: "Fetch numbers ૧ to ૧૦ with visual object representations and sign descriptions",
          responseSchema: [
            {
              id: "n1",
              number: "૧",
              word: "એક",
              dots: 1,
              videoUrl: "https://storage.provider.com/isl/num1.mp4"
            }
          ]
        }
      ],
      databaseTables: [
        "lessons (id, subject_id, title, letter, word, sign_video_id, status)",
        "sign_assets (id, video_url, handshape, reviewer_id, verified_at)"
      ]
    },

    {
      id: "math_module",
      componentName: "MathModule",
      filePath: "src/components/student/MathModule.jsx",
      role: ["student"],
      category: "Curriculum & Assessment",
      description: "Gujarati tables (ઘડિયા ૨ અને ૫), four operations (+, -, *, /) with visual aids and ISL signs, plus assessment problems with Gujarati numerals.",
      propsAndState: {
        state: [
          "subTab: 'tables' | 'operations' | 'practice'",
          "selectedTable: Object",
          "selectedOp: Object",
          "activeProblemIdx: number",
          "selectedOption: string",
          "isAnswered: boolean",
          "isCorrect: boolean"
        ]
      },
      backendEndpoints: [
        {
          method: "GET",
          url: "/api/v1/curriculum/math/tables",
          purpose: "Fetch math tables with speech phrases and sign descriptions"
        },
        {
          method: "POST",
          url: "/api/v1/exercises/math/submit",
          purpose: "Submit math problem answer and record attempt score",
          requestBody: {
            studentId: "stu-101",
            problemId: "p1",
            selectedOption: "૭",
            isCorrect: true
          },
          responseSchema: {
            success: true,
            newAccuracy: 86,
            pointsAdded: 10
          }
        }
      ],
      databaseTables: [
        "math_problems (id, operation_type, question, question_gu, options_json, correct_answer, explanation_gu)",
        "student_subject_stats (student_id, subject, accuracy, attempts_count)"
      ]
    },

    {
      id: "science_module",
      componentName: "ScienceModule",
      filePath: "src/components/student/ScienceModule.jsx",
      role: ["student"],
      category: "Curriculum & Assessment",
      description: "Science concept tutorials (Solar System, Photosynthesis, Water Cycle, States of Matter) with ISL tutorials, scientific vocabulary, writing pad integration, and comprehension quizzes.",
      propsAndState: {
        state: [
          "selectedLesson: Object",
          "activeTab: 'concept' | 'write' | 'quiz'",
          "selectedAnswer: string",
          "quizSubmitted: boolean"
        ]
      },
      backendEndpoints: [
        {
          method: "GET",
          url: "/api/v1/curriculum/science/lessons",
          purpose: "Fetch science lessons with ISL video tutorials and key scientific terminology signs"
        },
        {
          method: "POST",
          url: "/api/v1/exercises/science/submit",
          purpose: "Submit science quiz answer and record mastery"
        }
      ],
      databaseTables: [
        "science_lessons (id, title, subtitle, summary, sign_video_url, terms_json)",
        "science_quizzes (id, lesson_id, question, options_json, correct_answer)"
      ]
    },

    {
      id: "text_to_sign",
      componentName: "TextToSign",
      filePath: "src/components/translation/TextToSign.jsx",
      role: ["student", "teacher", "parent", "hr"],
      category: "Translation Microservice",
      description: "Converts input Gujarati sentences or news articles into sequential ISL sign video clips and animations with fallback fingerspelling for unrecognized words.",
      propsAndState: {
        state: [
          "inputText: string",
          "matchedPhrases: Array",
          "fingerspelledTokens: Array",
          "activeSignIdx: number"
        ]
      },
      backendEndpoints: [
        {
          method: "POST",
          url: "/api/v1/translation/text-to-isl",
          purpose: "Tokenize Gujarati text, look up verified dictionary ISL clips, and generate finger-spelling for out-of-vocabulary words",
          requestBody: {
            text: "નમસ્તે, મારું નામ આરવ છે."
          },
          responseSchema: {
            tokens: [
              { word: "નમસ્તે", isExactMatch: true, videoUrl: "https://.../namaste.mp4", signDescription: "બંને હાથ જોડી..." },
              { word: "આરવ", isExactMatch: false, fingerspell: ["આ", "ર", "વ"] }
            ],
            confidence: 95
          }
        }
      ],
      databaseTables: [
        "phrasebook (id, gujarati_phrase, english_phrase, category, verified_by, sign_asset_id)",
        "fingerspell_alphabet_signs (letter, handshape_asset_url)"
      ]
    },

    {
      id: "sign_recognition",
      componentName: "SignRecognition",
      filePath: "src/components/translation/SignRecognition.jsx",
      role: ["student", "hr", "teacher"],
      category: "Computer Vision & ML",
      description: "Live camera stream and MediaPipe 21 hand landmarks HUD overlay with real-time ISL gesture prediction, confidence scoring, and Gujarati text transcription.",
      propsAndState: {
        state: [
          "isCameraActive: boolean",
          "cameraError: string | null",
          "activeGestureIdx: number",
          "recognizedSentence: string",
          "showSkeleton: boolean"
        ]
      },
      backendEndpoints: [
        {
          method: "POST",
          url: "/api/v1/ml/sign-recognition/predict",
          purpose: "Send 21 hand landmarks / video frames to Python ML service for real-time ISL sign classification",
          requestBody: {
            landmarks: [[0.5, 0.4, 0.1], [0.52, 0.38, 0.09]], // 21 (x, y, z) keypoints
            frameTimestamp: 1731174000
          },
          responseSchema: {
            recognizedSign: "નમસ્તે",
            confidence: 0.96,
            isSupported: true,
            alternativeMatches: [{ sign: "આભાર", confidence: 0.12 }]
          }
        }
      ],
      databaseTables: [
        "ml_models (id, name, version, supported_vocabulary_count, accuracy_score)"
      ]
    },

    {
      id: "speech_to_sign",
      componentName: "SpeechToSign",
      filePath: "src/components/translation/SpeechToSign.jsx",
      role: ["student", "parent", "teacher"],
      category: "Speech & Translation",
      description: "Listens to Gujarati speech via Web Speech API (gu-IN) or backend Whisper STT, transcribes to text, and plays matching ISL sign clips.",
      propsAndState: {
        state: [
          "isListening: boolean",
          "spokenText: string",
          "matchedSigns: Array",
          "speechSupported: boolean"
        ]
      },
      backendEndpoints: [
        {
          method: "POST",
          url: "/api/v1/ml/speech-to-text",
          purpose: "Upload audio blob to Python Whisper STT service with Gujarati language model (gu-IN)",
          requestHeaders: { "Content-Type": "multipart/form-data" },
          responseSchema: {
            transcript: "નમસ્તે, તમારું નામ શું છે?",
            confidence: 0.94,
            language: "gu"
          }
        }
      ],
      databaseTables: [
        "speech_logs (id, user_id, audio_duration_sec, transcript, created_at)"
      ]
    },

    {
      id: "interview_hub",
      componentName: "InterviewHub",
      filePath: "src/components/hr/InterviewHub.jsx",
      role: ["hr"],
      category: "Corporate Inclusive Recruitment",
      description: "Split-screen interview console with live STT captions for hearing interviewers, quick questions with ISL sign animations, and candidate TTS playback in Gujarati.",
      propsAndState: {
        state: [
          "isHrSpeaking: boolean",
          "hrSpokenText: string",
          "candidateResponse: string",
          "transcript: Array<{ id, sender, name, text, time, hasSign, isTtsAvailable }>"
        ]
      },
      backendEndpoints: [
        {
          method: "POST",
          url: "/api/v1/interview/sessions/create",
          purpose: "Create real-time WebSocket interview room between HR and deaf candidate"
        },
        {
          method: "POST",
          url: "/api/v1/interview/messages",
          purpose: "Send message with auto-transcription and broadcast over socket",
          requestBody: {
            sessionId: "sess-902",
            sender: "hr",
            text: "તમારો અભ્યાસ શું છે?"
          }
        }
      ],
      databaseTables: [
        "interview_sessions (id, hr_user_id, candidate_user_id, status, started_at)",
        "interview_messages (id, session_id, sender_role, message_text, sign_video_url)"
      ]
    },

    {
      id: "report_card",
      componentName: "ReportCard",
      filePath: "src/components/student/ReportCard.jsx",
      role: ["student", "parent", "teacher"],
      category: "Analytics & Reporting",
      description: "Comprehensive student report card tracking progress and accuracy in Gujarati, Math, and Science, weak areas, and teacher recommendations.",
      propsAndState: {
        state: ["student: Object (from AppContext)"]
      },
      backendEndpoints: [
        {
          method: "GET",
          url: "/api/v1/analytics/students/:studentId/report-card",
          purpose: "Fetch aggregated scores, accuracy percentages, streak days, and weak topics",
          responseSchema: {
            overallProgress: 78,
            totalStars: 142,
            currentStreak: 6,
            subjects: {
              gujarati: { progress: 85, accuracy: 92, topics: [] },
              math: { progress: 75, accuracy: 84, topics: [] },
              science: { progress: 70, accuracy: 88, topics: [] }
            }
          }
        }
      ],
      databaseTables: [
        "students (id, name, roll_no, grade, school_id)",
        "student_subject_stats (student_id, subject, progress, accuracy)"
      ]
    },

    {
      id: "teacher_dashboard",
      componentName: "TeacherDashboard",
      filePath: "src/components/teacher/TeacherDashboard.jsx",
      role: ["teacher"],
      category: "Educator Class Management",
      description: "Class roster table with progress, accuracy, weak topics, and assignment creation modal for Gujarati, Math, and Science.",
      propsAndState: {
        state: [
          "searchTerm: string",
          "showCreateModal: boolean",
          "selectedStudentForDetail: Object | null",
          "assignmentTitle: string",
          "assignmentSubject: string",
          "dueDate: string"
        ]
      },
      backendEndpoints: [
        {
          method: "GET",
          url: "/api/v1/teacher/classes/:classId/students",
          purpose: "Fetch all enrolled students in the special class with mastery rates"
        },
        {
          method: "POST",
          url: "/api/v1/teacher/assignments",
          purpose: "Create and assign repeated exercises to students",
          requestBody: {
            classId: "cls-grade4-special",
            subject: "ગુજરાતી",
            title: "અક્ષર ‘ગ’ અને ‘ઘ’ ૫ વખત પેડ પર લખો",
            dueDate: "2026-11-15"
          }
        }
      ],
      databaseTables: [
        "classes (id, name, grade, teacher_id)",
        "assignments (id, class_id, subject, title, due_date, created_by)",
        "assignment_submissions (id, assignment_id, student_id, status, score)"
      ]
    },

    {
      id: "parent_dashboard",
      componentName: "ParentDashboard",
      filePath: "src/components/parent/ParentDashboard.jsx",
      role: ["parent"],
      category: "Parental Engagement",
      description: "Child's daily progress and streak summary, plus a curated sign cheat-sheet for parents to communicate without knowing sign language.",
      propsAndState: {
        state: [
          "homePhrases: Array"
        ]
      },
      backendEndpoints: [
        {
          method: "GET",
          url: "/api/v1/parent/children/:childId/summary",
          purpose: "Fetch child's daily streak, latest attempts, and teacher feedback"
        }
      ],
      databaseTables: [
        "parent_child_mapping (parent_user_id, student_id)",
        "parent_phrase_favorites (user_id, phrase_id)"
      ]
    }
  ],

  howToConnectToBackend: [
    "Step 1: Create a .env file with VITE_API_BASE_URL=http://localhost:5000/api/v1",
    "Step 2: Replace mock imports in src/context/AppContext.jsx with Axios or Fetch calls pointing to the backend endpoints documented above.",
    "Step 3: Point the WritingPad submit action to /api/v1/exercises/writing/evaluate to store student canvas drawings and scores.",
    "Step 4: Connect SignRecognition to the Python ML WebSocket endpoint ws://localhost:8000/ws/sign-detect to send live landmarks and receive predicted ISL signs.",
    "Step 5: Connect SpeechToSign to /api/v1/ml/speech-to-text (Whisper Gujarati) for environments where the browser Web Speech API lacks native gu-IN support."
  ]
};

