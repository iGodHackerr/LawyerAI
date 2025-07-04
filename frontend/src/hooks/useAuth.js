import { useState, useEffect } from 'react';
import { loginUser } from '../services/api';

export default function useAuth() {
    const [userId, setUserId] = useState(null);
    const [isAuthLoading, setIsAuthLoading] = useState(true);
    const [loginError, setLoginError] = useState(null);

    useEffect(() => {
        // Check for a stored user ID on initial load.
        const storedUserId = localStorage.getItem('userId');
        if (storedUserId) {
            setUserId(storedUserId);
        }
        setIsAuthLoading(false);
    }, []);

    const handleSignIn = async () => {
        setIsAuthLoading(true);
        setLoginError(null);
        try {
            const response = await loginUser();
            if (!response.ok) {
                throw new Error('Login request failed. Please check the backend server.');
            }
            const data = await response.json();
            if (data.userId) {
                localStorage.setItem('userId', data.userId);
                setUserId(data.userId);
            } else {
                throw new Error('User ID not found in the server response.');
            }
        } catch (error) {
            console.error("Authentication failed:", error);
            setLoginError(error.message || "Could not connect to the backend. Please try again.");
        } finally {
            setIsAuthLoading(false);
        }
    };

    const handleSignOut = () => {
        localStorage.removeItem('userId');
        localStorage.removeItem('userLanguage'); // Also clear language preference on sign out
        localStorage.removeItem('languageSuggestionDismissed');
        setUserId(null);
    };

    return { userId, isAuthLoading, loginError, handleSignIn, handleSignOut };
}
