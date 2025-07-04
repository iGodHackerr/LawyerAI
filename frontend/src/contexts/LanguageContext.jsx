import React, { createContext, useState, useEffect, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { getLanguageByIp } from '../services/api.js';

const LanguageContext = createContext();

export const supportedLanguages = {
    'en': 'English', 'hi': 'हिन्दी (Hindi)', 'bn': 'বাংলা (Bengali)',
    'te': 'తెలుగు (Telugu)', 'mr': 'मराठी (Marathi)', 'ta': 'தமிழ் (Tamil)',
    'gu': 'ગુજરાતી (Gujarati)', 'kn': 'ಕನ್ನಡ (Kannada)', 'ml': 'മലയാളം (Malayalam)',
    'pa': 'ਪੰਜਾਬੀ (Punjabi)',
};

export const LanguageProvider = ({ children }) => {
    const { i18n } = useTranslation();
    const [showSuggestion, setShowSuggestion] = useState(false);
    const [suggestedLanguage, setSuggestedLanguage] = useState(null);

    useEffect(() => {
        const detectLanguage = async () => {
            // Don't show suggestion if user has already set a language or dismissed it
            if (localStorage.getItem('i18nextLng') || localStorage.getItem('languageSuggestionDismissed')) {
                return;
            }
            try {
                const langCode = await getLanguageByIp();
                if (langCode && supportedLanguages[langCode] && langCode !== i18n.language) {
                    setSuggestedLanguage({ code: langCode, name: supportedLanguages[langCode] });
                    setShowSuggestion(true);
                }
            } catch (error) {
                console.error("IP-based language detection failed:", error);
            }
        };
        // Wait a moment before checking, to allow i18next to load the stored language
        setTimeout(detectLanguage, 500);
    }, [i18n.language]);

    const changeLanguage = (langCode) => {
        if (supportedLanguages[langCode]) {
            i18n.changeLanguage(langCode); // This will trigger a re-render with the new language
            setShowSuggestion(false);
        }
    };
    
    const dismissSuggestion = () => {
        setShowSuggestion(false);
        localStorage.setItem('languageSuggestionDismissed', 'true');
    };

    const value = {
        language: i18n.language,
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

export const useLanguage = () => {
    return useContext(LanguageContext);
};
