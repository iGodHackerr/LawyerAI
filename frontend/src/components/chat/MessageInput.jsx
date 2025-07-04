import React, { useRef, useEffect } from 'react';
import { Send, Loader2 } from 'lucide-react';

const MessageInput = ({ input, setInput, isLoading, onSubmit, isNewChat }) => {
    const inputRef = useRef(null);

    // Auto-focus input when it's available
    useEffect(() => {
        inputRef.current?.focus();
    }, [isLoading]);
    
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
            <div className={`
                p-0.5 rounded-xl transition-all duration-300
                ${isNewChat 
                    ? 'animated-gradient-border' 
                    : 'bg-gray-700 focus-within:bg-gradient-to-r from-orange-500 to-green-500'
                }
            `}>
                <form
                    onSubmit={onSubmit}
                    className="flex items-center bg-gray-900 p-1.5 rounded-[10px]"
                >
                    <textarea
                        ref={inputRef}
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Ask a legal question..."
                        className="flex-1 bg-transparent p-2.5 text-white placeholder-gray-400 focus:outline-none resize-none max-h-48"
                        rows={1}
                    />
                    <button
                        type="submit"
                        disabled={!input.trim() || isLoading}
                        className="bg-gray-700 text-white p-3 ml-2 rounded-lg disabled:bg-gray-800 disabled:text-gray-400 disabled:cursor-not-allowed hover:bg-gray-600 transition-colors"
                    >
                        {isLoading ? <Loader2 className="animate-spin h-5 w-5" /> : <Send className="h-5 w-5" />}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default MessageInput;
