'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '../../src/components/Navbar';
import Footer from '../../src/components/Footer';
import { useLanguage, LanguageProvider } from '../../src/context/LanguageContext';
import { MATHSBOOK_CONFIG } from '../../src/config/mathsbookConfig';
import { 
  CheckCircle2, XCircle, AlertCircle, Award, BookOpen, Clock, 
  ArrowRight, ArrowLeft, RotateCcw, MessageSquare, Lock, 
  User, LogOut, Check, HelpCircle, ChevronRight, Sparkles, Send, FileText
} from 'lucide-react';

function ExamPlatformContent() {
    const { language } = useLanguage();

    // Student Authentication State
    const [user, setUser] = useState(null);
    const [authMode, setAuthMode] = useState('signin'); // 'signin' | 'signup'
    const [authPhone, setAuthPhone] = useState('');
    const [authPassword, setAuthPassword] = useState('');
    const [authName, setAuthName] = useState('');
    const [authLoading, setAuthLoading] = useState(false);
    const [authError, setAuthError] = useState('');
    const [authSuccess, setAuthSuccess] = useState('');

    // Exam App View State: 'list' | 'taking' | 'result' | 'review'
    const [viewMode, setViewMode] = useState('list');

    // Papers list data
    const [papers, setPapers] = useState([]);
    const [loadingPapers, setLoadingPapers] = useState(true);

    // Active paper data
    const [activePaper, setActivePaper] = useState(null);
    const [loadingActivePaper, setLoadingActivePaper] = useState(false);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [studentAnswers, setStudentAnswers] = useState({}); // { [questionId]: 'A' | 'B' | 'C' | 'D' }

    // Evaluation & Results
    const [submitting, setSubmitting] = useState(false);
    const [examResult, setExamResult] = useState(null);
    const [showSubmitModal, setShowSubmitModal] = useState(false);

    // Check existing session & load papers
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('mathsbook_student_session');
            if (saved) {
                try {
                    setUser(JSON.parse(saved));
                } catch (e) {
                    console.error('Session error:', e);
                }
            }
        }
        fetchPapers();
    }, []);

    const fetchPapers = async () => {
        setLoadingPapers(true);
        try {
            const res = await fetch('/api/exams');
            const data = await res.json();
            if (res.ok && data.success) {
                setPapers(data.papers || []);
            }
        } catch (err) {
            console.error('Failed to load papers:', err);
        } finally {
            setLoadingPapers(false);
        }
    };

    // Student Login
    const handleSignIn = async (e) => {
        e.preventDefault();
        if (!authPhone.trim() || !authPassword.trim()) {
            setAuthError(language === 'si' ? 'කරුණාකර දුරකථන අංකය සහ මුරපදය ඇතුළත් කරන්න.' : 'Please enter phone number and password.');
            return;
        }

        setAuthLoading(true);
        setAuthError('');
        setAuthSuccess('');

        try {
            const res = await fetch('/api/auth/signin', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ phone: authPhone, password: authPassword })
            });
            const data = await res.json();

            if (res.ok && data.success) {
                setAuthSuccess('Successfully logged in!');
                setUser(data.user);
                if (typeof window !== 'undefined') {
                    localStorage.setItem('mathsbook_student_session', JSON.stringify(data.user));
                }
            } else {
                setAuthError(data.error || 'Sign in failed.');
            }
        } catch (err) {
            setAuthError('Error: ' + err.message);
        } finally {
            setAuthLoading(false);
        }
    };

    // Student Registration
    const handleSignUp = async (e) => {
        e.preventDefault();
        if (!authName.trim() || !authPhone.trim() || !authPassword.trim()) {
            setAuthError(language === 'si' ? 'කරුණාකර සියලු තොරතුරු ඇතුළත් කරන්න.' : 'Please fill all fields.');
            return;
        }

        setAuthLoading(true);
        setAuthError('');
        setAuthSuccess('');

        try {
            const res = await fetch('/api/auth/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: authName, phone: authPhone, password: authPassword })
            });
            const data = await res.json();

            if (res.ok && data.success) {
                setAuthSuccess('Free account created successfully!');
                setUser(data.user);
                if (typeof window !== 'undefined') {
                    localStorage.setItem('mathsbook_student_session', JSON.stringify(data.user));
                }
            } else {
                setAuthError(data.error || 'Sign up failed.');
            }
        } catch (err) {
            setAuthError('Error: ' + err.message);
        } finally {
            setAuthLoading(false);
        }
    };

    const handleLogout = () => {
        setUser(null);
        if (typeof window !== 'undefined') {
            localStorage.removeItem('mathsbook_student_session');
        }
        setViewMode('list');
        setActivePaper(null);
        setExamResult(null);
    };

    // Start Exam Paper
    const handleStartExam = async (paper) => {
        if (!user) {
            window.scrollTo({ top: 150, behavior: 'smooth' });
            return;
        }

        setLoadingActivePaper(true);
        try {
            const res = await fetch(`/api/exams?id=${paper.id}`);
            const data = await res.json();
            if (res.ok && data.success) {
                setActivePaper(data.paper);
                setCurrentQuestionIndex(0);
                setStudentAnswers({});
                setExamResult(null);
                setViewMode('taking');
                window.scrollTo({ top: 0, behavior: 'smooth' });
            } else {
                alert(data.error || 'Failed to start exam.');
            }
        } catch (err) {
            alert('Error loading paper: ' + err.message);
        } finally {
            setLoadingActivePaper(false);
        }
    };

    // Select Answer Option
    const handleSelectOption = (questionId, optionLetter) => {
        setStudentAnswers(prev => ({
            ...prev,
            [questionId]: optionLetter
        }));
    };

    // Submit Exam for Automatic Scoring
    const handleSubmitExam = async () => {
        setShowSubmitModal(false);
        setSubmitting(true);

        try {
            const res = await fetch('/api/exams', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    paperId: activePaper.id,
                    studentId: user?.id,
                    studentName: user?.name,
                    studentPhone: user?.phone,
                    answers: studentAnswers
                })
            });
            const data = await res.json();

            if (res.ok && data.success) {
                setExamResult(data.result);
                setViewMode('result');
                window.scrollTo({ top: 0, behavior: 'smooth' });
            } else {
                alert(data.error || 'Failed to submit exam.');
            }
        } catch (err) {
            alert('Error submitting exam: ' + err.message);
        } finally {
            setSubmitting(false);
        }
    };

    // Retake Paper
    const handleRetakeExam = () => {
        setStudentAnswers({});
        setExamResult(null);
        setCurrentQuestionIndex(0);
        setViewMode('taking');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Back to Papers List
    const handleBackToList = () => {
        setActivePaper(null);
        setExamResult(null);
        setStudentAnswers({});
        setViewMode('list');
        fetchPapers();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const answeredCount = activePaper?.questions
        ? activePaper.questions.filter(q => studentAnswers[q.id]).length
        : 0;
    const currentQ = activePaper?.questions ? activePaper.questions[currentQuestionIndex] : null;

    // Direct WhatsApp message link with paper info
    const whatsappUrl = `https://wa.me/${MATHSBOOK_CONFIG.tutor.whatsapp}?text=${encodeURIComponent(
        `Hello Sir, I have a question regarding MathsBook Online Exam (${activePaper ? activePaper.title : 'MCQ Paper'}). Student: ${user?.name || 'Student'}`
    )}`;

    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#FAF7F2', color: '#2C1810', fontFamily: "'Noto Sans Sinhala', 'Plus Jakarta Sans', sans-serif" }}>
            <Navbar />

            {/* Custom Light Cream + Brown Container */}
            <main style={{ flex: 1, paddingTop: '100px', paddingBottom: '80px' }} className="container">

                {/* =================================================================== */}
                {/* 1. HEADER (Soft Cream + Brown)                                      */}
                {/* =================================================================== */}
                <div style={{ textAlign: 'center', maxWidth: '780px', margin: '0 auto 2.5rem auto' }}>
                    <div style={{
                        display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                        background: '#EFEBE4', border: '1px solid #D7CCC8',
                        padding: '0.35rem 1.1rem', borderRadius: '999px', color: '#5D4037',
                        fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.9rem'
                    }}>
                        <Sparkles size={16} color="#8D6E63" /> 100% Free Online Mathematics MCQ Platform
                    </div>

                    <h1 style={{ fontSize: 'clamp(2rem, 4vw, 2.6rem)', fontWeight: 900, color: '#3E2723', lineHeight: 1.25, marginBottom: '0.6rem' }}>
                        {language === 'si' ? (
                            <>ගණිතය <span style={{ color: '#8D6E63' }}>Online MCQ ප්‍රශ්න පත්‍ර</span></>
                        ) : (
                            <>Mathematics <span style={{ color: '#8D6E63' }}>Online MCQ Papers</span></>
                        )}
                    </h1>

                    <p style={{ color: '#5D4037', fontSize: '1rem', lineHeight: 1.6 }}>
                        {language === 'si'
                            ? 'සෑම ප්‍රශ්න පත්‍රයකටම පෙනී සිට ස්වයංක්‍රීය ලකුණු සහ ප්‍රතිශත ලබාගන්න. අවසානයේ සෑම ප්‍රශ්නයකටම අදාළ පූර්ණ සිද්ධාන්ත විවරණ (Explanations) අධ්‍යයනය කරන්න.'
                            : 'Practice O/L Mathematics MCQ papers online for free. Get instant marks, percentage, motivational feedback, and in-depth theory explanations.'
                        }
                    </p>
                </div>

                {/* =================================================================== */}
                {/* 2. AUTHENTICATION SECTION (If not logged in)                        */}
                {/* =================================================================== */}
                {!user ? (
                    <div style={{
                        maxWidth: '500px', margin: '0 auto 3rem auto',
                        background: '#FFFFFF', border: '1px solid #E6DCCE',
                        borderRadius: '24px', padding: '2.2rem',
                        boxShadow: '0 10px 30px rgba(93, 64, 55, 0.08)'
                    }}>
                        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                            <div style={{
                                width: '52px', height: '52px', borderRadius: '16px',
                                background: '#EFEBE4', border: '1px solid #D7CCC8',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.75rem auto'
                            }}>
                                <Lock size={24} color="#5D4037" />
                            </div>
                            <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#3E2723', marginBottom: '0.3rem' }}>
                                {authMode === 'signin' ? (
                                    language === 'si' ? 'විභාගය ආරම්භ කිරීමට ඇතුල් වන්න' : 'Log in to Access Online Exams'
                                ) : (
                                    language === 'si' ? 'නොමිලේ ශිෂ්‍ය ගිණුමක් සාදන්න' : 'Create Free Student Account'
                                )}
                            </h3>
                            <p style={{ color: '#795548', fontSize: '0.85rem' }}>
                                {language === 'si' ? 'ප්‍රශ්න පත්‍ර සියල්ල සිසුන්ට 100%ක් නොමිලේ ලබාදේ.' : 'Access all MCQ papers completely free.'}
                            </p>
                        </div>

                        {/* Mode Switcher */}
                        <div style={{
                            display: 'flex', background: '#F5EFEB', padding: '4px',
                            borderRadius: '14px', border: '1px solid #E6DCCE', marginBottom: '1.25rem'
                        }}>
                            <button
                                onClick={() => { setAuthMode('signin'); setAuthError(''); setAuthSuccess(''); }}
                                style={{
                                    flex: 1, padding: '0.6rem', border: 'none', borderRadius: '10px',
                                    background: authMode === 'signin' ? '#5D4037' : 'transparent',
                                    color: authMode === 'signin' ? '#FFFFFF' : '#795548',
                                    fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer', transition: 'all 0.2s ease'
                                }}
                            >
                                {language === 'si' ? 'ඇතුල් වන්න (Sign In)' : 'Sign In'}
                            </button>
                            <button
                                onClick={() => { setAuthMode('signup'); setAuthError(''); setAuthSuccess(''); }}
                                style={{
                                    flex: 1, padding: '0.6rem', border: 'none', borderRadius: '10px',
                                    background: authMode === 'signup' ? '#5D4037' : 'transparent',
                                    color: authMode === 'signup' ? '#FFFFFF' : '#795548',
                                    fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer', transition: 'all 0.2s ease'
                                }}
                            >
                                {language === 'si' ? 'නව ගිණුමක් (Sign Up)' : 'Create Account'}
                            </button>
                        </div>

                        {authError && (
                            <div style={{
                                marginBottom: '1rem', background: '#FFEBEE',
                                border: '1px solid #FFCDD2', padding: '0.75rem 1rem',
                                borderRadius: '12px', color: '#C62828', fontSize: '0.85rem'
                            }}>
                                {authError}
                            </div>
                        )}

                        {authSuccess && (
                            <div style={{
                                marginBottom: '1rem', background: '#E8F5E9',
                                border: '1px solid #C8E6C9', padding: '0.75rem 1rem',
                                borderRadius: '12px', color: '#2E7D32', fontSize: '0.85rem'
                            }}>
                                {authSuccess}
                            </div>
                        )}

                        {authMode === 'signin' ? (
                            <form onSubmit={handleSignIn} style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.8rem', color: '#4E342E', marginBottom: '0.35rem', fontWeight: 600 }}>
                                        {language === 'si' ? 'දුරකථන අංකය (Phone Number)' : 'Phone Number'}
                                    </label>
                                    <input 
                                        type="tel"
                                        required
                                        placeholder="07xxxxxxxx"
                                        value={authPhone}
                                        onChange={(e) => setAuthPhone(e.target.value)}
                                        style={{
                                            width: '100%', padding: '0.8rem 1rem', background: '#FAF7F2',
                                            border: '1px solid #D7CCC8', borderRadius: '12px',
                                            color: '#2C1810', fontSize: '0.92rem', outline: 'none'
                                        }}
                                    />
                                </div>

                                <div>
                                    <label style={{ display: 'block', fontSize: '0.8rem', color: '#4E342E', marginBottom: '0.35rem', fontWeight: 600 }}>
                                        {language === 'si' ? 'මුරපදය (Password)' : 'Password'}
                                    </label>
                                    <input 
                                        type="password"
                                        required
                                        placeholder="••••••••"
                                        value={authPassword}
                                        onChange={(e) => setAuthPassword(e.target.value)}
                                        style={{
                                            width: '100%', padding: '0.8rem 1rem', background: '#FAF7F2',
                                            border: '1px solid #D7CCC8', borderRadius: '12px',
                                            color: '#2C1810', fontSize: '0.92rem', outline: 'none'
                                        }}
                                    />
                                </div>

                                <button 
                                    type="submit"
                                    disabled={authLoading}
                                    style={{
                                        marginTop: '0.5rem', padding: '0.85rem', borderRadius: '12px',
                                        background: '#5D4037', color: '#FFFFFF', border: 'none',
                                        fontWeight: 700, fontSize: '0.92rem', cursor: 'pointer',
                                        boxShadow: '0 4px 12px rgba(93, 64, 55, 0.25)', transition: 'all 0.2s ease'
                                    }}
                                >
                                    {authLoading ? 'Signing in...' : (language === 'si' ? 'ඇතුල් වන්න (Start Exam)' : 'Log in & Start Exam')}
                                </button>
                            </form>
                        ) : (
                            <form onSubmit={handleSignUp} style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.8rem', color: '#4E342E', marginBottom: '0.35rem', fontWeight: 600 }}>
                                        {language === 'si' ? 'ඔබගේ නම (Student Name)' : 'Student Name'}
                                    </label>
                                    <input 
                                        type="text"
                                        required
                                        placeholder="Kamal Perera"
                                        value={authName}
                                        onChange={(e) => setAuthName(e.target.value)}
                                        style={{
                                            width: '100%', padding: '0.8rem 1rem', background: '#FAF7F2',
                                            border: '1px solid #D7CCC8', borderRadius: '12px',
                                            color: '#2C1810', fontSize: '0.92rem', outline: 'none'
                                        }}
                                    />
                                </div>

                                <div>
                                    <label style={{ display: 'block', fontSize: '0.8rem', color: '#4E342E', marginBottom: '0.35rem', fontWeight: 600 }}>
                                        {language === 'si' ? 'දුරකථන අංකය (Phone Number)' : 'Phone Number'}
                                    </label>
                                    <input 
                                        type="tel"
                                        required
                                        placeholder="07xxxxxxxx"
                                        value={authPhone}
                                        onChange={(e) => setAuthPhone(e.target.value)}
                                        style={{
                                            width: '100%', padding: '0.8rem 1rem', background: '#FAF7F2',
                                            border: '1px solid #D7CCC8', borderRadius: '12px',
                                            color: '#2C1810', fontSize: '0.92rem', outline: 'none'
                                        }}
                                    />
                                </div>

                                <div>
                                    <label style={{ display: 'block', fontSize: '0.8rem', color: '#4E342E', marginBottom: '0.35rem', fontWeight: 600 }}>
                                        {language === 'si' ? 'නව මුරපදයක් (Create Password)' : 'Create Password'}
                                    </label>
                                    <input 
                                        type="password"
                                        required
                                        placeholder="••••••••"
                                        value={authPassword}
                                        onChange={(e) => setAuthPassword(e.target.value)}
                                        style={{
                                            width: '100%', padding: '0.8rem 1rem', background: '#FAF7F2',
                                            border: '1px solid #D7CCC8', borderRadius: '12px',
                                            color: '#2C1810', fontSize: '0.92rem', outline: 'none'
                                        }}
                                    />
                                </div>

                                <button 
                                    type="submit"
                                    disabled={authLoading}
                                    style={{
                                        marginTop: '0.5rem', padding: '0.85rem', borderRadius: '12px',
                                        background: '#5D4037', color: '#FFFFFF', border: 'none',
                                        fontWeight: 700, fontSize: '0.92rem', cursor: 'pointer',
                                        boxShadow: '0 4px 12px rgba(93, 64, 55, 0.25)', transition: 'all 0.2s ease'
                                    }}
                                >
                                    {authLoading ? 'Creating account...' : (language === 'si' ? 'නොමිලේ ලියාපදිංචි වන්න' : 'Register Free Account')}
                                </button>
                            </form>
                        )}
                    </div>
                ) : (
                    // Logged in student badge
                    <div style={{
                        background: '#FFFFFF', border: '1px solid #E6DCCE',
                        borderRadius: '18px', padding: '0.9rem 1.5rem', marginBottom: '2rem',
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem',
                        boxShadow: '0 4px 15px rgba(93, 64, 55, 0.05)'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <div style={{
                                width: '38px', height: '38px', borderRadius: '12px',
                                background: '#5D4037', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontWeight: 800, fontSize: '1.1rem'
                            }}>
                                {user.name ? user.name.charAt(0).toUpperCase() : 'S'}
                            </div>
                            <div>
                                <div style={{ fontSize: '1rem', fontWeight: 800, color: '#3E2723' }}>
                                    {user.name}
                                </div>
                                <div style={{ fontSize: '0.78rem', color: '#795548', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                    <CheckCircle2 size={13} color="#2E7D32" /> Online Exams Active • {user.phone}
                                </div>
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center' }}>
                            {viewMode !== 'list' && (
                                <button
                                    onClick={handleBackToList}
                                    style={{
                                        padding: '0.45rem 0.9rem', borderRadius: '10px',
                                        background: '#EFEBE4', color: '#5D4037', border: '1px solid #D7CCC8',
                                        fontSize: '0.82rem', fontWeight: 700, cursor: 'pointer'
                                    }}
                                >
                                    All Papers List
                                </button>
                            )}
                            <button
                                onClick={handleLogout}
                                style={{
                                    padding: '0.45rem 0.9rem', borderRadius: '10px',
                                    background: 'transparent', color: '#C62828', border: '1px solid #FFCDD2',
                                    fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer'
                                }}
                            >
                                <LogOut size={13} style={{ display: 'inline', marginRight: '4px' }} /> Logout
                            </button>
                        </div>
                    </div>
                )}

                {/* =================================================================== */}
                {/* 3. VIEW MODE: ALL PAPERS LIST                                       */}
                {/* =================================================================== */}
                {viewMode === 'list' && (
                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.8rem' }}>
                            <div>
                                <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#3E2723' }}>
                                    {language === 'si' ? 'පවතින ප්‍රශ්න පත්‍ර (Available Exam Papers)' : 'Available Exam Papers'}
                                </h3>
                                <p style={{ color: '#795548', fontSize: '0.85rem' }}>
                                    Select any paper to begin. Papers remain available as new ones are added.
                                </p>
                            </div>
                            <div style={{
                                background: '#EFEBE4', border: '1px solid #D7CCC8', borderRadius: '999px',
                                padding: '0.3rem 0.9rem', fontSize: '0.82rem', fontWeight: 700, color: '#5D4037'
                            }}>
                                Total Papers: {papers.length}
                            </div>
                        </div>

                        {loadingPapers ? (
                            <div style={{ textAlign: 'center', padding: '3.5rem' }}>
                                <div style={{
                                    width: '38px', height: '38px', border: '3px solid #D7CCC8',
                                    borderTopColor: '#5D4037', borderRadius: '50%', margin: '0 auto 1rem auto'
                                }} className="animate-spin" />
                                <p style={{ color: '#795548' }}>Loading exam papers...</p>
                            </div>
                        ) : papers.length === 0 ? (
                            <div style={{
                                background: '#FFFFFF', border: '1px solid #E6DCCE', borderRadius: '20px',
                                padding: '3.5rem 2rem', textAlign: 'center'
                            }}>
                                <BookOpen size={48} color="#8D6E63" style={{ margin: '0 auto 1rem auto', opacity: 0.6 }} />
                                <h4 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#3E2723', marginBottom: '0.4rem' }}>No exam papers available yet</h4>
                                <p style={{ color: '#795548', fontSize: '0.9rem' }}>The administrator will upload new MCQ papers shortly.</p>
                            </div>
                        ) : (
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.25rem' }}>
                                {papers.map((paper, idx) => (
                                    <div
                                        key={paper.id}
                                        style={{
                                            background: '#FFFFFF', border: '1px solid #E6DCCE',
                                            borderRadius: '20px', padding: '1.5rem', display: 'flex',
                                            flexDirection: 'column', justifyContent: 'space-between',
                                            boxShadow: '0 6px 20px rgba(93, 64, 55, 0.05)',
                                            transition: 'all 0.25s ease'
                                        }}
                                    >
                                        <div>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem' }}>
                                                <span style={{
                                                    background: '#EFEBE4', color: '#5D4037',
                                                    border: '1px solid #D7CCC8', padding: '3px 10px',
                                                    borderRadius: '8px', fontSize: '0.78rem', fontWeight: 800
                                                }}>
                                                    Paper {paper.paper_number || idx + 1}
                                                </span>
                                                <span style={{
                                                    background: '#E8F5E9', color: '#2E7D32',
                                                    border: '1px solid #C8E6C9', padding: '2px 8px',
                                                    borderRadius: '6px', fontSize: '0.72rem', fontWeight: 700
                                                }}>
                                                    FREE
                                                </span>
                                            </div>

                                            <h4 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#3E2723', lineHeight: 1.35, marginBottom: '0.6rem' }}>
                                                {paper.title}
                                            </h4>

                                            {paper.description && (
                                                <p style={{ fontSize: '0.83rem', color: '#6D4C41', lineHeight: 1.5, marginBottom: '1.2rem' }}>
                                                    {paper.description}
                                                </p>
                                            )}

                                            <div style={{
                                                display: 'flex', gap: '1rem', flexWrap: 'wrap',
                                                fontSize: '0.8rem', color: '#795548', paddingTop: '0.75rem',
                                                borderTop: '1px solid #F5EFEB', marginBottom: '1.25rem'
                                            }}>
                                                <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                                                    <FileText size={14} color="#8D6E63" />
                                                    <strong>{paper.total_questions || '5'} Questions</strong>
                                                </span>
                                                <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                                                    <Clock size={14} color="#8D6E63" />
                                                    <span>{paper.duration_minutes || '45'} Mins</span>
                                                </span>
                                            </div>
                                        </div>

                                        <button
                                            onClick={() => handleStartExam(paper)}
                                            disabled={loadingActivePaper}
                                            style={{
                                                width: '100%', padding: '0.85rem', borderRadius: '12px',
                                                background: '#5D4037', color: '#FFFFFF', border: 'none',
                                                fontWeight: 700, fontSize: '0.92rem', cursor: 'pointer',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                                                boxShadow: '0 4px 12px rgba(93, 64, 55, 0.2)', transition: 'all 0.2s ease'
                                            }}
                                        >
                                            <span>{user ? (language === 'si' ? 'විභාගය ආරම්භ කරන්න' : 'Start Exam') : (language === 'si' ? 'ඇතුල් වී ආරම්භ කරන්න' : 'Log in to Start')}</span>
                                            <ArrowRight size={16} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* =================================================================== */}
                {/* 4. VIEW MODE: TAKING EXAM (Live Quiz Mode)                          */}
                {/* =================================================================== */}
                {viewMode === 'taking' && activePaper && currentQ && (
                    <div style={{ maxWidth: '820px', margin: '0 auto' }}>
                        {/* Top Quiz Header */}
                        <div style={{
                            background: '#FFFFFF', border: '1px solid #E6DCCE',
                            borderRadius: '20px', padding: '1.25rem 1.75rem', marginBottom: '1.5rem',
                            boxShadow: '0 4px 15px rgba(93, 64, 55, 0.05)'
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
                                <div>
                                    <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#8D6E63', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                        {activePaper.title}
                                    </span>
                                    <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#3E2723', marginTop: '0.15rem' }}>
                                        Question {currentQuestionIndex + 1} of {activePaper.questions.length}
                                    </h3>
                                </div>
                                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                                    <div style={{
                                        background: '#F5EFEB', border: '1px solid #E6DCCE', borderRadius: '10px',
                                        padding: '0.4rem 0.85rem', fontSize: '0.85rem', fontWeight: 700, color: '#5D4037'
                                    }}>
                                        Answered: {answeredCount}/{activePaper.questions.length}
                                    </div>
                                    <button
                                        onClick={() => setShowSubmitModal(true)}
                                        style={{
                                            padding: '0.5rem 1rem', borderRadius: '10px',
                                            background: '#2E7D32', color: '#FFFFFF', border: 'none',
                                            fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer',
                                            display: 'flex', alignItems: 'center', gap: '0.4rem'
                                        }}
                                    >
                                        <Send size={14} /> Submit
                                    </button>
                                </div>
                            </div>

                            {/* Question Pills Navigation */}
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem', paddingTop: '0.75rem', borderTop: '1px solid #F5EFEB' }}>
                                {activePaper.questions.map((q, idx) => {
                                    const isAnswered = !!studentAnswers[q.id];
                                    const isCurrent = currentQuestionIndex === idx;
                                    return (
                                        <button
                                            key={q.id}
                                            onClick={() => setCurrentQuestionIndex(idx)}
                                            style={{
                                                width: '36px', height: '36px', borderRadius: '10px',
                                                border: isCurrent ? '2px solid #5D4037' : (isAnswered ? '1px solid #8D6E63' : '1px solid #E6DCCE'),
                                                background: isCurrent ? '#5D4037' : (isAnswered ? '#8D6E63' : '#FAF7F2'),
                                                color: (isCurrent || isAnswered) ? '#FFFFFF' : '#5D4037',
                                                fontWeight: 800, fontSize: '0.85rem', cursor: 'pointer',
                                                transition: 'all 0.15s ease'
                                            }}
                                        >
                                            {idx + 1}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Current Question Card */}
                        <div style={{
                            background: '#FFFFFF', border: '1px solid #E6DCCE',
                            borderRadius: '24px', padding: '2rem', marginBottom: '1.5rem',
                            boxShadow: '0 8px 25px rgba(93, 64, 55, 0.06)'
                        }}>
                            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#8D6E63', marginBottom: '0.5rem' }}>
                                Question {currentQuestionIndex + 1}
                            </div>
                            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#2C1810', lineHeight: 1.5, marginBottom: '1.75rem' }}>
                                {currentQ.question_text}
                            </h2>

                            {/* 4 Options Grid */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                                {[
                                    { letter: 'A', text: currentQ.option_a },
                                    { letter: 'B', text: currentQ.option_b },
                                    { letter: 'C', text: currentQ.option_c },
                                    { letter: 'D', text: currentQ.option_d }
                                ].map(opt => {
                                    const isSelected = studentAnswers[currentQ.id] === opt.letter;
                                    return (
                                        <div
                                            key={opt.letter}
                                            onClick={() => handleSelectOption(currentQ.id, opt.letter)}
                                            style={{
                                                padding: '1.1rem 1.25rem', borderRadius: '16px',
                                                border: isSelected ? '2px solid #5D4037' : '1px solid #E6DCCE',
                                                background: isSelected ? '#F5EFEB' : '#FAF7F2',
                                                cursor: 'pointer', display: 'flex', alignItems: 'center',
                                                gap: '1rem', transition: 'all 0.15s ease'
                                            }}
                                        >
                                            <div style={{
                                                width: '36px', height: '36px', borderRadius: '10px',
                                                background: isSelected ? '#5D4037' : '#FFFFFF',
                                                color: isSelected ? '#FFFFFF' : '#5D4037',
                                                border: isSelected ? 'none' : '1px solid #D7CCC8',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                fontWeight: 800, fontSize: '0.95rem', flexShrink: 0
                                            }}>
                                                {opt.letter}
                                            </div>
                                            <div style={{ fontSize: '1.02rem', fontWeight: isSelected ? 700 : 500, color: '#2C1810', flex: 1 }}>
                                                {opt.text}
                                            </div>
                                            {isSelected && (
                                                <div style={{
                                                    width: '24px', height: '24px', borderRadius: '50%',
                                                    background: '#5D4037', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center'
                                                }}>
                                                    <Check size={14} />
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Bottom Question Controls */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '2rem', paddingTop: '1.25rem', borderTop: '1px solid #F5EFEB' }}>
                                <button
                                    onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
                                    disabled={currentQuestionIndex === 0}
                                    style={{
                                        padding: '0.7rem 1.3rem', borderRadius: '12px',
                                        background: currentQuestionIndex === 0 ? '#EFEBE4' : '#FFFFFF',
                                        color: currentQuestionIndex === 0 ? '#A1887F' : '#5D4037',
                                        border: '1px solid #D7CCC8', fontWeight: 700, fontSize: '0.88rem',
                                        cursor: currentQuestionIndex === 0 ? 'not-allowed' : 'pointer',
                                        display: 'flex', alignItems: 'center', gap: '0.4rem'
                                    }}
                                >
                                    <ArrowLeft size={16} /> Previous
                                </button>

                                {currentQuestionIndex < activePaper.questions.length - 1 ? (
                                    <button
                                        onClick={() => setCurrentQuestionIndex(prev => Math.min(activePaper.questions.length - 1, prev + 1))}
                                        style={{
                                            padding: '0.7rem 1.4rem', borderRadius: '12px',
                                            background: '#5D4037', color: '#FFFFFF', border: 'none',
                                            fontWeight: 700, fontSize: '0.88rem', cursor: 'pointer',
                                            display: 'flex', alignItems: 'center', gap: '0.4rem',
                                            boxShadow: '0 4px 10px rgba(93, 64, 55, 0.2)'
                                        }}
                                    >
                                        Next <ArrowRight size={16} />
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => setShowSubmitModal(true)}
                                        style={{
                                            padding: '0.7rem 1.5rem', borderRadius: '12px',
                                            background: '#2E7D32', color: '#FFFFFF', border: 'none',
                                            fontWeight: 700, fontSize: '0.88rem', cursor: 'pointer',
                                            display: 'flex', alignItems: 'center', gap: '0.4rem',
                                            boxShadow: '0 4px 12px rgba(46, 125, 50, 0.25)'
                                        }}
                                    >
                                        <Send size={16} /> Finish & Submit
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* =================================================================== */}
                {/* 5. VIEW MODE: RESULT SCREEN                                         */}
                {/* =================================================================== */}
                {viewMode === 'result' && examResult && (
                    <div style={{ maxWidth: '720px', margin: '0 auto' }}>
                        <div style={{
                            background: '#FFFFFF', border: '1px solid #E6DCCE',
                            borderRadius: '28px', padding: '2.5rem 2rem', textAlign: 'center',
                            boxShadow: '0 12px 35px rgba(93, 64, 55, 0.08)', marginBottom: '1.5rem'
                        }}>
                            <div style={{
                                width: '64px', height: '64px', borderRadius: '20px',
                                background: examResult.motivation.badgeBg, border: `2px solid ${examResult.motivation.badgeBorder}`,
                                display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem auto'
                            }}>
                                <Award size={32} color={examResult.motivation.color} />
                            </div>

                            <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#8D6E63', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                Exam Result • {examResult.paper_title}
                            </span>

                            <h2 style={{ fontSize: 'clamp(2.5rem, 6vw, 3.5rem)', fontWeight: 900, color: '#3E2723', lineHeight: 1.1, margin: '0.4rem 0' }}>
                                {examResult.percentage}%
                            </h2>
                            <div style={{ fontSize: '1.05rem', fontWeight: 700, color: '#5D4037', marginBottom: '1.5rem' }}>
                                Marks: {examResult.marks} / {examResult.total_questions}
                            </div>

                            {/* Motivational Message Card */}
                            <div style={{
                                background: examResult.motivation.badgeBg,
                                border: `1.5px solid ${examResult.motivation.badgeBorder}`,
                                borderRadius: '18px', padding: '1.25rem 1.5rem', marginBottom: '2rem',
                                textAlign: 'center'
                            }}>
                                <h4 style={{ fontSize: '1.15rem', fontWeight: 800, color: examResult.motivation.color, marginBottom: '0.35rem' }}>
                                    {examResult.motivation.title}
                                </h4>
                                <p style={{ fontSize: '0.98rem', fontWeight: 600, color: '#2C1810', marginBottom: '0.25rem' }}>
                                    "{examResult.motivation.message}"
                                </p>
                                <p style={{ fontSize: '0.85rem', color: '#5D4037' }}>
                                    {examResult.motivation.messageSi}
                                </p>
                            </div>

                            {/* Stats Summary Grid */}
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
                                <div style={{ background: '#FAF7F2', border: '1px solid #E6DCCE', borderRadius: '16px', padding: '1rem' }}>
                                    <div style={{ fontSize: '0.78rem', color: '#795548', fontWeight: 700 }}>Total Questions</div>
                                    <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#3E2723', marginTop: '0.15rem' }}>
                                        {examResult.total_questions}
                                    </div>
                                </div>
                                <div style={{ background: '#E8F5E9', border: '1px solid #C8E6C9', borderRadius: '16px', padding: '1rem' }}>
                                    <div style={{ fontSize: '0.78rem', color: '#2E7D32', fontWeight: 700 }}>Correct</div>
                                    <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#2E7D32', marginTop: '0.15rem' }}>
                                        {examResult.correct_answers}
                                    </div>
                                </div>
                                <div style={{ background: '#FFEBEE', border: '1px solid #FFCDD2', borderRadius: '16px', padding: '1rem' }}>
                                    <div style={{ fontSize: '0.78rem', color: '#C62828', fontWeight: 700 }}>Incorrect</div>
                                    <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#C62828', marginTop: '0.15rem' }}>
                                        {examResult.incorrect_answers + examResult.unanswered}
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                <button
                                    onClick={() => setViewMode('review')}
                                    style={{
                                        width: '100%', padding: '0.95rem', borderRadius: '14px',
                                        background: '#5D4037', color: '#FFFFFF', border: 'none',
                                        fontWeight: 800, fontSize: '0.98rem', cursor: 'pointer',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                                        boxShadow: '0 4px 15px rgba(93, 64, 55, 0.25)'
                                    }}
                                >
                                    <BookOpen size={18} /> Review Answers & Explanations (විවරණ බලන්න)
                                </button>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                                    <button
                                        onClick={handleRetakeExam}
                                        style={{
                                            padding: '0.85rem', borderRadius: '12px',
                                            background: '#FFFFFF', color: '#5D4037', border: '1px solid #D7CCC8',
                                            fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem'
                                        }}
                                    >
                                        <RotateCcw size={16} /> Retake Paper
                                    </button>
                                    <button
                                        onClick={handleBackToList}
                                        style={{
                                            padding: '0.85rem', borderRadius: '12px',
                                            background: '#EFEBE4', color: '#5D4037', border: '1px solid #D7CCC8',
                                            fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer'
                                        }}
                                    >
                                        Back to All Papers
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* =================================================================== */}
                {/* 6. VIEW MODE: REVIEW WITH EXPLANATIONS                              */}
                {/* =================================================================== */}
                {viewMode === 'review' && examResult && (
                    <div style={{ maxWidth: '820px', margin: '0 auto' }}>
                        <div style={{
                            background: '#FFFFFF', border: '1px solid #E6DCCE',
                            borderRadius: '20px', padding: '1.25rem 1.75rem', marginBottom: '1.5rem',
                            display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem'
                        }}>
                            <div>
                                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#3E2723' }}>
                                    Question Review & Theory Explanations
                                </h3>
                                <p style={{ fontSize: '0.85rem', color: '#795548' }}>
                                    Paper: {examResult.paper_title} • Score: {examResult.marks}/{examResult.total_questions} ({examResult.percentage}%)
                                </p>
                            </div>
                            <button
                                onClick={handleBackToList}
                                style={{
                                    padding: '0.55rem 1.1rem', borderRadius: '10px',
                                    background: '#5D4037', color: '#FFFFFF', border: 'none',
                                    fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer'
                                }}
                            >
                                Back to Papers
                            </button>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                            {examResult.review.map((item, idx) => (
                                <div
                                    key={item.question_id || idx}
                                    style={{
                                        background: '#FFFFFF', border: item.is_correct ? '1.5px solid #C8E6C9' : '1.5px solid #FFCDD2',
                                        borderRadius: '20px', padding: '1.6rem',
                                        boxShadow: '0 4px 15px rgba(93, 64, 55, 0.04)'
                                    }}
                                >
                                    {/* Question Header & Status */}
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                                        <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#8D6E63' }}>
                                            Question {idx + 1}
                                        </span>
                                        {item.is_correct ? (
                                            <span style={{
                                                background: '#E8F5E9', color: '#2E7D32', border: '1px solid #C8E6C9',
                                                padding: '3px 10px', borderRadius: '8px', fontSize: '0.78rem', fontWeight: 800,
                                                display: 'flex', alignItems: 'center', gap: '0.3rem'
                                            }}>
                                                <CheckCircle2 size={13} /> Correct (+1 Mark)
                                            </span>
                                        ) : (
                                            <span style={{
                                                background: '#FFEBEE', color: '#C62828', border: '1px solid #FFCDD2',
                                                padding: '3px 10px', borderRadius: '8px', fontSize: '0.78rem', fontWeight: 800,
                                                display: 'flex', alignItems: 'center', gap: '0.3rem'
                                            }}>
                                                <XCircle size={13} /> Incorrect (0 Marks)
                                            </span>
                                        )}
                                    </div>

                                    {/* Question Text */}
                                    <h4 style={{ fontSize: '1.12rem', fontWeight: 800, color: '#2C1810', lineHeight: 1.45, marginBottom: '1.25rem' }}>
                                        {item.question_text}
                                    </h4>

                                    {/* 4 Options Grid */}
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.65rem', marginBottom: '1.25rem' }}>
                                        {[
                                            { letter: 'A', text: item.option_a },
                                            { letter: 'B', text: item.option_b },
                                            { letter: 'C', text: item.option_c },
                                            { letter: 'D', text: item.option_d }
                                        ].map(opt => {
                                            const isStudentPick = item.student_answer === opt.letter;
                                            const isCorrectAnswer = item.correct_answer === opt.letter;

                                            let bg = '#FAF7F2';
                                            let border = '#E6DCCE';
                                            let badgeColor = '#795548';

                                            if (isCorrectAnswer) {
                                                bg = '#E8F5E9';
                                                border = '#81C784';
                                                badgeColor = '#2E7D32';
                                            } else if (isStudentPick && !item.is_correct) {
                                                bg = '#FFEBEE';
                                                border = '#E57373';
                                                badgeColor = '#C62828';
                                            }

                                            return (
                                                <div
                                                    key={opt.letter}
                                                    style={{
                                                        padding: '0.75rem 0.9rem', borderRadius: '12px',
                                                        background: bg, border: `1px solid ${border}`,
                                                        display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.88rem'
                                                    }}
                                                >
                                                    <strong style={{ color: badgeColor, minWidth: '18px' }}>{opt.letter}.</strong>
                                                    <span style={{ color: '#2C1810', fontWeight: isCorrectAnswer || isStudentPick ? 700 : 500 }}>
                                                        {opt.text}
                                                    </span>
                                                    {isCorrectAnswer && (
                                                        <span style={{ marginLeft: 'auto', fontSize: '0.72rem', color: '#2E7D32', fontWeight: 800 }}>
                                                            ✓ Correct
                                                        </span>
                                                    )}
                                                    {isStudentPick && !item.is_correct && (
                                                        <span style={{ marginLeft: 'auto', fontSize: '0.72rem', color: '#C62828', fontWeight: 800 }}>
                                                            ✗ Your Answer
                                                        </span>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>

                                    {/* Detailed Theory Explanation Box */}
                                    <div style={{
                                        background: '#F5EFEB', border: '1px solid #D7CCC8',
                                        borderRadius: '14px', padding: '1rem 1.25rem'
                                    }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#5D4037', fontWeight: 800, fontSize: '0.85rem', marginBottom: '0.4rem' }}>
                                            <BookOpen size={15} color="#5D4037" />
                                            <span>සිද්ධාන්ත විවරණය (Theory & Concept Explanation):</span>
                                        </div>
                                        <p style={{ color: '#3E2723', fontSize: '0.88rem', lineHeight: 1.6, whiteSpace: 'pre-line' }}>
                                            {item.explanation || 'මෙම ප්‍රශ්නයට අදාළ සටහනක් නොමැත.'}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

            </main>

            {/* =================================================================== */}
            {/* 7. DOCKED WHATSAPP BUTTON (Non-intrusive Help)                      */}
            {/* =================================================================== */}
            <div style={{
                position: 'fixed', bottom: '24px', right: '24px', zIndex: 1000
            }}>
                <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                        display: 'flex', alignItems: 'center', gap: '0.5rem',
                        background: '#25D366', color: '#FFFFFF',
                        padding: '0.65rem 1.1rem', borderRadius: '999px',
                        fontWeight: 700, fontSize: '0.88rem', textDecoration: 'none',
                        boxShadow: '0 6px 20px rgba(37, 211, 102, 0.4)',
                        transition: 'all 0.2s ease'
                    }}
                    title="Need help with a question? Contact tutor on WhatsApp"
                >
                    <MessageSquare size={18} />
                    <span>💬 Need Help? Contact on WhatsApp</span>
                </a>
            </div>

            {/* =================================================================== */}
            {/* 8. SUBMIT CONFIRMATION MODAL                                        */}
            {/* =================================================================== */}
            {showSubmitModal && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
                    background: 'rgba(44, 24, 16, 0.6)', backdropFilter: 'blur(4px)',
                    zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem'
                }}>
                    <div style={{
                        background: '#FFFFFF', border: '1px solid #E6DCCE',
                        borderRadius: '24px', maxWidth: '440px', width: '100%', padding: '2rem',
                        textAlign: 'center', boxShadow: '0 20px 40px rgba(0,0,0,0.15)'
                    }}>
                        <div style={{
                            width: '52px', height: '52px', borderRadius: '16px',
                            background: '#EFEBE4', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem auto'
                        }}>
                            <Send size={24} color="#5D4037" />
                        </div>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#3E2723', marginBottom: '0.4rem' }}>
                            Submit Exam Paper?
                        </h3>
                        <p style={{ color: '#795548', fontSize: '0.88rem', marginBottom: '1.25rem', lineHeight: 1.5 }}>
                            You have answered <strong>{answeredCount}</strong> of <strong>{activePaper?.questions?.length}</strong> questions.
                            {answeredCount < (activePaper?.questions?.length || 0) && (
                                <span style={{ display: 'block', color: '#D84315', marginTop: '0.25rem', fontWeight: 600 }}>
                                    Warning: There are {activePaper.questions.length - answeredCount} unanswered questions!
                                </span>
                            )}
                        </p>

                        <div style={{ display: 'flex', gap: '0.75rem' }}>
                            <button
                                onClick={() => setShowSubmitModal(false)}
                                style={{
                                    flex: 1, padding: '0.75rem', borderRadius: '12px',
                                    background: '#FAF7F2', border: '1px solid #D7CCC8',
                                    color: '#5D4037', fontWeight: 700, fontSize: '0.88rem', cursor: 'pointer'
                                }}
                            >
                                Continue Exam
                            </button>
                            <button
                                onClick={handleSubmitExam}
                                disabled={submitting}
                                style={{
                                    flex: 1, padding: '0.75rem', borderRadius: '12px',
                                    background: '#5D4037', border: 'none',
                                    color: '#FFFFFF', fontWeight: 700, fontSize: '0.88rem', cursor: 'pointer'
                                }}
                            >
                                {submitting ? 'Evaluating...' : 'Yes, Submit'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <Footer />
        </div>
    );
}

export default function ExamPage() {
    return (
        <LanguageProvider>
            <ExamPlatformContent />
        </LanguageProvider>
    );
}
