'use client';

import React, { useState, useEffect, useRef } from 'react';
import Navbar from '../../src/components/Navbar';
import Footer from '../../src/components/Footer';
import FloatingWhatsapp from '../../src/components/FloatingWhatsapp';
import { LanguageProvider } from '../../src/context/LanguageContext';
import { 
  ShieldCheck, Search, Users, CheckSquare, Save, Lock, AlertCircle, 
  RefreshCw, FileText, Upload, FolderPlus, Trash2, Edit3, ExternalLink, 
  Plus, CheckCircle2, Download, BookOpen, Layers, X, Eye, Filter,
  FileSpreadsheet, Clock, Check, Send
} from 'lucide-react';

function AdminContent() {
    // Auth gate
    const [phoneInput, setPhoneInput] = useState('');
    const [passwordInput, setPasswordInput] = useState('');
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [authError, setAuthError] = useState('');
    
    // Active admin view: 'exams' | 'papers' | 'students' | 'videos'
    const [activeTab, setActiveTab] = useState('exams');

    // ==========================================
    // Online MCQ Exams Management State
    // ==========================================
    const [examPapers, setExamPapers] = useState([]);
    const [loadingExams, setLoadingExams] = useState(false);
    const [examMessage, setExamMessage] = useState('');
    const [examError, setExamError] = useState('');

    // Create Paper Modal & CSV Upload State
    const [showCreateExamModal, setShowCreateExamModal] = useState(false);
    const [newPaperTitle, setNewPaperTitle] = useState('');
    const [newPaperNumber, setNewPaperNumber] = useState('');
    const [newPaperGrade, setNewPaperGrade] = useState('grade_11');
    const [newPaperDuration, setNewPaperDuration] = useState('45');
    const [newPaperDesc, setNewPaperDesc] = useState('');
    const [csvInputText, setCsvInputText] = useState('');
    const [csvFileName, setCsvFileName] = useState('');
    const [csvValidationResult, setCsvValidationResult] = useState(null);
    const [validatingCsv, setValidatingCsv] = useState(false);
    const [publishingPaper, setPublishingPaper] = useState(false);
    const csvFileInputRef = useRef(null);

    // View Paper Questions Modal
    const [viewingExamPaper, setViewingExamPaper] = useState(null);
    const [loadingPaperQuestions, setLoadingPaperQuestions] = useState(false);

    // ==========================================
    // Free Papers Management State
    // ==========================================
    const [papers, setPapers] = useState([]);
    const [topics, setTopics] = useState([]);
    const [papersLoading, setPapersLoading] = useState(false);
    const [paperFeedbackMsg, setPaperFeedbackMsg] = useState('');
    const [paperFeedbackError, setPaperFeedbackError] = useState('');

    const [paperGradeFilter, setPaperGradeFilter] = useState('all');
    const [paperTopicFilter, setPaperTopicFilter] = useState('all');
    const [paperSearchQuery, setPaperSearchQuery] = useState('');

    const [showUploadModal, setShowUploadModal] = useState(false);
    const [showTopicModal, setShowTopicModal] = useState(false);
    const [editingPaper, setEditingPaper] = useState(null);

    const [uploadFile, setUploadFile] = useState(null);
    const [uploadTitle, setUploadTitle] = useState('');
    const [uploadGrade, setUploadGrade] = useState('grade_10');
    const [uploadTopicId, setUploadTopicId] = useState('');
    const [uploadYear, setUploadYear] = useState('2026');
    const [uploadTerm, setUploadTerm] = useState('Model Paper');
    const [uploadLoading, setUploadLoading] = useState(false);
    const [uploadModalError, setUploadModalError] = useState('');
    const fileInputRef = useRef(null);

    const [newTopicName, setNewTopicName] = useState('');
    const [newTopicGrade, setNewTopicGrade] = useState('grade_10');
    const [newTopicDesc, setNewTopicDesc] = useState('');
    const [topicLoading, setTopicLoading] = useState(false);
    const [topicModalError, setTopicModalError] = useState('');

    // ==========================================
    // Students & Videos State
    // ==========================================
    const [students, setStudents] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const [actionLoading, setActionLoading] = useState(null);
    const [message, setMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const [videoLessons, setVideoLessons] = useState([]);
    const [videoInputs, setVideoInputs] = useState({});
    const [videoLoading, setVideoLoading] = useState(false);
    const [videoSavingId, setVideoSavingId] = useState(null);
    const [videoMessage, setVideoMessage] = useState('');
    const [videoError, setVideoError] = useState('');

    const ADMIN_CREDENTIALS = {
        phone: '0715747680',
        password: 'supermigara',
        role: 'admin'
    };

    const availableCourses = [
        { key: 'grade_10', label: 'Grade 10' },
        { key: 'grade_11', label: 'Grade 11' },
        { key: 'speed_revision', label: 'Speed Revision' },
        { key: 'paper_theory', label: 'Paper Theory' },
        { key: 'free_paper', label: 'Free Paper (Free for all)', locked: true }
    ];

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const session = sessionStorage.getItem('mathsbook_admin_session');
            if (session) {
                const parsed = JSON.parse(session);
                if (parsed?.role === 'admin') {
                    setIsAuthenticated(true);
                    fetchExamPapers();
                    fetchPapersAndTopics();
                    fetchStudents();
                    fetchVideoLessons();
                }
            }
        }
    }, []);

    const handleAuthSubmit = (e) => {
        e.preventDefault();
        if (phoneInput.trim() === ADMIN_CREDENTIALS.phone && passwordInput.trim() === ADMIN_CREDENTIALS.password) {
            setIsAuthenticated(true);
            setAuthError('');
            if (typeof window !== 'undefined') {
                sessionStorage.setItem('mathsbook_admin_session', JSON.stringify(ADMIN_CREDENTIALS));
            }
            fetchExamPapers();
            fetchPapersAndTopics();
            fetchStudents();
            fetchVideoLessons();
        } else {
            setAuthError('Phone number or password is incorrect. Please try again.');
        }
    };

    const handleAdminLogout = () => {
        setIsAuthenticated(false);
        if (typeof window !== 'undefined') {
            sessionStorage.removeItem('mathsbook_admin_session');
        }
        setPhoneInput('');
        setPasswordInput('');
        setExamPapers([]);
        setPapers([]);
        setTopics([]);
        setStudents([]);
        setVideoLessons([]);
    };

    // =========================================================================
    // EXAM PAPERS MANAGEMENT FUNCTIONS
    // =========================================================================
    const fetchExamPapers = async () => {
        setLoadingExams(true);
        setExamError('');
        try {
            const res = await fetch('/api/admin/exams');
            const data = await res.json();
            if (res.ok && data.success) {
                setExamPapers(data.papers || []);
            } else {
                setExamError(data.error || 'Failed to fetch exam papers.');
            }
        } catch (err) {
            setExamError('Error loading exams: ' + err.message);
        } finally {
            setLoadingExams(false);
        }
    };

    // CSV File Selection
    const handleCsvFileSelect = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setCsvFileName(file.name);
        const reader = new FileReader();
        reader.onload = (event) => {
            const text = event.target.result;
            setCsvInputText(text);
            validateCsvContent(text);
        };
        reader.readAsText(file);
    };

    // Validate CSV Content
    const validateCsvContent = async (textToValidate) => {
        const text = textToValidate || csvInputText;
        if (!text.trim()) {
            setCsvValidationResult({ valid: false, errors: ['CSV content is empty.'], questions: [] });
            return;
        }

        setValidatingCsv(true);
        try {
            const res = await fetch('/api/admin/exams', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'validate_csv', csvText: text })
            });
            const data = await res.json();
            if (res.ok && data.success) {
                setCsvValidationResult(data);
            } else {
                setCsvValidationResult({ valid: false, errors: [data.error || 'CSV validation failed'], questions: [] });
            }
        } catch (err) {
            setCsvValidationResult({ valid: false, errors: ['Error: ' + err.message], questions: [] });
        } finally {
            setValidatingCsv(false);
        }
    };

    // Download Sample CSV Template
    const handleDownloadSampleCsv = () => {
        const sampleCsv = `Question,Answer A,Answer B,Answer C,Answer D,Answer,Explanation
"2x + 5 = 15 නම් x හි අගය කීයද?","3","5","7","10","B","2x = 10 බැවින් x = 5 වේ."
"අරය 7 cm වන වෘත්තයක පරිධිය සොයන්න (π = 22/7).","22 cm","44 cm","88 cm","154 cm","B","C = 2πr සූත්‍රයෙන් C = 2 * (22/7) * 7 = 44 cm."
"x² - 9 හි සාධක මොනවාද?","(x - 3)(x - 3)","(x + 3)(x + 3)","(x - 3)(x + 3)","(x - 9)(x + 1)","C","වර්ග දෙකක අන්තරය: a² - b² = (a-b)(a+b)."
"සමපාද ත්‍රිකෝණයක එක් කෝණයක අගය කීයද?","45°","60°","90°","180°","B","සමපාද ත්‍රිකෝණයක කෝණ තුනම සමාන වන අතර 180° / 3 = 60° වේ."`;
        
        const blob = new Blob([sampleCsv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'mathsbook_mcq_sample_template.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    // Publish Exam Paper
    const handlePublishExamPaper = async (e) => {
        e.preventDefault();
        if (!newPaperTitle.trim()) {
            alert('Please provide a title for the paper (e.g. Paper 3 - Mathematics Model Paper).');
            return;
        }

        if (!csvValidationResult || !csvValidationResult.valid || csvValidationResult.questions.length === 0) {
            alert('Please upload a valid CSV file with at least 1 question before publishing.');
            return;
        }

        setPublishingPaper(true);
        try {
            const res = await fetch('/api/admin/exams', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'publish_paper',
                    title: newPaperTitle.trim(),
                    paperNumber: newPaperNumber || (examPapers.length + 1),
                    grade: newPaperGrade,
                    durationMinutes: parseInt(newPaperDuration) || 45,
                    description: newPaperDesc.trim(),
                    questions: csvValidationResult.questions
                })
            });
            const data = await res.json();

            if (res.ok && data.success) {
                setExamPapers(prev => [...prev, data.paper]);
                setShowCreateExamModal(false);
                setNewPaperTitle('');
                setNewPaperNumber('');
                setNewPaperDesc('');
                setCsvInputText('');
                setCsvFileName('');
                setCsvValidationResult(null);
                setExamMessage(data.message || 'Paper published successfully!');
                setTimeout(() => setExamMessage(''), 4000);
            } else {
                alert(data.error || 'Failed to publish paper.');
            }
        } catch (err) {
            alert('Error publishing paper: ' + err.message);
        } finally {
            setPublishingPaper(false);
        }
    };

    // View Paper Questions
    const handleViewPaperQuestions = async (paper) => {
        setLoadingPaperQuestions(true);
        try {
            const res = await fetch(`/api/exams?id=${paper.id}`);
            const data = await res.json();
            if (res.ok && data.success) {
                setViewingExamPaper(data.paper);
            } else {
                alert(data.error || 'Failed to load questions.');
            }
        } catch (err) {
            alert('Error loading questions: ' + err.message);
        } finally {
            setLoadingPaperQuestions(false);
        }
    };

    // Delete Paper
    const handleDeleteExamPaper = async (paperId, paperTitle) => {
        if (!confirm(`Are you sure you want to delete "${paperTitle}"? All questions under this paper will be deleted permanently.`)) {
            return;
        }

        try {
            const res = await fetch('/api/admin/exams', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'delete_paper', paperId })
            });
            const data = await res.json();
            if (res.ok && data.success) {
                setExamPapers(prev => prev.filter(p => p.id !== paperId));
                setExamMessage('Exam paper deleted successfully.');
                setTimeout(() => setExamMessage(''), 3000);
            } else {
                alert(data.error || 'Failed to delete paper.');
            }
        } catch (err) {
            alert('Error deleting paper: ' + err.message);
        }
    };

    // =========================================================================
    // FREE PAPERS & TOPICS HANDLERS (Existing)
    // =========================================================================
    const fetchPapersAndTopics = async () => {
        setPapersLoading(true);
        setPaperFeedbackError('');
        try {
            const res = await fetch('/api/admin/papers');
            const data = await res.json();
            if (res.ok && data.success) {
                setTopics(data.topics || []);
                setPapers(data.papers || []);
            } else {
                setPaperFeedbackError(data.error || 'Failed to load papers.');
            }
        } catch (err) {
            setPaperFeedbackError('Error: ' + err.message);
        } finally {
            setPapersLoading(false);
        }
    };

    const handleCreateTopic = async (e) => {
        e.preventDefault();
        if (!newTopicName.trim() || !newTopicGrade) return;

        setTopicLoading(true);
        try {
            const res = await fetch('/api/admin/papers', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'create_topic',
                    name: newTopicName.trim(),
                    grade: newTopicGrade,
                    description: newTopicDesc.trim()
                })
            });
            const data = await res.json();
            if (res.ok && data.success) {
                setTopics(prev => [data.topic, ...prev]);
                setShowTopicModal(false);
                setNewTopicName('');
                setPaperFeedbackMsg('Topic created successfully!');
                setTimeout(() => setPaperFeedbackMsg(''), 3000);
            }
        } catch (err) {
            alert(err.message);
        } finally {
            setTopicLoading(false);
        }
    };

    const handleDeleteTopic = async (topicId, topicName) => {
        if (!confirm(`Delete topic "${topicName}"?`)) return;
        try {
            const res = await fetch(`/api/admin/papers?type=topic&id=${topicId}`, { method: 'DELETE' });
            const data = await res.json();
            if (res.ok && data.success) {
                setTopics(prev => prev.filter(t => t.id !== topicId));
                setPaperFeedbackMsg('Topic deleted.');
                setTimeout(() => setPaperFeedbackMsg(''), 3000);
            } else {
                alert(data.error);
            }
        } catch (e) {
            alert(e.message);
        }
    };

    const handleUploadPaper = async (e) => {
        e.preventDefault();
        if (!uploadFile || !uploadTitle.trim() || !uploadTopicId) return;

        setUploadLoading(true);
        try {
            const formData = new FormData();
            formData.append('file', uploadFile);
            formData.append('title', uploadTitle.trim());
            formData.append('grade', uploadGrade);
            formData.append('topicId', uploadTopicId);
            formData.append('year', uploadYear);
            formData.append('term', uploadTerm);

            const res = await fetch('/api/admin/papers/upload', { method: 'POST', body: formData });
            const data = await res.json();

            if (res.ok && data.success) {
                setPapers(prev => [data.paper, ...prev]);
                setShowUploadModal(false);
                setUploadFile(null);
                setUploadTitle('');
                setPaperFeedbackMsg('PDF uploaded successfully!');
                setTimeout(() => setPaperFeedbackMsg(''), 3000);
            } else {
                setUploadModalError(data.error || 'Upload failed.');
            }
        } catch (err) {
            setUploadModalError(err.message);
        } finally {
            setUploadLoading(false);
        }
    };

    const handleDeletePaper = async (paperId, paperTitle) => {
        if (!confirm(`Delete paper "${paperTitle}"?`)) return;
        try {
            const res = await fetch(`/api/admin/papers?type=paper&id=${paperId}`, { method: 'DELETE' });
            const data = await res.json();
            if (res.ok && data.success) {
                setPapers(prev => prev.filter(p => p.id !== paperId));
                setPaperFeedbackMsg('Paper deleted.');
                setTimeout(() => setPaperFeedbackMsg(''), 3000);
            }
        } catch (e) {
            alert(e.message);
        }
    };

    // Students & Videos (Existing)
    const fetchStudents = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/admin/users');
            const data = await res.json();
            if (res.ok && data.success) setStudents(data.users);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const fetchVideoLessons = async () => {
        setVideoLoading(true);
        try {
            const res = await fetch('/api/admin/video');
            const data = await res.json();
            if (res.ok && data.success) {
                setVideoLessons(data.lessons);
                const inputs = {};
                data.lessons.forEach(l => { inputs[l.id] = l.videoId; });
                setVideoInputs(inputs);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setVideoLoading(false);
        }
    };

    const filteredPapers = papers.filter(p => {
        const matchesGrade = paperGradeFilter === 'all' || p.grade === paperGradeFilter;
        const matchesTopic = paperTopicFilter === 'all' || p.topicId === paperTopicFilter;
        const matchesSearch = !paperSearchQuery || p.title.toLowerCase().includes(paperSearchQuery.toLowerCase());
        return matchesGrade && matchesTopic && matchesSearch;
    });

    const filteredStudents = students.filter(s =>
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.phone.includes(searchQuery) ||
        s.id.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Navbar />

            <main style={{ flex: 1, paddingTop: '110px', paddingBottom: '70px', position: 'relative', zIndex: 1 }} className="container">
                {/* Background radial glow */}
                <div style={{
                    position: 'absolute', top: '10%', left: '50%', transform: 'translate(-50%, -50%)',
                    width: '700px', height: '700px',
                    background: 'radial-gradient(circle, rgba(99, 102, 241, 0.08) 0%, transparent 70%)',
                    filter: 'blur(60px)', zIndex: -1
                }} />

                {!isAuthenticated ? (
                    // ADMIN LOGIN FORM
                    <div style={{ maxWidth: '440px', margin: '60px auto 0 auto' }}>
                        <div style={{
                            background: 'linear-gradient(145deg, rgba(26, 31, 56, 0.95) 0%, rgba(15, 23, 42, 0.98) 100%)',
                            border: '1px solid rgba(99, 102, 241, 0.35)', borderRadius: '24px',
                            padding: '2.5rem 2rem', textAlign: 'center', boxShadow: '0 0 50px rgba(99, 102, 241, 0.25)'
                        }}>
                            <div style={{
                                width: '56px', height: '56px', margin: '0 auto 1.25rem auto',
                                background: 'rgba(99, 102, 241, 0.15)', borderRadius: '16px',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                border: '1px solid rgba(99, 102, 241, 0.3)'
                            }}>
                                <Lock size={28} style={{ color: '#818cf8' }} />
                            </div>

                            <h3 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#f8fafc', marginBottom: '0.4rem' }}>
                                Admin Panel Verification
                            </h3>
                            <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: '1.75rem' }}>
                                Please log in to manage Online MCQ Exams, Free Papers, and Students.
                            </p>

                            {authError && (
                                <div style={{
                                    marginBottom: '1rem', background: 'rgba(239, 68, 68, 0.1)',
                                    border: '1px solid rgba(239, 68, 68, 0.3)', padding: '0.75rem 1rem',
                                    borderRadius: '12px', color: '#fca5a5', fontSize: '0.8rem',
                                    display: 'flex', gap: '0.5rem', alignItems: 'center'
                                }}>
                                    <AlertCircle size={16} color="#ef4444" />
                                    <span>{authError}</span>
                                </div>
                            )}

                            <form onSubmit={handleAuthSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <input 
                                    id="admin-phone-input"
                                    type="tel"
                                    required
                                    placeholder="Admin Phone Number (0715747680)"
                                    value={phoneInput}
                                    onChange={(e) => setPhoneInput(e.target.value)}
                                    style={{
                                        width: '100%', padding: '0.85rem 1rem', background: '#090d16',
                                        border: '1px solid rgba(99, 102, 241, 0.4)', borderRadius: '12px',
                                        color: '#fff', outline: 'none', fontSize: '0.95rem'
                                    }}
                                />
                                <input 
                                    id="admin-password-input"
                                    type="password"
                                    required
                                    placeholder="Admin Password"
                                    value={passwordInput}
                                    onChange={(e) => setPasswordInput(e.target.value)}
                                    style={{
                                        width: '100%', padding: '0.85rem 1rem', background: '#090d16',
                                        border: '1px solid rgba(99, 102, 241, 0.4)', borderRadius: '12px',
                                        color: '#fff', outline: 'none', fontSize: '0.95rem'
                                    }}
                                />
                                <button id="admin-login-btn" className="btn btn-primary" type="submit" style={{ width: '100%', justifyContent: 'center' }}>
                                    Login to Admin Dashboard
                                </button>
                            </form>
                        </div>
                    </div>
                ) : (
                    // AUTHENTICATED ADMIN DASHBOARD
                    <div>
                        {/* Top Header */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.25rem', marginBottom: '1.5rem' }}>
                            <div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                    <h2 style={{ fontSize: '1.85rem', fontWeight: 900, color: '#fff' }}>MathsBook Admin Portal</h2>
                                    <span style={{
                                        background: 'rgba(16, 185, 129, 0.15)', color: '#34d399',
                                        border: '1px solid rgba(16, 185, 129, 0.3)', padding: '2px 8px',
                                        borderRadius: '8px', fontSize: '0.75rem', fontWeight: 700
                                    }}>ADMIN VERIFIED</span>
                                </div>
                                <p style={{ color: '#94a3b8', fontSize: '0.88rem', marginTop: '0.2rem' }}>
                                    Manage Online Exams, CSV Question Uploads, Free PDF Papers, and Student Accounts.
                                </p>
                            </div>
                            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
                                <a 
                                    href="/exam" 
                                    target="_blank" 
                                    className="btn btn-secondary btn-sm"
                                    style={{ gap: '0.4rem', textDecoration: 'none', borderColor: 'rgba(245, 158, 11, 0.4)', color: '#fbbf24' }}
                                >
                                    <ExternalLink size={14} /> Open Online Exams
                                </a>
                                <a 
                                    href="/papers" 
                                    target="_blank" 
                                    className="btn btn-secondary btn-sm"
                                    style={{ gap: '0.4rem', textDecoration: 'none' }}
                                >
                                    <ExternalLink size={14} /> Open Free Papers
                                </a>
                                <button className="btn btn-tertiary btn-sm" onClick={handleAdminLogout} style={{ borderColor: 'rgba(239, 68, 68, 0.3)', color: '#fca5a5' }}>
                                    Logout
                                </button>
                            </div>
                        </div>

                        {/* Navigation Tabs */}
                        <div style={{
                            display: 'flex', gap: '0.5rem', borderBottom: '1px solid rgba(255,255,255,0.08)',
                            paddingBottom: '0.75rem', marginBottom: '2rem', flexWrap: 'wrap'
                        }}>
                            <button
                                onClick={() => setActiveTab('exams')}
                                style={{
                                    display: 'flex', alignItems: 'center', gap: '0.5rem',
                                    padding: '0.75rem 1.25rem', borderRadius: '12px',
                                    background: activeTab === 'exams' ? 'linear-gradient(135deg, #d97706, #b45309)' : 'rgba(255,255,255,0.04)',
                                    color: activeTab === 'exams' ? '#fff' : '#94a3b8',
                                    border: activeTab === 'exams' ? '1px solid #f59e0b' : '1px solid rgba(255,255,255,0.06)',
                                    fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer', transition: 'all 0.2s ease'
                                }}
                            >
                                <FileSpreadsheet size={16} /> 📝 Online Exams ({examPapers.length})
                            </button>

                            <button
                                onClick={() => setActiveTab('papers')}
                                style={{
                                    display: 'flex', alignItems: 'center', gap: '0.5rem',
                                    padding: '0.75rem 1.25rem', borderRadius: '12px',
                                    background: activeTab === 'papers' ? 'linear-gradient(135deg, #6366f1, #4f46e5)' : 'rgba(255,255,255,0.04)',
                                    color: activeTab === 'papers' ? '#fff' : '#94a3b8',
                                    border: activeTab === 'papers' ? '1px solid #818cf8' : '1px solid rgba(255,255,255,0.06)',
                                    fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer', transition: 'all 0.2s ease'
                                }}
                            >
                                <FileText size={16} /> 📑 Free Papers ({papers.length})
                            </button>

                            <button
                                onClick={() => setActiveTab('students')}
                                style={{
                                    display: 'flex', alignItems: 'center', gap: '0.5rem',
                                    padding: '0.75rem 1.25rem', borderRadius: '12px',
                                    background: activeTab === 'students' ? 'linear-gradient(135deg, #6366f1, #4f46e5)' : 'rgba(255,255,255,0.04)',
                                    color: activeTab === 'students' ? '#fff' : '#94a3b8',
                                    border: activeTab === 'students' ? '1px solid #818cf8' : '1px solid rgba(255,255,255,0.06)',
                                    fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer', transition: 'all 0.2s ease'
                                }}
                            >
                                <Users size={16} /> 👥 Students ({students.length})
                            </button>

                            <button
                                onClick={() => setActiveTab('videos')}
                                style={{
                                    display: 'flex', alignItems: 'center', gap: '0.5rem',
                                    padding: '0.75rem 1.25rem', borderRadius: '12px',
                                    background: activeTab === 'videos' ? 'linear-gradient(135deg, #6366f1, #4f46e5)' : 'rgba(255,255,255,0.04)',
                                    color: activeTab === 'videos' ? '#fff' : '#94a3b8',
                                    border: activeTab === 'videos' ? '1px solid #818cf8' : '1px solid rgba(255,255,255,0.06)',
                                    fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer', transition: 'all 0.2s ease'
                                }}
                            >
                                <BookOpen size={16} /> 🎬 Video Lessons
                            </button>
                        </div>

                        {/* ============================================================ */}
                        {/* TAB 1: ONLINE EXAMS MANAGEMENT (CSV Question Upload)         */}
                        {/* ============================================================ */}
                        {activeTab === 'exams' && (
                            <div>
                                {examMessage && (
                                    <div style={{
                                        marginBottom: '1.5rem', background: 'rgba(16, 185, 129, 0.12)',
                                        border: '1px solid rgba(16, 185, 129, 0.35)', padding: '0.9rem 1.25rem',
                                        borderRadius: '14px', color: '#6ee7b7', fontSize: '0.92rem',
                                        display: 'flex', alignItems: 'center', gap: '0.6rem'
                                    }}>
                                        <CheckCircle2 size={18} color="#10b981" />
                                        <span>{examMessage}</span>
                                    </div>
                                )}
                                {examError && (
                                    <div style={{
                                        marginBottom: '1.5rem', background: 'rgba(239, 68, 68, 0.12)',
                                        border: '1px solid rgba(239, 68, 68, 0.35)', padding: '0.9rem 1.25rem',
                                        borderRadius: '14px', color: '#fca5a5', fontSize: '0.92rem',
                                        display: 'flex', alignItems: 'center', gap: '0.6rem'
                                    }}>
                                        <AlertCircle size={18} color="#ef4444" />
                                        <span>{examError}</span>
                                    </div>
                                )}

                                {/* Top Stats & Actions Bar */}
                                <div style={{
                                    display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                                    gap: '1rem', marginBottom: '1.5rem'
                                }}>
                                    <div style={{ background: 'rgba(26, 31, 56, 0.85)', border: '1px solid rgba(245, 158, 11, 0.25)', borderRadius: '18px', padding: '1.25rem' }}>
                                        <div style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600 }}>Total Published Papers</div>
                                        <div style={{ fontSize: '2rem', fontWeight: 900, color: '#f59e0b', marginTop: '0.2rem' }}>{examPapers.length}</div>
                                        <div style={{ fontSize: '0.75rem', color: '#fbbf24', marginTop: '0.2rem' }}>All papers available for students</div>
                                    </div>

                                    <div style={{ background: 'rgba(26, 31, 56, 0.85)', border: '1px solid rgba(6, 182, 212, 0.25)', borderRadius: '18px', padding: '1.25rem' }}>
                                        <div style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600 }}>Total Questions in Bank</div>
                                        <div style={{ fontSize: '2rem', fontWeight: 900, color: '#06b6d4', marginTop: '0.2rem' }}>
                                            {examPapers.reduce((acc, p) => acc + (p.total_questions || 0), 0)}
                                        </div>
                                        <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.2rem' }}>With Theory Explanations</div>
                                    </div>

                                    <div style={{ background: 'rgba(26, 31, 56, 0.85)', border: '1px solid rgba(16, 185, 129, 0.25)', borderRadius: '18px', padding: '1.25rem', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '0.6rem' }}>
                                        <button 
                                            className="btn btn-primary"
                                            onClick={() => {
                                                setShowCreateExamModal(true);
                                                setNewPaperNumber(examPapers.length + 1);
                                                setNewPaperTitle(`Paper ${examPapers.length + 1} - O/L Mathematics Model MCQ`);
                                            }}
                                            style={{ width: '100%', justifyContent: 'center', gap: '0.4rem', background: 'linear-gradient(135deg, #d97706, #b45309)', border: '1px solid #f59e0b', fontSize: '0.88rem' }}
                                        >
                                            <Plus size={16} /> Create Paper (CSV Upload)
                                        </button>
                                        <button 
                                            className="btn btn-secondary"
                                            onClick={handleDownloadSampleCsv}
                                            style={{ width: '100%', justifyContent: 'center', gap: '0.4rem', fontSize: '0.85rem' }}
                                        >
                                            <Download size={15} /> Download Sample CSV Template
                                        </button>
                                    </div>
                                </div>

                                {/* Papers Table / Cards */}
                                <div style={{ background: 'rgba(15, 23, 42, 0.95)', border: '1px solid rgba(99, 102, 241, 0.25)', borderRadius: '24px', padding: '1.5rem' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
                                        <div>
                                            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#f8fafc' }}>Online MCQ Papers List</h3>
                                            <p style={{ color: '#94a3b8', fontSize: '0.85rem' }}>
                                                Every new paper you add appears for students without removing previous papers (Paper 1, Paper 2, Paper 3, etc.).
                                            </p>
                                        </div>
                                        <button className="btn btn-secondary btn-sm" onClick={fetchExamPapers} disabled={loadingExams} style={{ gap: '0.4rem' }}>
                                            <RefreshCw size={13} className={loadingExams ? 'animate-spin' : ''} /> Refresh
                                        </button>
                                    </div>

                                    {loadingExams ? (
                                        <div style={{ textAlign: 'center', padding: '3rem' }}>
                                            <RefreshCw size={32} className="animate-spin" style={{ color: '#f59e0b', margin: '0 auto 1rem auto' }} />
                                            <p style={{ color: '#94a3b8' }}>Loading exam papers...</p>
                                        </div>
                                    ) : examPapers.length === 0 ? (
                                        <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
                                            <FileSpreadsheet size={48} color="#64748b" style={{ margin: '0 auto 1rem auto', opacity: 0.5 }} />
                                            <p style={{ color: '#94a3b8' }}>No exam papers created yet. Click "Create Paper (CSV Upload)" above.</p>
                                        </div>
                                    ) : (
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
                                            {examPapers.map((paper, idx) => (
                                                <div
                                                    key={paper.id}
                                                    style={{
                                                        background: 'rgba(26, 31, 56, 0.95)', border: '1px solid rgba(255,255,255,0.06)',
                                                        borderRadius: '16px', padding: '1.2rem 1.4rem',
                                                        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                                        flexWrap: 'wrap', gap: '1rem'
                                                    }}
                                                >
                                                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flex: '1 1 300px' }}>
                                                        <div style={{
                                                            width: '46px', height: '46px', borderRadius: '12px',
                                                            background: 'rgba(245, 158, 11, 0.15)', border: '1px solid rgba(245, 158, 11, 0.3)',
                                                            color: '#fbbf24', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                            fontWeight: 900, fontSize: '1rem', flexShrink: 0
                                                        }}>
                                                            P{paper.paper_number || idx + 1}
                                                        </div>
                                                        <div>
                                                            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap', marginBottom: '0.2rem' }}>
                                                                <span style={{
                                                                    background: 'rgba(245, 158, 11, 0.2)', color: '#fbbf24',
                                                                    fontSize: '0.72rem', padding: '1px 7px', borderRadius: '999px', fontWeight: 700
                                                                }}>
                                                                    Paper {paper.paper_number || idx + 1}
                                                                </span>
                                                                <span style={{
                                                                    background: 'rgba(16, 185, 129, 0.15)', color: '#34d399',
                                                                    fontSize: '0.72rem', padding: '1px 7px', borderRadius: '999px', fontWeight: 700
                                                                }}>
                                                                    PUBLISHED
                                                                </span>
                                                                <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                                                                    {paper.duration_minutes || '45'} Mins
                                                                </span>
                                                            </div>
                                                            <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#fff', marginBottom: '0.2rem' }}>
                                                                {paper.title}
                                                            </h4>
                                                            <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                                                                {paper.total_questions || 0} Questions with Theory Explanations
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                                        <button
                                                            onClick={() => handleViewPaperQuestions(paper)}
                                                            className="btn btn-secondary btn-sm"
                                                            style={{ gap: '0.35rem', fontSize: '0.82rem' }}
                                                        >
                                                            <Eye size={13} /> View Questions
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteExamPaper(paper.id, paper.title)}
                                                            className="btn btn-tertiary btn-sm"
                                                            style={{ gap: '0.35rem', fontSize: '0.82rem', borderColor: 'rgba(239, 68, 68, 0.3)', color: '#f87171' }}
                                                        >
                                                            <Trash2 size={13} /> Delete
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* ============================================================ */}
                        {/* TAB 2: FREE PAPERS MANAGEMENT (Existing)                     */}
                        {/* ============================================================ */}
                        {activeTab === 'papers' && (
                            <div>
                                {paperFeedbackMsg && (
                                    <div style={{ marginBottom: '1.5rem', background: 'rgba(16, 185, 129, 0.12)', border: '1px solid rgba(16, 185, 129, 0.35)', padding: '0.9rem 1.25rem', borderRadius: '14px', color: '#6ee7b7', fontSize: '0.92rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                                        <CheckCircle2 size={18} color="#10b981" />
                                        <span>{paperFeedbackMsg}</span>
                                    </div>
                                )}
                                {paperFeedbackError && (
                                    <div style={{ marginBottom: '1.5rem', background: 'rgba(239, 68, 68, 0.12)', border: '1px solid rgba(239, 68, 68, 0.35)', padding: '0.9rem 1.25rem', borderRadius: '14px', color: '#fca5a5', fontSize: '0.92rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                                        <AlertCircle size={18} color="#ef4444" />
                                        <span>{paperFeedbackError}</span>
                                    </div>
                                )}

                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
                                    <div style={{ background: 'rgba(26, 31, 56, 0.85)', border: '1px solid rgba(99, 102, 241, 0.2)', borderRadius: '18px', padding: '1.25rem' }}>
                                        <div style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600 }}>Total Papers Uploaded</div>
                                        <div style={{ fontSize: '2rem', fontWeight: 900, color: '#fff', marginTop: '0.2rem' }}>{papers.length}</div>
                                    </div>
                                    <div style={{ background: 'rgba(26, 31, 56, 0.85)', border: '1px solid rgba(6, 182, 212, 0.2)', borderRadius: '18px', padding: '1.25rem' }}>
                                        <div style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600 }}>Grade 10 Papers</div>
                                        <div style={{ fontSize: '2rem', fontWeight: 900, color: '#06b6d4', marginTop: '0.2rem' }}>
                                            {papers.filter(p => p.grade === 'grade_10').length}
                                        </div>
                                    </div>
                                    <div style={{ background: 'rgba(26, 31, 56, 0.85)', border: '1px solid rgba(245, 158, 11, 0.2)', borderRadius: '18px', padding: '1.25rem' }}>
                                        <div style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600 }}>Grade 11 Papers</div>
                                        <div style={{ fontSize: '2rem', fontWeight: 900, color: '#f59e0b', marginTop: '0.2rem' }}>
                                            {papers.filter(p => p.grade === 'grade_11').length}
                                        </div>
                                    </div>
                                    <div style={{ background: 'rgba(26, 31, 56, 0.85)', border: '1px solid rgba(16, 185, 129, 0.2)', borderRadius: '18px', padding: '1.25rem', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '0.6rem' }}>
                                        <button className="btn btn-primary" onClick={() => setShowUploadModal(true)} style={{ width: '100%', justifyContent: 'center', gap: '0.4rem', fontSize: '0.88rem' }}>
                                            <Upload size={15} /> Upload PDF Paper
                                        </button>
                                        <button className="btn btn-secondary" onClick={() => setShowTopicModal(true)} style={{ width: '100%', justifyContent: 'center', gap: '0.4rem', fontSize: '0.88rem' }}>
                                            <FolderPlus size={15} /> Create Topic/Folder
                                        </button>
                                    </div>
                                </div>

                                {/* Filter Controls */}
                                <div style={{ background: 'rgba(26, 31, 56, 0.65)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '20px', padding: '1.25rem', marginBottom: '1.5rem', display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center' }}>
                                    <div style={{ display: 'flex', gap: '0.4rem', background: 'rgba(15, 23, 42, 0.8)', padding: '4px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.06)' }}>
                                        <button onClick={() => { setPaperGradeFilter('all'); setPaperTopicFilter('all'); }} style={{ padding: '0.45rem 0.9rem', borderRadius: '8px', border: 'none', background: paperGradeFilter === 'all' ? '#6366f1' : 'transparent', color: paperGradeFilter === 'all' ? '#fff' : '#94a3b8', fontWeight: 600, fontSize: '0.82rem', cursor: 'pointer' }}>All Grades</button>
                                        <button onClick={() => { setPaperGradeFilter('grade_10'); setPaperTopicFilter('all'); }} style={{ padding: '0.45rem 0.9rem', borderRadius: '8px', border: 'none', background: paperGradeFilter === 'grade_10' ? '#06b6d4' : 'transparent', color: paperGradeFilter === 'grade_10' ? '#fff' : '#94a3b8', fontWeight: 600, fontSize: '0.82rem', cursor: 'pointer' }}>Grade 10</button>
                                        <button onClick={() => { setPaperGradeFilter('grade_11'); setPaperTopicFilter('all'); }} style={{ padding: '0.45rem 0.9rem', borderRadius: '8px', border: 'none', background: paperGradeFilter === 'grade_11' ? '#f59e0b' : 'transparent', color: paperGradeFilter === 'grade_11' ? '#fff' : '#94a3b8', fontWeight: 600, fontSize: '0.82rem', cursor: 'pointer' }}>Grade 11</button>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <Filter size={15} style={{ color: '#64748b' }} />
                                        <select value={paperTopicFilter} onChange={(e) => setPaperTopicFilter(e.target.value)} style={{ background: '#090d16', color: '#fff', border: '1px solid rgba(99, 102, 241, 0.3)', padding: '0.5rem 0.9rem', borderRadius: '10px', fontSize: '0.85rem', outline: 'none' }}>
                                            <option value="all">All Topics / Folders</option>
                                            {topics.filter(t => paperGradeFilter === 'all' || t.grade === paperGradeFilter).map(t => (
                                                <option key={t.id} value={t.id}>[{t.grade === 'grade_10' ? 'G10' : 'G11'}] {t.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div style={{ flex: 1, minWidth: '220px', display: 'flex', alignItems: 'center', gap: '0.6rem', background: '#090d16', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', padding: '0.45rem 0.85rem' }}>
                                        <Search size={16} style={{ color: '#64748b' }} />
                                        <input type="text" placeholder="Search papers..." value={paperSearchQuery} onChange={(e) => setPaperSearchQuery(e.target.value)} style={{ background: 'none', border: 'none', outline: 'none', color: '#fff', fontSize: '0.85rem', width: '100%' }} />
                                    </div>
                                    <button onClick={fetchPapersAndTopics} disabled={papersLoading} className="btn btn-secondary btn-sm" style={{ gap: '0.4rem' }}>
                                        <RefreshCw size={13} className={papersLoading ? 'animate-spin' : ''} /> Refresh
                                    </button>
                                </div>

                                {/* Papers List */}
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
                                    {filteredPapers.map(paper => (
                                        <div key={paper.id} style={{ background: 'linear-gradient(135deg, rgba(26, 31, 56, 0.95) 0%, rgba(15, 23, 42, 0.95) 100%)', border: '1px solid rgba(99, 102, 241, 0.25)', borderRadius: '16px', padding: '1.2rem 1.4rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                                            <div>
                                                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '0.3rem' }}>
                                                    <span style={{ background: paper.grade === 'grade_10' ? 'rgba(6, 182, 212, 0.2)' : 'rgba(245, 158, 11, 0.2)', color: paper.grade === 'grade_10' ? '#22d3ee' : '#fbbf24', fontSize: '0.7rem', padding: '1px 7px', borderRadius: '999px', fontWeight: 700 }}>{paper.grade === 'grade_10' ? 'Grade 10' : 'Grade 11'}</span>
                                                    <span style={{ background: 'rgba(99, 102, 241, 0.15)', color: '#a5b4fc', fontSize: '0.7rem', padding: '1px 7px', borderRadius: '999px', fontWeight: 600 }}>📁 {paper.topicName}</span>
                                                </div>
                                                <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#f8fafc', marginBottom: '0.2rem' }}>{paper.title}</h4>
                                                <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>Size: {paper.fileSize} • Downloads: {paper.downloads || 0}</div>
                                            </div>
                                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                <a href={paper.fileUrl} target="_blank" rel="noreferrer" className="btn btn-secondary btn-sm" style={{ gap: '0.35rem', fontSize: '0.8rem', textDecoration: 'none' }}><Eye size={13} /> View PDF</a>
                                                <button onClick={() => handleDeletePaper(paper.id, paper.title)} className="btn btn-tertiary btn-sm" style={{ gap: '0.35rem', fontSize: '0.8rem', borderColor: 'rgba(239, 68, 68, 0.3)', color: '#f87171' }}><Trash2 size={13} /> Delete</button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* ============================================================ */}
                        {/* TAB 3: STUDENTS & COURSES                                    */}
                        {/* ============================================================ */}
                        {activeTab === 'students' && (
                            <div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                                    <div>
                                        <h3 style={{ fontSize: '1.4rem', fontWeight: 800 }}>Student Enrolment Management</h3>
                                        <p style={{ color: '#94a3b8', fontSize: '0.85rem' }}>Manage course access and view registered student profiles.</p>
                                    </div>
                                    <button className="btn btn-secondary btn-sm" onClick={fetchStudents} disabled={loading} style={{ gap: '0.5rem' }}>
                                        <RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> Refresh List
                                    </button>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    {filteredStudents.map(student => (
                                        <div key={student.id} style={{ background: 'rgba(26, 31, 56, 0.8)', border: '1px solid rgba(99, 102, 241, 0.25)', borderRadius: '18px', padding: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                                            <div>
                                                <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#fff' }}>{student.name}</h4>
                                                <div style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'flex', gap: '1rem', marginTop: '0.2rem' }}>
                                                    <span>ID: <strong style={{ color: '#06b6d4' }}>{student.id}</strong></span>
                                                    <span>Phone: <strong>{student.phone}</strong></span>
                                                </div>
                                            </div>
                                            <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                                                {(student.enrolledCourses || ['free_paper']).map(c => (
                                                    <span key={c} style={{ background: 'rgba(99, 102, 241, 0.15)', color: '#c7d2fe', padding: '2px 8px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 600 }}>{c}</span>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* ============================================================ */}
                        {/* TAB 4: VIDEO LESSONS                                         */}
                        {/* ============================================================ */}
                        {activeTab === 'videos' && (
                            <div style={{ background: 'rgba(15, 23, 42, 0.95)', border: '1px solid rgba(99, 102, 241, 0.25)', borderRadius: '24px', padding: '1.5rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                                    <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#fff' }}>Video Lessons Links</h3>
                                    <button className="btn btn-secondary btn-sm" onClick={fetchVideoLessons} disabled={videoLoading} style={{ gap: '0.4rem' }}>
                                        <RefreshCw size={13} className={videoLoading ? 'animate-spin' : ''} /> Refresh
                                    </button>
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
                                    {videoLessons.map(lesson => (
                                        <div key={lesson.id} style={{ background: 'rgba(26, 31, 56, 0.95)', borderRadius: '16px', padding: '1rem', border: '1px solid rgba(255,255,255,0.05)' }}>
                                            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#c7d2fe', marginBottom: '0.4rem' }}>{lesson.title}</div>
                                            <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginBottom: '0.5rem' }}>Course: {lesson.course}</div>
                                            <div style={{ fontSize: '0.8rem', color: '#38bdf8' }}>Video ID: {lesson.videoId || 'Not set'}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </main>

            {/* ============================================================ */}
            {/* MODAL: CREATE EXAM PAPER & UPLOAD CSV                        */}
            {/* ============================================================ */}
            {showCreateExamModal && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
                    background: 'rgba(0, 0, 0, 0.8)', backdropFilter: 'blur(8px)',
                    zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem'
                }}>
                    <div style={{
                        background: 'linear-gradient(145deg, #181d33 0%, #0d1222 100%)',
                        border: '1px solid rgba(245, 158, 11, 0.4)', borderRadius: '24px',
                        width: '100%', maxWidth: '720px', maxHeight: '90vh', overflowY: 'auto',
                        padding: '2rem', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8)'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                                <div style={{
                                    width: '38px', height: '38px', borderRadius: '10px',
                                    background: 'rgba(245, 158, 11, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center'
                                }}>
                                    <FileSpreadsheet size={20} color="#fbbf24" />
                                </div>
                                <div>
                                    <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff' }}>Create MCQ Exam Paper</h3>
                                    <p style={{ fontSize: '0.78rem', color: '#94a3b8' }}>Upload questions using a CSV file and preview before publishing</p>
                                </div>
                            </div>
                            <button onClick={() => setShowCreateExamModal(false)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handlePublishExamPaper} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
                            {/* Paper Title & Number */}
                            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#cbd5e1', marginBottom: '0.35rem' }}>
                                        Paper Title *
                                    </label>
                                    <input 
                                        type="text"
                                        required
                                        placeholder="e.g. Paper 3 - O/L Mathematics Model MCQ Paper"
                                        value={newPaperTitle}
                                        onChange={(e) => setNewPaperTitle(e.target.value)}
                                        style={{ width: '100%', padding: '0.75rem 1rem', background: '#090d16', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', color: '#fff', fontSize: '0.9rem', outline: 'none' }}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#cbd5e1', marginBottom: '0.35rem' }}>
                                        Paper Number
                                    </label>
                                    <input 
                                        type="number"
                                        placeholder="3"
                                        value={newPaperNumber}
                                        onChange={(e) => setNewPaperNumber(e.target.value)}
                                        style={{ width: '100%', padding: '0.75rem 1rem', background: '#090d16', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', color: '#fff', fontSize: '0.9rem', outline: 'none' }}
                                    />
                                </div>
                            </div>

                            {/* Grade & Duration */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#cbd5e1', marginBottom: '0.35rem' }}>
                                        Target Grade
                                    </label>
                                    <select
                                        value={newPaperGrade}
                                        onChange={(e) => setNewPaperGrade(e.target.value)}
                                        style={{ width: '100%', padding: '0.75rem 0.8rem', background: '#090d16', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', color: '#fff', fontSize: '0.88rem', outline: 'none' }}
                                    >
                                        <option value="grade_11">Grade 11 (O/L Exam)</option>
                                        <option value="grade_10">Grade 10</option>
                                        <option value="all">Grade 10 & 11</option>
                                    </select>
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#cbd5e1', marginBottom: '0.35rem' }}>
                                        Estimated Duration (Minutes)
                                    </label>
                                    <input 
                                        type="number"
                                        placeholder="45"
                                        value={newPaperDuration}
                                        onChange={(e) => setNewPaperDuration(e.target.value)}
                                        style={{ width: '100%', padding: '0.75rem 1rem', background: '#090d16', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', color: '#fff', fontSize: '0.9rem', outline: 'none' }}
                                    />
                                </div>
                            </div>

                            {/* Description */}
                            <div>
                                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#cbd5e1', marginBottom: '0.35rem' }}>
                                    Description / Instructions (Optional)
                                </label>
                                <textarea 
                                    rows={2}
                                    placeholder="Brief details about what topics are covered in this paper..."
                                    value={newPaperDesc}
                                    onChange={(e) => setNewPaperDesc(e.target.value)}
                                    style={{ width: '100%', padding: '0.75rem 1rem', background: '#090d16', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', color: '#fff', fontSize: '0.88rem', outline: 'none', resize: 'none' }}
                                />
                            </div>

                            {/* CSV File Upload Section */}
                            <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '1rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                                    <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#fbbf24' }}>
                                        Upload Questions via CSV File *
                                    </label>
                                    <button 
                                        type="button" 
                                        onClick={handleDownloadSampleCsv}
                                        style={{ background: 'none', border: 'none', color: '#38bdf8', fontSize: '0.78rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.3rem', textDecoration: 'underline' }}
                                    >
                                        <Download size={13} /> Download Sample CSV Template
                                    </button>
                                </div>

                                <div 
                                    onClick={() => csvFileInputRef.current?.click()}
                                    style={{
                                        border: '2px dashed rgba(245, 158, 11, 0.4)', borderRadius: '14px',
                                        padding: '1.25rem', textAlign: 'center', cursor: 'pointer',
                                        background: csvFileName ? 'rgba(245, 158, 11, 0.1)' : 'rgba(255,255,255,0.02)',
                                        marginBottom: '0.75rem'
                                    }}
                                >
                                    <input 
                                        type="file"
                                        ref={csvFileInputRef}
                                        accept=".csv,text/csv"
                                        onChange={handleCsvFileSelect}
                                        style={{ display: 'none' }}
                                    />
                                    <FileSpreadsheet size={28} color={csvFileName ? '#fbbf24' : '#94a3b8'} style={{ margin: '0 auto 0.4rem auto' }} />
                                    {csvFileName ? (
                                        <div style={{ color: '#fbbf24', fontWeight: 700, fontSize: '0.9rem' }}>
                                            {csvFileName} • Click to change file
                                        </div>
                                    ) : (
                                        <div>
                                            <div style={{ color: '#fff', fontWeight: 600, fontSize: '0.88rem' }}>Click to choose .csv file from your computer</div>
                                            <div style={{ color: '#64748b', fontSize: '0.75rem', marginTop: '0.2rem' }}>
                                                Columns: Question, Answer A, Answer B, Answer C, Answer D, Answer, Explanation
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Or paste CSV raw text */}
                                <div style={{ fontSize: '0.78rem', color: '#94a3b8', marginBottom: '0.4rem' }}>
                                    Or paste raw CSV text directly below:
                                </div>
                                <textarea 
                                    rows={4}
                                    placeholder={`Question,Answer A,Answer B,Answer C,Answer D,Answer,Explanation\n"What is 2 + 2?","3","4","5","6","B","2 + 2 = 4"`}
                                    value={csvInputText}
                                    onChange={(e) => {
                                        setCsvInputText(e.target.value);
                                        if (e.target.value.trim()) validateCsvContent(e.target.value);
                                    }}
                                    style={{ width: '100%', padding: '0.75rem', background: '#090d16', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', color: '#e2e8f0', fontSize: '0.8rem', fontFamily: 'monospace', outline: 'none' }}
                                />
                            </div>

                            {/* CSV Live Validation & Preview */}
                            {validatingCsv ? (
                                <div style={{ fontSize: '0.82rem', color: '#fbbf24' }}>Validating CSV questions...</div>
                            ) : csvValidationResult && (
                                <div>
                                    {csvValidationResult.valid ? (
                                        <div style={{
                                            background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)',
                                            borderRadius: '12px', padding: '0.75rem 1rem', color: '#6ee7b7', fontSize: '0.85rem',
                                            display: 'flex', alignItems: 'center', gap: '0.5rem'
                                        }}>
                                            <CheckCircle2 size={16} />
                                            <span>CSV Valid! <strong>{csvValidationResult.questions.length}</strong> questions parsed successfully.</span>
                                        </div>
                                    ) : (
                                        <div style={{
                                            background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)',
                                            borderRadius: '12px', padding: '0.75rem 1rem', color: '#fca5a5', fontSize: '0.82rem'
                                        }}>
                                            <div style={{ fontWeight: 700, marginBottom: '0.2rem' }}>CSV Validation Errors:</div>
                                            {csvValidationResult.errors.map((err, i) => (
                                                <div key={i}>• {err}</div>
                                            ))}
                                        </div>
                                    )}

                                    {/* Question Preview Table */}
                                    {csvValidationResult.questions.length > 0 && (
                                        <div style={{ marginTop: '0.75rem', maxHeight: '180px', overflowY: 'auto', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '10px' }}>
                                            <table style={{ width: '100%', fontSize: '0.78rem', borderCollapse: 'collapse', textAlign: 'left' }}>
                                                <thead>
                                                    <tr style={{ background: 'rgba(255,255,255,0.05)', color: '#94a3b8' }}>
                                                        <th style={{ padding: '6px 10px' }}>#</th>
                                                        <th style={{ padding: '6px 10px' }}>Question</th>
                                                        <th style={{ padding: '6px 10px' }}>Correct</th>
                                                        <th style={{ padding: '6px 10px' }}>Explanation</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {csvValidationResult.questions.map((q, idx) => (
                                                        <tr key={idx} style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}>
                                                            <td style={{ padding: '6px 10px', color: '#fbbf24', fontWeight: 700 }}>{idx + 1}</td>
                                                            <td style={{ padding: '6px 10px', color: '#fff' }}>{q.question_text.slice(0, 45)}...</td>
                                                            <td style={{ padding: '6px 10px', color: '#34d399', fontWeight: 800 }}>{q.correct_answer}</td>
                                                            <td style={{ padding: '6px 10px', color: '#94a3b8' }}>{q.explanation ? q.explanation.slice(0, 35) + '...' : '-'}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Submit buttons */}
                            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                                <button
                                    type="button"
                                    onClick={() => setShowCreateExamModal(false)}
                                    className="btn btn-secondary"
                                    style={{ flex: 1, justifyContent: 'center' }}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={publishingPaper || !csvValidationResult?.valid}
                                    className="btn btn-primary"
                                    style={{ flex: 2, justifyContent: 'center', gap: '0.5rem', background: 'linear-gradient(135deg, #d97706, #b45309)', border: '1px solid #f59e0b' }}
                                >
                                    {publishingPaper ? <RefreshCw size={15} className="animate-spin" /> : <Send size={15} />}
                                    {publishingPaper ? 'Publishing Paper...' : 'Publish Paper to Students'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* ============================================================ */}
            {/* MODAL: VIEW EXAM PAPER QUESTIONS                            */}
            {/* ============================================================ */}
            {viewingExamPaper && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
                    background: 'rgba(0, 0, 0, 0.8)', backdropFilter: 'blur(8px)',
                    zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem'
                }}>
                    <div style={{
                        background: 'linear-gradient(145deg, #181d33 0%, #0d1222 100%)',
                        border: '1px solid rgba(245, 158, 11, 0.4)', borderRadius: '24px',
                        width: '100%', maxWidth: '780px', maxHeight: '85vh', overflowY: 'auto',
                        padding: '2rem'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                            <div>
                                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff' }}>
                                    {viewingExamPaper.title}
                                </h3>
                                <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                                    Total Questions: {viewingExamPaper.questions?.length || 0} • Duration: {viewingExamPaper.duration_minutes} Mins
                                </div>
                            </div>
                            <button onClick={() => setViewingExamPaper(null)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
                                <X size={20} />
                            </button>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {viewingExamPaper.questions?.map((q, idx) => (
                                <div key={q.id || idx} style={{ background: 'rgba(26, 31, 56, 0.95)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '16px', padding: '1.25rem' }}>
                                    <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#fbbf24', marginBottom: '0.4rem' }}>
                                        Question {idx + 1}
                                    </div>
                                    <h4 style={{ fontSize: '1.02rem', fontWeight: 700, color: '#fff', marginBottom: '0.85rem' }}>
                                        {q.question_text}
                                    </h4>
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.5rem', marginBottom: '0.75rem', fontSize: '0.85rem' }}>
                                        <div style={{ padding: '0.5rem 0.75rem', borderRadius: '8px', background: 'rgba(255,255,255,0.03)', color: '#cbd5e1' }}><strong>A:</strong> {q.option_a}</div>
                                        <div style={{ padding: '0.5rem 0.75rem', borderRadius: '8px', background: 'rgba(255,255,255,0.03)', color: '#cbd5e1' }}><strong>B:</strong> {q.option_b}</div>
                                        <div style={{ padding: '0.5rem 0.75rem', borderRadius: '8px', background: 'rgba(255,255,255,0.03)', color: '#cbd5e1' }}><strong>C:</strong> {q.option_c}</div>
                                        <div style={{ padding: '0.5rem 0.75rem', borderRadius: '8px', background: 'rgba(255,255,255,0.03)', color: '#cbd5e1' }}><strong>D:</strong> {q.option_d}</div>
                                    </div>
                                    {q.correct_answer && (
                                        <div style={{ fontSize: '0.82rem', color: '#34d399', fontWeight: 700, marginBottom: '0.4rem' }}>
                                            Correct Answer: {q.correct_answer}
                                        </div>
                                    )}
                                    {q.explanation && (
                                        <div style={{ fontSize: '0.8rem', color: '#94a3b8', background: 'rgba(15, 23, 42, 0.8)', padding: '0.6rem 0.85rem', borderRadius: '10px', whiteSpace: 'pre-line' }}>
                                            <strong>Theory Explanation:</strong> {q.explanation}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* ============================================================ */}
            {/* MODAL: UPLOAD PDF PAPER (Existing)                           */}
            {/* ============================================================ */}
            {showUploadModal && (
                <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0, 0, 0, 0.75)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
                    <div style={{ background: '#131b2e', border: '1px solid rgba(99, 102, 241, 0.4)', borderRadius: '24px', width: '100%', maxWidth: '540px', padding: '2rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff' }}>Upload Free PDF Paper</h3>
                            <button onClick={() => setShowUploadModal(false)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}><X size={20} /></button>
                        </div>
                        {uploadModalError && <div style={{ marginBottom: '1rem', background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)', padding: '0.75rem', borderRadius: '10px', color: '#fca5a5', fontSize: '0.85rem' }}>{uploadModalError}</div>}
                        <form onSubmit={handleUploadPaper} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.82rem', color: '#cbd5e1', marginBottom: '0.4rem' }}>Select PDF File</label>
                                <input type="file" ref={fileInputRef} accept=".pdf,application/pdf" onChange={(e) => setUploadFile(e.target.files[0] || null)} style={{ color: '#fff' }} />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.82rem', color: '#cbd5e1', marginBottom: '0.4rem' }}>Title</label>
                                <input type="text" required value={uploadTitle} onChange={(e) => setUploadTitle(e.target.value)} style={{ width: '100%', padding: '0.75rem', background: '#090d16', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', color: '#fff' }} />
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.82rem', color: '#cbd5e1', marginBottom: '0.4rem' }}>Grade</label>
                                    <select value={uploadGrade} onChange={(e) => setUploadGrade(e.target.value)} style={{ width: '100%', padding: '0.75rem', background: '#090d16', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', color: '#fff' }}>
                                        <option value="grade_10">Grade 10</option>
                                        <option value="grade_11">Grade 11</option>
                                    </select>
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.82rem', color: '#cbd5e1', marginBottom: '0.4rem' }}>Topic</label>
                                    <select value={uploadTopicId} onChange={(e) => setUploadTopicId(e.target.value)} style={{ width: '100%', padding: '0.75rem', background: '#090d16', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', color: '#fff' }}>
                                        <option value="">Select Topic...</option>
                                        {topics.filter(t => t.grade === uploadGrade).map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                                    </select>
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                                <button type="button" onClick={() => setShowUploadModal(false)} className="btn btn-secondary" style={{ flex: 1, justifyContent: 'center' }}>Cancel</button>
                                <button type="submit" disabled={uploadLoading} className="btn btn-primary" style={{ flex: 2, justifyContent: 'center' }}>{uploadLoading ? 'Uploading...' : 'Upload PDF'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* ============================================================ */}
            {/* MODAL: CREATE TOPIC (Existing)                               */}
            {/* ============================================================ */}
            {showTopicModal && (
                <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0, 0, 0, 0.75)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
                    <div style={{ background: '#131b2e', border: '1px solid rgba(99, 102, 241, 0.4)', borderRadius: '24px', width: '100%', maxWidth: '480px', padding: '2rem' }}>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff', marginBottom: '1.25rem' }}>Create Topic / Folder</h3>
                        <form onSubmit={handleCreateTopic} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.82rem', color: '#cbd5e1', marginBottom: '0.4rem' }}>Grade</label>
                                <select value={newTopicGrade} onChange={(e) => setNewTopicGrade(e.target.value)} style={{ width: '100%', padding: '0.75rem', background: '#090d16', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', color: '#fff' }}>
                                    <option value="grade_10">Grade 10</option>
                                    <option value="grade_11">Grade 11</option>
                                </select>
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.82rem', color: '#cbd5e1', marginBottom: '0.4rem' }}>Topic Name</label>
                                <input type="text" required placeholder="e.g. Algebra or Geometry" value={newTopicName} onChange={(e) => setNewTopicName(e.target.value)} style={{ width: '100%', padding: '0.75rem', background: '#090d16', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', color: '#fff' }} />
                            </div>
                            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                                <button type="button" onClick={() => setShowTopicModal(false)} className="btn btn-secondary" style={{ flex: 1, justifyContent: 'center' }}>Cancel</button>
                                <button type="submit" disabled={topicLoading} className="btn btn-primary" style={{ flex: 2, justifyContent: 'center' }}>Create Topic</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <Footer />
            <FloatingWhatsapp />
        </div>
    );
}

export default function AdminPage() {
    return (
        <LanguageProvider>
            <AdminContent />
        </LanguageProvider>
    );
}
