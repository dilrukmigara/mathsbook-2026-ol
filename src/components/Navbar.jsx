import React, { useState, useEffect } from 'react';
import { MessageSquare, Menu, X, BookOpen } from 'lucide-react';
import { MATHSBOOK_CONFIG } from '../config/mathsbookConfig';

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 40) {
                setScrolled(true);
            } else {
                setScrolled(false);
            }
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <nav className={`navbar ${scrolled ? 'scrolled' : ''}`} style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            zIndex: 1000,
            background: scrolled ? 'rgba(9, 13, 22, 0.95)' : 'rgba(15, 23, 42, 0.8)',
            backdropFilter: 'blur(16px)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            boxShadow: scrolled ? '0 10px 30px rgba(0,0,0,0.5)' : 'none',
            transition: 'all 0.35s ease'
        }}>
            <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '80px' }}>
                <a href="#home" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none', color: 'inherit' }}>
                    <div style={{
                        width: '44px',
                        height: '44px',
                        background: 'linear-gradient(135deg, #6366f1 0%, #06b6d4 100%)',
                        borderRadius: '16px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 900,
                        fontSize: '1.5rem',
                        color: '#fff',
                        boxShadow: '0 0 15px rgba(99, 102, 241, 0.5)'
                    }}>M</div>
                    <div>
                        <div className="gradient-text" style={{ fontSize: '1.6rem', fontWeight: 800, fontFamily: 'Outfit, sans-serif' }}>mathsbook</div>
                        <span style={{
                            background: 'rgba(99, 102, 241, 0.15)',
                            color: '#818cf8',
                            border: '1px solid rgba(99, 102, 241, 0.3)',
                            fontSize: '0.75rem',
                            padding: '2px 8px',
                            borderRadius: '999px',
                            fontWeight: 600
                        }}>සිංහල මාධ්‍යය</span>
                    </div>
                </a>

                <ul className="nav-links" style={{
                    display: mobileMenuOpen ? 'flex' : 'flex',
                    flexDirection: mobileMenuOpen ? 'column' : 'row',
                    alignItems: 'center',
                    gap: '2rem',
                    listStyle: 'none'
                }}>
                    <li><a href="#home" style={{ color: '#f8fafc', textDecoration: 'none', fontWeight: 500 }}>මුල් පිටුව</a></li>
                    <li><a href="#about" style={{ color: '#94a3b8', textDecoration: 'none', fontWeight: 500 }}>දැක්ම සහ මෙහෙවර</a></li>
                    <li><a href="#courses" style={{ color: '#94a3b8', textDecoration: 'none', fontWeight: 500 }}>පන්ති වැඩසටහන්</a></li>
                    <li><a href="#ai-solver" style={{ color: '#06b6d4', textDecoration: 'none', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>✨ AI Solver</a></li>
                    <li><a href="#enroll" style={{ color: '#94a3b8', textDecoration: 'none', fontWeight: 500 }}>ලියාපදිංචිය</a></li>
                    <li><a href="#contact" style={{ color: '#94a3b8', textDecoration: 'none', fontWeight: 500 }}>සම්බන්ධ කරගැනීමට</a></li>
                </ul>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <a 
                        href={`https://wa.me/${MATHSBOOK_CONFIG.tutor.whatsapp}`} 
                        target="_blank" 
                        rel="noreferrer" 
                        className="btn btn-whatsapp btn-sm"
                    >
                        <MessageSquare size={16} /> WhatsApp: 077 978 0053
                    </a>
                </div>
            </div>
        </nav>
    );
}
