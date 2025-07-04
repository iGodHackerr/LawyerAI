import { useState, useEffect, useRef, useCallback } from 'react';

// Check for browser support at the module level for performance
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const isSpeechRecognitionSupported = !!SpeechRecognition;
const isSpeechSynthesisSupported = typeof window !== 'undefined' && 'speechSynthesis' in window;

export default function useSpeech() {
    // --- Speech-to-Text (Recognition) States and Logic ---
    const [isListening, setIsListening] = useState(false);
    const recognitionRef = useRef(null);
    const [transcript, setTranscript] = useState('');

    // --- Text-to-Speech (Synthesis) States and Logic ---
    const [isSpeaking, setIsSpeaking] = useState(false);
    const utteranceRef = useRef(null);

    // Initialize speech recognition engine
    useEffect(() => {
        if (!isSpeechRecognitionSupported) {
            console.warn("Speech recognition is not supported in this browser.");
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.continuous = false; // Stop after a pause in speech
        recognition.interimResults = false; // We only want the final result
        
        recognition.onstart = () => setIsListening(true);
        recognition.onend = () => setIsListening(false);
        recognition.onerror = (event) => {
            console.error("Speech recognition error:", event.error);
            setIsListening(false);
        };
        
        // This is the most important event, it fires when speech is recognized
        recognition.onresult = (event) => {
            const finalTranscript = event.results[0][0].transcript;
            setTranscript(finalTranscript); // Update the transcript state
        };

        recognitionRef.current = recognition;

        // Cleanup: ensure recognition is stopped if the component unmounts
        return () => {
            recognition.stop();
        };
    }, []);

    const toggleListening = useCallback(() => {
        if (!recognitionRef.current) return;

        if (isListening) {
            recognitionRef.current.stop();
        } else {
            setTranscript(''); // Clear previous transcript before starting
            recognitionRef.current.start();
        }
    }, [isListening]);

    const speak = useCallback((text, lang = 'en-US') => {
        if (!isSpeechSynthesisSupported) {
            console.warn("Speech synthesis is not supported in this browser.");
            return;
        }
        
        // If currently speaking, stop the current speech
        if (isSpeaking) {
            window.speechSynthesis.cancel();
            setIsSpeaking(false);
        }

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = lang;
        utterance.onstart = () => setIsSpeaking(true);
        utterance.onend = () => setIsSpeaking(false);
        utterance.onerror = (e) => {
            console.error("Speech synthesis error", e);
            setIsSpeaking(false);
        };
        
        utteranceRef.current = utterance;
        window.speechSynthesis.speak(utterance);
    }, [isSpeaking]);

    return {
        isListening,
        toggleListening,
        transcript,
        isSpeechRecognitionSupported,
        speak,
        isSpeaking,
        isSpeechSynthesisSupported,
    };
}
