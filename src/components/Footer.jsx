'use client';

import React from 'react';
import { Phone, MessageSquare, GraduationCap, Award, Heart, Sparkles, ArrowUpRight } from 'lucide-react';
import { MATHSBOOK_CONFIG } from '../config/mathsbookConfig';
import { useLanguage } from '../context/LanguageContext';

export default function Footer() {
    const { t } = useLanguage();

    return (
        <footer id="contact" style={{
            background: 'linear-gradient(180deg, #080c14 0%, #05080e 100%)',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            padding: '75px 0 35px 0',
            position: 'relative',
            zIndex: 1
        }}>
            <div className="container">
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: '3rem', marginBottom: '3.5rem' }}>
                    
                    {/* Col 1: Brand Info */}
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
                            <div style={{
                                width: '42px',
                                height: '42px',
                                background: 'linear-gradient(135deg, #6366f1 0%, #0ea5e9 100%)',
                                borderRadius: '13px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontWeight: 900,
                                fontSize: '1.4rem',
                                color: '#ffffff',
                                boxShadow: '0 0 20px rgba(99, 102, 241, 0.4)'
                            }}>
                                M
                            </div>
                            <div style={{
                                fontSize: '1.5rem',
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
                        </div>
                        <p style={{ color: '#94a3b8', fontSize: '0.92rem', lineHeight: 1.65, marginBottom: '1.5rem' }}>
                            {t('footerDesc')}
                        </p>
                        <div style={{ display: 'flex', gap: '0.6rem' }}>
                            <span style={{
                                background: 'rgba(99, 102, 241, 0.12)',
                                border: '1px solid rgba(99, 102, 241, 0.3)',
                                color: '#a5b4fc',
                                fontSize: '0.75rem',
                                padding: '3px 10px',
                                borderRadius: '999px',
                                fontWeight: 700
                            }}>
                                O/L 2026 Batch
                            </span>
                            <span style={{
                                background: 'rgba(16, 185, 129, 0.12)',
                                border: '1px solid rgba(16, 185, 129, 0.3)',
                                color: '#34d399',
                                fontSize: '0.75rem',
                                padding: '3px 10px',
                                borderRadius: '999px',
                                fontWeight: 700
                            }}>
                                Verified Platform
                            </span>
                        </div>
                    </div>

                    {/* Col 2: Navigation Links */}
                    <div>
                        <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#f8fafc', marginBottom: '1.35rem', letterSpacing: '0.3px' }}>
                            Quick Navigation
                        </h4>
                        <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.85rem', fontSize: '0.92rem', padding: 0, margin: 0 }}>
                            <li><a href="/#home" style={{ color: '#94a3b8', textDecoration: 'none', transition: 'color 0.2s' }}>{t('navHome')}</a></li>
                            <li><a href="/#about" style={{ color: '#94a3b8', textDecoration: 'none', transition: 'color 0.2s' }}>{t('navAbout')}</a></li>
                            <li><a href="/#courses" style={{ color: '#94a3b8', textDecoration: 'none', transition: 'color 0.2s' }}>{t('navCourses')}</a></li>
                            <li><a href="/#enroll" style={{ color: '#818cf8', textDecoration: 'none', fontWeight: 600 }}>{t('navEnroll')}</a></li>
                        </ul>
                    </div>

                    {/* Col 3: Online Portals */}
                    <div>
                        <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#f8fafc', marginBottom: '1.35rem', letterSpacing: '0.3px' }}>
                            Free Portals
                        </h4>
                        <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.85rem', fontSize: '0.92rem', padding: 0, margin: 0 }}>
                            <li>
                                <a href="/papers" style={{ color: '#34d399', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.3rem', fontWeight: 600 }}>
                                    <span>📑 Free Past & Model Papers</span>
                                    <ArrowUpRight size={14} />
                                </a>
                            </li>
                            <li>
                                <a href="/exam" style={{ color: '#a5b4fc', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.3rem', fontWeight: 600 }}>
                                    <span>📝 Online MCQ Exam System</span>
                                    <ArrowUpRight size={14} />
                                </a>
                            </li>
                            <li>
                                <a href="/lms" style={{ color: '#fbbf24', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.3rem', fontWeight: 600 }}>
                                    <span>🎓 LMS Student Portal</span>
                                    <ArrowUpRight size={14} />
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Col 4: Official Contact */}
                    <div>
                        <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#f8fafc', marginBottom: '1.35rem', letterSpacing: '0.3px' }}>
                            සම්බන්ධ වීමට
                        </h4>
                        <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.85rem', fontSize: '0.9rem', color: '#94a3b8', padding: 0, margin: 0 }}>
                            <li style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                                <Phone size={16} style={{ color: '#818cf8', flexShrink: 0 }} /> 
                                <span>Hotline: <strong style={{ color: '#f8fafc' }}>077 978 0053</strong></span>
                            </li>
                            <li style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                                <MessageSquare size={16} style={{ color: '#25D366', flexShrink: 0 }} /> 
                                <span>WhatsApp: <strong style={{ color: '#25D366' }}>077 978 0053</strong></span>
                            </li>
                            <li style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                                <GraduationCap size={16} style={{ color: '#38bdf8', flexShrink: 0 }} /> 
                                <span>Migara Wickramarachchi</span>
                            </li>
                            <li style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                                <Award size={16} style={{ color: '#fbbf24', flexShrink: 0 }} /> 
                                <span>BSc (Hons) Undergraduate</span>
                            </li>
                        </ul>
                    </div>

                </div>

                <div style={{
                    textAlign: 'center',
                    paddingTop: '2rem',
                    borderTop: '1px solid rgba(255, 255, 255, 0.06)',
                    color: '#64748b',
                    fontSize: '0.85rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '1rem'
                }}>
                    <p>&copy; 2026 mathsbook. All Rights Reserved. Designed for Migara Wickramarachchi.</p>
                    <p style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <span>Built with Passion for Mathematics</span>
                    </p>
                </div>
            </div>
        </footer>
    );
}
