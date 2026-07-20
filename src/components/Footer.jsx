import React from 'react';
import { Phone, MessageSquare, GraduationCap, Award } from 'lucide-react';
import { MATHSBOOK_CONFIG } from '../config/mathsbookConfig';

export default function Footer() {
    return (
        <footer id="contact" style={{ background: '#05080e', borderTop: '1px solid rgba(255,255,255,0.08)', padding: '60px 0 30px 0', position: 'relative', zIndex: 1 }}>
            <div className="container">
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '3rem', marginBottom: '3rem' }}>
                    
                    {/* Col 1 */}
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                            <div style={{ width: '40px', height: '40px', background: 'linear-gradient(135deg, #6366f1, #06b6d4)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: '1.4rem', color: '#fff' }}>M</div>
                            <div className="gradient-text" style={{ fontSize: '1.5rem', fontWeight: 800 }}>mathsbook</div>
                        </div>
                        <p style={{ color: '#94a3b8', fontSize: '0.95rem', marginBottom: '1.5rem' }}>
                            සිංහල මාධ්‍ය ගණිත පන්තිය. Migara Wickramarachchi (BSc Hons Undergraduate). විශිෂ්ට ප්‍රතිඵලයකට නිවැරදිම මඟපෙන්වීම.
                        </p>
                    </div>

                    {/* Col 2 */}
                    <div>
                        <h4 style={{ fontSize: '1.1rem', marginBottom: '1.25rem' }}>ඉක්මන් පිවිසුම්</h4>
                        <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.9rem' }}>
                            <li><a href="#home" style={{ color: '#94a3b8', textDecoration: 'none' }}>මුල් පිටුව</a></li>
                            <li><a href="#about" style={{ color: '#94a3b8', textDecoration: 'none' }}>දැක්ම සහ මෙහෙවර</a></li>
                            <li><a href="#courses" style={{ color: '#94a3b8', textDecoration: 'none' }}>පන්ති වැඩසටහන්</a></li>
                            <li><a href="#ai-solver" style={{ color: '#06b6d4', textDecoration: 'none', fontWeight: 600 }}>AI Solver</a></li>
                            <li><a href="#enroll" style={{ color: '#94a3b8', textDecoration: 'none' }}>ලියාපදිංචිය</a></li>
                        </ul>
                    </div>

                    {/* Col 3 */}
                    <div>
                        <h4 style={{ fontSize: '1.1rem', marginBottom: '1.25rem' }}>පන්ති මාදිලි</h4>
                        <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.9rem' }}>
                            <li><a href="#courses" style={{ color: '#94a3b8', textDecoration: 'none' }}>Full Paper (65+ Marks)</a></li>
                            <li><a href="#courses" style={{ color: '#94a3b8', textDecoration: 'none' }}>Paper + Revision</a></li>
                            <li><a href="#courses" style={{ color: '#94a3b8', textDecoration: 'none' }}>Target 'C' Pass</a></li>
                        </ul>
                    </div>

                    {/* Col 4 */}
                    <div>
                        <h4 style={{ fontSize: '1.1rem', marginBottom: '1.25rem' }}>සම්බන්ධ වීමට</h4>
                        <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.9rem', color: '#94a3b8' }}>
                            <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <Phone size={16} style={{ color: '#818cf8' }} /> Hotline: 077 978 0053
                            </li>
                            <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <MessageSquare size={16} style={{ color: '#25D366' }} /> WhatsApp: 077 978 0053
                            </li>
                            <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <GraduationCap size={16} style={{ color: '#06b6d4' }} /> Migara Wickramarachchi
                            </li>
                            <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <Award size={16} style={{ color: '#fbbf24' }} /> BSc (Hons) Undergraduate
                            </li>
                        </ul>
                    </div>

                </div>

                <div style={{ textAlign: 'center', paddingTop: '2rem', borderTop: '1px solid rgba(255, 255, 255, 0.05)', color: '#64748b', fontSize: '0.875rem' }}>
                    <p>&copy; 2026 mathsbook. All Rights Reserved. Designed for Migara Wickramarachchi.</p>
                </div>
            </div>
        </footer>
    );
}
