import React, { useState } from 'react';
import { Copy, Volume2, Check, Loader2 } from 'lucide-react';
import useVoiceRSS from '../../hooks/useVoiceRSS.js'; // Import the new VoiceRSS hook
import { useLanguage } from '../../contexts/LanguageContext.jsx';

// Map our app's language codes to VoiceRSS language codes.
const languageToVoiceCode = {
    'en': 'en-us',
    'hi': 'hi-in',
    'bn': 'bn-in',
    'te': 'te-in',
    'mr': 'mr-in',
    'ta': 'ta-in',
    'gu': 'gu-in',
    'kn': 'kn-in',
    'ml': 'ml-in',
    'pa': 'pa-in',
};

const MessageActions = ({ text }) => {
    const [hasCopied, setHasCopied] = useState(false);
    const { language } = useLanguage();
    const { isLoading, error, generateAndPlayAudio } = useVoiceRSS();

    const handleCopy = () => {
        navigator.clipboard.writeText(text).then(() => {
            setHasCopied(true);
            setTimeout(() => setHasCopied(false), 2000);
        }).catch(err => {
            console.error('Failed to copy text: ', err);
        });
    };
    
    const handleSpeak = () => {
        const langCode = languageToVoiceCode[language] || languageToVoiceCode['en'];
        generateAndPlayAudio(text, langCode);
    };

    return (
        <div className="absolute -bottom-4 right-0 flex items-center gap-1 bg-gray-900/60 border border-gray-700/50 backdrop-blur-sm rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button
                onClick={handleCopy}
                className="p-1.5 text-gray-400 hover:text-white hover:bg-white/10 rounded-full transition-colors"
                aria-label="Copy message"
            >
                {hasCopied ? <Check size={16} className="text-green-400" /> : <Copy size={16} />}
            </button>
            {/* <button
                onClick={handleSpeak}
                disabled={isLoading}
                className="p-1.5 text-gray-400 hover:text-white hover:bg-white/10 rounded-full transition-colors disabled:cursor-not-allowed"
                aria-label="Read message aloud"
            >
                {isLoading ? <Loader2 size={16} className="animate-spin text-orange-400" /> : <Volume2 size={16} />}
            </button> */}
            {error && <div title={error} className="text-red-500 text-xs p-1">!</div>}
        </div>
    );
};

export default MessageActions;
