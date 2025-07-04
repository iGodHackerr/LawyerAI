import { useState, useCallback } from 'react';

// API Configuration - CORRECTED URL, removed the extra '/api' segment.
const LISTEN2IT_API_URL = 'https://api.getlisten2it.com/v1/tts';
const API_KEY = import.meta.env.VITE_LISTEN2IT_API_KEY;
const ORG_ID = import.meta.env.VITE_LISTEN2IT_ORG_ID;
const PROJECT_ID = import.meta.env.VITE_LISTEN2IT_PROJECT_ID;

export default function useListen2ItTTS() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const generateAndPlayAudio = useCallback(async (text, voiceId) => {
        console.log("Attempting to generate audio with final corrected URL...");
        // Check if all necessary credentials are provided
        if (!API_KEY || !ORG_ID || !PROJECT_ID) {
            const errMsg = "Listen2It API credentials (Key, Org ID, Project ID) are not fully configured in .env.local. Please check the file and restart your dev server.";
            console.error(errMsg);
            setError(errMsg);
            return;
        }
        if (!text || !voiceId) return;

        setIsLoading(true);
        setError(null);

        const requestBody = {
            text: text,
            voice_id: voiceId,
            organisation_id: ORG_ID,
            project_id: PROJECT_ID,
        };

        // Log the request details for debugging, but hide the full key.
        console.log("Sending request to Listen2It with body:", {
            ...requestBody,
            organisation_id: `...${ORG_ID.slice(-4)}`,
            project_id: `...${PROJECT_ID.slice(-4)}`
        });

        try {
            const response = await fetch(LISTEN2IT_API_URL, {
                method: 'POST',
                headers: {
                    'x-api-key': API_KEY,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody),
            });

            console.log(`Received response with status: ${response.status}`);

            if (!response.ok) {
                // If the response is not OK, try to get more details.
                const errorText = await response.text();
                console.error("Listen2It API Error Response Text:", errorText);
                let errorData;
                try {
                    // Try to parse it as JSON, as it might be a structured error.
                    errorData = JSON.parse(errorText);
                } catch (e) {
                    // If it's not JSON, use the raw text.
                    throw new Error(`API returned status ${response.status}: ${errorText}`);
                }
                // Provide a more specific error message if available
                throw new Error(errorData.message || `API returned status ${response.status}`);
            }

            const data = await response.json();
            const audioUrl = data.url;
            console.log("Received audio URL:", audioUrl);

            if (!audioUrl) {
                throw new Error("API response was successful but did not include an audio URL.");
            }
            
            const audioPlayer = new Audio(audioUrl);
            audioPlayer.play();

            audioPlayer.onended = () => setIsLoading(false);
            audioPlayer.onerror = (e) => {
                console.error("Audio playback error:", e);
                setError("Failed to play the generated audio URL. Check browser console for details.");
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
