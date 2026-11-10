import React, { createContext, useContext, useState, useEffect } from 'react';
import { initialStudentData, classStudents } from '../data/studentAnalytics';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // Roles: 'student' | 'teacher' | 'parent' | 'hr'
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
  const [student, setStudent] = useState(initialStudentData);
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

  // Update student score/progress when an exercise is completed
  const recordExerciseSuccess = (subjectKey, points = 10, topicName = '') => {
    setStudent(prev => {
      const currentSubject = prev.subjects[subjectKey] || {};
      const newAccuracy = Math.min(100, (currentSubject.accuracy || 80) + 1);
      const newProgress = Math.min(100, (currentSubject.progress || 70) + 2);
      
      const updatedSubject = {
        ...currentSubject,
        progress: newProgress,
        accuracy: newAccuracy,
        lastPracticed: uiLanguage === 'en' ? 'Just now' : 'હમણાં જ'
      };

      const newAttempt = {
        id: `att-${Date.now()}`,
        subject: subjectKey === 'gujarati' ? 'Gujarati' : subjectKey === 'math' ? 'Mathematics' : 'Science',
        topic: topicName || `${subjectKey} Practice`,
        score: '10/10',
        date: uiLanguage === 'en' ? 'Today' : 'આજે',
        time: '5 mins'
      };

      return {
        ...prev,
        totalStars: prev.totalStars + points,
        subjects: {
          ...prev.subjects,
          [subjectKey]: updatedSubject
        },
        recentAttempts: [newAttempt, ...prev.recentAttempts.slice(0, 5)]
      };
    });
    showToast(uiLanguage === 'en' ? `Well done! +${points} stars earned! ⭐` : `ખૂબ સરસ! +${points} તારા મળ્યા! ⭐`);
  };

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
        recordExerciseSuccess
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
