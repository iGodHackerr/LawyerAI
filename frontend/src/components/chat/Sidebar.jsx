import React, { useState, useRef, useEffect } from 'react';
import { Plus, MessageSquare, User, Loader2, X, MoreHorizontal, Trash2, Scale, Globe } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext.jsx';
import { useTranslation } from 'react-i18next';

const ChatListItem = ({ chat, currentChatId, onSelectChat, onDeleteChat }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef(null);
    const { t } = useTranslation();

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setIsMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="relative group">
            <button onClick={() => onSelectChat(chat._id)} className={`w-full text-left pl-3 pr-8 py-2.5 rounded-lg flex items-center gap-3 transition-colors relative ${currentChatId === chat._id ? 'bg-white/10 text-white' : 'hover:bg-white/5'}`}>
                {currentChatId === chat._id && <div className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-1 bg-orange-500 rounded-r-full"></div>}
                <MessageSquare className="h-5 w-5 text-gray-400 shrink-0" />
                <span className="truncate text-sm font-medium">{chat.title || t('newChat')}</span>
            </button>
            <div className="absolute right-1 top-1/2 -translate-y-1/2 z-10">
                <button onClick={(e) => { e.stopPropagation(); setIsMenuOpen(prev => !prev); }} className="p-1.5 rounded-full hover:bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity">
                    <MoreHorizontal size={18}/>
                </button>
            </div>
            {isMenuOpen && (
                <div ref={menuRef} className="absolute z-20 right-0 top-full mt-1 w-40 bg-gray-800 border border-gray-700 rounded-lg shadow-lg">
                    <button onClick={() => { onDeleteChat(chat._id); setIsMenuOpen(false); }} className="w-full text-left flex items-center gap-3 px-3 py-2 text-sm text-red-400 hover:bg-red-500/10">
                        <Trash2 size={16}/> {t('deleteChat')}
                    </button>
                </div>
            )}
        </div>
    );
};

const LanguageSwitcher = () => {
    const { language, changeLanguage, supportedLanguages } = useLanguage();
    const { t } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef(null);

     useEffect(() => {
        const handleClickOutside = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={menuRef}>
            <button onClick={() => setIsOpen(!isOpen)} className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-white/5 transition-colors">
                <div className="flex items-center gap-3">
                    <Globe size={18} className="text-gray-400"/>
                    <span className="text-sm font-medium text-white">{t('language')}</span>
                </div>
                <span className="text-sm text-gray-400">{supportedLanguages[language].split(' ')[0]}</span>
            </button>
            {isOpen && (
                <div className="absolute bottom-full mb-2 w-full bg-gray-800 border border-gray-700 rounded-lg shadow-lg z-20 max-h-48 overflow-y-auto">
                    {Object.entries(supportedLanguages).map(([code, name]) => (
                        <button key={code} onClick={() => { changeLanguage(code); setIsOpen(false); }} className={`w-full text-left px-3 py-2 text-sm hover:bg-white/10 ${language === code ? 'text-orange-400' : 'text-white'}`}>
                            {name}
                        </button>
                    ))}
                </div>
            )}
        </div>
    )
}

const Sidebar = ({ userId, chats, currentChatId, isChatListLoading, isVisible, onClose, onNewChat, onSelectChat, onDeleteChat, onSignOut }) => {
    const { t } = useTranslation();
    return (
        <aside className={`fixed md:relative top-0 left-0 h-full bg-gray-900/70 backdrop-blur-xl border-r border-white/10 flex flex-col shrink-0 z-30 transition-transform duration-300 ease-in-out ${isVisible ? 'translate-x-0' : '-translate-x-full'} w-72`}>
            <div className="flex items-center justify-between p-4 border-b border-white/10 shrink-0">
                <div className="flex items-center gap-2">
                    <Scale size={24} className="text-orange-400"/>
                    <h1 className="text-xl font-bold text-white">{t('appTitle')}</h1>
                </div>
                <button onClick={onClose} className="p-1 rounded-full hover:bg-white/10 md:hidden"><X size={20}/></button>
            </div>
            <div className="p-2 flex-shrink-0">
                <button onClick={onNewChat} className="w-full flex items-center justify-center gap-2 bg-white/5 border border-white/10 text-white font-semibold py-2.5 px-4 rounded-lg shadow-sm hover:bg-white/10 hover:border-white/20 transition-all duration-300">
                    <Plus className="h-5 w-5" /> {t('newChat')}
                </button>
            </div>
            <div className="flex-grow overflow-y-auto p-2 space-y-1">
                {isChatListLoading ? (
                    <div className="flex justify-center items-center h-full">
                        <Loader2 className="animate-spin text-white h-6 w-6" />
                    </div>
                ) : chats.map(chat => (
                    <ChatListItem key={chat._id} chat={chat} currentChatId={currentChatId} onSelectChat={onSelectChat} onDeleteChat={onDeleteChat} />
                ))}
            </div>
            <div className="p-2 border-t border-white/10 shrink-0 space-y-2">
                <LanguageSwitcher />
                <button onClick={onSignOut} className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors">
                    <div className="h-9 w-9 rounded-full bg-gradient-to-br from-green-500 to-teal-500 flex items-center justify-center shrink-0"><User size={18}/></div>
                    <div className="text-left overflow-hidden"><p className="text-sm font-semibold text-white">{t('userSession')}</p><p className="text-xs text-gray-400 truncate">{userId}</p></div>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
