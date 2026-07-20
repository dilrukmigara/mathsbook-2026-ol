import React from 'react';
import { CheckCircle2, X, MessageSquare } from 'lucide-react';
import { MATHSBOOK_CONFIG } from '../config/mathsbookConfig';

export default function ReceiptModal({ data, onClose }) {
    if (!data) return null;

    const tutorPhone = MATHSBOOK_CONFIG.tutor.whatsapp;
    const waText = encodeURIComponent(
        `*mathsbook පන්ති ලියාපදිංචිය*\n\n` +
        `ලියාපදිංචි අංකය: ${data.id}\n` +
        `නම: ${data.studentName}\n` +
        `දුරකථන: ${data.contactNumber}\n` +
        `WhatsApp: ${data.whatsappNumber}\n` +
        `පාසල: ${data.schoolName}\n` +
        `අවසන් වාර ලකුණු: ${data.lastTermMarks}%\n` +
        `පන්තිය: ${data.course}\n\n` +
        `සර්, මම mathsbook වෙබ් අඩවිය හරහා ලියාපදිංචි වුණා.`
    );

    return (
        <div className="modal-overlay" style={{
            position: 'fixed', inset: 0, background: 'rgba(9, 13, 22, 0.85)',
            backdropFilter: 'blur(12px)', zIndex: 2000, display: 'flex',
            alignItems: 'center', justifyContent: 'center', padding: '1.5rem'
        }}>
            <div className="modal-card" style={{
                background: 'rgba(18, 26, 43, 0.95)', border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '24px', maxWidth: '550px', width: '100%', padding: '2.5rem', position: 'relative'
            }}>
                <button 
                    onClick={onClose}
                    style={{ position: 'absolute', top: '20px', right: '20px', background: 'none', border: 'none', color: '#94a3b8', fontSize: '1.25rem', cursor: 'pointer' }}
                >
                    <X size={24} />
                </button>

                <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                    <div style={{
                        width: '64px', height: '64px', background: 'rgba(16, 185, 129, 0.15)',
                        border: '1px solid rgba(16, 185, 129, 0.4)', color: '#10b981',
                        borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        margin: '0 auto 1rem auto'
                    }}>
                        <CheckCircle2 size={36} />
                    </div>
                    <h2 style={{ fontSize: '1.75rem', marginBottom: '0.25rem' }}>ලියාපදිංචිය සාර්ථකයි!</h2>
                    <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>ඔබේ තොරතුරු mathsbook පන්ති පද්ධතියට ඇතුළත් විය.</p>
                </div>

                <div style={{
                    background: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '16px', padding: '1.25rem', marginBottom: '1.5rem', fontSize: '0.95rem'
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px dashed rgba(255,255,255,0.08)' }}>
                        <span style={{ color: '#94a3b8' }}>ලියාපදිංචි අංකය:</span>
                        <span style={{ fontWeight: 700, color: '#818cf8' }}>{data.id}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px dashed rgba(255,255,255,0.08)' }}>
                        <span style={{ color: '#94a3b8' }}>ශිෂ්‍යයාගේ නම:</span>
                        <span style={{ fontWeight: 600 }}>{data.studentName}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px dashed rgba(255,255,255,0.08)' }}>
                        <span style={{ color: '#94a3b8' }}>දුරකථන අංකය:</span>
                        <span style={{ fontWeight: 600 }}>{data.contactNumber}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px dashed rgba(255,255,255,0.08)' }}>
                        <span style={{ color: '#94a3b8' }}>WhatsApp අංකය:</span>
                        <span style={{ fontWeight: 600 }}>{data.whatsappNumber}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px dashed rgba(255,255,255,0.08)' }}>
                        <span style={{ color: '#94a3b8' }}>පාසල:</span>
                        <span style={{ fontWeight: 600 }}>{data.schoolName}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px dashed rgba(255,255,255,0.08)' }}>
                        <span style={{ color: '#94a3b8' }}>අවසන් වාර ලකුණු:</span>
                        <span style={{ fontWeight: 600 }}>{data.lastTermMarks}%</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0' }}>
                        <span style={{ color: '#94a3b8' }}>තෝරාගත් පන්තිය:</span>
                        <span style={{ fontWeight: 700, color: '#06b6d4' }}>{data.course}</span>
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem' }}>
                    <a 
                        href={`https://wa.me/${tutorPhone}?text=${waText}`} 
                        target="_blank" 
                        rel="noreferrer" 
                        className="btn btn-whatsapp" 
                        style={{ flex: 1 }}
                    >
                        <MessageSquare size={18} /> WhatsApp හරහා තහවුරු කරන්න
                    </a>
                    <button className="btn btn-secondary" onClick={onClose} style={{ flex: 1 }}>
                        වසා දමන්න
                    </button>
                </div>
            </div>
        </div>
    );
}
