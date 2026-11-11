import React, { createContext, useContext, useState, useEffect } from 'react';
import { initialStudentData, classStudents } from '../data/studentAnalytics';

const AppContext = createContext();
const STUDENT_KEY = 'gsl-student-v1';

export const AppProvider = ({ children }) => {
  // Roles: 'student' | 'teacher' | 'parent'
  const [currentRole, setCurrentRole] = useState('student');
  
  // UI Language: 'en' (English default) | 'gu' (Gujarati)
  const [uiLanguage, setUiLanguage] = useState('en');

  // Navigation active tab for student
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // Mobile device simulator container toggle (allows viewing as mobile or tablet/responsive)
  const [isMobileFrame, setIsMobileFrame] = useState(true);
  
  // Audio narration toggle (ISL accessible rule: audio is strictly optional aid)
  const [audioEnabled, setAudioEnabled] = useState(true);
  
  // Learning & Analytics State
  // Saved in the browser so progress and assignments survive a refresh.
  // shortcut: one device, one demo student; move to the backend API when it exists.
  const [student, setStudent] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(STUDENT_KEY)) || initialStudentData;
    } catch {
      return initialStudentData;
    }
  });
  useEffect(() => {
    localStorage.setItem(STUDENT_KEY, JSON.stringify(student));
  }, [student]);

  const addAssignment = (assignment) => setStudent(prev => ({
    ...prev,
    pendingAssignments: [{ id: `asg-${Date.now()}`, status: 'બાકી', ...assignment }, ...prev.pendingAssignments]
  }));
  const [studentsList, setStudentsList] = useState(classStudents);
  
  // Selected lesson/letter for direct modal preview
  const [activeVideoModal, setActiveVideoModal] = useState(null);
  
  // Active notification toast
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (message, type = 'success') => {
    setToastMessage({ message, type });
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Text to speech helper for Gujarati
  const speakText = (text) => {
    if (!audioEnabled || !('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'gu-IN'; // Gujarati locale
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn('Speech synthesis error:', e);
    }
  };

  // Record every exercise attempt; accuracy = correct / attempted.
  const recordExerciseAttempt = (subjectKey, isCorrect, topicName = '', points = 10) => {
    setStudent(prev => {
      const currentSubject = prev.subjects[subjectKey] || {};
      const attempted = (currentSubject.attempted || 0) + 1;
      const correct = (currentSubject.correct || 0) + (isCorrect ? 1 : 0);

      const updatedSubject = {
        ...currentSubject,
        attempted,
        correct,
        accuracy: Math.round((100 * correct) / attempted),
        progress: isCorrect ? Math.min(100, (currentSubject.progress || 0) + 2) : currentSubject.progress,
        lastPracticed: uiLanguage === 'en' ? 'Just now' : 'હમણાં જ'
      };

      const newAttempt = {
        id: `att-${Date.now()}`,
        subject: subjectKey === 'gujarati' ? 'ગુજરાતી' : subjectKey === 'math' ? 'ગણિત' : 'વિજ્ઞાન',
        topic: topicName || `${subjectKey} Practice`,
        score: isCorrect ? '✓' : '✗',
        date: uiLanguage === 'en' ? 'Today' : 'આજે',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      return {
        ...prev,
        totalStars: prev.totalStars + (isCorrect ? points : 0),
        subjects: {
          ...prev.subjects,
          [subjectKey]: updatedSubject
        },
        recentAttempts: [newAttempt, ...prev.recentAttempts.slice(0, 5)]
      };
    });
    if (isCorrect) {
      showToast(uiLanguage === 'en' ? `Well done! +${points} stars earned! ⭐` : `ખૂબ સરસ! +${points} તારા મળ્યા! ⭐`);
    }
  };

  const recordExerciseSuccess = (subjectKey, points = 10, topicName = '') =>
    recordExerciseAttempt(subjectKey, true, topicName, points);

  return (
    <AppContext.Provider
      value={{
        currentRole,
        setCurrentRole,
        uiLanguage,
        setUiLanguage,
        activeTab,
        setActiveTab,
        isMobileFrame,
        setIsMobileFrame,
        audioEnabled,
        setAudioEnabled,
        student,
        setStudent,
        studentsList,
        setStudentsList,
        activeVideoModal,
        setActiveVideoModal,
        toastMessage,
        showToast,
        speakText,
        recordExerciseSuccess,
        recordExerciseAttempt,
        addAssignment
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
