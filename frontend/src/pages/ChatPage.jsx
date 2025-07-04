import React, { useState, useEffect } from 'react';
import useChat from '../hooks/useChat';
import Sidebar from '../components/chat/Sidebar';
import ChatArea from '../components/chat/ChatArea';
import LanguageSuggestion from '../components/chat/LanguageSuggestion';
import { Menu, Scale } from 'lucide-react';

const ChatPage = ({ userId, onSignOut }) => {
    const {
        chats,
        currentChatId,
        messages,
        isLoading,
        isChatListLoading,
        messageError,
        handleNewChat,
        handleSendMessage,
        handleDeleteChat,
        selectChat,
    } = useChat(userId);

    const [isSidebarVisible, setIsSidebarVisible] = useState(window.innerWidth > 768);

    // Effect for responsive sidebar
    useEffect(() => {
        const handleResize = () => setIsSidebarVisible(window.innerWidth > 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleSelectChat = (chatId) => {
        selectChat(chatId);
        if (window.innerWidth < 768) {
            setIsSidebarVisible(false);
        }
    };

    const handleCreateNewChat = async () => {
        const newChatId = await handleNewChat();
        if (newChatId && window.innerWidth < 768) {
            setIsSidebarVisible(false);
        }
    };

    return (
        <div className="flex h-screen bg-gray-900 text-gray-200 font-sans">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-900/30 via-transparent to-green-900/30 -z-1"></div>

            {isSidebarVisible && <div onClick={() => setIsSidebarVisible(false)} className="fixed inset-0 bg-black/60 z-20 md:hidden" />}

            <Sidebar
                userId={userId}
                chats={chats}
                currentChatId={currentChatId}
                isChatListLoading={isChatListLoading}
                isVisible={isSidebarVisible}
                onClose={() => setIsSidebarVisible(false)}
                onNewChat={handleCreateNewChat}
                onSelectChat={handleSelectChat}
                onDeleteChat={handleDeleteChat}
                onSignOut={onSignOut}
            />

            <main className="flex-1 flex flex-col relative h-screen">
                {/* Mobile Header */}
                <div className="md:hidden flex items-center justify-between p-4 border-b border-white/10 bg-gray-900/70 backdrop-blur-xl">
                    <button onClick={() => setIsSidebarVisible(true)} className="p-2 -ml-2"><Menu size={20} /></button>
                    <div className="flex items-center gap-2">
                        <Scale size={30} className="text-orange-400"/>
                        <h1 className="text-2xl md:text-lg font-bold text-white">NayayGPT</h1>
                    </div>
                    <div className="w-8"></div> {/* Spacer */}
                </div>
                
                <LanguageSuggestion />

                <ChatArea
                    currentChatId={currentChatId}
                    messages={messages}
                    isLoading={isLoading}
                    messageError={messageError}
                    onSendMessage={handleSendMessage}
                    onNewChat={handleNewChat}
                />
            </main>
        </div>
    );
};

export default ChatPage;
