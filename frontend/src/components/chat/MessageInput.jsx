import React, { useRef, useEffect } from 'react';
import { Send, Loader2, Mic, MicOff } from 'lucide-react';
import useSpeech from '../../hooks/useSpeech.js';
import { useTranslation } from 'react-i18next';

const MessageInput = ({ input, setInput, isLoading, onSubmit, isNewChat }) => {
    const inputRef = useRef(null);
    const { t } = useTranslation();

    // --- Speech Recognition Integration ---
    const { isListening, toggleListening, transcript, isSpeechRecognitionSupported } = useSpeech();

    // When a transcript is finalized, append it to the input
    useEffect(() => {
        if (transcript) {
            setInput(prev => (prev ? prev + ' ' : '') + transcript);
        }
    }, [transcript, setInput]);
    // --- End Speech Recognition ---

    // Auto-focus input, but not while listening to avoid UI jumps
    useEffect(() => {
        if (!isListening) {
            inputRef.current?.focus();
        }
    }, [isLoading, isListening]);
    
    // Auto-resize textarea
    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.style.height = 'auto';
            inputRef.current.style.height = `${inputRef.current.scrollHeight}px`;
        }
    }, [input]);

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            onSubmit(e);
        }
    };

    return (
        <div className="p-4 sm:p-6 pt-2 w-full max-w-3xl mx-auto">
            <div className={`p-0.5 rounded-xl transition-all duration-300 ${isNewChat ? 'animated-gradient-border' : 'bg-gray-700 focus-within:bg-gradient-to-r from-orange-500 to-green-500'}`}>
                <form onSubmit={onSubmit} className="flex items-center bg-gray-900 p-1.5 rounded-[10px]">
                    <textarea
                        ref={inputRef}
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder={t('askLegalQuestion')}
                        className="flex-1 bg-transparent p-2.5 text-white placeholder-gray-400 focus:outline-none resize-none max-h-48"
                        rows={1}
                    />
                    <div className="flex items-center ml-2">
                        {isSpeechRecognitionSupported && (
                            <button
                                type="button"
                                onClick={toggleListening}
                                className={`p-3 rounded-lg transition-colors ${isListening ? 'bg-red-500/80 text-white animate-pulse' : 'bg-gray-700 text-white hover:bg-gray-600'}`}
                                aria-label={isListening ? "Stop listening" : "Start listening"}
                            >
                                {isListening ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
                            </button>
                        )}
                        <button
                            type="submit"
                            disabled={!input.trim() || isLoading}
                            className="bg-gray-700 text-white p-3 ml-2 rounded-lg disabled:bg-gray-800 disabled:text-gray-400 disabled:cursor-not-allowed hover:bg-gray-600 transition-colors"
                            aria-label="Send message"
                        >
                            {isLoading ? <Loader2 className="animate-spin h-5 w-5" /> : <Send className="h-5 w-5" />}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default MessageInput;
