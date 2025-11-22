import React, { useState, useMemo } from 'react';
import { Copy, Check } from 'lucide-react';
import { TextChunk, HighlightRule, FontSize } from '../types';

interface OutputCardProps {
  chunk: TextChunk;
  highlightRules: HighlightRule[];
  fontSize: FontSize;
}

// Helper to parse and highlight text content
const HighlightedText: React.FC<{ text: string; rules: HighlightRule[]; initialRuleId?: string }> = ({ text, rules, initialRuleId }) => {
  const parts = useMemo(() => {
    if (!text) return [];
    
    type Token = { text: string; color: string | null };
    const tokens: Token[] = [];
    
    let i = 0;
    let currentRuleId = initialRuleId;
    let buffer = "";

    while (i < text.length) {
      if (currentRuleId) {
        const rule = rules.find(r => r.id === currentRuleId);
        const endMarker = rule?.endChar ?? "";
        if (endMarker && text.startsWith(endMarker, i)) {
          // append end marker and flush colored token
          buffer += endMarker;
          tokens.push({ text: buffer, color: rule?.color || null });
          buffer = "";
          currentRuleId = undefined;
          i += endMarker.length;
        } else {
          // consume one char into colored buffer
          buffer += text[i];
          i += 1;
        }
      } else {
        // not in a rule: check for any start marker at this position
        const matchingRule = rules.find(r => r.startChar && text.startsWith(r.startChar, i));
        if (matchingRule) {
          // flush any uncolored buffer
          if (buffer.length > 0) {
            tokens.push({ text: buffer, color: null });
          }
          // start new colored buffer with the start marker
          buffer = matchingRule.startChar;
          currentRuleId = matchingRule.id;
          i += matchingRule.startChar.length;
        } else {
          // no marker: consume one char into uncolored buffer
          buffer += text[i];
          i += 1;
        }
      }
    }

    // flush remaining buffer
    if (buffer.length > 0) {
      if (currentRuleId) {
        const rule = rules.find(r => r.id === currentRuleId);
        tokens.push({ text: buffer, color: rule?.color || null });
      } else {
        tokens.push({ text: buffer, color: null });
      }
    }

    return tokens;
  }, [text, rules, initialRuleId]);

  return (
    <>
      {parts.map((part, i) => (
        <span key={i} style={{ color: part.color || 'inherit' }}>
          {part.text}
        </span>
      ))}
    </>
  );
};

export const OutputCard: React.FC<OutputCardProps> = ({ chunk, highlightRules, fontSize }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(chunk.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-fantasy-paper border border-fantasy-accent/20 rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-300 group relative dark:border-slate-700">
      <div className="flex justify-between items-start mb-2 border-b border-fantasy-accent/10 pb-2 dark:border-slate-700">
        <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest dark:text-indigo-300">
          Part {chunk.index}
        </span>
        <button
          onClick={handleCopy}
          className={`
            p-1.5 rounded-md transition-all duration-200
            ${copied 
              ? 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300' 
              : 'bg-indigo-50 text-indigo-400 hover:bg-indigo-100 hover:text-indigo-600 dark:bg-slate-700 dark:text-slate-400 dark:hover:bg-slate-600 dark:hover:text-indigo-300 opacity-0 group-hover:opacity-100'
            }
          `}
          title="Copy to clipboard"
        >
          {copied ? <Check size={14} /> : <Copy size={14} />}
        </button>
      </div>
      
      <div className={`font-sans text-slate-900 dark:text-slate-200 leading-relaxed whitespace-pre-wrap break-words ${fontSize}`}>
        <HighlightedText 
          text={chunk.content} 
          rules={highlightRules} 
          initialRuleId={chunk.carriedHighlightRuleId}
        />
      </div>
      
      <div className="absolute bottom-2 right-4 text-[10px] text-slate-300 dark:text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity">
        {chunk.content.length} chars
      </div>
    </div>
  );
};