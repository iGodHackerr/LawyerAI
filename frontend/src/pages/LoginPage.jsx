import React from 'react';
import { Loader2, LogIn, Scale } from 'lucide-react';

const LoginPage = ({ onSignIn, isLoading, error }) => (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white p-4">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-900/30 via-transparent to-green-900/30 -z-1"></div>
        <div className="text-center">
            <div className="w-16 h-16 rounded-full flex items-center justify-center bg-gradient-to-br from-orange-500 via-white to-green-600 mb-6 mx-auto">
                 <Scale size={32} className="text-gray-800"/>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-3">NayayGPT</h1>
            <p className="text-lg sm:text-xl text-gray-400 mb-8">Your AI-Powered Legal Assistant for India</p>
            <div className="flex justify-center">
                <button
                    onClick={onSignIn}
                    disabled={isLoading}
                    className="flex items-center justify-center gap-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold py-3 px-8 rounded-xl shadow-lg shadow-orange-500/20 hover:shadow-orange-500/40 transition-all duration-300 transform hover:scale-105 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                    {isLoading ? <Loader2 className="animate-spin h-5 w-5" /> : <LogIn size={20} />}
                    <span>{isLoading ? 'Connecting...' : 'Start Session'}</span>
                </button>
            </div>
            {error && <p className="text-red-400 mt-4 text-center">{error}</p>}
        </div>
    </div>
);

export default LoginPage;
