'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '../src/components/Navbar';
import Hero from '../src/components/Hero';
import VisionMission from '../src/components/VisionMission';
import CourseCards from '../src/components/CourseCards';
import AiSolver from '../src/components/AiSolver';
import EnrollmentForm from '../src/components/EnrollmentForm';
import ReceiptModal from '../src/components/ReceiptModal';
import Footer from '../src/components/Footer';
import FloatingWhatsapp from '../src/components/FloatingWhatsapp';

export default function Home() {
  const [receiptData, setReceiptData] = useState(null);
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

  const handleSelectCourse = () => {
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

      {/* Main Page Layout */}
      <Navbar />
      <Hero />
      <VisionMission />
      <CourseCards onSelectCourse={handleSelectCourse} />
      {/* <AiSolver /> */}
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
