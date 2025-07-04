import { useState, useEffect, useCallback } from 'react';
import {
    fetchChats,
    fetchMessages,
    createNewChat,
    sendMessage,
    deleteChat as apiDeleteChat,
    updateChatTitle as apiUpdateChatTitle
} from '../services/api';
import { useLanguage } from '../contexts/LanguageContext';

export default function useChat(userId) {
    const [chats, setChats] = useState([]);
    const [currentChatId, setCurrentChatId] = useState(null);
    const [messages, setMessages] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isChatListLoading, setIsChatListLoading] = useState(true);
    const [messageError, setMessageError] = useState(null);
    const { language, supportedLanguages } = useLanguage();

    // Fetch chat list
    useEffect(() => {
        if (!userId) return;
        setIsChatListLoading(true);
        fetchChats(userId)
            .then(res => res.json())
            .then(data => setChats(data.sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt))))
            .catch(err => console.error("Error fetching chats:", err))
            .finally(() => setIsChatListLoading(false));
    }, [userId]);

    // Fetch messages for selected chat
    useEffect(() => {
        if (!currentChatId) {
            setMessages([]);
            return;
        }
        setIsLoading(true);
        setMessageError(null);
        fetchMessages(currentChatId)
            .then(res => {
                if (!res.ok) throw new Error("Failed to load past messages for this chat.");
                return res.json();
            })
            .then(setMessages)
            .catch(err => {
                console.error("Error fetching messages:", err);
                setMessageError(err.message);
            })
            .finally(() => setIsLoading(false));
    }, [currentChatId]);

    const handleNewChat = useCallback(async () => {
        try {
            const response = await createNewChat(userId);
            const newChat = await response.json();
            setChats(prev => [newChat, ...prev]);
            setCurrentChatId(newChat._id);
            setMessages([]);
            return newChat._id;
        } catch (error) {
            console.error("Error creating new chat:", error);
            return null;
        }
    }, [userId]);

    const updateChatTitle = useCallback(async (chatId) => {
        try {
            const response = await apiUpdateChatTitle(chatId);
            if (!response.ok) return;
            const { title } = await response.json();
            setChats(prev => prev.map(c => c._id === chatId ? { ...c, title } : c));
        } catch (error) {
            console.error("Failed to update title:", error);
        }
    }, []);

    const handleSendMessage = useCallback(async (content) => {
        if (!content.trim() || isLoading) return;

        let chatId = currentChatId;
        const isFirstMessage = !chatId || messages.length === 0;

        if (!chatId) {
            chatId = await handleNewChat();
            if (!chatId) return; // Stop if chat creation failed
        }
        
        const userMessage = { role: 'user', content };
        setMessages(prev => [...prev, userMessage]);
        setIsLoading(true);

        try {
            // The language name (e.g., "Hindi") is sent as an instruction.
            const languageName = supportedLanguages[language].split(' ')[0];
            const response = await sendMessage(chatId, content.trim(), languageName);

            if (!response.ok) throw new Error(`Backend request failed with status: ${response.status}`);

            const assistantMessage = await response.json();
            setMessages(prev => [...prev, assistantMessage]);

            if (isFirstMessage) updateChatTitle(chatId);

        } catch (error) {
            console.error("Error sending message:", error);
            setMessages(prev => [...prev, { role: 'assistant', content: "I'm sorry, I encountered an error. Please try again." }]);
        } finally {
            setIsLoading(false);
        }
    }, [currentChatId, isLoading, messages.length, handleNewChat, updateChatTitle, language, supportedLanguages]);

    const handleDeleteChat = useCallback(async (chatIdToDelete) => {
        const originalChats = [...chats];
        setChats(prev => prev.filter(c => c._id !== chatIdToDelete));
        try {
            await apiDeleteChat(chatIdToDelete);
            if (currentChatId === chatIdToDelete) {
                setCurrentChatId(null);
                setMessages([]);
            }
        } catch (error) {
            console.error("Error deleting chat:", error);
            setChats(originalChats); // Revert on failure
        }
    }, [chats, currentChatId]);
    
    const selectChat = (chatId) => {
        if (currentChatId !== chatId) {
            setCurrentChatId(chatId);
            setMessageError(null);
        }
    };

    return {
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
        setMessages,
    };
}
