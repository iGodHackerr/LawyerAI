import React from 'react';
import { Languages, Check, X } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext.jsx';

const LanguageSuggestion = () => {
    const { showSuggestion, suggestedLanguage, changeLanguage, dismissSuggestion } = useLanguage();

    if (!showSuggestion || !suggestedLanguage) {
        return null;
    }

    return (
        <div className="bg-gray-800 border-b border-t border-white/10 px-4 py-2">
            <div className="max-w-3xl mx-auto flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <Languages className="h-5 w-5 text-orange-400" />
                    <p className="text-sm text-gray-300">
                        Switch to <span className="font-semibold text-white">{suggestedLanguage.name}</span>?
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <button 
                        onClick={() => changeLanguage(suggestedLanguage.code)}
                        className="flex items-center gap-1.5 bg-green-600/20 text-green-300 px-3 py-1.5 rounded-md text-sm hover:bg-green-600/40 transition-colors"
                    >
                        <Check size={16} /> Yes
                    </button>
                    <button 
                        onClick={dismissSuggestion}
                        className="flex items-center gap-1.5 bg-gray-700/50 text-gray-400 px-3 py-1.5 rounded-md text-sm hover:bg-gray-700 transition-colors"
                    >
                        <X size={16} /> No
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LanguageSuggestion;
