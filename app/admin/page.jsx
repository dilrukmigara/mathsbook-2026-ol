'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '../../src/components/Navbar';
import Footer from '../../src/components/Footer';
import FloatingWhatsapp from '../../src/components/FloatingWhatsapp';
import { LanguageProvider } from '../../src/context/LanguageContext';
import { ShieldCheck, Search, Users, CheckSquare, Save, Lock, AlertCircle, RefreshCw } from 'lucide-react';

function AdminContent() {
    // Auth gate
    const [passwordInput, setPasswordInput] = useState('');
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [authError, setAuthError] = useState('');
    
    // Students listing data
    const [students, setStudents] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const [actionLoading, setActionLoading] = useState(null); // stores studentId currently saving
    const [message, setMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const availableCourses = [
        { key: 'grade_10', label: 'Grade 10' },
        { key: 'grade_11', label: 'Grade 11' },
        { key: 'speed_revision', label: 'Speed Revision' },
        { key: 'paper_theory', label: 'Paper Theory' },
        { key: 'free_paper', label: 'Free Paper (Free for all)', locked: true }
    ];

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const isAuth = sessionStorage.getItem('mathsbook_admin_authenticated');
            if (isAuth === 'true') {
                setIsAuthenticated(true);
                fetchStudents();
            }
        }
    }, []);

    const handleAuthSubmit = (e) => {
        e.preventDefault();
        if (passwordInput === 'supermigara') {
            setIsAuthenticated(true);
            setAuthError('');
            if (typeof window !== 'undefined') {
                sessionStorage.setItem('mathsbook_admin_authenticated', 'true');
            }
            fetchStudents();
        } else {
            setAuthError('මුරපදය වැරදියි! කරුණාකර නැවත උත්සාහ කරන්න. (Incorrect Password)');
        }
    };

    const fetchStudents = async () => {
        setLoading(true);
        setErrorMessage('');
        try {
            const res = await fetch('/api/admin/users');
            const data = await res.json();
            if (res.ok && data.success) {
                setStudents(data.users);
            } else {
                setErrorMessage(data.error || 'දත්ත ලබා ගැනීමට අපොහොසත් විය.');
            }
        } catch (err) {
            setErrorMessage('සම්බන්ධතා දෝෂයක්: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleCourseToggle = (studentId, courseKey) => {
        setStudents(prev => prev.map(student => {
            if (student.id !== studentId) return student;
            
            let updatedCourses = [...student.enrolledCourses];
            if (updatedCourses.includes(courseKey)) {
                // Remove if not locked
                if (courseKey !== 'free_paper') {
                    updatedCourses = updatedCourses.filter(c => c !== courseKey);
                }
            } else {
                updatedCourses.push(courseKey);
            }
            return { ...student, enrolledCourses: updatedCourses };
        }));
    };

    const handleSaveCourses = async (studentId, enrolledCourses) => {
        setActionLoading(studentId);
        setMessage('');
        setErrorMessage('');

        try {
            const res = await fetch('/api/admin/users', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: studentId, enrolledCourses })
            });
            const data = await res.json();

            if (res.ok && data.success) {
                setMessage(`ශිෂ්‍යයාගේ පාඨමාලා සාර්ථකව යාවත්කාලීන කරන ලදී!`);
                setTimeout(() => setMessage(''), 3000);
            } else {
                setErrorMessage(data.error || 'යාවත්කාලීන කිරීමට නොහැකි විය.');
            }
        } catch (err) {
            setErrorMessage('දෝෂයක් සිදුවිය: ' + err.message);
        } finally {
            setActionLoading(null);
        }
    };

    const filteredStudents = students.filter(s => 
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.phone.includes(searchQuery) ||
        s.id.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Navbar />

            <main style={{ flex: 1, paddingTop: '110px', paddingBottom: '70px', position: 'relative', zIndex: 1 }} className="container">
                
                {/* Background radial glow */}
                <div style={{
                    position: 'absolute', top: '10%', left: '50%', transform: 'translate(-50%, -50%)',
                    width: '700px', height: '700px',
                    background: 'radial-gradient(circle, rgba(99, 102, 241, 0.08) 0%, transparent 70%)',
                    filter: 'blur(60px)', zIndex: -1
                }} />

                {!isAuthenticated ? (
                    // ADMIN AUTH PASS GATE
                    <div style={{ maxWidth: '440px', margin: '60px auto 0 auto' }}>
                        <div style={{
                            background: 'linear-gradient(145deg, rgba(26, 31, 56, 0.95) 0%, rgba(15, 23, 42, 0.98) 100%)',
                            border: '1px solid rgba(99, 102, 241, 0.35)',
                            borderRadius: '24px',
                            padding: '2.5rem 2rem',
                            boxShadow: '0 0 50px rgba(99, 102, 241, 0.25)',
                            textAlign: 'center'
                        }}>
                            <div style={{
                                width: '56px', height: '56px', margin: '0 auto 1.25rem auto',
                                background: 'rgba(99, 102, 241, 0.15)', borderRadius: '16px',
                                display: 'flex', alignItems: 'center', justifyContext: 'center', justifyContent: 'center',
                                border: '1px solid rgba(99, 102, 241, 0.3)'
                            }}>
                                <Lock size={28} style={{ color: '#818cf8' }} />
                            </div>

                            <h3 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#f8fafc', marginBottom: '0.4rem' }}>
                                Admin Panel Verification
                            </h3>
                            <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: '1.75rem' }}>
                                පරිපාලක පිටුවට පිවිසීමට මුරපදය ඇතුළත් කරන්න (Enter Admin Password)
                            </p>

                            {authError && (
                                <div style={{
                                    marginBottom: '1rem', background: 'rgba(239, 68, 68, 0.1)',
                                    border: '1px solid rgba(239, 68, 68, 0.3)', padding: '0.75rem 1rem',
                                    borderRadius: '12px', color: '#fca5a5', fontSize: '0.8rem',
                                    display: 'flex', gap: '0.5rem', alignItems: 'center'
                                }}>
                                    <AlertCircle size={16} color="#ef4444" />
                                    <span>{authError}</span>
                                </div>
                            )}

                            <form onSubmit={handleAuthSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <input 
                                    type="password"
                                    required
                                    placeholder="Enter Admin Password"
                                    value={passwordInput}
                                    onChange={(e) => setPasswordInput(e.target.value)}
                                    style={{
                                        width: '100%', padding: '0.85rem 1rem', background: '#090d16',
                                        border: '1px solid rgba(99, 102, 241, 0.4)', borderRadius: '12px',
                                        color: '#fff', outline: 'none', fontSize: '0.95rem', textAlign: 'center'
                                    }}
                                />
                                <button className="btn btn-primary" type="submit" style={{ width: '100%', justifyContent: 'center' }}>
                                    Verify Password
                                </button>
                            </form>
                        </div>
                    </div>
                ) : (
                    // ADMIN PANEL STUDENT LIST
                    <div>
                        {/* Heading & stats */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.25rem', marginBottom: '2rem' }}>
                            <div>
                                <h2 style={{ fontSize: '1.8rem', fontWeight: 800 }}>LMS Admin Control Panel</h2>
                                <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginTop: '0.2rem' }}>
                                    ශිෂ්‍ය ගිණුම් කළමනාකරණය සහ පාඨමාලා පැවරීම (Assign student courses)
                                </p>
                            </div>
                            <button className="btn btn-secondary btn-sm" onClick={fetchStudents} disabled={loading} style={{ gap: '0.5rem' }}>
                                <RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> Refresh List
                            </button>
                        </div>

                        {/* Notifications */}
                        {message && (
                            <div style={{
                                marginBottom: '1.5rem', background: 'rgba(16, 185, 129, 0.1)',
                                border: '1px solid rgba(16, 185, 129, 0.3)', padding: '0.85rem 1.25rem',
                                borderRadius: '16px', color: '#6ee7b7', fontSize: '0.9rem'
                            }}>
                                {message}
                            </div>
                        )}

                        {errorMessage && (
                            <div style={{
                                marginBottom: '1.5rem', background: 'rgba(239, 68, 68, 0.1)',
                                border: '1px solid rgba(239, 68, 68, 0.3)', padding: '0.85rem 1.25rem',
                                borderRadius: '16px', color: '#fca5a5', fontSize: '0.9rem'
                            }}>
                                {errorMessage}
                            </div>
                        )}

                        {/* Search Toolbar */}
                        <div style={{
                            background: 'rgba(26, 31, 56, 0.6)',
                            border: '1px solid rgba(255, 255, 255, 0.05)',
                            borderRadius: '20px',
                            padding: '1rem 1.5rem',
                            marginBottom: '1.5rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '1rem'
                        }}>
                            <Search size={20} style={{ color: '#64748b' }} />
                            <input 
                                type="text"
                                placeholder="ශිෂ්‍යයාගේ නම, දුරකථන අංකය හෝ ID එකෙන් සොයන්න (Search name, phone, ID)..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                style={{
                                    flex: 1, background: 'none', border: 'none', color: '#fff',
                                    outline: 'none', fontSize: '0.95rem'
                                }}
                            />
                            <div style={{ fontSize: '0.85rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                <Users size={16} /> Total: {students.length}
                            </div>
                        </div>

                        {/* Students list */}
                        {loading ? (
                            <div style={{ textAlign: 'center', padding: '3rem' }}>
                                <RefreshCw size={36} className="animate-spin" style={{ color: '#6366f1', margin: '0 auto 1rem auto' }} />
                                <p style={{ color: '#94a3b8' }}>ශිෂ්‍ය ලැයිස්තුව පූරණය වෙමින් පවතී...</p>
                            </div>
                        ) : filteredStudents.length === 0 ? (
                            <div style={{
                                background: 'rgba(18, 26, 43, 0.75)', border: '1px solid rgba(255,255,255,0.05)',
                                borderRadius: '24px', padding: '4rem 2rem', textAlign: 'center'
                            }}>
                                <Users size={48} style={{ color: '#64748b', marginBottom: '1rem', opacity: 0.5 }} />
                                <p style={{ color: '#94a3b8' }}>සිසුන් කිසිවෙකු හමු නොවීය (No students registered yet).</p>
                            </div>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                                {filteredStudents.map(student => (
                                    <div key={student.id} style={{
                                        background: 'linear-gradient(135deg, rgba(18, 26, 43, 0.8) 0%, rgba(15, 23, 42, 0.95) 100%)',
                                        border: '1px solid rgba(99, 102, 241, 0.25)',
                                        borderRadius: '24px',
                                        padding: '1.5rem',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: '1.25rem',
                                        boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
                                        transition: 'all 0.25s ease'
                                    }}>
                                        {/* Student Meta Row */}
                                        <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '0.85rem' }}>
                                            <div>
                                                <h4 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#f8fafc' }}>
                                                    {student.name}
                                                </h4>
                                                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '0.2rem', fontSize: '0.8rem', color: '#94a3b8' }}>
                                                    <span>Student ID: <strong style={{ color: '#06b6d4' }}>{student.id}</strong></span>
                                                    <span>Phone: <strong>{student.phone}</strong></span>
                                                    <span>Password: <strong style={{ color: '#c7d2fe' }}>{student.password}</strong></span>
                                                </div>
                                            </div>
                                            <button 
                                                className="btn btn-primary btn-sm"
                                                disabled={actionLoading === student.id}
                                                onClick={() => handleSaveCourses(student.id, student.enrolledCourses)}
                                                style={{ gap: '0.4rem', height: 'fit-content' }}
                                            >
                                                {actionLoading === student.id ? (
                                                    <RefreshCw size={14} className="animate-spin" />
                                                ) : (
                                                    <Save size={14} />
                                                )}
                                                {actionLoading === student.id ? 'Saving...' : 'Save Courses'}
                                            </button>
                                        </div>

                                        {/* Courses Selection Grid */}
                                        <div>
                                            <span style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', color: '#64748b', display: 'block', marginBottom: '0.75rem' }}>
                                                පවරන ලද පන්ති සහ පාඨමාලා (Assigned Courses):
                                            </span>
                                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
                                                {availableCourses.map(course => {
                                                    const isChecked = student.enrolledCourses.includes(course.key);
                                                    return (
                                                        <label 
                                                            key={course.key}
                                                            style={{
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                gap: '0.65rem',
                                                                padding: '0.75rem 1rem',
                                                                borderRadius: '12px',
                                                                background: isChecked ? 'rgba(99, 102, 241, 0.15)' : 'rgba(255,255,255,0.02)',
                                                                border: isChecked ? '1px solid rgba(99, 102, 241, 0.4)' : '1px solid rgba(255,255,255,0.05)',
                                                                cursor: course.locked ? 'not-allowed' : 'pointer',
                                                                transition: 'all 0.2s ease',
                                                                userSelect: 'none'
                                                            }}
                                                        >
                                                            <input 
                                                                type="checkbox"
                                                                checked={isChecked}
                                                                disabled={course.locked}
                                                                onChange={() => handleCourseToggle(student.id, course.key)}
                                                                style={{
                                                                    accentColor: '#6366f1',
                                                                    width: '16px',
                                                                    height: '16px',
                                                                    cursor: course.locked ? 'not-allowed' : 'pointer'
                                                                }}
                                                            />
                                                            <span style={{ fontSize: '0.85rem', color: isChecked ? '#fff' : '#94a3b8', fontWeight: isChecked ? 600 : 500 }}>
                                                                {course.label}
                                                            </span>
                                                        </label>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

            </main>

            <Footer />
            <FloatingWhatsapp />
        </div>
    );
}

export default function AdminPage() {
    return (
        <LanguageProvider>
            <AdminContent />
        </LanguageProvider>
    );
}
