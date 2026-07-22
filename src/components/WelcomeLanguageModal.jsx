'use client';

import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Globe, Sparkles, CheckCircle2 } from 'lucide-react';

export default function WelcomeLanguageModal() {
    const { showModal, selectLanguage, language } = useLanguage();
    const [selected, setSelected] = useState(language || 'si');

    if (!showModal) return null;

    const handleConfirm = () => {
        selectLanguage(selected);
    };

    return (
        <div style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.25rem',
            background: 'rgba(5, 8, 16, 0.85)',
            backdropFilter: 'blur(16px)',
            animation: 'fadeIn 0.35s ease'
        }}>
            <div style={{
                maxWidth: '520px',
                width: '100%',
                background: 'linear-gradient(145deg, rgba(26, 31, 56, 0.95) 0%, rgba(15, 23, 42, 0.98) 100%)',
                border: '1px solid rgba(99, 102, 241, 0.4)',
                borderRadius: '24px',
                padding: '2.25rem 1.75rem',
                boxShadow: '0 0 50px rgba(99, 102, 241, 0.25), 0 25px 50px -12px rgba(0, 0, 0, 0.9)',
                textAlign: 'center',
                color: '#fff',
                position: 'relative'
            }}>
                {/* Header Icon */}
                <div style={{
                    width: '64px',
                    height: '64px',
                    margin: '0 auto 1.25rem auto',
                    background: 'linear-gradient(135deg, #6366f1 0%, #06b6d4 100%)',
                    borderRadius: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 0 25px rgba(99, 102, 241, 0.6)'
                }}>
                    <Globe size={32} color="#fff" />
                </div>

                <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    background: 'rgba(99, 102, 241, 0.15)',
                    color: '#818cf8',
                    border: '1px solid rgba(99, 102, 241, 0.3)',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    padding: '0.35rem 0.85rem',
                    borderRadius: '999px',
                    marginBottom: '0.85rem'
                }}>
                    <Sparkles size={15} /> Welcome to mathsbook
                </div>

                <h3 style={{ fontSize: '1.45rem', fontWeight: 800, marginBottom: '0.4rem', color: '#f8fafc' }}>
                    භාෂාව තෝරන්න / Select Language
                </h3>
                <p style={{ fontSize: '0.9rem', color: '#94a3b8', marginBottom: '1.75rem', lineHeight: 1.5 }}>
                    ඔබ කැමති වෙබ් අඩවි භාෂාව තෝරන්න / Select your preferred website display language:
                </p>

                {/* Language Options Cards */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.75rem' }}>
                    {/* Sinhala Option */}
                    <div 
                        onClick={() => setSelected('si')}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '1.1rem 1.25rem',
                            borderRadius: '16px',
                            background: selected === 'si' ? 'linear-gradient(135deg, rgba(99, 102, 241, 0.25) 0%, rgba(6, 182, 212, 0.15) 100%)' : 'rgba(15, 23, 42, 0.6)',
                            border: selected === 'si' ? '2px solid #6366f1' : '1px solid rgba(255, 255, 255, 0.08)',
                            cursor: 'pointer',
                            transition: 'all 0.25s ease',
                            textAlign: 'left'
                        }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <span style={{ fontSize: '2rem' }}>🇱🇰</span>
                            <div>
                                <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#fff', marginBottom: '0.15rem' }}>
                                    සිංහල (Sinhala)
                                </h4>
                                <p style={{ fontSize: '0.8rem', color: '#94a3b8', margin: 0 }}>
                                    වෙබ් අඩවිය සිංහල භාෂාවෙන් නරඹන්න
                                </p>
                            </div>
                        </div>
                        {selected === 'si' && <CheckCircle2 size={24} style={{ color: '#06b6d4', flexShrink: 0 }} />}
                    </div>

                    {/* English Option */}
                    <div 
                        onClick={() => setSelected('en')}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '1.1rem 1.25rem',
                            borderRadius: '16px',
                            background: selected === 'en' ? 'linear-gradient(135deg, rgba(99, 102, 241, 0.25) 0%, rgba(6, 182, 212, 0.15) 100%)' : 'rgba(15, 23, 42, 0.6)',
                            border: selected === 'en' ? '2px solid #6366f1' : '1px solid rgba(255, 255, 255, 0.08)',
                            cursor: 'pointer',
                            transition: 'all 0.25s ease',
                            textAlign: 'left'
                        }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <span style={{ fontSize: '2rem' }}>🇬🇧</span>
                            <div>
                                <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#fff', marginBottom: '0.15rem' }}>
                                    English
                                </h4>
                                <p style={{ fontSize: '0.8rem', color: '#94a3b8', margin: 0 }}>
                                    Browse the website in English language
                                </p>
                            </div>
                        </div>
                        {selected === 'en' && <CheckCircle2 size={24} style={{ color: '#06b6d4', flexShrink: 0 }} />}
                    </div>
                </div>

                {/* Confirm Button */}
                <button 
                    className="btn btn-primary"
                    onClick={handleConfirm}
                    style={{ width: '100%', padding: '0.9rem', fontSize: '1rem', justifyContent: 'center' }}
                >
                    {selected === 'si' ? 'සිංහලෙන් ඉදිරියට යන්න (Continue)' : 'Continue in English'}
                </button>
            </div>
        </div>
    );
}
