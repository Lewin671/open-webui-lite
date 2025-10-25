import React from 'react';

const MarkdownRenderer = ({ content }) => {
    // Simple markdown-like rendering for basic formatting
    const formatContent = (text) => {
        if (!text) return [];

        // Split by lines and process each line
        const lines = text.split('\n');
        const formattedLines = lines.map((line, index) => {
            // Handle code blocks (```)
            if (line.startsWith('```')) {
                return { type: 'code-block-start', content: line, key: index };
            }

            // Handle headers (# ## ###)
            if (line.startsWith('### ')) {
                return { type: 'h3', content: line.substring(4), key: index };
            }
            if (line.startsWith('## ')) {
                return { type: 'h2', content: line.substring(3), key: index };
            }
            if (line.startsWith('# ')) {
                return { type: 'h1', content: line.substring(2), key: index };
            }

            // Handle lists (- or *)
            if (line.startsWith('- ') || line.startsWith('* ')) {
                return { type: 'list', content: line.substring(2), key: index };
            }

            // Handle numbered lists
            if (/^\d+\. /.test(line)) {
                return { type: 'numbered-list', content: line.replace(/^\d+\. /, ''), key: index };
            }

            // Regular line
            return { type: 'paragraph', content: line, key: index };
        });

        return formattedLines;
    };

    const renderLine = (line) => {
        const formatInline = (text) => {
            // Handle bold (**text**)
            text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

            // Handle italic (*text*)
            text = text.replace(/\*(.*?)\*/g, '<em>$1</em>');

            // Handle inline code (`code`)
            text = text.replace(/`(.*?)`/g, '<code class="bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded text-sm font-mono">$1</code>');

            // Handle links [text](url)
            text = text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-blue-600 dark:text-blue-400 hover:underline" target="_blank" rel="noopener noreferrer">$1</a>');

            return text;
        };

        switch (line.type) {
            case 'h1':
                return (
                    <h1 key={line.key} className="text-2xl font-bold mt-4 mb-2">
                        <span dangerouslySetInnerHTML={{ __html: formatInline(line.content) }} />
                    </h1>
                );
            case 'h2':
                return (
                    <h2 key={line.key} className="text-xl font-bold mt-3 mb-2">
                        <span dangerouslySetInnerHTML={{ __html: formatInline(line.content) }} />
                    </h2>
                );
            case 'h3':
                return (
                    <h3 key={line.key} className="text-lg font-bold mt-2 mb-1">
                        <span dangerouslySetInnerHTML={{ __html: formatInline(line.content) }} />
                    </h3>
                );
            case 'list':
                return (
                    <li key={line.key} className="ml-4 mb-1">
                        <span dangerouslySetInnerHTML={{ __html: formatInline(line.content) }} />
                    </li>
                );
            case 'numbered-list':
                return (
                    <li key={line.key} className="ml-4 mb-1">
                        <span dangerouslySetInnerHTML={{ __html: formatInline(line.content) }} />
                    </li>
                );
            case 'code-block-start':
                return null; // Skip code block markers for now
            case 'paragraph':
            default:
                if (line.content.trim() === '') {
                    return <br key={line.key} />;
                }
                return (
                    <p key={line.key} className="mb-2">
                        <span dangerouslySetInnerHTML={{ __html: formatInline(line.content) }} />
                    </p>
                );
        }
    };

    const formattedLines = formatContent(content);

    // Ensure formattedLines is always an array
    if (!Array.isArray(formattedLines)) {
        return <div className="prose prose-sm dark:prose-invert max-w-none"></div>;
    }

    return (
        <div className="prose prose-sm dark:prose-invert max-w-none">
            {formattedLines.map(renderLine)}
        </div>
    );
};

export default MarkdownRenderer;
