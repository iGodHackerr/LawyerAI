import { useState, useCallback } from 'react';

// The API endpoint for ElevenLabs Text-to-Speech
const ELEVENLABS_API_URL = "https://api.elevenlabs.io/v1/text-to-speech/";
const API_KEY = import.meta.env.VITE_ELEVENLABS_API_KEY;

export default function useElevenLabsTTS() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [audio, setAudio] = useState(null);

    // This function will generate and play the audio
    const generateAndPlayAudio = useCallback(async (text, voiceId) => {
        if (!API_KEY) {
            const errMsg = "ElevenLabs API key is not configured in .env.local";
            console.error(errMsg);
            setError(errMsg);
            return;
        }
        if (!text || !voiceId) return;

        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch(`${ELEVENLABS_API_URL}${voiceId}`, {
                method: 'POST',
                headers: {
                    'Accept': 'audio/mpeg',
                    'Content-Type': 'application/json',
                    'xi-api-key': API_KEY,
                },
                body: JSON.stringify({
                    text: text,
                    model_id: "eleven_multilingual_v2", // A good model for multiple languages
                    voice_settings: {
                        stability: 0.5,
                        similarity_boost: 0.75,
                    },
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail.message || "Failed to generate audio from API.");
            }

            // Get the audio data as a blob
            const audioBlob = await response.blob();
            const audioUrl = URL.createObjectURL(audioBlob);
            
            // Create and play the audio
            const audioPlayer = new Audio(audioUrl);
            audioPlayer.play();

            // Handle the end of playback
            audioPlayer.onended = () => {
                setIsLoading(false);
            };
            
            // Handle any errors during playback
            audioPlayer.onerror = () => {
                setError("Failed to play the generated audio.");
                setIsLoading(false);
            };

        } catch (err) {
            console.error("ElevenLabs API Error:", err);
            setError(err.message);
            setIsLoading(false);
        }
    }, []);

    return { isLoading, error, generateAndPlayAudio };
}
