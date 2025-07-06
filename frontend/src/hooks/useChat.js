// import { useState, useEffect, useCallback } from 'react';
// import {
//     fetchChats,
//     fetchMessages,
//     createNewChat,
//     sendMessage,
//     deleteChat as apiDeleteChat,
//     updateChatTitle as apiUpdateChatTitle
// } from '../services/api.js';
// import { useLanguage } from '../contexts/LanguageContext.jsx';
// import { useTranslation } from 'react-i18next';

// export default function useChat(userId) {
//     const [chats, setChats] = useState([]);
//     const [currentChatId, setCurrentChatId] = useState(null);
//     const [messages, setMessages] = useState([]);
//     const [isLoading, setIsLoading] = useState(false);
//     const [isChatListLoading, setIsChatListLoading] = useState(true);
//     const [messageError, setMessageError] = useState(null);
//     const { language, supportedLanguages } = useLanguage();
//     const { t } = useTranslation(); // For translating the error message

//     // Fetch chat list
//     useEffect(() => {
//         if (!userId) return;
//         setIsChatListLoading(true);
//         fetchChats(userId)
//             .then(res => res.json())
//             .then(data => setChats(data.sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt))))
//             .catch(err => console.error("Error fetching chats:", err))
//             .finally(() => setIsChatListLoading(false));
//     }, [userId]);

//     // Fetch messages for selected chat
//     useEffect(() => {
//         if (!currentChatId) {
//             setMessages([]);
//             return;
//         }
//         setIsLoading(true);
//         setMessageError(null);
//         fetchMessages(currentChatId)
//             .then(res => {
//                 if (!res.ok) throw new Error(t('failedToLoadPastMessages'));
//                 return res.json();
//             })
//             .then(setMessages)
//             .catch(err => {
//                 console.error("Error fetching messages:", err);
//                 setMessageError(err.message);
//             })
//             .finally(() => setIsLoading(false));
//     }, [currentChatId, t]);

//     const handleNewChat = useCallback(async () => {
//         try {
//             const response = await createNewChat(userId);
//             const newChat = await response.json();
//             setChats(prev => [newChat, ...prev]);
//             setCurrentChatId(newChat._id);
//             setMessages([]);
//             return newChat._id;
//         } catch (error) {
//             console.error("Error creating new chat:", error);
//             return null;
//         }
//     }, [userId]);

//     const updateChatTitle = useCallback(async (chatId) => {
//         try {
//             const response = await apiUpdateChatTitle(chatId);
//             if (!response.ok) return;
//             const { title } = await response.json();
//             setChats(prev => prev.map(c => c._id === chatId ? { ...c, title } : c));
//         } catch (error) {
//             console.error("Failed to update title:", error);
//         }
//     }, []);

//     const handleSendMessage = useCallback(async (content) => {
//         if (!content.trim() || isLoading) return;

//         let chatId = currentChatId;
//         const isFirstMessage = !chatId || messages.length === 0;

//         if (!chatId) {
//             chatId = await handleNewChat();
//             if (!chatId) return; // Stop if chat creation failed
//         }
        
//         const userMessage = { role: 'user', content };
//         setMessages(prev => [...prev, userMessage]);
//         setIsLoading(true);

//         try {
//             let finalContent = content.trim();
//             if (language !== 'en' && supportedLanguages[language]) {
//                 const languageName = supportedLanguages[language];
//                 finalContent = `Please respond ONLY in the ${languageName} language. Do not use any other language. The user's query is: "${content.trim()}"`;
//             }

//             const response = await sendMessage(chatId, finalContent);

//             if (!response.ok) throw new Error(`Backend request failed with status: ${response.status}`);

//             const assistantMessage = await response.json();
//             setMessages(prev => [...prev, assistantMessage]);

//             if (isFirstMessage) updateChatTitle(chatId);

//         } catch (error) {
//             console.error("Error sending message:", error);
//             setMessages(prev => [...prev, { role: 'assistant', content: t('genericError') }]);
//         } finally {
//             setIsLoading(false);
//         }
//     }, [currentChatId, isLoading, messages.length, handleNewChat, updateChatTitle, language, supportedLanguages, t]);

//     const handleDeleteChat = useCallback(async (chatIdToDelete) => {
//         const originalChats = [...chats];
//         setChats(prev => prev.filter(c => c._id !== chatIdToDelete));
//         try {
//             await apiDeleteChat(chatIdToDelete);
//             if (currentChatId === chatIdToDelete) {
//                 setCurrentChatId(null);
//                 setMessages([]);
//             }
//         } catch (error) {
//             console.error("Error deleting chat:", error);
//             setChats(originalChats); // Revert on failure
//         }
//     }, [chats, currentChatId]);
    
//     const selectChat = (chatId) => {
//         if (currentChatId !== chatId) {
//             setCurrentChatId(chatId);
//             setMessageError(null);
//         }
//     };

//     return {
//         chats, currentChatId, messages, isLoading, isChatListLoading, messageError,
//         handleNewChat, handleSendMessage, handleDeleteChat, selectChat, setMessages,
//     };
// }


import { useState, useEffect, useCallback } from 'react';
import {
    fetchChats,
    fetchMessages,
    createNewChat,
    sendMessage,
    deleteChat as apiDeleteChat,
    updateChatTitle as apiUpdateChatTitle
} from '../services/api.js';
import { useLanguage } from '../contexts/LanguageContext.jsx';
import { useTranslation } from 'react-i18next';

export default function useChat(userId) {
    const [chats, setChats] = useState([]);
    const [currentChatId, setCurrentChatId] = useState(null);
    const [messages, setMessages] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isChatListLoading, setIsChatListLoading] = useState(true);
    const [messageError, setMessageError] = useState(null);
    const { language, supportedLanguages } = useLanguage();
    const { t } = useTranslation(); // For translating the error message

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
                if (!res.ok) throw new Error(t('failedToLoadPastMessages'));
                return res.json();
            })
            .then(setMessages)
            .catch(err => {
                console.error("Error fetching messages:", err);
                setMessageError(err.message);
            })
            .finally(() => setIsLoading(false));
    }, [currentChatId, t]);

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

        // Store the original user message for display FIRST
        const userMessageForDisplay = { role: 'user', content: content.trim() };
        setMessages(prev => [...prev, userMessageForDisplay]);
        
        if (!chatId) {
            chatId = await handleNewChat();
            if (!chatId) {
                setIsLoading(false); // Make sure to reset loading if chat creation fails
                return; // Stop if chat creation failed
            } 
        }
        
        setIsLoading(true); // Set loading after new chat potentially created

        try {
            let finalContentToSend = content.trim();
            if (language !== 'en' && supportedLanguages[language]) {
                const languageName = supportedLanguages[language];
                finalContentToSend = `Please respond ONLY in the ${languageName} language. Do not use any other language. The user's query is: "${content.trim()}"`;
            }

            const response = await sendMessage(chatId, finalContentToSend);

            if (!response.ok) throw new Error(`Backend request failed with status: ${response.status}`);

            const assistantMessage = await response.json();
            setMessages(prev => [...prev, assistantMessage]);

            if (isFirstMessage) updateChatTitle(chatId);

        } catch (error) {
            console.error("Error sending message:", error);
            // If there's an error, add a generic assistant error message
            setMessages(prev => [...prev, { role: 'assistant', content: t('genericError') }]);
        } finally {
            setIsLoading(false);
        }
    }, [currentChatId, isLoading, messages.length, handleNewChat, updateChatTitle, language, supportedLanguages, t]);

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
        chats, currentChatId, messages, isLoading, isChatListLoading, messageError,
        handleNewChat, handleSendMessage, handleDeleteChat, selectChat, setMessages,
    };
}
