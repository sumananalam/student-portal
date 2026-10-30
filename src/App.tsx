import React, { useState, useEffect } from 'react';
import { 
  GraduationCap, 
  BookOpen, 
  Code2, 
  Terminal, 
  UserCheck, 
  FileText, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  Cpu, 
  Database, 
  Server, 
  Layers, 
  Award, 
  Clock, 
  Send, 
  Copy, 
  Check, 
  ExternalLink,
  ShieldCheck,
  BookMarked,
  Activity,
  ChevronRight
} from 'lucide-react';

export default function App() {
  const [currentView, setCurrentView] = useState<'welcome' | 'dashboard'>('welcome');
  const [activeTab, setActiveTab] = useState<'overview' | 'courses' | 'assignments' | 'code' | 'api' | 'ai'>('overview');
  
  // Student data & state
  const [student, setStudent] = useState<any>(null);
  const [courses, setCourses] = useState<any[]>([]);
  const [assignments, setAssignments] = useState<any[]>([]);
  const [springFiles, setSpringFiles] = useState<any[]>([]);
  const [selectedFileIndex, setSelectedFileIndex] = useState(0);
  const [copiedCode, setCopiedCode] = useState(false);

  // AI Chat state
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiChatHistory, setAiChatHistory] = useState<Array<{role: string, text: string}>>([
    { role: 'assistant', text: 'Hello Alex! I am Professor AI, your Spring Boot & Java academic advisor. How can I help you master your coursework today?' }
  ]);

  // REST API Tester state
  const [apiEndpoint, setApiEndpoint] = useState('/api/student');
  const [apiMethod, setApiMethod] = useState('GET');
  const [apiResponse, setApiResponse] = useState<string>('// Click "Send Request" to test Spring Boot backend endpoints');
  const [apiLoading, setApiLoading] = useState(false);

  // Toast notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    fetchStudentData();
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const fetchStudentData = async () => {
    try {
      const [stuRes, courseRes, assignRes, codeRes] = await Promise.all([
        fetch('/api/student').then(r => r.json()),
        fetch('/api/courses').then(r => r.json()),
        fetch('/api/assignments').then(r => r.json()),
        fetch('/api/springboot/source').then(r => r.json())
      ]);

      if (stuRes.success) setStudent(stuRes.data);
      if (courseRes.success) setCourses(courseRes.data);
      if (assignRes.success) setAssignments(assignRes.data);
      if (codeRes.success) setSpringFiles(codeRes.files);
    } catch (err) {
      console.error("Failed to load backend data", err);
    }
  };

  const handleAssignmentSubmit = async (id: number) => {
    try {
      const res = await fetch(`/api/assignments/${id}/submit`, { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        showToast(data.message);
        fetchStudentData();
      }
    } catch (err) {
      showToast('Error submitting assignment');
    }
  };

  const handleAiSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiPrompt.trim() || aiLoading) return;

    const userMsg = aiPrompt;
    setAiPrompt('');
    setAiChatHistory(prev => [...prev, { role: 'user', text: userMsg }]);
    setAiLoading(true);

    try {
      const res = await fetch('/api/ai/study-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: userMsg, studentContext: student })
      });
      const data = await res.json();
      if (data.success) {
        setAiChatHistory(prev => [...prev, { role: 'assistant', text: data.text }]);
      } else {
        setAiChatHistory(prev => [...prev, { role: 'assistant', text: 'Sorry, I encountered an error answering your request.' }]);
      }
    } catch (err) {
      setAiChatHistory(prev => [...prev, { role: 'assistant', text: 'Network connection error with Gemini AI service.' }]);
    } finally {
      setAiLoading(false);
    }
  };

  const runApiTest = async () => {
    setApiLoading(true);
    try {
      const res = await fetch(apiEndpoint, { method: apiMethod });
      const data = await res.json();
      setApiResponse(JSON.stringify(data, null, 2));
    } catch (err: any) {
      setApiResponse(JSON.stringify({ error: err.message || 'Request failed' }, null, 2));
    } finally {
      setApiLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
    showToast('Spring Boot source code copied to clipboard!');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-indigo-500 selection:text-white relative overflow-hidden">
      {/* Background Decorative Gradients */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 bg-indigo-600 text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 border border-indigo-400/30 animate-bounce">
          <Sparkles className="w-5 h-5 text-indigo-200 animate-spin" />
          <span className="font-medium text-sm">{toastMessage}</span>
        </div>
      )}

      {/* WELCOME LANDING VIEW */}
      {currentView === 'welcome' && (
        <div className="relative min-h-screen flex flex-col items-center justify-center px-4 py-16">
          {/* Top Brand Bar */}
          <div className="absolute top-6 left-6 md:left-12 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-emerald-500 flex items-center justify-center shadow-lg shadow-indigo-500/30">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-white via-slate-200 to-indigo-300 bg-clip-text text-transparent">Apex University</span>
              <span className="block text-xs text-indigo-400 font-medium">Spring Boot Enterprise Edition</span>
            </div>
          </div>

          <div className="max-w-4xl mx-auto text-center space-y-8 z-10 mt-12">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-950/80 border border-indigo-500/30 text-indigo-300 text-xs font-semibold tracking-wide uppercase shadow-lg shadow-indigo-900/20">
              <Server className="w-4 h-4 text-emerald-400" />
              Powered by Java & Spring Boot 3.4 Microservices
            </div>

            {/* Welcome Heading */}
            <div className="space-y-4">
              <h2 className="text-indigo-400 font-semibold tracking-wider uppercase text-sm">Welcome, Student! 🎓</h2>
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-tight">
                Student Portal <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-emerald-400 bg-clip-text text-transparent">Enterprise Hub</span>
              </h1>
              <p className="max-w-2xl mx-auto text-slate-400 text-lg sm:text-xl font-normal leading-relaxed">
                Your centralized gateway for coursework, grade tracking, assignment submissions, live REST endpoints, and AI-powered academic tutoring.
              </p>
            </div>

            {/* Interactive Call to Action */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => setCurrentView('dashboard')}
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-emerald-600 hover:from-indigo-500 hover:to-emerald-500 text-white font-bold text-lg shadow-xl shadow-indigo-600/30 transition-all duration-300 transform hover:-translate-y-1 flex items-center justify-center gap-3 group"
              >
                <span>Get Started</span>
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </button>
              <button
                onClick={() => {
                  setCurrentView('dashboard');
                  setActiveTab('code');
                }}
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-slate-900/80 hover:bg-slate-800 text-slate-200 font-semibold text-lg border border-slate-700/60 shadow-lg transition-all duration-300 flex items-center justify-center gap-2"
              >
                <Code2 className="w-5 h-5 text-indigo-400" />
                <span>View Spring Boot Source Code</span>
              </button>
            </div>

            {/* Feature Highlights Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-12 text-left">
              <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl shadow-xl hover:border-indigo-500/40 transition-colors">
                <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-4">
                  <Database className="w-6 h-6" />
                </div>
                <h3 className="text-white font-semibold text-lg mb-2">Spring Boot & JPA</h3>
                <p className="text-slate-400 text-sm">Robust enterprise backend architecture simulating H2 in-memory relational database entities and REST controllers.</p>
              </div>

              <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl shadow-xl hover:border-emerald-500/40 transition-colors">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-4">
                  <Sparkles className="w-6 h-6" />
                </div>
                <h3 className="text-white font-semibold text-lg mb-2">AI Professor Assistant</h3>
                <p className="text-slate-400 text-sm">Get instant tutoring, code explanations, and assignment help powered by Google Gemini AI server-side SDK.</p>
              </div>

              <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl shadow-xl hover:border-purple-500/40 transition-colors">
                <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 mb-4">
                  <Terminal className="w-6 h-6" />
                </div>
                <h3 className="text-white font-semibold text-lg mb-2">Interactive REST API</h3>
                <p className="text-slate-400 text-sm">Test live backend endpoints (`/api/student`, `/api/courses`) directly in your browser with real-time JSON responses.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* DASHBOARD VIEW */}
      {currentView === 'dashboard' && (
        <div className="min-h-screen flex flex-col">
          {/* Top Header */}
          <header className="border-b border-slate-800 bg-slate-900/70 backdrop-blur-md sticky top-0 z-40">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
              <div className="flex items-center gap-4 cursor-pointer" onClick={() => setCurrentView('welcome')}>
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-emerald-500 flex items-center justify-center shadow-lg shadow-indigo-500/30">
                  <GraduationCap className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="font-bold text-lg tracking-tight text-white">Apex University</h1>
                  <span className="text-xs text-emerald-400 font-medium flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    Spring Boot App Running (Port 8080)
                  </span>
                </div>
              </div>

              {/* Student Profile Pill */}
              {student && (
                <div className="flex items-center gap-4">
                  <div className="hidden sm:block text-right">
                    <div className="font-semibold text-sm text-white">{student.name}</div>
                    <div className="text-xs text-slate-400">{student.id} • GPA: {student.gpa}</div>
                  </div>
                  <img src={student.avatar} alt={student.name} className="w-11 h-11 rounded-full border-2 border-indigo-500/40 object-cover shadow-md" />
                  <button
                    onClick={() => setCurrentView('welcome')}
                    className="text-xs px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium transition-colors border border-slate-700"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>

            {/* Navigation Tabs */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex space-x-1 sm:space-x-4 overflow-x-auto scrollbar-none py-2 border-t border-slate-800/60">
              {[
                { id: 'overview', label: 'Dashboard', icon: Activity },
                { id: 'courses', label: 'Enrolled Courses', icon: BookOpen },
                { id: 'assignments', label: 'Assignments', icon: FileText },
                { id: 'code', label: 'Spring Boot Code', icon: Code2 },
                { id: 'api', label: 'REST API Tester', icon: Terminal },
                { id: 'ai', label: 'AI Study Assistant', icon: Sparkles }
              ].map(tab => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all whitespace-nowrap ${
                      isActive 
                        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30' 
                        : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </header>

          {/* Main Content Area */}
          <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* OVERVIEW TAB */}
            {activeTab === 'overview' && student && (
              <div className="space-y-8">
                {/* Welcome Banner Card */}
                <div className="p-8 rounded-3xl bg-gradient-to-r from-indigo-900/50 via-slate-900 to-purple-900/40 border border-indigo-500/30 shadow-2xl relative overflow-hidden">
                  <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
                  <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div className="space-y-2">
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-semibold border border-emerald-500/20">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        Active Enrolled Student
                      </div>
                      <h2 className="text-3xl font-bold text-white">Welcome back, {student.name}! 👋</h2>
                      <p className="text-slate-300 text-sm max-w-xl">
                        You are enrolled in <span className="text-indigo-400 font-semibold">{courses.length} enterprise courses</span> this semester. Your current cumulative GPA is <span className="text-emerald-400 font-bold">{student.gpa}</span>.
                      </p>
                    </div>
                    <div className="flex gap-3">
                      <button 
                        onClick={() => setActiveTab('courses')}
                        className="px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-2"
                      >
                        <BookOpen className="w-4 h-4" />
                        View Courses
                      </button>
                      <button 
                        onClick={() => setActiveTab('ai')}
                        className="px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-sm border border-slate-700 transition-all flex items-center gap-2"
                      >
                        <Sparkles className="w-4 h-4 text-purple-400" />
                        Ask AI Tutor
                      </button>
                    </div>
                  </div>
                </div>

                {/* Quick Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-indigo-600/10 border border-indigo-600/20 flex items-center justify-center text-indigo-400">
                      <Award className="w-7 h-7" />
                    </div>
                    <div>
                      <div className="text-slate-400 text-xs font-medium uppercase tracking-wider">Cumulative GPA</div>
                      <div className="text-2xl font-bold text-white mt-1">{student.gpa} / 4.00</div>
                    </div>
                  </div>

                  <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-emerald-600/10 border border-emerald-600/20 flex items-center justify-center text-emerald-400">
                      <BookMarked className="w-7 h-7" />
                    </div>
                    <div>
                      <div className="text-slate-400 text-xs font-medium uppercase tracking-wider">Active Courses</div>
                      <div className="text-2xl font-bold text-white mt-1">{courses.length} Classes</div>
                    </div>
                  </div>

                  <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-purple-600/10 border border-purple-600/20 flex items-center justify-center text-purple-400">
                      <FileText className="w-7 h-7" />
                    </div>
                    <div>
                      <div className="text-slate-400 text-xs font-medium uppercase tracking-wider">Pending Tasks</div>
                      <div className="text-2xl font-bold text-white mt-1">
                        {assignments.filter(a => a.status === 'Pending').length} Assignments
                      </div>
                    </div>
                  </div>

                  <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-amber-600/10 border border-amber-600/20 flex items-center justify-center text-amber-400">
                      <Clock className="w-7 h-7" />
                    </div>
                    <div>
                      <div className="text-slate-400 text-xs font-medium uppercase tracking-wider">Academic Year</div>
                      <div className="text-lg font-bold text-white mt-1">Junior (2026-27)</div>
                    </div>
                  </div>
                </div>

                {/* Recent Courses & Announcements */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2 space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-bold text-white flex items-center gap-2">
                        <BookOpen className="w-5 h-5 text-indigo-400" />
                        Enrolled Courses Overview
                      </h3>
                      <button onClick={() => setActiveTab('courses')} className="text-sm text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1">
                        View all <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {courses.map((course, idx) => (
                        <div key={idx} className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-indigo-500/40 transition-colors space-y-3">
                          <div className="flex justify-between items-start">
                            <span className="px-2.5 py-1 rounded-lg bg-indigo-500/10 text-indigo-400 text-xs font-bold border border-indigo-500/20">{course.id}</span>
                            <span className="text-emerald-400 font-bold text-sm">Grade: {course.grade}</span>
                          </div>
                          <h4 className="font-semibold text-white text-base leading-snug">{course.name}</h4>
                          <div className="text-xs text-slate-400 flex justify-between pt-2 border-t border-slate-800">
                            <span>Instructor: {course.instructor}</span>
                            <span>{course.credits} Credits</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Sidebar Announcements */}
                  <div className="space-y-6">
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                      <Activity className="w-5 h-5 text-emerald-400" />
                      University Notices
                    </h3>
                    <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
                      <div className="border-b border-slate-800 pb-4 space-y-1">
                        <div className="flex justify-between text-xs text-slate-400">
                          <span className="text-indigo-400 font-medium">Spring Boot Hackathon</span>
                          <span>Oct 28</span>
                        </div>
                        <p className="text-sm text-slate-200 font-medium">Build microservice applications with Spring Cloud and win cash prizes!</p>
                      </div>

                      <div className="border-b border-slate-800 pb-4 space-y-1">
                        <div className="flex justify-between text-xs text-slate-400">
                          <span className="text-emerald-400 font-medium">Midterm Grades Published</span>
                          <span>Oct 25</span>
                        </div>
                        <p className="text-sm text-slate-200 font-medium">Semester GPA reports are now available in your academic records.</p>
                      </div>

                      <div className="space-y-1">
                        <div className="flex justify-between text-xs text-slate-400">
                          <span className="text-purple-400 font-medium">Library Maintenance</span>
                          <span>Oct 20</span>
                        </div>
                        <p className="text-sm text-slate-200 font-medium">Online journal databases will undergo scheduled maintenance tonight.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* COURSES TAB */}
            {activeTab === 'courses' && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <h2 className="text-2xl font-bold text-white">Spring Semester Courses</h2>
                    <p className="text-slate-400 text-sm">Manage your enrolled courses and review Spring Boot syllabus modules.</p>
                  </div>
                  <button
                    onClick={() => showToast('Course registration open for Summer term!')}
                    className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-2"
                  >
                    <span>+ Enroll New Course</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {courses.map((course, idx) => (
                    <div key={idx} className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="px-3 py-1 rounded-lg bg-indigo-500/10 text-indigo-400 text-xs font-bold border border-indigo-500/20">{course.id}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-slate-400">{course.credits} Credits</span>
                          <span className="px-2.5 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 font-bold text-xs">{course.grade}</span>
                        </div>
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-white">{course.name}</h3>
                        <p className="text-sm text-slate-400 mt-1">Instructor: <span className="text-slate-200 font-medium">{course.instructor}</span></p>
                      </div>
                      <div className="pt-3 border-t border-slate-800 flex justify-between items-center text-xs text-slate-400">
                        <span>Schedule: {course.schedule}</span>
                        <button onClick={() => showToast(`Downloaded syllabus for ${course.id}`)} className="text-indigo-400 hover:underline font-medium">Download Syllabus</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ASSIGNMENTS TAB */}
            {activeTab === 'assignments' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-white">Assignments & Submissions</h2>
                  <p className="text-slate-400 text-sm">Submit your programming labs and coursework to the Spring Boot REST backend.</p>
                </div>

                <div className="space-y-4">
                  {assignments.map((assignment) => (
                    <div key={assignment.id} className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-3">
                          <span className="px-2.5 py-0.5 rounded-md bg-indigo-500/10 text-indigo-400 text-xs font-bold border border-indigo-500/20">{assignment.course}</span>
                          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                            assignment.status === 'Submitted' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                          }`}>
                            {assignment.status}
                          </span>
                        </div>
                        <h3 className="font-semibold text-white text-base">{assignment.title}</h3>
                        <p className="text-xs text-slate-400">Due Date: {assignment.dueDate} • Score: {assignment.score}</p>
                      </div>

                      <div>
                        {assignment.status === 'Pending' ? (
                          <button
                            onClick={() => handleAssignmentSubmit(assignment.id)}
                            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-2"
                          >
                            <Send className="w-4 h-4" />
                            <span>Submit Solution</span>
                          </button>
                        ) : (
                          <div className="px-4 py-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium text-xs flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4" />
                            <span>Submitted & Graded</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* SPRING BOOT CODE VIEWER TAB */}
            {activeTab === 'code' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-white">Spring Boot Source Code Repository</h2>
                  <p className="text-slate-400 text-sm">Explore the actual Java source code files powering the Spring Boot enterprise application.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                  {/* File Tree Sidebar */}
                  <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2 h-fit">
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-wider px-2 py-1">Project Structure</div>
                    {springFiles.map((file, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedFileIndex(idx)}
                        className={`w-full text-left px-3 py-2.5 rounded-xl font-mono text-xs flex items-center gap-2.5 transition-all ${
                          selectedFileIndex === idx
                            ? 'bg-indigo-600 text-white font-semibold shadow-md'
                            : 'text-slate-300 hover:bg-slate-800/60'
                        }`}
                      >
                        <Code2 className="w-4 h-4 text-indigo-300 shrink-0" />
                        <span className="truncate">{file.filename}</span>
                      </button>
                    ))}
                  </div>

                  {/* Code Viewer Panel */}
                  <div className="lg:col-span-3 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden flex flex-col">
                    {springFiles[selectedFileIndex] && (
                      <>
                        <div className="px-6 py-4 bg-slate-950 border-b border-slate-800 flex justify-between items-center">
                          <div>
                            <div className="font-mono text-xs text-indigo-400 font-semibold">{springFiles[selectedFileIndex].path}</div>
                            <div className="text-xs text-slate-400">Language: {springFiles[selectedFileIndex].language.toUpperCase()}</div>
                          </div>
                          <button
                            onClick={() => copyToClipboard(springFiles[selectedFileIndex].code)}
                            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-xs border border-slate-700 flex items-center gap-1.5 transition-colors"
                          >
                            {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                            <span>{copiedCode ? 'Copied!' : 'Copy Code'}</span>
                          </button>
                        </div>
                        <div className="p-6 overflow-x-auto bg-slate-950/85">
                          <pre className="font-mono text-xs sm:text-sm text-slate-200 leading-relaxed">
                            <code>{springFiles[selectedFileIndex].code}</code>
                          </pre>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* REST API TESTER TAB */}
            {activeTab === 'api' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-white">Spring Boot REST API Console</h2>
                  <p className="text-slate-400 text-sm">Test live backend REST endpoints simulating Spring MVC DispatcherServlet responses.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Request Builder */}
                  <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-6">
                    <h3 className="font-semibold text-white text-lg">Endpoint Configuration</h3>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-medium text-slate-400 mb-1 uppercase tracking-wider">HTTP Method & Endpoint</label>
                        <div className="flex gap-2">
                          <select 
                            value={apiMethod} 
                            onChange={(e) => setApiMethod(e.target.value)}
                            className="px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white font-mono text-sm focus:outline-none focus:border-indigo-500"
                          >
                            <option value="GET">GET</option>
                            <option value="POST">POST</option>
                          </select>
                          <input 
                            type="text" 
                            value={apiEndpoint}
                            onChange={(e) => setApiEndpoint(e.target.value)}
                            className="flex-1 px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white font-mono text-sm focus:outline-none focus:border-indigo-500"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider">Quick Select Endpoints</label>
                        <div className="flex flex-wrap gap-2">
                          {[
                            { label: '/api/student', path: '/api/student' },
                            { label: '/api/courses', path: '/api/courses' },
                            { label: '/api/assignments', path: '/api/assignments' }
                          ].map((ep, i) => (
                            <button
                              key={i}
                              onClick={() => { setApiEndpoint(ep.path); setApiMethod('GET'); }}
                              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-indigo-300 font-mono text-xs border border-slate-700 transition-colors"
                            >
                              {ep.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      <button
                        onClick={runApiTest}
                        disabled={apiLoading}
                        className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2"
                      >
                        <Terminal className="w-4 h-4" />
                        <span>{apiLoading ? 'Executing Request...' : 'Send API Request'}</span>
                      </button>
                    </div>
                  </div>

                  {/* Response Console */}
                  <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="font-semibold text-white text-lg">Response JSON</h3>
                      <span className="px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-400 text-xs font-mono font-bold border border-emerald-500/20">HTTP 200 OK</span>
                    </div>
                    <div className="flex-1 bg-slate-950 rounded-xl p-4 border border-slate-800 overflow-x-auto min-h-[250px]">
                      <pre className="font-mono text-xs text-emerald-300 leading-relaxed">
                        {apiResponse}
                      </pre>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* AI STUDY ASSISTANT TAB */}
            {activeTab === 'ai' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-white">Professor AI Study Assistant</h2>
                  <p className="text-slate-400 text-sm">Ask questions about Java, Spring Boot microservices, algorithms, or homework guidance.</p>
                </div>

                <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col h-[600px] shadow-2xl">
                  {/* Chat messages */}
                  <div className="flex-1 overflow-y-auto space-y-4 pr-2">
                    {aiChatHistory.map((msg, idx) => (
                      <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-xl rounded-2xl px-5 py-3.5 text-sm leading-relaxed ${
                          msg.role === 'user' 
                            ? 'bg-indigo-600 text-white shadow-md' 
                            : 'bg-slate-800 text-slate-200 border border-slate-700'
                        }`}>
                          {msg.role === 'assistant' && (
                            <div className="flex items-center gap-2 mb-1.5 text-xs font-bold text-indigo-400">
                              <Sparkles className="w-3.5 h-3.5" />
                              <span>Professor AI</span>
                            </div>
                          )}
                          <p className="whitespace-pre-wrap">{msg.text}</p>
                        </div>
                      </div>
                    ))}
                    {aiLoading && (
                      <div className="flex justify-start">
                        <div className="bg-slate-800 border border-slate-700 text-slate-300 rounded-2xl px-5 py-3.5 text-sm flex items-center gap-3">
                          <Sparkles className="w-4 h-4 text-indigo-400 animate-spin" />
                          <span>Professor AI is thinking...</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Chat Input Form */}
                  <form onSubmit={handleAiSubmit} className="mt-4 pt-4 border-t border-slate-800 flex gap-3">
                    <input
                      type="text"
                      value={aiPrompt}
                      onChange={(e) => setAiPrompt(e.target.value)}
                      placeholder="Ask about Spring Boot annotations, JPA repositories, or homework help..."
                      className="flex-1 px-4 py-3 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500"
                    />
                    <button
                      type="submit"
                      disabled={aiLoading}
                      className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-2 shrink-0"
                    >
                      <Send className="w-4 h-4" />
                      <span>Send</span>
                    </button>
                  </form>
                </div>
              </div>
            )}
          </main>
        </div>
      )}
    </div>
  );
}
