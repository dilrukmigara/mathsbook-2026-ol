'use client';

import React, { useState } from 'react';
import { Send } from 'lucide-react';
import confetti from 'canvas-confetti';
import { MATHSBOOK_CONFIG } from '../config/mathsbookConfig';
import { useLanguage } from '../context/LanguageContext';

export default function EnrollmentForm({ onShowReceipt, selectedCourseId, onCourseChange }) {
    const { language } = useLanguage();
    const en = language === 'en';
    const [error, setError] = useState('');
    const [studentName, setStudentName] = useState('');
    const [contactNumber, setContactNumber] = useState('');
    const [whatsappNumber, setWhatsappNumber] = useState('');
    const [schoolName, setSchoolName] = useState('');
    const [lastTermMarks, setLastTermMarks] = useState('');
    const [internalCourse, setInternalCourse] = useState('paper_revision');
    const selectedCourse = selectedCourseId ?? internalCourse;
    const setSelectedCourse = onCourseChange ?? setInternalCourse;
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

        setError('');
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

        // Save to Supabase (with automatic local backup)
        try {
            const response = await fetch('/api/enroll', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(enrollmentData)
            });
            const result = await response.json();
            if (!response.ok || !result.success) throw new Error(result.error || 'Registration failed. Please try again.');
        } catch (apiErr) {
            setError(en ? 'We could not save your registration. Please try again or contact us.' : 'ලියාපදිංචිය සුරැකීමට නොහැකි වුණා. නැවත උත්සාහ කරන්න හෝ අප අමතන්න.');
            setLoading(false);
            return;
        }

        // Save locally to localStorage
        let existing = [];
        try { existing = JSON.parse(localStorage.getItem('mathsbook_enrollments') || '[]'); } catch {}
        if (!Array.isArray(existing)) existing = [];
        existing.push(enrollmentData);
        try { localStorage.setItem('mathsbook_enrollments', JSON.stringify(existing)); } catch {}

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

    return <section id="enroll" className="mb-enroll-wrap"><div className="mb-shell mb-enroll-layout">
      <div className="mb-enroll-intro"><span className="mb-eyebrow">YOUR JOURNEY STARTS HERE</span><h2>{en ? 'A fresh start.' : 'හොඳ ආරම්භයක්.'}<br/><span>{en ? 'A stronger you.' : 'විශ්වාසයෙන් ඉදිරියට.'}</span></h2><p>{en ? 'Choose your class and leave your details. Let’s take the next step in maths together.' : 'ඔබේ පන්තිය තෝරා තොරතුරු ඇතුළත් කරන්න. අපි එක්ව ගණිතයට ඊළඟ පියවර තබමු.'}</p><div className="mb-enroll-steps">{(en ? ['Choose your learning path','Complete your registration','Keep your registration receipt'] : ['ඔබේ පන්තිය තෝරන්න','ලියාපදිංචිය සම්පූර්ණ කරන්න','ලියාපදිංචි රිසිට්පත ලබාගන්න']).map((step,i)=><div key={step}><span>{i+1}</span>{step}</div>)}</div></div>
      <form className="mb-enroll-form" onSubmit={handleSubmit}><div className="mb-form-title"><span className="mb-icon"><Send size={21}/></span><div><h3>{en ? 'Join Mathsbook' : 'Mathsbook සමඟ එක්වෙන්න'}</h3><p>{en ? 'All fields are required.' : 'සියලුම තොරතුරු සම්පූර්ණ කරන්න.'}</p></div></div><div className="mb-form-grid">
      {[
        {id:'student-name',label:en?'Full name':'ශිෂ්‍යයාගේ සම්පූර්ණ නම',value:studentName,set:setStudentName,type:'text',auto:'name',placeholder:en?'Your full name':'ඔබේ සම්පූර්ණ නම'},
        {id:'school-name',label:en?'School':'පාසල',value:schoolName,set:setSchoolName,type:'text',placeholder:en?'Your school':'ඔබේ පාසල'},
        {id:'contact-number',label:en?'Phone number':'දුරකථන අංකය',value:contactNumber,set:setContactNumber,type:'tel',auto:'tel',placeholder:'07XXXXXXXX'},
        {id:'whatsapp-number',label:en?'WhatsApp number':'WhatsApp අංකය',value:whatsappNumber,set:setWhatsappNumber,type:'tel',placeholder:'07XXXXXXXX'}
      ].map(f=><div className="mb-field" key={f.id}><label htmlFor={f.id}>{f.label}</label><input id={f.id} type={f.type} autoComplete={f.auto} required pattern={f.type==='tel'?'[0-9]{10}':undefined} placeholder={f.placeholder} value={f.value} onChange={e=>f.set(e.target.value)}/></div>)}
      <div className="mb-field"><label htmlFor="last-marks">{en?'Last term marks (out of 100)':'අවසන් වාරයේ ලකුණු (100 න්)'}</label><input id="last-marks" type="number" min="0" max="100" required placeholder="72" value={lastTermMarks} onChange={e=>setLastTermMarks(e.target.value)}/></div>
      <div className="mb-field"><label htmlFor="chosen-course">{en?'Your class':'ඔබේ පන්තිය'}</label><select id="chosen-course" value={selectedCourse} onChange={e=>setSelectedCourse(e.target.value)}><option value="full_paper">Full Paper Discussion · 65+</option><option value="paper_revision">Paper + Revision</option><option value="target_c">Target C Pass</option></select></div></div>
      {isFullPaperIneligible&&<p className="mb-form-error" role="status">{en?'Full Paper Discussion requires at least 65 marks. Please choose another class if your marks are lower.':'Full Paper Discussion සඳහා අවම ලකුණු 65ක් අවශ්‍යයි. ලකුණු අඩු නම් වෙනත් පන්තියක් තෝරන්න.'}</p>}
      {error&&<p className="mb-form-error" role="alert">{error}</p>}
      <button className="mb-button mb-button-blue mb-submit" type="submit" disabled={loading||isFullPaperIneligible}>{loading?(en?'Registering…':'ලියාපදිංචි වෙමින්…'):(en?'Complete registration':'ලියාපදිංචිය තහවුරු කරන්න')}<Send size={17}/></button>
      </form></div></section>;
}
