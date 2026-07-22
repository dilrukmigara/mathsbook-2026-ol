'use client';

import React from 'react';
import { Eye, Target } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function VisionMission() {
    const { t } = useLanguage();

    return (
        <section id="about" className="section-padding" style={{ background: 'rgba(15, 23, 42, 0.4)' }}>
            <div className="container">
                <div className="section-title-wrap">
                    <span className="section-tag">mathsbook</span>
                    <h2 className="section-title">{t('visionTitle')}</h2>
                    <p className="section-sub">{t('visionSub')}</p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
                    {/* Vision Card */}
                    <div style={{
                        background: 'rgba(18, 26, 43, 0.75)',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                        borderRadius: '24px',
                        padding: '2.5rem',
                        position: 'relative',
                        overflow: 'hidden'
                    }}>
                        <div style={{
                            position: 'absolute', top: 0, left: 0, width: '100%', height: '4px',
                            background: 'linear-gradient(90deg, #6366f1, #06b6d4)'
                        }}></div>
                        
                        <div style={{
                            width: '60px', height: '60px', borderRadius: '16px',
                            background: 'rgba(99, 102, 241, 0.15)', border: '1px solid rgba(99, 102, 241, 0.3)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            color: '#818cf8', marginBottom: '1.5rem'
                        }}>
                            <Eye size={30} />
                        </div>
                        
                        <h3 style={{ fontSize: '1.75rem', marginBottom: '1rem' }}>{t('visionCard1Title')}</h3>
                        <p style={{ color: '#94a3b8', fontSize: '1.05rem', lineHeight: 1.7 }}>
                            {t('visionCard1Desc')}
                        </p>
                    </div>

                    {/* Mission Card */}
                    <div style={{
                        background: 'rgba(18, 26, 43, 0.75)',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                        borderRadius: '24px',
                        padding: '2.5rem',
                        position: 'relative',
                        overflow: 'hidden'
                    }}>
                        <div style={{
                            position: 'absolute', top: 0, left: 0, width: '100%', height: '4px',
                            background: 'linear-gradient(90deg, #06b6d4, #fbbf24)'
                        }}></div>

                        <div style={{
                            width: '60px', height: '60px', borderRadius: '16px',
                            background: 'rgba(6, 182, 212, 0.15)', border: '1px solid rgba(6, 182, 212, 0.3)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            color: '#06b6d4', marginBottom: '1.5rem'
                        }}>
                            <Target size={30} />
                        </div>

                        <h3 style={{ fontSize: '1.75rem', marginBottom: '1rem' }}>{t('visionCard2Title')}</h3>
                        <p style={{ color: '#94a3b8', fontSize: '1.05rem', lineHeight: 1.7 }}>
                            {t('visionCard2Desc')}
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
