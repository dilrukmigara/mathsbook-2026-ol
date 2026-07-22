'use client';

import React from 'react';
import { ShieldAlert, Users, Target, CheckCircle, ArrowRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function CourseCards({ onSelectCourse }) {
    const { t } = useLanguage();

    return (
        <section id="courses" className="section-padding">
            <div className="container">
                <div className="section-title-wrap">
                    <span className="section-tag">mathsbook</span>
                    <h2 className="section-title">{t('coursesTitle')}</h2>
                    <p className="section-sub">{t('coursesSub')}</p>
                </div>

                <div className="courses-grid">
                    {/* Course 1: Full Paper Discussion */}
                    <div style={{
                        background: 'linear-gradient(180deg, rgba(99, 102, 241, 0.12) 0%, rgba(18, 26, 43, 0.85) 100%)',
                        border: '1px solid #6366f1',
                        borderRadius: '24px',
                        padding: '2rem',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        position: 'relative'
                    }}>
                        <div style={{
                            position: 'absolute',
                            top: '-14px',
                            right: '24px',
                            background: 'linear-gradient(135deg, #6366f1 0%, #06b6d4 100%)',
                            color: '#fff',
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            padding: '4px 12px',
                            borderRadius: '999px',
                            textTransform: 'uppercase'
                        }}>
                            ලකුණු 65+ සුදුසුකම්
                        </div>

                        <div>
                            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#06b6d4', textTransform: 'uppercase' }}>Category 01</span>
                            <h3 style={{ fontSize: '1.4rem', marginBottom: '0.75rem' }}>Full Paper Discussion Class</h3>
                            
                            <div style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.4rem',
                                padding: '0.4rem 0.85rem',
                                borderRadius: '999px',
                                fontSize: '0.8rem',
                                fontWeight: 700,
                                marginBottom: '1.25rem',
                                background: 'rgba(239, 68, 68, 0.15)',
                                border: '1px solid rgba(239, 68, 68, 0.4)',
                                color: '#fca5a5'
                            }}>
                                <ShieldAlert size={16} /> අවසන් වාරයේ ලකුණු 65% ට වඩා තිබිය යුතුය
                            </div>

                            <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                                ඉහළ ලකුණු ලබා ගන්නා, A / B සාමාර්ථ ඉලක්ක කරන සිසුන් සඳහාම වෙන්වූ සම්පූර්ණ ප්‍රශ්න පත්‍ර සාකච්ඡා පන්තිය.
                            </p>

                            <ul style={{ listStyle: 'none', marginBottom: '2rem', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                                <li style={{ display: 'flex', gap: '0.75rem', fontSize: '0.95rem', color: '#94a3b8' }}>
                                    <CheckCircle size={18} style={{ color: '#10b981', flexShrink: 0 }} /> සම්පූර්ණ කාල රාමුවට අනුව ප්‍රශ්න පත්‍ර ලියවීම
                                </li>
                                <li style={{ display: 'flex', gap: '0.75rem', fontSize: '0.95rem', color: '#94a3b8' }}>
                                    <CheckCircle size={18} style={{ color: '#10b981', flexShrink: 0 }} /> Marking Scheme එකට අනුව ලකුණු දීම
                                </li>
                                <li style={{ display: 'flex', gap: '0.75rem', fontSize: '0.95rem', color: '#94a3b8' }}>
                                    <CheckCircle size={18} style={{ color: '#10b981', flexShrink: 0 }} /> වේගය සහ නිවැරදිභාවය වර්ධනය කිරීම
                                </li>
                                <li style={{ display: 'flex', gap: '0.75rem', fontSize: '0.95rem', color: '#94a3b8' }}>
                                    <CheckCircle size={18} style={{ color: '#10b981', flexShrink: 0 }} /> දිවයිනේ ඉහළම සාමාර්ථ ඉලක්ක කිරීම
                                </li>
                            </ul>
                        </div>

                        <button className="btn btn-primary" onClick={() => onSelectCourse('full_paper')}>
                            ලියාපදිංචි වන්න <ArrowRight size={18} />
                        </button>
                    </div>

                    {/* Course 2: Paper + Revision */}
                    <div style={{
                        background: 'rgba(18, 26, 43, 0.75)',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                        borderRadius: '24px',
                        padding: '2rem',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between'
                    }}>
                        <div>
                            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#06b6d4', textTransform: 'uppercase' }}>Category 02</span>
                            <h3 style={{ fontSize: '1.4rem', marginBottom: '0.75rem' }}>Paper + Revision Class</h3>

                            <div style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.4rem',
                                padding: '0.4rem 0.85rem',
                                borderRadius: '999px',
                                fontSize: '0.8rem',
                                fontWeight: 700,
                                marginBottom: '1.25rem',
                                background: 'rgba(16, 185, 129, 0.15)',
                                border: '1px solid rgba(16, 185, 129, 0.4)',
                                color: '#6ee7b7'
                            }}>
                                <Users size={16} /> සියලුම සිසුන් සඳහා විවෘතයි
                            </div>

                            <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                                සිද්ධාන්ත කොටස් නැවත මතක් කරමින් ප්‍රශ්න පත්‍ර හුරු කරවන පූර්ණ රිවිෂන් පන්තිය.
                            </p>

                            <ul style={{ listStyle: 'none', marginBottom: '2rem', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                                <li style={{ display: 'flex', gap: '0.75rem', fontSize: '0.95rem', color: '#94a3b8' }}>
                                    <CheckCircle size={18} style={{ color: '#10b981', flexShrink: 0 }} /> ඒකකයෙන් ඒකකය සම්පූර්ණ පුනරීක්ෂණය
                                </li>
                                <li style={{ display: 'flex', gap: '0.75rem', fontSize: '0.95rem', color: '#94a3b8' }}>
                                    <CheckCircle size={18} style={{ color: '#10b981', flexShrink: 0 }} /> ආදර්ශ ප්‍රශ්න පත්‍ර හා පසුගිය විභාග ප්‍රශ්න
                                </li>
                                <li style={{ display: 'flex', gap: '0.75rem', fontSize: '0.95rem', color: '#94a3b8' }}>
                                    <CheckCircle size={18} style={{ color: '#10b981', flexShrink: 0 }} /> කෙටි ක්‍රම හා සූත්‍ර මතක තබාගැනීමේ ක්‍රම
                                </li>
                                <li style={{ display: 'flex', gap: '0.75rem', fontSize: '0.95rem', color: '#94a3b8' }}>
                                    <CheckCircle size={18} style={{ color: '#10b981', flexShrink: 0 }} /> ලකුණු මට්ටම සීඝ්‍රයෙන් ඉහළ නැංවීම
                                </li>
                            </ul>
                        </div>

                        <button className="btn btn-secondary" onClick={() => onSelectCourse('paper_revision')}>
                            ලියාපදිංචි වන්න <ArrowRight size={18} />
                        </button>
                    </div>

                    {/* Course 3: Target C Pass (Base Paper) */}
                    <div style={{
                        background: 'rgba(18, 26, 43, 0.75)',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                        borderRadius: '24px',
                        padding: '2rem',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between'
                    }}>
                        <div>
                            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#06b6d4', textTransform: 'uppercase' }}>Category 03</span>
                            <h3 style={{ fontSize: '1.4rem', marginBottom: '0.75rem' }}>Target 'C' Pass Class (Base Paper)</h3>

                            <div style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.4rem',
                                padding: '0.4rem 0.85rem',
                                borderRadius: '999px',
                                fontSize: '0.8rem',
                                fontWeight: 700,
                                marginBottom: '1.25rem',
                                background: 'rgba(245, 158, 11, 0.15)',
                                border: '1px solid rgba(245, 158, 11, 0.4)',
                                color: '#fde047'
                            }}>
                                <Target size={16} /> C සාමාර්ථය සඳහා ඉලක්කගත පන්තිය
                            </div>

                            <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                                ලකුණු අඩු මට්ටමක සිටින, නිසැක C සාමාර්ථයක් ලබා ගැනීමට මූලික අඩිතාලම ගොඩනගන Base Paper පන්තිය.
                            </p>

                            <ul style={{ listStyle: 'none', marginBottom: '2rem', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                                <li style={{ display: 'flex', gap: '0.75rem', fontSize: '0.95rem', color: '#94a3b8' }}>
                                    <CheckCircle size={18} style={{ color: '#10b981', flexShrink: 0 }} /> මූලික Base Papers මඟින් අඩිතාලම සැකසීම
                                </li>
                                <li style={{ display: 'flex', gap: '0.75rem', fontSize: '0.95rem', color: '#94a3b8' }}>
                                    <CheckCircle size={18} style={{ color: '#10b981', flexShrink: 0 }} /> විභාගයට අනිවාර්යයෙන්ම එන කොටස් පුහුණුව
                                </li>
                                <li style={{ display: 'flex', gap: '0.75rem', fontSize: '0.95rem', color: '#94a3b8' }}>
                                    <CheckCircle size={18} style={{ color: '#10b981', flexShrink: 0 }} /> පුද්ගලික අවධානය හා මඟපෙන්වීම
                                </li>
                                <li style={{ display: 'flex', gap: '0.75rem', fontSize: '0.95rem', color: '#94a3b8' }}>
                                    <CheckCircle size={18} style={{ color: '#10b981', flexShrink: 0 }} /> නිසැක C සාමාර්ථයක් තහවුරු කිරීම
                                </li>
                            </ul>
                        </div>

                        <button className="btn btn-gold" onClick={() => onSelectCourse('target_c')}>
                            ලියාපදිංචි වන්න <ArrowRight size={18} />
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}
