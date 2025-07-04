import React from 'react';
import { Loader2 } from 'lucide-react';

const LoadingScreen = ({ message }) => (
    <div className="flex items-center justify-center h-screen bg-gray-900 text-white">
        <div className="flex flex-col items-center gap-4">
            <Loader2 className="animate-spin text-orange-500 h-12 w-12" />
            <p className="text-lg text-gray-300">{message}</p>
        </div>
    </div>
);

export default LoadingScreen;
