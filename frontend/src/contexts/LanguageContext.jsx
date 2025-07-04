import React, { createContext, useState, useEffect, useContext } from 'react';
import { getLanguageByIp } from '../services/api';

// Create a context for the language
const LanguageContext = createContext();

// A list of supported Indian languages
export const supportedLanguages = {
    'en': 'English',
    'hi': 'हिन्दी (Hindi)',
    'bn': 'বাংলা (Bengali)',
    'te': 'తెలుగు (Telugu)',
    'mr': 'मराठी (Marathi)',
    'ta': 'தமிழ் (Tamil)',
    'gu': 'ગુજરાતી (Gujarati)',
    'kn': 'ಕನ್ನಡ (Kannada)',
    'ml': 'മലയാളം (Malayalam)',
    'pa': 'ਪੰਜਾਬੀ (Punjabi)',
};

export const LanguageProvider = ({ children }) => {
    const [language, setLanguage] = useState('en'); // Default to English
    const [showSuggestion, setShowSuggestion] = useState(false);
    const [suggestedLanguage, setSuggestedLanguage] = useState(null);

    // Effect to detect language from IP on initial load
    useEffect(() => {
        const detectLanguage = async () => {
            try {
                // Check if a language is already set by the user
                const savedLanguage = localStorage.getItem('userLanguage');
                if (savedLanguage && supportedLanguages[savedLanguage]) {
                    setLanguage(savedLanguage);
                    return;
                }
                
                // Fetch language based on IP
                const langCode = await getLanguageByIp();
                if (langCode && supportedLanguages[langCode] && langCode !== 'en') {
                    setSuggestedLanguage({ code: langCode, name: supportedLanguages[langCode] });
                    setShowSuggestion(true);
                }
            } catch (error) {
                console.error("IP-based language detection failed:", error);
            }
        };

        detectLanguage();
    }, []);

    const changeLanguage = (langCode) => {
        if (supportedLanguages[langCode]) {
            setLanguage(langCode);
            localStorage.setItem('userLanguage', langCode); // Persist user's choice
            setShowSuggestion(false); // Hide suggestion after a choice is made
        }
    };
    
    const dismissSuggestion = () => {
        setShowSuggestion(false);
        // Optionally, we can set a flag in localStorage to not show it again
        localStorage.setItem('languageSuggestionDismissed', 'true');
    };


    const value = {
        language,
        changeLanguage,
        supportedLanguages,
        showSuggestion,
        suggestedLanguage,
        dismissSuggestion
    };

    return (
        <LanguageContext.Provider value={value}>
            {children}
        </LanguageContext.Provider>
    );
};

// Custom hook to use the language context easily
export const useLanguage = () => {
    return useContext(LanguageContext);
};
