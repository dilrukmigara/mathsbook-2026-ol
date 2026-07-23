'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '../../src/components/Navbar';
import Footer from '../../src/components/Footer';
import FloatingWhatsapp from '../../src/components/FloatingWhatsapp';
import { useLanguage } from '../../src/context/LanguageContext';
import { LanguageProvider } from '../../src/context/LanguageContext';
import { Sparkles, Phone, Lock, CheckCircle2, User, LogOut, Video, FileText, UploadCloud, Brain, AlertCircle } from 'lucide-react';

function LMSContent() {
    const { t, language } = useLanguage();
    
    // Auth State
    const [authMode, setAuthMode] = useState('signin'); // 'signin' or 'signup'
    const [phone, setPhone] = useState('');
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    
    // Logged In User State
    const [user, setUser] = useState(null);

    // Simulated Dashboard Data
    const [activeVideo, setActiveVideo] = useState(null);
    const [selectedTab, setSelectedTab] = useState('lessons'); // lessons, materials, ai

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const savedUser = localStorage.getItem('mathsbook_student_session');
            if (savedUser) {
                const parsed = JSON.parse(savedUser);
                setUser(parsed);
                
                // Refresh profile to load latest enrolled courses from Supabase
                fetch('/api/admin/users')
                    .then(r => r.json())
                    .then(data => {
                        if (data.success && data.users) {
                            const fresh = data.users.find(u => u.phone === parsed.phone);
                            if (fresh) {
                                setUser(fresh);
                                localStorage.setItem('mathsbook_student_session', JSON.stringify(fresh));
                            }
                        }
                    })
                    .catch(err => console.error('Error syncing profile:', err));
            }
        }
    }, []);

    const handleSignIn = async (e) => {
        e.preventDefault();
        if (!phone.trim() || !password.trim()) {
            setErrorMsg(language === 'si' ? 'කරුණාකර දුරකථන අංකය සහ මුරපදය ඇතුළත් කරන්න.' : 'Please enter phone number and password.');
            return;
        }

        setLoading(true);
        setErrorMsg('');
        setSuccessMsg('');

        try {
            const res = await fetch('/api/auth/signin', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ phone, password })
            });
            const data = await res.json();

            if (res.ok && data.success) {
                setSuccessMsg(data.message);
                setUser(data.user);
                if (typeof window !== 'undefined') {
                    localStorage.setItem('mathsbook_student_session', JSON.stringify(data.user));
                }
            } else {
                setErrorMsg(data.error || 'ඇතුල්වීම අසාර්ථකයි.');
            }
        } catch (err) {
            setErrorMsg('සම්බන්ධතා දෝෂයක්: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSignUp = async (e) => {
        e.preventDefault();
        if (!name.trim() || !phone.trim() || !password.trim()) {
            setErrorMsg(language === 'si' ? 'කරුණාකර සියලුම තොරතුරු ඇතුළත් කරන්න.' : 'Please fill out all fields.');
            return;
        }

        setLoading(true);
        setErrorMsg('');
        setSuccessMsg('');

        try {
            const res = await fetch('/api/auth/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, phone, password })
            });
            const data = await res.json();

            if (res.ok && data.success) {
                setSuccessMsg(data.message);
                setUser(data.user);
                if (typeof window !== 'undefined') {
                    localStorage.setItem('mathsbook_student_session', JSON.stringify(data.user));
                }
            } else {
                setErrorMsg(data.error || 'ලියාපදිංචි වීම අසාර්ථකයි.');
            }
        } catch (err) {
            setErrorMsg('සම්බන්ධතා දෝෂයක්: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        setUser(null);
        if (typeof window !== 'undefined') {
            localStorage.removeItem('mathsbook_student_session');
        }
        setPhone('');
        setPassword('');
        setName('');
        setAuthMode('signin');
        setErrorMsg('');
        setSuccessMsg('');
    };

    // Simulated Course Materials & Lessons mapped to specific courses
    const mockLessons = [
        { id: 1, title: 'කුලක (Sets) - සිද්ධාන්ත පූර්ණ පුනරීක්ෂණය [Grade 10]', duration: '1h 45m', videoId: 'dQw4w9WgXcQ', course: 'grade_10' },
        { id: 2, title: 'වර්ගජ සමීකරණ (Quadratic Equations) - කෙටි ක්‍රම [Grade 11]', duration: '2h 15m', videoId: 'dQw4w9WgXcQ', course: 'grade_11' },
        { id: 3, title: 'ත්‍රිකෝණමිතිය (Trigonometry) - මූලික සිද්ධාන්ත [Speed Revision]', duration: '1h 30m', videoId: 'dQw4w9WgXcQ', course: 'speed_revision' },
        { id: 4, title: '2026 O/L පළමු පුහුණු ප්‍රශ්න පත්‍රය (Paper Theory)', duration: '2h 00m', videoId: 'dQw4w9WgXcQ', course: 'paper_theory' },
        { id: 5, title: 'නොමිලේ ලබාදෙන ආදර්ශ ප්‍රශ්න පත්‍රය (Free Seminar Paper)', duration: '1h 50m', videoId: 'dQw4w9WgXcQ', course: 'free_paper' }
    ];

    const mockPDFs = [
        { id: 1, title: 'කුලක 01 නිබන්ධනය (Sets Lecture Note)', size: '2.4 MB', course: 'grade_10' },
        { id: 2, title: 'වර්ගජ සමීකරණ ආදර්ශ ප්‍රශ්න පත්‍රය (Quadratic Equations Model Paper)', size: '1.8 MB', course: 'grade_11' },
        { id: 3, title: 'ත්‍රිකෝණමිතිය නිබන්ධනය (Trigonometry Notes)', size: '1.9 MB', course: 'speed_revision' },
        { id: 4, title: '2026 O/L ගණිතය අනුමාන ප්‍රශ්න පත්‍රය (Predicted Paper)', size: '3.1 MB', course: 'paper_theory' },
        { id: 5, title: 'LMS Free Paper 01 (නොමිලේ ලබාදෙන ප්‍රශ්න පත්‍රය)', size: '1.2 MB', course: 'free_paper' }
    ];

    const userEnrolled = user?.enrolledCourses || ['free_paper'];
    const filteredLessons = mockLessons.filter(lesson => userEnrolled.includes(lesson.course));
    const filteredPDFs = mockPDFs.filter(pdf => userEnrolled.includes(pdf.course));

    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Navbar />
            
            <main style={{ flex: 1, paddingTop: '110px', paddingBottom: '70px', position: 'relative', zIndex: 1 }} className="container">
                
                {/* Background glow effects */}
                <div style={{
                    position: 'absolute', top: '20%', left: '50%', transform: 'translate(-50%, -50%)',
                    width: '600px', height: '600px',
                    background: 'radial-gradient(circle, rgba(99, 102, 241, 0.1) 0%, transparent 70%)',
                    filter: 'blur(50px)', zIndex: -1
                }} />

                {!user ? (
                    // AUTHENTICATION CARDS
                    <div style={{ maxWidth: '460px', margin: '40px auto 0 auto' }}>
                        <div style={{
                            background: 'linear-gradient(135deg, rgba(26, 31, 56, 0.95) 0%, rgba(15, 23, 42, 0.98) 100%)',
                            border: '1px solid rgba(99, 102, 241, 0.35)',
                            borderRadius: '24px',
                            padding: '2.5rem 2rem',
                            boxShadow: '0 0 40px rgba(99, 102, 241, 0.2)'
                        }}>
                            
                            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                                <span style={{
                                    background: 'linear-gradient(135deg, #a855f7 0%, #6366f1 100%)',
                                    color: '#fff', fontSize: '0.75rem', fontWeight: 700,
                                    padding: '0.35rem 0.85rem', borderRadius: '999px',
                                    display: 'inline-flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.85rem'
                                }}>
                                    <Sparkles size={14} /> mathsbook LMS Student Portal
                                </span>
                                <h2 style={{ fontSize: '1.6rem', fontWeight: 800 }}>
                                    {authMode === 'signin' 
                                        ? (language === 'si' ? 'ඇතුල්වීම (Sign In)' : 'Student Login')
                                        : (language === 'si' ? 'ලියාපදිංචි වීම (Sign Up)' : 'Student Registration')
                                    }
                                </h2>
                                <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginTop: '0.4rem' }}>
                                    {authMode === 'signin'
                                        ? (language === 'si' ? 'ඔබගේ දුරකථන අංකය සහ මුරපදය ඇතුළත් කර ඇතුල් වන්න' : 'Enter your mobile number and password to login')
                                        : (language === 'si' ? 'නව ගිණුමක් සෑදීම සඳහා තොරතුරු ඇතුළත් කරන්න' : 'Fill in details to register a new student account')
                                    }
                                </p>
                            </div>

                            {/* Status Notices */}
                            {errorMsg && (
                                <div style={{
                                    marginBottom: '1rem', background: 'rgba(239, 68, 68, 0.1)',
                                    border: '1px solid rgba(239, 68, 68, 0.3)', padding: '0.75rem 1rem',
                                    borderRadius: '12px', color: '#fca5a5', fontSize: '0.8rem',
                                    display: 'flex', gap: '0.5rem', alignItems: 'center'
                                }}>
                                    <AlertCircle size={16} color="#ef4444" />
                                    <span>{errorMsg}</span>
                                </div>
                            )}

                            {successMsg && (
                                <div style={{
                                    marginBottom: '1rem', background: 'rgba(16, 185, 129, 0.1)',
                                    border: '1px solid rgba(16, 185, 129, 0.3)', padding: '0.75rem 1rem',
                                    borderRadius: '12px', color: '#6ee7b7', fontSize: '0.8rem',
                                    display: 'flex', gap: '0.5rem', alignItems: 'center'
                                }}>
                                    <CheckCircle2 size={16} color="#10b981" />
                                    <span>{successMsg}</span>
                                </div>
                            )}

                            {/* SIGN IN FORM */}
                            {authMode === 'signin' && (
                                <form onSubmit={handleSignIn} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.85rem', color: '#94a3b8', marginBottom: '0.5rem', fontWeight: 600 }}>
                                            {language === 'si' ? 'දුරකථන අංකය' : 'Phone Number'}
                                        </label>
                                        <div style={{ position: 'relative' }}>
                                            <Phone size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#6366f1' }} />
                                            <input 
                                                type="tel"
                                                required
                                                placeholder="07XXXXXXXX"
                                                value={phone}
                                                onChange={(e) => setPhone(e.target.value)}
                                                style={{
                                                    width: '100%', padding: '0.8rem 1rem 0.8rem 2.5rem', background: '#090d16',
                                                    border: '1px solid rgba(99, 102, 241, 0.4)', borderRadius: '12px',
                                                    color: '#fff', outline: 'none', fontSize: '0.95rem'
                                                }}
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.85rem', color: '#94a3b8', marginBottom: '0.5rem', fontWeight: 600 }}>
                                            {language === 'si' ? 'මුරපදය' : 'Password'}
                                        </label>
                                        <div style={{ position: 'relative' }}>
                                            <Lock size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#6366f1' }} />
                                            <input 
                                                type="password"
                                                required
                                                placeholder="••••••••"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                style={{
                                                    width: '100%', padding: '0.8rem 1rem 0.8rem 2.5rem', background: '#090d16',
                                                    border: '1px solid rgba(99, 102, 241, 0.4)', borderRadius: '12px',
                                                    color: '#fff', outline: 'none', fontSize: '0.95rem'
                                                }}
                                            />
                                        </div>
                                    </div>

                                    <button className="btn btn-primary" type="submit" disabled={loading} style={{ width: '100%', justifyContent: 'center' }}>
                                        {loading ? 'ඇතුල් වෙමින්...' : (language === 'si' ? 'ඇතුල් වන්න (Sign In)' : 'Sign In')}
                                    </button>

                                    <div style={{ textAlign: 'center', marginTop: '0.5rem' }}>
                                        <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
                                            {language === 'si' ? 'ගිණුමක් නොමැතිද? ' : "Don't have an account? "}
                                            <button 
                                                type="button" 
                                                onClick={() => { setAuthMode('signup'); setErrorMsg(''); setSuccessMsg(''); }}
                                                style={{ background: 'none', border: 'none', color: '#06b6d4', fontWeight: 700, cursor: 'pointer', padding: 0 }}
                                            >
                                                {language === 'si' ? 'ලියාපදිංචි වන්න' : 'Sign Up'}
                                            </button>
                                        </span>
                                    </div>
                                </form>
                            )}

                            {/* SIGN UP FORM */}
                            {authMode === 'signup' && (
                                <form onSubmit={handleSignUp} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.85rem', color: '#94a3b8', marginBottom: '0.5rem', fontWeight: 600 }}>
                                            {language === 'si' ? 'ශිෂ්‍යයාගේ නම' : 'Student Name'}
                                        </label>
                                        <div style={{ position: 'relative' }}>
                                            <User size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#6366f1' }} />
                                            <input 
                                                type="text"
                                                required
                                                placeholder="Kamal Perera"
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                                style={{
                                                    width: '100%', padding: '0.8rem 1rem 0.8rem 2.5rem', background: '#090d16',
                                                    border: '1px solid rgba(99, 102, 241, 0.4)', borderRadius: '12px',
                                                    color: '#fff', outline: 'none', fontSize: '0.95rem'
                                                }}
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.85rem', color: '#94a3b8', marginBottom: '0.5rem', fontWeight: 600 }}>
                                            {language === 'si' ? 'දුරකථන අංකය' : 'Phone Number'}
                                        </label>
                                        <div style={{ position: 'relative' }}>
                                            <Phone size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#6366f1' }} />
                                            <input 
                                                type="tel"
                                                required
                                                placeholder="07XXXXXXXX"
                                                value={phone}
                                                onChange={(e) => setPhone(e.target.value)}
                                                style={{
                                                    width: '100%', padding: '0.8rem 1rem 0.8rem 2.5rem', background: '#090d16',
                                                    border: '1px solid rgba(99, 102, 241, 0.4)', borderRadius: '12px',
                                                    color: '#fff', outline: 'none', fontSize: '0.95rem'
                                                }}
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.85rem', color: '#94a3b8', marginBottom: '0.5rem', fontWeight: 600 }}>
                                            {language === 'si' ? 'නව මුරපදය' : 'New Password'}
                                        </label>
                                        <div style={{ position: 'relative' }}>
                                            <Lock size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#6366f1' }} />
                                            <input 
                                                type="password"
                                                required
                                                placeholder="••••••••"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                style={{
                                                    width: '100%', padding: '0.8rem 1rem 0.8rem 2.5rem', background: '#090d16',
                                                    border: '1px solid rgba(99, 102, 241, 0.4)', borderRadius: '12px',
                                                    color: '#fff', outline: 'none', fontSize: '0.95rem'
                                                }}
                                            />
                                        </div>
                                    </div>

                                    <button className="btn btn-primary" type="submit" disabled={loading} style={{ width: '100%', justifyContent: 'center' }}>
                                        {loading ? 'ගිණුම සාදමින්...' : (language === 'si' ? 'ලියාපදිංචි වන්න (Sign Up)' : 'Sign Up')}
                                    </button>

                                    <div style={{ textAlign: 'center', marginTop: '0.5rem' }}>
                                        <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
                                            {language === 'si' ? 'දැනටමත් ගිණුමක් තිබේද? ' : 'Already have an account? '}
                                            <button 
                                                type="button" 
                                                onClick={() => { setAuthMode('signin'); setErrorMsg(''); setSuccessMsg(''); }}
                                                style={{ background: 'none', border: 'none', color: '#06b6d4', fontWeight: 700, cursor: 'pointer', padding: 0 }}
                                            >
                                                {language === 'si' ? 'ඇතුල් වන්න' : 'Sign In'}
                                            </button>
                                        </span>
                                    </div>
                                </form>
                            )}

                        </div>
                    </div>
                ) : (
                    // STUDENT DASHBOARD SCREEN
                    <div>
                        {/* Student Welcome Header Card */}
                        <div style={{
                            background: 'linear-gradient(135deg, rgba(26, 31, 56, 0.85) 0%, rgba(15, 23, 42, 0.95) 100%)',
                            border: '1px solid rgba(99, 102, 241, 0.35)',
                            borderRadius: '24px',
                            padding: '1.75rem 2rem',
                            marginBottom: '2rem',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            flexWrap: 'wrap',
                            gap: '1.25rem'
                        }}>
                            <div>
                                <h2 style={{ fontSize: '1.65rem', fontWeight: 800 }}>
                                    {language === 'si' ? `ආයුබෝවන්, ${user.name}!` : `Welcome Back, ${user.name}!`}
                                </h2>
                                <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginTop: '0.2' }}>
                                    LMS Student ID: <span style={{ color: '#06b6d4', fontWeight: 700 }}>{user.id}</span> | Phone: {user.phone}
                                </p>
                            </div>
                            <button className="btn btn-secondary btn-sm" onClick={handleLogout} style={{ color: '#fca5a5', borderColor: 'rgba(239,68,68,0.2)' }}>
                                <LogOut size={16} /> Logout
                            </button>
                        </div>

                        {/* Video Player Modal/Overlay View */}
                        {activeVideo && (
                            <div style={{
                                background: '#090d16',
                                border: '2px solid rgba(99, 102, 241, 0.5)',
                                borderRadius: '24px',
                                padding: '1rem',
                                marginBottom: '2rem',
                                position: 'relative',
                                boxShadow: '0 0 35px rgba(99,102,241,0.25)'
                            }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', padding: '0 0.5rem' }}>
                                    <h4 style={{ fontWeight: 700, color: '#c7d2fe' }}>{activeVideo.title}</h4>
                                    <button 
                                        onClick={() => setActiveVideo(null)}
                                        style={{ background: 'rgba(239,68,68,0.15)', border: 'none', color: '#ef4444', padding: '0.35rem 0.75rem', borderRadius: '8px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 700 }}
                                    >
                                        Close Player
                                    </button>
                                </div>
                                <div style={{ position: 'relative', width: '100%', aspectRatio: '16/9', overflow: 'hidden', borderRadius: '16px', background: '#000' }}>
                                    <iframe 
                                        width="100%" 
                                        height="100%" 
                                        src={`https://www.youtube.com/embed/${activeVideo.videoId}`} 
                                        title={activeVideo.title}
                                        frameBorder="0" 
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                        allowFullScreen
                                        style={{ border: 'none' }}
                                    />
                                </div>
                            </div>
                        )}

                        {/* Tab Switchers */}
                        <div style={{ display: 'flex', gap: '0.75rem', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '0.75rem', marginBottom: '1.75rem', flexWrap: 'wrap' }}>
                            <button 
                                onClick={() => setSelectedTab('lessons')}
                                className={`btn btn-sm ${selectedTab === 'lessons' ? 'btn-primary' : 'btn-secondary'}`}
                            >
                                <Video size={16} /> {language === 'si' ? 'වීඩියෝ දේශන (Lectures)' : 'Video Lectures'}
                            </button>
                            <button 
                                onClick={() => setSelectedTab('materials')}
                                className={`btn btn-sm ${selectedTab === 'materials' ? 'btn-primary' : 'btn-secondary'}`}
                            >
                                <FileText size={16} /> {language === 'si' ? 'අධ්‍යයන නිබන්ධන (PDFs)' : 'Study Materials'}
                            </button>
                            <button 
                                onClick={() => setSelectedTab('ai')}
                                className={`btn btn-sm ${selectedTab === 'ai' ? 'btn-primary' : 'btn-secondary'}`}
                            >
                                <Brain size={16} /> mathsbook AI Solver
                            </button>
                        </div>

                        {/* TAB 1: VIDEO LESSONS */}
                        {selectedTab === 'lessons' && (
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
                                {filteredLessons.map(lesson => (
                                    <div key={lesson.id} style={{
                                        background: 'rgba(18, 26, 43, 0.75)',
                                        border: '1px solid rgba(255,255,255,0.05)',
                                        borderRadius: '20px',
                                        padding: '1.25rem',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        justifyContent: 'space-between',
                                        transition: 'all 0.2s ease'
                                    }}>
                                        <div>
                                            <div style={{ background: 'rgba(99, 102, 241, 0.15)', color: '#818cf8', display: 'inline-flex', padding: '0.2rem 0.6rem', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 700, marginBottom: '0.85rem' }}>
                                                Duration: {lesson.duration}
                                            </div>
                                            <h4 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '1rem', lineHeight: 1.4 }}>{lesson.title}</h4>
                                        </div>
                                        <button className="btn btn-secondary btn-sm" onClick={() => { setActiveVideo(lesson); window.scrollTo({ top: 120, behavior: 'smooth' }); }} style={{ width: '100%', justifyContent: 'center' }}>
                                            <Video size={16} /> දේශනය නැරඹීමට (Watch Class)
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* TAB 2: STUDY MATERIALS */}
                        {selectedTab === 'materials' && (
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
                                {filteredPDFs.map(pdf => (
                                    <div key={pdf.id} style={{
                                        background: 'rgba(18, 26, 43, 0.75)',
                                        border: '1px solid rgba(255,255,255,0.05)',
                                        borderRadius: '20px',
                                        padding: '1.25rem',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        justifyContent: 'space-between'
                                    }}>
                                        <div>
                                            <div style={{ background: 'rgba(6, 182, 212, 0.15)', color: '#22d3ee', display: 'inline-flex', padding: '0.2rem 0.6rem', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 700, marginBottom: '0.85rem' }}>
                                                PDF Document ({pdf.size})
                                            </div>
                                            <h4 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '1rem', lineHeight: 1.4 }}>{pdf.title}</h4>
                                        </div>
                                        <a href="#" onClick={(e) => { e.preventDefault(); alert('සටහන සාර්ථකව බාගත විය (PDF Downloaded)!'); }} className="btn btn-secondary btn-sm" style={{ width: '100%', justifyContent: 'center' }}>
                                            <FileText size={16} /> බාගත කරගන්න (Download Note)
                                        </a>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* TAB 3: QUICK AI SOLVER SHORTCUT */}
                        {selectedTab === 'ai' && (
                            <div style={{
                                background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(6, 182, 212, 0.05) 100%)',
                                border: '1px solid rgba(99, 102, 241, 0.35)',
                                borderRadius: '24px',
                                padding: '2rem 1.5rem',
                                textAlign: 'center'
                            }}>
                                <Brain size={44} style={{ color: '#06b6d4', marginBottom: '1rem' }} />
                                <h3 style={{ fontSize: '1.35rem', fontWeight: 700, marginBottom: '0.5rem' }}>mathsbook AI Solver එකට පිවිසෙන්න</h3>
                                <p style={{ color: '#94a3b8', fontSize: '0.9rem', maxWidth: '600px', margin: '0 auto 1.5rem auto', lineHeight: 1.6 }}>
                                    වෙබ් අඩවියේ ප්‍රධාන පිටුවට ගොස් ඕනෑම ගණිත ගැටලුවක ඡායාරූපයක් ඇතුළත් කර පියවරෙන් පියවර පැහැදිලි විසඳුම ලබාගන්න.
                                </p>
                                <a href="/#ai-solver" className="btn btn-primary">
                                    <Sparkles size={16} /> Open AI Solver Component
                                </a>
                            </div>
                        )}

                        {/* Homework upload simulation container */}
                        <div style={{
                            marginTop: '2.5rem',
                            background: 'rgba(18, 26, 43, 0.4)',
                            border: '1px solid rgba(255,255,255,0.05)',
                            borderRadius: '24px',
                            padding: '1.5rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            flexWrap: 'wrap',
                            gap: '1rem'
                        }}>
                            <div>
                                <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#c7d2fe' }}>නිවාස වැඩ සහ පන්ති වැඩ Upload කිරීම (Submit Homework)</h4>
                                <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginTop: '0.2rem' }}>සාදන ලද නිබන්ධන හෝ උත්තර පත්‍ර මෙතැනින් Upload කරන්න</p>
                            </div>
                            <button className="btn btn-secondary btn-sm" onClick={() => alert('PDF/Image ගොනුව සාර්ථකව උඩුගත කරන ලදී (Homework Submitted)!')}>
                                <UploadCloud size={16} /> Upload Answers
                            </button>
                        </div>
                    </div>
                )}

            </main>
            
            <Footer />
            <FloatingWhatsapp />
        </div>
    );
}

export default function LMSPage() {
    return (
        <LanguageProvider>
            <LMSContent />
        </LanguageProvider>
    );
}
