'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { TRANSLATIONS } from '../config/translations';

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
    const [language, setLanguage] = useState('si');
    const [showModal, setShowModal] = useState(false);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
        if (typeof window !== 'undefined') {
            const savedLang = localStorage.getItem('mathsbook_lang');
            if (savedLang && (savedLang === 'si' || savedLang === 'en')) {
                setLanguage(savedLang);
                setShowModal(false);
            } else {
                // Show welcome modal if no language selection saved yet
                setShowModal(true);
            }
        }
    }, []);

    const selectLanguage = (selectedLang) => {
        setLanguage(selectedLang);
        if (typeof window !== 'undefined') {
            localStorage.setItem('mathsbook_lang', selectedLang);
        }
        setShowModal(false);
    };

    const t = (key) => {
        const dict = TRANSLATIONS[language] || TRANSLATIONS.si;
        return dict[key] || TRANSLATIONS.si[key] || key;
    };

    return (
        <LanguageContext.Provider value={{
            language,
            setLanguage,
            selectLanguage,
            showModal,
            setShowModal,
            t,
            isMounted
        }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    return useContext(LanguageContext);
}
