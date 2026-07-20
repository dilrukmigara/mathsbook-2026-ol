/**
 * mathsbook Configuration File - React Version
 * Tutor: Migara Wickramarachchi (BSc Hons Undergraduate)
 * Contact: 0779780053
 */

export const MATHSBOOK_CONFIG = {
    tutor: {
        name: "Migara Wickramarachchi",
        nameSinhala: "මිගාර වික්‍රමාරච්චි",
        qualification: "BSc (Hons) Undergraduate",
        phone: "0779780053",
        whatsapp: "94779780053", // Without leading 0 for direct wa.me link
        medium: "Sinhala Medium (සිංහල මාධ්‍යය)",
    },
    
    // Live Google Form Submission Settings
    googleForm: {
        actionUrl: "https://docs.google.com/forms/d/e/1FAIpQLSerVi6OIlNbx85e7uNJYG-ThEQel-hNUH9c9U4h3nB-oy8VIQ/formResponse",
        enabled: true,
        entries: {
            studentName: "entry.724079394",    // Student Name
            school: "entry.818456773",         // School
            contactNumber: "entry.370990604",  // Phone Number
            whatsappNumber: "entry.1176561202", // WhatsApp Number
            lastTermMarks: "entry.141160571",  // Last Term Marks
            selectedCourse: "entry.1000006"     // Course Selected
        }
    },

    // Course eligibility threshold
    paperClassMinMarks: 65,

    // Gemini AI Solver Configuration
    aiSolver: {
        model: "gemini-1.5-flash",
        apiKey: "", // Can be supplied by Migara or user
        systemPrompt: "You are mathsbook AI, an expert Sinhala Medium O/L & A/L Mathematics tutor created by Migara Wickramarachchi (BSc Hons Undergraduate). Analyze the provided math problem (image or text) and provide a detailed, accurate, step-by-step solution in Sinhala (සිංහල). Show all steps clearly, explain the mathematical principles used, highlight common mistakes, and state the final answer clearly."
    }
};
