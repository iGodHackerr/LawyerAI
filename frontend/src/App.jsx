import React from 'react';
import useAuth from './hooks/useAuth.js';
import { LanguageProvider } from './contexts/LanguageContext.jsx';
import LoginPage from './pages/LoginPage.jsx';
import ChatPage from './pages/ChatPage.jsx';
import LoadingScreen from './components/common/LoadingScreen.jsx';

// --- Custom Styles for Animations ---
const GlobalStyles = () => (
    <style>{`
        @keyframes rotate-gradient {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
        }
        .animated-gradient-border {
            background-image: linear-gradient(to right, #f97316, #ecfccb, #16a34a, #ecfccb, #f97316);
            background-size: 200% 200%;
            animation: rotate-gradient 3s ease infinite;
        }
    `}</style>
);


export default function App() {
    const { userId, isAuthLoading, loginError, handleSignIn, handleSignOut } = useAuth();

    // Show a loading screen while checking the initial authentication state.
    if (isAuthLoading) {
        return <LoadingScreen message="Initializing Session..." />;
    }

    return (
        <LanguageProvider>
            <GlobalStyles />
            {userId ? (
                <ChatPage userId={userId} onSignOut={handleSignOut} />
            ) : (
                <LoginPage onSignIn={handleSignIn} isLoading={isAuthLoading} error={loginError} />
            )}
        </LanguageProvider>
    );
}
