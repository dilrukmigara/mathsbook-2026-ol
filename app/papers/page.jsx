'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '../../src/components/Navbar';
import Footer from '../../src/components/Footer';
import FloatingWhatsapp from '../../src/components/FloatingWhatsapp';
import { useLanguage, LanguageProvider } from '../../src/context/LanguageContext';
import { 
  FileText, Download, Eye, Folder, FolderOpen, Search, Lock, 
  Sparkles, CheckCircle2, User, LogOut, ArrowRight, BookOpen, 
  Layers, ShieldAlert, X, Filter, ExternalLink, Calendar, HelpCircle
} from 'lucide-react';

function PapersContent() {
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

    // Grade and Filter State
    const [selectedGrade, setSelectedGrade] = useState('grade_10'); // 'grade_10' | 'grade_11'
    const [selectedTopicId, setSelectedTopicId] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');

    // Papers and Topics Data
    const [topics, setTopics] = useState([]);
    const [papers, setPapers] = useState([]);
    const [loadingData, setLoadingData] = useState(true);
    const [stats, setStats] = useState({ totalPapers: 0, grade10Count: 0, grade11Count: 0 });

    // PDF Preview Modal
    const [previewPaper, setPreviewPaper] = useState(null);

    // Initial check for existing session
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('mathsbook_student_session');
            if (saved) {
                try {
                    const parsed = JSON.parse(saved);
                    setUser(parsed);
                } catch (e) {
                    console.error('Session error', e);
                }
            }
        }
        fetchPapersData();
    }, []);

    // Fetch topics and papers
    const fetchPapersData = async () => {
        setLoadingData(true);
        try {
            const res = await fetch('/api/papers');
            const data = await res.json();
            if (res.ok && data.success) {
                setTopics(data.topics || []);
                setPapers(data.papers || []);
                if (data.stats) setStats(data.stats);
            }
        } catch (err) {
            console.error('Failed to fetch papers:', err);
        } finally {
            setLoadingData(false);
        }
    };

    // Handle student login
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
                setAuthSuccess(language === 'si' ? 'සාර්ථකව ඇතුල් විය!' : 'Successfully signed in!');
                setUser(data.user);
                if (typeof window !== 'undefined') {
                    localStorage.setItem('mathsbook_student_session', JSON.stringify(data.user));
                }
            } else {
                setAuthError(data.error || (language === 'si' ? 'ඇතුල්වීම අසාර්ථකයි.' : 'Sign in failed.'));
            }
        } catch (err) {
            setAuthError('Error: ' + err.message);
        } finally {
            setAuthLoading(false);
        }
    };

    // Handle student register (Free account)
    const handleSignUp = async (e) => {
        e.preventDefault();
        if (!authName.trim() || !authPhone.trim() || !authPassword.trim()) {
            setAuthError(language === 'si' ? 'කරුණාකර සියලු තොරතුරු ඇතුළත් කරන්න.' : 'Please fill all required fields.');
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
                setAuthSuccess(language === 'si' ? 'නොමිලේ ගිණුම සාර්ථකව සාදන ලදී!' : 'Free account created successfully!');
                setUser(data.user);
                if (typeof window !== 'undefined') {
                    localStorage.setItem('mathsbook_student_session', JSON.stringify(data.user));
                }
            } else {
                setAuthError(data.error || (language === 'si' ? 'ලියාපදිංචිය අසාර්ථකයි.' : 'Sign up failed.'));
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
        setAuthPhone('');
        setAuthPassword('');
        setAuthName('');
        setAuthError('');
        setAuthSuccess('');
    };

    // Trigger PDF download and increment count
    const handleDownload = async (paper) => {
        try {
            // Track download in background
            fetch('/api/papers', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'download', paperId: paper.id })
            }).catch(() => {});

            // Trigger file download
            const link = document.createElement('a');
            link.href = paper.fileUrl;
            link.download = paper.fileName || `${paper.title}.pdf`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            // Optimistically update local download count
            setPapers(prev => prev.map(p => p.id === paper.id ? { ...p, downloads: (p.downloads || 0) + 1 } : p));
        } catch (e) {
            console.error('Download error:', e);
        }
    };

    // Filter topics for the currently active grade
    const currentGradeTopics = topics.filter(t => t.grade === selectedGrade);

    // Filter papers for active grade, topic, and search
    const displayedPapers = papers.filter(p => {
        const matchesGrade = p.grade === selectedGrade;
        const matchesTopic = selectedTopicId === 'all' || p.topicId === selectedTopicId;
        const matchesSearch = !searchQuery.trim() || 
            p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (p.topicName && p.topicName.toLowerCase().includes(searchQuery.toLowerCase())) ||
            (p.term && p.term.toLowerCase().includes(searchQuery.toLowerCase()));
        return matchesGrade && matchesTopic && matchesSearch;
    });

    const activeTopicObject = currentGradeTopics.find(t => t.id === selectedTopicId);

    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Navbar />

            <main style={{ flex: 1, paddingTop: '86px', paddingBottom: '60px', position: 'relative', zIndex: 1 }} className="container">
                {/* Background glow */}
                <div style={{
                    position: 'absolute', top: '15%', left: '50%', transform: 'translate(-50%, -50%)',
                    width: '800px', height: '500px',
                    background: 'radial-gradient(ellipse, rgba(99, 102, 241, 0.12) 0%, transparent 70%)',
                    filter: 'blur(70px)', zIndex: -1
                }} />

                {/* Hero Header */}
                <div style={{ textAlign: 'center', maxWidth: '840px', margin: '0 auto 2rem auto' }}>
                    <div style={{
                        display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                        background: 'rgba(99, 102, 241, 0.12)', border: '1px solid rgba(99, 102, 241, 0.35)',
                        padding: '0.35rem 0.95rem', borderRadius: '999px', color: '#818cf8',
                        fontSize: '0.82rem', fontWeight: 700, marginBottom: '0.9rem'
                    }}>
                        <Sparkles size={15} /> 100% Free Educational Papers • Grade 10 & 11
                    </div>

                    <h1 style={{ fontSize: 'clamp(2rem, 3.8vw, 2.75rem)', fontWeight: 900, lineHeight: 1.25, marginBottom: '0.85rem' }}>
                        {language === 'si' ? (
                            <>නොමිලේ ගණිත <span className="gradient-text">ප්‍රශ්න පත්‍ර සහ ආදර්ශ පත්‍ර</span></>
                        ) : (
                            <>Free Mathematics <span className="gradient-text">Papers & Model Papers</span></>
                        )}
                    </h1>

                    <p style={{ color: '#94a3b8', fontSize: '1.05rem', lineHeight: 1.62 }}>
                        {language === 'si'
                            ? '10 සහ 11 ශ්‍රේණි සඳහා සියලුම පාඩම් ආවරණය වන පරිදි සකස් කරන ලද ප්‍රශ්න පත්‍ර නොමිලේ ලබාගන්න. ප්‍රශ්න පත්‍ර බාගත කිරීමට (Download) කරුණාකර ඔබගේ නොමිලේ ගිණුමෙන් ඇතුල් වන්න.'
                            : 'Access high quality topic-by-topic math exam and model papers for Grade 10 & Grade 11. Create a free account or log in to view and download all PDFs.'
                        }
                    </p>
                </div>

                {/* Student Session Banner (when logged in) */}
                {user ? (
                    <div style={{
                        background: 'linear-gradient(135deg, rgba(26, 31, 56, 0.95) 0%, rgba(15, 23, 42, 0.95) 100%)',
                        border: '1px solid rgba(99, 102, 241, 0.35)',
                        borderRadius: '20px', padding: '1rem 1.5rem',
                        marginBottom: '2rem', display: 'flex', justifyContent: 'space-between',
                        alignItems: 'center', flexWrap: 'wrap', gap: '1rem',
                        boxShadow: '0 8px 30px rgba(0,0,0,0.3)'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                            <div style={{
                                width: '42px', height: '42px', borderRadius: '12px',
                                background: 'linear-gradient(135deg, #6366f1, #06b6d4)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                color: '#fff', fontWeight: 800, fontSize: '1.2rem'
                            }}>
                                {user.name ? user.name.charAt(0).toUpperCase() : 'S'}
                            </div>
                            <div>
                                <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#f8fafc' }}>
                                    {language === 'si' ? `ආයුබෝවන්, ${user.name}` : `Welcome, ${user.name}`}
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: '#34d399' }}>
                                    <CheckCircle2 size={14} /> 
                                    <span>{language === 'si' ? 'නොමිලේ ප්‍රශ්න පත්‍ර පහසුකම සක්‍රියයි' : 'Free Papers Access Active'}</span>
                                    <span style={{ color: '#64748b' }}>• {user.phone}</span>
                                </div>
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                            <button 
                                onClick={handleLogout}
                                className="btn btn-secondary btn-sm"
                                style={{ gap: '0.4rem', color: '#fca5a5', borderColor: 'rgba(239, 68, 68, 0.3)' }}
                            >
                                <LogOut size={14} /> {language === 'si' ? 'ඉවත් වන්න (Logout)' : 'Logout'}
                            </button>
                        </div>
                    </div>
                ) : (
                    // AUTHENTICATION REQUIRED CARD
                    <div style={{
                        maxWidth: '540px', margin: '0 auto 3rem auto',
                        background: 'linear-gradient(145deg, rgba(26, 31, 56, 0.95) 0%, rgba(15, 23, 42, 0.98) 100%)',
                        border: '1px solid rgba(99, 102, 241, 0.4)', borderRadius: '24px',
                        padding: '2rem 2.2rem', boxShadow: '0 0 45px rgba(99, 102, 241, 0.25)',
                        position: 'relative'
                    }}>
                        <div style={{
                            position: 'absolute', top: '-14px', left: '50%', transform: 'translateX(-50%)',
                            background: 'linear-gradient(135deg, #6366f1, #06b6d4)',
                            color: '#fff', padding: '3px 14px', borderRadius: '999px',
                            fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px'
                        }}>
                            Free Student Access
                        </div>

                        <div style={{ textAlign: 'center', marginBottom: '1.5rem', marginTop: '0.5rem' }}>
                            <div style={{
                                width: '50px', height: '50px', borderRadius: '15px',
                                background: 'rgba(99, 102, 241, 0.15)', border: '1px solid rgba(99, 102, 241, 0.3)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.75rem auto'
                            }}>
                                <Lock size={24} color="#818cf8" />
                            </div>
                            <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#f8fafc', marginBottom: '0.2rem' }}>
                                {authMode === 'signin' ? (
                                    language === 'si' ? 'ප්‍රශ්න පත්‍ර ලබා ගැනීමට ඇතුල් වන්න' : 'Log in to Access Free Papers'
                                ) : (
                                    language === 'si' ? 'නොමිලේ ශිෂ්‍ය ගිණුමක් සාදන්න' : 'Create Free Student Account'
                                )}
                            </h3>
                            <p style={{ color: '#94a3b8', fontSize: '0.85rem' }}>
                                {language === 'si'
                                    ? 'කිසිදු ගෙවීමක් අවශ්‍ය නැත. ගිණුම සාදා සියලුම PDF නොමිලේ බාගත කරන්න.'
                                    : '100% Free forever. No subscriptions or hidden fees.'}
                            </p>
                        </div>

                        {/* Mode Switcher */}
                        <div style={{
                            display: 'flex', background: 'rgba(15, 23, 42, 0.9)', padding: '4px',
                            borderRadius: '14px', border: '1px solid rgba(255,255,255,0.06)', marginBottom: '1.25rem'
                        }}>
                            <button
                                onClick={() => { setAuthMode('signin'); setAuthError(''); setAuthSuccess(''); }}
                                style={{
                                    flex: 1, padding: '0.6rem', border: 'none', borderRadius: '10px',
                                    background: authMode === 'signin' ? '#6366f1' : 'transparent',
                                    color: authMode === 'signin' ? '#fff' : '#94a3b8',
                                    fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer', transition: 'all 0.2s ease'
                                }}
                            >
                                {language === 'si' ? 'ඇතුල් වන්න (Sign In)' : 'Sign In'}
                            </button>
                            <button
                                onClick={() => { setAuthMode('signup'); setAuthError(''); setAuthSuccess(''); }}
                                style={{
                                    flex: 1, padding: '0.6rem', border: 'none', borderRadius: '10px',
                                    background: authMode === 'signup' ? '#6366f1' : 'transparent',
                                    color: authMode === 'signup' ? '#fff' : '#94a3b8',
                                    fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer', transition: 'all 0.2s ease'
                                }}
                            >
                                {language === 'si' ? 'නව ගිණුමක් (Sign Up)' : 'Create Account'}
                            </button>
                        </div>

                        {authError && (
                            <div style={{
                                marginBottom: '1rem', background: 'rgba(239, 68, 68, 0.15)',
                                border: '1px solid rgba(239, 68, 68, 0.35)', padding: '0.75rem 1rem',
                                borderRadius: '12px', color: '#fca5a5', fontSize: '0.85rem'
                            }}>
                                {authError}
                            </div>
                        )}

                        {authSuccess && (
                            <div style={{
                                marginBottom: '1rem', background: 'rgba(16, 185, 129, 0.15)',
                                border: '1px solid rgba(16, 185, 129, 0.35)', padding: '0.75rem 1rem',
                                borderRadius: '12px', color: '#6ee7b7', fontSize: '0.85rem'
                            }}>
                                {authSuccess}
                            </div>
                        )}

                        {authMode === 'signin' ? (
                            <form onSubmit={handleSignIn} style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.8rem', color: '#cbd5e1', marginBottom: '0.35rem', fontWeight: 600 }}>
                                        {language === 'si' ? 'දුරකථන අංකය (Phone Number)' : 'Phone Number'}
                                    </label>
                                    <input 
                                        id="student-signin-phone"
                                        type="tel"
                                        required
                                        placeholder="07xxxxxxxx"
                                        value={authPhone}
                                        onChange={(e) => setAuthPhone(e.target.value)}
                                        style={{
                                            width: '100%', padding: '0.8rem 1rem', background: '#090d16',
                                            border: '1px solid rgba(99, 102, 241, 0.35)', borderRadius: '12px',
                                            color: '#fff', fontSize: '0.92rem', outline: 'none'
                                        }}
                                    />
                                </div>

                                <div>
                                    <label style={{ display: 'block', fontSize: '0.8rem', color: '#cbd5e1', marginBottom: '0.35rem', fontWeight: 600 }}>
                                        {language === 'si' ? 'මුරපදය (Password)' : 'Password'}
                                    </label>
                                    <input 
                                        id="student-signin-password"
                                        type="password"
                                        required
                                        placeholder="••••••••"
                                        value={authPassword}
                                        onChange={(e) => setAuthPassword(e.target.value)}
                                        style={{
                                            width: '100%', padding: '0.8rem 1rem', background: '#090d16',
                                            border: '1px solid rgba(99, 102, 241, 0.35)', borderRadius: '12px',
                                            color: '#fff', fontSize: '0.92rem', outline: 'none'
                                        }}
                                    />
                                </div>

                                <button 
                                    id="student-signin-btn"
                                    className="btn btn-primary"
                                    type="submit"
                                    disabled={authLoading}
                                    style={{ width: '100%', justifyContent: 'center', marginTop: '0.5rem', padding: '0.85rem' }}
                                >
                                    {authLoading ? 'Signing in...' : (language === 'si' ? 'ඇතුල් වන්න (Access Papers)' : 'Log in & Access Papers')}
                                </button>
                            </form>
                        ) : (
                            <form onSubmit={handleSignUp} style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.8rem', color: '#cbd5e1', marginBottom: '0.35rem', fontWeight: 600 }}>
                                        {language === 'si' ? 'ඔබගේ නම (Student Name)' : 'Student Full Name'}
                                    </label>
                                    <input 
                                        id="student-signup-name"
                                        type="text"
                                        required
                                        placeholder="Kamal Perera"
                                        value={authName}
                                        onChange={(e) => setAuthName(e.target.value)}
                                        style={{
                                            width: '100%', padding: '0.8rem 1rem', background: '#090d16',
                                            border: '1px solid rgba(99, 102, 241, 0.35)', borderRadius: '12px',
                                            color: '#fff', fontSize: '0.92rem', outline: 'none'
                                        }}
                                    />
                                </div>

                                <div>
                                    <label style={{ display: 'block', fontSize: '0.8rem', color: '#cbd5e1', marginBottom: '0.35rem', fontWeight: 600 }}>
                                        {language === 'si' ? 'දුරකථන අංකය (WhatsApp Phone Number)' : 'Phone Number'}
                                    </label>
                                    <input 
                                        id="student-signup-phone"
                                        type="tel"
                                        required
                                        placeholder="07xxxxxxxx"
                                        value={authPhone}
                                        onChange={(e) => setAuthPhone(e.target.value)}
                                        style={{
                                            width: '100%', padding: '0.8rem 1rem', background: '#090d16',
                                            border: '1px solid rgba(99, 102, 241, 0.35)', borderRadius: '12px',
                                            color: '#fff', fontSize: '0.92rem', outline: 'none'
                                        }}
                                    />
                                </div>

                                <div>
                                    <label style={{ display: 'block', fontSize: '0.8rem', color: '#cbd5e1', marginBottom: '0.35rem', fontWeight: 600 }}>
                                        {language === 'si' ? 'නව මුරපදයක් ඇතුළත් කරන්න (Create Password)' : 'Create Password'}
                                    </label>
                                    <input 
                                        id="student-signup-password"
                                        type="password"
                                        required
                                        placeholder="••••••••"
                                        value={authPassword}
                                        onChange={(e) => setAuthPassword(e.target.value)}
                                        style={{
                                            width: '100%', padding: '0.8rem 1rem', background: '#090d16',
                                            border: '1px solid rgba(99, 102, 241, 0.35)', borderRadius: '12px',
                                            color: '#fff', fontSize: '0.92rem', outline: 'none'
                                        }}
                                    />
                                </div>

                                <button 
                                    id="student-signup-btn"
                                    className="btn btn-primary"
                                    type="submit"
                                    disabled={authLoading}
                                    style={{ width: '100%', justifyContent: 'center', marginTop: '0.5rem', padding: '0.85rem' }}
                                >
                                    {authLoading ? 'Creating account...' : (language === 'si' ? 'නොමිලේ ලියාපදිංචි වන්න' : 'Register Free Account')}
                                </button>
                            </form>
                        )}
                    </div>
                )}

                {/* ============================================================ */}
                {/* GRADE SELECTOR TABS                                          */}
                {/* ============================================================ */}
                <div style={{
                    display: 'flex', justifyContent: 'center', gap: '1rem',
                    marginBottom: '2rem'
                }}>
                    <button
                        onClick={() => { setSelectedGrade('grade_10'); setSelectedTopicId('all'); }}
                        style={{
                            padding: '1rem 2.2rem', borderRadius: '18px',
                            background: selectedGrade === 'grade_10' 
                                ? 'linear-gradient(135deg, #0891b2 0%, #06b6d4 100%)' 
                                : 'rgba(26, 31, 56, 0.8)',
                            color: selectedGrade === 'grade_10' ? '#fff' : '#94a3b8',
                            border: selectedGrade === 'grade_10' 
                                ? '1px solid #22d3ee' 
                                : '1px solid rgba(255,255,255,0.08)',
                            boxShadow: selectedGrade === 'grade_10' ? '0 0 25px rgba(6, 182, 212, 0.35)' : 'none',
                            fontWeight: 800, fontSize: '1.15rem', cursor: 'pointer', transition: 'all 0.25s ease',
                            display: 'flex', alignItems: 'center', gap: '0.6rem'
                        }}
                    >
                        <span>Grade 10</span>
                        <span style={{ fontSize: '0.85rem', opacity: 0.85 }}>({language === 'si' ? '10 ශ්‍රේණිය' : 'O/L Year 1'})</span>
                    </button>

                    <button
                        onClick={() => { setSelectedGrade('grade_11'); setSelectedTopicId('all'); }}
                        style={{
                            padding: '1rem 2.2rem', borderRadius: '18px',
                            background: selectedGrade === 'grade_11' 
                                ? 'linear-gradient(135deg, #d97706 0%, #f59e0b 100%)' 
                                : 'rgba(26, 31, 56, 0.8)',
                            color: selectedGrade === 'grade_11' ? '#fff' : '#94a3b8',
                            border: selectedGrade === 'grade_11' 
                                ? '1px solid #fcd34d' 
                                : '1px solid rgba(255,255,255,0.08)',
                            boxShadow: selectedGrade === 'grade_11' ? '0 0 25px rgba(245, 158, 11, 0.35)' : 'none',
                            fontWeight: 800, fontSize: '1.15rem', cursor: 'pointer', transition: 'all 0.25s ease',
                            display: 'flex', alignItems: 'center', gap: '0.6rem'
                        }}
                    >
                        <span>Grade 11</span>
                        <span style={{ fontSize: '0.85rem', opacity: 0.85 }}>({language === 'si' ? '11 ශ්‍රේණිය' : 'O/L Exam Year'})</span>
                    </button>
                </div>

                {/* ============================================================ */}
                {/* SEARCH & TOPIC/FOLDER FILTER BAR                             */}
                {/* ============================================================ */}
                <div style={{
                    background: 'rgba(26, 31, 56, 0.7)', border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: '20px', padding: '1.25rem 1.5rem', marginBottom: '2rem'
                }}>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center', marginBottom: '1rem' }}>
                        {/* Search input */}
                        <div style={{
                            flex: '1 1 280px', display: 'flex', alignItems: 'center', gap: '0.75rem',
                            background: '#090d16', border: '1px solid rgba(99, 102, 241, 0.25)',
                            borderRadius: '12px', padding: '0.6rem 1rem'
                        }}>
                            <Search size={18} style={{ color: '#64748b' }} />
                            <input 
                                type="text"
                                placeholder={language === 'si' ? 'ප්‍රශ්න පත්‍රයේ නම, මාතෘකාව හෝ වාරය සොයන්න...' : 'Search papers by title or topic...'}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                style={{
                                    background: 'none', border: 'none', color: '#fff',
                                    outline: 'none', fontSize: '0.9rem', width: '100%'
                                }}
                            />
                        </div>

                        {/* Summary badge */}
                        <div style={{ fontSize: '0.88rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                            <FileText size={16} color="#818cf8" />
                            <span>
                                {language === 'si' 
                                    ? `ප්‍රශ්න පත්‍ර ${displayedPapers.length}ක් හමුවිය`
                                    : `Showing ${displayedPapers.length} papers`
                                }
                            </span>
                        </div>
                    </div>

                    {/* Topic Folders Pills */}
                    <div>
                        <div style={{ fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', color: '#64748b', marginBottom: '0.6rem' }}>
                            {language === 'si' ? 'මාතෘකා / Folders අනුව තෝරන්න:' : 'Browse by Topic / Folder:'}
                        </div>

                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem' }}>
                            <button
                                onClick={() => setSelectedTopicId('all')}
                                style={{
                                    display: 'flex', alignItems: 'center', gap: '0.5rem',
                                    padding: '0.5rem 1rem', borderRadius: '12px',
                                    background: selectedTopicId === 'all' ? 'rgba(99, 102, 241, 0.25)' : 'rgba(255,255,255,0.03)',
                                    border: selectedTopicId === 'all' ? '1px solid #818cf8' : '1px solid rgba(255,255,255,0.06)',
                                    color: selectedTopicId === 'all' ? '#fff' : '#94a3b8',
                                    fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer', transition: 'all 0.2s ease'
                                }}
                            >
                                <FolderOpen size={15} color={selectedTopicId === 'all' ? '#818cf8' : '#64748b'} />
                                <span>{language === 'si' ? 'සියලුම මාතෘකා' : 'All Topics'}</span>
                            </button>

                            {currentGradeTopics.map(topic => {
                                const isSelected = selectedTopicId === topic.id;
                                const count = papers.filter(p => p.topicId === topic.id).length;
                                return (
                                    <button
                                        key={topic.id}
                                        onClick={() => setSelectedTopicId(topic.id)}
                                        style={{
                                            display: 'flex', alignItems: 'center', gap: '0.5rem',
                                            padding: '0.5rem 1rem', borderRadius: '12px',
                                            background: isSelected ? 'rgba(99, 102, 241, 0.25)' : 'rgba(255,255,255,0.03)',
                                            border: isSelected ? '1px solid #818cf8' : '1px solid rgba(255,255,255,0.06)',
                                            color: isSelected ? '#fff' : '#94a3b8',
                                            fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer', transition: 'all 0.2s ease'
                                        }}
                                    >
                                        <Folder size={15} color={isSelected ? '#818cf8' : '#64748b'} />
                                        <span>{topic.name}</span>
                                        <span style={{
                                            background: 'rgba(255,255,255,0.1)', fontSize: '0.72rem',
                                            padding: '1px 6px', borderRadius: '6px', color: '#cbd5e1'
                                        }}>
                                            {count}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Active topic banner if one selected */}
                {activeTopicObject && (
                    <div style={{
                        background: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(99, 102, 241, 0.25)',
                        borderRadius: '16px', padding: '1rem 1.4rem', marginBottom: '1.5rem',
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem'
                    }}>
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <FolderOpen size={18} color="#818cf8" />
                                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#f8fafc' }}>
                                    {activeTopicObject.name}
                                </h3>
                            </div>
                            {activeTopicObject.description && (
                                <p style={{ fontSize: '0.82rem', color: '#94a3b8', marginTop: '0.2rem' }}>
                                    {activeTopicObject.description}
                                </p>
                            )}
                        </div>
                        <button
                            onClick={() => setSelectedTopicId('all')}
                            style={{
                                background: 'none', border: 'none', color: '#818cf8',
                                fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer', textDecoration: 'underline'
                            }}
                        >
                            {language === 'si' ? 'සියලුම මාතෘකා පෙන්වන්න' : 'View all topics'}
                        </button>
                    </div>
                )}

                {/* ============================================================ */}
                {/* PAPERS LISTING GRID                                          */}
                {/* ============================================================ */}
                {loadingData ? (
                    <div style={{ textAlign: 'center', padding: '4rem 0' }}>
                        <div className="animate-spin" style={{
                            width: '40px', height: '40px', border: '3px solid rgba(99, 102, 241, 0.2)',
                            borderTopColor: '#6366f1', borderRadius: '50%', margin: '0 auto 1rem auto'
                        }} />
                        <p style={{ color: '#94a3b8' }}>{language === 'si' ? 'ප්‍රශ්න පත්‍ර පූරණය වෙමින් පවතී...' : 'Loading papers list...'}</p>
                    </div>
                ) : displayedPapers.length === 0 ? (
                    <div style={{
                        background: 'rgba(18, 26, 43, 0.75)', border: '1px solid rgba(255,255,255,0.06)',
                        borderRadius: '24px', padding: '4rem 2rem', textAlign: 'center'
                    }}>
                        <FileText size={52} style={{ color: '#64748b', margin: '0 auto 1rem auto', opacity: 0.5 }} />
                        <h4 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#e2e8f0', marginBottom: '0.4rem' }}>
                            {language === 'si' ? 'ප්‍රශ්න පත්‍ර කිසිවක් හමු නොවීය' : 'No Papers Found'}
                        </h4>
                        <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>
                            {language === 'si'
                                ? 'මෙම මාතෘකාව හෝ සෙවුම යටතේ ප්‍රශ්න පත්‍ර නොමැත. කරුණාකර වෙනත් මාතෘකාවක් තෝරන්න.'
                                : 'There are no papers matching your selection. Try clearing filters or selecting another topic.'}
                        </p>
                    </div>
                ) : (
                    <div style={{
                        display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                        gap: '1.25rem'
                    }}>
                        {displayedPapers.map(paper => (
                            <div 
                                key={paper.id}
                                style={{
                                    background: 'linear-gradient(145deg, rgba(26, 31, 56, 0.85) 0%, rgba(15, 23, 42, 0.95) 100%)',
                                    border: '1px solid rgba(99, 102, 241, 0.22)',
                                    borderRadius: '20px', padding: '1.4rem',
                                    display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
                                    boxShadow: '0 8px 25px rgba(0,0,0,0.25)',
                                    transition: 'all 0.25s ease', position: 'relative'
                                }}
                            >
                                <div>
                                    {/* Badges */}
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                                        <span style={{
                                            background: paper.grade === 'grade_10' ? 'rgba(6, 182, 212, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                                            color: paper.grade === 'grade_10' ? '#22d3ee' : '#fbbf24',
                                            border: `1px solid ${paper.grade === 'grade_10' ? 'rgba(6, 182, 212, 0.3)' : 'rgba(245, 158, 11, 0.3)'}`,
                                            fontSize: '0.72rem', padding: '2px 8px', borderRadius: '999px', fontWeight: 700
                                        }}>
                                            {paper.grade === 'grade_10' ? 'Grade 10' : 'Grade 11'}
                                        </span>

                                        <span style={{
                                            background: 'rgba(16, 185, 129, 0.12)', color: '#34d399',
                                            border: '1px solid rgba(16, 185, 129, 0.3)',
                                            fontSize: '0.7rem', padding: '2px 7px', borderRadius: '6px', fontWeight: 700
                                        }}>
                                            FREE PDF
                                        </span>
                                    </div>

                                    {/* Topic name */}
                                    <div style={{ fontSize: '0.8rem', color: '#818cf8', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.4rem' }}>
                                        <Folder size={13} />
                                        <span>{paper.topicName || 'Mathematics Topic'}</span>
                                    </div>

                                    {/* Paper Title */}
                                    <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#f8fafc', lineHeight: 1.35, marginBottom: '0.85rem' }}>
                                        {paper.title}
                                    </h3>

                                    {/* Metadata */}
                                    <div style={{
                                        display: 'flex', flexWrap: 'wrap', gap: '0.75rem',
                                        fontSize: '0.78rem', color: '#94a3b8', borderTop: '1px solid rgba(255,255,255,0.06)',
                                        paddingTop: '0.75rem', marginBottom: '1.25rem'
                                    }}>
                                        <span>Year: <strong style={{ color: '#cbd5e1' }}>{paper.year || '2026'}</strong></span>
                                        <span>•</span>
                                        <span>{paper.term || 'Model Paper'}</span>
                                        <span>•</span>
                                        <span>{paper.fileSize || 'PDF'}</span>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div>
                                    {user ? (
                                        // Logged in user: View & Download Buttons
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem' }}>
                                            <button
                                                onClick={() => setPreviewPaper(paper)}
                                                className="btn btn-secondary btn-sm"
                                                style={{ justifyContent: 'center', gap: '0.35rem', fontSize: '0.82rem' }}
                                            >
                                                <Eye size={14} /> {language === 'si' ? 'නරඹන්න' : 'View PDF'}
                                            </button>

                                            <button
                                                onClick={() => handleDownload(paper)}
                                                className="btn btn-primary btn-sm"
                                                style={{ justifyContent: 'center', gap: '0.35rem', fontSize: '0.82rem' }}
                                            >
                                                <Download size={14} /> {language === 'si' ? 'බාගත කරන්න' : 'Download'}
                                            </button>
                                        </div>
                                    ) : (
                                        // Unauthenticated: Lock Gate
                                        <button
                                            onClick={() => {
                                                window.scrollTo({ top: 180, behavior: 'smooth' });
                                            }}
                                            className="btn btn-primary btn-sm"
                                            style={{
                                                width: '100%', justifyContent: 'center', gap: '0.4rem',
                                                fontSize: '0.82rem', background: 'linear-gradient(135deg, #6366f1, #4f46e5)'
                                            }}
                                        >
                                            <Lock size={14} /> {language === 'si' ? 'නොමිලේ බාගත කිරීමට ඇතුල් වන්න' : 'Log in to Download Free'}
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>

            {/* ============================================================ */}
            {/* PDF PREVIEW MODAL                                            */}
            {/* ============================================================ */}
            {previewPaper && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
                    background: 'rgba(0, 0, 0, 0.85)', backdropFilter: 'blur(10px)',
                    zIndex: 2500, display: 'flex', flexDirection: 'column'
                }}>
                    {/* Top Viewer Bar */}
                    <div style={{
                        background: 'rgba(15, 23, 42, 0.98)', borderBottom: '1px solid rgba(99, 102, 241, 0.3)',
                        padding: '0.85rem 1.5rem', display: 'flex', justifyContent: 'space-between',
                        alignItems: 'center', flexWrap: 'wrap', gap: '1rem'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <FileText size={22} color="#818cf8" />
                            <div>
                                <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#fff' }}>
                                    {previewPaper.title}
                                </h4>
                                <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                                    {previewPaper.grade === 'grade_10' ? 'Grade 10' : 'Grade 11'} • {previewPaper.topicName} • {previewPaper.fileSize}
                                </div>
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center' }}>
                            <button
                                onClick={() => handleDownload(previewPaper)}
                                className="btn btn-primary btn-sm"
                                style={{ gap: '0.4rem', fontSize: '0.82rem' }}
                            >
                                <Download size={14} /> {language === 'si' ? 'PDF බාගත කරන්න' : 'Download PDF'}
                            </button>

                            <a
                                href={previewPaper.fileUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="btn btn-secondary btn-sm"
                                style={{ gap: '0.4rem', fontSize: '0.82rem', textDecoration: 'none' }}
                            >
                                <ExternalLink size={14} /> New Tab
                            </a>

                            <button
                                onClick={() => setPreviewPaper(null)}
                                style={{
                                    background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
                                    borderRadius: '10px', width: '36px', height: '36px', color: '#fff',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer'
                                }}
                            >
                                <X size={20} />
                            </button>
                        </div>
                    </div>

                    {/* PDF Embedded View */}
                    <div style={{ flex: 1, position: 'relative', width: '100%', height: 'calc(100% - 60px)', background: '#1e293b' }}>
                        <iframe 
                            src={previewPaper.fileUrl} 
                            title={previewPaper.title}
                            style={{ width: '100%', height: '100%', border: 'none' }}
                        />
                    </div>
                </div>
            )}

            <Footer />
            <FloatingWhatsapp />
        </div>
    );
}

export default function PapersPage() {
    return (
        <LanguageProvider>
            <PapersContent />
        </LanguageProvider>
    );
}
