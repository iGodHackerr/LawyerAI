import React from 'react';
import ReactMarkdown from 'react-markdown';

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

export default MarkdownRenderer;
