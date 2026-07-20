import React from 'react';
import { Eye, Target } from 'lucide-react';

export default function VisionMission() {
    return (
        <section id="about" className="section-padding" style={{ background: 'rgba(15, 23, 42, 0.4)' }}>
            <div className="container">
                <div className="section-title-wrap">
                    <span className="section-tag">අපගේ අරමුණ</span>
                    <h2 className="section-title">දැක්ම සහ මෙහෙවර</h2>
                    <p className="section-sub">mathsbook හරහා සෑම දරුවෙකුටම ගණිතය විෂයයේ ඉහළම සාර්ථකත්වය අත්කර දීම</p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
                    {/* Vision Card */}
                    <div style={{
                        background: 'rgba(18, 26, 43, 0.75)',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                        borderRadius: '24px',
                        padding: '2.5rem',
                        position: 'relative',
                        overflow: 'hidden'
                    }}>
                        <div style={{
                            position: 'absolute', top: 0, left: 0, width: '100%', height: '4px',
                            background: 'linear-gradient(90deg, #6366f1, #06b6d4)'
                        }}></div>
                        
                        <div style={{
                            width: '60px', height: '60px', borderRadius: '16px',
                            background: 'rgba(99, 102, 241, 0.15)', border: '1px solid rgba(99, 102, 241, 0.3)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            color: '#818cf8', marginBottom: '1.5rem'
                        }}>
                            <Eye size={30} />
                        </div>
                        
                        <h3 style={{ fontSize: '1.75rem', marginBottom: '1rem' }}>අපගේ දැක්ම (Vision)</h3>
                        <p style={{ color: '#94a3b8', fontSize: '1.05rem', lineHeight: 1.7 }}>
                            "ගණිතය අමාරු විෂයක් නොව ආසාවෙන් හදාරා ඉහළම ප්‍රතිඵල ලබාගත හැකි ප්‍රියතම විෂය බවට පත් කරමින්, සෑම දරුවෙකුගේම සාමාර්ථය <strong style={{ color: '#fff' }}>A මට්ටමට</strong> රැගෙන යාම."
                        </p>
                    </div>

                    {/* Mission Card */}
                    <div style={{
                        background: 'rgba(18, 26, 43, 0.75)',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                        borderRadius: '24px',
                        padding: '2.5rem',
                        position: 'relative',
                        overflow: 'hidden'
                    }}>
                        <div style={{
                            position: 'absolute', top: 0, left: 0, width: '100%', height: '4px',
                            background: 'linear-gradient(90deg, #06b6d4, #fbbf24)'
                        }}></div>

                        <div style={{
                            width: '60px', height: '60px', borderRadius: '16px',
                            background: 'rgba(6, 182, 212, 0.15)', border: '1px solid rgba(6, 182, 212, 0.3)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            color: '#06b6d4', marginBottom: '1.5rem'
                        }}>
                            <Target size={30} />
                        </div>

                        <h3 style={{ fontSize: '1.75rem', marginBottom: '1rem' }}>අපගේ මෙහෙවර (Mission)</h3>
                        <p style={{ color: '#94a3b8', fontSize: '1.05rem', lineHeight: 1.7 }}>
                            "තර්කානුකූල චින්තනය වර්ධනය කරමින්, කෙටි ක්‍රම හා ක්‍රමවත් ප්‍රශ්න පත්‍ර සාකච්ඡාව මඟින් විභාග බිය දුරුකර නිවැරදිම මඟපෙන්වීම සහ කැපවීම තුළින් ඉහළම විභාග ජයග්‍රහණයන් තහවුරු කිරීම."
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
