'use client';

import React, { useState, useEffect } from 'react';
import { MessageSquare, Menu, X, Globe } from 'lucide-react';
import { MATHSBOOK_CONFIG } from '../config/mathsbookConfig';
import { useLanguage } from '../context/LanguageContext';

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const { language, setLanguage, setShowModal, t } = useLanguage();

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 40) {
                setScrolled(true);
            } else {
                setScrolled(false);
            }
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const toggleMenu = () => {
        setMobileMenuOpen(!mobileMenuOpen);
    };

    const closeMenu = () => {
        setMobileMenuOpen(false);
    };

    const toggleLanguage = () => {
        const nextLang = language === 'si' ? 'en' : 'si';
        setLanguage(nextLang);
        if (typeof window !== 'undefined') {
            localStorage.setItem('mathsbook_lang', nextLang);
        }
    };

    return (
        <nav className={`navbar ${scrolled ? 'scrolled' : ''}`} style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            zIndex: 1000,
            background: scrolled ? 'rgba(9, 13, 22, 0.96)' : 'rgba(15, 23, 42, 0.85)',
            backdropFilter: 'blur(16px)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            boxShadow: scrolled ? '0 10px 30px rgba(0,0,0,0.5)' : 'none',
            transition: 'all 0.35s ease'
        }}>
            <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '75px' }}>
                {/* Brand Logo */}
                <a href="#home" onClick={closeMenu} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', textDecoration: 'none', color: 'inherit' }}>
                    <div style={{
                        width: '40px',
                        height: '40px',
                        background: 'linear-gradient(135deg, #6366f1 0%, #06b6d4 100%)',
                        borderRadius: '14px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 900,
                        fontSize: '1.35rem',
                        color: '#fff',
                        boxShadow: '0 0 15px rgba(99, 102, 241, 0.5)'
                    }}>M</div>
                    <div>
                        <div className="gradient-text" style={{ fontSize: '1.45rem', fontWeight: 800, fontFamily: 'Outfit, sans-serif', lineHeight: 1.1 }}>mathsbook</div>
                        <span style={{
                            background: 'rgba(99, 102, 241, 0.15)',
                            color: '#818cf8',
                            border: '1px solid rgba(99, 102, 241, 0.3)',
                            fontSize: '0.7rem',
                            padding: '1px 6px',
                            borderRadius: '999px',
                            fontWeight: 600,
                            display: 'inline-block'
                        }}>{language === 'si' ? 'සිංහල මාධ්‍යය' : 'English Medium'}</span>
                    </div>
                </a>

                {/* Desktop Nav Links */}
                <ul className="nav-links desktop-only" style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1.5rem',
                    listStyle: 'none'
                }}>
                    <li><a href="/#home" style={{ color: '#f8fafc', textDecoration: 'none', fontWeight: 500 }}>{t('navHome')}</a></li>
                    <li><a href="/#about" style={{ color: '#94a3b8', textDecoration: 'none', fontWeight: 500 }}>{t('navAbout')}</a></li>
                    <li><a href="/#courses" style={{ color: '#94a3b8', textDecoration: 'none', fontWeight: 500 }}>{t('navCourses')}</a></li>
                    <li><a href="/#ai-solver" style={{ color: '#06b6d4', textDecoration: 'none', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>{t('navAiSolver')}</a></li>
                    <li><a href="/#enroll" style={{ color: '#94a3b8', textDecoration: 'none', fontWeight: 500 }}>{t('navEnroll')}</a></li>
                    <li><a href="/papers" style={{ color: '#34d399', textDecoration: 'none', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>📑 Free Papers</a></li>
                    <li><a href="/exam" style={{ color: '#f59e0b', textDecoration: 'none', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>📝 Online Exams</a></li>
                    <li><a href="/lms" style={{ color: '#fbbf24', textDecoration: 'none', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>🎓 LMS</a></li>
                </ul>

                {/* Desktop Actions & Hamburger Button */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                    {/* Language Switcher Toggle Button */}
                    <button
                        onClick={toggleLanguage}
                        style={{
                            background: 'rgba(99, 102, 241, 0.15)',
                            border: '1px solid rgba(99, 102, 241, 0.35)',
                            color: '#c7d2fe',
                            borderRadius: '12px',
                            padding: '0.45rem 0.75rem',
                            fontSize: '0.8rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.4rem',
                            transition: 'all 0.2s ease'
                        }}
                        title="Change Language / මාධ්‍යය වෙනස් කරන්න"
                    >
                        <Globe size={15} style={{ color: '#06b6d4' }} />
                        {language === 'si' ? '🇱🇰 SI' : '🇬🇧 EN'}
                    </button>

                    <a 
                        href={`https://wa.me/${MATHSBOOK_CONFIG.tutor.whatsapp}`} 
                        target="_blank" 
                        rel="noreferrer" 
                        className="btn btn-whatsapp btn-sm navbar-wa-btn"
                        style={{ padding: '0.45rem 0.85rem', fontSize: '0.85rem' }}
                    >
                        <MessageSquare size={16} /> <span className="wa-btn-text">WhatsApp</span>
                    </a>

                    {/* Hamburger Toggle Button for Mobile */}
                    <button 
                        onClick={toggleMenu}
                        aria-label="Toggle Navigation Menu"
                        className="mobile-hamburger-btn"
                        style={{
                            background: 'rgba(255, 255, 255, 0.08)',
                            border: '1px solid rgba(255, 255, 255, 0.15)',
                            color: '#fff',
                            borderRadius: '12px',
                            padding: '0.5rem',
                            cursor: 'pointer',
                            display: 'none',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'all 0.2s ease'
                        }}
                    >
                        {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile Drawer Overlay */}
            {mobileMenuOpen && (
                <div className="mobile-drawer" style={{
                    background: 'rgba(9, 13, 22, 0.98)',
                    backdropFilter: 'blur(20px)',
                    borderBottom: '1px solid rgba(99, 102, 241, 0.3)',
                    padding: '1.5rem 1.5rem 2rem 1.5rem',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.8)'
                }}>
                    <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                        <li>
                            <a href="/#home" onClick={closeMenu} style={{ color: '#f8fafc', textDecoration: 'none', fontWeight: 600, fontSize: '1.1rem', display: 'block' }}>
                                මුල් පිටුව (Home)
                            </a>
                        </li>
                        <li>
                            <a href="/#about" onClick={closeMenu} style={{ color: '#94a3b8', textDecoration: 'none', fontWeight: 500, fontSize: '1.05rem', display: 'block' }}>
                                දැක්ම සහ මෙහෙවර (Vision & Mission)
                            </a>
                        </li>
                        <li>
                            <a href="/#courses" onClick={closeMenu} style={{ color: '#94a3b8', textDecoration: 'none', fontWeight: 500, fontSize: '1.05rem', display: 'block' }}>
                                පන්ති වැඩසටහන් (Classes)
                            </a>
                        </li>
                        <li>
                            <a href="/#ai-solver" onClick={closeMenu} style={{ color: '#06b6d4', textDecoration: 'none', fontWeight: 700, fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                ✨ mathsbook AI Solver
                            </a>
                        </li>
                        <li>
                            <a href="/#enroll" onClick={closeMenu} style={{ color: '#818cf8', textDecoration: 'none', fontWeight: 600, fontSize: '1.05rem', display: 'block' }}>
                                ලියාපදිංචි වන්න (Enrollment)
                            </a>
                        </li>
                        <li>
                            <a href="/#contact" onClick={closeMenu} style={{ color: '#94a3b8', textDecoration: 'none', fontWeight: 500, fontSize: '1.05rem', display: 'block' }}>
                                සම්බන්ධ කරගැනීමට (Contact)
                            </a>
                        </li>
                        <li>
                            <a href="/papers" onClick={closeMenu} style={{ color: '#34d399', textDecoration: 'none', fontWeight: 700, fontSize: '1.1rem', display: 'block' }}>
                                📑 නොමිලේ ප්‍රශ්න පත්‍ර (Free Papers)
                            </a>
                        </li>
                        <li>
                            <a href="/exam" onClick={closeMenu} style={{ color: '#f59e0b', textDecoration: 'none', fontWeight: 700, fontSize: '1.1rem', display: 'block' }}>
                                📝 Online Exams (MCQ පරීක්ෂණ)
                            </a>
                        </li>
                        <li>
                            <a href="/lms" onClick={closeMenu} style={{ color: '#fbbf24', textDecoration: 'none', fontWeight: 700, fontSize: '1.1rem', display: 'block' }}>
                                🎓 LMS ශිෂ්‍ය ද්වාරය (LMS Portal)
                            </a>
                        </li>
                    </ul>

                    <div style={{ marginTop: '1.5rem', paddingTop: '1.25rem', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                        <a 
                            href={`https://wa.me/${MATHSBOOK_CONFIG.tutor.whatsapp}`} 
                            target="_blank" 
                            rel="noreferrer" 
                            className="btn btn-whatsapp"
                            style={{ width: '100%', justifyContent: 'center', padding: '0.85rem' }}
                        >
                            <MessageSquare size={18} /> WhatsApp අමතන්න (077 978 0053)
                        </a>
                    </div>
                </div>
            )}
        </nav>
    );
}
