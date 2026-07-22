'use client';

import React, { useState, useEffect } from 'react';
import { Sparkles, Camera, Type, UploadCloud, X, Key, Brain, Copy, MessageSquare, ExternalLink, Loader2, AlertCircle } from 'lucide-react';
import { MATHSBOOK_CONFIG } from '../config/mathsbookConfig';
import { useLanguage } from '../context/LanguageContext';

export default function AiSolver() {
    const { t, language } = useLanguage();
    const [activeTab, setActiveTab] = useState('image');
    const [selectedImageBase64, setSelectedImageBase64] = useState(null);
    const [selectedImageMime, setSelectedImageMime] = useState(null);
    const [imagePreviewUrl, setImagePreviewUrl] = useState(null);
    const [textQuery, setTextQuery] = useState('');
    const [apiKey, setApiKey] = useState(MATHSBOOK_CONFIG.aiSolver.apiKey);
    const [showKeyInput, setShowKeyInput] = useState(false);
    const [tempKeyInput, setTempKeyInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [solution, setSolution] = useState(null);
    const [errorMessage, setErrorMessage] = useState(null);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const savedKey = localStorage.getItem('mathsbook_gemini_api_key');
            if (savedKey) {
                setApiKey(savedKey);
                setTempKeyInput(savedKey);
            }
        }
    }, []);

    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            alert('කරුණාකර ඡායාරූපයක් (Image file) පමණක් තෝරන්න.');
            return;
        }

        const reader = new FileReader();
        reader.onload = (event) => {
            const dataUrl = event.target?.result;
            setImagePreviewUrl(dataUrl);
            setSelectedImageMime(file.type);
            setSelectedImageBase64(dataUrl.split(',')[1]);
        };
        reader.readAsDataURL(file);
    };

    const clearImage = () => {
        setSelectedImageBase64(null);
        setSelectedImageMime(null);
        setImagePreviewUrl(null);
    };

    const handleSaveKey = (newKey) => {
        const trimmed = (newKey || tempKeyInput || '').trim();
        setApiKey(trimmed);
        if (trimmed) {
            localStorage.setItem('mathsbook_gemini_api_key', trimmed);
        } else {
            localStorage.removeItem('mathsbook_gemini_api_key');
        }
        setShowKeyInput(false);
        setErrorMessage(null);
    };

    const handleSolve = async () => {
        if (activeTab === 'image' && !selectedImageBase64) {
            alert('කරුණාකර පළමුව ගණිත ගැටලුවේ ඡායාරූපයක් (Photo) ඇතුළත් කරන්න.');
            return;
        }

        if (activeTab === 'text' && !textQuery.trim()) {
            alert('කරුණාකර පළමුව ඔබේ ගණිත ප්‍රශ්නය ටයිප් කරන්න.');
            return;
        }

        setLoading(true);
        setSolution(null);
        setErrorMessage(null);

        const customKey = (typeof window !== 'undefined' ? localStorage.getItem('mathsbook_gemini_api_key') : '') || apiKey || '';

        try {
            // Call Next.js Server API Route (/api/solve-math)
            const response = await fetch('/api/solve-math', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    activeTab,
                    textQuery,
                    selectedImageBase64,
                    selectedImageMime,
                    customApiKey: customKey
                })
            });

            const data = await response.json();

            if (!response.ok || data.error) {
                setErrorMessage(data.error || 'Gemini API දෝෂයක් සිදුවිය.');
                setShowKeyInput(true);
            } else if (data.solution) {
                setSolution(data.solution);
            } else {
                setErrorMessage('විසඳුම ලබාගැනීමට නොහැකි විය. කරුණාකර නැවත උත්සාහ කරන්න.');
            }
        } catch (err) {
            setErrorMessage('සම්බන්ධතා දෝෂයක් සිදුවිය: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    const copySolution = () => {
        if (solution) {
            navigator.clipboard.writeText(solution).then(() => {
                alert('විසඳුම Clipboard එකට Copy කරගන්නා ලදී!');
            });
        }
    };

    const renderFormattedSolution = (text) => {
        if (!text) return null;

        // Split text by markdown code blocks (``` ... ```)
        const parts = text.split(/(```[\s\S]*?```)/g);

        return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginTop: '0.5rem' }}>
                {parts.map((part, idx) => {
                    if (part.startsWith('```')) {
                        const match = part.match(/```(\w*)\n?([\s\S]*?)```/);
                        const lang = match ? match[1] : '';
                        const codeContent = match ? match[2].trim() : part.replace(/```/g, '').trim();

                        return (
                            <div key={idx} style={{
                                background: '#070b14',
                                border: '1px solid rgba(99, 102, 241, 0.4)',
                                borderRadius: '12px',
                                overflow: 'hidden',
                                boxShadow: '0 4px 15px rgba(0, 0, 0, 0.5)'
                            }}>
                                <div style={{
                                    background: 'rgba(99, 102, 241, 0.15)',
                                    padding: '0.45rem 1rem',
                                    borderBottom: '1px solid rgba(99, 102, 241, 0.2)',
                                    display: 'flex',
                                    justify: 'space-between',
                                    alignItems: 'center',
                                    fontSize: '0.75rem',
                                    color: '#a5b4fc',
                                    fontWeight: 600,
                                    fontFamily: 'monospace'
                                }}>
                                    <span>{lang ? lang.toUpperCase() + ' CODE / MATH' : '📐 MATH EXPRESSION / STEP CODE'}</span>
                                    <button 
                                        onClick={() => navigator.clipboard.writeText(codeContent)}
                                        style={{
                                            background: 'rgba(99, 102, 241, 0.2)',
                                            border: 'none',
                                            color: '#c7d2fe',
                                            padding: '0.2rem 0.6rem',
                                            borderRadius: '6px',
                                            cursor: 'pointer',
                                            fontSize: '0.75rem',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.3rem'
                                        }}
                                    >
                                        <Copy size={13} /> Copy Code
                                    </button>
                                </div>
                                <pre style={{
                                    margin: 0,
                                    padding: '1rem 1.25rem',
                                    overflowX: 'auto',
                                    color: '#38bdf8',
                                    fontFamily: 'Consolas, Monaco, "Fira Code", monospace',
                                    fontSize: '0.92rem',
                                    lineHeight: 1.65,
                                    whiteSpace: 'pre',
                                    background: '#040711'
                                }}>
                                    <code>{codeContent}</code>
                                </pre>
                            </div>
                        );
                    }

                    // Regular text blocks: split by lines to format steps vertically
                    const lines = part.split('\n');

                    return (
                        <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                            {lines.map((line, lineIdx) => {
                                const trimmed = line.trim();
                                if (!trimmed) return <div key={lineIdx} style={{ height: '0.25rem' }} />;

                                const isStepHeader = trimmed.startsWith('📌') || trimmed.startsWith('පියවර') || trimmed.startsWith('Step') || trimmed.startsWith('#');

                                return (
                                    <div key={lineIdx} style={{
                                        padding: isStepHeader ? '0.75rem 1rem' : '0.2rem 0',
                                        background: isStepHeader ? 'linear-gradient(90deg, rgba(99, 102, 241, 0.15) 0%, rgba(15, 23, 42, 0.4) 100%)' : 'transparent',
                                        borderLeft: isStepHeader ? '4px solid #818cf8' : 'none',
                                        borderRadius: isStepHeader ? '0 8px 8px 0' : '0',
                                        color: isStepHeader ? '#a5b4fc' : '#f1f5f9',
                                        fontWeight: isStepHeader ? 700 : 400,
                                        fontSize: isStepHeader ? '1rem' : '0.95rem',
                                        lineHeight: 1.7,
                                        whiteSpace: 'pre-wrap',
                                        wordBreak: 'break-word'
                                    }}>
                                        {line}
                                    </div>
                                );
                            })}
                        </div>
                    );
                })}
            </div>
        );
    };

    return (
        <section id="ai-solver" className="section-padding">
            <div className="container">
                <div className="section-title-wrap">
                    <span style={{
                        background: 'linear-gradient(135deg, #a855f7 0%, #6366f1 100%)',
                        color: '#fff', fontSize: '0.8rem', fontWeight: 700,
                        padding: '0.35rem 0.85rem', borderRadius: '999px',
                        display: 'inline-flex', alignItems: 'center', gap: '0.4rem', marginBottom: '1rem'
                    }}>
                        <Sparkles size={16} /> Powered by Next.js Server API & Gemini AI
                    </span>
                    <h2 className="section-title">{t('aiTitle')}</h2>
                    <p className="section-sub">{t('aiSub')}</p>
                </div>

                <div className="ai-solver-card" style={{
                    background: 'linear-gradient(135deg, rgba(26, 31, 56, 0.9) 0%, rgba(15, 23, 42, 0.95) 100%)',
                    border: '1px solid rgba(99, 102, 241, 0.3)',
                    borderRadius: '24px',
                    padding: '1.5rem',
                    boxShadow: '0 0 35px rgba(99, 102, 241, 0.15)'
                }}>
                    {/* Tabs */}
                    <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '0.75rem', flexWrap: 'wrap' }}>
                        <button 
                            className={`btn btn-sm ${activeTab === 'image' ? 'btn-primary' : 'btn-secondary'}`}
                            onClick={() => setActiveTab('image')}
                            style={{ flex: '1 1 auto', justifyContent: 'center' }}
                        >
                            <Camera size={16} /> {t('tabImage')}
                        </button>
                        <button 
                            className={`btn btn-sm ${activeTab === 'text' ? 'btn-primary' : 'btn-secondary'}`}
                            onClick={() => setActiveTab('text')}
                            style={{ flex: '1 1 auto', justifyContent: 'center' }}
                        >
                            <Type size={16} /> {t('tabText')}
                        </button>
                    </div>

                    {/* Image Tab */}
                    {activeTab === 'image' && (
                        <div>
                            {!imagePreviewUrl ? (
                                <div style={{
                                    border: '2px dashed rgba(99, 102, 241, 0.4)',
                                    borderRadius: '16px',
                                    padding: '2rem 1rem',
                                    textAlign: 'center',
                                    background: 'rgba(15, 23, 42, 0.5)',
                                    position: 'relative',
                                    cursor: 'pointer'
                                }}>
                                    <input 
                                        type="file" 
                                        accept="image/*" 
                                        onChange={handleFileChange}
                                        style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer', width: '100%', height: '100%' }} 
                                    />
                                    <UploadCloud size={44} style={{ color: '#818cf8', marginBottom: '0.75rem' }} />
                                    <h4 style={{ fontSize: '1rem', marginBottom: '0.35rem' }}>ගණිත ගැටලුවේ ඡායාරූපය මෙතැනට Upload කරන්න</h4>
                                    <p style={{ color: '#94a3b8', fontSize: '0.8rem' }}>PNG, JPG, WebP ඡායාරූප සහය දක්වයි</p>
                                </div>
                            ) : (
                                <div style={{ position: 'relative', maxWidth: '350px', margin: '0 auto', borderRadius: '16px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
                                    <img src={imagePreviewUrl} alt="Math problem preview" style={{ width: '100%', maxHeight: '250px', objectFit: 'contain', background: '#000' }} />
                                    <button 
                                        onClick={clearImage}
                                        style={{
                                            position: 'absolute', top: '10px', right: '10px',
                                            background: 'rgba(239, 68, 68, 0.85)', color: '#fff', border: 'none',
                                            borderRadius: '50%', width: '32px', height: '32px', cursor: 'pointer',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center'
                                        }}
                                    >
                                        <X size={18} />
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Text Tab */}
                    {activeTab === 'text' && (
                        <div>
                            <textarea 
                                rows={4}
                                value={textQuery}
                                onChange={(e) => setTextQuery(e.target.value)}
                                placeholder="උදා: 2x² + 5x - 3 = 0 සමීකරණයේ මූල සොයන්න. හෝ ත්‍රිකෝණමිතිය ගැටලුව ටයිප් කරන්න..."
                                style={{
                                    width: '100%', padding: '1rem', background: 'rgba(15, 23, 42, 0.6)',
                                    border: '1px solid rgba(255, 255, 255, 0.12)', borderRadius: '16px',
                                    color: '#fff', fontSize: '0.95rem', outline: 'none', fontFamily: 'inherit'
                                }}
                            />
                        </div>
                    )}

                    {/* Error Notice Card */}
                    {errorMessage && (
                        <div style={{
                            marginTop: '1.25rem', background: 'rgba(239, 68, 68, 0.1)',
                            border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '16px',
                            padding: '1rem', color: '#fca5a5', fontSize: '0.875rem',
                            display: 'flex', alignItems: 'flex-start', gap: '0.75rem'
                        }}>
                            <AlertCircle size={20} style={{ color: '#ef4444', flexShrink: 0, marginTop: '2px' }} />
                            <div>
                                <div style={{ fontWeight: 700, marginBottom: '0.25rem', color: '#f87171' }}>දෝෂයකි:</div>
                                {errorMessage}
                            </div>
                        </div>
                    )}

                    {/* API Key Bar & Inline Input Drawer */}
                    <div style={{
                        marginTop: '1.25rem', background: 'rgba(15, 23, 42, 0.4)',
                        padding: '0.85rem 1rem', borderRadius: '16px',
                        border: '1px solid rgba(255, 255, 255, 0.05)'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
                            <div style={{ fontSize: '0.85rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <Key size={16} style={{ color: '#fbbf24' }} />
                                <span>
                                    <strong>Gemini Backend API Status:</strong>{' '}
                                    <span style={{ color: '#10b981', fontWeight: 600 }}>Next.js Server Connected ✓</span>
                                </span>
                            </div>
                            <button 
                                className="btn btn-secondary btn-sm" 
                                onClick={() => { setShowKeyInput(!showKeyInput); setTempKeyInput(apiKey); }}
                                style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}
                            >
                                {showKeyInput ? 'සඟවන්න' : 'Custom Key එකක් යෙදීමට'}
                            </button>
                        </div>

                        {showKeyInput && (
                            <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                                <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: '0.75rem' }}>
                                    (විකල්ප) ඔබටම වෙන්වූ විශේෂිත Google AI Studio (<a href="https://aistudio.google.com/" target="_blank" rel="noreferrer" style={{ color: '#06b6d4' }}>aistudio.google.com</a>) API Key එකක් ඇත්නම් මෙතැනට යොදන්න:
                                </p>
                                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                                    <input 
                                        type="text" 
                                        value={tempKeyInput}
                                        onChange={(e) => setTempKeyInput(e.target.value)}
                                        placeholder="AIzaSy..."
                                        style={{
                                            flex: '1 1 200px', padding: '0.6rem 0.85rem', background: '#090d16',
                                            border: '1px solid rgba(99, 102, 241, 0.4)', borderRadius: '10px',
                                            color: '#fff', fontSize: '0.85rem', outline: 'none'
                                        }}
                                    />
                                    <button 
                                        className="btn btn-primary btn-sm"
                                        onClick={() => handleSaveKey(tempKeyInput)}
                                        style={{ padding: '0.6rem 1rem' }}
                                    >
                                        සුරකින්න (Save Key)
                                    </button>
                                    {apiKey && (
                                        <button 
                                            className="btn btn-secondary btn-sm"
                                            onClick={() => { setTempKeyInput(''); handleSaveKey(''); }}
                                            style={{ padding: '0.6rem 1rem', color: '#f87171' }}
                                        >
                                            ඉවත් කරන්න (Clear Saved Key)
                                        </button>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Solve Action Button */}
                    <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
                        <button 
                            className="btn btn-primary"
                            onClick={handleSolve}
                            disabled={loading}
                            style={{ width: '100%', padding: '0.9rem', fontSize: '1rem', justifyContent: 'center' }}
                        >
                            {loading ? <Loader2 size={18} className="animate-spin" /> : <Sparkles size={18} />}
                            {loading ? 'ගැටලුව සේවාදායකයේ (Server) විශ්ලේෂණය කරමින්...' : 'ගැටලුව විසඳන්න (Solve Problem)'}
                        </button>
                    </div>

                    {/* Solution Output Container */}
                    {solution && (
                        <div style={{
                            marginTop: '1.75rem', background: 'rgba(9, 13, 22, 0.95)',
                            border: '1px solid rgba(99, 102, 241, 0.4)', borderRadius: '16px',
                            padding: '1.25rem', boxShadow: '0 10px 25px rgba(0,0,0,0.5)'
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', paddingBottom: '0.75rem', borderBottom: '1px solid rgba(255,255,255,0.08)', flexWrap: 'wrap', gap: '0.75rem' }}>
                                <div style={{ fontWeight: 700, color: '#818cf8', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1rem' }}>
                                    <Brain size={20} style={{ color: '#06b6d4' }} /> mathsbook AI විසඳුම:
                                </div>
                                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', width: '100%', smWidth: 'auto' }}>
                                    <button className="btn btn-secondary btn-sm" onClick={copySolution} style={{ flex: '1 1 auto', justifyContent: 'center' }}>
                                        <Copy size={15} /> Copy Solution
                                    </button>
                                    <a 
                                        href={`https://wa.me/${MATHSBOOK_CONFIG.tutor.whatsapp}?text=${encodeURIComponent(`සර්, මට මෙම AI ගණිත ගැටලුව පිළිබඳව පැහැදිලි කිරීමක් අවශ්‍යයි:\n\n${solution.substring(0, 300)}...`)}`}
                                        target="_blank" rel="noreferrer"
                                        className="btn btn-whatsapp btn-sm"
                                        style={{ flex: '1 1 auto', justifyContent: 'center' }}
                                    >
                                        <MessageSquare size={15} /> මිගාර සර්ගෙන් අහන්න
                                    </a>
                                </div>
                            </div>
                            {renderFormattedSolution(solution)}
                        </div>
                    )}

                    {/* Custom GPT Link Card */}
                    <div style={{
                        background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.15) 0%, rgba(99, 102, 241, 0.1) 100%)',
                        border: '1px solid rgba(168, 85, 247, 0.3)', borderRadius: '16px',
                        padding: '1.25rem', marginTop: '1.75rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap'
                    }}>
                        <div>
                            <h4 style={{ fontSize: '1.05rem', marginBottom: '0.25rem', color: '#818cf8' }}>
                                Custom ChatGPT / Gemini Gem
                            </h4>
                            <p style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
                                mathsbook විශේෂිත Custom GPT හෝ Gemini Gem එක භාවිතයෙන් කෙලින්ම Chat කිරීම සඳහා:
                            </p>
                        </div>
                        <a href="https://chatgpt.com/" target="_blank" rel="noreferrer" className="btn btn-secondary btn-sm" style={{ flexShrink: 0 }}>
                            <ExternalLink size={16} /> Open GPT Launch Guide
                        </a>
                    </div>

                </div>
            </div>
        </section>
    );
}
