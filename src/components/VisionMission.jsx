'use client';

import React from 'react';
import { Eye, Target, Sparkles, Compass } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function VisionMission() {
    const { t } = useLanguage();

    return (
        <section id="about" className="section-padding" style={{ position: 'relative', scrollMarginTop: '88px' }}>
            <div className="container">
                <div className="section-title-wrap">
                    <span className="section-tag">
                        <Sparkles size={13} color="#38bdf8" />
                        <span>About mathsbook</span>
                    </span>
                    <h2 className="section-title">{t('visionTitle')}</h2>
                    <p className="section-sub">{t('visionSub')}</p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2.25rem' }}>
                    {/* Vision Card */}
                    <div style={{
                        background: 'linear-gradient(145deg, rgba(20, 30, 52, 0.75) 0%, rgba(12, 18, 32, 0.85) 100%)',
                        border: '1px solid rgba(99, 102, 241, 0.25)',
                        borderRadius: '26px',
                        padding: '2.75rem 2.25rem',
                        position: 'relative',
                        overflow: 'hidden',
                        backdropFilter: 'blur(20px)',
                        boxShadow: '0 15px 35px -5px rgba(0, 0, 0, 0.5)',
                        transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-6px)';
                        e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.5)';
                        e.currentTarget.style.boxShadow = '0 25px 45px -10px rgba(99, 102, 241, 0.25)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.25)';
                        e.currentTarget.style.boxShadow = '0 15px 35px -5px rgba(0, 0, 0, 0.5)';
                    }}
                    >
                        <div style={{
                            position: 'absolute', top: 0, left: 0, width: '100%', height: '3px',
                            background: 'linear-gradient(90deg, #6366f1, #0ea5e9)'
                        }}></div>
                        
                        <div style={{
                            width: '58px', height: '58px', borderRadius: '18px',
                            background: 'rgba(99, 102, 241, 0.15)', border: '1px solid rgba(99, 102, 241, 0.35)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            color: '#818cf8', marginBottom: '1.5rem',
                            boxShadow: '0 0 15px rgba(99, 102, 241, 0.2)'
                        }}>
                            <Eye size={28} />
                        </div>
                        
                        <h3 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#f8fafc', marginBottom: '1rem', letterSpacing: '-0.02em' }}>
                            {t('visionCard1Title')}
                        </h3>
                        <p style={{ color: '#cbd5e1', fontSize: '1.05rem', lineHeight: 1.75 }}>
                            {t('visionCard1Desc')}
                        </p>
                    </div>

                    {/* Mission Card */}
                    <div style={{
                        background: 'linear-gradient(145deg, rgba(20, 30, 52, 0.75) 0%, rgba(12, 18, 32, 0.85) 100%)',
                        border: '1px solid rgba(14, 165, 233, 0.25)',
                        borderRadius: '26px',
                        padding: '2.75rem 2.25rem',
                        position: 'relative',
                        overflow: 'hidden',
                        backdropFilter: 'blur(20px)',
                        boxShadow: '0 15px 35px -5px rgba(0, 0, 0, 0.5)',
                        transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-6px)';
                        e.currentTarget.style.borderColor = 'rgba(14, 165, 233, 0.5)';
                        e.currentTarget.style.boxShadow = '0 25px 45px -10px rgba(14, 165, 233, 0.25)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.borderColor = 'rgba(14, 165, 233, 0.25)';
                        e.currentTarget.style.boxShadow = '0 15px 35px -5px rgba(0, 0, 0, 0.5)';
                    }}
                    >
                        <div style={{
                            position: 'absolute', top: 0, left: 0, width: '100%', height: '3px',
                            background: 'linear-gradient(90deg, #0ea5e9, #10b981)'
                        }}></div>

                        <div style={{
                            width: '58px', height: '58px', borderRadius: '18px',
                            background: 'rgba(14, 165, 233, 0.15)', border: '1px solid rgba(14, 165, 233, 0.35)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            color: '#38bdf8', marginBottom: '1.5rem',
                            boxShadow: '0 0 15px rgba(14, 165, 233, 0.2)'
                        }}>
                            <Target size={28} />
                        </div>

                        <h3 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#f8fafc', marginBottom: '1rem', letterSpacing: '-0.02em' }}>
                            {t('visionCard2Title')}
                        </h3>
                        <p style={{ color: '#cbd5e1', fontSize: '1.05rem', lineHeight: 1.75 }}>
                            {t('visionCard2Desc')}
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
