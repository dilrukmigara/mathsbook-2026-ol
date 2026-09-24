'use client';

import React, { useState, useEffect } from 'react';
import { MessageSquare, Menu, X, Globe, Sparkles, FileText, CheckCircle2, ChevronRight } from 'lucide-react';
import { MATHSBOOK_CONFIG } from '../config/mathsbookConfig';
import { useLanguage } from '../context/LanguageContext';

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const { language, setLanguage, t } = useLanguage();

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 30) {
                setScrolled(true);
            } else {
                setScrolled(false);
            }
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Prevent background scrolling when mobile menu is open
    useEffect(() => {
        if (mobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [mobileMenuOpen]);

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

    // Smooth scroll handler for anchor links with exact fixed navbar offset
    const handleNavClick = (e, targetId) => {
        if (typeof window !== 'undefined') {
            const isHomePage = window.location.pathname === '/' || window.location.pathname === '';
            if (isHomePage) {
                e.preventDefault();
                closeMenu();
                if (targetId === 'home') {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                    window.history.pushState(null, '', '/#home');
                    return;
                }
                const el = document.getElementById(targetId);
                if (el) {
                    const nav = document.querySelector('nav');
                    const navHeight = nav ? nav.offsetHeight : 66;
                    const elTop = el.getBoundingClientRect().top + window.pageYOffset;
                    // Precise offset: navbar height + 24px breathing space ensures the section title fits cleanly
                    window.scrollTo({
                        top: elTop - navHeight - 24,
                        behavior: 'smooth'
                    });
                    window.history.pushState(null, '', `#${targetId}`);
                }
            } else {
                closeMenu();
            }
        }
    };

    // Ensure initial page load with hash lands with exact offset
    useEffect(() => {
        if (typeof window !== 'undefined' && window.location.hash) {
            const hash = window.location.hash.replace('#', '');
            if (hash === 'home') {
                window.scrollTo({ top: 0, behavior: 'smooth' });
                return;
            }
            setTimeout(() => {
                const el = document.getElementById(hash);
                if (el) {
                    const nav = document.querySelector('nav');
                    const navHeight = nav ? nav.offsetHeight : 66;
                    const elTop = el.getBoundingClientRect().top + window.pageYOffset;
                    window.scrollTo({
                        top: elTop - navHeight - 24,
                        behavior: 'smooth'
                    });
                }
            }, 120);
        }
    }, []);

    return (
        <nav style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            zIndex: 1000,
            background: scrolled ? 'rgba(8, 12, 20, 0.94)' : 'rgba(11, 17, 32, 0.82)',
            backdropFilter: 'blur(20px) saturate(180%)',
            WebkitBackdropFilter: 'blur(20px) saturate(180%)',
            borderBottom: scrolled ? '1px solid rgba(99, 102, 241, 0.25)' : '1px solid rgba(255, 255, 255, 0.08)',
            boxShadow: scrolled ? '0 12px 35px rgba(0, 0, 0, 0.65)' : '0 4px 20px rgba(0, 0, 0, 0.25)',
            transition: 'all 0.35s cubic-bezier(0.16, 1, 0.3, 1)'
        }}>
            <style dangerouslySetInnerHTML={{ __html: `
                .nav-item-link {
                    color: #94a3b8;
                    text-decoration: none;
                    font-weight: 600;
                    font-size: 0.88rem;
                    padding: 0.42rem 0.72rem;
                    border-radius: 9px;
                    transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
                    display: inline-flex;
                    align-items: center;
                    gap: 0.3rem;
                    white-space: nowrap !important;
                }
                .nav-item-link:hover {
                    color: #ffffff;
                    background: rgba(255, 255, 255, 0.08);
                    transform: translateY(-1px);
                }
                .nav-portal-badge {
                    padding: 0.32rem 0.75rem;
                    border-radius: 999px;
                    font-size: 0.78rem;
                    font-weight: 700;
                    text-decoration: none;
                    display: inline-flex;
                    align-items: center;
                    gap: 0.35rem;
                    transition: all 0.25s ease;
                    white-space: nowrap !important;
                }
                .nav-portal-papers {
                    background: rgba(16, 185, 129, 0.12);
                    color: #34d399;
                    border: 1px solid rgba(16, 185, 129, 0.35);
                }
                .nav-portal-papers:hover {
                    background: rgba(16, 185, 129, 0.22);
                    border-color: #34d399;
                    transform: translateY(-2px);
                    box-shadow: 0 4px 15px rgba(16, 185, 129, 0.3);
                }
                .nav-portal-exams {
                    background: rgba(99, 102, 241, 0.15);
                    color: #a5b4fc;
                    border: 1px solid rgba(99, 102, 241, 0.35);
                }
                .nav-portal-exams:hover {
                    background: rgba(99, 102, 241, 0.25);
                    border-color: #818cf8;
                    transform: translateY(-2px);
                    box-shadow: 0 4px 15px rgba(99, 102, 241, 0.35);
                }
                .nav-portal-lms {
                    background: rgba(245, 158, 11, 0.12);
                    color: #fbbf24;
                    border: 1px solid rgba(245, 158, 11, 0.35);
                }
                .nav-portal-lms:hover {
                    background: rgba(245, 158, 11, 0.22);
                    border-color: #fbbf24;
                    transform: translateY(-2px);
                    box-shadow: 0 4px 15px rgba(245, 158, 11, 0.3);
                }
                .radar-pulse-dot {
                    width: 7px;
                    height: 7px;
                    border-radius: 50%;
                    background: #10b981;
                    box-shadow: 0 0 8px #10b981;
                    animation: pulseRadar 2s infinite;
                }
                @keyframes drawerSlideDown {
                    from {
                        opacity: 0;
                        transform: translateY(-12px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                /* Hide secondary portals on medium-width screens to guarantee zero wrapping */
                @media (max-width: 1260px) {
                    .nav-portal-extra {
                        display: none !important;
                    }
                }
                @media (max-width: 1060px) {
                    .desktop-only {
                        display: none !important;
                    }
                    .mobile-hamburger-btn {
                        display: flex !important;
                    }
                }
            `}} />

            <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '66px', position: 'relative' }}>
                {/* Brand Logo */}
                <a href="/#home" onClick={(e) => handleNavClick(e, 'home')} style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', textDecoration: 'none', color: 'inherit', flexShrink: 0 }}>
                    <div style={{
                        width: '38px',
                        height: '38px',
                        background: 'linear-gradient(135deg, #6366f1 0%, #0ea5e9 100%)',
                        borderRadius: '11px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 900,
                        fontSize: '1.25rem',
                        color: '#ffffff',
                        boxShadow: '0 0 16px rgba(99, 102, 241, 0.4)',
                        border: '1px solid rgba(255, 255, 255, 0.2)'
                    }}>
                        M
                    </div>
                    <div>
                        <div style={{
                            fontSize: '1.35rem',
                            fontWeight: 800,
                            fontFamily: 'Outfit, sans-serif',
                            lineHeight: 1.1,
                            letterSpacing: '-0.02em',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '2px'
                        }}>
                            <span style={{ color: '#f8fafc' }}>maths</span>
                            <span style={{ color: '#38bdf8' }}>book</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginTop: '1px' }}>
                            <span style={{
                                background: 'rgba(99, 102, 241, 0.15)',
                                color: '#a5b4fc',
                                border: '1px solid rgba(99, 102, 241, 0.3)',
                                fontSize: '0.65rem',
                                padding: '1px 6px',
                                borderRadius: '999px',
                                fontWeight: 700,
                                letterSpacing: '0.2px'
                            }}>
                                {language === 'si' ? 'සිංහල මාධ්‍යය' : 'O/L Mathematics'}
                            </span>
                        </div>
                    </div>
                </a>

                {/* Desktop Nav Links - Always fit and never wrap */}
                <ul className="nav-links desktop-only" style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    listStyle: 'none',
                    margin: 0,
                    padding: 0
                }}>
                    <li><a href="/#home" onClick={(e) => handleNavClick(e, 'home')} className="nav-item-link">{t('navHome')}</a></li>
                    <li><a href="/#about" onClick={(e) => handleNavClick(e, 'about')} className="nav-item-link">{t('navAbout')}</a></li>
                    <li><a href="/#courses" onClick={(e) => handleNavClick(e, 'courses')} className="nav-item-link">{t('navCourses')}</a></li>
                    <li><a href="/#enroll" onClick={(e) => handleNavClick(e, 'enroll')} className="nav-item-link">{t('navEnroll')}</a></li>
                    
                    {/* Visual Divider */}
                    <div style={{ width: '1px', height: '18px', background: 'rgba(255, 255, 255, 0.12)', margin: '0 0.4rem' }} />

                    {/* Portals - gracefully adaptive */}
                    <li className="nav-portal-extra">
                        <a href="/papers" className="nav-portal-badge nav-portal-papers">
                            <span className="radar-pulse-dot" />
                            <span>Free Papers</span>
                        </a>
                    </li>
                    <li className="nav-portal-extra">
                        <a href="/exam" className="nav-portal-badge nav-portal-exams">
                            <Sparkles size={12} color="#38bdf8" />
                            <span>Online Exams</span>
                        </a>
                    </li>
                    <li>
                        <a href="/lms" className="nav-portal-badge nav-portal-lms">
                            <span>🎓 LMS</span>
                        </a>
                    </li>
                </ul>

                {/* Desktop Actions & Mobile Menu Toggle */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexShrink: 0 }}>
                    {/* Language Switcher Capsule */}
                    <button
                        onClick={toggleLanguage}
                        style={{
                            background: 'rgba(255, 255, 255, 0.06)',
                            border: '1px solid rgba(255, 255, 255, 0.14)',
                            color: '#e2e8f0',
                            borderRadius: '999px',
                            padding: '0.45rem 0.85rem',
                            fontSize: '0.8rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.45rem',
                            transition: 'all 0.2s ease',
                            backdropFilter: 'blur(10px)'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.12)';
                            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.25)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)';
                            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.14)';
                        }}
                        title="Change Language / මාධ්‍යය වෙනස් කරන්න"
                    >
                        <Globe size={14} style={{ color: '#38bdf8' }} />
                        <span>{language === 'si' ? '🇱🇰 SI' : '🇬🇧 EN'}</span>
                    </button>

                    {/* WhatsApp Direct Action Button */}
                    <a 
                        href={`https://wa.me/${MATHSBOOK_CONFIG.tutor.whatsapp}`} 
                        target="_blank" 
                        rel="noreferrer" 
                        className="btn btn-whatsapp btn-sm navbar-wa-btn"
                        style={{
                            padding: '0.5rem 1.05rem',
                            fontSize: '0.85rem',
                            borderRadius: '999px',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.45rem'
                        }}
                    >
                        <MessageSquare size={16} /> 
                        <span className="wa-btn-text">WhatsApp</span>
                    </a>

                    {/* Hamburger Toggle Button for Mobile/Tablet */}
                    <button 
                        onClick={toggleMenu}
                        aria-label="Toggle Navigation Menu"
                        className="mobile-hamburger-btn"
                        style={{
                            background: 'rgba(255, 255, 255, 0.08)',
                            border: '1px solid rgba(255, 255, 255, 0.15)',
                            color: '#ffffff',
                            borderRadius: '12px',
                            padding: '0.55rem',
                            cursor: 'pointer',
                            display: 'none',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'all 0.2s ease'
                        }}
                    >
                        {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
                    </button>
                </div>
            </div>

            {/* Mobile Drawer Overlay */}
            {mobileMenuOpen && (
                <>
                    {/* Dark Backdrop */}
                    <div 
                        onClick={closeMenu}
                        style={{
                            position: 'fixed',
                            top: '66px',
                            left: 0,
                            right: 0,
                            bottom: 0,
                            height: 'calc(100vh - 66px)',
                            background: 'rgba(4, 8, 16, 0.75)',
                            backdropFilter: 'blur(8px)',
                            zIndex: 998
                        }}
                    />

                    {/* Drawer Content */}
                    <div className="mobile-drawer" style={{
                        position: 'fixed',
                        top: '66px',
                        left: 0,
                        right: 0,
                        maxHeight: 'calc(100vh - 66px)',
                        overflowY: 'auto',
                        WebkitOverflowScrolling: 'touch',
                        background: 'linear-gradient(180deg, rgba(8, 12, 20, 0.98) 0%, rgba(11, 17, 32, 0.98) 100%)',
                        backdropFilter: 'blur(25px)',
                        WebkitBackdropFilter: 'blur(25px)',
                        borderBottom: '1px solid rgba(99, 102, 241, 0.35)',
                        padding: '1.5rem 1.25rem 2.5rem 1.25rem',
                        boxShadow: '0 25px 60px rgba(0, 0, 0, 0.95)',
                        zIndex: 999
                    }}>
                        {/* Section Links */}
                        <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.75rem' }}>
                            {language === 'si' ? 'ප්‍රධාන පිටු (Navigation)' : 'Navigation'}
                        </div>
                        <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.65rem', margin: 0, padding: 0 }}>
                            <li>
                                <a href="/#home" onClick={(e) => handleNavClick(e, 'home')} style={{ color: '#f8fafc', textDecoration: 'none', fontWeight: 700, fontSize: '1.05rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.65rem 0.85rem', borderRadius: '12px', background: 'rgba(255, 255, 255, 0.04)' }}>
                                    <span>{t('navHome')}</span>
                                    <ChevronRight size={16} color="#64748b" />
                                </a>
                            </li>
                            <li>
                                <a href="/#about" onClick={(e) => handleNavClick(e, 'about')} style={{ color: '#cbd5e1', textDecoration: 'none', fontWeight: 600, fontSize: '1.05rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.65rem 0.85rem', borderRadius: '12px', background: 'rgba(255, 255, 255, 0.04)' }}>
                                    <span>{t('navAbout')}</span>
                                    <ChevronRight size={16} color="#64748b" />
                                </a>
                            </li>
                            <li>
                                <a href="/#courses" onClick={(e) => handleNavClick(e, 'courses')} style={{ color: '#cbd5e1', textDecoration: 'none', fontWeight: 600, fontSize: '1.05rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.65rem 0.85rem', borderRadius: '12px', background: 'rgba(255, 255, 255, 0.04)' }}>
                                    <span>{t('navCourses')}</span>
                                    <ChevronRight size={16} color="#64748b" />
                                </a>
                            </li>
                            <li>
                                <a href="/#enroll" onClick={(e) => handleNavClick(e, 'enroll')} style={{ color: '#818cf8', textDecoration: 'none', fontWeight: 700, fontSize: '1.05rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.65rem 0.85rem', borderRadius: '12px', background: 'rgba(99, 102, 241, 0.12)', border: '1px solid rgba(99, 102, 241, 0.3)' }}>
                                    <span>{t('navEnroll')}</span>
                                    <ChevronRight size={16} color="#818cf8" />
                                </a>
                            </li>
                        </ul>

                        {/* Portals Section */}
                        <div style={{ marginTop: '1.25rem', paddingTop: '1.25rem', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
                            <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.75rem' }}>
                                Online Portals & Learning
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                                <a href="/papers" onClick={closeMenu} style={{
                                    padding: '0.85rem 1rem',
                                    borderRadius: '14px',
                                    background: 'rgba(16, 185, 129, 0.12)',
                                    border: '1px solid rgba(16, 185, 129, 0.35)',
                                    color: '#34d399',
                                    textDecoration: 'none',
                                    fontWeight: 700,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between'
                                }}>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <FileText size={16} />
                                        <span>Free Papers (ප්‍රශ්න පත්‍ර)</span>
                                    </span>
                                    <span style={{ fontSize: '0.72rem', background: '#10b981', color: '#fff', padding: '2px 8px', borderRadius: '999px' }}>FREE</span>
                                </a>
                                <a href="/exam" onClick={closeMenu} style={{
                                    padding: '0.85rem 1rem',
                                    borderRadius: '14px',
                                    background: 'rgba(99, 102, 241, 0.15)',
                                    border: '1px solid rgba(99, 102, 241, 0.35)',
                                    color: '#a5b4fc',
                                    textDecoration: 'none',
                                    fontWeight: 700,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between'
                                }}>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <Sparkles size={16} color="#38bdf8" />
                                        <span>Online Exams (MCQ විභාග)</span>
                                    </span>
                                    <span style={{ fontSize: '0.72rem', background: '#6366f1', color: '#fff', padding: '2px 8px', borderRadius: '999px' }}>ACTIVE</span>
                                </a>
                                <a href="/lms" onClick={closeMenu} style={{
                                    padding: '0.85rem 1rem',
                                    borderRadius: '14px',
                                    background: 'rgba(245, 158, 11, 0.12)',
                                    border: '1px solid rgba(245, 158, 11, 0.35)',
                                    color: '#fbbf24',
                                    textDecoration: 'none',
                                    fontWeight: 700,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between'
                                }}>
                                    <span>🎓 LMS ශිෂ්‍ය ද්වාරය (LMS Portal)</span>
                                    <ChevronRight size={16} />
                                </a>
                            </div>
                        </div>

                        {/* Language & WhatsApp Direct Contact */}
                        <div style={{ marginTop: '1.25rem', paddingTop: '1.25rem', borderTop: '1px solid rgba(255, 255, 255, 0.08)', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            <button
                                onClick={toggleLanguage}
                                style={{
                                    width: '100%',
                                    background: 'rgba(255, 255, 255, 0.06)',
                                    border: '1px solid rgba(255, 255, 255, 0.15)',
                                    color: '#e2e8f0',
                                    borderRadius: '14px',
                                    padding: '0.8rem',
                                    fontSize: '0.9rem',
                                    fontWeight: 700,
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '0.55rem'
                                }}
                            >
                                <Globe size={16} style={{ color: '#38bdf8' }} />
                                <span>{language === 'si' ? 'Change to English Language (EN)' : 'භාෂාව සිංහලට මාරු කරන්න (SI)'}</span>
                            </button>

                            <a 
                                href={`https://wa.me/${MATHSBOOK_CONFIG.tutor.whatsapp}`} 
                                target="_blank" 
                                rel="noreferrer" 
                                className="btn btn-whatsapp"
                                style={{ width: '100%', justifyContent: 'center', padding: '0.85rem', borderRadius: '14px', fontSize: '0.92rem' }}
                            >
                                <MessageSquare size={18} /> WhatsApp Contact (077 978 0053)
                            </a>
                        </div>
                    </div>
                </>
            )}
        </nav>
    );
}

