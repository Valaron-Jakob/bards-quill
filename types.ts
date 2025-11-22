export interface HighlightRule {
  id: string;
  startChar: string;
  endChar: string;
  color: string; // Hex or Tailwind class representative
  name: string;
}

export type FontSize = 'text-sm' | 'text-base' | 'text-lg' | 'text-xl';

export interface AppSettings {
  chunkSize: number;
  partPrefix: string;
  partSuffix: string;
  highlightRules: HighlightRule[];
  fontSize: FontSize;
  darkMode: boolean;
}

export interface TextChunk {
  id: string;
  content: string; // The processed content (with prefix/suffix)
  originalContent: string; // The raw content from the input
  startIndex: number; // Start index in the original raw text
  endIndex: number; // End index in the original raw text
  index: number;
  total: number;
  length: number;
  carriedHighlightRuleId?: string; // The ID of a highlight rule that was active when the previous chunk ended
}