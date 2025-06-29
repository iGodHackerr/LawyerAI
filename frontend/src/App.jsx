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








// import React, { useState, useEffect, useRef } from 'react';
// import { Plus, MessageSquare, LogIn, Send, User, Bot, Loader2, Menu, Sparkles, X, Code, BarChart, BookOpen, MoreHorizontal, Trash2 } from 'lucide-react';
// import ReactMarkdown from 'react-markdown';
// import { Scale } from 'lucide-react';

// // --- Main App Component ---
// export default function App() {
//     const [userId, setUserId] = useState(localStorage.getItem('userId') || null);
//     const [isLoggingIn, setIsLoggingIn] = useState(false);

//     const handleSignIn = async () => {
//         setIsLoggingIn(true);
//         try {
//             // UPDATED: API URL changed for production
//             const response = await fetch('http://127.0.0.1:5001/login', { method: 'POST' });
//             if (!response.ok) throw new Error('Login failed');
//             const data = await response.json();
//             localStorage.setItem('userId', data.userId);
//             setUserId(data.userId);
//         } catch (error) {
//             console.error("Authentication failed:", error);
//             alert("Could not log in. Please ensure the backend server is running and accessible.");
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

// // --- FIXED: LoginPage component now correctly shows a login button ---
// const LoginPage = ({ onSignIn }) => (
//     <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white">
//         <div className="text-center">
//             <Scale size={64} className="text-blue-500 mb-6 inline-block" />
//             <h1 className="text-5xl font-bold text-white mb-4">NyayGPT</h1>
//             <p className="text-xl text-gray-400 mb-12">Your AI-Powered Legal Assistant</p>
//             <button
//                 onClick={onSignIn}
//                 className="flex items-center justify-center gap-3 bg-blue-600 text-white font-semibold py-3 px-8 rounded-xl hover:bg-blue-700 transition-transform hover:scale-105"
//             >
//                 <LogIn size={20} />
//                 <span>Start Session</span>
//             </button>
//         </div>
//     </div>
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
//         // UPDATED: API URL
//         fetch(`http://127.0.0.1:5001/chats/${userId}`).then(res => res.json()).then(setChats).catch(err => console.error("Error fetching chats:", err));
//     }, [userId]);

//     useEffect(() => {
//         if (!currentChatId) {
//             setMessages([]);
//             return;
//         }
//         setIsLoading(true);
//         // UPDATED: API URL
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
//             // UPDATED: API URL
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
//             // UPDATED: API URL
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
//             // UPDATED: API URL
//             const response = await fetch(`http://127.0.0.1:5001/chat/${currentChatId}/message`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ content: content.trim() }) });
//             if (!response.ok) throw new Error("Backend request failed");
//             const assistantMessage = await response.json();
//             setMessages(prev => [...prev, assistantMessage]);
//             if (isFirstMessage) updateChatTitle(currentChatId);
//         } catch (error) {
//             console.error("Error sending message:", error);
//             setMessages(prev => [...prev, { role: 'assistant', content: "Sorry, couldn't get a response." }]);
//         } finally { setIsLoading(false); }
//     };

//     const handleDeleteChat = async (chatIdToDelete) => {
//         try {
//             // UPDATED: API URL
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
import { Plus, MessageSquare, LogIn, Send, User, Bot, Loader2, Menu, Sparkles, X, Code, BarChart, BookOpen, MoreHorizontal, Trash2, Scale } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

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


// --- Main App Component ---
export default function App() {
    // State to hold the user ID, retrieved from localStorage for persistence
    const [userId, setUserId] = useState(null);
    // Loading state for asynchronous operations like login
    const [isLoggingIn, setIsLoggingIn] = useState(true);

    // Effect to check for an existing user session in localStorage on initial load
    useEffect(() => {
        const storedUserId = localStorage.getItem('userId');
        if (storedUserId) {
            setUserId(storedUserId);
        }
        setIsLoggingIn(false);
    }, []);

    // Handles the user sign-in process
    const handleSignIn = async () => {
        setIsLoggingIn(true);
        try {
            // Placeholder API call; replace with your actual authentication endpoint
            const response = await fetch('http://127.0.0.1:5001/login', { method: 'POST' });
            if (!response.ok) throw new Error('Login failed');
            const data = await response.json();
            localStorage.setItem('userId', data.userId);
            setUserId(data.userId);
        } catch (error) {
            console.error("Authentication failed:", error);
            // Fallback for demo purposes if API call fails
            const mockUserId = `local_session_${new Date().getTime()}`;
            localStorage.setItem('userId', mockUserId);
            alert("Could not connect to the backend. Starting a local demo session.");
        } finally {
            setIsLoggingIn(false);
        }
    };
    
    // Handles user sign-out
    const handleSignOut = () => {
        localStorage.removeItem('userId');
        setUserId(null);
    };

    // Conditional rendering based on authentication state
    if (isLoggingIn) return <LoadingScreen message="Initializing Session..." />;
    if (!userId) return <LoginPage onSignIn={handleSignIn} />;
    return (
        <>
            <GlobalStyles />
            <ChatPage userId={userId} onSignOut={handleSignOut} />
        </>
    );
}


// --- Reusable Themed Components ---

const LoadingScreen = ({ message }) => (
    <div className="flex items-center justify-center h-screen bg-gray-900 text-white">
        <div className="flex flex-col items-center gap-4">
            <Loader2 className="animate-spin text-orange-500 h-12 w-12" />
            <p className="text-lg text-gray-300">{message}</p>
        </div>
    </div>
);

const LoginPage = ({ onSignIn }) => (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white p-4">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-900/30 via-transparent to-green-900/30 -z-1"></div>
        <div className="text-center">
            <div className="w-16 h-16 rounded-full flex items-center justify-center bg-gradient-to-br from-orange-500 via-white to-green-600 mb-6 mx-auto">
                 <Scale size={32} className="text-gray-800"/>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-3">NyayGPT</h1>
            <p className="text-lg sm:text-xl text-gray-400 mb-12">Your AI-Powered Legal Assistant for India</p>
            <div className="flex justify-center">
                <button
                    onClick={onSignIn}
                    className="flex items-center justify-center gap-3 bg-gradient-to-r from-orange-500 via-white to-green-600 bg-[length:200%_100%] bg-[0%_0%] hover:bg-[100%_0%] text-gray-800 font-bold py-3 px-8 rounded-xl shadow-lg shadow-white/10 hover:shadow-white/20 transition-all duration-500"
                >
                    <LogIn size={20} />
                    <span>Start Session</span>
                </button>
            </div>
        </div>
    </div>
);

const InitialPrompts = ({ onPromptClick }) => {
    // Unique colors and gradients for each prompt card using Indian flag colors
    const prompts = [
        { icon: <Sparkles size={24} />, title: "Get legal advice", subtitle: "on a specific situation", color: "from-orange-500 to-amber-400" },
        { icon: <BookOpen size={24} />, title: "Summarize a law", subtitle: "e.g., The IT Act, 2000", color: "from-slate-300 to-gray-100" },
        { icon: <Code size={24} />, title: "Review a document", subtitle: "Check a contract for risks", color: "from-green-500 to-emerald-400" },
        { icon: <BarChart size={24} />, title: "Explain a legal term", subtitle: "e.g., 'Caveat Emptor'", color: "from-orange-500 via-slate-100 to-green-500" },
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
                                {React.cloneElement(prompt.icon, {className: prompt.color.includes('slate') ? 'text-gray-800' : 'text-white'})}
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

const MarkdownRenderer = ({ content }) => (
    <ReactMarkdown
        components={{
            p: ({ children }) => <p className="mb-4 last:mb-0">{children}</p>,
            ol: ({ children }) => <ol className="list-decimal list-inside my-4 pl-4 space-y-2">{children}</ol>,
            ul: ({ children }) => <ul className="list-disc list-inside my-4 pl-4 space-y-2">{children}</ul>,
            li: ({ children }) => <li className="pl-2">{children}</li>,
            code({ inline, children }) {
                return inline ? 
                    <code className="bg-gray-900/70 text-orange-300 px-1.5 py-1 rounded-md font-mono text-sm">{children}</code> : 
                    <pre className="bg-gray-900/70 p-3 my-4 rounded-md overflow-x-auto text-sm font-mono">{children}</pre>;
            },
            h1: ({children}) => <h1 className="text-2xl font-bold my-4">{children}</h1>,
            h2: ({children}) => <h2 className="text-xl font-bold my-3">{children}</h2>,
            h3: ({children}) => <h3 className="text-lg font-semibold my-2">{children}</h3>,
            strong: ({children}) => <strong className="font-bold text-white">{children}</strong>,
        }}
    >{content}</ReactMarkdown>
);


// --- Chat Page Component ---
const ChatPage = ({ userId, onSignOut }) => {
    const [chats, setChats] = useState([]);
    const [currentChatId, setCurrentChatId] = useState(null);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSidebarVisible, setIsSidebarVisible] = useState(window.innerWidth > 768);
    const [openMenuId, setOpenMenuId] = useState(null);

    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);
    const menuRef = useRef(null);

    // Fetch user's chat history
    useEffect(() => {
        if (!userId) return;
        fetch(`http://127.0.0.1:5001/chats/${userId}`).then(res => res.json()).then(data => setChats(data.sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt)))).catch(err => console.error("Error fetching chats:", err));
    }, [userId]);

    // Fetch messages for the currently selected chat
    useEffect(() => {
        if (!currentChatId) {
            setMessages([]);
            return;
        }
        setIsLoading(true);
        fetch(`http://127.0.0.1:5001/chat/${currentChatId}/messages`).then(res => res.json()).then(setMessages).catch(err => console.error("Error fetching messages:", err)).finally(() => setIsLoading(false));
    }, [currentChatId]);
    
    // Responsive sidebar visibility
    useEffect(() => {
        const handleResize = () => setIsSidebarVisible(window.innerWidth > 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Auto-scroll to latest message
    useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);
    // Auto-focus input field
    useEffect(() => { inputRef.current?.focus(); }, [currentChatId, isLoading]);
    // Handle clicking outside the chat options menu to close it
    useEffect(() => {
        const handleClickOutside = e => { if (menuRef.current && !menuRef.current.contains(e.target)) setOpenMenuId(null); };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // --- Core Chat Functions ---
    const handleNewChat = async () => {
        try {
            const response = await fetch('http://127.0.0.1:5001/chat', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ userId }) });
            const newChat = await response.json();
            setChats([newChat, ...chats]);
            setCurrentChatId(newChat._id);
            setMessages([]);
            if (window.innerWidth < 768) setIsSidebarVisible(false);
            return newChat._id;
        } catch (error) { console.error("Error creating new chat:", error); }
    };

    const updateChatTitle = async (chatId) => {
        try {
            const response = await fetch(`http://127.0.0.1:5001/chat/${chatId}/title`, { method: 'POST' });
            if (!response.ok) return;
            const { title } = await response.json();
            setChats(prev => prev.map(c => c._id === chatId ? { ...c, title } : c));
        } catch (error) { console.error("Failed to update title:", error); }
    };
    
    const handleInputChange = (e) => setInput(e.target.value);

    const handleSendMessage = async (e, prompt) => {
        if (e) e.preventDefault();
        let content = (prompt || input).trim();
        if (!content || isLoading) return;

        let chatId = currentChatId;
        const isFirstMessage = !chatId || messages.length === 0;

        if (!chatId) {
            chatId = await handleNewChat();
            if(!chatId) return; // Stop if chat creation failed
        }
        
        const userMessage = { role: 'user', content };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            // Mock response for demonstration
            setTimeout(() => {
                const assistantMessage = {role: 'assistant', content: `This is a mock response to your message: "${content}"`};
                setMessages(prev => [...prev, assistantMessage]);
                if (isFirstMessage) updateChatTitle(chatId);
                setIsLoading(false);
            }, 1000);
        } catch (error) {
            console.error("Error sending message:", error);
            setMessages(prev => [...prev, { role: 'assistant', content: "I'm sorry, I encountered an error. Please try again." }]);
            setIsLoading(false);
        }
    };
    
    const handlePromptClick = async (prompt) => {
        // If there's no active chat, create one first
        if (!currentChatId) {
            await handleNewChat();
        }
        // Set the input field with the prompt text and focus it
        setInput(prompt + ' ');
        inputRef.current?.focus();
    };

    const handleDeleteChat = async (chatIdToDelete) => {
        const originalChats = [...chats];
        setChats(prev => prev.filter(c => c._id !== chatIdToDelete));
        try {
            await fetch(`http://127.0.0.1:5001/chat/${chatIdToDelete}`, { method: 'DELETE' });
            if (currentChatId === chatIdToDelete) {
                setCurrentChatId(null);
                setMessages([]);
            }
        } catch (error) {
            console.error("Error deleting chat:", error);
            setChats(originalChats); // Revert on failure
        } finally {
            setOpenMenuId(null);
        }
    }

    const selectChat = (chatId) => {
        if (currentChatId !== chatId) {
            setCurrentChatId(chatId);
        }
        if (window.innerWidth < 768) {
            setIsSidebarVisible(false);
        }
    }
    
    const isNewChat = messages.length === 0 && !input;

    return (
        <div className="flex h-screen bg-gray-900 text-gray-200 font-sans">
             <div className="absolute inset-0 bg-gradient-to-br from-orange-900/30 via-transparent to-green-900/30 -z-1"></div>

            {isSidebarVisible && <div onClick={() => setIsSidebarVisible(false)} className="fixed inset-0 bg-black/60 z-20 md:hidden" />}

            {/* --- Sidebar --- */}
            <aside className={`fixed md:relative top-0 left-0 h-full bg-gray-900/70 backdrop-blur-xl border-r border-white/10 flex flex-col shrink-0 z-30 transition-transform duration-300 ease-in-out ${isSidebarVisible ? 'translate-x-0' : '-translate-x-full'} w-72`}>
                <div className="flex items-center justify-between p-4 border-b border-white/10 shrink-0">
                    <div className="flex items-center gap-2">
                        <Scale size={24} className="text-orange-400"/>
                        <h1 className="text-xl font-bold text-white">NyayGPT</h1>
                    </div>
                    <button onClick={() => setIsSidebarVisible(false)} className="p-1 rounded-full hover:bg-white/10 md:hidden"><X size={20}/></button>
                </div>
                <div className="p-2 flex-shrink-0">
                    <button onClick={handleNewChat} className="w-full flex items-center justify-center gap-2 bg-white/5 border border-white/10 text-white font-semibold py-2.5 px-4 rounded-lg shadow-sm hover:bg-white/10 hover:border-white/20 transition-all duration-300">
                        <Plus className="h-5 w-5" /> New Chat
                    </button>
                </div>
                <div className="flex-grow overflow-y-auto p-2 space-y-1">
                    {chats.map(chat => (
                        <div key={chat._id} className="relative group">
                            <button onClick={() => selectChat(chat._id)} className={`w-full text-left pl-3 pr-8 py-2.5 rounded-lg flex items-center gap-3 transition-colors relative ${currentChatId === chat._id ? 'bg-white/10 text-white' : 'hover:bg-white/5'}`}>
                                {currentChatId === chat._id && <div className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-1 bg-orange-500 rounded-r-full"></div>}
                                <MessageSquare className="h-5 w-5 text-gray-400 shrink-0" />
                                <span className="truncate text-sm font-medium">{chat.title || "New Chat"}</span>
                            </button>
                            <div className="absolute right-1 top-1/2 -translate-y-1/2 z-10">
                                <button onClick={(e) => { e.stopPropagation(); setOpenMenuId(openMenuId === chat._id ? null : chat._id);}} className="p-1.5 rounded-full hover:bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <MoreHorizontal size={18}/>
                                </button>
                            </div>
                            {openMenuId === chat._id && (
                                <div ref={menuRef} className="absolute z-20 right-0 top-full mt-1 w-40 bg-gray-800 border border-gray-700 rounded-lg shadow-lg">
                                    <button onClick={() => handleDeleteChat(chat._id)} className="w-full text-left flex items-center gap-3 px-3 py-2 text-sm text-red-400 hover:bg-red-500/10">
                                        <Trash2 size={16}/> Delete Chat
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
                <div className="p-2 border-t border-white/10 shrink-0">
                    <button onClick={onSignOut} className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors">
                        <div className="h-9 w-9 rounded-full bg-gradient-to-br from-green-500 to-teal-500 flex items-center justify-center shrink-0"><User size={18}/></div>
                        <div className="text-left overflow-hidden"><p className="text-sm font-semibold text-white">User Session</p><p className="text-xs text-gray-400 truncate">{userId}</p></div>
                    </button>
                </div>
            </aside>

            {/* --- Main Chat Area --- */}
            <main className="flex-1 flex flex-col relative h-screen">
                 {/* Mobile Header */}
                 <div className="md:hidden flex items-center justify-between p-4 border-b border-white/10 bg-gray-900/70 backdrop-blur-xl">
                    <button onClick={() => setIsSidebarVisible(true)} className="p-2 -ml-2"><Menu size={20} /></button>
                    <div className="flex items-center gap-2">
                        <Scale size={20} className="text-orange-400"/>
                        <h1 className="text-lg font-bold text-white">NyayGPT</h1>
                    </div>
                     <div className="w-8"></div> {/* Spacer */}
                </div>
                
                <div className="flex-1 overflow-y-auto p-4 sm:p-6">
                    {(!currentChatId || messages.length === 0) && !isLoading ? (
                        <div className="h-full flex items-center justify-center">
                            <div className="w-full">
                                <InitialPrompts onPromptClick={handlePromptClick} />
                            </div>
                        </div>
                    ) : (
                        <div className="max-w-3xl mx-auto">
                            <div className="space-y-8">
                                {messages.map((msg, index) => (
                                    <div key={index} className={`flex items-start gap-3 sm:gap-4 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                        {msg.role === 'assistant' && (
                                            <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-full flex items-center justify-center shrink-0 bg-gradient-to-br from-orange-500 via-white to-green-600">
                                                <Bot size={18} className="text-gray-800"/>
                                            </div>
                                        )}
                                        <div className={`max-w-xl prose prose-invert prose-p:text-gray-300 prose-li:text-gray-300 p-4 rounded-xl ${msg.role === 'user' ? 'bg-green-800/50 rounded-br-none' : 'bg-gray-800/50 rounded-bl-none'}`}>
                                            <MarkdownRenderer content={msg.content} />
                                        </div>
                                         {msg.role === 'user' && (
                                            <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-full flex items-center justify-center shrink-0 bg-gradient-to-br from-green-500 to-teal-500">
                                                <User size={18} />
                                            </div>
                                        )}
                                    </div>
                                ))}
                                {isLoading && <div className="flex items-start gap-4"><div className="h-9 w-9 rounded-full bg-gradient-to-br from-orange-500 via-white to-green-600 flex items-center justify-center shrink-0"><Bot size={18} className="text-gray-800"/></div><div className="p-2"><Loader2 className="animate-spin text-white h-6 w-6" /></div></div>}
                                <div ref={messagesEndRef} />
                            </div>
                        </div>
                    )}
                </div>

                <div className="p-4 sm:p-6 pt-2 w-full max-w-3xl mx-auto">
                    {/* The border wrapper div */}
                    <div className={`
                        p-0.5 rounded-xl transition-all duration-300
                        ${isNewChat 
                            ? 'animated-gradient-border' 
                            : 'bg-gray-700 focus-within:bg-gradient-to-r from-orange-500 to-green-500'
                        }
                    `}>
                        {/* The form with the fill color */}
                         <form
                            onSubmit={handleSendMessage}
                            className="flex items-center bg-gray-900 p-1.5 rounded-[10px]"
                        >
                            <textarea ref={inputRef} value={input} onChange={handleInputChange} onKeyDown={(e) => {if (e.key === 'Enter' && !e.shiftKey) {e.preventDefault(); handleSendMessage(e);}}} placeholder="Ask a legal question..." className="flex-1 bg-transparent p-2.5 text-white placeholder-gray-400 focus:outline-none resize-none h-12 max-h-48" rows={1} />
                            <button type="submit" disabled={!input.trim() || isLoading} className="bg-gray-700 text-white p-3 ml-2 rounded-lg disabled:bg-gray-800 disabled:text-gray-400 disabled:cursor-not-allowed hover:bg-gray-600 transition-colors">
                                {isLoading ? <Loader2 className="animate-spin h-5 w-5" /> : <Send className="h-5 w-5" />}
                            </button>
                        </form>
                    </div>
                </div>
            </main>
        </div>
    );
};
