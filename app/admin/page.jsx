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
  FileSpreadsheet, Clock, Check, Send, Play, Video, Phone, UserCheck,
  ClipboardList, GraduationCap
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
    // Students Management State
    // ==========================================
    const [students, setStudents] = useState([]);
    const [studentSearch, setStudentSearch] = useState('');
    const [studentCourseFilter, setStudentCourseFilter] = useState('all');
    const [studentsLoading, setStudentsLoading] = useState(false);
    const [editingStudent, setEditingStudent] = useState(null);
    const [editingCourses, setEditingCourses] = useState([]);
    const [savingStudentCourses, setSavingStudentCourses] = useState(false);
    const [studentFeedbackMsg, setStudentFeedbackMsg] = useState('');
    const [studentFeedbackErr, setStudentFeedbackErr] = useState('');

    // ==========================================
    // Video Lessons Management State
    // ==========================================
    const [videoLessons, setVideoLessons] = useState([]);
    const [videoLoading, setVideoLoading] = useState(false);
    const [videoCourseFilter, setVideoCourseFilter] = useState('all');
    const [videoSearch, setVideoSearch] = useState('');
    const [showVideoModal, setShowVideoModal] = useState(false);
    const [editingVideo, setEditingVideo] = useState(null);
    const [videoFormTitle, setVideoFormTitle] = useState('');
    const [videoFormCourse, setVideoFormCourse] = useState('grade_10');
    const [videoFormDuration, setVideoFormDuration] = useState('1h 30m');
    const [videoFormUrl, setVideoFormUrl] = useState('');
    const [videoSubmitting, setVideoSubmitting] = useState(false);
    const [videoModalError, setVideoModalError] = useState('');
    const [videoFeedbackMsg, setVideoFeedbackMsg] = useState('');
    const [videoFeedbackErr, setVideoFeedbackErr] = useState('');

    // ==========================================
    // Enrollments Management State
    // ==========================================
    const [enrollments, setEnrollments] = useState([]);
    const [enrollmentsLoading, setEnrollmentsLoading] = useState(false);
    const [enrollmentSearch, setEnrollmentSearch] = useState('');
    const [enrollmentCourseFilter, setEnrollmentCourseFilter] = useState('all');
    const [enrollmentFeedbackMsg, setEnrollmentFeedbackMsg] = useState('');
    const [enrollmentFeedbackErr, setEnrollmentFeedbackErr] = useState('');

    const ADMIN_CREDENTIALS = {
        phone: '0715747680',
        password: 'supermigara',
        role: 'admin'
    };

    const COURSE_CONFIG = [
        { key: 'free_paper', label: '📑 Free Papers & Seminars', short: 'Free Paper', color: '#10b981', bg: 'rgba(16, 185, 129, 0.15)', border: 'rgba(16, 185, 129, 0.35)', locked: true },
        { key: 'grade_10', label: '📘 10 ශ්‍රේණිය - සිද්ධාන්ත සහ පුනරීක්ෂණ', short: 'Grade 10', color: '#38bdf8', bg: 'rgba(56, 189, 248, 0.15)', border: 'rgba(56, 189, 248, 0.35)' },
        { key: 'grade_11', label: '📙 11 ශ්‍රේණිය - O/L පූර්ණ සිද්ධාන්ත', short: 'Grade 11', color: '#818cf8', bg: 'rgba(129, 140, 248, 0.15)', border: 'rgba(129, 140, 248, 0.35)' },
        { key: 'speed_revision', label: '⚡ Speed Revision - විශේෂිත කෙටි ක්‍රම', short: 'Speed Revision', color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.15)', border: 'rgba(245, 158, 11, 0.35)' },
        { key: 'paper_theory', label: '📝 Paper Class - විභාග ප්‍රශ්න පත්‍ර සාකච්ඡාව', short: 'Paper Theory', color: '#ec4899', bg: 'rgba(236, 72, 153, 0.15)', border: 'rgba(236, 72, 153, 0.35)' },
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
                    fetchEnrollments();
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
            fetchEnrollments();
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

    // ==========================================
    // Students Management Logic
    // ==========================================
    const fetchStudents = async () => {
        setStudentsLoading(true);
        try {
            const res = await fetch('/api/admin/users');
            const data = await res.json();
            if (res.ok && data.success) {
                setStudents(data.users || []);
            }
        } catch (err) {
            console.error('Error fetching students:', err);
        } finally {
            setStudentsLoading(false);
        }
    };

    const handleOpenEditStudentCourses = (student) => {
        setEditingStudent(student);
        setEditingCourses(Array.isArray(student.enrolledCourses) ? [...student.enrolledCourses] : ['free_paper']);
    };

    const handleToggleStudentCourse = (courseKey) => {
        if (courseKey === 'free_paper') return; // Free paper is always enabled
        setEditingCourses(prev => {
            if (prev.includes(courseKey)) {
                return prev.filter(c => c !== courseKey);
            } else {
                return [...prev, courseKey];
            }
        });
    };

    const handleSaveStudentCourses = async () => {
        if (!editingStudent) return;
        setSavingStudentCourses(true);
        setStudentFeedbackMsg('');
        setStudentFeedbackErr('');
        try {
            const res = await fetch('/api/admin/users', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: editingStudent.id,
                    enrolledCourses: editingCourses
                })
            });
            const data = await res.json();
            if (res.ok && data.success) {
                setStudents(prev => prev.map(s => s.id === editingStudent.id ? { ...s, enrolledCourses: editingCourses } : s));
                setStudentFeedbackMsg(`Student ${editingStudent.name} courses updated successfully!`);
                setEditingStudent(null);
                setTimeout(() => setStudentFeedbackMsg(''), 4000);
            } else {
                setStudentFeedbackErr(data.error || 'Failed to update student courses.');
            }
        } catch (err) {
            setStudentFeedbackErr('Network error: ' + err.message);
        } finally {
            setSavingStudentCourses(false);
        }
    };

    const handleDeleteStudent = async (studentId, studentName) => {
        if (!confirm(`Are you sure you want to delete student account "${studentName}" (${studentId})? This cannot be undone.`)) {
            return;
        }
        setStudentFeedbackMsg('');
        setStudentFeedbackErr('');
        try {
            const res = await fetch(`/api/admin/users?id=${encodeURIComponent(studentId)}`, {
                method: 'DELETE'
            });
            const data = await res.json();
            if (res.ok && data.success) {
                setStudents(prev => prev.filter(s => s.id !== studentId));
                setStudentFeedbackMsg(`Student "${studentName}" deleted successfully.`);
                setTimeout(() => setStudentFeedbackMsg(''), 4000);
            } else {
                setStudentFeedbackErr(data.error || 'Failed to delete student.');
            }
        } catch (err) {
            setStudentFeedbackErr('Error: ' + err.message);
        }
    };

    // ==========================================
    // Video Lessons Management Logic
    // ==========================================
    const extractYouTubeId = (urlOrId) => {
        if (!urlOrId) return '';
        const trimmed = urlOrId.trim();
        if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
            return trimmed;
        }
        const regExp = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?|live|shorts)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
        const match = trimmed.match(regExp);
        return match ? match[1] : '';
    };

    const fetchVideoLessons = async () => {
        setVideoLoading(true);
        try {
            const res = await fetch('/api/admin/video');
            const data = await res.json();
            if (res.ok && data.success) {
                setVideoLessons(data.lessons || []);
            }
        } catch (err) {
            console.error('Error fetching videos:', err);
        } finally {
            setVideoLoading(false);
        }
    };

    const handleOpenAddVideo = () => {
        setEditingVideo(null);
        setVideoFormTitle('');
        setVideoFormCourse('grade_10');
        setVideoFormDuration('1h 30m');
        setVideoFormUrl('');
        setVideoModalError('');
        setShowVideoModal(true);
    };

    const handleOpenEditVideo = (lesson) => {
        setEditingVideo(lesson);
        setVideoFormTitle(lesson.title || '');
        setVideoFormCourse(lesson.course || 'grade_10');
        setVideoFormDuration(lesson.duration || '1h 30m');
        setVideoFormUrl(lesson.videoId ? `https://www.youtube.com/watch?v=${lesson.videoId}` : '');
        setVideoModalError('');
        setShowVideoModal(true);
    };

    const handleSaveVideoLesson = async (e) => {
        e.preventDefault();
        setVideoModalError('');
        if (!videoFormTitle.trim()) {
            setVideoModalError('Please enter a lesson title.');
            return;
        }

        const ytId = extractYouTubeId(videoFormUrl);
        if (!ytId) {
            setVideoModalError('Please enter a valid YouTube link or 11-character Video ID.');
            return;
        }

        setVideoSubmitting(true);
        try {
            const payload = {
                action: editingVideo ? 'update' : 'create',
                id: editingVideo?.id,
                title: videoFormTitle.trim(),
                course: videoFormCourse,
                duration: videoFormDuration.trim() || '1h 30m',
                videoUrl: ytId
            };

            const res = await fetch('/api/admin/video', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            const data = await res.json();

            if (res.ok && data.success) {
                setVideoLessons(data.lessons || []);
                setShowVideoModal(false);
                setVideoFeedbackMsg(editingVideo ? 'Video lesson updated successfully!' : 'New video lesson published successfully!');
                setTimeout(() => setVideoFeedbackMsg(''), 4000);
            } else {
                setVideoModalError(data.error || 'Failed to save video lesson.');
            }
        } catch (err) {
            setVideoModalError('Error: ' + err.message);
        } finally {
            setVideoSubmitting(false);
        }
    };

    const handleDeleteVideoLesson = async (lessonId, lessonTitle) => {
        if (!confirm(`Are you sure you want to delete lesson "${lessonTitle}"?`)) {
            return;
        }
        try {
            const res = await fetch(`/api/admin/video?id=${encodeURIComponent(lessonId)}`, {
                method: 'DELETE'
            });
            const data = await res.json();
            if (res.ok && data.success) {
                setVideoLessons(data.lessons || []);
                setVideoFeedbackMsg(`Lesson "${lessonTitle}" removed.`);
                setTimeout(() => setVideoFeedbackMsg(''), 4000);
            } else {
                setVideoFeedbackErr(data.error || 'Failed to delete lesson.');
            }
        } catch (err) {
            setVideoFeedbackErr('Error: ' + err.message);
        }
    };

    // ==========================================
    // Enrollments Management Logic
    // ==========================================
    const fetchEnrollments = async () => {
        setEnrollmentsLoading(true);
        try {
            const res = await fetch('/api/enroll');
            const data = await res.json();
            if (res.ok && data.success) {
                setEnrollments(data.enrollments || []);
            }
        } catch (err) {
            console.error('Error fetching enrollments:', err);
        } finally {
            setEnrollmentsLoading(false);
        }
    };

    const handleDeleteEnrollment = async (enrollmentId, studentName) => {
        if (!confirm(`Are you sure you want to delete enrollment application "${studentName}" (${enrollmentId})?`)) {
            return;
        }
        try {
            const res = await fetch(`/api/enroll?id=${encodeURIComponent(enrollmentId)}`, {
                method: 'DELETE'
            });
            const data = await res.json();
            if (res.ok && data.success) {
                setEnrollments(prev => prev.filter(e => e.id !== enrollmentId));
                setEnrollmentFeedbackMsg(`Application "${studentName}" removed.`);
                setTimeout(() => setEnrollmentFeedbackMsg(''), 4000);
            }
        } catch (err) {
            alert('Failed to delete enrollment: ' + err.message);
        }
    };

    const filteredEnrollments = enrollments.filter(e => {
        const query = (enrollmentSearch || '').toLowerCase();
        const matchesSearch = !query ||
            (e.studentName && e.studentName.toLowerCase().includes(query)) ||
            (e.contactNumber && e.contactNumber.includes(query)) ||
            (e.whatsappNumber && e.whatsappNumber.includes(query)) ||
            (e.schoolName && e.schoolName.toLowerCase().includes(query)) ||
            (e.id && e.id.toLowerCase().includes(query));
        const matchesCourse = enrollmentCourseFilter === 'all' ||
            (e.course && e.course.toLowerCase().includes(enrollmentCourseFilter.toLowerCase()));
        return matchesSearch && matchesCourse;
    });

    const filteredPapers = papers.filter(p => {
        const matchesGrade = paperGradeFilter === 'all' || p.grade === paperGradeFilter;
        const matchesTopic = paperTopicFilter === 'all' || p.topicId === paperTopicFilter;
        const matchesSearch = !paperSearchQuery || p.title.toLowerCase().includes(paperSearchQuery.toLowerCase());
        return matchesGrade && matchesTopic && matchesSearch;
    });

    const filteredStudents = students.filter(s => {
        const matchesSearch = !studentSearch || 
            s.name.toLowerCase().includes(studentSearch.toLowerCase()) ||
            s.phone.includes(studentSearch) ||
            s.id.toLowerCase().includes(studentSearch.toLowerCase());
        const matchesCourse = studentCourseFilter === 'all' || 
            (s.enrolledCourses && s.enrolledCourses.includes(studentCourseFilter));
        return matchesSearch && matchesCourse;
    });

    const filteredVideoLessons = videoLessons.filter(v => {
        const matchesSearch = !videoSearch || 
            v.title.toLowerCase().includes(videoSearch.toLowerCase()) ||
            (v.videoId && v.videoId.toLowerCase().includes(videoSearch.toLowerCase()));
        const matchesCourse = videoCourseFilter === 'all' || v.course === videoCourseFilter;
        return matchesSearch && matchesCourse;
    });

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

                            <button
                                onClick={() => setActiveTab('enrollments')}
                                style={{
                                    display: 'flex', alignItems: 'center', gap: '0.5rem',
                                    padding: '0.75rem 1.25rem', borderRadius: '12px',
                                    background: activeTab === 'enrollments' ? 'linear-gradient(135deg, #10b981, #059669)' : 'rgba(255,255,255,0.04)',
                                    color: activeTab === 'enrollments' ? '#fff' : '#94a3b8',
                                    border: activeTab === 'enrollments' ? '1px solid #34d399' : '1px solid rgba(255,255,255,0.06)',
                                    fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer', transition: 'all 0.2s ease'
                                }}
                            >
                                <ClipboardList size={16} /> 📋 Enrollments ({enrollments.length})
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
                                {studentFeedbackMsg && (
                                    <div style={{ marginBottom: '1.5rem', background: 'rgba(16, 185, 129, 0.12)', border: '1px solid rgba(16, 185, 129, 0.35)', padding: '0.9rem 1.25rem', borderRadius: '14px', color: '#6ee7b7', fontSize: '0.92rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                                        <CheckCircle2 size={18} color="#10b981" />
                                        <span>{studentFeedbackMsg}</span>
                                    </div>
                                )}
                                {studentFeedbackErr && (
                                    <div style={{ marginBottom: '1.5rem', background: 'rgba(239, 68, 68, 0.12)', border: '1px solid rgba(239, 68, 68, 0.35)', padding: '0.9rem 1.25rem', borderRadius: '14px', color: '#fca5a5', fontSize: '0.92rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                                        <AlertCircle size={18} color="#ef4444" />
                                        <span>{studentFeedbackErr}</span>
                                    </div>
                                )}

                                {/* Students Stats Cards */}
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
                                    <div style={{ background: 'rgba(26, 31, 56, 0.85)', border: '1px solid rgba(99, 102, 241, 0.25)', borderRadius: '18px', padding: '1.1rem' }}>
                                        <div style={{ fontSize: '0.78rem', color: '#94a3b8', fontWeight: 600 }}>Total Registered Students</div>
                                        <div style={{ fontSize: '2rem', fontWeight: 900, color: '#fff', marginTop: '0.2rem' }}>{students.length}</div>
                                    </div>
                                    <div style={{ background: 'rgba(26, 31, 56, 0.85)', border: '1px solid rgba(56, 189, 248, 0.25)', borderRadius: '18px', padding: '1.1rem' }}>
                                        <div style={{ fontSize: '0.78rem', color: '#94a3b8', fontWeight: 600 }}>Grade 10 Enrolled</div>
                                        <div style={{ fontSize: '2rem', fontWeight: 900, color: '#38bdf8', marginTop: '0.2rem' }}>
                                            {students.filter(s => s.enrolledCourses?.includes('grade_10')).length}
                                        </div>
                                    </div>
                                    <div style={{ background: 'rgba(26, 31, 56, 0.85)', border: '1px solid rgba(129, 140, 248, 0.25)', borderRadius: '18px', padding: '1.1rem' }}>
                                        <div style={{ fontSize: '0.78rem', color: '#94a3b8', fontWeight: 600 }}>Grade 11 Enrolled</div>
                                        <div style={{ fontSize: '2rem', fontWeight: 900, color: '#818cf8', marginTop: '0.2rem' }}>
                                            {students.filter(s => s.enrolledCourses?.includes('grade_11')).length}
                                        </div>
                                    </div>
                                    <div style={{ background: 'rgba(26, 31, 56, 0.85)', border: '1px solid rgba(245, 158, 11, 0.25)', borderRadius: '18px', padding: '1.1rem' }}>
                                        <div style={{ fontSize: '0.78rem', color: '#94a3b8', fontWeight: 600 }}>Speed Revision Enrolled</div>
                                        <div style={{ fontSize: '2rem', fontWeight: 900, color: '#f59e0b', marginTop: '0.2rem' }}>
                                            {students.filter(s => s.enrolledCourses?.includes('speed_revision')).length}
                                        </div>
                                    </div>
                                    <div style={{ background: 'rgba(26, 31, 56, 0.85)', border: '1px solid rgba(236, 72, 153, 0.25)', borderRadius: '18px', padding: '1.1rem' }}>
                                        <div style={{ fontSize: '0.78rem', color: '#94a3b8', fontWeight: 600 }}>Paper Class Enrolled</div>
                                        <div style={{ fontSize: '2rem', fontWeight: 900, color: '#ec4899', marginTop: '0.2rem' }}>
                                            {students.filter(s => s.enrolledCourses?.includes('paper_theory')).length}
                                        </div>
                                    </div>
                                </div>

                                {/* Filter & Search Toolbar */}
                                <div style={{ background: 'rgba(26, 31, 56, 0.65)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '20px', padding: '1.25rem', marginBottom: '1.5rem', display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center' }}>
                                    <div style={{ flex: 1, minWidth: '260px', display: 'flex', alignItems: 'center', gap: '0.6rem', background: '#090d16', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '0.5rem 0.9rem' }}>
                                        <Search size={16} style={{ color: '#64748b' }} />
                                        <input
                                            type="text"
                                            placeholder="Search students by name, phone or ID..."
                                            value={studentSearch}
                                            onChange={(e) => setStudentSearch(e.target.value)}
                                            style={{ background: 'none', border: 'none', outline: 'none', color: '#fff', fontSize: '0.85rem', width: '100%' }}
                                        />
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <Filter size={15} style={{ color: '#64748b' }} />
                                        <select
                                            value={studentCourseFilter}
                                            onChange={(e) => setStudentCourseFilter(e.target.value)}
                                            style={{ background: '#090d16', color: '#fff', border: '1px solid rgba(99, 102, 241, 0.3)', padding: '0.55rem 0.9rem', borderRadius: '10px', fontSize: '0.85rem', outline: 'none' }}
                                        >
                                            <option value="all">All Enrolments ({students.length})</option>
                                            <option value="grade_10">Grade 10 Enrolled</option>
                                            <option value="grade_11">Grade 11 Enrolled</option>
                                            <option value="speed_revision">Speed Revision Enrolled</option>
                                            <option value="paper_theory">Paper Class Enrolled</option>
                                            <option value="free_paper">Free Papers Only</option>
                                        </select>
                                    </div>
                                    <button onClick={fetchStudents} disabled={studentsLoading} className="btn btn-secondary btn-sm" style={{ gap: '0.4rem' }}>
                                        <RefreshCw size={13} className={studentsLoading ? 'animate-spin' : ''} /> Refresh
                                    </button>
                                </div>

                                {/* Students Cards List */}
                                {filteredStudents.length === 0 ? (
                                    <div style={{ textAlign: 'center', padding: '3.5rem 1rem', background: 'rgba(26, 31, 56, 0.4)', borderRadius: '20px', border: '1px dashed rgba(255,255,255,0.1)' }}>
                                        <Users size={42} style={{ color: '#475569', margin: '0 auto 0.75rem auto' }} />
                                        <h4 style={{ color: '#94a3b8', fontSize: '1.1rem', fontWeight: 700 }}>No students found</h4>
                                        <p style={{ color: '#64748b', fontSize: '0.85rem', marginTop: '0.3rem' }}>Try clearing the search query or changing the filter.</p>
                                    </div>
                                ) : (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
                                        {filteredStudents.map(student => {
                                            const enrolled = Array.isArray(student.enrolledCourses) ? student.enrolledCourses : ['free_paper'];
                                            const cleanPhone = (student.phone || '').replace(/[^0-9]/g, '');
                                            const whatsappNumber = cleanPhone.startsWith('0') ? `94${cleanPhone.slice(1)}` : cleanPhone;

                                            return (
                                                <div
                                                    key={student.id}
                                                    style={{
                                                        background: 'linear-gradient(135deg, rgba(26, 31, 56, 0.95) 0%, rgba(15, 23, 42, 0.95) 100%)',
                                                        border: '1px solid rgba(99, 102, 241, 0.25)',
                                                        borderRadius: '18px',
                                                        padding: '1.25rem 1.5rem',
                                                        display: 'flex',
                                                        justifyContent: 'space-between',
                                                        alignItems: 'center',
                                                        flexWrap: 'wrap',
                                                        gap: '1.25rem'
                                                    }}
                                                >
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', minWidth: '260px' }}>
                                                        <div style={{
                                                            width: '46px',
                                                            height: '46px',
                                                            borderRadius: '14px',
                                                            background: 'linear-gradient(135deg, #6366f1 0%, #4338ca 100%)',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            fontWeight: 900,
                                                            fontSize: '1.2rem',
                                                            color: '#fff',
                                                            flexShrink: 0
                                                        }}>
                                                            {(student.name || 'S').charAt(0).toUpperCase()}
                                                        </div>
                                                        <div>
                                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.2rem' }}>
                                                                <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#f8fafc', margin: 0 }}>
                                                                    {student.name || 'Unnamed Student'}
                                                                </h4>
                                                                <span style={{
                                                                    fontSize: '0.72rem',
                                                                    padding: '2px 8px',
                                                                    borderRadius: '999px',
                                                                    background: 'rgba(6, 182, 212, 0.15)',
                                                                    color: '#22d3ee',
                                                                    fontWeight: 700
                                                                }}>
                                                                    {student.id}
                                                                </span>
                                                            </div>
                                                            <div style={{ fontSize: '0.82rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                                                                <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                                                                    <Phone size={13} style={{ color: '#64748b' }} />
                                                                    {student.phone || 'No phone'}
                                                                </span>
                                                                {whatsappNumber && (
                                                                    <a
                                                                        href={`https://wa.me/${whatsappNumber}`}
                                                                        target="_blank"
                                                                        rel="noreferrer"
                                                                        style={{ color: '#25d366', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.78rem', fontWeight: 600 }}
                                                                    >
                                                                        WhatsApp <ExternalLink size={11} />
                                                                    </a>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Course Badges */}
                                                    <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', alignItems: 'center', flex: 1, justifyContent: 'flex-start', minWidth: '220px' }}>
                                                        {enrolled.map(courseKey => {
                                                            const cfg = COURSE_CONFIG.find(c => c.key === courseKey) || {
                                                                short: courseKey,
                                                                color: '#c7d2fe',
                                                                bg: 'rgba(99, 102, 241, 0.15)',
                                                                border: 'rgba(99, 102, 241, 0.3)'
                                                            };
                                                            return (
                                                                <span
                                                                    key={courseKey}
                                                                    style={{
                                                                        background: cfg.bg,
                                                                        color: cfg.color,
                                                                        border: `1px solid ${cfg.border}`,
                                                                        padding: '3px 9px',
                                                                        borderRadius: '8px',
                                                                        fontSize: '0.74rem',
                                                                        fontWeight: 700,
                                                                        display: 'inline-flex',
                                                                        alignItems: 'center',
                                                                        gap: '0.3rem'
                                                                    }}
                                                                >
                                                                    {cfg.short}
                                                                </span>
                                                            );
                                                        })}
                                                    </div>

                                                    {/* Actions */}
                                                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                                        <button
                                                            onClick={() => handleOpenEditStudentCourses(student)}
                                                            className="btn btn-secondary btn-sm"
                                                            style={{ gap: '0.4rem', fontSize: '0.82rem', borderColor: 'rgba(99, 102, 241, 0.4)', color: '#c7d2fe' }}
                                                        >
                                                            <Edit3 size={13} /> Manage Courses
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteStudent(student.id, student.name)}
                                                            className="btn btn-tertiary btn-sm"
                                                            style={{ gap: '0.35rem', fontSize: '0.82rem', borderColor: 'rgba(239, 68, 68, 0.3)', color: '#f87171' }}
                                                        >
                                                            <Trash2 size={13} /> Delete
                                                        </button>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* ============================================================ */}
                        {/* TAB 4: VIDEO LESSONS                                         */}
                        {/* ============================================================ */}
                        {activeTab === 'videos' && (
                            <div>
                                {videoFeedbackMsg && (
                                    <div style={{ marginBottom: '1.5rem', background: 'rgba(16, 185, 129, 0.12)', border: '1px solid rgba(16, 185, 129, 0.35)', padding: '0.9rem 1.25rem', borderRadius: '14px', color: '#6ee7b7', fontSize: '0.92rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                                        <CheckCircle2 size={18} color="#10b981" />
                                        <span>{videoFeedbackMsg}</span>
                                    </div>
                                )}
                                {videoFeedbackErr && (
                                    <div style={{ marginBottom: '1.5rem', background: 'rgba(239, 68, 68, 0.12)', border: '1px solid rgba(239, 68, 68, 0.35)', padding: '0.9rem 1.25rem', borderRadius: '14px', color: '#fca5a5', fontSize: '0.92rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                                        <AlertCircle size={18} color="#ef4444" />
                                        <span>{videoFeedbackErr}</span>
                                    </div>
                                )}

                                {/* Top Stats & Actions Bar */}
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
                                    <div style={{ background: 'rgba(26, 31, 56, 0.85)', border: '1px solid rgba(99, 102, 241, 0.25)', borderRadius: '18px', padding: '1.1rem' }}>
                                        <div style={{ fontSize: '0.78rem', color: '#94a3b8', fontWeight: 600 }}>Total Video Lessons</div>
                                        <div style={{ fontSize: '2rem', fontWeight: 900, color: '#fff', marginTop: '0.2rem' }}>{videoLessons.length}</div>
                                    </div>
                                    <div style={{ background: 'rgba(26, 31, 56, 0.85)', border: '1px solid rgba(56, 189, 248, 0.25)', borderRadius: '18px', padding: '1.1rem' }}>
                                        <div style={{ fontSize: '0.78rem', color: '#94a3b8', fontWeight: 600 }}>Grade 10 Videos</div>
                                        <div style={{ fontSize: '2rem', fontWeight: 900, color: '#38bdf8', marginTop: '0.2rem' }}>
                                            {videoLessons.filter(v => v.course === 'grade_10').length}
                                        </div>
                                    </div>
                                    <div style={{ background: 'rgba(26, 31, 56, 0.85)', border: '1px solid rgba(129, 140, 248, 0.25)', borderRadius: '18px', padding: '1.1rem' }}>
                                        <div style={{ fontSize: '0.78rem', color: '#94a3b8', fontWeight: 600 }}>Grade 11 Videos</div>
                                        <div style={{ fontSize: '2rem', fontWeight: 900, color: '#818cf8', marginTop: '0.2rem' }}>
                                            {videoLessons.filter(v => v.course === 'grade_11').length}
                                        </div>
                                    </div>
                                    <div style={{ background: 'rgba(26, 31, 56, 0.85)', border: '1px solid rgba(245, 158, 11, 0.25)', borderRadius: '18px', padding: '1.1rem', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                        <button
                                            onClick={handleOpenAddVideo}
                                            className="btn btn-primary"
                                            style={{ width: '100%', justifyContent: 'center', gap: '0.5rem', fontSize: '0.92rem', padding: '0.8rem 1rem' }}
                                        >
                                            <Plus size={16} /> Add Video Lesson
                                        </button>
                                    </div>
                                </div>

                                {/* Filter Controls */}
                                <div style={{ background: 'rgba(26, 31, 56, 0.65)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '20px', padding: '1.25rem', marginBottom: '1.5rem', display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center' }}>
                                    <div style={{ display: 'flex', gap: '0.4rem', background: 'rgba(15, 23, 42, 0.8)', padding: '4px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.06)' }}>
                                        <button
                                            onClick={() => setVideoCourseFilter('all')}
                                            style={{ padding: '0.45rem 0.9rem', borderRadius: '8px', border: 'none', background: videoCourseFilter === 'all' ? '#6366f1' : 'transparent', color: videoCourseFilter === 'all' ? '#fff' : '#94a3b8', fontWeight: 600, fontSize: '0.82rem', cursor: 'pointer' }}
                                        >
                                            All Courses
                                        </button>
                                        <button
                                            onClick={() => setVideoCourseFilter('grade_10')}
                                            style={{ padding: '0.45rem 0.9rem', borderRadius: '8px', border: 'none', background: videoCourseFilter === 'grade_10' ? '#06b6d4' : 'transparent', color: videoCourseFilter === 'grade_10' ? '#fff' : '#94a3b8', fontWeight: 600, fontSize: '0.82rem', cursor: 'pointer' }}
                                        >
                                            Grade 10
                                        </button>
                                        <button
                                            onClick={() => setVideoCourseFilter('grade_11')}
                                            style={{ padding: '0.45rem 0.9rem', borderRadius: '8px', border: 'none', background: videoCourseFilter === 'grade_11' ? '#818cf8' : 'transparent', color: videoCourseFilter === 'grade_11' ? '#fff' : '#94a3b8', fontWeight: 600, fontSize: '0.82rem', cursor: 'pointer' }}
                                        >
                                            Grade 11
                                        </button>
                                        <button
                                            onClick={() => setVideoCourseFilter('speed_revision')}
                                            style={{ padding: '0.45rem 0.9rem', borderRadius: '8px', border: 'none', background: videoCourseFilter === 'speed_revision' ? '#f59e0b' : 'transparent', color: videoCourseFilter === 'speed_revision' ? '#fff' : '#94a3b8', fontWeight: 600, fontSize: '0.82rem', cursor: 'pointer' }}
                                        >
                                            Speed Rev.
                                        </button>
                                        <button
                                            onClick={() => setVideoCourseFilter('paper_theory')}
                                            style={{ padding: '0.45rem 0.9rem', borderRadius: '8px', border: 'none', background: videoCourseFilter === 'paper_theory' ? '#ec4899' : 'transparent', color: videoCourseFilter === 'paper_theory' ? '#fff' : '#94a3b8', fontWeight: 600, fontSize: '0.82rem', cursor: 'pointer' }}
                                        >
                                            Paper Class
                                        </button>
                                    </div>

                                    <div style={{ flex: 1, minWidth: '220px', display: 'flex', alignItems: 'center', gap: '0.6rem', background: '#090d16', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', padding: '0.45rem 0.85rem' }}>
                                        <Search size={16} style={{ color: '#64748b' }} />
                                        <input
                                            type="text"
                                            placeholder="Search video lessons by title or YouTube ID..."
                                            value={videoSearch}
                                            onChange={(e) => setVideoSearch(e.target.value)}
                                            style={{ background: 'none', border: 'none', outline: 'none', color: '#fff', fontSize: '0.85rem', width: '100%' }}
                                        />
                                    </div>

                                    <button onClick={fetchVideoLessons} disabled={videoLoading} className="btn btn-secondary btn-sm" style={{ gap: '0.4rem' }}>
                                        <RefreshCw size={13} className={videoLoading ? 'animate-spin' : ''} /> Refresh
                                    </button>
                                </div>

                                {/* Video Cards Grid */}
                                {filteredVideoLessons.length === 0 ? (
                                    <div style={{ textAlign: 'center', padding: '3.5rem 1rem', background: 'rgba(26, 31, 56, 0.4)', borderRadius: '20px', border: '1px dashed rgba(255,255,255,0.1)' }}>
                                        <Video size={42} style={{ color: '#475569', margin: '0 auto 0.75rem auto' }} />
                                        <h4 style={{ color: '#94a3b8', fontSize: '1.1rem', fontWeight: 700 }}>No video lessons found</h4>
                                        <p style={{ color: '#64748b', fontSize: '0.85rem', marginTop: '0.3rem', marginBottom: '1.25rem' }}>Add a YouTube video lesson link for your students to watch.</p>
                                        <button onClick={handleOpenAddVideo} className="btn btn-primary btn-sm" style={{ gap: '0.4rem' }}>
                                            <Plus size={14} /> Add First Video Lesson
                                        </button>
                                    </div>
                                ) : (
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(330px, 1fr))', gap: '1.25rem' }}>
                                        {filteredVideoLessons.map(lesson => {
                                            const cfg = COURSE_CONFIG.find(c => c.key === lesson.course) || {
                                                short: lesson.course,
                                                color: '#38bdf8',
                                                bg: 'rgba(56, 189, 248, 0.15)',
                                                border: 'rgba(56, 189, 248, 0.35)'
                                            };
                                            const ytThumb = lesson.videoId ? `https://img.youtube.com/vi/${lesson.videoId}/hqdefault.jpg` : null;

                                            return (
                                                <div
                                                    key={lesson.id}
                                                    style={{
                                                        background: 'linear-gradient(145deg, rgba(26, 31, 56, 0.95) 0%, rgba(15, 23, 42, 0.98) 100%)',
                                                        border: '1px solid rgba(99, 102, 241, 0.25)',
                                                        borderRadius: '20px',
                                                        overflow: 'hidden',
                                                        display: 'flex',
                                                        flexDirection: 'column',
                                                        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5)'
                                                    }}
                                                >
                                                    {/* Video Thumbnail with Badges */}
                                                    <div style={{ position: 'relative', width: '100%', height: '185px', background: '#090d16', overflow: 'hidden' }}>
                                                        {ytThumb ? (
                                                            <img
                                                                src={ytThumb}
                                                                alt={lesson.title}
                                                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                            />
                                                        ) : (
                                                            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>
                                                                <Video size={36} />
                                                            </div>
                                                        )}

                                                        {/* Course Pill */}
                                                        <span style={{
                                                            position: 'absolute',
                                                            top: '12px',
                                                            left: '12px',
                                                            background: 'rgba(15, 23, 42, 0.85)',
                                                            backdropFilter: 'blur(6px)',
                                                            color: cfg.color,
                                                            border: `1px solid ${cfg.border}`,
                                                            fontSize: '0.72rem',
                                                            fontWeight: 800,
                                                            padding: '2px 8px',
                                                            borderRadius: '6px'
                                                        }}>
                                                            {cfg.short}
                                                        </span>

                                                        {/* Duration Pill */}
                                                        <span style={{
                                                            position: 'absolute',
                                                            bottom: '12px',
                                                            right: '12px',
                                                            background: 'rgba(0, 0, 0, 0.85)',
                                                            color: '#fff',
                                                            fontSize: '0.72rem',
                                                            fontWeight: 700,
                                                            padding: '2px 7px',
                                                            borderRadius: '6px',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            gap: '0.25rem'
                                                        }}>
                                                            <Clock size={11} /> {lesson.duration || '1h 30m'}
                                                        </span>
                                                    </div>

                                                    {/* Video Content */}
                                                    <div style={{ padding: '1.25rem', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                                                        <div>
                                                            <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#f8fafc', marginBottom: '0.4rem', lineHeight: 1.4 }}>
                                                                {lesson.title}
                                                            </h4>
                                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.78rem', color: '#94a3b8', marginBottom: '1rem' }}>
                                                                <span style={{ color: '#ef4444', fontWeight: 700 }}>YouTube:</span>
                                                                <code style={{ background: 'rgba(15, 23, 42, 0.8)', padding: '2px 6px', borderRadius: '4px', color: '#38bdf8' }}>
                                                                    {lesson.videoId || 'No ID'}
                                                                </code>
                                                            </div>
                                                        </div>

                                                        {/* Card Action Buttons */}
                                                        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', paddingTop: '0.75rem', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                                                            {lesson.videoId && (
                                                                <a
                                                                    href={`https://www.youtube.com/watch?v=${lesson.videoId}`}
                                                                    target="_blank"
                                                                    rel="noreferrer"
                                                                    className="btn btn-secondary btn-sm"
                                                                    style={{ flex: 1, justifyContent: 'center', gap: '0.3rem', fontSize: '0.8rem', textDecoration: 'none' }}
                                                                >
                                                                    <Play size={12} fill="#ff0000" color="#ff0000" /> Watch
                                                                </a>
                                                            )}
                                                            <button
                                                                onClick={() => handleOpenEditVideo(lesson)}
                                                                className="btn btn-secondary btn-sm"
                                                                style={{ flex: 1, justifyContent: 'center', gap: '0.3rem', fontSize: '0.8rem' }}
                                                            >
                                                                <Edit3 size={12} /> Edit
                                                            </button>
                                                            <button
                                                                onClick={() => handleDeleteVideoLesson(lesson.id, lesson.title)}
                                                                className="btn btn-tertiary btn-sm"
                                                                style={{ justifyContent: 'center', padding: '0.4rem 0.6rem', borderColor: 'rgba(239, 68, 68, 0.3)', color: '#f87171' }}
                                                            >
                                                                <Trash2 size={13} />
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* ============================================================ */}
                        {/* TAB 5: ENROLLMENTS MANAGEMENT (Public Registrations)         */}
                        {/* ============================================================ */}
                        {activeTab === 'enrollments' && (
                            <div>
                                {enrollmentFeedbackMsg && (
                                    <div style={{ marginBottom: '1.5rem', background: 'rgba(16, 185, 129, 0.12)', border: '1px solid rgba(16, 185, 129, 0.35)', padding: '0.9rem 1.25rem', borderRadius: '14px', color: '#6ee7b7', fontSize: '0.92rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                                        <CheckCircle2 size={18} color="#10b981" />
                                        <span>{enrollmentFeedbackMsg}</span>
                                    </div>
                                )}
                                {enrollmentFeedbackErr && (
                                    <div style={{ marginBottom: '1.5rem', background: 'rgba(239, 68, 68, 0.12)', border: '1px solid rgba(239, 68, 68, 0.35)', padding: '0.9rem 1.25rem', borderRadius: '14px', color: '#fca5a5', fontSize: '0.92rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                                        <AlertCircle size={18} color="#ef4444" />
                                        <span>{enrollmentFeedbackErr}</span>
                                    </div>
                                )}

                                {/* Top Stats Overview */}
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
                                    <div style={{ background: 'rgba(26, 31, 56, 0.85)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: '18px', padding: '1.1rem' }}>
                                        <div style={{ fontSize: '0.78rem', color: '#94a3b8', fontWeight: 600 }}>Total Enrollment Applications</div>
                                        <div style={{ fontSize: '2rem', fontWeight: 900, color: '#34d399', marginTop: '0.2rem' }}>{enrollments.length}</div>
                                    </div>
                                    <div style={{ background: 'rgba(26, 31, 56, 0.85)', border: '1px solid rgba(99, 102, 241, 0.25)', borderRadius: '18px', padding: '1.1rem' }}>
                                        <div style={{ fontSize: '0.78rem', color: '#94a3b8', fontWeight: 600 }}>Full Paper Class</div>
                                        <div style={{ fontSize: '2rem', fontWeight: 900, color: '#818cf8', marginTop: '0.2rem' }}>
                                            {enrollments.filter(e => (e.course || '').toLowerCase().includes('full')).length}
                                        </div>
                                    </div>
                                    <div style={{ background: 'rgba(26, 31, 56, 0.85)', border: '1px solid rgba(56, 189, 248, 0.25)', borderRadius: '18px', padding: '1.1rem' }}>
                                        <div style={{ fontSize: '0.78rem', color: '#94a3b8', fontWeight: 600 }}>Paper + Revision Class</div>
                                        <div style={{ fontSize: '2rem', fontWeight: 900, color: '#38bdf8', marginTop: '0.2rem' }}>
                                            {enrollments.filter(e => (e.course || '').toLowerCase().includes('revision')).length}
                                        </div>
                                    </div>
                                    <div style={{ background: 'rgba(26, 31, 56, 0.85)', border: '1px solid rgba(245, 158, 11, 0.25)', borderRadius: '18px', padding: '1.1rem' }}>
                                        <div style={{ fontSize: '0.78rem', color: '#94a3b8', fontWeight: 600 }}>Target 'C' Pass Class</div>
                                        <div style={{ fontSize: '2rem', fontWeight: 900, color: '#f59e0b', marginTop: '0.2rem' }}>
                                            {enrollments.filter(e => (e.course || '').toLowerCase().includes('target')).length}
                                        </div>
                                    </div>
                                </div>

                                {/* Filter & Search Toolbar */}
                                <div style={{ background: 'rgba(26, 31, 56, 0.65)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '20px', padding: '1.25rem', marginBottom: '1.5rem', display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center' }}>
                                    <div style={{ flex: 1, minWidth: '260px', display: 'flex', alignItems: 'center', gap: '0.6rem', background: '#090d16', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '0.5rem 0.9rem' }}>
                                        <Search size={16} style={{ color: '#64748b' }} />
                                        <input
                                            type="text"
                                            placeholder="Search by student name, school, phone, or application ID..."
                                            value={enrollmentSearch}
                                            onChange={(e) => setEnrollmentSearch(e.target.value)}
                                            style={{ background: 'none', border: 'none', outline: 'none', color: '#fff', fontSize: '0.85rem', width: '100%' }}
                                        />
                                    </div>

                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <Filter size={15} style={{ color: '#64748b' }} />
                                        <select
                                            value={enrollmentCourseFilter}
                                            onChange={(e) => setEnrollmentCourseFilter(e.target.value)}
                                            style={{ background: '#090d16', color: '#fff', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '0.55rem 0.9rem', borderRadius: '10px', fontSize: '0.85rem', outline: 'none' }}
                                        >
                                            <option value="all">All Courses ({enrollments.length})</option>
                                            <option value="full">Full Paper Discussion</option>
                                            <option value="revision">Paper + Revision Class</option>
                                            <option value="target">Target 'C' Pass</option>
                                        </select>
                                    </div>

                                    <button onClick={fetchEnrollments} disabled={enrollmentsLoading} className="btn btn-secondary btn-sm" style={{ gap: '0.4rem' }}>
                                        <RefreshCw size={13} className={enrollmentsLoading ? 'animate-spin' : ''} /> Refresh
                                    </button>
                                </div>

                                {/* Enrollments List */}
                                {filteredEnrollments.length === 0 ? (
                                    <div style={{ textAlign: 'center', padding: '3.5rem 1rem', background: 'rgba(26, 31, 56, 0.4)', borderRadius: '20px', border: '1px dashed rgba(255,255,255,0.1)' }}>
                                        <ClipboardList size={42} style={{ color: '#475569', margin: '0 auto 0.75rem auto' }} />
                                        <h4 style={{ color: '#94a3b8', fontSize: '1.1rem', fontWeight: 700 }}>No enrollment applications found</h4>
                                        <p style={{ color: '#64748b', fontSize: '0.85rem', marginTop: '0.3rem' }}>When students register through the website homepage form, their applications appear here live.</p>
                                    </div>
                                ) : (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
                                        {filteredEnrollments.map(item => {
                                            const cleanPhone = (item.whatsappNumber || item.contactNumber || '').replace(/[^0-9]/g, '');
                                            const whatsappNumber = cleanPhone.startsWith('0') ? `94${cleanPhone.slice(1)}` : cleanPhone;

                                            return (
                                                <div
                                                    key={item.id}
                                                    style={{
                                                        background: 'linear-gradient(135deg, rgba(26, 31, 56, 0.95) 0%, rgba(15, 23, 42, 0.95) 100%)',
                                                        border: '1px solid rgba(16, 185, 129, 0.25)',
                                                        borderRadius: '18px',
                                                        padding: '1.25rem 1.5rem',
                                                        display: 'flex',
                                                        justifyContent: 'space-between',
                                                        alignItems: 'center',
                                                        flexWrap: 'wrap',
                                                        gap: '1.25rem'
                                                    }}
                                                >
                                                    {/* Student Profile Info */}
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', minWidth: '260px' }}>
                                                        <div style={{
                                                            width: '46px',
                                                            height: '46px',
                                                            borderRadius: '14px',
                                                            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            fontWeight: 900,
                                                            fontSize: '1.2rem',
                                                            color: '#fff',
                                                            flexShrink: 0
                                                        }}>
                                                            {(item.studentName || 'S').charAt(0).toUpperCase()}
                                                        </div>
                                                        <div>
                                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.2rem' }}>
                                                                <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#f8fafc', margin: 0 }}>
                                                                    {item.studentName}
                                                                </h4>
                                                                <span style={{
                                                                    fontSize: '0.72rem',
                                                                    padding: '2px 8px',
                                                                    borderRadius: '999px',
                                                                    background: 'rgba(16, 185, 129, 0.15)',
                                                                    color: '#34d399',
                                                                    fontWeight: 700
                                                                }}>
                                                                    {item.id}
                                                                </span>
                                                            </div>
                                                            <div style={{ fontSize: '0.82rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                                                                <span>🏫 {item.schoolName || 'පාසල සටහන් කර නොමැත'}</span>
                                                                {item.createdAt && (
                                                                    <span style={{ color: '#64748b', fontSize: '0.75rem' }}>
                                                                        🕒 {new Date(item.createdAt).toLocaleDateString()} {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Course & Marks */}
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                                                        <span style={{
                                                            background: 'rgba(99, 102, 241, 0.15)',
                                                            color: '#c7d2fe',
                                                            border: '1px solid rgba(99, 102, 241, 0.35)',
                                                            padding: '4px 10px',
                                                            borderRadius: '8px',
                                                            fontSize: '0.8rem',
                                                            fontWeight: 700
                                                        }}>
                                                            {item.course}
                                                        </span>

                                                        <span style={{
                                                            background: 'rgba(245, 158, 11, 0.15)',
                                                            color: '#fbbf24',
                                                            border: '1px solid rgba(245, 158, 11, 0.35)',
                                                            padding: '4px 10px',
                                                            borderRadius: '8px',
                                                            fontSize: '0.8rem',
                                                            fontWeight: 700
                                                        }}>
                                                            Marks: {item.lastTermMarks || 0}%
                                                        </span>
                                                    </div>

                                                    {/* Contact & Action Buttons */}
                                                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                                        <a
                                                            href={`tel:${item.contactNumber}`}
                                                            className="btn btn-secondary btn-sm"
                                                            style={{ gap: '0.35rem', fontSize: '0.8rem', textDecoration: 'none' }}
                                                        >
                                                            <Phone size={13} /> {item.contactNumber}
                                                        </a>

                                                        {whatsappNumber && (
                                                            <a
                                                                href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(`Hi ${item.studentName}, thank you for registering with MathsBook O/L Mathematics! Your application ID is ${item.id}.`)}`}
                                                                target="_blank"
                                                                rel="noreferrer"
                                                                className="btn btn-primary btn-sm"
                                                                style={{ gap: '0.35rem', fontSize: '0.8rem', background: '#25d366', borderColor: '#25d366', color: '#000', fontWeight: 700, textDecoration: 'none' }}
                                                            >
                                                                <Send size={13} /> WhatsApp
                                                            </a>
                                                        )}

                                                        <button
                                                            onClick={() => handleDeleteEnrollment(item.id, item.studentName)}
                                                            className="btn btn-tertiary btn-sm"
                                                            style={{ gap: '0.35rem', fontSize: '0.8rem', borderColor: 'rgba(239, 68, 68, 0.3)', color: '#f87171' }}
                                                        >
                                                            <Trash2 size={13} />
                                                        </button>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
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

            {/* ============================================================ */}
            {/* MODAL: MANAGE STUDENT ENROLMENT / COURSES                     */}
            {/* ============================================================ */}
            {editingStudent && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
                    background: 'rgba(0, 0, 0, 0.8)', backdropFilter: 'blur(8px)',
                    zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem'
                }}>
                    <div style={{
                        background: 'linear-gradient(145deg, #181d33 0%, #0d1222 100%)',
                        border: '1px solid rgba(99, 102, 241, 0.4)', borderRadius: '24px',
                        width: '100%', maxWidth: '580px', maxHeight: '90vh', overflowY: 'auto',
                        padding: '2rem', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8)'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <div style={{
                                    width: '42px', height: '42px', borderRadius: '12px',
                                    background: 'rgba(99, 102, 241, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center'
                                }}>
                                    <UserCheck size={22} color="#818cf8" />
                                </div>
                                <div>
                                    <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff', margin: 0 }}>
                                        Manage Course Access
                                    </h3>
                                    <div style={{ fontSize: '0.82rem', color: '#94a3b8', marginTop: '0.2rem' }}>
                                        {editingStudent.name} • <span style={{ color: '#06b6d4', fontWeight: 700 }}>{editingStudent.id}</span>
                                    </div>
                                </div>
                            </div>
                            <button
                                onClick={() => setEditingStudent(null)}
                                style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '4px' }}
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div style={{ background: 'rgba(15, 23, 42, 0.7)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '12px', padding: '0.85rem 1rem', marginBottom: '1.25rem', fontSize: '0.82rem', color: '#cbd5e1', lineHeight: 1.5 }}>
                            සිසුවාට Dashboard එකෙන් ප්‍රවේශ විය හැකි පන්ති/පාඨමාලා තෝරන්න. Free Paper සෑම සිසුවෙකුටම ස්වයංක්‍රීයව හිමිවේ.
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
                            {COURSE_CONFIG.map(course => {
                                const isChecked = editingCourses.includes(course.key);
                                const isLocked = !!course.locked;

                                return (
                                    <div
                                        key={course.key}
                                        onClick={() => !isLocked && handleToggleStudentCourse(course.key)}
                                        style={{
                                            background: isChecked ? 'rgba(99, 102, 241, 0.12)' : 'rgba(15, 23, 42, 0.6)',
                                            border: isChecked ? `1px solid ${course.border}` : '1px solid rgba(255,255,255,0.06)',
                                            borderRadius: '14px',
                                            padding: '0.9rem 1.1rem',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            cursor: isLocked ? 'default' : 'pointer',
                                            transition: 'all 0.2s ease'
                                        }}
                                    >
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                                            <div style={{
                                                width: '22px', height: '22px', borderRadius: '6px',
                                                border: isChecked ? 'none' : '2px solid rgba(255,255,255,0.3)',
                                                background: isChecked ? (isLocked ? '#10b981' : '#6366f1') : 'transparent',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center'
                                            }}>
                                                {isChecked && <Check size={14} color="#fff" strokeWidth={3} />}
                                            </div>
                                            <div>
                                                <div style={{ fontSize: '0.9rem', fontWeight: 700, color: isChecked ? '#fff' : '#94a3b8' }}>
                                                    {course.label}
                                                </div>
                                                {isLocked && (
                                                    <div style={{ fontSize: '0.72rem', color: '#10b981', fontWeight: 600, marginTop: '0.1rem' }}>
                                                        ✓ Default Access (Unlocked for all students)
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <span style={{
                                            fontSize: '0.72rem',
                                            padding: '2px 8px',
                                            borderRadius: '6px',
                                            background: course.bg,
                                            color: course.color,
                                            fontWeight: 700
                                        }}>
                                            {course.short}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>

                        <div style={{ display: 'flex', gap: '0.75rem' }}>
                            <button
                                type="button"
                                onClick={() => setEditingStudent(null)}
                                className="btn btn-secondary"
                                style={{ flex: 1, justifyContent: 'center' }}
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={handleSaveStudentCourses}
                                disabled={savingStudentCourses}
                                className="btn btn-primary"
                                style={{ flex: 2, justifyContent: 'center', gap: '0.4rem' }}
                            >
                                {savingStudentCourses ? (
                                    <>
                                        <RefreshCw size={14} className="animate-spin" /> Saving Changes...
                                    </>
                                ) : (
                                    <>
                                        <Save size={15} /> Save Enrolment Access
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ============================================================ */}
            {/* MODAL: ADD / EDIT VIDEO LESSON WITH LIVE PREVIEW             */}
            {/* ============================================================ */}
            {showVideoModal && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
                    background: 'rgba(0, 0, 0, 0.85)', backdropFilter: 'blur(8px)',
                    zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem'
                }}>
                    <div style={{
                        background: 'linear-gradient(145deg, #181d33 0%, #0d1222 100%)',
                        border: '1px solid rgba(99, 102, 241, 0.4)', borderRadius: '24px',
                        width: '100%', maxWidth: '640px', maxHeight: '92vh', overflowY: 'auto',
                        padding: '2rem', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8)'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <div style={{
                                    width: '42px', height: '42px', borderRadius: '12px',
                                    background: 'rgba(239, 68, 68, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center'
                                }}>
                                    <Video size={22} color="#ef4444" />
                                </div>
                                <div>
                                    <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff', margin: 0 }}>
                                        {editingVideo ? 'Edit Video Lesson' : 'Add New Video Lesson'}
                                    </h3>
                                    <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '0.2rem' }}>
                                        YouTube ලින්ක් එක ඇතුළත් කර වීඩියෝව පරීක්ෂා කර Publish කරන්න
                                    </div>
                                </div>
                            </div>
                            <button
                                onClick={() => setShowVideoModal(false)}
                                style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '4px' }}
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {videoModalError && (
                            <div style={{ marginBottom: '1.25rem', background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.35)', padding: '0.85rem 1rem', borderRadius: '12px', color: '#fca5a5', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <AlertCircle size={16} />
                                <span>{videoModalError}</span>
                            </div>
                        )}

                        <form onSubmit={handleSaveVideoLesson} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
                            {/* Lesson Title */}
                            <div>
                                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#cbd5e1', marginBottom: '0.4rem' }}>
                                    Lesson Title / පාඩමේ නම *
                                </label>
                                <input
                                    type="text"
                                    required
                                    placeholder="e.g. 01 පාඩම - ත්‍රිකෝණමිතිය (Trigonometry Theory & Questions)"
                                    value={videoFormTitle}
                                    onChange={(e) => setVideoFormTitle(e.target.value)}
                                    style={{ width: '100%', padding: '0.75rem 1rem', background: '#090d16', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', color: '#fff', fontSize: '0.9rem', outline: 'none' }}
                                />
                            </div>

                            {/* Course / Class & Duration */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#cbd5e1', marginBottom: '0.4rem' }}>
                                        Target Course / පන්තිය *
                                    </label>
                                    <select
                                        value={videoFormCourse}
                                        onChange={(e) => setVideoFormCourse(e.target.value)}
                                        style={{ width: '100%', padding: '0.75rem 1rem', background: '#090d16', border: '1px solid rgba(99, 102, 241, 0.3)', borderRadius: '10px', color: '#fff', fontSize: '0.88rem', outline: 'none' }}
                                    >
                                        <option value="grade_10">📘 10 ශ්‍රේණිය (Grade 10)</option>
                                        <option value="grade_11">📙 11 ශ්‍රේණිය (Grade 11)</option>
                                        <option value="speed_revision">⚡ Speed Revision</option>
                                        <option value="paper_theory">📝 Paper Class</option>
                                        <option value="free_paper">📑 Free Seminars & Papers</option>
                                    </select>
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#cbd5e1', marginBottom: '0.4rem' }}>
                                        Duration / කාලය *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="e.g. 1h 45m or 2 Hours"
                                        value={videoFormDuration}
                                        onChange={(e) => setVideoFormDuration(e.target.value)}
                                        style={{ width: '100%', padding: '0.75rem 1rem', background: '#090d16', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', color: '#fff', fontSize: '0.9rem', outline: 'none' }}
                                    />
                                </div>
                            </div>

                            {/* YouTube URL or Video ID */}
                            <div>
                                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#cbd5e1', marginBottom: '0.4rem' }}>
                                    YouTube Video Link or Video ID *
                                </label>
                                <input
                                    type="text"
                                    required
                                    placeholder="Paste YouTube Link (e.g. https://www.youtube.com/watch?v=... or youtu.be/...)"
                                    value={videoFormUrl}
                                    onChange={(e) => setVideoFormUrl(e.target.value)}
                                    style={{ width: '100%', padding: '0.75rem 1rem', background: '#090d16', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', color: '#fff', fontSize: '0.9rem', outline: 'none' }}
                                />
                                <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.35rem' }}>
                                    Supports full YouTube watch URLs, youtu.be short links, live links, and 11-digit video IDs.
                                </div>
                            </div>

                            {/* Live Video Preview Section */}
                            <div>
                                <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#cbd5e1', marginBottom: '0.45rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <span>Video Preview / වීඩියෝව පරීක්ෂා කිරීම</span>
                                    {extractYouTubeId(videoFormUrl) && (
                                        <span style={{ fontSize: '0.72rem', color: '#34d399', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                                            <CheckCircle2 size={13} /> Video ID: {extractYouTubeId(videoFormUrl)}
                                        </span>
                                    )}
                                </div>

                                {extractYouTubeId(videoFormUrl) ? (
                                    <div style={{ borderRadius: '14px', overflow: 'hidden', border: '1px solid rgba(99, 102, 241, 0.35)', background: '#000', position: 'relative' }}>
                                        <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0 }}>
                                            <iframe
                                                src={`https://www.youtube-nocookie.com/embed/${extractYouTubeId(videoFormUrl)}`}
                                                title="YouTube Video Preview"
                                                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }}
                                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                allowFullScreen
                                            />
                                        </div>
                                    </div>
                                ) : (
                                    <div style={{
                                        border: '1px dashed rgba(255,255,255,0.15)',
                                        borderRadius: '14px',
                                        padding: '2.5rem 1rem',
                                        textAlign: 'center',
                                        background: 'rgba(15, 23, 42, 0.4)'
                                    }}>
                                        <Play size={32} style={{ color: '#475569', margin: '0 auto 0.5rem auto' }} />
                                        <div style={{ color: '#94a3b8', fontSize: '0.85rem', fontWeight: 600 }}>
                                            Paste any YouTube video link above to preview here
                                        </div>
                                        <div style={{ color: '#64748b', fontSize: '0.75rem', marginTop: '0.2rem' }}>
                                            Save කිරීමට පෙර වීඩියෝව නිවැරදිදැයි බලාගත හැක
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Submit Buttons */}
                            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                                <button
                                    type="button"
                                    onClick={() => setShowVideoModal(false)}
                                    className="btn btn-secondary"
                                    style={{ flex: 1, justifyContent: 'center' }}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={videoSubmitting || !extractYouTubeId(videoFormUrl)}
                                    className="btn btn-primary"
                                    style={{ flex: 2, justifyContent: 'center', gap: '0.4rem' }}
                                >
                                    {videoSubmitting ? (
                                        <>
                                            <RefreshCw size={14} className="animate-spin" /> Saving Lesson...
                                        </>
                                    ) : (
                                        <>
                                            <Save size={15} /> {editingVideo ? 'Update Video Lesson' : 'Publish Video Lesson'}
                                        </>
                                    )}
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
