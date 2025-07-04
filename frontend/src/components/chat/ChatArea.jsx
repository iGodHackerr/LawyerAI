import React, { useRef, useEffect, useState } from 'react';
import { Loader2, XCircle, Bot, User } from 'lucide-react';
import MarkdownRenderer from '../common/MarkdownRenderer.jsx';
import InitialPrompts from './InitialPrompts.jsx';
import MessageInput from './MessageInput.jsx';
import MessageActions from './MessageActions.jsx'; // Import the new component
import { useTranslation } from 'react-i18next';

const ChatArea = ({ currentChatId, messages, isLoading, messageError, onSendMessage, onNewChat }) => {
    const messagesEndRef = useRef(null);
    const [input, setInput] = useState('');
    const { t } = useTranslation();

    // Auto-scroll to the latest message
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handlePromptClick = async (prompt) => {
        if (!currentChatId) {
            await onNewChat();
        }
        setInput(prompt + ' ');
    };
    
    const handleFormSubmit = (e) => {
        e.preventDefault();
        onSendMessage(input);
        setInput('');
    }

    const renderMainContent = () => {
        if (isLoading && messages.length === 0) {
            return <div className="h-full flex items-center justify-center"><Loader2 className="animate-spin text-white h-8 w-8" /></div>;
        }
        if (messageError) {
             return (
                <div className="h-full flex flex-col items-center justify-center text-center">
                    <XCircle className="h-12 w-12 text-red-500 mb-4" />
                    <h2 className="text-xl font-semibold text-white mb-2">{t('failedToLoadChat')}</h2>
                    <p className="text-gray-400">{messageError}</p>
                </div>
            );
        }
        if (currentChatId && messages.length > 0) {
            return (
                <div className="max-w-3xl mx-auto">
                    <div className="space-y-8">
                        {messages.map((msg, index) => (
                            <div key={index} className={`flex items-start gap-3 sm:gap-4 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                {msg.role === 'assistant' && (
                                    <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-full flex items-center justify-center shrink-0 bg-gradient-to-br from-orange-500 via-white to-green-600">
                                        <Bot size={18} className="text-gray-800"/>
                                    </div>
                                )}
                                {/* Add `relative` and `group` classes to the message container */}
                                <div className={`relative group max-w-xl prose prose-invert prose-p:text-gray-300 prose-li:text-gray-300 p-4 rounded-xl ${msg.role === 'user' ? 'bg-green-800/50 rounded-br-none' : 'bg-gray-800/50 rounded-bl-none'}`}>
                                    <MarkdownRenderer content={msg.content === "I'm sorry, I encountered an error. Please try again." ? t('genericError') : msg.content} />
                                    {/* Conditionally render actions for assistant messages */}
                                    {msg.role === 'assistant' && msg.content && (
                                        <MessageActions text={msg.content} />
                                    )}
                                </div>
                                 {msg.role === 'user' && (
                                    <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-full flex items-center justify-center shrink-0 bg-gradient-to-br from-green-500 to-teal-500">
                                        <User size={18} />
                                    </div>
                                )}
                            </div>
                        ))}
                        {isLoading && messages.length > 0 && (
                            <div className="flex items-start gap-4">
                                <div className="h-9 w-9 rounded-full bg-gradient-to-br from-orange-500 via-white to-green-600 flex items-center justify-center shrink-0"><Bot size={18} className="text-gray-800"/></div>
                                <div className="p-2"><Loader2 className="animate-spin text-white h-6 w-6" /></div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>
                </div>
            );
        }
        return (
            <div className="h-full flex items-center justify-center"><div className="w-full"><InitialPrompts onPromptClick={handlePromptClick} /></div></div>
        );
    };

    return (
        <>
            <div className="flex-1 overflow-y-auto p-4 sm:p-6">{renderMainContent()}</div>
            <MessageInput input={input} setInput={setInput} isLoading={isLoading} onSubmit={handleFormSubmit} isNewChat={!currentChatId} />
        </>
    );
};

export default ChatArea;
