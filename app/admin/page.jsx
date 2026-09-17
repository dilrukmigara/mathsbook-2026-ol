'use client';

import React, { useState, useEffect, useRef } from 'react';
import Navbar from '../../src/components/Navbar';
import Footer from '../../src/components/Footer';
import FloatingWhatsapp from '../../src/components/FloatingWhatsapp';
import { LanguageProvider } from '../../src/context/LanguageContext';
import { 
  ShieldCheck, Search, Users, CheckSquare, Save, Lock, AlertCircle, 
  RefreshCw, FileText, Upload, FolderPlus, Trash2, Edit3, ExternalLink, 
  Plus, CheckCircle2, Download, BookOpen, Layers, X, Eye, Filter
} from 'lucide-react';

function AdminContent() {
    // Auth gate
    const [phoneInput, setPhoneInput] = useState('');
    const [passwordInput, setPasswordInput] = useState('');
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [authError, setAuthError] = useState('');
    
    // Active admin view: 'papers' | 'students' | 'videos'
    const [activeTab, setActiveTab] = useState('papers');

    // Students listing data
    const [students, setStudents] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const [actionLoading, setActionLoading] = useState(null);
    const [message, setMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    // Video lessons management
    const [videoLessons, setVideoLessons] = useState([]);
    const [videoInputs, setVideoInputs] = useState({});
    const [videoLoading, setVideoLoading] = useState(false);
    const [videoSavingId, setVideoSavingId] = useState(null);
    const [videoMessage, setVideoMessage] = useState('');
    const [videoError, setVideoError] = useState('');

    // ==========================================
    // Free Papers Management State
    // ==========================================
    const [papers, setPapers] = useState([]);
    const [topics, setTopics] = useState([]);
    const [papersLoading, setPapersLoading] = useState(false);
    const [paperFeedbackMsg, setPaperFeedbackMsg] = useState('');
    const [paperFeedbackError, setPaperFeedbackError] = useState('');

    // Filters for papers
    const [paperGradeFilter, setPaperGradeFilter] = useState('all');
    const [paperTopicFilter, setPaperTopicFilter] = useState('all');
    const [paperSearchQuery, setPaperSearchQuery] = useState('');

    // Modals
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [showTopicModal, setShowTopicModal] = useState(false);
    const [editingPaper, setEditingPaper] = useState(null);

    // Upload form state
    const [uploadFile, setUploadFile] = useState(null);
    const [uploadTitle, setUploadTitle] = useState('');
    const [uploadGrade, setUploadGrade] = useState('grade_10');
    const [uploadTopicId, setUploadTopicId] = useState('');
    const [uploadYear, setUploadYear] = useState('2026');
    const [uploadTerm, setUploadTerm] = useState('Model Paper');
    const [uploadLoading, setUploadLoading] = useState(false);
    const [uploadModalError, setUploadModalError] = useState('');
    const fileInputRef = useRef(null);

    // Topic form state
    const [newTopicName, setNewTopicName] = useState('');
    const [newTopicGrade, setNewTopicGrade] = useState('grade_10');
    const [newTopicDesc, setNewTopicDesc] = useState('');
    const [topicLoading, setTopicLoading] = useState(false);
    const [topicModalError, setTopicModalError] = useState('');

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
                    fetchStudents();
                    fetchVideoLessons();
                    fetchPapersAndTopics();
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
            fetchStudents();
            fetchVideoLessons();
            fetchPapersAndTopics();
        } else {
            setAuthError('Phone number or password is incorrect. Please try again.');
        }
    };

    // Fetch papers and topics
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
            setPaperFeedbackError('Error loading papers: ' + err.message);
        } finally {
            setPapersLoading(false);
        }
    };

    // Create topic
    const handleCreateTopic = async (e) => {
        e.preventDefault();
        if (!newTopicName.trim() || !newTopicGrade) {
            setTopicModalError('Please enter a topic name and select a grade.');
            return;
        }

        setTopicLoading(true);
        setTopicModalError('');
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
                setNewTopicDesc('');
                setPaperFeedbackMsg('Topic created successfully!');
                setTimeout(() => setPaperFeedbackMsg(''), 3500);
            } else {
                setTopicModalError(data.error || 'Failed to create topic.');
            }
        } catch (err) {
            setTopicModalError('Error: ' + err.message);
        } finally {
            setTopicLoading(false);
        }
    };

    // Delete topic
    const handleDeleteTopic = async (topicId, topicName) => {
        if (!confirm(`Are you sure you want to delete topic "${topicName}"?`)) return;

        try {
            const res = await fetch(`/api/admin/papers?type=topic&id=${topicId}`, {
                method: 'DELETE'
            });
            const data = await res.json();
            if (res.ok && data.success) {
                setTopics(prev => prev.filter(t => t.id !== topicId));
                setPaperFeedbackMsg('Topic deleted successfully.');
                setTimeout(() => setPaperFeedbackMsg(''), 3000);
            } else {
                alert(data.error || 'Cannot delete topic.');
            }
        } catch (err) {
            alert('Error deleting topic: ' + err.message);
        }
    };

    // Upload PDF paper
    const handleUploadPaper = async (e) => {
        e.preventDefault();
        if (!uploadFile) {
            setUploadModalError('Please select a PDF file from your computer.');
            return;
        }
        if (!uploadTitle.trim()) {
            setUploadModalError('Please provide a title for the paper.');
            return;
        }
        if (!uploadTopicId) {
            setUploadModalError('Please select a topic/folder for this paper.');
            return;
        }

        setUploadLoading(true);
        setUploadModalError('');

        try {
            const formData = new FormData();
            formData.append('file', uploadFile);
            formData.append('title', uploadTitle.trim());
            formData.append('grade', uploadGrade);
            formData.append('topicId', uploadTopicId);
            formData.append('year', uploadYear);
            formData.append('term', uploadTerm);

            const res = await fetch('/api/admin/papers/upload', {
                method: 'POST',
                body: formData
            });
            const data = await res.json();

            if (res.ok && data.success) {
                setPapers(prev => [data.paper, ...prev]);
                setShowUploadModal(false);
                setUploadFile(null);
                setUploadTitle('');
                setUploadTopicId('');
                if (fileInputRef.current) fileInputRef.current.value = '';
                setPaperFeedbackMsg('PDF paper uploaded successfully!');
                setTimeout(() => setPaperFeedbackMsg(''), 3500);
            } else {
                setUploadModalError(data.error || 'Failed to upload paper.');
            }
        } catch (err) {
            setUploadModalError('Upload error: ' + err.message);
        } finally {
            setUploadLoading(false);
        }
    };

    // Save edited paper
    const handleSaveEditPaper = async (e) => {
        e.preventDefault();
        if (!editingPaper) return;

        try {
            const res = await fetch('/api/admin/papers', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    paperId: editingPaper.id,
                    updates: {
                        title: editingPaper.title,
                        grade: editingPaper.grade,
                        topicId: editingPaper.topicId,
                        topicName: topics.find(t => t.id === editingPaper.topicId)?.name || editingPaper.topicName,
                        year: editingPaper.year,
                        term: editingPaper.term
                    }
                })
            });
            const data = await res.json();
            if (res.ok && data.success) {
                setPapers(prev => prev.map(p => p.id === editingPaper.id ? data.paper : p));
                setEditingPaper(null);
                setPaperFeedbackMsg('Paper updated successfully.');
                setTimeout(() => setPaperFeedbackMsg(''), 3000);
            } else {
                alert(data.error || 'Failed to update paper.');
            }
        } catch (err) {
            alert('Error updating paper: ' + err.message);
        }
    };

    // Delete paper
    const handleDeletePaper = async (paperId, paperTitle) => {
        if (!confirm(`Are you sure you want to delete paper "${paperTitle}"? The PDF file will also be permanently removed.`)) {
            return;
        }

        try {
            const res = await fetch(`/api/admin/papers?type=paper&id=${paperId}`, {
                method: 'DELETE'
            });
            const data = await res.json();
            if (res.ok && data.success) {
                setPapers(prev => prev.filter(p => p.id !== paperId));
                setPaperFeedbackMsg('Paper and PDF deleted successfully.');
                setTimeout(() => setPaperFeedbackMsg(''), 3000);
            } else {
                alert(data.error || 'Failed to delete paper.');
            }
        } catch (err) {
            alert('Error deleting paper: ' + err.message);
        }
    };

    // Students
    const fetchStudents = async () => {
        setLoading(true);
        setErrorMessage('');
        try {
            const res = await fetch('/api/admin/users');
            const data = await res.json();
            if (res.ok && data.success) {
                setStudents(data.users);
            } else {
                setErrorMessage(data.error || 'දත්ත ලබා ගැනීමට අපොහොසත් විය.');
            }
        } catch (err) {
            setErrorMessage('සම්බන්ධතා දෝෂයක්: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleCourseToggle = (studentId, courseKey) => {
        setStudents(prev => prev.map(student => {
            if (student.id !== studentId) return student;
            let updatedCourses = [...student.enrolledCourses];
            if (updatedCourses.includes(courseKey)) {
                if (courseKey !== 'free_paper') {
                    updatedCourses = updatedCourses.filter(c => c !== courseKey);
                }
            } else {
                updatedCourses.push(courseKey);
            }
            return { ...student, enrolledCourses: updatedCourses };
        }));
    };

    const handleSaveCourses = async (studentId, enrolledCourses) => {
        setActionLoading(studentId);
        setMessage('');
        setErrorMessage('');
        try {
            const res = await fetch('/api/admin/users', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: studentId, enrolledCourses })
            });
            const data = await res.json();
            if (res.ok && data.success) {
                setMessage(`ශිෂ්‍යයාගේ පාඨමාලා සාර්ථකව යාවත්කාලීන කරන ලදී!`);
                setTimeout(() => setMessage(''), 3000);
            } else {
                setErrorMessage(data.error || 'යාවත්කාලීන කිරීමට නොහැකි විය.');
            }
        } catch (err) {
            setErrorMessage('දෝෂයක් සිදුවිය: ' + err.message);
        } finally {
            setActionLoading(null);
        }
    };

    // Videos
    const fetchVideoLessons = async () => {
        setVideoLoading(true);
        setVideoError('');
        try {
            const res = await fetch('/api/admin/video');
            const data = await res.json();
            if (res.ok && data.success) {
                setVideoLessons(data.lessons);
                const inputs = {};
                data.lessons.forEach(lesson => {
                    inputs[lesson.id] = lesson.videoId;
                });
                setVideoInputs(inputs);
            } else {
                setVideoError(data.error || 'Failed to load video lessons.');
            }
        } catch (err) {
            setVideoError('Error loading video lessons: ' + err.message);
        } finally {
            setVideoLoading(false);
        }
    };

    const normalizeVideoId = (value) => {
        if (!value) return '';
        const trimmed = value.trim();
        const urlMatch = trimmed.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/|shorts\/))([\w-]{11})/);
        if (urlMatch) return urlMatch[1];
        const idMatch = trimmed.match(/^([\w-]{11})$/);
        return idMatch ? idMatch[1] : trimmed;
    };

    const handleVideoInputChange = (lessonId, value) => {
        setVideoInputs(prev => ({ ...prev, [lessonId]: value }));
    };

    const handleSaveVideoLink = async (lessonId) => {
        const rawValue = videoInputs[lessonId] || '';
        const videoId = normalizeVideoId(rawValue);
        if (!videoId) {
            setVideoError('Please provide a valid YouTube video ID or link.');
            return;
        }

        setVideoSavingId(lessonId);
        setVideoMessage('');
        setVideoError('');

        try {
            const res = await fetch('/api/admin/video', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: lessonId, videoId })
            });
            const data = await res.json();
            if (res.ok && data.success) {
                setVideoLessons(data.lessons);
                setVideoInputs(prev => ({ ...prev, [lessonId]: videoId }));
                setVideoMessage('Video link updated successfully.');
                setTimeout(() => setVideoMessage(''), 3000);
            } else {
                setVideoError(data.error || 'Failed to update video link.');
            }
        } catch (err) {
            setVideoError('Error saving video link: ' + err.message);
        } finally {
            setVideoSavingId(null);
        }
    };

    const handleAdminLogout = () => {
        setIsAuthenticated(false);
        if (typeof window !== 'undefined') {
            sessionStorage.removeItem('mathsbook_admin_session');
        }
        setPhoneInput('');
        setPasswordInput('');
        setStudents([]);
        setVideoLessons([]);
        setPapers([]);
        setTopics([]);
    };

    // Filtered papers list
    const filteredPapers = papers.filter(paper => {
        const matchesGrade = paperGradeFilter === 'all' || paper.grade === paperGradeFilter;
        const matchesTopic = paperTopicFilter === 'all' || paper.topicId === paperTopicFilter;
        const matchesSearch = !paperSearchQuery || 
            paper.title.toLowerCase().includes(paperSearchQuery.toLowerCase()) ||
            (paper.topicName && paper.topicName.toLowerCase().includes(paperSearchQuery.toLowerCase())) ||
            (paper.term && paper.term.toLowerCase().includes(paperSearchQuery.toLowerCase()));
        return matchesGrade && matchesTopic && matchesSearch;
    });

    const filteredStudents = students.filter(s => 
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.phone.includes(searchQuery) ||
        s.id.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Topics available for current upload grade
    const uploadAvailableTopics = topics.filter(t => t.grade === uploadGrade);

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
                    // ADMIN AUTH PASS GATE
                    <div style={{ maxWidth: '440px', margin: '60px auto 0 auto' }}>
                        <div style={{
                            background: 'linear-gradient(145deg, rgba(26, 31, 56, 0.95) 0%, rgba(15, 23, 42, 0.98) 100%)',
                            border: '1px solid rgba(99, 102, 241, 0.35)',
                            borderRadius: '24px',
                            padding: '2.5rem 2rem',
                            boxShadow: '0 0 50px rgba(99, 102, 241, 0.25)',
                            textAlign: 'center'
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
                                Log in with administrator credentials to manage Free Papers, Students, and Video Lessons.
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
                                    Manage Free Papers (Grade 10 & 11), Topics, Student Access, and Course Material.
                                </p>
                            </div>
                            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                                <a 
                                    href="/papers" 
                                    target="_blank" 
                                    className="btn btn-secondary btn-sm"
                                    style={{ gap: '0.4rem', textDecoration: 'none' }}
                                >
                                    <ExternalLink size={14} /> Open Papers Student View
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
                                <FileText size={16} /> Free Papers Management ({papers.length})
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
                                <Users size={16} /> Students & Enrolments ({students.length})
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
                                <BookOpen size={16} /> Video Lessons
                            </button>
                        </div>

                        {/* ============================================================ */}
                        {/* TAB 1: FREE PAPERS MANAGEMENT                                */}
                        {/* ============================================================ */}
                        {activeTab === 'papers' && (
                            <div>
                                {/* Global Notifications */}
                                {paperFeedbackMsg && (
                                    <div style={{
                                        marginBottom: '1.5rem', background: 'rgba(16, 185, 129, 0.12)',
                                        border: '1px solid rgba(16, 185, 129, 0.35)', padding: '0.9rem 1.25rem',
                                        borderRadius: '14px', color: '#6ee7b7', fontSize: '0.92rem',
                                        display: 'flex', alignItems: 'center', gap: '0.6rem'
                                    }}>
                                        <CheckCircle2 size={18} color="#10b981" />
                                        <span>{paperFeedbackMsg}</span>
                                    </div>
                                )}
                                {paperFeedbackError && (
                                    <div style={{
                                        marginBottom: '1.5rem', background: 'rgba(239, 68, 68, 0.12)',
                                        border: '1px solid rgba(239, 68, 68, 0.35)', padding: '0.9rem 1.25rem',
                                        borderRadius: '14px', color: '#fca5a5', fontSize: '0.92rem',
                                        display: 'flex', alignItems: 'center', gap: '0.6rem'
                                    }}>
                                        <AlertCircle size={18} color="#ef4444" />
                                        <span>{paperFeedbackError}</span>
                                    </div>
                                )}

                                {/* Top Stats & Actions Bar */}
                                <div style={{
                                    display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                                    gap: '1rem', marginBottom: '1.5rem'
                                }}>
                                    <div style={{
                                        background: 'rgba(26, 31, 56, 0.85)', border: '1px solid rgba(99, 102, 241, 0.2)',
                                        borderRadius: '18px', padding: '1.25rem'
                                    }}>
                                        <div style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600 }}>Total Papers Uploaded</div>
                                        <div style={{ fontSize: '2rem', fontWeight: 900, color: '#fff', marginTop: '0.2rem' }}>{papers.length}</div>
                                        <div style={{ fontSize: '0.75rem', color: '#818cf8', marginTop: '0.2rem' }}>100% Free For Students</div>
                                    </div>

                                    <div style={{
                                        background: 'rgba(26, 31, 56, 0.85)', border: '1px solid rgba(6, 182, 212, 0.2)',
                                        borderRadius: '18px', padding: '1.25rem'
                                    }}>
                                        <div style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600 }}>Grade 10 Papers</div>
                                        <div style={{ fontSize: '2rem', fontWeight: 900, color: '#06b6d4', marginTop: '0.2rem' }}>
                                            {papers.filter(p => p.grade === 'grade_10').length}
                                        </div>
                                        <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.2rem' }}>
                                            {topics.filter(t => t.grade === 'grade_10').length} Topics/Folders
                                        </div>
                                    </div>

                                    <div style={{
                                        background: 'rgba(26, 31, 56, 0.85)', border: '1px solid rgba(245, 158, 11, 0.2)',
                                        borderRadius: '18px', padding: '1.25rem'
                                    }}>
                                        <div style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600 }}>Grade 11 Papers</div>
                                        <div style={{ fontSize: '2rem', fontWeight: 900, color: '#f59e0b', marginTop: '0.2rem' }}>
                                            {papers.filter(p => p.grade === 'grade_11').length}
                                        </div>
                                        <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.2rem' }}>
                                            {topics.filter(t => t.grade === 'grade_11').length} Topics/Folders
                                        </div>
                                    </div>

                                    <div style={{
                                        background: 'rgba(26, 31, 56, 0.85)', border: '1px solid rgba(16, 185, 129, 0.2)',
                                        borderRadius: '18px', padding: '1.25rem', display: 'flex', flexDirection: 'column',
                                        justifyContent: 'center', gap: '0.6rem'
                                    }}>
                                        <button 
                                            className="btn btn-primary"
                                            onClick={() => {
                                                setShowUploadModal(true);
                                                setUploadModalError('');
                                            }}
                                            style={{ width: '100%', justifyContent: 'center', gap: '0.4rem', fontSize: '0.88rem' }}
                                        >
                                            <Upload size={15} /> Upload PDF Paper
                                        </button>
                                        <button 
                                            className="btn btn-secondary"
                                            onClick={() => {
                                                setShowTopicModal(true);
                                                setTopicModalError('');
                                            }}
                                            style={{ width: '100%', justifyContent: 'center', gap: '0.4rem', fontSize: '0.88rem' }}
                                        >
                                            <FolderPlus size={15} /> Create Topic/Folder
                                        </button>
                                    </div>
                                </div>

                                {/* Filter Controls */}
                                <div style={{
                                    background: 'rgba(26, 31, 56, 0.65)', border: '1px solid rgba(255,255,255,0.06)',
                                    borderRadius: '20px', padding: '1.25rem', marginBottom: '1.5rem',
                                    display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center'
                                }}>
                                    {/* Grade filter tabs */}
                                    <div style={{ display: 'flex', gap: '0.4rem', background: 'rgba(15, 23, 42, 0.8)', padding: '4px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.06)' }}>
                                        <button
                                            onClick={() => { setPaperGradeFilter('all'); setPaperTopicFilter('all'); }}
                                            style={{
                                                padding: '0.45rem 0.9rem', borderRadius: '8px', border: 'none',
                                                background: paperGradeFilter === 'all' ? '#6366f1' : 'transparent',
                                                color: paperGradeFilter === 'all' ? '#fff' : '#94a3b8',
                                                fontWeight: 600, fontSize: '0.82rem', cursor: 'pointer'
                                            }}
                                        >
                                            All Grades
                                        </button>
                                        <button
                                            onClick={() => { setPaperGradeFilter('grade_10'); setPaperTopicFilter('all'); }}
                                            style={{
                                                padding: '0.45rem 0.9rem', borderRadius: '8px', border: 'none',
                                                background: paperGradeFilter === 'grade_10' ? '#06b6d4' : 'transparent',
                                                color: paperGradeFilter === 'grade_10' ? '#fff' : '#94a3b8',
                                                fontWeight: 600, fontSize: '0.82rem', cursor: 'pointer'
                                            }}
                                        >
                                            Grade 10
                                        </button>
                                        <button
                                            onClick={() => { setPaperGradeFilter('grade_11'); setPaperTopicFilter('all'); }}
                                            style={{
                                                padding: '0.45rem 0.9rem', borderRadius: '8px', border: 'none',
                                                background: paperGradeFilter === 'grade_11' ? '#f59e0b' : 'transparent',
                                                color: paperGradeFilter === 'grade_11' ? '#fff' : '#94a3b8',
                                                fontWeight: 600, fontSize: '0.82rem', cursor: 'pointer'
                                            }}
                                        >
                                            Grade 11
                                        </button>
                                    </div>

                                    {/* Topic filter dropdown */}
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <Filter size={15} style={{ color: '#64748b' }} />
                                        <select
                                            value={paperTopicFilter}
                                            onChange={(e) => setPaperTopicFilter(e.target.value)}
                                            style={{
                                                background: '#090d16', color: '#fff', border: '1px solid rgba(99, 102, 241, 0.3)',
                                                padding: '0.5rem 0.9rem', borderRadius: '10px', fontSize: '0.85rem', outline: 'none'
                                            }}
                                        >
                                            <option value="all">All Topics / Folders</option>
                                            {topics
                                                .filter(t => paperGradeFilter === 'all' || t.grade === paperGradeFilter)
                                                .map(t => (
                                                    <option key={t.id} value={t.id}>
                                                        [{t.grade === 'grade_10' ? 'Grade 10' : 'Grade 11'}] {t.name}
                                                    </option>
                                                ))
                                            }
                                        </select>
                                    </div>

                                    {/* Search input */}
                                    <div style={{
                                        flex: 1, minWidth: '220px', display: 'flex', alignItems: 'center',
                                        gap: '0.6rem', background: '#090d16', border: '1px solid rgba(255,255,255,0.08)',
                                        borderRadius: '10px', padding: '0.45rem 0.85rem'
                                    }}>
                                        <Search size={16} style={{ color: '#64748b' }} />
                                        <input
                                            type="text"
                                            placeholder="Search papers by title, topic..."
                                            value={paperSearchQuery}
                                            onChange={(e) => setPaperSearchQuery(e.target.value)}
                                            style={{
                                                background: 'none', border: 'none', outline: 'none',
                                                color: '#fff', fontSize: '0.85rem', width: '100%'
                                            }}
                                        />
                                    </div>

                                    <button 
                                        onClick={fetchPapersAndTopics}
                                        disabled={papersLoading}
                                        className="btn btn-secondary btn-sm"
                                        style={{ gap: '0.4rem' }}
                                    >
                                        <RefreshCw size={13} className={papersLoading ? 'animate-spin' : ''} /> Refresh
                                    </button>
                                </div>

                                {/* Manage Topics Accordion / Summary */}
                                <div style={{
                                    background: 'rgba(15, 23, 42, 0.7)', border: '1px solid rgba(255,255,255,0.06)',
                                    borderRadius: '18px', padding: '1.25rem', marginBottom: '1.5rem'
                                }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                                        <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#e2e8f0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            <Layers size={16} color="#818cf8" /> Topics / Categories Summary
                                        </h4>
                                        <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>{topics.length} total topics</span>
                                    </div>

                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem' }}>
                                        {topics.map(topic => {
                                            const paperCount = papers.filter(p => p.topicId === topic.id).length;
                                            return (
                                                <div 
                                                    key={topic.id}
                                                    style={{
                                                        background: 'rgba(26, 31, 56, 0.95)',
                                                        border: `1px solid ${topic.grade === 'grade_10' ? 'rgba(6, 182, 212, 0.3)' : 'rgba(245, 158, 11, 0.3)'}`,
                                                        padding: '0.4rem 0.75rem', borderRadius: '10px',
                                                        display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem'
                                                    }}
                                                >
                                                    <span style={{
                                                        fontWeight: 700,
                                                        color: topic.grade === 'grade_10' ? '#06b6d4' : '#f59e0b'
                                                    }}>
                                                        {topic.grade === 'grade_10' ? 'G10' : 'G11'}
                                                    </span>
                                                    <span style={{ color: '#fff' }}>{topic.name}</span>
                                                    <span style={{
                                                        background: 'rgba(255,255,255,0.1)', padding: '1px 6px',
                                                        borderRadius: '6px', fontSize: '0.72rem', color: '#94a3b8'
                                                    }}>
                                                        {paperCount} papers
                                                    </span>
                                                    <button
                                                        onClick={() => handleDeleteTopic(topic.id, topic.name)}
                                                        title="Delete topic"
                                                        style={{
                                                            background: 'none', border: 'none', color: '#f87171',
                                                            cursor: 'pointer', padding: '2px', display: 'flex', alignItems: 'center'
                                                        }}
                                                    >
                                                        <Trash2 size={13} />
                                                    </button>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Papers List Table / Cards */}
                                {papersLoading ? (
                                    <div style={{ textAlign: 'center', padding: '3rem' }}>
                                        <RefreshCw size={32} className="animate-spin" style={{ color: '#6366f1', margin: '0 auto 1rem auto' }} />
                                        <p style={{ color: '#94a3b8' }}>Loading papers database...</p>
                                    </div>
                                ) : filteredPapers.length === 0 ? (
                                    <div style={{
                                        background: 'rgba(18, 26, 43, 0.75)', border: '1px solid rgba(255,255,255,0.05)',
                                        borderRadius: '20px', padding: '3.5rem 2rem', textAlign: 'center'
                                    }}>
                                        <FileText size={48} style={{ color: '#64748b', marginBottom: '1rem', opacity: 0.5 }} />
                                        <h4 style={{ fontSize: '1.1rem', color: '#e2e8f0', marginBottom: '0.4rem' }}>No papers found</h4>
                                        <p style={{ color: '#94a3b8', fontSize: '0.88rem', marginBottom: '1.25rem' }}>
                                            No papers match the current filters. Upload a new PDF paper from your computer.
                                        </p>
                                        <button 
                                            className="btn btn-primary btn-sm"
                                            onClick={() => setShowUploadModal(true)}
                                            style={{ gap: '0.4rem' }}
                                        >
                                            <Upload size={14} /> Upload First PDF Paper
                                        </button>
                                    </div>
                                ) : (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
                                        {filteredPapers.map(paper => (
                                            <div 
                                                key={paper.id}
                                                style={{
                                                    background: 'linear-gradient(135deg, rgba(26, 31, 56, 0.95) 0%, rgba(15, 23, 42, 0.95) 100%)',
                                                    border: '1px solid rgba(99, 102, 241, 0.25)',
                                                    borderRadius: '16px', padding: '1.2rem 1.4rem',
                                                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                                    flexWrap: 'wrap', gap: '1rem', transition: 'all 0.2s ease'
                                                }}
                                            >
                                                {/* Left: Paper info */}
                                                <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', flex: '1 1 320px' }}>
                                                    <div style={{
                                                        width: '42px', height: '42px', borderRadius: '12px',
                                                        background: paper.grade === 'grade_10' ? 'rgba(6, 182, 212, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                                                        border: `1px solid ${paper.grade === 'grade_10' ? 'rgba(6, 182, 212, 0.3)' : 'rgba(245, 158, 11, 0.3)'}`,
                                                        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                                                    }}>
                                                        <FileText size={22} color={paper.grade === 'grade_10' ? '#06b6d4' : '#f59e0b'} />
                                                    </div>

                                                    <div>
                                                        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap', marginBottom: '0.25rem' }}>
                                                            <span style={{
                                                                background: paper.grade === 'grade_10' ? 'rgba(6, 182, 212, 0.2)' : 'rgba(245, 158, 11, 0.2)',
                                                                color: paper.grade === 'grade_10' ? '#22d3ee' : '#fbbf24',
                                                                fontSize: '0.7rem', padding: '1px 7px', borderRadius: '999px', fontWeight: 700
                                                            }}>
                                                                {paper.grade === 'grade_10' ? 'Grade 10' : 'Grade 11'}
                                                            </span>
                                                            <span style={{
                                                                background: 'rgba(99, 102, 241, 0.15)', color: '#a5b4fc',
                                                                fontSize: '0.7rem', padding: '1px 7px', borderRadius: '999px', fontWeight: 600
                                                            }}>
                                                                📁 {paper.topicName || 'General Topic'}
                                                            </span>
                                                            <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                                                                {paper.term || 'Model Paper'} • {paper.year || '2026'}
                                                            </span>
                                                        </div>

                                                        <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#f8fafc', marginBottom: '0.3rem' }}>
                                                            {paper.title}
                                                        </h4>

                                                        <div style={{ fontSize: '0.78rem', color: '#94a3b8', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                                                            <span>File: <strong style={{ color: '#cbd5e1' }}>{paper.fileName}</strong></span>
                                                            <span>Size: <strong>{paper.fileSize}</strong></span>
                                                            <span>Downloads: <strong style={{ color: '#34d399' }}>{paper.downloads || 0}</strong></span>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Right: Actions */}
                                                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                                    <a 
                                                        href={paper.fileUrl} 
                                                        target="_blank" 
                                                        rel="noreferrer"
                                                        className="btn btn-secondary btn-sm"
                                                        style={{ gap: '0.35rem', fontSize: '0.8rem', textDecoration: 'none' }}
                                                    >
                                                        <Eye size={13} /> View PDF
                                                    </a>

                                                    <button
                                                        onClick={() => setEditingPaper({ ...paper })}
                                                        className="btn btn-secondary btn-sm"
                                                        style={{ gap: '0.35rem', fontSize: '0.8rem' }}
                                                    >
                                                        <Edit3 size={13} /> Edit
                                                    </button>

                                                    <button
                                                        onClick={() => handleDeletePaper(paper.id, paper.title)}
                                                        className="btn btn-tertiary btn-sm"
                                                        style={{ gap: '0.35rem', fontSize: '0.8rem', borderColor: 'rgba(239, 68, 68, 0.3)', color: '#f87171' }}
                                                    >
                                                        <Trash2 size={13} /> Delete
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* ============================================================ */}
                        {/* TAB 2: STUDENTS & COURSES                                    */}
                        {/* ============================================================ */}
                        {activeTab === 'students' && (
                            <div>
                                {/* Heading & stats */}
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.25rem', marginBottom: '1.5rem' }}>
                                    <div>
                                        <h3 style={{ fontSize: '1.4rem', fontWeight: 800 }}>Student Enrolment Management</h3>
                                        <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginTop: '0.2rem' }}>
                                            Assign paid classes and verify student accounts. Note that Free Papers access is 100% active for all registered students.
                                        </p>
                                    </div>
                                    <button className="btn btn-secondary btn-sm" onClick={fetchStudents} disabled={loading} style={{ gap: '0.5rem' }}>
                                        <RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> Refresh List
                                    </button>
                                </div>

                                {message && (
                                    <div style={{ marginBottom: '1.5rem', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '0.85rem 1.25rem', borderRadius: '16px', color: '#6ee7b7', fontSize: '0.9rem' }}>
                                        {message}
                                    </div>
                                )}

                                {errorMessage && (
                                    <div style={{ marginBottom: '1.5rem', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', padding: '0.85rem 1.25rem', borderRadius: '16px', color: '#fca5a5', fontSize: '0.9rem' }}>
                                        {errorMessage}
                                    </div>
                                )}

                                {/* Search Toolbar */}
                                <div style={{
                                    background: 'rgba(26, 31, 56, 0.6)', border: '1px solid rgba(255, 255, 255, 0.05)',
                                    borderRadius: '20px', padding: '1rem 1.5rem', marginBottom: '1.5rem',
                                    display: 'flex', alignItems: 'center', gap: '1rem'
                                }}>
                                    <Search size={20} style={{ color: '#64748b' }} />
                                    <input 
                                        type="text"
                                        placeholder="Search by student name, phone, or ID..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        style={{ flex: 1, background: 'none', border: 'none', color: '#fff', outline: 'none', fontSize: '0.95rem' }}
                                    />
                                    <div style={{ fontSize: '0.85rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                        <Users size={16} /> Total: {students.length}
                                    </div>
                                </div>

                                {/* Students list */}
                                {loading ? (
                                    <div style={{ textAlign: 'center', padding: '3rem' }}>
                                        <RefreshCw size={36} className="animate-spin" style={{ color: '#6366f1', margin: '0 auto 1rem auto' }} />
                                        <p style={{ color: '#94a3b8' }}>Loading registered students...</p>
                                    </div>
                                ) : filteredStudents.length === 0 ? (
                                    <div style={{ background: 'rgba(18, 26, 43, 0.75)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '24px', padding: '4rem 2rem', textAlign: 'center' }}>
                                        <Users size={48} style={{ color: '#64748b', marginBottom: '1rem', opacity: 0.5 }} />
                                        <p style={{ color: '#94a3b8' }}>No students registered yet.</p>
                                    </div>
                                ) : (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                                        {filteredStudents.map(student => (
                                            <div key={student.id} style={{
                                                background: 'linear-gradient(135deg, rgba(18, 26, 43, 0.8) 0%, rgba(15, 23, 42, 0.95) 100%)',
                                                border: '1px solid rgba(99, 102, 241, 0.25)', borderRadius: '24px', padding: '1.5rem',
                                                display: 'flex', flexDirection: 'column', gap: '1.25rem'
                                            }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '0.85rem' }}>
                                                    <div>
                                                        <h4 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#f8fafc' }}>
                                                            {student.name}
                                                        </h4>
                                                        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '0.2rem', fontSize: '0.8rem', color: '#94a3b8' }}>
                                                            <span>Student ID: <strong style={{ color: '#06b6d4' }}>{student.id}</strong></span>
                                                            <span>Phone: <strong>{student.phone}</strong></span>
                                                            <span>Password: <strong style={{ color: '#c7d2fe' }}>{student.password}</strong></span>
                                                        </div>
                                                    </div>
                                                    <button 
                                                        className="btn btn-primary btn-sm"
                                                        disabled={actionLoading === student.id}
                                                        onClick={() => handleSaveCourses(student.id, student.enrolledCourses)}
                                                        style={{ gap: '0.4rem', height: 'fit-content' }}
                                                    >
                                                        {actionLoading === student.id ? <RefreshCw size={14} className="animate-spin" /> : <Save size={14} />}
                                                        {actionLoading === student.id ? 'Saving...' : 'Save Courses'}
                                                    </button>
                                                </div>

                                                <div>
                                                    <span style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', color: '#64748b', display: 'block', marginBottom: '0.75rem' }}>
                                                        Assigned Courses:
                                                    </span>
                                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
                                                        {availableCourses.map(course => {
                                                            const isChecked = student.enrolledCourses.includes(course.key);
                                                            return (
                                                                <label 
                                                                    key={course.key}
                                                                    style={{
                                                                        display: 'flex', alignItems: 'center', gap: '0.65rem',
                                                                        padding: '0.75rem 1rem', borderRadius: '12px',
                                                                        background: isChecked ? 'rgba(99, 102, 241, 0.15)' : 'rgba(255,255,255,0.02)',
                                                                        border: isChecked ? '1px solid rgba(99, 102, 241, 0.4)' : '1px solid rgba(255,255,255,0.05)',
                                                                        cursor: course.locked ? 'not-allowed' : 'pointer', userSelect: 'none'
                                                                    }}
                                                                >
                                                                    <input 
                                                                        type="checkbox"
                                                                        checked={isChecked}
                                                                        disabled={course.locked}
                                                                        onChange={() => handleCourseToggle(student.id, course.key)}
                                                                        style={{ accentColor: '#6366f1', width: '16px', height: '16px', cursor: course.locked ? 'not-allowed' : 'pointer' }}
                                                                    />
                                                                    <span style={{ fontSize: '0.85rem', color: isChecked ? '#fff' : '#94a3b8', fontWeight: isChecked ? 600 : 500 }}>
                                                                        {course.label}
                                                                    </span>
                                                                </label>
                                                            );
                                                        })}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* ============================================================ */}
                        {/* TAB 3: VIDEO LESSONS                                         */}
                        {/* ============================================================ */}
                        {activeTab === 'videos' && (
                            <div style={{ background: 'rgba(15, 23, 42, 0.95)', border: '1px solid rgba(99, 102, 241, 0.25)', borderRadius: '24px', padding: '1.5rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                                    <div>
                                        <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#f8fafc' }}>Video Links Management</h3>
                                        <p style={{ color: '#94a3b8', marginTop: '0.3rem' }}>
                                            Update the YouTube video ID or link for each lesson. Only students with course access can view these videos.
                                        </p>
                                    </div>
                                    <button className="btn btn-secondary btn-sm" onClick={fetchVideoLessons} disabled={videoLoading} style={{ gap: '0.5rem' }}>
                                        <RefreshCw size={14} className={videoLoading ? 'animate-spin' : ''} /> Refresh Videos
                                    </button>
                                </div>

                                {videoMessage && (
                                    <div style={{ marginTop: '1rem', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '0.85rem 1.25rem', borderRadius: '16px', color: '#6ee7b7', fontSize: '0.9rem' }}>
                                        {videoMessage}
                                    </div>
                                )}
                                {videoError && (
                                    <div style={{ marginTop: '1rem', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', padding: '0.85rem 1.25rem', borderRadius: '16px', color: '#fca5a5', fontSize: '0.9rem' }}>
                                        {videoError}
                                    </div>
                                )}

                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem', marginTop: '1.25rem' }}>
                                    {videoLessons.map(lesson => (
                                        <div key={lesson.id} style={{ background: 'rgba(26, 31, 56, 0.95)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '20px', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
                                            <div>
                                                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#c7d2fe', marginBottom: '0.5rem' }}>{lesson.title}</div>
                                                <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Course: {lesson.course}</div>
                                            </div>
                                            <label style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '0.85rem', color: '#94a3b8' }}>
                                                YouTube Video ID or Link
                                                <input
                                                    type="text"
                                                    value={videoInputs[lesson.id] || ''}
                                                    onChange={(e) => handleVideoInputChange(lesson.id, e.target.value)}
                                                    placeholder="dQw4w9WgXcQ"
                                                    style={{ width: '100%', padding: '0.85rem 1rem', borderRadius: '12px', border: '1px solid rgba(99, 102, 241, 0.3)', background: '#0f172a', color: '#fff', outline: 'none' }}
                                                />
                                            </label>
                                            <button
                                                className="btn btn-primary btn-sm"
                                                onClick={() => handleSaveVideoLink(lesson.id)}
                                                disabled={videoSavingId === lesson.id}
                                                style={{ justifyContent: 'center', gap: '0.5rem' }}
                                            >
                                                {videoSavingId === lesson.id ? <RefreshCw size={14} className="animate-spin" /> : <Save size={14} />}
                                                {videoSavingId === lesson.id ? 'Saving...' : 'Save Video'}
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}

            </main>

            {/* ============================================================ */}
            {/* MODAL: DIRECT PDF UPLOAD FROM COMPUTER                       */}
            {/* ============================================================ */}
            {showUploadModal && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
                    background: 'rgba(0, 0, 0, 0.75)', backdropFilter: 'blur(8px)',
                    zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem'
                }}>
                    <div style={{
                        background: 'linear-gradient(145deg, #131b2e 0%, #0c121e 100%)',
                        border: '1px solid rgba(99, 102, 241, 0.4)', borderRadius: '24px',
                        width: '100%', maxWidth: '540px', padding: '2rem',
                        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                                <div style={{
                                    width: '36px', height: '36px', borderRadius: '10px',
                                    background: 'rgba(99, 102, 241, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center'
                                }}>
                                    <Upload size={18} color="#818cf8" />
                                </div>
                                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff' }}>Upload Free PDF Paper</h3>
                            </div>
                            <button 
                                onClick={() => setShowUploadModal(false)}
                                style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {uploadModalError && (
                            <div style={{
                                marginBottom: '1rem', background: 'rgba(239, 68, 68, 0.15)',
                                border: '1px solid rgba(239, 68, 68, 0.3)', padding: '0.75rem 1rem',
                                borderRadius: '12px', color: '#fca5a5', fontSize: '0.85rem'
                            }}>
                                {uploadModalError}
                            </div>
                        )}

                        <form onSubmit={handleUploadPaper} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {/* File Picker Zone */}
                            <div>
                                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '0.4rem' }}>
                                    Select PDF File from your Computer *
                                </label>
                                <div 
                                    onClick={() => fileInputRef.current?.click()}
                                    style={{
                                        border: '2px dashed rgba(99, 102, 241, 0.4)', borderRadius: '14px',
                                        padding: '1.5rem', textAlign: 'center', cursor: 'pointer',
                                        background: uploadFile ? 'rgba(99, 102, 241, 0.1)' : 'rgba(255,255,255,0.02)',
                                        transition: 'all 0.2s ease'
                                    }}
                                >
                                    <input 
                                        type="file"
                                        ref={fileInputRef}
                                        accept=".pdf,application/pdf"
                                        onChange={(e) => setUploadFile(e.target.files[0] || null)}
                                        style={{ display: 'none' }}
                                    />
                                    <FileText size={32} style={{ color: uploadFile ? '#34d399' : '#818cf8', margin: '0 auto 0.5rem auto' }} />
                                    {uploadFile ? (
                                        <div>
                                            <div style={{ color: '#34d399', fontWeight: 700, fontSize: '0.9rem' }}>{uploadFile.name}</div>
                                            <div style={{ color: '#94a3b8', fontSize: '0.75rem', marginTop: '0.2rem' }}>
                                                {(uploadFile.size / 1024 / 1024).toFixed(2)} MB • Click to replace file
                                            </div>
                                        </div>
                                    ) : (
                                        <div>
                                            <div style={{ color: '#fff', fontWeight: 600, fontSize: '0.9rem' }}>Click to browse and choose PDF</div>
                                            <div style={{ color: '#64748b', fontSize: '0.75rem', marginTop: '0.2rem' }}>Only .pdf files are accepted</div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Paper Title */}
                            <div>
                                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '0.4rem' }}>
                                    Paper Title / Name *
                                </label>
                                <input 
                                    type="text"
                                    required
                                    placeholder="e.g. Grade 10 Algebra - Term 1 Practice Paper"
                                    value={uploadTitle}
                                    onChange={(e) => setUploadTitle(e.target.value)}
                                    style={{
                                        width: '100%', padding: '0.75rem 1rem', background: '#090d16',
                                        border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px',
                                        color: '#fff', fontSize: '0.9rem', outline: 'none'
                                    }}
                                />
                            </div>

                            {/* Grade & Topic Selectors */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '0.4rem' }}>
                                        Target Grade *
                                    </label>
                                    <select
                                        value={uploadGrade}
                                        onChange={(e) => {
                                            setUploadGrade(e.target.value);
                                            setUploadTopicId('');
                                        }}
                                        style={{
                                            width: '100%', padding: '0.75rem 0.8rem', background: '#090d16',
                                            border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px',
                                            color: '#fff', fontSize: '0.88rem', outline: 'none'
                                        }}
                                    >
                                        <option value="grade_10">Grade 10</option>
                                        <option value="grade_11">Grade 11</option>
                                    </select>
                                </div>

                                <div>
                                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '0.4rem' }}>
                                        Topic / Folder *
                                    </label>
                                    <select
                                        value={uploadTopicId}
                                        onChange={(e) => setUploadTopicId(e.target.value)}
                                        style={{
                                            width: '100%', padding: '0.75rem 0.8rem', background: '#090d16',
                                            border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px',
                                            color: '#fff', fontSize: '0.88rem', outline: 'none'
                                        }}
                                    >
                                        <option value="">Select Topic...</option>
                                        {uploadAvailableTopics.map(t => (
                                            <option key={t.id} value={t.id}>{t.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Year & Exam Type */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '0.4rem' }}>
                                        Year
                                    </label>
                                    <input 
                                        type="text"
                                        placeholder="2026"
                                        value={uploadYear}
                                        onChange={(e) => setUploadYear(e.target.value)}
                                        style={{
                                            width: '100%', padding: '0.75rem 1rem', background: '#090d16',
                                            border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px',
                                            color: '#fff', fontSize: '0.9rem', outline: 'none'
                                        }}
                                    />
                                </div>

                                <div>
                                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '0.4rem' }}>
                                        Exam / Term Type
                                    </label>
                                    <input 
                                        type="text"
                                        placeholder="Model Paper / Term 1"
                                        value={uploadTerm}
                                        onChange={(e) => setUploadTerm(e.target.value)}
                                        style={{
                                            width: '100%', padding: '0.75rem 1rem', background: '#090d16',
                                            border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px',
                                            color: '#fff', fontSize: '0.9rem', outline: 'none'
                                        }}
                                    />
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                                <button
                                    type="button"
                                    onClick={() => setShowUploadModal(false)}
                                    className="btn btn-secondary"
                                    style={{ flex: 1, justifyContent: 'center' }}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={uploadLoading}
                                    className="btn btn-primary"
                                    style={{ flex: 2, justifyContent: 'center', gap: '0.5rem' }}
                                >
                                    {uploadLoading ? <RefreshCw size={15} className="animate-spin" /> : <Upload size={15} />}
                                    {uploadLoading ? 'Uploading PDF...' : 'Upload PDF Paper'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* ============================================================ */}
            {/* MODAL: CREATE NEW TOPIC/FOLDER                               */}
            {/* ============================================================ */}
            {showTopicModal && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
                    background: 'rgba(0, 0, 0, 0.75)', backdropFilter: 'blur(8px)',
                    zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem'
                }}>
                    <div style={{
                        background: 'linear-gradient(145deg, #131b2e 0%, #0c121e 100%)',
                        border: '1px solid rgba(99, 102, 241, 0.4)', borderRadius: '24px',
                        width: '100%', maxWidth: '480px', padding: '2rem',
                        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                                <div style={{
                                    width: '36px', height: '36px', borderRadius: '10px',
                                    background: 'rgba(6, 182, 212, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center'
                                }}>
                                    <FolderPlus size={18} color="#06b6d4" />
                                </div>
                                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff' }}>Create Topic / Folder</h3>
                            </div>
                            <button 
                                onClick={() => setShowTopicModal(false)}
                                style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {topicModalError && (
                            <div style={{
                                marginBottom: '1rem', background: 'rgba(239, 68, 68, 0.15)',
                                border: '1px solid rgba(239, 68, 68, 0.3)', padding: '0.75rem 1rem',
                                borderRadius: '12px', color: '#fca5a5', fontSize: '0.85rem'
                            }}>
                                {topicModalError}
                            </div>
                        )}

                        <form onSubmit={handleCreateTopic} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '0.4rem' }}>
                                    Select Grade *
                                </label>
                                <select
                                    value={newTopicGrade}
                                    onChange={(e) => setNewTopicGrade(e.target.value)}
                                    style={{
                                        width: '100%', padding: '0.75rem 0.8rem', background: '#090d16',
                                        border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px',
                                        color: '#fff', fontSize: '0.88rem', outline: 'none'
                                    }}
                                >
                                    <option value="grade_10">Grade 10</option>
                                    <option value="grade_11">Grade 11</option>
                                </select>
                            </div>

                            <div>
                                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '0.4rem' }}>
                                    Topic / Folder Name *
                                </label>
                                <input 
                                    type="text"
                                    required
                                    placeholder="e.g. Algebra (වීජගණිතය) or Geometry"
                                    value={newTopicName}
                                    onChange={(e) => setNewTopicName(e.target.value)}
                                    style={{
                                        width: '100%', padding: '0.75rem 1rem', background: '#090d16',
                                        border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px',
                                        color: '#fff', fontSize: '0.9rem', outline: 'none'
                                    }}
                                />
                            </div>

                            <div>
                                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '0.4rem' }}>
                                    Description / Notes (Optional)
                                </label>
                                <textarea 
                                    rows={2}
                                    placeholder="Brief details about what papers are in this topic"
                                    value={newTopicDesc}
                                    onChange={(e) => setNewTopicDesc(e.target.value)}
                                    style={{
                                        width: '100%', padding: '0.75rem 1rem', background: '#090d16',
                                        border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px',
                                        color: '#fff', fontSize: '0.9rem', outline: 'none', resize: 'none'
                                    }}
                                />
                            </div>

                            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                                <button
                                    type="button"
                                    onClick={() => setShowTopicModal(false)}
                                    className="btn btn-secondary"
                                    style={{ flex: 1, justifyContent: 'center' }}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={topicLoading}
                                    className="btn btn-primary"
                                    style={{ flex: 2, justifyContent: 'center', gap: '0.5rem' }}
                                >
                                    {topicLoading ? <RefreshCw size={15} className="animate-spin" /> : <FolderPlus size={15} />}
                                    {topicLoading ? 'Creating...' : 'Create Topic'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* ============================================================ */}
            {/* MODAL: EDIT PAPER                                            */}
            {/* ============================================================ */}
            {editingPaper && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
                    background: 'rgba(0, 0, 0, 0.75)', backdropFilter: 'blur(8px)',
                    zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem'
                }}>
                    <div style={{
                        background: 'linear-gradient(145deg, #131b2e 0%, #0c121e 100%)',
                        border: '1px solid rgba(99, 102, 241, 0.4)', borderRadius: '24px',
                        width: '100%', maxWidth: '480px', padding: '2rem',
                        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff' }}>Edit Paper Information</h3>
                            <button 
                                onClick={() => setEditingPaper(null)}
                                style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSaveEditPaper} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '0.4rem' }}>
                                    Paper Title
                                </label>
                                <input 
                                    type="text"
                                    required
                                    value={editingPaper.title}
                                    onChange={(e) => setEditingPaper({ ...editingPaper, title: e.target.value })}
                                    style={{
                                        width: '100%', padding: '0.75rem 1rem', background: '#090d16',
                                        border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px',
                                        color: '#fff', fontSize: '0.9rem', outline: 'none'
                                    }}
                                />
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '0.4rem' }}>
                                        Grade
                                    </label>
                                    <select
                                        value={editingPaper.grade}
                                        onChange={(e) => setEditingPaper({ ...editingPaper, grade: e.target.value })}
                                        style={{
                                            width: '100%', padding: '0.75rem 0.8rem', background: '#090d16',
                                            border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px',
                                            color: '#fff', fontSize: '0.88rem', outline: 'none'
                                        }}
                                    >
                                        <option value="grade_10">Grade 10</option>
                                        <option value="grade_11">Grade 11</option>
                                    </select>
                                </div>

                                <div>
                                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '0.4rem' }}>
                                        Topic / Folder
                                    </label>
                                    <select
                                        value={editingPaper.topicId}
                                        onChange={(e) => setEditingPaper({ ...editingPaper, topicId: e.target.value })}
                                        style={{
                                            width: '100%', padding: '0.75rem 0.8rem', background: '#090d16',
                                            border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px',
                                            color: '#fff', fontSize: '0.88rem', outline: 'none'
                                        }}
                                    >
                                        {topics.filter(t => t.grade === editingPaper.grade).map(t => (
                                            <option key={t.id} value={t.id}>{t.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '0.4rem' }}>
                                        Year
                                    </label>
                                    <input 
                                        type="text"
                                        value={editingPaper.year || ''}
                                        onChange={(e) => setEditingPaper({ ...editingPaper, year: e.target.value })}
                                        style={{
                                            width: '100%', padding: '0.75rem 1rem', background: '#090d16',
                                            border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px',
                                            color: '#fff', fontSize: '0.9rem', outline: 'none'
                                        }}
                                    />
                                </div>

                                <div>
                                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '0.4rem' }}>
                                        Term / Exam Type
                                    </label>
                                    <input 
                                        type="text"
                                        value={editingPaper.term || ''}
                                        onChange={(e) => setEditingPaper({ ...editingPaper, term: e.target.value })}
                                        style={{
                                            width: '100%', padding: '0.75rem 1rem', background: '#090d16',
                                            border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px',
                                            color: '#fff', fontSize: '0.9rem', outline: 'none'
                                        }}
                                    />
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                                <button
                                    type="button"
                                    onClick={() => setEditingPaper(null)}
                                    className="btn btn-secondary"
                                    style={{ flex: 1, justifyContent: 'center' }}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                    style={{ flex: 2, justifyContent: 'center', gap: '0.5rem' }}
                                >
                                    <Save size={15} /> Save Changes
                                </button>
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
