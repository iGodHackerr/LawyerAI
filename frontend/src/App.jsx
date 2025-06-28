// import React, { useState, useEffect, useRef } from 'react';
// import { Plus, MessageSquare, LogIn, Send, User, Bot, Loader2, Menu, Sparkles, X, Code, BarChart, BookOpen, MoreHorizontal, Trash2 } from 'lucide-react';
// import ReactMarkdown from 'react-markdown';
// import { Scale } from 'lucide-react'; // Or whatever icon you choose
// // --- Main App Component ---
// export default function App() {
//     const [userId, setUserId] = useState(localStorage.getItem('userId') || null);
//     const [isLoggingIn, setIsLoggingIn] = useState(false);

//     const handleSignIn = async () => {
//         setIsLoggingIn(true);
//         try {
//             const response = await fetch('http://127.0.0.1:5001/login', { method: 'POST' });
//             if (!response.ok) throw new Error('Login failed');
//             const data = await response.json();
//             localStorage.setItem('userId', data.userId);
//             setUserId(data.userId);
//         } catch (error) {
//             console.error("Authentication failed:", error);
//             alert("Could not log in. Please ensure the backend server is running on port 5001.");
//         } finally {
//             setIsLoggingIn(false);
//         }
//     };

//     if (isLoggingIn) return <LoadingScreen message="Creating session..." />;
//     if (!userId) return <LoginPage onSignIn={handleSignIn} />;
//     return <ChatPage userId={userId} />;
// }

// // --- Reusable Components ---
// const LoadingScreen = ({ message }) => (
//     <div className="flex items-center justify-center h-screen bg-gray-900 text-white">
//         <div className="flex flex-col items-center">
//             <Loader2 className="animate-spin text-blue-500 h-12 w-12 mb-4" />
//             <p className="text-lg">{message}</p>
//         </div>
//     </div>
// );

// const LoginPage = ({ onSignIn }) => (
//     <div className="flex flex-col items-center justify-center h-full">
//             <Scale size={48} className="text-blue-500 mb-4" />
//             <h1 className="text-4xl font-bold text-white mb-10">What Legal Advice Do You Need Today?</h1>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-2xl">
//                 {prompts.map((prompt, i) => (
//                     <button key={i} onClick={() => onPromptClick(prompt.title)} className="text-left bg-gray-800 hover:bg-gray-700/80 p-4 rounded-xl transition-colors">
//                         <div className="flex items-center gap-4">
//                             <div className="text-blue-400">{prompt.icon}</div>
//                             <div>
//                                 <p className="font-semibold text-white">{prompt.title}</p>
//                                 <p className="text-sm text-gray-400">{prompt.subtitle}</p>
//                             </div>
//                         </div>
//                     </button>
//                 ))}
//             </div>
//         </div>
// );

// const InitialPrompts = ({ onPromptClick }) => {
//     const prompts = [
//         { icon: <Sparkles size={24} />, title: "Get advice", subtitle: "on a difficult situation" },
//         { icon: <BarChart size={24} />, title: "Explain a legal term", subtitle: "Get a plain-language definition" },
//         { icon: <Code size={24} />, title: "Review a document", subtitle: "Check for legal issues or risks" },
//         { icon: <BookOpen size={24} />, title: "Summarize a law", subtitle: "Get a summary of a regulation or statute" },
//     ];
//     return (
//         <div className="flex flex-col items-center justify-center h-full">
//             <Scale size={48} className="text-blue-500 mb-4" />
//             <h1 className="text-4xl font-bold text-white mb-10">What Legal Advice Do You Need Today?</h1>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-2xl">
//                 {prompts.map((prompt, i) => (
//                     <button key={i} onClick={() => onPromptClick(prompt.title)} className="text-left bg-gray-800 hover:bg-gray-700/80 p-4 rounded-xl transition-colors">
//                         <div className="flex items-center gap-4">
//                             <div className="text-blue-400">{prompt.icon}</div>
//                             <div>
//                                 <p className="font-semibold text-white">{prompt.title}</p>
//                                 <p className="text-sm text-gray-400">{prompt.subtitle}</p>
//                             </div>
//                         </div>
//                     </button>
//                 ))}
//             </div>
//         </div>
//     );
// };

// const MarkdownRenderer = ({ content }) => (
//     <ReactMarkdown
//         components={{
//             code({ inline, children }) { return inline ? <code className="bg-gray-900/50 text-red-400 px-1 py-0.5 rounded-md">{children}</code> : <pre className="bg-gray-900/50 p-3 my-2 rounded-md overflow-x-auto"><code>{children}</code></pre> },
//             p({ children }) { return <p className="mb-4 last:mb-0">{children}</p> },
//             ol({ children }) { return <ol className="list-decimal list-inside my-4 pl-4">{children}</ol> },
//             ul({ children }) { return <ul className="list-disc list-inside my-4 pl-4">{children}</ul> },
//         }}
//     >{content}</ReactMarkdown>
// );

// // --- Chat Page Component ---
// const ChatPage = ({ userId }) => {
//     const [chats, setChats] = useState([]);
//     const [currentChatId, setCurrentChatId] = useState(null);
//     const [messages, setMessages] = useState([]);
//     const [input, setInput] = useState('');
//     const [isLoading, setIsLoading] = useState(false);
//     const [isSidebarVisible, setIsSidebarVisible] = useState(true);
//     const [openMenuId, setOpenMenuId] = useState(null);
//     const messagesEndRef = useRef(null);
//     const inputRef = useRef(null);
//     const menuRef = useRef(null);

//     // --- Data Fetching Effects ---
//     useEffect(() => {
//         if (!userId) return;
//         fetch(`http://127.0.0.1:5001/chats/${userId}`).then(res => res.json()).then(setChats).catch(err => console.error("Error fetching chats:", err));
//     }, [userId]);

//     useEffect(() => {
//         if (!currentChatId) {
//             setMessages([]);
//             return;
//         }
//         setIsLoading(true);
//         fetch(`http://127.0.0.1:5001/chat/${currentChatId}/messages`).then(res => res.json()).then(setMessages).catch(err => console.error("Error fetching messages:", err)).finally(() => setIsLoading(false));
//     }, [currentChatId]);

//     // --- UI Effects ---
//     useEffect(() => {
//         messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//     }, [messages]);

//     useEffect(() => {
//         inputRef.current?.focus();
//     }, [currentChatId]);

//     useEffect(() => {
//         function handleClickOutside(event) {
//             if (menuRef.current && !menuRef.current.contains(event.target)) {
//                 setOpenMenuId(null);
//             }
//         }
//         document.addEventListener("mousedown", handleClickOutside);
//         return () => document.removeEventListener("mousedown", handleClickOutside);
//     }, [menuRef]);

//     // --- Core Functions ---
//     const handleNewChat = async () => {
//         try {
//             const response = await fetch('http://127.0.0.1:5001/chat', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ userId }) });
//             const newChat = await response.json();
//             setChats([newChat, ...chats]);
//             setCurrentChatId(newChat._id);
//             setMessages([]);
//             setIsSidebarVisible(false);
//             return newChat._id;
//         } catch (error) { console.error("Error creating new chat:", error); }
//     };

//     const updateChatTitle = async (chatId) => {
//         try {
//             const response = await fetch(`http://127.0.0.1:5001/chat/${chatId}/title`, { method: 'POST' });
//             if (!response.ok) return;
//             const { title } = await response.json();
//             setChats(prev => prev.map(c => c._id === chatId ? { ...c, title } : c));
//         } catch (error) { console.error("Failed to update title:", error); }
//     };
    
//     const handleInputChange = (e) => {
//         if (!currentChatId) {
//             handleNewChat().then(newChatId => {
//                 if(newChatId) setInput(e.target.value);
//             });
//         } else {
//             setInput(e.target.value);
//         }
//     };

//     const handleSendMessage = async (e, messageContent) => {
//         if (e) e.preventDefault();
//         const content = messageContent || input;
//         if (!content.trim() || !currentChatId || isLoading) return;

//         const isFirstMessage = messages.length === 0;
//         const userMessage = { role: 'user', content: content.trim() };
        
//         setIsSidebarVisible(false);
//         setMessages(prev => [...prev, userMessage]);
//         setInput('');
//         setIsLoading(true);

//         try {
//             const response = await fetch(`http://127.0.0.1:5001/chat/${currentChatId}/message`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ content: content.trim() }) });
//             if (!response.ok) throw new Error("Backend request failed");
//             const assistantMessage = await response.json();
//             setMessages(prev => [...prev, assistantMessage]);
//             if (isFirstMessage) updateChatTitle(currentChatId);
//         } catch (error) {
//             console.error("Error sending message:", error);
//             setMessages(prev => [...prev.slice(0, -1), { role: 'assistant', content: "Sorry, couldn't get a response." }]);
//         } finally { setIsLoading(false); }
//     };

//     const handleDeleteChat = async (chatIdToDelete) => {
//         try {
//             await fetch(`http://127.0.0.1:5001/chat/${chatIdToDelete}`, { method: 'DELETE' });
//             setChats(prev => prev.filter(c => c._id !== chatIdToDelete));
//             if (currentChatId === chatIdToDelete) {
//                 setCurrentChatId(null);
//                 setIsSidebarVisible(true);
//             }
//             setOpenMenuId(null);
//         } catch (error) { console.error("Error deleting chat:", error); }
//     }

//     const selectChat = (chatId) => {
//         setCurrentChatId(chatId);
//         setIsSidebarVisible(false);
//     }

//     return (
//         <div className="flex h-screen bg-gray-900 text-white font-sans">
//             <aside className={`bg-black/30 backdrop-blur-md border-r border-white/5 flex flex-col shrink-0 transition-all duration-300 ${isSidebarVisible ? 'w-72 p-4' : 'w-0 p-0 overflow-hidden'}`}>
//                 <div className="flex items-center justify-between mb-6 flex-shrink-0">
//                     <div className="flex items-center gap-3"><Bot size={32} className="text-blue-400" /><h1 className="text-xl font-bold">NayaGPT</h1></div>
//                     <button onClick={() => setIsSidebarVisible(false)} className="p-1 rounded-full hover:bg-white/10 md:hidden"><X size={20}/></button>
//                 </div>
//                 <button onClick={handleNewChat} className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white font-semibold py-3 px-4 rounded-xl hover:bg-blue-700 transition-colors flex-shrink-0">
//                     <Plus className="h-5 w-5" /> New Chat
//                 </button>
//                 <div className="flex-grow overflow-y-auto mt-6 space-y-1">
//                     <h2 className="text-sm font-semibold text-gray-400 mb-2 px-3">Chat History</h2>
//                     {chats.map(chat => (
//                         <div key={chat._id} className="relative group">
//                             <button onClick={() => selectChat(chat._id)} className={`w-full text-left p-3 rounded-xl flex items-center gap-3 transition-colors ${currentChatId === chat._id ? 'bg-blue-600/50 text-white' : 'hover:bg-white/10'}`}>
//                                 <MessageSquare className="h-5 w-5 text-gray-400 shrink-0" />
//                                 <span className="truncate text-sm font-medium">{chat.title}</span>
//                             </button>
//                             <button onClick={() => setOpenMenuId(openMenuId === chat._id ? null : chat._id)} className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full hover:bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity">
//                                 <MoreHorizontal size={18}/>
//                             </button>
//                             {openMenuId === chat._id && (
//                                 <div ref={menuRef} className="absolute z-10 right-0 mt-1 w-40 bg-gray-800 border border-gray-700 rounded-xl shadow-lg">
//                                     <button onClick={() => handleDeleteChat(chat._id)} className="w-full text-left flex items-center gap-3 px-4 py-2 text-sm text-red-400 hover:bg-red-500/10">
//                                         <Trash2 size={16}/> Delete Chat
//                                     </button>
//                                 </div>
//                             )}
//                         </div>
//                     ))}
//                 </div>
//                 <div className="mt-auto pt-4 border-t border-white/10 flex-shrink-0">
//                     <button className="w-full flex items-center gap-3 p-2 rounded-xl hover:bg-white/10 transition-colors">
//                         <div className="h-9 w-9 rounded-full bg-gray-600 flex items-center justify-center shrink-0"><User size={18}/></div>
//                         <div className="text-left overflow-hidden"><p className="text-sm font-semibold text-white">User Session</p><p className="text-xs text-gray-400 truncate">{userId}</p></div>
//                     </button>
//                 </div>
//             </aside>
//             <main className="flex-1 flex flex-col relative">
//                 {!isSidebarVisible && <button onClick={() => setIsSidebarVisible(true)} className="absolute top-4 left-4 z-10 p-2 bg-gray-700/50 hover:bg-gray-700 rounded-md"><Menu size={20} /></button>}
//                 <div className="flex-1 overflow-y-auto p-6">
//                     {(currentChatId && messages.length > 0) ? (
//                         <div className="space-y-8 max-w-3xl mx-auto">
//                             {messages.map((msg, index) => (
//                                 <div key={index} className={`flex items-start gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
//                                     <div className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-gray-600' : 'bg-blue-500'}`}>
//                                         {msg.role === 'user' ? <User size={18} className="text-white"/> : <Bot size={18} className="text-white"/>}
//                                     </div>
//                                     <div className={`max-w-2xl text-white/90 ${msg.role === 'user' ? 'bg-gray-700/50 p-4 rounded-2xl' : ''}`}>
//                                         <MarkdownRenderer content={msg.content} />
//                                     </div>
//                                 </div>
//                             ))}
//                             {isLoading && <div className="flex items-start gap-4"><div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center shrink-0"><Bot size={18} className="text-white"/></div><div className="p-4"><Loader2 className="animate-spin text-white h-5 w-5" /></div></div>}
//                             <div ref={messagesEndRef} />
//                         </div>
//                     ) : (
//                         <InitialPrompts onPromptClick={(prompt) => handleNewChat().then(() => setInput(prompt))} />
//                     )}
//                 </div>
//                 <div className="p-6 pt-2 w-full max-w-3xl mx-auto">
//                     <form onSubmit={handleSendMessage} className="flex items-center bg-gray-800 p-2 rounded-xl border border-gray-700 focus-within:border-blue-500 transition-colors">
//                         <input ref={inputRef} type="text" value={input} onChange={handleInputChange} placeholder="Ask anything..." className="flex-1 bg-transparent p-2 text-white placeholder-gray-400 focus:outline-none" />
//                         <button type="submit" disabled={!input.trim() || isLoading} className="bg-blue-600 text-white p-3 rounded-xl disabled:bg-gray-600 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors">
//                             {isLoading ? <Loader2 className="animate-spin h-5 w-5" /> : <Send className="h-5 w-5" />}
//                         </button>
//                     </form>
//                 </div>
//             </main>
//         </div>
//     );
// };








import React, { useState, useEffect, useRef } from 'react';
import { Plus, MessageSquare, LogIn, Send, User, Bot, Loader2, Menu, Sparkles, X, Code, BarChart, BookOpen, MoreHorizontal, Trash2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Scale } from 'lucide-react';

// --- Main App Component ---
export default function App() {
    const [userId, setUserId] = useState(localStorage.getItem('userId') || null);
    const [isLoggingIn, setIsLoggingIn] = useState(false);

    const handleSignIn = async () => {
        setIsLoggingIn(true);
        try {
            // UPDATED: API URL changed for production
            const response = await fetch('/api/login', { method: 'POST' });
            if (!response.ok) throw new Error('Login failed');
            const data = await response.json();
            localStorage.setItem('userId', data.userId);
            setUserId(data.userId);
        } catch (error) {
            console.error("Authentication failed:", error);
            alert("Could not log in. Please ensure the backend server is running and accessible.");
        } finally {
            setIsLoggingIn(false);
        }
    };

    if (isLoggingIn) return <LoadingScreen message="Creating session..." />;
    if (!userId) return <LoginPage onSignIn={handleSignIn} />;
    return <ChatPage userId={userId} />;
}

// --- Reusable Components ---
const LoadingScreen = ({ message }) => (
    <div className="flex items-center justify-center h-screen bg-gray-900 text-white">
        <div className="flex flex-col items-center">
            <Loader2 className="animate-spin text-blue-500 h-12 w-12 mb-4" />
            <p className="text-lg">{message}</p>
        </div>
    </div>
);

// --- FIXED: LoginPage component now correctly shows a login button ---
const LoginPage = ({ onSignIn }) => (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white">
        <div className="text-center">
            <Scale size={64} className="text-blue-500 mb-6 inline-block" />
            <h1 className="text-5xl font-bold text-white mb-4">NyayGPT</h1>
            <p className="text-xl text-gray-400 mb-12">Your AI-Powered Legal Assistant</p>
            <button
                onClick={onSignIn}
                className="flex items-center justify-center gap-3 bg-blue-600 text-white font-semibold py-3 px-8 rounded-xl hover:bg-blue-700 transition-transform hover:scale-105"
            >
                <LogIn size={20} />
                <span>Start Session</span>
            </button>
        </div>
    </div>
);

const InitialPrompts = ({ onPromptClick }) => {
    const prompts = [
        { icon: <Sparkles size={24} />, title: "Get advice", subtitle: "on a difficult situation" },
        { icon: <BarChart size={24} />, title: "Explain a legal term", subtitle: "Get a plain-language definition" },
        { icon: <Code size={24} />, title: "Review a document", subtitle: "Check for legal issues or risks" },
        { icon: <BookOpen size={24} />, title: "Summarize a law", subtitle: "Get a summary of a regulation or statute" },
    ];
    return (
        <div className="flex flex-col items-center justify-center h-full">
            <Scale size={48} className="text-blue-500 mb-4" />
            <h1 className="text-4xl font-bold text-white mb-10">What Legal Advice Do You Need Today?</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-2xl">
                {prompts.map((prompt, i) => (
                    <button key={i} onClick={() => onPromptClick(prompt.title)} className="text-left bg-gray-800 hover:bg-gray-700/80 p-4 rounded-xl transition-colors">
                        <div className="flex items-center gap-4">
                            <div className="text-blue-400">{prompt.icon}</div>
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

const MarkdownRenderer = ({ content }) => (
    <ReactMarkdown
        components={{
            code({ inline, children }) { return inline ? <code className="bg-gray-900/50 text-red-400 px-1 py-0.5 rounded-md">{children}</code> : <pre className="bg-gray-900/50 p-3 my-2 rounded-md overflow-x-auto"><code>{children}</code></pre> },
            p({ children }) { return <p className="mb-4 last:mb-0">{children}</p> },
            ol({ children }) { return <ol className="list-decimal list-inside my-4 pl-4">{children}</ol> },
            ul({ children }) { return <ul className="list-disc list-inside my-4 pl-4">{children}</ul> },
        }}
    >{content}</ReactMarkdown>
);

// --- Chat Page Component ---
const ChatPage = ({ userId }) => {
    const [chats, setChats] = useState([]);
    const [currentChatId, setCurrentChatId] = useState(null);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSidebarVisible, setIsSidebarVisible] = useState(true);
    const [openMenuId, setOpenMenuId] = useState(null);
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);
    const menuRef = useRef(null);

    // --- Data Fetching Effects ---
    useEffect(() => {
        if (!userId) return;
        // UPDATED: API URL
        fetch(`/api/chats/${userId}`).then(res => res.json()).then(setChats).catch(err => console.error("Error fetching chats:", err));
    }, [userId]);

    useEffect(() => {
        if (!currentChatId) {
            setMessages([]);
            return;
        }
        setIsLoading(true);
        // UPDATED: API URL
        fetch(`/api/chat/${currentChatId}/messages`).then(res => res.json()).then(setMessages).catch(err => console.error("Error fetching messages:", err)).finally(() => setIsLoading(false));
    }, [currentChatId]);

    // --- UI Effects ---
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    useEffect(() => {
        inputRef.current?.focus();
    }, [currentChatId]);

    useEffect(() => {
        function handleClickOutside(event) {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setOpenMenuId(null);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [menuRef]);

    // --- Core Functions ---
    const handleNewChat = async () => {
        try {
            // UPDATED: API URL
            const response = await fetch('/api/chat', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ userId }) });
            const newChat = await response.json();
            setChats([newChat, ...chats]);
            setCurrentChatId(newChat._id);
            setMessages([]);
            setIsSidebarVisible(false);
            return newChat._id;
        } catch (error) { console.error("Error creating new chat:", error); }
    };

    const updateChatTitle = async (chatId) => {
        try {
            // UPDATED: API URL
            const response = await fetch(`/api/chat/${chatId}/title`, { method: 'POST' });
            if (!response.ok) return;
            const { title } = await response.json();
            setChats(prev => prev.map(c => c._id === chatId ? { ...c, title } : c));
        } catch (error) { console.error("Failed to update title:", error); }
    };
    
    const handleInputChange = (e) => {
        if (!currentChatId) {
            handleNewChat().then(newChatId => {
                if(newChatId) setInput(e.target.value);
            });
        } else {
            setInput(e.target.value);
        }
    };

    const handleSendMessage = async (e, messageContent) => {
        if (e) e.preventDefault();
        const content = messageContent || input;
        if (!content.trim() || !currentChatId || isLoading) return;

        const isFirstMessage = messages.length === 0;
        const userMessage = { role: 'user', content: content.trim() };
        
        setIsSidebarVisible(false);
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            // UPDATED: API URL
            const response = await fetch(`/api/chat/${currentChatId}/message`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ content: content.trim() }) });
            if (!response.ok) throw new Error("Backend request failed");
            const assistantMessage = await response.json();
            setMessages(prev => [...prev, assistantMessage]);
            if (isFirstMessage) updateChatTitle(currentChatId);
        } catch (error) {
            console.error("Error sending message:", error);
            setMessages(prev => [...prev, { role: 'assistant', content: "Sorry, couldn't get a response." }]);
        } finally { setIsLoading(false); }
    };

    const handleDeleteChat = async (chatIdToDelete) => {
        try {
            // UPDATED: API URL
            await fetch(`/api/chat/${chatIdToDelete}`, { method: 'DELETE' });
            setChats(prev => prev.filter(c => c._id !== chatIdToDelete));
            if (currentChatId === chatIdToDelete) {
                setCurrentChatId(null);
                setIsSidebarVisible(true);
            }
            setOpenMenuId(null);
        } catch (error) { console.error("Error deleting chat:", error); }
    }

    const selectChat = (chatId) => {
        setCurrentChatId(chatId);
        setIsSidebarVisible(false);
    }

    return (
        <div className="flex h-screen bg-gray-900 text-white font-sans">
            <aside className={`bg-black/30 backdrop-blur-md border-r border-white/5 flex flex-col shrink-0 transition-all duration-300 ${isSidebarVisible ? 'w-72 p-4' : 'w-0 p-0 overflow-hidden'}`}>
                <div className="flex items-center justify-between mb-6 flex-shrink-0">
                    <div className="flex items-center gap-3"><Bot size={32} className="text-blue-400" /><h1 className="text-xl font-bold">NayaGPT</h1></div>
                    <button onClick={() => setIsSidebarVisible(false)} className="p-1 rounded-full hover:bg-white/10 md:hidden"><X size={20}/></button>
                </div>
                <button onClick={handleNewChat} className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white font-semibold py-3 px-4 rounded-xl hover:bg-blue-700 transition-colors flex-shrink-0">
                    <Plus className="h-5 w-5" /> New Chat
                </button>
                <div className="flex-grow overflow-y-auto mt-6 space-y-1">
                    <h2 className="text-sm font-semibold text-gray-400 mb-2 px-3">Chat History</h2>
                    {chats.map(chat => (
                        <div key={chat._id} className="relative group">
                            <button onClick={() => selectChat(chat._id)} className={`w-full text-left p-3 rounded-xl flex items-center gap-3 transition-colors ${currentChatId === chat._id ? 'bg-blue-600/50 text-white' : 'hover:bg-white/10'}`}>
                                <MessageSquare className="h-5 w-5 text-gray-400 shrink-0" />
                                <span className="truncate text-sm font-medium">{chat.title}</span>
                            </button>
                            <button onClick={() => setOpenMenuId(openMenuId === chat._id ? null : chat._id)} className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full hover:bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity">
                                <MoreHorizontal size={18}/>
                            </button>
                            {openMenuId === chat._id && (
                                <div ref={menuRef} className="absolute z-10 right-0 mt-1 w-40 bg-gray-800 border border-gray-700 rounded-xl shadow-lg">
                                    <button onClick={() => handleDeleteChat(chat._id)} className="w-full text-left flex items-center gap-3 px-4 py-2 text-sm text-red-400 hover:bg-red-500/10">
                                        <Trash2 size={16}/> Delete Chat
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
                <div className="mt-auto pt-4 border-t border-white/10 flex-shrink-0">
                    <button className="w-full flex items-center gap-3 p-2 rounded-xl hover:bg-white/10 transition-colors">
                        <div className="h-9 w-9 rounded-full bg-gray-600 flex items-center justify-center shrink-0"><User size={18}/></div>
                        <div className="text-left overflow-hidden"><p className="text-sm font-semibold text-white">User Session</p><p className="text-xs text-gray-400 truncate">{userId}</p></div>
                    </button>
                </div>
            </aside>
            <main className="flex-1 flex flex-col relative">
                {!isSidebarVisible && <button onClick={() => setIsSidebarVisible(true)} className="absolute top-4 left-4 z-10 p-2 bg-gray-700/50 hover:bg-gray-700 rounded-md"><Menu size={20} /></button>}
                <div className="flex-1 overflow-y-auto p-6">
                    {(currentChatId && messages.length > 0) ? (
                        <div className="space-y-8 max-w-3xl mx-auto">
                            {messages.map((msg, index) => (
                                <div key={index} className={`flex items-start gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                                    <div className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-gray-600' : 'bg-blue-500'}`}>
                                        {msg.role === 'user' ? <User size={18} className="text-white"/> : <Bot size={18} className="text-white"/>}
                                    </div>
                                    <div className={`max-w-2xl text-white/90 ${msg.role === 'user' ? 'bg-gray-700/50 p-4 rounded-2xl' : ''}`}>
                                        <MarkdownRenderer content={msg.content} />
                                    </div>
                                </div>
                            ))}
                            {isLoading && <div className="flex items-start gap-4"><div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center shrink-0"><Bot size={18} className="text-white"/></div><div className="p-4"><Loader2 className="animate-spin text-white h-5 w-5" /></div></div>}
                            <div ref={messagesEndRef} />
                        </div>
                    ) : (
                        <InitialPrompts onPromptClick={(prompt) => handleNewChat().then(() => setInput(prompt))} />
                    )}
                </div>
                <div className="p-6 pt-2 w-full max-w-3xl mx-auto">
                    <form onSubmit={handleSendMessage} className="flex items-center bg-gray-800 p-2 rounded-xl border border-gray-700 focus-within:border-blue-500 transition-colors">
                        <input ref={inputRef} type="text" value={input} onChange={handleInputChange} placeholder="Ask anything..." className="flex-1 bg-transparent p-2 text-white placeholder-gray-400 focus:outline-none" />
                        <button type="submit" disabled={!input.trim() || isLoading} className="bg-blue-600 text-white p-3 rounded-xl disabled:bg-gray-600 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors">
                            {isLoading ? <Loader2 className="animate-spin h-5 w-5" /> : <Send className="h-5 w-5" />}
                        </button>
                    </form>
                </div>
            </main>
        </div>
    );
};
