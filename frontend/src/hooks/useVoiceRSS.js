import { useState, useCallback } from 'react';

// VoiceRSS API Configuration
const API_KEY = import.meta.env.VITE_VOICERSS_API_KEY;

export default function useVoiceRSS() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const generateAndPlayAudio = useCallback(async (text, langCode) => {
        console.log("Attempting to generate audio with VoiceRSS...");
        if (!API_KEY) {
            const errMsg = "VoiceRSS API key is not configured in .env.local. Please check the file and restart your dev server.";
            console.error(errMsg);
            setError(errMsg);
            return;
        }
        if (!text || !langCode) return;

        setIsLoading(true);
        setError(null);

        // Construct the API URL with a more compatible audio format
        const apiUrl = `https://api.voicerss.org/?key=${API_KEY}&hl=${langCode}&src=${encodeURIComponent(text)}&c=MP3&f=44khz_16bit_mono`;

        try {
            // VoiceRSS returns the audio file directly, not a JSON response
            const response = await fetch(apiUrl, { method: 'GET' });
            
            console.log(`Received response with status: ${response.status}`);

            if (!response.ok) {
                // If the response is not OK, the body contains the error message
                const errorText = await response.text();
                throw new Error(errorText || `API returned status ${response.status}`);
            }

            // Get the audio data as a blob
            const audioBlob = await response.blob();
            const audioUrl = URL.createObjectURL(audioBlob);
            console.log("Received audio blob and created URL:", audioUrl);
            
            const audioPlayer = new Audio(audioUrl);
            audioPlayer.play();

            audioPlayer.onended = () => setIsLoading(false);
            audioPlayer.onerror = (e) => {
                console.error("Audio playback error:", e);
                setError("Failed to play the generated audio URL.");
                setIsLoading(false);
            };

        } catch (err) {
            console.error("Full error object:", err);
            setError(err.message);
            setIsLoading(false);
        }
    }, []);

    return { isLoading, error, generateAndPlayAudio };
}
