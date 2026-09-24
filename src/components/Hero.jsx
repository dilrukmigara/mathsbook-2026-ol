'use client';

import React from 'react';
import { UserCheck, MessageSquare, Phone, BookOpen, GraduationCap, FileText, Sparkles, Award, ArrowRight } from 'lucide-react';
import { MATHSBOOK_CONFIG } from '../config/mathsbookConfig';
import { useLanguage } from '../context/LanguageContext';

export default function Hero() {
    const { t } = useLanguage();

    return (
        <section id="home" className="hero-section" style={{ paddingTop: '96px', paddingBottom: '48px', position: 'relative', zIndex: 1, scrollMarginTop: '88px' }}>
            {/* Top Atmospheric Glow Behind Hero */}
            <div style={{
                position: 'absolute',
                top: '0',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '100%',
                maxWidth: '960px',
                height: '380px',
                background: 'radial-gradient(ellipse at 50% 20%, rgba(99, 102, 241, 0.16) 0%, rgba(14, 165, 233, 0.08) 50%, transparent 70%)',
                filter: 'blur(75px)',
                pointerEvents: 'none',
                zIndex: -1
            }} />

            <div className="container hero-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2.5rem', alignItems: 'center' }}>
                
                {/* Left Column Text Content */}
                <div className="hero-text-col">
                    {/* Live Status Badge */}
                    <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.55rem',
                        background: 'rgba(16, 185, 129, 0.1)',
                        border: '1px solid rgba(16, 185, 129, 0.3)',
                        padding: '0.35rem 0.95rem',
                        borderRadius: '999px',
                        marginBottom: '1.15rem',
                        backdropFilter: 'blur(10px)'
                    }}>
                        <span style={{
                            width: '7px',
                            height: '7px',
                            background: '#10b981',
                            borderRadius: '50%',
                            boxShadow: '0 0 8px #10b981',
                            flexShrink: 0,
                            animation: 'pulseRadar 2s infinite'
                        }}></span>
                        <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#34d399', letterSpacing: '0.2px' }}>
                            {t('heroBadge')}
                        </span>
                    </div>

                    <h1 className="hero-title" style={{
                        fontSize: 'clamp(2.1rem, 4.4vw, 3.35rem)',
                        lineHeight: 1.22,
                        marginBottom: '1.15rem',
                        letterSpacing: '-0.025em',
                        fontWeight: 900
                    }}>
                        {t('heroTitleLine1')} <span className="gradient-text-gold">{t('heroTitleLine2')}</span> - <span className="gradient-text">mathsbook</span>
                    </h1>

                    <p className="hero-subtitle" style={{
                        fontSize: '1.08rem',
                        color: '#94a3b8',
                        marginBottom: '1.85rem',
                        maxWidth: '590px',
                        lineHeight: 1.68
                    }}>
                        {t('heroSub')}
                    </p>

                    {/* Action CTAs */}
                    <div className="hero-cta-group" style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
                        <a href="#enroll" className="btn btn-primary hero-btn" style={{ padding: '0.85rem 1.65rem', fontSize: '0.96rem' }}>
                            <UserCheck size={19} /> {t('btnEnroll')}
                        </a>
                        <a href="/exam" className="btn hero-btn" style={{
                            background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(14, 165, 233, 0.15) 100%)',
                            color: '#ffffff',
                            border: '1px solid rgba(99, 102, 241, 0.4)',
                            boxShadow: '0 4px 18px rgba(99, 102, 241, 0.25)',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            textDecoration: 'none',
                            padding: '0.85rem 1.55rem',
                            fontSize: '0.96rem'
                        }}>
                            <Sparkles size={17} color="#38bdf8" /> 
                            <span>Online Exams</span>
                        </a>
                        <a href="/papers" className="btn btn-secondary hero-btn" style={{
                            borderColor: 'rgba(16, 185, 129, 0.35)',
                            color: '#34d399',
                            background: 'rgba(16, 185, 129, 0.08)',
                            padding: '0.85rem 1.5rem',
                            fontSize: '0.96rem'
                        }}>
                            <FileText size={17} /> Free Papers
                        </a>
                    </div>

                    {/* Stats Highlights */}
                    <div className="hero-stats-grid" style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(3, 1fr)',
                        gap: '1rem',
                        paddingTop: '1.5rem',
                        borderTop: '1px solid rgba(255, 255, 255, 0.08)'
                    }}>
                        <div style={{
                            background: 'rgba(15, 23, 42, 0.55)',
                            border: '1px solid rgba(255, 255, 255, 0.08)',
                            borderRadius: '16px',
                            padding: '0.9rem 1rem'
                        }}>
                            <h4 style={{ fontSize: 'clamp(1.5rem, 2.5vw, 1.95rem)', color: '#ffffff', fontFamily: 'Outfit, sans-serif', fontWeight: 800, lineHeight: 1 }} className="gradient-text">
                                100%
                            </h4>
                            <p style={{ fontSize: '0.82rem', color: '#94a3b8', marginTop: '0.35rem', fontWeight: 600 }}>සිංහල මාධ්‍යය</p>
                        </div>
                        <div style={{
                            background: 'rgba(15, 23, 42, 0.55)',
                            border: '1px solid rgba(255, 255, 255, 0.08)',
                            borderRadius: '16px',
                            padding: '0.9rem 1rem'
                        }}>
                            <h4 style={{ fontSize: 'clamp(1.5rem, 2.5vw, 1.95rem)', color: '#ffffff', fontFamily: 'Outfit, sans-serif', fontWeight: 800, lineHeight: 1 }} className="gradient-text-gold">
                                3 Tracks
                            </h4>
                            <p style={{ fontSize: '0.82rem', color: '#94a3b8', marginTop: '0.35rem', fontWeight: 600 }}>විශේෂිත පන්ති 3ක්</p>
                        </div>
                        <div style={{
                            background: 'rgba(15, 23, 42, 0.55)',
                            border: '1px solid rgba(255, 255, 255, 0.08)',
                            borderRadius: '16px',
                            padding: '0.9rem 1rem'
                        }}>
                            <h4 style={{ fontSize: 'clamp(1.5rem, 2.5vw, 1.95rem)', color: '#ffffff', fontFamily: 'Outfit, sans-serif', fontWeight: 800, lineHeight: 1 }} className="gradient-text-emerald">
                                65%+
                            </h4>
                            <p style={{ fontSize: '0.82rem', color: '#94a3b8', marginTop: '0.35rem', fontWeight: 600 }}>Paper Class ඉලක්ක</p>
                        </div>
                    </div>
                </div>

                {/* Right Column Tutor Card */}
                <div className="hero-card-col" style={{ position: 'relative' }}>
                    <div style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: '100%',
                        height: '100%',
                        background: 'radial-gradient(circle, rgba(99, 102, 241, 0.28) 0%, rgba(14, 165, 233, 0.12) 50%, transparent 70%)',
                        filter: 'blur(50px)',
                        zIndex: 0
                    }}></div>

                    <div style={{
                        position: 'relative',
                        zIndex: 1,
                        background: 'linear-gradient(145deg, rgba(20, 30, 52, 0.88) 0%, rgba(12, 18, 32, 0.96) 100%)',
                        border: '1px solid rgba(99, 102, 241, 0.35)',
                        borderRadius: '26px',
                        padding: '1.35rem',
                        backdropFilter: 'blur(25px)',
                        boxShadow: '0 25px 55px -10px rgba(0, 0, 0, 0.75), 0 0 35px rgba(99, 102, 241, 0.18)',
                        maxWidth: '470px',
                        margin: '0 auto'
                    }}>
                        <div style={{
                            position: 'relative',
                            width: '100%',
                            aspectRatio: '4/3.8',
                            maxHeight: '345px',
                            borderRadius: '20px',
                            overflow: 'hidden',
                            marginBottom: '1.25rem',
                            border: '1px solid rgba(255, 255, 255, 0.14)',
                            background: '#090d16'
                        }}>
                            <img 
                                src="/images/migara.png" 
                                alt={MATHSBOOK_CONFIG.tutor.name} 
                                style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top center' }} 
                            />
                            
                            {/* Floating Tutor Credential Pill */}
                            <div style={{
                                position: 'absolute',
                                bottom: '12px',
                                left: '12px',
                                right: '12px',
                                background: 'rgba(8, 12, 20, 0.92)',
                                backdropFilter: 'blur(16px)',
                                border: '1px solid rgba(255, 255, 255, 0.18)',
                                padding: '0.65rem 0.95rem',
                                borderRadius: '15px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.75rem',
                                boxShadow: '0 10px 25px rgba(0,0,0,0.5)'
                            }}>
                                <div style={{
                                    width: '36px',
                                    height: '36px',
                                    background: 'linear-gradient(135deg, #6366f1, #0ea5e9)',
                                    borderRadius: '11px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: '#ffffff',
                                    flexShrink: 0,
                                    boxShadow: '0 0 10px rgba(99, 102, 241, 0.4)'
                                }}>
                                    <GraduationCap size={19} />
                                </div>
                                <div>
                                    <div style={{ fontSize: '0.74rem', color: '#94a3b8', fontWeight: 600 }}>ගණිත උපදේශක</div>
                                    <div style={{ fontWeight: 800, fontSize: '0.92rem', color: '#f8fafc' }}>{MATHSBOOK_CONFIG.tutor.name}</div>
                                </div>
                            </div>
                        </div>

                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                                <h3 style={{ fontSize: '1.38rem', fontWeight: 800, color: '#f8fafc' }}>
                                    {MATHSBOOK_CONFIG.tutor.nameSinhala}
                                </h3>
                                <span style={{
                                    background: 'rgba(16, 185, 129, 0.15)',
                                    color: '#34d399',
                                    border: '1px solid rgba(16, 185, 129, 0.35)',
                                    padding: '2px 9px',
                                    borderRadius: '999px',
                                    fontSize: '0.72rem',
                                    fontWeight: 700
                                }}>
                                    VERIFIED TUTOR
                                </span>
                            </div>
                            
                            <div style={{ color: '#38bdf8', fontWeight: 600, fontSize: '0.88rem', marginBottom: '1rem' }}>
                                {MATHSBOOK_CONFIG.tutor.qualification}
                            </div>

                            <div style={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '0.6rem',
                                background: 'rgba(15, 23, 42, 0.65)',
                                padding: '0.95rem',
                                borderRadius: '15px',
                                border: '1px solid rgba(255, 255, 255, 0.08)'
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.7rem', fontSize: '0.86rem', color: '#cbd5e1' }}>
                                    <Phone size={15} style={{ color: '#818cf8', flexShrink: 0 }} />
                                    <span>Hotline: <a href={`tel:${MATHSBOOK_CONFIG.tutor.phone}`} style={{ color: '#ffffff', textDecoration: 'none', fontWeight: 700 }}>077 978 0053</a></span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.7rem', fontSize: '0.86rem', color: '#cbd5e1' }}>
                                    <MessageSquare size={15} style={{ color: '#25D366', flexShrink: 0 }} />
                                    <span>WhatsApp: <a href={`https://wa.me/${MATHSBOOK_CONFIG.tutor.whatsapp}`} target="_blank" rel="noreferrer" style={{ color: '#ffffff', textDecoration: 'none', fontWeight: 700 }}>077 978 0053</a></span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.7rem', fontSize: '0.86rem', color: '#cbd5e1' }}>
                                    <BookOpen size={15} style={{ color: '#fbbf24', flexShrink: 0 }} />
                                    <span>Medium: <strong>{MATHSBOOK_CONFIG.tutor.medium}</strong></span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </section>
    );
}
