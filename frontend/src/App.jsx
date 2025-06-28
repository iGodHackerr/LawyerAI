import React, { useState, useEffect, useRef } from 'react';
import { Plus, MessageSquare, LogIn, Send, User, Bot, Loader2, Menu, Sparkles, X, Code, BarChart, BookOpen, MoreHorizontal, Trash2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Scale } from 'lucide-react'; // Or whatever icon you choose
// --- Main App Component ---
export default function App() {
    const [userId, setUserId] = useState(localStorage.getItem('userId') || null);
    const [isLoggingIn, setIsLoggingIn] = useState(false);

    const handleSignIn = async () => {
        setIsLoggingIn(true);
        try {
            const response = await fetch('http://127.0.0.1:5001/login', { method: 'POST' });
            if (!response.ok) throw new Error('Login failed');
            const data = await response.json();
            localStorage.setItem('userId', data.userId);
            setUserId(data.userId);
        } catch (error) {
            console.error("Authentication failed:", error);
            alert("Could not log in. Please ensure the backend server is running on port 5001.");
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

const LoginPage = ({ onSignIn }) => (
    // <div className="flex flex-col items-center justify-center h-screen bg-gray-800">
    //     <div className="text-center p-8 bg-gray-900 rounded-2xl shadow-2xl max-w-sm w-full">
    //         <Bot size={48} className="mx-auto text-blue-500 mb-4" />
    //         <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
    //         <p className="text-gray-400 mb-6">Create a new session to continue.</p>
    //         <button onClick={onSignIn} className="w-full flex items-center justify-center bg-blue-600 text-white font-semibold py-3 px-4 rounded-xl hover:bg-blue-700 transition-colors">
    //             <LogIn className="mr-2 h-5 w-5" />
    //             Start Chatting
    //         </button>
    //     </div>
    // </div>
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
        fetch(`http://127.0.0.1:5001/chats/${userId}`).then(res => res.json()).then(setChats).catch(err => console.error("Error fetching chats:", err));
    }, [userId]);

    useEffect(() => {
        if (!currentChatId) {
            setMessages([]);
            return;
        }
        setIsLoading(true);
        fetch(`http://127.0.0.1:5001/chat/${currentChatId}/messages`).then(res => res.json()).then(setMessages).catch(err => console.error("Error fetching messages:", err)).finally(() => setIsLoading(false));
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
            const response = await fetch('http://127.0.0.1:5001/chat', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ userId }) });
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
            const response = await fetch(`http://127.0.0.1:5001/chat/${chatId}/title`, { method: 'POST' });
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
            const response = await fetch(`http://127.0.0.1:5001/chat/${currentChatId}/message`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ content: content.trim() }) });
            if (!response.ok) throw new Error("Backend request failed");
            const assistantMessage = await response.json();
            setMessages(prev => [...prev, assistantMessage]);
            if (isFirstMessage) updateChatTitle(currentChatId);
        } catch (error) {
            console.error("Error sending message:", error);
            setMessages(prev => [...prev.slice(0, -1), { role: 'assistant', content: "Sorry, couldn't get a response." }]);
        } finally { setIsLoading(false); }
    };

    const handleDeleteChat = async (chatIdToDelete) => {
        try {
            await fetch(`http://127.0.0.1:5001/chat/${chatIdToDelete}`, { method: 'DELETE' });
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







// import React, { useState, useEffect, useRef } from 'react';

// // === CUSTOM HOOKS ===
// const useScrollAnimation = (options) => {
//     const [isVisible, setIsVisible] = useState(false);
//     const ref = useRef(null);

//     useEffect(() => {
//         const observer = new IntersectionObserver(([entry]) => {
//             if (entry.isIntersecting) {
//                 setIsVisible(true);
//                 observer.unobserve(entry.target);
//             }
//         }, options);

//         if (ref.current) {
//             observer.observe(ref.current);
//         }

//         return () => {
//             if (ref.current) {
//                 // eslint-disable-next-line react-hooks/exhaustive-deps
//                 observer.unobserve(ref.current);
//             }
//         };
//     }, [ref, options]);

//     return [ref, isVisible];
// };

// const useWindowSize = () => {
//   const [windowSize, setWindowSize] = useState({
//     width: undefined,
//   });
//   useEffect(() => {
//     function handleResize() {
//       setWindowSize({
//         width: window.innerWidth,
//       });
//     }
//     window.addEventListener("resize", handleResize);
//     handleResize();
//     return () => window.removeEventListener("resize", handleResize);
//   }, []); 
//   return windowSize;
// };


// // === SVG ICONS ===
// const MenuIcon = (props) => (
//   <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><line x1="4" x2="20" y1="12" y2="12" /><line x1="4" x2="20" y1="6" y2="6" /><line x1="4" x2="20" y1="18" y2="18" /></svg>
// );
// const XIcon = (props) => (
//   <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
// );
// const CodeIcon = (props) => (
//   <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" /></svg>
// );
// const ZapIcon = (props) => (
//   <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>
// );
// const BarChartIcon = (props) => (
//   <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><line x1="12" x2="12" y1="20" y2="10" /><line x1="18" x2="18" y1="20" y2="4" /><line x1="6" x2="6" y1="20" y2="16" /></svg>
// );
// const LayersIcon = (props) => (
//     <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg>
// );
// const SunIcon = (props) => (
//   <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m4.93 19.07 1.41-1.41"/><path d="m17.66 6.34 1.41-1.41"/></svg>
// );
// const MoonIcon = (props) => (
//   <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>
// );

// // === FoxSol Logo SVG ===
// const FoxSolLogo = ({ className }) => (
//     <svg className={className} viewBox="0 0 200 40" fill="none" xmlns="http://www.w3.org/2000/svg">
//         <path d="M22.4 35.2L12 21.3333L1.6 35.2H0L12 18.6667L15.2 14.4L12 10.1333L0 26.6667V0H4.8V23.4667L12 13.8667L19.2 23.4667V0H24V26.6667L12 10.1333L8.8 14.4L12 18.6667L24 35.2H22.4Z" fill="currentColor"/>
//         <text x="30" y="30" fontFamily="sans-serif" fontSize="30" fontWeight="bold" fill="currentColor">FoxSol</text>
//     </svg>
// );

// // === Theme Toggle Switch Component ===
// const ThemeToggle = ({ theme, setTheme }) => {
//     const toggleTheme = () => {
//         const newTheme = theme === 'dark' ? 'light' : 'dark';
//         setTheme(newTheme);
//     };

//     return (
//         <button onClick={toggleTheme} className="w-14 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center p-1 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-cyan-500">
//             <div className={`w-6 h-6 rounded-full bg-white dark:bg-gray-800 shadow-md transform transition-transform duration-300 ${theme === 'dark' ? 'translate-x-6' : 'translate-x-0'}`}>
//                 {theme === 'dark' ? <MoonIcon className="w-4 h-4 text-cyan-400 m-1"/> : <SunIcon className="w-4 h-4 text-amber-500 m-1" />}
//             </div>
//         </button>
//     );
// };


// // === Header Component ===
// const Header = ({ theme, setTheme }) => {
//     const [isOpen, setIsOpen] = useState(false);
//     const navLinks = [ { href: '#services', label: 'Solutions' }, { href: '#work', label: 'Our Work' }, { href: '#about', label: 'About Us' }, { href: '#contact', label: 'Contact' }];

//     return (
//         <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-black/30 backdrop-blur-lg border-b border-gray-200 dark:border-cyan-500/10">
//             <div className="container mx-auto px-6 py-4 flex justify-between items-center">
//                 <a href="#" className="text-cyan-500 dark:text-cyan-300 transition-colors duration-300"><FoxSolLogo className="h-6 w-auto" /></a>
//                 <nav className="hidden md:flex items-center space-x-8">
//                     {navLinks.map((link) => (<a key={link.href} href={link.href} className="text-gray-600 dark:text-gray-200 hover:text-cyan-500 dark:hover:text-cyan-300 transition-colors duration-300 font-medium">{link.label}</a>))}
//                 </nav>
//                 <div className="hidden md:flex items-center gap-4">
//                     <ThemeToggle theme={theme} setTheme={setTheme} />
//                     <a href="#contact" className="bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-2 px-6 rounded-lg transition-all duration-300 transform hover:scale-105">Get Started</a>
//                 </div>
//                 <div className="md:hidden">
//                     <button onClick={() => setIsOpen(!isOpen)} className="text-gray-600 dark:text-gray-200 focus:outline-none">
//                         {isOpen ? <XIcon /> : <MenuIcon />}
//                     </button>
//                 </div>
//             </div>
//             {isOpen && (
//   <div
//     className="
//       fixed top-20 right-4 w-64 rounded-2xl 
//       bg-white/90 dark:bg-black/85 
//       backdrop-blur-[30px] 
//       border border-white/40 dark:border-white/25 
//       shadow-[0_8px_32px_rgba(0,0,0,0.15)] 
//       dark:shadow-[0_8px_48px_rgba(0,0,0,0.5)]
//       transition-all duration-500
//       z-50
//     "
//   >
//     <nav className="flex flex-col items-start space-y-6 px-6 py-6">
//       {navLinks
//         .filter((link) => link.label !== "Contact")
//         .map((link) => (
//           <a
//             key={link.href}
//             href={link.href}
//             onClick={() => setIsOpen(false)}
//             className="text-lg font-semibold text-gray-800 dark:text-gray-200 hover:text-cyan-500 dark:hover:text-cyan-300 transition-colors duration-300 w-full"
//           >
//             {link.label}
//           </a>
//         ))}

//       {/* Contact + Theme Toggle in 1x2 grid */}
//       <div className="w-full grid grid-cols-2 gap-4 items-center pt-2">
//         <a
//           href="#contact"
//           onClick={() => setIsOpen(false)}
//           className="text-lg font-semibold text-gray-800 dark:text-gray-200 hover:text-cyan-500 dark:hover:text-cyan-300 transition-colors duration-300 text-left"
//         >
//           Contact
//         </a>
//         <div className="flex justify-end">
//           <ThemeToggle theme={theme} setTheme={setTheme} />
//         </div>
//       </div>
//     </nav>
//   </div>
// )}

//         </header>
//     );
// };

// // === Animated Tagline Component ===
// const AnimatedTagline = () => {
//     const [text, setText] = useState('');
//     const [isDeleting, setIsDeleting] = useState(false);
//     const [loopNum, setLoopNum] = useState(0);
//     const [typingSpeed, setTypingSpeed] = useState(150);
//     const phrases = ["Clever Solutions.", "Clear Vision.", "Digitalization, Perfected."];

//     useEffect(() => {
//         const handleTyping = () => {
//             const i = loopNum % phrases.length;
//             const fullText = phrases[i];
//             setText(isDeleting ? fullText.substring(0, text.length - 1) : fullText.substring(0, text.length + 1));
//             setTypingSpeed(isDeleting ? 75 : 150);
//             if (!isDeleting && text === fullText) {
//                 setTimeout(() => setIsDeleting(true), 2000);
//             } else if (isDeleting && text === '') {
//                 setIsDeleting(false);
//                 setLoopNum(loopNum + 1);
//             }
//         };
//         const timer = setTimeout(handleTyping, typingSpeed);
//         return () => clearTimeout(timer);
//     }, [text, isDeleting, loopNum]);

//     return (<span className="border-r-2 border-cyan-400 pr-1">{text}</span>);
// };

// // === Hero Section Component ===
// const HeroSection = () => {
//     const solutions = [
//         { title: "AI Integration", description: "Seamlessly embed intelligence.", color: "cyan" },
//         { title: "Blockchain", description: "Build trust with decentralized tech.", color: "purple" },
//         { title: "Cloud Scale", description: "Infrastructure that grows with you.", color: "emerald" },
//         { title: "Data Insights", description: "Turn data into decisions.", color: "amber" },
//         { title: "Automation", description: "Optimize workflows, boost efficiency.", color: "rose" },
//     ];
    
//     const [activeIndex, setActiveIndex] = useState(0);

//     useEffect(() => {
//         const interval = setInterval(() => {
//             setActiveIndex((prevIndex) => (prevIndex + 1) % solutions.length);
//         }, 4000);
//         return () => clearInterval(interval);
//     }, [solutions.length]);
    
//     const getStatus = (index, activeIndex, numSolutions) => {
//         if (index === activeIndex) return 'active';
//         const prevIndex = (activeIndex - 1 + numSolutions) % numSolutions;
//         if (index === prevIndex) return 'previous';
//         const nextIndex = (activeIndex + 1) % numSolutions;
//         if (index === nextIndex) return 'next';
//         return 'hidden';
//     };

//     return (
//         <section className="relative min-h-[90vh] lg:min-h-screen flex flex-col items-center justify-center pt-32 lg:pt-24 pb-10 text-center overflow-hidden">
//             <div className="absolute inset-0 z-0">
//                 <div className="bg-grid-light dark:bg-grid-dark absolute top-0 left-0 w-full h-full"></div>
//                 <div className="absolute inset-0 bg-gradient-to-b from-white/0 via-white/50 dark:via-black/50 to-white dark:to-black"></div>
//             </div>

//             <div className="container mx-auto px-6 relative z-10">
//                 <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold text-gray-900 dark:text-white leading-tight tracking-tighter mb-4 animate-fade-in-down">FoxSol</h1>
//                 <p className="text-xl md:text-2xl lg:text-3xl font-light text-gray-600 dark:text-gray-200 h-10 animate-fade-in-up animation-delay-300"><AnimatedTagline /></p>
//             </div>
            
//             <div className="flex-grow flex items-center justify-center w-full relative mt-8 lg:mt-0">
//                 <div className="solution-carousel">
//                     {solutions.map((solution, index) => {
//                          const status = getStatus(index, activeIndex, solutions.length);
//                         return (
//                             <div key={solution.title} 
//                                  className={`solution-item ${status} bg-${solution.color}-500/10 dark:bg-${solution.color}-500/20`}
//                                  style={{
//                                     '--glow-color': `var(--${solution.color}-500)`,
//                                     '--glow-color-dark': `var(--${solution.color}-400)`
//                                  }}>
//                                 <div className="solution-content">
//                                     <h3 className="font-bold text-lg md:text-xl text-gray-900 dark:text-white">{solution.title}</h3>
//                                     <p className="hidden md:block text-sm text-gray-600 dark:text-gray-300">{solution.description}</p>
//                                 </div>
//                             </div>
//                         );
//                     })}
//                 </div>
//             </div>

//             <div className="container mx-auto px-6 relative z-10 mt-auto">
//                 <a href="#services" className="bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-500 hover:to-blue-600 text-white font-bold py-4 px-10 rounded-lg text-lg transition-all duration-300 transform hover:scale-105 shadow-[0_0_20px_rgba(56,189,248,0.5)] animate-fade-in-up animation-delay-600">Explore Our Solutions</a>
//             </div>
//         </section>
//     );
// };


// // === Services Section (FIXED with Popup) ===
// const ServicesSection = () => {
//     const [selectedCard, setSelectedCard] = useState(null);
//     const { width } = useWindowSize();
//     const isMobile = width < 1024; // lg breakpoint

//     const services = [
//         {
//             icon: <LayersIcon />,
//             title: "Digital Transformation",
//             description:
//                 "We re-engineer your core operations to build scalable, efficient, and future-proof digital foundations for the modern era. Our process involves a deep analysis of your existing systems to create a roadmap for innovation and growth.",
//             color: "cyan",
//         },
//         {
//             icon: <CodeIcon />,
//             title: "Custom Software Solutions",
//             description:
//                 "From enterprise-grade platforms to sleek mobile apps, we design and build bespoke software tailored precisely to your business challenges, delivering a unique competitive edge and enhanced user engagement.",
//             color: "purple",
//         },
//         {
//             icon: <ZapIcon />,
//             title: "Process Automation",
//             description:
//                 "Leveraging the latest in AI and machine learning, we streamline your workflows, reduce manual effort, and eliminate human error. Boost productivity and let your team focus on what matters most.",
//             color: "emerald",
//         },
//         {
//             icon: <BarChartIcon />,
//             title: "Data-Driven Insights",
//             description:
//                 "Unlock the hidden potential in your data to make smarter, faster, and more impactful business decisions. We provide comprehensive analytics, from data warehousing to predictive modeling.",
//             color: "amber",
//         },
//     ];

//     const openCard = (index) => {
//         if (isMobile) {
//             setSelectedCard(index);
//         }
//     };
//     const closeCard = () => setSelectedCard(null);

//     return (
//         <section id="services" className="py-20 bg-gray-50 dark:bg-black">
//             <div className="container mx-auto px-6">
//                 <div className="text-center mb-12">
//                     <h2 className="text-4xl font-bold text-gray-900 dark:text-white">Our Solutions</h2>
//                     <p className="text-lg text-gray-500 dark:text-gray-400 mt-2">Powering progress for every industry.</p>
//                     <div className="mt-4 w-24 h-1 bg-cyan-400 mx-auto rounded"></div>
//                 </div>
//                 <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
//                     {services.map((service, index) => (
//                         <div
//                             key={index}
//                             onClick={() => openCard(index)}
//                             className={`service-card group bg-white dark:bg-gray-900/50 p-6 rounded-xl backdrop-blur-sm transition-all duration-300 hover:-translate-y-2 ${
//                                 isMobile ? "cursor-pointer" : ""
//                             }`}
//                             style={{
//                                 "--glow-color": `var(--${service.color}-500)`,
//                                 "--glow-color-dark": `var(--${service.color}-400)`,
//                             }}
//                         >
//                             <div
//                                 className={`flex flex-col h-full ${
//                                     isMobile
//                                         ? "items-center justify-center text-center"
//                                         : "items-start text-left"
//                                 }`}
//                             >
//                                 <div
//                                     className={`w-12 h-12 md:w-16 md:h-16 rounded-lg mb-4 flex items-center justify-center bg-${service.color}-100 dark:bg-gray-800`}
//                                 >
//                                     {React.cloneElement(service.icon, {
//                                         className: `h-6 w-6 md:h-8 md:w-8 text-${service.color}-500 dark:text-${service.color}-400`,
//                                     })}
//                                 </div>
//                                 <h3 className="text-xl font-bold text-gray-900 dark:text-white">{service.title}</h3>
//                                 <p
//                                     className={`text-sm mt-2 text-gray-500 dark:text-gray-400 ${
//                                         isMobile ? "hidden" : "block"
//                                     }`}
//                                 >
//                                     {service.description}
//                                 </p>
//                                 <p
//                                     className={`text-sm mt-2 text-gray-500 dark:text-gray-400 opacity-70 group-hover:opacity-100 transition-opacity ${
//                                         isMobile ? "block" : "hidden"
//                                     }`}
//                                 >
//                                     Tap for more
//                                 </p>
//                             </div>
//                         </div>
//                     ))}
//                 </div>
//             </div>

//             {/* Expanded Card Modal */}
//             <div
//                 className={`modal-overlay fixed inset-0 bg-black/50 dark:bg-black/70 z-50 flex items-center justify-center ${
//                     selectedCard !== null ? "visible" : "hidden"
//                 }`}
//                 onClick={closeCard}
//             >
//                 {selectedCard !== null && (
//                     <div
//                         className={`expanded-card bg-white dark:bg-gray-900/80 m-4 p-8 rounded-2xl w-full max-w-lg relative transition-all duration-300 ease-in-out ${
//                             selectedCard !== null ? "scale-100 opacity-100" : "scale-95 opacity-0"
//                         }`}
//                         style={{
//                             "--glow-color": `var(--${services[selectedCard].color}-500)`,
//                             "--glow-color-dark": `var(--${services[selectedCard].color}-400)`,
//                         }}
//                         onClick={(e) => e.stopPropagation()}
//                     >
//                         <button
//                             onClick={closeCard}
//                             className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white transition-colors"
//                         >
//                             <XIcon className="w-6 h-6" />
//                         </button>
//                         <div className="flex flex-col items-start">
//                             <div
//                                 className={`w-16 h-16 rounded-lg mb-6 flex items-center justify-center bg-${services[selectedCard].color}-100 dark:bg-gray-800`}
//                             >
//                                 {React.cloneElement(services[selectedCard].icon, {
//                                     className: `h-8 w-8 text-${services[selectedCard].color}-500 dark:text-${services[selectedCard].color}-400`,
//                                 })}
//                             </div>
//                             <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
//                                 {services[selectedCard].title}
//                             </h2>
//                             <p className="text-gray-600 dark:text-gray-300 text-lg">
//                                 {services[selectedCard].description}
//                             </p>
//                         </div>
//                     </div>
//                 )}
//             </div>
//         </section>
//     );
// };



// // === Our Work/Showcase Section ===
// const WorkSection = () => {
//     const workItems = [
//         { image: "https://storage.googleapis.com/gemini-prod-us-west1-assets/e53a8a3a31c556b0b5d922f309d94411.png", title: "Project Nova: AI-Powered Logistics", color: "cyan" },
//         { image: "https://storage.googleapis.com/gemini-prod-us-west1-assets/e13f9c6c06a445e48222a0e28f7311c1.png", title: "Helios: Decentralized Finance Hub", color: "rose" },
//     ];
//     return (
//         <section id="work" className={`py-20 bg-white dark:bg-gray-900/50`}>
//             <div className="container mx-auto px-6">
//                  <div className="text-center mb-12"><h2 className="text-4xl font-bold text-gray-900 dark:text-white">Our Work</h2><p className="text-lg text-gray-500 dark:text-gray-400 mt-2">See our clever solutions in action.</p><div className="mt-4 w-24 h-1 bg-cyan-400 mx-auto rounded"></div></div>
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
//                     {workItems.map((item, index) => (
//                         <div key={index} 
//                              className="work-card group rounded-xl overflow-hidden"
//                              style={{
//                                 '--glow-color': `var(--${item.color}-500)`,
//                                 '--glow-color-dark': `var(--${item.color}-400)`
//                              }}>
//                             <div className="overflow-hidden">
//                                 <img src={item.image} alt={item.title} className="w-full h-80 object-cover transform group-hover:scale-105 transition-transform duration-500" />
//                             </div>
//                             <div className="p-6 bg-gray-50/80 dark:bg-gray-800/80 backdrop-blur-sm">
//                                 <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{item.title}</h3>
//                                 <p className="text-gray-500 dark:text-gray-400">A comprehensive platform that automates supply chain management using predictive analytics.</p>
//                             </div>
//                         </div>
//                     ))}
//                 </div>
//             </div>
//         </section>
//     );
// };

// // === About Us Section (with dynamic light) ===
// const AboutSection = () => {
//     const imageContainerRef = useRef(null);

//     useEffect(() => {
//         const el = imageContainerRef.current;
//         if (!el) return;

//     }, []);

//     return (
//         <section id="about" className="py-20 bg-gray-50 dark:bg-black">
//             <div className="container mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
//                 <div
//     ref={imageContainerRef}
//     className="relative rounded-2xl overflow-hidden p-1 backdrop-blur-xl bg-white/5 dark:bg-white/10 shadow-2xl transition-transform duration-300"
//     style={{
//         transform: 'translateY(0)',
//         WebkitBackdropFilter: 'blur(12px)',
//         backdropFilter: 'blur(12px)',
//     }}
// >
//     {/* Top Left Blue Ambient Glow */}
//     <div className="absolute -top-10 -left-10 w-60 h-60 pointer-events-none z-0">
//         <div className="w-full h-full rounded-full bg-cyan-400 opacity-40 blur-[100px] mix-blend-screen"></div>
//     </div>

//     {/* Bottom Right Purple Ambient Glow */}
//     <div className="absolute -bottom-10 -right-10 w-60 h-60 pointer-events-none z-0">
//         <div className="w-full h-full rounded-full bg-purple-500 opacity-40 blur-[100px] mix-blend-screen"></div>
//     </div>

//     {/* Image */}
//     <img
//         src="https://storage.googleapis.com/gemini-prod-us-west1-assets/f0e34c919d3b451c04543788785312ec.png"
//         alt="Abstract AI generated image representing a clear vision with a stylized fox"
//         className="rounded-2xl relative z-10 w-full"
//         onError={(e) => {
//             e.target.onerror = null;
//             e.target.src =
//                 'https://placehold.co/600x400/0D1117/38BDF8?text=Vision';
//         }}
//     />
// </div>

//                 <div>
//                     <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Like a Fox.</h2>
//                     <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
//                         In a world of complexity, we bring clarity and ingenuity. FoxSol was founded on the principle that the most powerful solutions are often the most elegant and insightful. Like a fox navigating the forest, we use our cunning and expertise to find the clearest, most effective path to our clients' goals.
//                     </p>
//                     <p className="text-lg text-gray-600 dark:text-gray-300">
//                         Our mission is to democratize cutting-edge technology, making sophisticated digitalization accessible and impactful for any organization ready to lead its industry.
//                     </p>
//                 </div>
//             </div>
//         </section>
//     );
// };


// // === Contact Section ===
// const ContactSection = () => {
//     return (
//         <section id="contact" className={`py-20`}>
//             <div className="container mx-auto px-6">
//                 <div className="text-center mb-12"><h2 className="text-4xl font-bold text-gray-900 dark:text-white">Let's Build Together</h2><p className="text-lg text-gray-500 dark:text-gray-400 mt-2">Have a project in mind? We'd love to hear about it.</p><div className="mt-4 w-24 h-1 bg-cyan-400 mx-auto rounded"></div></div>
//                 <div className="max-w-3xl mx-auto bg-white/70 dark:bg-gray-800/50 p-8 rounded-xl border border-gray-200 dark:border-gray-700/50"><form><div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6"><input type="text" placeholder="Your Name" className="w-full bg-gray-100 dark:bg-gray-700/50 text-gray-800 dark:text-white border-2 border-gray-200 dark:border-gray-600 rounded-lg p-3 focus:outline-none focus:border-cyan-400 transition-colors" /><input type="email" placeholder="Your Email" className="w-full bg-gray-100 dark:bg-gray-700/50 text-gray-800 dark:text-white border-2 border-gray-200 dark:border-gray-600 rounded-lg p-3 focus:outline-none focus:border-cyan-400 transition-colors" /></div><div className="mb-6"><textarea placeholder="Your Message" rows="5" className="w-full bg-gray-100 dark:bg-gray-700/50 text-gray-800 dark:text-white border-2 border-gray-200 dark:border-gray-600 rounded-lg p-3 focus:outline-none focus:border-cyan-400 transition-colors"></textarea></div><div className="text-center"><button type="submit" className="bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-500 hover:to-blue-600 text-white font-bold py-3 px-12 rounded-lg text-lg transition-all duration-300 transform hover:scale-105 shadow-[0_0_20px_rgba(56,189,248,0.5)]">Send Message</button></div></form></div>
//             </div>
//         </section>
//     );
// };

// // === Footer Component ===
// const Footer = () => (
//     <footer className="border-t border-gray-200 dark:border-cyan-500/10 py-8"><div className="container mx-auto px-6 text-center text-gray-500 dark:text-gray-400"><a href="#" className="text-cyan-500 dark:text-cyan-300 mx-auto mb-4 inline-block transition-colors duration-300"><FoxSolLogo className="h-6 w-auto" /></a><p>&copy; {new Date().getFullYear()} FoxSol. All Rights Reserved.</p><p className="text-sm mt-1">Clever Solutions, Clear Vision.</p></div></footer>
// );

// // === Main App Component ===
// export default function App() {
//   const [theme, setTheme] = useState('light');

//   useEffect(() => {
//     const savedTheme = localStorage.getItem('theme');
//     const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
//     if (savedTheme) {
//         handleSetTheme(savedTheme);
//     } else {
//         handleSetTheme(systemPrefersDark ? 'dark' : 'light');
//     }
//   }, []);

//   const handleSetTheme = (newTheme) => {
//       setTheme(newTheme);
//       localStorage.setItem('theme', newTheme);
//       if (newTheme === 'dark') {
//           document.documentElement.classList.add('dark');
//       } else {
//           document.documentElement.classList.remove('dark');
//       }
//   };


//   return (
//     <div className="bg-white text-gray-800 dark:bg-black dark:text-gray-200 font-sans antialiased transition-colors duration-500">
//         <style jsx global>{`
//             :root {
//                 --cyan-100: #cffafe; --cyan-400: #22d3ee; --cyan-500: #06b6d4;
//                 --purple-100: #f3e8ff; --purple-400: #c084fc; --purple-500: #a855f7;
//                 --emerald-100: #d1fae5; --emerald-400: #34d399; --emerald-500: #10b981;
//                 --amber-100: #fef3c7; --amber-400: #fbbf24; --amber-500: #f59e0b;
//                 --rose-100: #ffe4e6; --rose-400: #fb7185; --rose-500: #f43f5e;
//             }
//             html { scroll-behavior: smooth; }
//             body { font-family: 'Inter', sans-serif; overflow-x: hidden;}

//             .animate-fade-in-down { animation: fadeInDown 0.8s ease-out forwards; }
//             .animate-fade-in-up { animation: fadeInUp 0.8s ease-out forwards; opacity: 0; }
//             .animation-delay-300 { animation-delay: 0.3s; }
//             .animation-delay-600 { animation-delay: 0.6s; }
//             @keyframes fadeInDown { from { opacity: 0; transform: translateY(-20px); } to { opacity: 1; transform: translateY(0); } }
//             @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }

//             /* --- GLOWING CARDS --- */
//             .service-card, .work-card, .about-image-container, .expanded-card {
//                 position: relative;
//                 z-index: 1;
//                 border: 1px solid var(--border-color);
//                 background-clip: padding-box;
//                 transition: transform 0.3s ease;
//                 --border-color: color-mix(in srgb, var(--glow-color) 40%, #e5e7eb);
//                 --border-color-dark: color-mix(in srgb, var(--glow-color-dark) 40%, #374151);
//             }
//             .light .service-card, .light .work-card, .light .about-image-container, .light .expanded-card { border-color: var(--border-color-light); }
//             .dark .service-card, .dark .work-card, .dark .about-image-container, .dark .expanded-card { border-color: var(--border-color-dark); }
           
//             .service-card::after, .work-card::after, .about-image-container::before, .expanded-card::after {
//                 content: '';
//                 position: absolute;
//                 inset: 0;
//                 z-index: -1;
//                 margin: -20px;
//                 border-radius: 1.3rem; /* slightly larger than card's rounded-xl */
//                 background: var(--glow-color);
//                 filter: blur(40px);
//                 opacity: 0.3;
//                 transition: opacity 0.4s ease-in-out;
//             }
//             .dark .service-card::after, .dark .work-card::after, .dark .about-image-container::before, .dark .expanded-card::after {
//                 background: var(--glow-color-dark);
//                 opacity: 0.4;
//             }
//             .service-card:hover::after, .work-card:hover::after, .expanded-card:hover::after {
//                 opacity: 0.5;
//             }
//             .dark .service-card:hover::after, .dark .work-card:hover::after, .dark .expanded-card:hover::after {
//                  opacity: 0.6;
//             }
            
//             /* --- ABOUT US DUAL LIGHT --- */
//             .about-image-container { overflow: hidden; }
//             .about-image-lights {
//                 position: absolute;
//                 inset: 0;
//                 border-radius: inherit;
//                 background-image: radial-gradient(circle at top left, var(--cyan-400), transparent 30%),
//                                   radial-gradient(circle at bottom right, var(--purple-400), transparent 30%);
//                 opacity: 0.3;
//                 transition: opacity 0.4s ease;
//                 background-position: calc(var(--mouse-x, 0px) - 250px) calc(var(--mouse-y, 0px) - 250px);
//             }
//             .about-image-container:hover .about-image-lights {
//                 opacity: 0.6;
//             }
            
//             /* --- MODAL --- */
//             .modal-overlay {
//                 position: fixed; inset: 0;
//                 background-color: rgba(0, 0, 0, 0.5);
//                 backdrop-filter: blur(8px);
//                 display: flex; align-items: center; justify-content: center;
//                 z-index: 100;
//                 opacity: 0; visibility: hidden;
//                 transition: opacity 0.3s ease, visibility 0s 0.3s;
//             }
//             .modal-overlay.visible {
//                 opacity: 1; visibility: visible;
//                 transition-delay: 0s;
//             }
            
//             /* --- HERO CAROUSEL --- */
//             .solution-carousel { position: relative; width: 100%; height: 100%; }
//             .solution-item {
//                 position: absolute; left: 50%; top: 50%;
//                 width: 300px; aspect-ratio: 1 / 1;
//                 border-radius: 50%; display: flex; align-items: center; justify-content: center; text-align: center;
//                 transition: transform 1.2s cubic-bezier(0.45, 0, 0.55, 1), opacity 1.2s ease-in-out;
//                 backdrop-filter: blur(5px); padding: 20px;
//                 border: 1px solid color-mix(in srgb, var(--glow-color-dark) 40%, transparent);
//             }
//             .solution-item::after {
//                 content: ''; position: absolute; inset: -20px;
//                 border-radius: 50%; background: var(--glow-color-dark);
//                 filter: blur(50px); z-index: -1;
//                 transition: opacity 1.2s cubic-bezier(0.45, 0, 0.55, 1);
//             }
//             .solution-content { transition: opacity 0.8s ease-in-out, filter 0.8s ease-in-out; }
            
//             .solution-item.active {
//                 transform: translate(-50%, -50%) scale(1); opacity: 1; z-index: 3;
//             }
//             .solution-item.active::after { opacity: 0.35; }
//             .solution-item.active .solution-content { filter: blur(0px); }

//             .solution-item.next {
//                 transform: translate(60%, -50%) scale(0.7); opacity: 0.6; z-index: 2;
//             }
//             .solution-item.next::after, .solution-item.previous::after { opacity: 0.15; }
//             .solution-item.next .solution-content, .solution-item.previous .solution-content { filter: blur(1.5px); }

//             .solution-item.previous {
//                 transform: translate(-160%, -50%) scale(0.7); opacity: 0.6; z-index: 2;
//             }
            
//             .solution-item.hidden {
//                 transform: translate(-50%, -50%) scale(0.5); opacity: 0; z-index: 1; pointer-events: none;
//             }
            
//             @media (max-width: 768px) {
//                  .solution-item { width: 220px; }
//                 .solution-item.next { transform: translate(45%, -50%) scale(0.6); }
//                 .solution-item.previous { transform: translate(-145%, -50%) scale(0.6); }
//             }
//             .bg-grid-light { background-image: linear-gradient(rgba(0,0,0, 0.04) 1px, transparent 1px), linear-gradient(to right, rgba(0,0,0, 0.04) 1px, transparent 1px); background-size: 2rem 2rem; }
//             .dark .bg-grid-dark { background-image: linear-gradient(rgba(34, 211, 238, 0.07) 1px, transparent 1px), linear-gradient(to right, rgba(34, 211, 238, 0.07) 1px, transparent 1px); background-size: 2rem 2rem; }
//         `}</style>
       
//         <Header theme={theme} setTheme={handleSetTheme} />
//         <main>
//             <HeroSection />
//             <ServicesSection />
//             <WorkSection />
//             <AboutSection />
//             <ContactSection />
//         </main>
//         <Footer />
//     </div>
//   );
// }
