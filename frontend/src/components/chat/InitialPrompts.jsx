import React from 'react';
import { Sparkles, BookOpen, Code, MessageSquare, Bot } from 'lucide-react';

const InitialPrompts = ({ onPromptClick }) => {
    const prompts = [
        { icon: <Sparkles size={24} />, title: "Get legal advice", subtitle: "on a specific situation", color: "from-orange-500 to-amber-400" },
        { icon: <BookOpen size={24} />, title: "Summarize a law", subtitle: "e.g., The IT Act, 2000", color: "from-gray-800 to-gray-600" },
        { icon: <Code size={24} />, title: "Review a document", subtitle: "Check a contract for risks", color: "from-green-500 to-emerald-400" },
        { icon: <MessageSquare size={24} />, title: "Explain a legal term", subtitle: "e.g., 'Caveat Emptor'", color: "from-blue-500 to-cyan-400" },
    ];
    return (
        <div className="flex flex-col items-center justify-center text-center p-4">
            <div className="flex items-center gap-3 mb-4">
                 <div className="w-12 h-12 rounded-full flex items-center justify-center bg-gradient-to-br from-orange-500 via-white to-green-600"><Bot size={28} className="text-gray-800"/></div>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-8">How can I assist you today?</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-3xl">
                {prompts.map((prompt, i) => (
                    <button key={i} onClick={() => onPromptClick(prompt.title)} className={`text-left bg-gray-800/50 hover:bg-gray-800 p-4 rounded-xl transition-all duration-300 border-t border-white/10 hover:-translate-y-1`}>
                        <div className="flex items-center gap-4">
                            <div className={`p-2 rounded-lg bg-gradient-to-br ${prompt.color}`}>
                                {React.cloneElement(prompt.icon, {className: 'text-white'})}
                            </div>
                            <div>
                                <p className="font-semibold text-white">{prompt.title}</p>
                                <p className="text-sm text-gray-400">{prompt.subtitle}</p>
                            </div>
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default InitialPrompts;
