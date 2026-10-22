'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '../../src/components/Navbar';
import Footer from '../../src/components/Footer';
import { useLanguage, LanguageProvider } from '../../src/context/LanguageContext';
import { MATHSBOOK_CONFIG } from '../../src/config/mathsbookConfig';
import confetti from 'canvas-confetti';
import { 
  CheckCircle2, XCircle, AlertCircle, Award, BookOpen, Clock, 
  ArrowRight, ArrowLeft, RotateCcw, MessageSquare, Lock, 
  User, LogOut, Check, HelpCircle, ChevronRight, Sparkles, Send, FileText,
  Zap, Trophy, Flame, BarChart3, Star, CheckCircle
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
            window.scrollTo({ top: 120, behavior: 'smooth' });
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
                
                // Celebratory confetti
                try {
                    confetti({
                        particleCount: 80,
                        spread: 60,
                        origin: { y: 0.6 }
                    });
                } catch (e) {
                    // Confetti fallback
                }
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

    // Dark theme motivational style mapping
    const getDarkMotivationTheme = (tier) => {
        switch (tier) {
            case 'excellent':
                return {
                    color: '#16734a',
                    bg: 'rgba(16, 185, 129, 0.12)',
                    border: 'rgba(52, 211, 153, 0.35)',
                    glow: '0 0 20px rgba(16, 185, 129, 0.2)'
                };
            case 'good':
                return {
                    color: '#a94e08',
                    bg: 'rgba(251, 191, 36, 0.12)',
                    border: 'rgba(251, 191, 36, 0.35)',
                    glow: '0 0 20px rgba(251, 191, 36, 0.2)'
                };
            case 'pass':
                return {
                    color: '#fb923c',
                    bg: 'rgba(249, 115, 22, 0.12)',
                    border: 'rgba(249, 115, 22, 0.35)',
                    glow: '0 0 20px rgba(249, 115, 22, 0.2)'
                };
            default:
                return {
                    color: '#f87171',
                    bg: 'rgba(239, 68, 68, 0.12)',
                    border: 'rgba(248, 113, 113, 0.35)',
                    glow: '0 0 20px rgba(239, 68, 68, 0.2)'
                };
        }
    };

    return (
        <div className="mb-portal" style={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: '#f6f8fc',
            color: '#10294c',
            fontFamily: "'Noto Sans Sinhala', 'Plus Jakarta Sans', sans-serif",
            position: 'relative',
            overflowX: 'hidden'
        }}>
            <style dangerouslySetInnerHTML={{ __html: `
                .exam-paper-card {
                    background: #ffffff;
                    backdrop-filter: blur(16px);
                    border: 1px solid #e1e8f2;
                    border-radius: 18px;
                    padding: 1.45rem;
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                    box-shadow: 0 10px 25px -5px rgba(16, 41, 76, 0.08);
                    transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
                }
                .exam-paper-card:hover {
                    transform: translateY(-4px);
                    border-color: rgba(7, 60, 166, 0.45);
                    box-shadow: 0 16px 35px -8px rgba(7, 60, 166, 0.25);
                }
                .exam-option-card {
                    padding: 0.95rem 1.15rem;
                    border-radius: 14px;
                    border: 1px solid #e1e8f2;
                    background: #ffffff;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    gap: 0.95rem;
                    transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
                }
                .exam-option-card:hover {
                    background: #edf3ff;
                    border-color: rgba(7, 60, 166, 0.4);
                    transform: translateX(3px);
                }
                .exam-option-card.selected {
                    background: linear-gradient(135deg, rgba(7, 60, 166, 0.2) 0%, rgba(6, 182, 212, 0.12) 100%);
                    border: 1.5px solid #174fa9;
                    box-shadow: 0 0 20px rgba(7, 60, 166, 0.3);
                }
                .pill-btn {
                    transition: all 0.15s ease;
                }
                .pill-btn:hover {
                    transform: scale(1.06);
                }
            `}} />

            {/* Ambient Background Glow */}
            <div style={{
                position: 'fixed',
                top: '5%',
                left: '50%',
                transform: 'translate(-50%, 0)',
                width: '800px',
                height: '350px',
                background: 'radial-gradient(ellipse at 50% 20%, rgba(7, 60, 166, 0.14) 0%, transparent 65%)',
                filter: 'blur(75px)',
                pointerEvents: 'none',
                zIndex: 0
            }} />

            <Navbar />

            {/* Main Interactive Container */}
            <main id="main-content" style={{ flex: 1, paddingTop: '42px', paddingBottom: '60px', position: 'relative', zIndex: 1 }} className="container">

                {/* 1. Header */}
                <div style={{ textAlign: 'center', maxWidth: '780px', margin: '0 auto 2rem auto' }}>
                    <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        background: 'linear-gradient(135deg, rgba(7, 60, 166, 0.15) 0%, rgba(6, 182, 212, 0.12) 100%)',
                        border: '1px solid rgba(7, 60, 166, 0.3)',
                        padding: '0.35rem 1rem',
                        borderRadius: '999px',
                        color: '#174fa9',
                        fontSize: '0.82rem',
                        fontWeight: 700,
                        marginBottom: '0.85rem'
                    }}>
                        <Sparkles size={15} color="#174fa9" />
                        <span>100% Free Online Mathematics MCQ Platform • O/L 2026</span>
                    </div>

                    <h1 style={{
                        fontSize: 'clamp(2rem, 3.8vw, 2.75rem)',
                        fontWeight: 900,
                        lineHeight: 1.25,
                        marginBottom: '0.75rem',
                        letterSpacing: '-0.02em'
                    }}>
                        {language === 'si' ? (
                            <>ගණිතය <span className="gradient-text">Online MCQ විභාග පද්ධතිය</span></>
                        ) : (
                            <>Mathematics <span className="gradient-text">Online MCQ Platform</span></>
                        )}
                    </h1>

                    <p style={{ color: '#5e6f86', fontSize: '1.05rem', lineHeight: 1.62, maxWidth: '660px', margin: '0 auto' }}>
                        {language === 'si'
                            ? 'සෑම ප්‍රශ්න පත්‍රයකටම පෙනී සිට ස්වයංක්‍රීය ලකුණු, ප්‍රතිශත සහ ප්‍රවීණතා මට්ටම ලබාගන්න. අවසානයේ සෑම ප්‍රශ්නයකටම අදාළ පූර්ණ සිද්ධාන්ත විවරණ (Explanations) අධ්‍යයනය කරන්න.'
                            : 'Practice O/L Mathematics MCQ papers online for free. Get instant marks, percentage, motivational feedback, and in-depth step-by-step theory explanations.'
                        }
                    </p>
                </div>

                {/* 2. Authentication Section (if not logged in) */}
                {!user ? (
                    <div style={{
                        maxWidth: '460px',
                        margin: '0 auto 2.5rem auto',
                        background: 'linear-gradient(145deg, #ffffff 0%, #ffffff 100%)',
                        border: '1px solid rgba(7, 60, 166, 0.28)',
                        borderRadius: '22px',
                        padding: '1.85rem',
                        boxShadow: '0 16px 40px rgba(16, 41, 76, 0.08)',
                        backdropFilter: 'blur(20px)'
                    }}>
                        <div style={{ textAlign: 'center', marginBottom: '1.4rem' }}>
                            <div style={{
                                width: '48px',
                                height: '48px',
                                borderRadius: '15px',
                                background: 'rgba(7, 60, 166, 0.2)',
                                border: '1px solid rgba(7, 60, 166, 0.35)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                margin: '0 auto 0.75rem auto'
                            }}>
                                <Lock size={22} color="#174fa9" />
                            </div>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#10294c', marginBottom: '0.25rem' }}>
                                {authMode === 'signin' ? (
                                    language === 'si' ? 'විභාගය ආරම්භ කිරීමට ඇතුල් වන්න' : 'Log in to Access Online Exams'
                                ) : (
                                    language === 'si' ? 'නොමිලේ ශිෂ්‍ය ගිණුමක් සාදන්න' : 'Create Free Student Account'
                                )}
                            </h3>
                            <p style={{ color: '#5e6f86', fontSize: '0.82rem' }}>
                                {language === 'si' ? 'ප්‍රශ්න පත්‍ර සියල්ල සිසුන්ට 100%ක් නොමිලේ ලබාදේ.' : 'All MCQ papers are 100% free for all students.'}
                            </p>
                        </div>

                        {/* Mode Switcher */}
                        <div style={{
                            display: 'flex',
                            background: '#ffffff',
                            padding: '4px',
                            borderRadius: '14px',
                            border: '1px solid #e1e8f2',
                            marginBottom: '1.25rem'
                        }}>
                            <button
                                onClick={() => { setAuthMode('signin'); setAuthError(''); setAuthSuccess(''); }}
                                style={{
                                    flex: 1,
                                    padding: '0.6rem',
                                    border: 'none',
                                    borderRadius: '10px',
                                    background: authMode === 'signin' ? 'linear-gradient(135deg, #073ca6 0%, #073ca6 100%)' : 'transparent',
                                    color: authMode === 'signin' ? '#ffffff' : '#5e6f86',
                                    fontWeight: 700,
                                    fontSize: '0.82rem',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s ease'
                                }}
                            >
                                {language === 'si' ? 'ඇතුල් වන්න' : 'Sign In'}
                            </button>
                            <button
                                onClick={() => { setAuthMode('signup'); setAuthError(''); setAuthSuccess(''); }}
                                style={{
                                    flex: 1,
                                    padding: '0.6rem',
                                    border: 'none',
                                    borderRadius: '10px',
                                    background: authMode === 'signup' ? 'linear-gradient(135deg, #073ca6 0%, #073ca6 100%)' : 'transparent',
                                    color: authMode === 'signup' ? '#ffffff' : '#5e6f86',
                                    fontWeight: 700,
                                    fontSize: '0.82rem',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s ease'
                                }}
                            >
                                {language === 'si' ? 'නව ගිණුමක්' : 'Create Account'}
                            </button>
                        </div>

                        {authError && (
                            <div style={{
                                marginBottom: '1rem',
                                background: 'rgba(239, 68, 68, 0.12)',
                                border: '1px solid rgba(239, 68, 68, 0.35)',
                                padding: '0.7rem 0.9rem',
                                borderRadius: '12px',
                                color: '#f87171',
                                fontSize: '0.82rem',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.45rem'
                            }}>
                                <AlertCircle size={15} />
                                <span>{authError}</span>
                            </div>
                        )}

                        {authSuccess && (
                            <div style={{
                                marginBottom: '1rem',
                                background: 'rgba(16, 185, 129, 0.12)',
                                border: '1px solid rgba(16, 185, 129, 0.35)',
                                padding: '0.7rem 0.9rem',
                                borderRadius: '12px',
                                color: '#16734a',
                                fontSize: '0.82rem',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.45rem'
                            }}>
                                <CheckCircle2 size={15} />
                                <span>{authSuccess}</span>
                            </div>
                        )}

                        {authMode === 'signin' ? (
                            <form onSubmit={handleSignIn} style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.8rem', color: '#4d607a', marginBottom: '0.35rem', fontWeight: 600 }}>
                                        {language === 'si' ? 'දුරකථන අංකය (Phone Number)' : 'Phone Number'}
                                    </label>
                                    <input 
                                        type="tel"
                                        required
                                        placeholder="07xxxxxxxx"
                                        value={authPhone}
                                        onChange={(e) => setAuthPhone(e.target.value)}
                                        style={{
                                            width: '100%',
                                            padding: '0.75rem 0.95rem',
                                            background: '#ffffff',
                                            border: '1px solid #e1e8f2',
                                            borderRadius: '12px',
                                            color: '#10294c',
                                            fontSize: '0.9rem',
                                            outline: 'none',
                                            boxSizing: 'border-box'
                                        }}
                                    />
                                </div>

                                <div>
                                    <label style={{ display: 'block', fontSize: '0.8rem', color: '#4d607a', marginBottom: '0.35rem', fontWeight: 600 }}>
                                        {language === 'si' ? 'මුරපදය (Password)' : 'Password'}
                                    </label>
                                    <input 
                                        type="password"
                                        required
                                        placeholder="••••••••"
                                        value={authPassword}
                                        onChange={(e) => setAuthPassword(e.target.value)}
                                        style={{
                                            width: '100%',
                                            padding: '0.75rem 0.95rem',
                                            background: '#ffffff',
                                            border: '1px solid #e1e8f2',
                                            borderRadius: '12px',
                                            color: '#10294c',
                                            fontSize: '0.9rem',
                                            outline: 'none',
                                            boxSizing: 'border-box'
                                        }}
                                    />
                                </div>

                                <button 
                                    type="submit"
                                    disabled={authLoading}
                                    style={{
                                        marginTop: '0.3rem',
                                        padding: '0.8rem',
                                        borderRadius: '12px',
                                        background: 'linear-gradient(135deg, #073ca6 0%, #073ca6 50%, #073ca6 100%)',
                                        color: '#10294c',
                                        border: 'none',
                                        fontWeight: 700,
                                        fontSize: '0.9rem',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '0.45rem'
                                    }}
                                >
                                    {authLoading ? 'Signing in...' : (language === 'si' ? 'ඇතුල් වන්න (Start Exam)' : 'Log in & Start')}
                                    <ArrowRight size={15} />
                                </button>
                            </form>
                        ) : (
                            <form onSubmit={handleSignUp} style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.8rem', color: '#4d607a', marginBottom: '0.35rem', fontWeight: 600 }}>
                                        {language === 'si' ? 'ඔබගේ නම (Student Name)' : 'Student Name'}
                                    </label>
                                    <input 
                                        type="text"
                                        required
                                        placeholder="Kamal Perera"
                                        value={authName}
                                        onChange={(e) => setAuthName(e.target.value)}
                                        style={{
                                            width: '100%',
                                            padding: '0.75rem 0.95rem',
                                            background: '#ffffff',
                                            border: '1px solid #e1e8f2',
                                            borderRadius: '12px',
                                            color: '#10294c',
                                            fontSize: '0.9rem',
                                            outline: 'none',
                                            boxSizing: 'border-box'
                                        }}
                                    />
                                </div>

                                <div>
                                    <label style={{ display: 'block', fontSize: '0.8rem', color: '#4d607a', marginBottom: '0.35rem', fontWeight: 600 }}>
                                        {language === 'si' ? 'දුරකථන අංකය (Phone Number)' : 'Phone Number'}
                                    </label>
                                    <input 
                                        type="tel"
                                        required
                                        placeholder="07xxxxxxxx"
                                        value={authPhone}
                                        onChange={(e) => setAuthPhone(e.target.value)}
                                        style={{
                                            width: '100%',
                                            padding: '0.75rem 0.95rem',
                                            background: '#ffffff',
                                            border: '1px solid #e1e8f2',
                                            borderRadius: '12px',
                                            color: '#10294c',
                                            fontSize: '0.9rem',
                                            outline: 'none',
                                            boxSizing: 'border-box'
                                        }}
                                    />
                                </div>

                                <div>
                                    <label style={{ display: 'block', fontSize: '0.8rem', color: '#4d607a', marginBottom: '0.35rem', fontWeight: 600 }}>
                                        {language === 'si' ? 'නව මුරපදයක් (Create Password)' : 'Create Password'}
                                    </label>
                                    <input 
                                        type="password"
                                        required
                                        placeholder="••••••••"
                                        value={authPassword}
                                        onChange={(e) => setAuthPassword(e.target.value)}
                                        style={{
                                            width: '100%',
                                            padding: '0.75rem 0.95rem',
                                            background: '#ffffff',
                                            border: '1px solid #e1e8f2',
                                            borderRadius: '12px',
                                            color: '#10294c',
                                            fontSize: '0.9rem',
                                            outline: 'none',
                                            boxSizing: 'border-box'
                                        }}
                                    />
                                </div>

                                <button 
                                    type="submit"
                                    disabled={authLoading}
                                    style={{
                                        marginTop: '0.3rem',
                                        padding: '0.8rem',
                                        borderRadius: '12px',
                                        background: 'linear-gradient(135deg, #073ca6 0%, #073ca6 50%, #073ca6 100%)',
                                        color: '#10294c',
                                        border: 'none',
                                        fontWeight: 700,
                                        fontSize: '0.9rem',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '0.45rem'
                                    }}
                                >
                                    {authLoading ? 'Creating account...' : (language === 'si' ? 'නොමිලේ ලියාපදිංචි වන්න' : 'Register Free')}
                                    <ArrowRight size={15} />
                                </button>
                            </form>
                        )}
                    </div>
                ) : (
                    // Logged in student badge
                    <div style={{
                        background: 'linear-gradient(135deg, #ffffff 0%, #ffffff 100%)',
                        border: '1px solid rgba(7, 60, 166, 0.3)',
                        borderRadius: '16px',
                        padding: '0.9rem 1.4rem',
                        marginBottom: '2rem',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                        gap: '1rem',
                        boxShadow: '0 8px 25px rgba(0, 0, 0, 0.35)'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                            <div style={{
                                width: '38px',
                                height: '38px',
                                borderRadius: '12px',
                                background: 'linear-gradient(135deg, #073ca6, #073ca6)',
                                color: '#10294c',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontWeight: 800,
                                fontSize: '1.15rem'
                            }}>
                                {user.name ? user.name.charAt(0).toUpperCase() : 'S'}
                            </div>
                            <div>
                                <div style={{ fontSize: '1rem', fontWeight: 800, color: '#10294c' }}>
                                    {user.name}
                                </div>
                                <div style={{ fontSize: '0.78rem', color: '#5e6f86', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                                    <CheckCircle2 size={13} color="#16734a" />
                                    <span style={{ color: '#16734a', fontWeight: 600 }}>Online Exams Active</span>
                                    <span>•</span>
                                    <span>{user.phone}</span>
                                </div>
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '0.65rem', alignItems: 'center' }}>
                            {viewMode !== 'list' && (
                                <button
                                    onClick={handleBackToList}
                                    style={{
                                        padding: '0.45rem 0.95rem',
                                        borderRadius: '10px',
                                        background: '#e1e8f2',
                                        color: '#203656',
                                        border: '1px solid #e1e8f2',
                                        fontSize: '0.8rem',
                                        fontWeight: 700,
                                        cursor: 'pointer'
                                    }}
                                >
                                    All Papers
                                </button>
                            )}
                            <button
                                onClick={handleLogout}
                                style={{
                                    padding: '0.45rem 0.95rem',
                                    borderRadius: '10px',
                                    background: 'rgba(239, 68, 68, 0.12)',
                                    color: '#f87171',
                                    border: '1px solid rgba(239, 68, 68, 0.3)',
                                    fontSize: '0.8rem',
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.35rem'
                                }}
                            >
                                <LogOut size={13} /> Logout
                            </button>
                        </div>
                    </div>
                )}

                {/* 3. Papers List */}
                {viewMode === 'list' && (
                    <div>
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: '1.35rem',
                            flexWrap: 'wrap',
                            gap: '0.85rem'
                        }}>
                            <div>
                                <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#10294c', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <BarChart3 size={20} color="#174fa9" />
                                    <span>{language === 'si' ? 'පවතින ප්‍රශ්න පත්‍ර (Available Exam Papers)' : 'Available Exam Papers'}</span>
                                </h3>
                                <p style={{ color: '#5e6f86', fontSize: '0.85rem', marginTop: '0.15rem' }}>
                                    Select any paper to begin. Practice anytime with automated scoring & theory explanations.
                                </p>
                            </div>
                            <div style={{
                                background: 'linear-gradient(135deg, rgba(7, 60, 166, 0.15) 0%, rgba(6, 182, 212, 0.15) 100%)',
                                border: '1px solid rgba(7, 60, 166, 0.3)',
                                borderRadius: '999px',
                                padding: '0.35rem 0.95rem',
                                fontSize: '0.8rem',
                                fontWeight: 700,
                                color: '#174fa9',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.35rem'
                            }}>
                                <Zap size={13} color="#174fa9" />
                                <span>Total Papers: {papers.length}</span>
                            </div>
                        </div>

                        {loadingPapers ? (
                            <div style={{ textAlign: 'center', padding: '3.5rem' }}>
                                <div style={{
                                    width: '38px',
                                    height: '38px',
                                    border: '3px solid rgba(7, 60, 166, 0.2)',
                                    borderTopColor: '#174fa9',
                                    borderRadius: '50%',
                                    margin: '0 auto 1rem auto'
                                }} className="animate-spin" />
                                <p style={{ color: '#5e6f86', fontSize: '0.9rem' }}>Loading exam papers...</p>
                            </div>
                        ) : papers.length === 0 ? (
                            <div style={{
                                background: '#ffffff',
                                border: '1px solid #e1e8f2',
                                borderRadius: '20px',
                                padding: '3.5rem 2rem',
                                textAlign: 'center'
                            }}>
                                <BookOpen size={46} color="#174fa9" style={{ margin: '0 auto 1rem auto', opacity: 0.6 }} />
                                <h4 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#10294c', marginBottom: '0.4rem' }}>
                                    No exam papers available yet
                                </h4>
                                <p style={{ color: '#5e6f86', fontSize: '0.88rem' }}>
                                    The administrator will upload new MCQ papers shortly.
                                </p>
                            </div>
                        ) : (
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(310px, 1fr))', gap: '1.25rem' }}>
                                {papers.map((paper, idx) => (
                                    <div key={paper.id} className="exam-paper-card">
                                        <div>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem' }}>
                                                <span style={{
                                                    background: 'rgba(7, 60, 166, 0.15)',
                                                    color: '#174fa9',
                                                    border: '1px solid rgba(7, 60, 166, 0.35)',
                                                    padding: '3px 10px',
                                                    borderRadius: '8px',
                                                    fontSize: '0.75rem',
                                                    fontWeight: 800
                                                }}>
                                                    Paper {paper.paper_number || idx + 1}
                                                </span>
                                                <span style={{
                                                    background: 'rgba(16, 185, 129, 0.15)',
                                                    color: '#16734a',
                                                    border: '1px solid rgba(16, 185, 129, 0.35)',
                                                    padding: '2px 8px',
                                                    borderRadius: '6px',
                                                    fontSize: '0.72rem',
                                                    fontWeight: 800,
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '0.25rem'
                                                }}>
                                                    <Sparkles size={11} /> 100% FREE
                                                </span>
                                            </div>

                                            <h4 style={{ fontSize: '1.18rem', fontWeight: 800, color: '#10294c', lineHeight: 1.35, marginBottom: '0.65rem' }}>
                                                {paper.title}
                                            </h4>

                                            {paper.description && (
                                                <p style={{ fontSize: '0.84rem', color: '#5e6f86', lineHeight: 1.5, marginBottom: '1.2rem' }}>
                                                    {paper.description}
                                                </p>
                                            )}

                                            <div style={{
                                                display: 'flex',
                                                gap: '1rem',
                                                flexWrap: 'wrap',
                                                fontSize: '0.8rem',
                                                color: '#4d607a',
                                                paddingTop: '0.75rem',
                                                borderTop: '1px solid #e1e8f2',
                                                marginBottom: '1.25rem'
                                            }}>
                                                <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                                    <FileText size={14} color="#174fa9" />
                                                    <strong>{paper.total_questions || '5'} Questions</strong>
                                                </span>
                                                <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                                    <Clock size={14} color="#174fa9" />
                                                    <span>{paper.duration_minutes || '45'} Mins</span>
                                                </span>
                                            </div>
                                        </div>

                                        <button
                                            onClick={() => handleStartExam(paper)}
                                            disabled={loadingActivePaper}
                                            style={{
                                                width: '100%',
                                                padding: '0.8rem',
                                                borderRadius: '12px',
                                                background: 'linear-gradient(135deg, #073ca6 0%, #073ca6 50%, #073ca6 100%)',
                                                color: '#10294c',
                                                border: 'none',
                                                fontWeight: 800,
                                                fontSize: '0.88rem',
                                                cursor: 'pointer',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                gap: '0.45rem'
                                            }}
                                        >
                                            <span>{user ? (language === 'si' ? 'විභාගය ආරම්භ කරන්න' : 'Start Exam') : (language === 'si' ? 'ඇතුල් වී ආරම්භ කරන්න' : 'Log in to Start')}</span>
                                            <ArrowRight size={15} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* 4. Taking Exam Screen */}
                {viewMode === 'taking' && activePaper && currentQ && (
                    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                        <div style={{
                            background: '#ffffff',
                            backdropFilter: 'blur(16px)',
                            border: '1px solid rgba(7, 60, 166, 0.3)',
                            borderRadius: '20px',
                            padding: '1.2rem 1.6rem',
                            marginBottom: '1.25rem',
                            boxShadow: '0 8px 25px rgba(0, 0, 0, 0.4)'
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.85rem', marginBottom: '0.85rem' }}>
                                <div>
                                    <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#174fa9', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                        {activePaper.title}
                                    </span>
                                    <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#10294c', marginTop: '0.15rem' }}>
                                        Question {currentQuestionIndex + 1} of {activePaper.questions.length}
                                    </h3>
                                </div>
                                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                                    <div style={{
                                        background: 'rgba(7, 60, 166, 0.15)',
                                        border: '1px solid rgba(7, 60, 166, 0.3)',
                                        borderRadius: '10px',
                                        padding: '0.4rem 0.85rem',
                                        fontSize: '0.82rem',
                                        fontWeight: 700,
                                        color: '#174fa9',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.35rem'
                                    }}>
                                        <CheckCircle size={13} color="#16734a" />
                                        <span>Answered: {answeredCount}/{activePaper.questions.length}</span>
                                    </div>
                                    <button
                                        onClick={() => setShowSubmitModal(true)}
                                        style={{
                                            padding: '0.48rem 1rem',
                                            borderRadius: '10px',
                                            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                                            color: '#10294c',
                                            border: 'none',
                                            fontWeight: 800,
                                            fontSize: '0.82rem',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.4rem'
                                        }}
                                    >
                                        <Send size={13} /> Submit
                                    </button>
                                </div>
                            </div>

                            {/* Progress bar */}
                            <div style={{
                                width: '100%',
                                height: '5px',
                                background: '#e1e8f2',
                                borderRadius: '999px',
                                overflow: 'hidden',
                                marginBottom: '0.95rem'
                            }}>
                                <div style={{
                                    height: '100%',
                                    width: `${Math.round((answeredCount / activePaper.questions.length) * 100)}%`,
                                    background: 'linear-gradient(90deg, #073ca6 0%, #073ca6 100%)',
                                    borderRadius: '999px',
                                    transition: 'width 0.35s ease'
                                }} />
                            </div>

                            {/* Question Pills */}
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem', paddingTop: '0.75rem', borderTop: '1px solid #e1e8f2' }}>
                                {activePaper.questions.map((q, idx) => {
                                    const isAnswered = !!studentAnswers[q.id];
                                    const isCurrent = currentQuestionIndex === idx;
                                    
                                    let bg = '#e1e8f2';
                                    let border = '#e1e8f2';
                                    let color = '#5e6f86';
                                    let shadow = 'none';

                                    if (isCurrent) {
                                        bg = 'linear-gradient(135deg, #073ca6 0%, #073ca6 100%)';
                                        border = '#174fa9';
                                        color = '#ffffff';
                                        shadow = '0 0 12px rgba(7, 60, 166, 0.5)';
                                    } else if (isAnswered) {
                                        bg = 'rgba(16, 185, 129, 0.18)';
                                        border = 'rgba(16, 185, 129, 0.4)';
                                        color = '#16734a';
                                    }

                                    return (
                                        <button
                                            key={q.id}
                                            className="pill-btn"
                                            onClick={() => setCurrentQuestionIndex(idx)}
                                            style={{
                                                width: '34px',
                                                height: '34px',
                                                borderRadius: '10px',
                                                border: `1.5px solid ${border}`,
                                                background: bg,
                                                color: color,
                                                fontWeight: 800,
                                                fontSize: '0.82rem',
                                                cursor: 'pointer',
                                                boxShadow: shadow
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
                            background: '#ffffff',
                            backdropFilter: 'blur(20px)',
                            border: '1px solid rgba(7, 60, 166, 0.25)',
                            borderRadius: '22px',
                            padding: '1.85rem',
                            marginBottom: '1.5rem',
                            boxShadow: '0 12px 35px rgba(0, 0, 0, 0.45)'
                        }}>
                            <div style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.35rem',
                                background: 'rgba(7, 60, 166, 0.15)',
                                color: '#174fa9',
                                border: '1px solid rgba(7, 60, 166, 0.35)',
                                padding: '3px 10px',
                                borderRadius: '8px',
                                fontSize: '0.78rem',
                                fontWeight: 800,
                                marginBottom: '0.95rem'
                            }}>
                                <Sparkles size={12} color="#174fa9" />
                                <span>Question {currentQuestionIndex + 1} of {activePaper.questions.length}</span>
                            </div>

                            <h2 style={{
                                fontSize: '1.25rem',
                                fontWeight: 800,
                                color: '#10294c',
                                lineHeight: 1.55,
                                marginBottom: '1.6rem'
                            }}>
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
                                            className={`exam-option-card ${isSelected ? 'selected' : ''}`}
                                            onClick={() => handleSelectOption(currentQ.id, opt.letter)}
                                        >
                                            <div style={{
                                                width: '34px',
                                                height: '34px',
                                                borderRadius: '10px',
                                                background: isSelected ? 'linear-gradient(135deg, #073ca6 0%, #073ca6 100%)' : '#e1e8f2',
                                                color: isSelected ? '#ffffff' : '#4d607a',
                                                border: isSelected ? 'none' : '1px solid #e1e8f2',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                fontWeight: 800,
                                                fontSize: '0.88rem',
                                                flexShrink: 0
                                            }}>
                                                {opt.letter}
                                            </div>
                                            <div style={{
                                                fontSize: '0.98rem',
                                                fontWeight: isSelected ? 700 : 500,
                                                color: isSelected ? '#ffffff' : '#203656',
                                                flex: 1
                                            }}>
                                                {opt.text}
                                            </div>
                                            {isSelected && (
                                                <div style={{
                                                    width: '22px',
                                                    height: '22px',
                                                    borderRadius: '50%',
                                                    background: 'linear-gradient(135deg, #073ca6, #073ca6)',
                                                    color: '#10294c',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center'
                                                }}>
                                                    <Check size={13} />
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Controls */}
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                marginTop: '1.85rem',
                                paddingTop: '1.25rem',
                                borderTop: '1px solid #e1e8f2'
                            }}>
                                <button
                                    onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
                                    disabled={currentQuestionIndex === 0}
                                    style={{
                                        padding: '0.65rem 1.25rem',
                                        borderRadius: '12px',
                                        background: currentQuestionIndex === 0 ? '#e1e8f2' : '#e1e8f2',
                                        color: currentQuestionIndex === 0 ? '#475569' : '#203656',
                                        border: '1px solid #e1e8f2',
                                        fontWeight: 700,
                                        fontSize: '0.85rem',
                                        cursor: currentQuestionIndex === 0 ? 'not-allowed' : 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.4rem'
                                    }}
                                >
                                    <ArrowLeft size={15} /> Previous
                                </button>

                                {currentQuestionIndex < activePaper.questions.length - 1 ? (
                                    <button
                                        onClick={() => setCurrentQuestionIndex(prev => Math.min(activePaper.questions.length - 1, prev + 1))}
                                        style={{
                                            padding: '0.65rem 1.35rem',
                                            borderRadius: '12px',
                                            background: 'linear-gradient(135deg, #073ca6 0%, #073ca6 100%)',
                                            color: '#10294c',
                                            border: 'none',
                                            fontWeight: 800,
                                            fontSize: '0.85rem',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.4rem'
                                        }}
                                    >
                                        Next <ArrowRight size={15} />
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => setShowSubmitModal(true)}
                                        style={{
                                            padding: '0.65rem 1.45rem',
                                            borderRadius: '12px',
                                            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                                            color: '#10294c',
                                            border: 'none',
                                            fontWeight: 800,
                                            fontSize: '0.85rem',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.45rem'
                                        }}
                                    >
                                        <Send size={15} /> Finish & Submit
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* 5. Results Screen */}
                {viewMode === 'result' && examResult && (() => {
                    const darkMotivation = getDarkMotivationTheme(examResult.motivation.tier);
                    return (
                        <div style={{ maxWidth: '680px', margin: '0 auto' }}>
                            <div style={{
                                background: 'linear-gradient(135deg, #ffffff 0%, #ffffff 100%)',
                                border: '1px solid rgba(7, 60, 166, 0.3)',
                                borderRadius: '26px',
                                padding: '2.2rem 1.8rem',
                                textAlign: 'center',
                                boxShadow: '0 20px 50px rgba(0, 0, 0, 0.6)',
                                marginBottom: '1.75rem',
                                backdropFilter: 'blur(20px)'
                            }}>
                                <div style={{
                                    width: '64px',
                                    height: '64px',
                                    borderRadius: '20px',
                                    background: darkMotivation.bg,
                                    border: `2px solid ${darkMotivation.border}`,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    margin: '0 auto 1.1rem auto',
                                    boxShadow: darkMotivation.glow
                                }}>
                                    <Trophy size={32} color={darkMotivation.color} />
                                </div>

                                <span style={{
                                    fontSize: '0.8rem',
                                    fontWeight: 800,
                                    color: '#174fa9',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.6px'
                                }}>
                                    Exam Result • {examResult.paper_title}
                                </span>

                                <h2 style={{
                                    fontSize: 'clamp(2.5rem, 5vw, 3.4rem)',
                                    fontWeight: 900,
                                    lineHeight: 1.1,
                                    margin: '0.4rem 0',
                                    letterSpacing: '-0.02em'
                                }} className="gradient-text">
                                    {examResult.percentage}%
                                </h2>
                                
                                <div style={{ fontSize: '1.05rem', fontWeight: 700, color: '#4d607a', marginBottom: '1.4rem' }}>
                                    Marks: <span style={{ color: '#174fa9', fontWeight: 800 }}>{examResult.marks}</span> / {examResult.total_questions}
                                </div>

                                {/* Motivational banner */}
                                <div style={{
                                    background: darkMotivation.bg,
                                    border: `1.5px solid ${darkMotivation.border}`,
                                    borderRadius: '16px',
                                    padding: '1.15rem 1.4rem',
                                    marginBottom: '1.75rem',
                                    textAlign: 'center'
                                }}>
                                    <h4 style={{ fontSize: '1.12rem', fontWeight: 800, color: darkMotivation.color, marginBottom: '0.3rem' }}>
                                        {examResult.motivation.title}
                                    </h4>
                                    <p style={{ fontSize: '0.98rem', fontWeight: 600, color: '#10294c', marginBottom: '0.25rem' }}>
                                        "{examResult.motivation.message}"
                                    </p>
                                    <p style={{ fontSize: '0.85rem', color: '#4d607a', lineHeight: 1.5 }}>
                                        {examResult.motivation.messageSi}
                                    </p>
                                </div>

                                {/* Stats Grid */}
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.85rem', marginBottom: '1.85rem' }}>
                                    <div style={{
                                        background: '#ffffff',
                                        border: '1px solid #e1e8f2',
                                        borderRadius: '14px',
                                        padding: '0.85rem'
                                    }}>
                                        <div style={{ fontSize: '0.75rem', color: '#5e6f86', fontWeight: 700 }}>Total</div>
                                        <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#10294c', marginTop: '0.15rem' }}>
                                            {examResult.total_questions}
                                        </div>
                                    </div>
                                    <div style={{
                                        background: 'rgba(16, 185, 129, 0.12)',
                                        border: '1px solid rgba(16, 185, 129, 0.35)',
                                        borderRadius: '14px',
                                        padding: '0.85rem'
                                    }}>
                                        <div style={{ fontSize: '0.75rem', color: '#16734a', fontWeight: 700 }}>Correct</div>
                                        <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#16734a', marginTop: '0.15rem' }}>
                                            {examResult.correct_answers}
                                        </div>
                                    </div>
                                    <div style={{
                                        background: 'rgba(239, 68, 68, 0.12)',
                                        border: '1px solid rgba(239, 68, 68, 0.35)',
                                        borderRadius: '14px',
                                        padding: '0.85rem'
                                    }}>
                                        <div style={{ fontSize: '0.75rem', color: '#f87171', fontWeight: 700 }}>Incorrect</div>
                                        <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#f87171', marginTop: '0.15rem' }}>
                                            {examResult.incorrect_answers + examResult.unanswered}
                                        </div>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                    <button
                                        onClick={() => setViewMode('review')}
                                        style={{
                                            width: '100%',
                                            padding: '0.9rem',
                                            borderRadius: '14px',
                                            background: 'linear-gradient(135deg, #073ca6 0%, #073ca6 50%, #073ca6 100%)',
                                            color: '#10294c',
                                            border: 'none',
                                            fontWeight: 800,
                                            fontSize: '0.92rem',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: '0.5rem'
                                        }}
                                    >
                                        <BookOpen size={18} /> Review Answers & Explanations (විවරණ බලන්න)
                                    </button>

                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                                        <button
                                            onClick={handleRetakeExam}
                                            style={{
                                                padding: '0.75rem',
                                                borderRadius: '12px',
                                                background: '#e1e8f2',
                                                color: '#203656',
                                                border: '1px solid #e1e8f2',
                                                fontWeight: 700,
                                                fontSize: '0.85rem',
                                                cursor: 'pointer',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                gap: '0.4rem'
                                            }}
                                        >
                                            <RotateCcw size={15} /> Retake Paper
                                        </button>
                                        <button
                                            onClick={handleBackToList}
                                            style={{
                                                padding: '0.75rem',
                                                borderRadius: '12px',
                                                background: 'rgba(7, 60, 166, 0.12)',
                                                color: '#174fa9',
                                                border: '1px solid rgba(7, 60, 166, 0.3)',
                                                fontWeight: 700,
                                                fontSize: '0.85rem',
                                                cursor: 'pointer'
                                            }}
                                        >
                                            Back to All Papers
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })()}

                {/* 6. Review Screen */}
                {viewMode === 'review' && examResult && (
                    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                        <div style={{
                            background: 'linear-gradient(135deg, #ffffff 0%, #ffffff 100%)',
                            border: '1px solid rgba(7, 60, 166, 0.35)',
                            borderRadius: '20px',
                            padding: '1.2rem 1.6rem',
                            marginBottom: '1.4rem',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            flexWrap: 'wrap',
                            gap: '0.85rem',
                            boxShadow: '0 8px 25px rgba(0, 0, 0, 0.4)'
                        }}>
                            <div>
                                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#10294c' }}>
                                    Question Review & Theory Explanations
                                </h3>
                                <p style={{ fontSize: '0.84rem', color: '#5e6f86', marginTop: '0.15rem' }}>
                                    Paper: {examResult.paper_title} • Score: <strong style={{ color: '#174fa9' }}>{examResult.marks}/{examResult.total_questions}</strong> ({examResult.percentage}%)
                                </p>
                            </div>
                            <button
                                onClick={handleBackToList}
                                style={{
                                    padding: '0.5rem 1.1rem',
                                    borderRadius: '10px',
                                    background: 'linear-gradient(135deg, #073ca6 0%, #073ca6 100%)',
                                    color: '#10294c',
                                    border: 'none',
                                    fontWeight: 700,
                                    fontSize: '0.82rem',
                                    cursor: 'pointer'
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
                                        background: '#ffffff',
                                        backdropFilter: 'blur(16px)',
                                        border: item.is_correct ? '1.5px solid rgba(16, 185, 129, 0.4)' : '1.5px solid rgba(239, 68, 68, 0.4)',
                                        borderRadius: '20px',
                                        padding: '1.5rem',
                                        boxShadow: '0 6px 22px rgba(0, 0, 0, 0.35)'
                                    }}
                                >
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                                        <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#174fa9' }}>
                                            Question {idx + 1}
                                        </span>
                                        {item.is_correct ? (
                                            <span style={{
                                                background: 'rgba(16, 185, 129, 0.15)',
                                                color: '#16734a',
                                                border: '1px solid rgba(16, 185, 129, 0.4)',
                                                padding: '3px 10px',
                                                borderRadius: '8px',
                                                fontSize: '0.78rem',
                                                fontWeight: 800,
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '0.3rem'
                                            }}>
                                                <CheckCircle2 size={13} /> Correct (+1 Mark)
                                            </span>
                                        ) : (
                                            <span style={{
                                                background: 'rgba(239, 68, 68, 0.15)',
                                                color: '#f87171',
                                                border: '1px solid rgba(239, 68, 68, 0.4)',
                                                padding: '3px 10px',
                                                borderRadius: '8px',
                                                fontSize: '0.78rem',
                                                fontWeight: 800,
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '0.3rem'
                                            }}>
                                                <XCircle size={13} /> Incorrect (0 Marks)
                                            </span>
                                        )}
                                    </div>

                                    <h4 style={{ fontSize: '1.12rem', fontWeight: 800, color: '#10294c', lineHeight: 1.45, marginBottom: '1.15rem' }}>
                                        {item.question_text}
                                    </h4>

                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.65rem', marginBottom: '1.15rem' }}>
                                        {[
                                            { letter: 'A', text: item.option_a },
                                            { letter: 'B', text: item.option_b },
                                            { letter: 'C', text: item.option_c },
                                            { letter: 'D', text: item.option_d }
                                        ].map(opt => {
                                            const isStudentPick = item.student_answer === opt.letter;
                                            const isCorrectAnswer = item.correct_answer === opt.letter;

                                            let bg = '#ffffff';
                                            let border = '#e1e8f2';
                                            let badgeColor = '#5e6f86';

                                            if (isCorrectAnswer) {
                                                bg = 'rgba(16, 185, 129, 0.15)';
                                                border = 'rgba(16, 185, 129, 0.5)';
                                                badgeColor = '#16734a';
                                            } else if (isStudentPick && !item.is_correct) {
                                                bg = 'rgba(239, 68, 68, 0.15)';
                                                border = 'rgba(239, 68, 68, 0.5)';
                                                badgeColor = '#f87171';
                                            }

                                            return (
                                                <div
                                                    key={opt.letter}
                                                    style={{
                                                        padding: '0.75rem 0.9rem',
                                                        borderRadius: '12px',
                                                        background: bg,
                                                        border: `1.5px solid ${border}`,
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: '0.65rem',
                                                        fontSize: '0.88rem'
                                                    }}
                                                >
                                                    <strong style={{ color: badgeColor, minWidth: '18px' }}>{opt.letter}.</strong>
                                                    <span style={{ color: '#10294c', fontWeight: isCorrectAnswer || isStudentPick ? 700 : 500 }}>
                                                        {opt.text}
                                                    </span>
                                                    {isCorrectAnswer && (
                                                        <span style={{ marginLeft: 'auto', fontSize: '0.72rem', color: '#16734a', fontWeight: 800 }}>
                                                            ✓ Correct
                                                        </span>
                                                    )}
                                                    {isStudentPick && !item.is_correct && (
                                                        <span style={{ marginLeft: 'auto', fontSize: '0.72rem', color: '#f87171', fontWeight: 800 }}>
                                                            ✗ Your Pick
                                                        </span>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>

                                    {/* Explanation */}
                                    <div style={{
                                        background: 'linear-gradient(135deg, rgba(7, 60, 166, 0.1) 0%, rgba(6, 182, 212, 0.06) 100%)',
                                        border: '1px solid rgba(7, 60, 166, 0.3)',
                                        borderRadius: '14px',
                                        padding: '1rem 1.25rem'
                                    }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', color: '#174fa9', fontWeight: 800, fontSize: '0.85rem', marginBottom: '0.45rem' }}>
                                            <BookOpen size={15} color="#174fa9" />
                                            <span>සිද්ධාන්ත විවරණය (Theory & Concept Explanation):</span>
                                        </div>
                                        <p style={{ color: '#4d607a', fontSize: '0.88rem', lineHeight: 1.6, whiteSpace: 'pre-line' }}>
                                            {item.explanation || 'මෙම ප්‍රශ්නයට අදාළ සටහනක් නොමැත.'}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

            </main>

            {/* 7. Docked WhatsApp Help */}
            <div style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 1000 }}>
                <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        background: 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)',
                        color: '#FFFFFF',
                        padding: '0.65rem 1.15rem',
                        borderRadius: '999px',
                        fontWeight: 700,
                        fontSize: '0.85rem',
                        textDecoration: 'none',
                        boxShadow: '0 6px 20px rgba(37, 211, 102, 0.45)',
                        transition: 'all 0.2s ease'
                    }}
                    title="Need help? Contact tutor on WhatsApp"
                >
                    <MessageSquare size={17} />
                    <span>WhatsApp Tutor</span>
                </a>
            </div>

            {/* 8. Submit Modal */}
            {showSubmitModal && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    background: 'rgba(9, 13, 22, 0.85)',
                    backdropFilter: 'blur(12px)',
                    zIndex: 2000,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '1.25rem'
                }}>
                    <div style={{
                        background: 'linear-gradient(135deg, #fff 0%, #ffffff 100%)',
                        border: '1px solid rgba(7, 60, 166, 0.35)',
                        borderRadius: '22px',
                        maxWidth: '420px',
                        width: '100%',
                        padding: '1.85rem',
                        textAlign: 'center',
                        boxShadow: '0 20px 45px rgba(0, 0, 0, 0.6)'
                    }}>
                        <div style={{
                            width: '50px',
                            height: '50px',
                            borderRadius: '15px',
                            background: 'rgba(7, 60, 166, 0.2)',
                            border: '1px solid rgba(7, 60, 166, 0.4)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto 1rem auto'
                        }}>
                            <Send size={22} color="#174fa9" />
                        </div>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#10294c', marginBottom: '0.35rem' }}>
                            Submit Exam Paper?
                        </h3>
                        <p style={{ color: '#5e6f86', fontSize: '0.88rem', marginBottom: '1.35rem', lineHeight: 1.5 }}>
                            You have answered <strong style={{ color: '#174fa9' }}>{answeredCount}</strong> of <strong style={{ color: '#10294c' }}>{activePaper?.questions?.length}</strong> questions.
                            {answeredCount < (activePaper?.questions?.length || 0) && (
                                <span style={{ display: 'block', color: '#f87171', marginTop: '0.3rem', fontWeight: 700 }}>
                                    ⚠️ Warning: There are {activePaper.questions.length - answeredCount} unanswered questions!
                                </span>
                            )}
                        </p>

                        <div style={{ display: 'flex', gap: '0.75rem' }}>
                            <button
                                onClick={() => setShowSubmitModal(false)}
                                style={{
                                    flex: 1,
                                    padding: '0.75rem',
                                    borderRadius: '12px',
                                    background: '#e1e8f2',
                                    border: '1px solid #e1e8f2',
                                    color: '#4d607a',
                                    fontWeight: 700,
                                    fontSize: '0.85rem',
                                    cursor: 'pointer'
                                }}
                            >
                                Continue
                            </button>
                            <button
                                onClick={handleSubmitExam}
                                disabled={submitting}
                                style={{
                                    flex: 1,
                                    padding: '0.75rem',
                                    borderRadius: '12px',
                                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                                    border: 'none',
                                    color: '#10294c',
                                    fontWeight: 800,
                                    fontSize: '0.85rem',
                                    cursor: 'pointer'
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
