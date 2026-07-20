import React from 'react';
import { UserCheck, MessageSquare, Phone, BookOpen, GraduationCap, ArrowRight } from 'lucide-react';
import { MATHSBOOK_CONFIG } from '../config/mathsbookConfig';

export default function Hero() {
    return (
        <section id="home" style={{ paddingTop: '150px', paddingBottom: '90px', position: 'relative', zIndex: 1 }}>
            <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '3.5rem', alignItems: 'center' }}>
                
                {/* Left Column Text Content */}
                <div>
                    <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.6rem',
                        background: 'rgba(99, 102, 241, 0.1)',
                        border: '1px solid rgba(99, 102, 241, 0.3)',
                        padding: '0.5rem 1.25rem',
                        borderRadius: '999px',
                        marginBottom: '1.5rem'
                    }}>
                        <span style={{ width: '8px', height: '8px', background: '#10b981', borderRadius: '50%', boxShadow: '0 0 10px #10b981' }}></span>
                        <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#818cf8' }}>
                            2026 / 2027 ශිෂ්‍ය කණ්ඩායම් සඳහා ලියාපදිංචිය ඇරඹුණා
                        </span>
                    </div>

                    <h1 style={{ fontSize: '3.25rem', lineHeight: 1.15, marginBottom: '1.25rem', letterSpacing: '-0.5px' }}>
                        ගණිතයට <span className="gradient-text-gold">විශිෂ්ට A සාමාර්ථයකට</span> පාර කියන - <span className="gradient-text">mathsbook</span>
                    </h1>

                    <p style={{ fontSize: '1.15rem', color: '#94a3b8', marginBottom: '2rem', maxWidth: '600px' }}>
                        තර්කානුකූල සිද්ධාන්ත, ක්‍රමවත් ප්‍රශ්න පත්‍ර සාකච්ඡාව සහ විශේෂිත කෙටි ක්‍රම මඟින් ගණිතය විෂයට ඉහළම ලකුණු තහවුරු කෙරෙන විශ්වාසනීය සිංහල මාධ්‍ය ගණිත පන්තිය.
                    </p>

                    <div style={{ display: 'flex', gap: '1.25rem', flexWrap: 'wrap', marginBottom: '2.5rem' }}>
                        <a href="#enroll" className="btn btn-primary">
                            <UserCheck size={18} /> දැන්ම ලියාපදිංචි වන්න
                        </a>
                        <a href={`https://wa.me/${MATHSBOOK_CONFIG.tutor.whatsapp}`} target="_blank" rel="noreferrer" className="btn btn-whatsapp">
                            <MessageSquare size={18} /> WhatsApp විමසීම්
                        </a>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', paddingTop: '2rem', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                        <div>
                            <h4 style={{ fontSize: '1.85rem', color: '#818cf8', fontFamily: 'Outfit, sans-serif', fontWeight: 800 }}>100%</h4>
                            <p style={{ fontSize: '0.85rem', color: '#94a3b8' }}>සිංහල මාධ්‍යය</p>
                        </div>
                        <div>
                            <h4 style={{ fontSize: '1.85rem', color: '#818cf8', fontFamily: 'Outfit, sans-serif', fontWeight: 800 }}>3 Types</h4>
                            <p style={{ fontSize: '0.85rem', color: '#94a3b8' }}>විශේෂිත පන්ති 3ක්</p>
                        </div>
                        <div>
                            <h4 style={{ fontSize: '1.85rem', color: '#818cf8', fontFamily: 'Outfit, sans-serif', fontWeight: 800 }}>65+</h4>
                            <p style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Paper Class සුදුසුකම්</p>
                        </div>
                    </div>
                </div>

                {/* Right Column Tutor Card */}
                <div style={{ position: 'relative' }}>
                    <div style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: '100%',
                        height: '100%',
                        background: 'radial-gradient(circle, rgba(99, 102, 241, 0.35) 0%, rgba(6, 182, 212, 0.15) 50%, transparent 70%)',
                        filter: 'blur(40px)',
                        zIndex: 0
                    }}></div>

                    <div style={{
                        position: 'relative',
                        zIndex: 1,
                        background: 'rgba(18, 26, 43, 0.85)',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                        borderRadius: '24px',
                        padding: '1.75rem',
                        backdropFilter: 'blur(20px)',
                        boxShadow: '0 10px 30px -5px rgba(0,0,0,0.5)'
                    }}>
                        <div style={{
                            position: 'relative',
                            width: '100%',
                            aspectRatio: '4/4.5',
                            borderRadius: '16px',
                            overflow: 'hidden',
                            marginBottom: '1.5rem',
                            border: '2px solid rgba(255, 255, 255, 0.1)',
                            background: '#000'
                        }}>
                            <img 
                                src="/images/migara.png" 
                                alt={MATHSBOOK_CONFIG.tutor.name} 
                                style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top center' }} 
                            />
                            
                            <div style={{
                                position: 'absolute',
                                bottom: '15px',
                                left: '15px',
                                right: '15px',
                                background: 'rgba(15, 23, 42, 0.85)',
                                backdropFilter: 'blur(12px)',
                                border: '1px solid rgba(255, 255, 255, 0.15)',
                                padding: '0.75rem 1rem',
                                borderRadius: '16px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.75rem'
                            }}>
                                <div style={{
                                    width: '36px',
                                    height: '36px',
                                    background: 'rgba(99, 102, 241, 0.2)',
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: '#818cf8'
                                }}>
                                    <GraduationCap size={20} />
                                </div>
                                <div>
                                    <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>ගණිත උපදේශක</div>
                                    <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{MATHSBOOK_CONFIG.tutor.name}</div>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h3 style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>{MATHSBOOK_CONFIG.tutor.nameSinhala}</h3>
                            <div style={{ color: '#06b6d4', fontWeight: 600, fontSize: '0.95rem', marginBottom: '1rem' }}>
                                {MATHSBOOK_CONFIG.tutor.qualification}
                            </div>

                            <div style={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '0.6rem',
                                background: 'rgba(255, 255, 255, 0.03)',
                                padding: '1rem',
                                borderRadius: '16px',
                                border: '1px solid rgba(255, 255, 255, 0.05)'
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.9rem', color: '#94a3b8' }}>
                                    <Phone size={16} style={{ color: '#818cf8' }} />
                                    <span>Hotline: <a href={`tel:${MATHSBOOK_CONFIG.tutor.phone}`} style={{ color: '#fff', textDecoration: 'none', fontWeight: 600 }}>077 978 0053</a></span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.9rem', color: '#94a3b8' }}>
                                    <MessageSquare size={16} style={{ color: '#25D366' }} />
                                    <span>WhatsApp: <a href={`https://wa.me/${MATHSBOOK_CONFIG.tutor.whatsapp}`} target="_blank" rel="noreferrer" style={{ color: '#fff', textDecoration: 'none', fontWeight: 600 }}>077 978 0053</a></span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.9rem', color: '#94a3b8' }}>
                                    <BookOpen size={16} style={{ color: '#fbbf24' }} />
                                    <span>Medium: {MATHSBOOK_CONFIG.tutor.medium}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </section>
    );
}
