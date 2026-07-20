import React, { useState } from 'react';
import { Sparkles, Camera, Type, UploadCloud, X, Key, Brain, Copy, MessageSquare, ExternalLink, Loader2 } from 'lucide-react';
import { MATHSBOOK_CONFIG } from '../config/mathsbookConfig';

export default function AiSolver() {
    const [activeTab, setActiveTab] = useState('image');
    const [selectedImageBase64, setSelectedImageBase64] = useState(null);
    const [selectedImageMime, setSelectedImageMime] = useState(null);
    const [imagePreviewUrl, setImagePreviewUrl] = useState(null);
    const [textQuery, setTextQuery] = useState('');
    const [apiKey, setApiKey] = useState(() => localStorage.getItem('mathsbook_gemini_api_key') || MATHSBOOK_CONFIG.aiSolver.apiKey);
    const [loading, setLoading] = useState(false);
    const [solution, setSolution] = useState(null);

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

    const handleApiKeyChange = () => {
        const inputKey = prompt('ඔබේ Gemini API Key එක මෙතැන ඇතුළත් කරන්න (aistudio.google.com වෙතින් නොමිලේ ලබාගත හැක):', apiKey);
        if (inputKey !== null) {
            const trimmed = inputKey.trim();
            setApiKey(trimmed);
            localStorage.setItem('mathsbook_gemini_api_key', trimmed);
        }
    };

    const handleSolve = async () => {
        if (!apiKey) {
            handleApiKeyChange();
            const storedKey = localStorage.getItem('mathsbook_gemini_api_key');
            if (!storedKey) {
                alert('ගණිත ගැටලුව විසඳීමට Gemini API Key එකක් අවශ්‍ය වේ. (aistudio.google.com වෙතින් නොමිලේ ලබාගත හැක)');
                return;
            }
        }

        const effectiveKey = localStorage.getItem('mathsbook_gemini_api_key') || apiKey;

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

        const systemPrompt = MATHSBOOK_CONFIG.aiSolver.systemPrompt;
        let contentsArray = [];

        if (activeTab === 'image' && selectedImageBase64) {
            contentsArray = [{
                parts: [
                    { text: systemPrompt + "\n\nමෙම ඡායාරූපයේ ඇති ගණිත ගැටලුව පියවරෙන් පියවර පැහැදිලි සිංහලෙන් විසඳා දෙන්න." },
                    {
                        inline_data: {
                            mime_type: selectedImageMime || 'image/jpeg',
                            data: selectedImageBase64
                        }
                    }
                ]
            }];
        } else {
            contentsArray = [{
                parts: [
                    { text: systemPrompt + "\n\nප්‍රශ්නය: " + textQuery.trim() }
                ]
            }];
        }

        const modelName = MATHSBOOK_CONFIG.aiSolver.model;
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${effectiveKey}`;

        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ contents: contentsArray })
            });

            const data = await response.json();

            if (data.error) {
                throw new Error(data.error.message || 'Gemini API දෝෂයක් සිදුවිය.');
            }

            const solText = data.candidates?.[0]?.content?.parts?.[0]?.text;

            if (!solText) {
                throw new Error('විසඳුම ලබාගැනීමට නොහැකි විය. කරුණාකර නැවත උත්සාහ කරන්න.');
            }

            setSolution(solText);
        } catch (err) {
            alert('දෝෂයක් සිදුවිය: ' + err.message);
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
                        <Sparkles size={16} /> Powered by Gemini AI & Custom GPT
                    </span>
                    <h2 className="section-title">mathsbook AI Solver</h2>
                    <p className="section-sub">ඕනෑම ගණිත ගැටලුවක ඡායාරූපයක් (Photo) හෝ ප්‍රශ්නයක් ඇතුළත් කර පියවරෙන් පියවර නිවැරදි විසඳුම ලබාගන්න</p>
                </div>

                <div style={{
                    background: 'linear-gradient(135deg, rgba(26, 31, 56, 0.9) 0%, rgba(15, 23, 42, 0.95) 100%)',
                    border: '1px solid rgba(99, 102, 241, 0.3)',
                    borderRadius: '24px',
                    padding: '2.5rem',
                    boxShadow: '0 0 35px rgba(99, 102, 241, 0.15)'
                }}>
                    {/* Tabs */}
                    <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '0.75rem' }}>
                        <button 
                            className={`btn btn-sm ${activeTab === 'image' ? 'btn-primary' : 'btn-secondary'}`}
                            onClick={() => setActiveTab('image')}
                        >
                            <Camera size={16} /> ඡායාරූපයක් මඟින් (Image Upload)
                        </button>
                        <button 
                            className={`btn btn-sm ${activeTab === 'text' ? 'btn-primary' : 'btn-secondary'}`}
                            onClick={() => setActiveTab('text')}
                        >
                            <Type size={16} /> ප්‍රශ්නය ටයිප් කර (Text Input)
                        </button>
                    </div>

                    {/* Image Tab */}
                    {activeTab === 'image' && (
                        <div>
                            {!imagePreviewUrl ? (
                                <div style={{
                                    border: '2px dashed rgba(99, 102, 241, 0.4)',
                                    borderRadius: '16px',
                                    padding: '2.5rem 1.5rem',
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
                                    <UploadCloud size={48} style={{ color: '#818cf8', marginBottom: '1rem' }} />
                                    <h4 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>ගණිත ගැටලුවේ ඡායාරූපය මෙතැනට Upload කරන්න</h4>
                                    <p style={{ color: '#94a3b8', fontSize: '0.85rem' }}>PNG, JPG, WebP ඡායාරූප සහය දක්වයි</p>
                                </div>
                            ) : (
                                <div style={{ position: 'relative', maxWidth: '350px', margin: '0 auto', borderRadius: '16px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
                                    <img src={imagePreviewUrl} alt="Math preview" style={{ width: '100%', maxHeight: '250px', objectFit: 'contain', background: '#000' }} />
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
                                    color: '#fff', fontSize: '1rem', outline: 'none', fontFamily: 'inherit'
                                }}
                            />
                        </div>
                    )}

                    {/* API Key Bar */}
                    <div style={{
                        marginTop: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        background: 'rgba(15, 23, 42, 0.4)', padding: '0.75rem 1rem', borderRadius: '16px',
                        border: '1px solid rgba(255, 255, 255, 0.05)'
                    }}>
                        <div style={{ fontSize: '0.85rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Key size={16} style={{ color: '#fbbf24' }} />
                            <span><strong>Gemini API Key:</strong> {apiKey ? <span style={{ color: '#10b981' }}>සක්‍රීයයි ✓</span> : <span style={{ color: '#fbbf24' }}>Key එකක් අවශ්‍යයි</span>}</span>
                        </div>
                        <button className="btn btn-secondary btn-sm" onClick={handleApiKeyChange} style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}>
                            Key එක වෙනස් කරන්න
                        </button>
                    </div>

                    {/* Solve Action Button */}
                    <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
                        <button 
                            className="btn btn-primary"
                            onClick={handleSolve}
                            disabled={loading}
                            style={{ width: '100%', maxWidth: '400px', padding: '1rem', fontSize: '1.1rem' }}
                        >
                            {loading ? <Loader2 size={20} className="animate-spin" /> : <Sparkles size={20} />}
                            {loading ? 'ගැටලුව විශ්ලේෂණය කරමින්...' : 'ගැටලුව විසඳන්න (Solve Problem)'}
                        </button>
                    </div>

                    {/* Solution Output Container */}
                    {solution && (
                        <div style={{
                            marginTop: '2rem', background: 'rgba(9, 13, 22, 0.9)',
                            border: '1px solid rgba(99, 102, 241, 0.4)', borderRadius: '16px',
                            padding: '1.75rem', boxShadow: '0 10px 25px rgba(0,0,0,0.5)'
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', paddingBottom: '0.75rem', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                                <div style={{ fontWeight: 700, color: '#818cf8', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <Brain size={20} style={{ color: '#06b6d4' }} /> mathsbook AI විසඳුම:
                                </div>
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                    <button className="btn btn-secondary btn-sm" onClick={copySolution}>
                                        <Copy size={16} /> Copy Solution
                                    </button>
                                    <a 
                                        href={`https://wa.me/${MATHSBOOK_CONFIG.tutor.whatsapp}?text=${encodeURIComponent(`සර්, මට මෙම AI ගණිත ගැටලුව පිළිබඳව පැහැදිලි කිරීමක් අවශ්‍යයි:\n\n${solution.substring(0, 300)}...`)}`}
                                        target="_blank" rel="noreferrer"
                                        className="btn btn-whatsapp btn-sm"
                                    >
                                        <MessageSquare size={16} /> මිගාර සර්ගෙන් අහන්න
                                    </a>
                                </div>
                            </div>
                            <div style={{ fontSize: '0.975rem', lineHeight: 1.7, color: '#f8fafc', whiteSpace: 'pre-wrap' }}>
                                {solution}
                            </div>
                        </div>
                    )}

                    {/* Custom GPT Link Card */}
                    <div style={{
                        background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.15) 0%, rgba(99, 102, 241, 0.1) 100%)',
                        border: '1px solid rgba(168, 85, 247, 0.3)', borderRadius: '16px',
                        padding: '1.5rem', marginTop: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1.5rem', flexWrap: 'wrap'
                    }}>
                        <div>
                            <h4 style={{ fontSize: '1.15rem', marginBottom: '0.35rem', color: '#818cf8' }}>
                                Custom ChatGPT / Gemini Gem
                            </h4>
                            <p style={{ fontSize: '0.875rem', color: '#94a3b8' }}>
                                mathsbook විශේෂිත Custom GPT හෝ Gemini Gem එක භාවිතයෙන් කෙලින්ම Chat කිරීම සඳහා:
                            </p>
                        </div>
                        <a href="https://chatgpt.com/" target="_blank" rel="noreferrer" className="btn btn-secondary">
                            <ExternalLink size={16} /> Open Custom GPT Launch Guide
                        </a>
                    </div>

                </div>
            </div>
        </section>
    );
}
