'use client';

import React, { useState } from 'react';
import { Send, AlertTriangle, CheckCircle, ShieldAlert } from 'lucide-react';
import confetti from 'canvas-confetti';
import { MATHSBOOK_CONFIG } from '../config/mathsbookConfig';
import { useLanguage } from '../context/LanguageContext';

export default function EnrollmentForm({ onShowReceipt }) {
    const { t } = useLanguage();
    const [studentName, setStudentName] = useState('');
    const [contactNumber, setContactNumber] = useState('');
    const [whatsappNumber, setWhatsappNumber] = useState('');
    const [schoolName, setSchoolName] = useState('');
    const [lastTermMarks, setLastTermMarks] = useState('');
    const [selectedCourse, setSelectedCourse] = useState('paper_revision');
    const [loading, setLoading] = useState(false);

    const minMarks = MATHSBOOK_CONFIG.paperClassMinMarks;
    const numericMarks = parseFloat(lastTermMarks) || 0;
    const isFullPaperIneligible = selectedCourse === 'full_paper' && numericMarks < minMarks;

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!studentName.trim() || !contactNumber.trim() || !whatsappNumber.trim() || !schoolName.trim() || !lastTermMarks) {
            alert('කරුණාකර සියලුම තොරතුරු නිවැරදිව ඇතුළත් කරන්න.');
            return;
        }

        if (isFullPaperIneligible) {
            alert(`Full Paper Discussion පන්තිය සඳහා ලකුණු ${minMarks} ට වඩා තිබිය යුතුය. කරුණාකර වෙනත් පාඨමාලාවක් තෝරන්න.`);
            return;
        }

        setLoading(true);

        let courseTitleText = "Paper + Revision Class";
        if (selectedCourse === 'full_paper') courseTitleText = "Full Paper Discussion Class";
        if (selectedCourse === 'target_c') courseTitleText = "Target 'C' Pass Class (Base Paper)";

        const enrollmentData = {
            id: 'MB-' + Math.floor(100000 + Math.random() * 900000),
            studentName,
            contactNumber,
            whatsappNumber,
            schoolName,
            lastTermMarks: numericMarks,
            course: courseTitleText,
            timestamp: new Date().toLocaleString()
        };

        // Save locally to localStorage
        const existing = JSON.parse(localStorage.getItem('mathsbook_enrollments') || '[]');
        existing.push(enrollmentData);
        localStorage.setItem('mathsbook_enrollments', JSON.stringify(existing));

        // Submit to Google Form if enabled
        const gfConfig = MATHSBOOK_CONFIG.googleForm;
        if (gfConfig && gfConfig.enabled && gfConfig.actionUrl) {
            const formData = new FormData();
            formData.append(gfConfig.entries.studentName, studentName);
            formData.append(gfConfig.entries.contactNumber, contactNumber);
            formData.append(gfConfig.entries.whatsappNumber, whatsappNumber);
            formData.append(gfConfig.entries.school, schoolName);
            formData.append(gfConfig.entries.lastTermMarks, lastTermMarks);
            formData.append(gfConfig.entries.selectedCourse, courseTitleText);

            fetch(gfConfig.actionUrl, {
                method: 'POST',
                mode: 'no-cors',
                body: formData
            }).catch(err => console.error('Google Form submission error:', err));
        }

        // Trigger Celebration Confetti
        try {
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 }
            });
        } catch (err) {
            // Ignore if canvas-confetti fails
        }

        setLoading(false);
        onShowReceipt(enrollmentData);
    };

    return (
        <section id="enroll" className="section-padding" style={{ background: 'rgba(15, 23, 42, 0.6)', scrollMarginTop: '88px' }}>
            <div className="container">
                <div className="section-title-wrap">
                    <span className="section-tag">mathsbook</span>
                    <h2 className="section-title">{t('enrollTitle')}</h2>
                    <p className="section-sub">{t('enrollSub')}</p>
                </div>

                <div className="form-card-container">
                    
                    {/* Live Google Form Status Bar */}
                    <div style={{
                        background: 'rgba(16, 185, 129, 0.1)',
                        border: '1px solid rgba(16, 185, 129, 0.3)',
                        color: '#6ee7b7',
                        padding: '0.75rem 1rem',
                        borderRadius: '16px',
                        marginBottom: '1.5rem',
                        fontSize: '0.85rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        flexWrap: 'wrap',
                        gap: '0.5rem'
                    }}>
                        <div>
                            <CheckCircle size={16} style={{ display: 'inline', marginRight: '6px' }} />
                            <strong>Google Form Integration:</strong> Google Form Live Submission සක්‍රීයයි ✓
                        </div>
                        <span style={{ fontSize: '0.75rem', background: 'rgba(0,0,0,0.3)', padding: '3px 8px', borderRadius: '4px' }}>Live Sync</span>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="form-grid">
                            
                            {/* Student Name */}
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.925rem', fontWeight: 600 }}>
                                    ශිෂ්‍යයාගේ සම්පූර්ණ නම <span style={{ color: '#ef4444' }}>*</span>
                                </label>
                                <input 
                                    type="text" 
                                    required 
                                    value={studentName} 
                                    onChange={(e) => setStudentName(e.target.value)} 
                                    placeholder="උදා: කසුන් පෙරේරා" 
                                    style={{ width: '100%', padding: '0.9rem 1.15rem', background: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '16px', color: '#fff', outline: 'none' }}
                                />
                            </div>

                            {/* Phone */}
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.925rem', fontWeight: 600 }}>
                                    දුරකථන අංකය <span style={{ color: '#ef4444' }}>*</span>
                                </label>
                                <input 
                                    type="tel" 
                                    required 
                                    pattern="[0-9]{10}"
                                    value={contactNumber} 
                                    onChange={(e) => setContactNumber(e.target.value)} 
                                    placeholder="0771234567" 
                                    style={{ width: '100%', padding: '0.9rem 1.15rem', background: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '16px', color: '#fff', outline: 'none' }}
                                />
                            </div>

                            {/* WhatsApp */}
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.925rem', fontWeight: 600 }}>
                                    WhatsApp අංකය <span style={{ color: '#ef4444' }}>*</span>
                                </label>
                                <input 
                                    type="tel" 
                                    required 
                                    pattern="[0-9]{10}"
                                    value={whatsappNumber} 
                                    onChange={(e) => setWhatsappNumber(e.target.value)} 
                                    placeholder="0771234567" 
                                    style={{ width: '100%', padding: '0.9rem 1.15rem', background: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '16px', color: '#fff', outline: 'none' }}
                                />
                            </div>

                            {/* School */}
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.925rem', fontWeight: 600 }}>
                                    පාසල <span style={{ color: '#ef4444' }}>*</span>
                                </label>
                                <input 
                                    type="text" 
                                    required 
                                    value={schoolName} 
                                    onChange={(e) => setSchoolName(e.target.value)} 
                                    placeholder="උදා: නාලන්දා විද්‍යාලය" 
                                    style={{ width: '100%', padding: '0.9rem 1.15rem', background: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '16px', color: '#fff', outline: 'none' }}
                                />
                            </div>

                            {/* Last Term Marks */}
                            <div style={{ gridColumn: 'span 2' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.925rem', fontWeight: 600 }}>
                                    අවසන් වාර විභාගයේ ගණිතය ලකුණු (100 න්) <span style={{ color: '#ef4444' }}>*</span>
                                </label>
                                <input 
                                    type="number" 
                                    required 
                                    min="0" 
                                    max="100" 
                                    value={lastTermMarks} 
                                    onChange={(e) => setLastTermMarks(e.target.value)} 
                                    placeholder="උදා: 72" 
                                    style={{ width: '100%', padding: '0.9rem 1.15rem', background: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '16px', color: '#fff', outline: 'none' }}
                                />
                            </div>

                            {/* Course Selection */}
                            <div style={{ gridColumn: 'span 2' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.925rem', fontWeight: 600 }}>
                                    ඔබට අවශ්‍ය පන්ති මාදිලිය තෝරන්න <span style={{ color: '#ef4444' }}>*</span>
                                </label>

                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginTop: '0.5rem' }}>
                                    
                                    {/* Full Paper Option */}
                                    <label style={{
                                        background: selectedCourse === 'full_paper' ? 'rgba(99, 102, 241, 0.15)' : 'rgba(15, 23, 42, 0.5)',
                                        border: selectedCourse === 'full_paper' ? '2px solid #6366f1' : '1px solid rgba(255,255,255,0.1)',
                                        borderRadius: '16px', padding: '1.25rem', cursor: 'pointer', display: 'flex', flexDirection: 'column', justifyContent: 'space-between'
                                    }}>
                                        <input 
                                            type="radio" 
                                            name="courseSelect" 
                                            value="full_paper" 
                                            checked={selectedCourse === 'full_paper'} 
                                            onChange={() => setSelectedCourse('full_paper')} 
                                            style={{ display: 'none' }} 
                                        />
                                        <div>
                                            <div style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '0.35rem' }}>1. Full Paper Discussion</div>
                                            <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>සම්පූර්ණ ප්‍රශ්න පත්‍ර සාකච්ඡාව</div>
                                        </div>
                                        <span style={{ marginTop: '0.75rem', fontSize: '0.725rem', fontWeight: 700, padding: '2px 8px', borderRadius: '999px', background: 'rgba(239, 68, 68, 0.15)', color: '#fca5a5', display: 'inline-block' }}>
                                            ලකුණු 65+ තිබිය යුතුය
                                        </span>
                                    </label>

                                    {/* Paper + Revision Option */}
                                    <label style={{
                                        background: selectedCourse === 'paper_revision' ? 'rgba(99, 102, 241, 0.15)' : 'rgba(15, 23, 42, 0.5)',
                                        border: selectedCourse === 'paper_revision' ? '2px solid #6366f1' : '1px solid rgba(255,255,255,0.1)',
                                        borderRadius: '16px', padding: '1.25rem', cursor: 'pointer', display: 'flex', flexDirection: 'column', justifyContent: 'space-between'
                                    }}>
                                        <input 
                                            type="radio" 
                                            name="courseSelect" 
                                            value="paper_revision" 
                                            checked={selectedCourse === 'paper_revision'} 
                                            onChange={() => setSelectedCourse('paper_revision')} 
                                            style={{ display: 'none' }} 
                                        />
                                        <div>
                                            <div style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '0.35rem' }}>2. Paper + Revision Class</div>
                                            <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>ප්‍රශ්න පත්‍ර + රිවිෂන් පන්තිය</div>
                                        </div>
                                        <span style={{ marginTop: '0.75rem', fontSize: '0.725rem', fontWeight: 700, padding: '2px 8px', borderRadius: '999px', background: 'rgba(16, 185, 129, 0.15)', color: '#6ee7b7', display: 'inline-block' }}>
                                            සියලු දෙනාටම
                                        </span>
                                    </label>

                                    {/* Target C Pass Option */}
                                    <label style={{
                                        background: selectedCourse === 'target_c' ? 'rgba(99, 102, 241, 0.15)' : 'rgba(15, 23, 42, 0.5)',
                                        border: selectedCourse === 'target_c' ? '2px solid #6366f1' : '1px solid rgba(255,255,255,0.1)',
                                        borderRadius: '16px', padding: '1.25rem', cursor: 'pointer', display: 'flex', flexDirection: 'column', justifyContent: 'space-between'
                                    }}>
                                        <input 
                                            type="radio" 
                                            name="courseSelect" 
                                            value="target_c" 
                                            checked={selectedCourse === 'target_c'} 
                                            onChange={() => setSelectedCourse('target_c')} 
                                            style={{ display: 'none' }} 
                                        />
                                        <div>
                                            <div style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '0.35rem' }}>3. Target 'C' Pass Class</div>
                                            <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>C සාමාර්ථය සඳහා Base Paper</div>
                                        </div>
                                        <span style={{ marginTop: '0.75rem', fontSize: '0.725rem', fontWeight: 700, padding: '2px 8px', borderRadius: '999px', background: 'rgba(245, 158, 11, 0.15)', color: '#fde047', display: 'inline-block' }}>
                                            C සාමාර්ථය ඉලක්ක සිසුන්
                                        </span>
                                    </label>

                                </div>
                            </div>

                            {/* Mark Validation Notice */}
                            {selectedCourse === 'full_paper' && (
                                <div style={{
                                    gridColumn: 'span 2',
                                    padding: '1rem 1.25rem', borderRadius: '16px',
                                    display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.9rem',
                                    background: isFullPaperIneligible ? 'rgba(239, 68, 68, 0.12)' : 'rgba(16, 185, 129, 0.12)',
                                    border: isFullPaperIneligible ? '1px solid rgba(239, 68, 68, 0.35)' : '1px solid rgba(16, 185, 129, 0.35)',
                                    color: isFullPaperIneligible ? '#fca5a5' : '#6ee7b7'
                                }}>
                                    {isFullPaperIneligible ? <AlertTriangle size={24} style={{ flexShrink: 0 }} /> : <CheckCircle size={24} style={{ flexShrink: 0 }} />}
                                    <div>
                                        {isFullPaperIneligible ? (
                                            <span><strong>අවධානයයි:</strong> සම්පූර්ණ ප්‍රශ්න පත්‍ර සාකච්ඡා පන්තිය (Full Paper Class) සඳහා සම්බන්ධ වීමට අවසන් වාරයේ ලකුණු <strong>{minMarks}</strong> කට වඩා තිබිය යුතුය. (ඔබ ඇතුළත් කළ ලකුණු: {numericMarks})</span>
                                        ) : (
                                            <span><strong>සුදුසුකම් සහිතයි!</strong> ඔබේ ලකුණු {numericMarks}% ක් වන බැවින් Full Paper Discussion පන්තිය සඳහා ලියාපදිංචි විය හැක.</span>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Submit Button */}
                            <div style={{ gridColumn: 'span 2', marginTop: '1rem' }}>
                                <button 
                                    type="submit" 
                                    disabled={loading || isFullPaperIneligible}
                                    className="btn btn-primary" 
                                    style={{
                                        width: '100%', padding: '1.1rem', fontSize: '1.1rem',
                                        opacity: (loading || isFullPaperIneligible) ? 0.5 : 1,
                                        cursor: (loading || isFullPaperIneligible) ? 'not-allowed' : 'pointer'
                                    }}
                                >
                                    <Send size={20} /> {loading ? 'ලියාපදිංචි වෙමින්...' : 'ලියාපදිංචිය තහවුරු කරන්න'}
                                </button>
                            </div>

                        </div>
                    </form>
                </div>
            </div>
        </section>
    );
}
