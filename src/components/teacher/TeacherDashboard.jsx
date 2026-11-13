import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { mathLessons } from '../../data/mathLessons';
import { scienceLessons } from '../../data/scienceLessons';
import { 
  Users, 
  PlusCircle, 
  BookOpen, 
  CheckCircle2, 
  Clock, 
  TrendingUp, 
  Calendar, 
  Search, 
  Eye, 
  X,
  RotateCcw
} from 'lucide-react';

// What a teacher can assign: subject -> topics (exerciseType ids understood by the student modules)
const SUBJECTS = {
  math: {
    label: 'ગણિત',
    en: 'Mathematics',
    topics: [{ id: 'mixed', title: 'મિશ્ર દાખલા (+ − × ÷)' }, ...mathLessons.operations.map(o => ({ id: o.id, title: o.title }))]
  },
  science: {
    label: 'વિજ્ઞાન',
    en: 'Science',
    topics: scienceLessons.map(l => ({ id: l.id, title: l.title }))
  },
  gujarati: {
    label: 'ગુજરાતી',
    en: 'Gujarati',
    topics: [{ id: 'writing', title: 'અક્ષર લેખન (Letter writing)' }]
  }
};
const COUNTS = [5, 10, 20];

export const TeacherDashboard = () => {
  const {
    studentsList, student, showToast, uiLanguage, addAssignment,
    setCurrentRole, setIsMobileFrame, setActiveTab
  } = useApp();
  const assignments = student.pendingAssignments.filter(a => a.count > 0);
  const completedCount = assignments.filter(a => a.status === 'પૂર્ણ').length;
  const isEn = uiLanguage === 'en';

  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedStudentForDetail, setSelectedStudentForDetail] = useState(null);

  const [assignmentTitle, setAssignmentTitle] = useState('');
  const [subjectKey, setSubjectKey] = useState('math');
  const [topicId, setTopicId] = useState('mixed');
  const [questionCount, setQuestionCount] = useState(10);
  const [dueDate, setDueDate] = useState('Nov 15, 2026');

  const openAssignModal = (focus = { subjectKey: 'math', exerciseType: 'mixed' }) => {
    setSubjectKey(focus.subjectKey);
    setTopicId(focus.exerciseType);
    setAssignmentTitle('');
    setShowCreateModal(true);
  };

  const assignAgain = (asg) => {
    const { id, done, correct, status, ...rest } = asg;
    addAssignment(rest);
    showToast(isEn ? `Assigned again: ${asg.title}` : `ફરીથી ફાળવ્યું: ${asg.title}`);
  };

  // Opens the student lesson screens full-width so the teacher can teach from them in class
  const teachInClass = (tab) => {
    setCurrentRole('student');
    setIsMobileFrame(false);
    setActiveTab(tab);
  };

  const filteredStudents = studentsList.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) || s.rollNo.includes(searchTerm)
  );

  const handleCreateAssignment = (e) => {
    e.preventDefault();
    const topic = SUBJECTS[subjectKey].topics.find(t => t.id === topicId);
    const title = assignmentTitle.trim()
      || `${topic.title} – ${questionCount} ${isEn ? 'questions' : 'પ્રશ્નો'}`;

    addAssignment({
      title,
      subject: SUBJECTS[subjectKey].label,
      subjectKey,
      exerciseType: topicId,
      count: questionCount,
      dueDate,
      teacher: isEn ? 'Class Teacher' : 'વર્ગ શિક્ષક'
    });

    showToast(isEn 
      ? `Assignment "${title}" assigned to all students!` 
      : `નવું સ્વાધ્યાય "${title}" સમગ્ર વર્ગને સફળતાપૂર્વક ફાળવવામાં આવ્યું!`);
    setShowCreateModal(false);
    setAssignmentTitle('');
  };

  return (
    <div className="space-y-4 pb-6">
      {/* Teacher Welcome Header */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-800 to-slate-900 text-white rounded-2xl p-4 sm:p-5 shadow-lg relative overflow-hidden">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/20 text-white border border-white/30">
              {isEn ? 'Teacher Management Portal' : 'શિક્ષક પોર્ટલ'}
            </span>
            <h2 className="text-xl sm:text-2xl font-black mt-1">
              {isEn ? 'Mrs. Nitaben Joshi' : 'શ્રીમતી નીતાબેન જોશી'}
            </h2>
            <p className="text-xs text-blue-100 mt-0.5">
              {isEn 
                ? 'Grade 4 - Special Needs Classroom (5 Enrolled Students)' 
                : 'ધોરણ ૪ - પ્રજ્ઞાચક્ષુ અને મૂકબધિર વિશેષ વર્ગ (૫ વિદ્યાર્થીઓ)'}
            </p>
          </div>

          <button
            onClick={() => openAssignModal()}
            className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition flex items-center gap-1.5 shadow-md self-start sm:self-auto"
          >
            <PlusCircle className="w-4 h-4" />
            <span>{isEn ? '+ Assign New Work' : 'નવું સ્વાધ્યાય આપો'}</span>
          </button>
        </div>
      </div>

      {/* Class Metric Highlights */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs text-center">
          <span className="text-[11px] font-bold text-slate-500">
            {isEn ? 'Class Average Progress' : 'વર્ગ સરેરાશ પ્રગતિ'}
          </span>
          <div className="text-2xl font-black text-blue-600 mt-1">78%</div>
          <p className="text-[10px] text-emerald-600 font-bold mt-0.5">
            {isEn ? '+5% this month' : '+૫% આ મહિને'}
          </p>
        </div>

        <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs text-center">
          <span className="text-[11px] font-bold text-slate-500">
            {isEn ? 'Active Students' : 'કુલ સક્રિય વિદ્યાર્થીઓ'}
          </span>
          <div className="text-2xl font-black text-slate-800 mt-1">5 / 5</div>
          <p className="text-[10px] text-slate-400 mt-0.5">
            {isEn ? '100% Active' : '૧૦૦% હાજરી'}
          </p>
        </div>

        <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs text-center">
          <span className="text-[11px] font-bold text-slate-500">
            {isEn ? 'Completed Homework' : 'પૂર્ણ થયેલ સ્વાધ્યાય'}
          </span>
          <div className="text-2xl font-black text-emerald-600 mt-1">{completedCount} / {assignments.length}</div>
          <p className="text-[10px] text-slate-400 mt-0.5">
            {isEn ? 'Assignments done' : 'પૂર્ણ સ્વાધ્યાય'}
          </p>
        </div>

        <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs text-center">
          <span className="text-[11px] font-bold text-slate-500">
            {isEn ? 'Area Needing Focus' : 'મહાવરો જરૂરી ક્ષેત્ર'}
          </span>
          <div className="text-sm font-black text-amber-600 mt-2">
            {isEn ? 'Subtraction & Division' : 'બાદબાકી & ભાગાકાર'}
          </div>
          <p className="text-[10px] text-slate-400 mt-0.5">
            {isEn ? 'Mathematics' : 'ગણિત વિષય'}
          </p>
        </div>
      </div>

      {/* Teach in class: open lesson screens full-width */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 space-y-3">
        <div>
          <h3 className="text-base font-bold text-slate-900">{isEn ? 'Teach in Class' : 'વર્ગમાં ભણાવો'}</h3>
          <p className="text-xs text-slate-500">
            {isEn ? 'Open a lesson full-screen to teach with signs, visuals and examples.' : 'સંકેતો અને ચિત્રો સાથે ભણાવવા પાઠ મોટી સ્ક્રીન પર ખોલો.'}
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {[
            { tab: 'gujarati', icon: '🔤', en: 'Gujarati letters & numbers', gu: 'ગુજરાતી અક્ષરો અને સંખ્યા' },
            { tab: 'math', icon: '➗', en: 'Maths: tables & operations', gu: 'ગણિત: ઘડિયા અને ક્રિયાઓ' },
            { tab: 'science', icon: '🔬', en: 'Science lessons', gu: 'વિજ્ઞાનના પાઠ' }
          ].map(l => (
            <button
              key={l.tab}
              onClick={() => teachInClass(l.tab)}
              className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-300 text-left transition"
            >
              <span className="text-2xl">{l.icon}</span>
              <span className="text-xs font-bold text-slate-800">{isEn ? l.en : l.gu}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Assigned practice sets and their progress */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 space-y-3">
        <div>
          <h3 className="text-base font-bold text-slate-900">{isEn ? 'Assigned Practice' : 'આપેલ મહાવરો'}</h3>
          <p className="text-xs text-slate-500">
            {isEn
              ? 'Live progress of Aarav Patel (demo student). Assign a set again to repeat the practice.'
              : 'આરવ પટેલ (ડેમો વિદ્યાર્થી)ની પ્રગતિ. મહાવરો ફરી કરાવવા ફરીથી ફાળવો.'}
          </p>
        </div>
        {assignments.length === 0 && (
          <p className="text-xs text-slate-400">{isEn ? 'No practice assigned yet.' : 'હજુ કોઈ મહાવરો આપ્યો નથી.'}</p>
        )}
        <div className="space-y-2">
          {assignments.map(asg => {
            const finished = asg.status === 'પૂર્ણ';
            return (
              <div key={asg.id} className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 p-3 rounded-xl bg-slate-50 border border-slate-200">
                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm font-bold text-slate-900 truncate">{asg.title}</p>
                  <p className="text-[11px] text-slate-500">
                    {isEn ? SUBJECTS[asg.subjectKey]?.en : asg.subject} · {isEn ? 'Due' : 'મુદત'} {asg.dueDate}
                  </p>
                </div>
                <div className="flex items-center gap-2 sm:w-56">
                  <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${finished ? 'bg-emerald-500' : 'bg-blue-600'}`}
                      style={{ width: `${(100 * asg.done) / asg.count}%` }}
                    />
                  </div>
                  <span className="text-[11px] font-bold text-slate-700 whitespace-nowrap">
                    {asg.done}/{asg.count} · {isEn ? `${asg.correct} correct` : `${asg.correct} સાચા`}
                  </span>
                </div>
                <button
                  onClick={() => assignAgain(asg)}
                  className="px-2.5 py-1 rounded-lg bg-white border border-slate-300 text-slate-700 hover:bg-slate-100 font-bold text-[11px] transition inline-flex items-center gap-1 self-start sm:self-auto"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>{isEn ? 'Assign again' : 'ફરી ફાળવો'}</span>
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Class Students Roster */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-2 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              {isEn ? 'Class Student Roster & Topic Mastery' : 'વર્ગના વિદ્યાર્થીઓ અને પ્રગતિ'}
            </h3>
            <p className="text-xs text-slate-500">
              {isEn ? 'Individual subject scores, strengths, and areas needing support' : 'દરેક વિદ્યાર્થીની વિષયવાર સિદ્ધિ અને નબળા મુદ્દાઓ'}
            </p>
          </div>

          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder={isEn ? "Search student..." : "વિદ્યાર્થી શોધો..."}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-48"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200">
                <th className="p-3">{isEn ? 'Roll No.' : 'રોલ નં.'}</th>
                <th className="p-3">{isEn ? 'Student Name' : 'નામ'}</th>
                <th className="p-3">{isEn ? 'Progress' : 'પ્રગતિ'}</th>
                <th className="p-3">{isEn ? 'Accuracy' : 'ચોકસાઈ'}</th>
                <th className="p-3">{isEn ? 'Key Strength' : 'મજબૂત મુદ્દો'}</th>
                <th className="p-3">{isEn ? 'Needs Practice' : 'સુધારણા ક્ષેત્ર'}</th>
                <th className="p-3 text-right">{isEn ? 'Action' : 'ક્રિયા'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStudents.map(student => (
                <tr key={student.id} className="hover:bg-slate-50/80 transition">
                  <td className="p-3 font-mono font-bold text-slate-700">{student.rollNo}</td>
                  <td className="p-3 font-bold text-slate-900">{student.name}</td>
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-2 bg-slate-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-blue-600 rounded-full" 
                          style={{ width: `${student.progress}%` }} 
                        />
                      </div>
                      <span className="font-bold text-blue-700">{student.progress}%</span>
                    </div>
                  </td>
                  <td className="p-3 font-bold text-emerald-600">{student.accuracy}</td>
                  <td className="p-3 text-slate-600">{student.strongTopic}</td>
                  <td className="p-3">
                    <div className="flex items-center gap-1.5">
                      <span className="text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 font-medium">
                        {student.weakTopic}
                      </span>
                      {student.focus && (
                        <button
                          onClick={() => openAssignModal(student.focus)}
                          title={isEn ? 'Assign practice for this topic' : 'આ વિષયનો મહાવરો આપો'}
                          className="p-1 rounded-md bg-blue-50 text-blue-700 hover:bg-blue-100 transition"
                        >
                          <PlusCircle className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </td>
                  <td className="p-3 text-right">
                    <button
                      onClick={() => setSelectedStudentForDetail(student)}
                      className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 font-bold text-[11px] transition inline-flex items-center gap-1"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>{isEn ? 'Details' : 'વિગત'}</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Assignment Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-3 animate-fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 space-y-4 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-bold text-base text-slate-900">
                {isEn ? 'Assign Practice Exercise' : 'નવું સ્વાધ્યાય આપો'}
              </h3>
              <button 
                onClick={() => setShowCreateModal(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateAssignment} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  {isEn ? 'Subject:' : 'વિષય:'}
                </label>
                <select
                  value={subjectKey}
                  onChange={(e) => {
                    setSubjectKey(e.target.value);
                    setTopicId(SUBJECTS[e.target.value].topics[0].id);
                  }}
                  className="w-full p-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                >
                  {Object.entries(SUBJECTS).map(([key, sub]) => (
                    <option key={key} value={key}>{isEn ? sub.en : sub.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  {isEn ? 'Topic:' : 'મુદ્દો:'}
                </label>
                <select
                  value={topicId}
                  onChange={(e) => setTopicId(e.target.value)}
                  className="w-full p-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                >
                  {SUBJECTS[subjectKey].topics.map(t => (
                    <option key={t.id} value={t.id}>{t.title}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  {isEn ? 'Number of exercises:' : 'કુલ પ્રશ્નો:'}
                </label>
                <div className="flex gap-2">
                  {COUNTS.map(n => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => setQuestionCount(n)}
                      className={`flex-1 py-2 rounded-xl text-xs font-bold border transition ${
                        questionCount === n ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      {n}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  {isEn ? 'Note for students (optional):' : 'વિદ્યાર્થીઓ માટે નોંધ (વૈકલ્પિક):'}
                </label>
                <input
                  type="text"
                  placeholder={isEn ? 'Leave empty to use the topic name' : 'ખાલી રાખો તો મુદ્દાનું નામ વપરાશે'}
                  value={assignmentTitle}
                  onChange={(e) => setAssignmentTitle(e.target.value)}
                  className="w-full p-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  {isEn ? 'Due Date:' : 'પૂર્ણ કરવાની મુદત:'}
                </label>
                <input
                  type="text"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full p-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  {isEn ? 'Cancel' : 'રદ કરો'}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md transition"
                >
                  {isEn ? 'Assign to Class' : 'સ્વાધ્યાય ફાળવો'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Student Detail Modal */}
      {selectedStudentForDetail && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-3 animate-fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 space-y-4 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-base text-slate-900">{selectedStudentForDetail.name}</h3>
                <p className="text-xs text-slate-500">{isEn ? 'Roll Number:' : 'રોલ નંબર:'} {selectedStudentForDetail.rollNo}</p>
              </div>
              <button 
                onClick={() => setSelectedStudentForDetail(null)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex justify-between">
                <span className="text-slate-500 font-medium">{isEn ? 'Attendance Rate:' : 'હાજરી દર:'}</span>
                <span className="font-bold text-slate-800">{selectedStudentForDetail.attendance}</span>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex justify-between">
                <span className="text-slate-500 font-medium">{isEn ? 'Accuracy Rate:' : 'ચોકસાઈ દર:'}</span>
                <span className="font-bold text-emerald-600">{selectedStudentForDetail.accuracy}</span>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex justify-between">
                <span className="text-slate-500 font-medium">{isEn ? 'Strongest Topic:' : 'સૌથી મજબૂત મુદ્દો:'}</span>
                <span className="font-bold text-blue-700">{selectedStudentForDetail.strongTopic}</span>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex justify-between">
                <span className="text-slate-500 font-medium">{isEn ? 'Needs Focus:' : 'ધ્યાન આપવા જેવો મુદ્દો:'}</span>
                <span className="font-bold text-amber-700">{selectedStudentForDetail.weakTopic}</span>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedStudentForDetail(null)}
                className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold"
              >
                {isEn ? 'Close' : 'બંધ કરો'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
