'use client';

import React from 'react';
import { ShieldAlert, Users, Target, CheckCircle2, ArrowRight, Sparkles, Award } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function CourseCards({ onSelectCourse }) {
    const { t } = useLanguage();

    return (
        <section id="courses" className="section-padding" style={{ position: 'relative', scrollMarginTop: '88px' }}>
            <div className="container">
                <div className="section-title-wrap">
                    <span className="section-tag">
                        <Award size={14} color="#818cf8" />
                        <span>Curriculum & Batches</span>
                    </span>
                    <h2 className="section-title">{t('coursesTitle')}</h2>
                    <p className="section-sub">{t('coursesSub')}</p>
                </div>

                <div className="courses-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2.25rem' }}>
                    {/* Course 1: Full Paper Discussion */}
                    <div style={{
                        background: 'linear-gradient(160deg, rgba(26, 38, 68, 0.9) 0%, rgba(12, 18, 32, 0.95) 100%)',
                        border: '1.5px solid rgba(99, 102, 241, 0.45)',
                        borderRadius: '26px',
                        padding: '2.5rem 2rem',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        position: 'relative',
                        boxShadow: '0 20px 45px -10px rgba(99, 102, 241, 0.25)',
                        transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-6px)';
                        e.currentTarget.style.borderColor = '#818cf8';
                        e.currentTarget.style.boxShadow = '0 25px 50px -5px rgba(99, 102, 241, 0.4)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.45)';
                        e.currentTarget.style.boxShadow = '0 20px 45px -10px rgba(99, 102, 241, 0.25)';
                    }}
                    >
                        <div style={{
                            position: 'absolute',
                            top: '-13px',
                            right: '24px',
                            background: 'linear-gradient(135deg, #6366f1 0%, #0ea5e9 100%)',
                            color: '#ffffff',
                            fontSize: '0.72rem',
                            fontWeight: 800,
                            padding: '4px 14px',
                            borderRadius: '999px',
                            textTransform: 'uppercase',
                            letterSpacing: '0.6px',
                            boxShadow: '0 4px 15px rgba(99, 102, 241, 0.4)'
                        }}>
                            ලකුණු 65+ සුදුසුකම්
                        </div>

                        <div>
                            <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#38bdf8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Category 01</span>
                            <h3 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#f8fafc', margin: '0.35rem 0 0.85rem 0' }}>
                                Full Paper Discussion Class
                            </h3>
                            
                            <div style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.45rem',
                                padding: '0.45rem 0.95rem',
                                borderRadius: '12px',
                                fontSize: '0.82rem',
                                fontWeight: 700,
                                marginBottom: '1.25rem',
                                background: 'rgba(239, 68, 68, 0.12)',
                                border: '1px solid rgba(239, 68, 68, 0.35)',
                                color: '#fca5a5'
                            }}>
                                <ShieldAlert size={16} color="#f87171" /> 
                                <span>අවසන් වාරයේ ලකුණු 65% ට වඩා තිබිය යුතුය</span>
                            </div>

                            <p style={{ color: '#94a3b8', fontSize: '0.92rem', marginBottom: '1.6rem', lineHeight: 1.6 }}>
                                ඉහළ ලකුණු ලබා ගන්නා, A / B සාමාර්ථ ඉලක්ක කරන සිසුන් සඳහාම වෙන්වූ සම්පූර්ණ ප්‍රශ්න පත්‍ර සාකච්ඡා පන්තිය.
                            </p>

                            <ul style={{ listStyle: 'none', marginBottom: '2.25rem', display: 'flex', flexDirection: 'column', gap: '0.9rem', padding: 0 }}>
                                {[
                                    'සම්පූර්ණ කාල රාමුවට අනුව ප්‍රශ්න පත්‍ර ලියවීම',
                                    'Marking Scheme එකට අනුව නිවැරදිව ලකුණු දීම',
                                    'වේගය සහ නිවැරදිභාවය වර්ධනය කිරීම',
                                    'දිවයිනේ ඉහළම සාමාර්ථ ඉලක්ක කරගත් මඟපෙන්වීම'
                                ].map((item, idx) => (
                                    <li key={idx} style={{ display: 'flex', gap: '0.75rem', fontSize: '0.92rem', color: '#cbd5e1' }}>
                                        <CheckCircle2 size={18} style={{ color: '#34d399', flexShrink: 0, marginTop: '2px' }} />
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <button className="btn btn-primary" onClick={() => onSelectCourse('full_paper')} style={{ width: '100%' }}>
                            <span>ලියාපදිංචි වන්න</span>
                            <ArrowRight size={18} />
                        </button>
                    </div>

                    {/* Course 2: Paper + Revision */}
                    <div style={{
                        background: 'linear-gradient(160deg, rgba(20, 30, 52, 0.8) 0%, rgba(12, 18, 32, 0.95) 100%)',
                        border: '1.5px solid rgba(16, 185, 129, 0.35)',
                        borderRadius: '26px',
                        padding: '2.5rem 2rem',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        boxShadow: '0 20px 45px -10px rgba(0, 0, 0, 0.6)',
                        transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-6px)';
                        e.currentTarget.style.borderColor = '#34d399';
                        e.currentTarget.style.boxShadow = '0 25px 50px -5px rgba(16, 185, 129, 0.25)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.borderColor = 'rgba(16, 185, 129, 0.35)';
                        e.currentTarget.style.boxShadow = '0 20px 45px -10px rgba(0, 0, 0, 0.6)';
                    }}
                    >
                        <div>
                            <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#34d399', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Category 02</span>
                            <h3 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#f8fafc', margin: '0.35rem 0 0.85rem 0' }}>
                                Paper + Revision Class
                            </h3>

                            <div style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.45rem',
                                padding: '0.45rem 0.95rem',
                                borderRadius: '12px',
                                fontSize: '0.82rem',
                                fontWeight: 700,
                                marginBottom: '1.25rem',
                                background: 'rgba(16, 185, 129, 0.12)',
                                border: '1px solid rgba(16, 185, 129, 0.35)',
                                color: '#6ee7b7'
                            }}>
                                <Users size={16} color="#34d399" /> 
                                <span>සියලුම සිසුන් සඳහා විවෘතයි</span>
                            </div>

                            <p style={{ color: '#94a3b8', fontSize: '0.92rem', marginBottom: '1.6rem', lineHeight: 1.6 }}>
                                සිද්ධාන්ත කොටස් නැවත මතක් කරමින් ප්‍රශ්න පත්‍ර හුරු කරවන පූර්ණ රිවිෂන් හා ප්‍රශ්න පත්‍ර පන්තිය.
                            </p>

                            <ul style={{ listStyle: 'none', marginBottom: '2.25rem', display: 'flex', flexDirection: 'column', gap: '0.9rem', padding: 0 }}>
                                {[
                                    'ඒකකයෙන් ඒකකය සම්පූර්ණ සිද්ධාන්ත පුනරීක්ෂණය',
                                    'ආදර්ශ ප්‍රශ්න පත්‍ර හා පසුගිය විභාග ගැටළු සාකච්ඡාව',
                                    'කෙටි ක්‍රම හා සූත්‍ර මතක තබාගැනීමේ විශේෂ ක්‍රම',
                                    'ලකුණු මට්ටම සීඝ්‍රයෙන් ඉහළ නැංවීමේ පුහුණුව'
                                ].map((item, idx) => (
                                    <li key={idx} style={{ display: 'flex', gap: '0.75rem', fontSize: '0.92rem', color: '#cbd5e1' }}>
                                        <CheckCircle2 size={18} style={{ color: '#34d399', flexShrink: 0, marginTop: '2px' }} />
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <button className="btn btn-secondary" onClick={() => onSelectCourse('paper_revision')} style={{ width: '100%', borderColor: 'rgba(16, 185, 129, 0.4)' }}>
                            <span>ලියාපදිංචි වන්න</span>
                            <ArrowRight size={18} />
                        </button>
                    </div>

                    {/* Course 3: Target C Pass (Base Paper) */}
                    <div style={{
                        background: 'linear-gradient(160deg, rgba(20, 30, 52, 0.8) 0%, rgba(12, 18, 32, 0.95) 100%)',
                        border: '1.5px solid rgba(245, 158, 11, 0.35)',
                        borderRadius: '26px',
                        padding: '2.5rem 2rem',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        boxShadow: '0 20px 45px -10px rgba(0, 0, 0, 0.6)',
                        transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-6px)';
                        e.currentTarget.style.borderColor = '#fbbf24';
                        e.currentTarget.style.boxShadow = '0 25px 50px -5px rgba(245, 158, 11, 0.25)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.borderColor = 'rgba(245, 158, 11, 0.35)';
                        e.currentTarget.style.boxShadow = '0 20px 45px -10px rgba(0, 0, 0, 0.6)';
                    }}
                    >
                        <div>
                            <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#fbbf24', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Category 03</span>
                            <h3 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#f8fafc', margin: '0.35rem 0 0.85rem 0' }}>
                                Target 'C' Pass Class
                            </h3>

                            <div style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.45rem',
                                padding: '0.45rem 0.95rem',
                                borderRadius: '12px',
                                fontSize: '0.82rem',
                                fontWeight: 700,
                                marginBottom: '1.25rem',
                                background: 'rgba(245, 158, 11, 0.12)',
                                border: '1px solid rgba(245, 158, 11, 0.35)',
                                color: '#fde047'
                            }}>
                                <Target size={16} color="#fbbf24" /> 
                                <span>C සාමාර්ථය සඳහා Base Paper පන්තිය</span>
                            </div>

                            <p style={{ color: '#94a3b8', fontSize: '0.92rem', marginBottom: '1.6rem', lineHeight: 1.6 }}>
                                ලකුණු අඩු මට්ටමක සිටින, නිසැක C සාමාර්ථයක් ලබා ගැනීමට මූලික අඩිතාලම ගොඩනගන Base Paper පන්තිය.
                            </p>

                            <ul style={{ listStyle: 'none', marginBottom: '2.25rem', display: 'flex', flexDirection: 'column', gap: '0.9rem', padding: 0 }}>
                                {[
                                    'මූලික Base Papers මඟින් ගණිත අඩිතාලම ශක්තිමත් කිරීම',
                                    'විභාගයට අනිවාර්යයෙන්ම එන ප්‍රධාන කොටස් පුහුණුව',
                                    'පුද්ගලික අවධානය හා සුහදශීලී මඟපෙන්වීම',
                                    'නිසැක C සාමාර්ථයක් විශ්වාසයෙන් තහවුරු කිරීම'
                                ].map((item, idx) => (
                                    <li key={idx} style={{ display: 'flex', gap: '0.75rem', fontSize: '0.92rem', color: '#cbd5e1' }}>
                                        <CheckCircle2 size={18} style={{ color: '#34d399', flexShrink: 0, marginTop: '2px' }} />
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <button className="btn btn-gold" onClick={() => onSelectCourse('target_c')} style={{ width: '100%' }}>
                            <span>ලියාපදිංචි වන්න</span>
                            <ArrowRight size={18} />
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}
