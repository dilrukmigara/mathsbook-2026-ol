import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import VisionMission from './components/VisionMission';
import CourseCards from './components/CourseCards';
import AiSolver from './components/AiSolver';
import EnrollmentForm from './components/EnrollmentForm';
import ReceiptModal from './components/ReceiptModal';
import Footer from './components/Footer';
import FloatingWhatsapp from './components/FloatingWhatsapp';
import './App.css';

export default function App() {
    const [receiptData, setReceiptData] = useState(null);

    // Floating background math symbols generator
    const [mathSymbols, setMathSymbols] = useState([]);

    useEffect(() => {
        const symbolsList = ['∑', '∫', 'π', '√x', 'sin θ', 'lim', 'f(x)', '∆', '∞', 'tan θ', 'd/dx', 'A⁺'];
        const generated = Array.from({ length: 18 }).map((_, i) => ({
            id: i,
            symbol: symbolsList[Math.floor(Math.random() * symbolsList.length)],
            left: `${Math.random() * 95}%`,
            top: `${Math.random() * 95}%`,
            duration: `${8 + Math.random() * 10}s`,
            delay: `${Math.random() * 5}s`,
            fontSize: `${1.5 + Math.random() * 2}rem`
        }));
        setMathSymbols(generated);
    }, []);

    const handleSelectCourse = (courseVal) => {
        const enrollSection = document.getElementById('enroll');
        if (enrollSection) {
            enrollSection.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <div style={{ position: 'relative', minHeight: '100vh' }}>
            {/* Background Floating Math Symbols */}
            <div className="bg-math-patterns">
                {mathSymbols.map((s) => (
                    <span 
                        key={s.id} 
                        className="math-symbol"
                        style={{
                            left: s.left,
                            top: s.top,
                            animationDuration: s.duration,
                            animationDelay: s.delay,
                            fontSize: s.fontSize
                        }}
                    >
                        {s.symbol}
                    </span>
                ))}
            </div>

            {/* Application Layout */}
            <Navbar />
            <Hero />
            <VisionMission />
            <CourseCards onSelectCourse={handleSelectCourse} />
            <AiSolver />
            <EnrollmentForm onShowReceipt={(data) => setReceiptData(data)} />
            <Footer />
            <FloatingWhatsapp />

            {/* Receipt Modal */}
            {receiptData && (
                <ReceiptModal data={receiptData} onClose={() => setReceiptData(null)} />
            )}
        </div>
    );
}
