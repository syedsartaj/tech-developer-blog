'use client';

import { useEffect, useRef, useState } from 'react';

interface CodeBlockProps {
  code: string;
  language?: string;
  compact?: boolean;
  showLineNumbers?: boolean;
  fileName?: string;
}

export default function CodeBlock({
  code,
  language = 'javascript',
  compact = false,
  showLineNumbers = false,
  fileName
}: CodeBlockProps) {
  const codeRef = useRef<HTMLElement>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // In a real implementation, you would load and apply Prism.js here
    // For now, we'll use basic syntax highlighting with CSS
    if (codeRef.current && typeof window !== 'undefined') {
      // Prism.js would be loaded here: Prism.highlightElement(codeRef.current);
    }
  }, [code, language]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  const getLanguageLabel = (lang: string) => {
    const labels: { [key: string]: string } = {
      javascript: 'JavaScript',
      typescript: 'TypeScript',
      jsx: 'JSX',
      tsx: 'TSX',
      python: 'Python',
      java: 'Java',
      cpp: 'C++',
      css: 'CSS',
      html: 'HTML',
      json: 'JSON',
      bash: 'Bash',
      sql: 'SQL',
      rust: 'Rust',
      go: 'Go',
    };
    return labels[lang] || lang.toUpperCase();
  };

  return (
    <div className="code-block-wrapper">
      {/* Code Block Header */}
      {!compact && (
        <div className="bg-dark-card border border-gray-800 border-b-0 rounded-t-lg px-4 py-2 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex space-x-2">
              <div className="w-3 h-3 rounded-full bg-red-500/50" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
              <div className="w-3 h-3 rounded-full bg-green-500/50" />
            </div>
            {fileName && (
              <span className="text-sm text-gray-400 font-mono">{fileName}</span>
            )}
          </div>
          <span className="text-xs text-gray-500 font-mono">
            {getLanguageLabel(language)}
          </span>
        </div>
      )}

      {/* Code Content */}
      <div className="relative">
        <pre className={`code-block ${compact ? 'rounded-lg' : 'rounded-b-lg border-t-0'} ${showLineNumbers ? 'line-numbers' : ''}`}>
          <code ref={codeRef} className={`language-${language}`}>
            {code}
          </code>
        </pre>

        {/* Copy Button */}
        <button
          onClick={handleCopy}
          className={`copy-button ${copied ? 'copied' : ''}`}
          aria-label="Copy code"
        >
          {copied ? (
            <svg
              className="w-4 h-4 inline-block mr-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          ) : (
            <svg
              className="w-4 h-4 inline-block mr-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
              />
            </svg>
          )}
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
    </div>
  );
}
