import { AppSettings, TextChunk, HighlightRule } from '../types';

/**
 * Splits text into chunks respecting word boundaries and adding user-defined prefixes/suffixes.
 * Maintains highlight state across chunks.
 */
export const splitText = (text: string, settings: AppSettings): TextChunk[] => {
  if (!text) return [];

  const { chunkSize, partPrefix, partSuffix, highlightRules } = settings;
  const chunks: TextChunk[] = [];
  
  // State tracking
  let currentChunkContent = "";
  let currentChunkStartIndex = 0; // Track where we are in the original text (cumulative)
  let currentChunkRawLength = 0; // Track length of raw text in current chunk (without prefix/suffix)
  
  // The absolute index tracker for the loop
  let currentScanIndex = 0;

  let currentActiveHighlightId: string | undefined = undefined;
  
  // New helper: compute final highlight state after scanning a string,
  // supporting multi-character start/end markers via startsWith checks.
  const computeStateAfterText = (segment: string, initialState: string | undefined): string | undefined => {
    let state = initialState;
    let j = 0;
    while (j < segment.length) {
      let matched = false;
      if (state) {
        const rule = highlightRules.find(r => r.id === state);
        const end = rule?.endChar ?? "";
        if (end && segment.startsWith(end, j)) {
          // consume end marker
          j += end.length;
          state = undefined;
          matched = true;
        }
      } else {
        const matchingRule = highlightRules.find(r => r.startChar && segment.startsWith(r.startChar, j));
        if (matchingRule) {
          // consume start marker
          j += matchingRule.startChar.length;
          state = matchingRule.id;
          matched = true;
        }
      }
      if (!matched) j += 1;
    }
    return state;
  };
  
  // Split by whitespace but keep delimiters to reconstruct text perfectly
  const words = text.split(/(\s+)/); 
  
  // Temporary state for the chunk being built
  let chunkStartHighlightId = undefined; // The highlight state at the START of the current chunk

  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    
    // Calculate the "cost" of adding this word
    const effectivePrefix = chunks.length === 0 ? "" : partPrefix;
    const potentialLength = effectivePrefix.length + currentChunkContent.length + word.length + partSuffix.length;

    // Scan highlight state using substring-aware helper
    const tempHighlightState = computeStateAfterText(word, currentActiveHighlightId);

    if (potentialLength <= chunkSize) {
      currentChunkContent += word;
      currentChunkRawLength += word.length;
      currentScanIndex += word.length;
      currentActiveHighlightId = tempHighlightState; // Commit the state change
    } else {
      // Chunk is full. Push current chunk.
      
      // Edge Case: If currentChunk is empty, the single word is bigger than the limit.
      if (currentChunkContent.length === 0) {
        // Force split the word
        const availableSpace = chunkSize - effectivePrefix.length - partSuffix.length;
        const safeSplitIndex = Math.max(1, availableSpace);
        const sub = word.substring(0, safeSplitIndex);
        const rest = word.substring(safeSplitIndex);
        
        // Recalculate state for just the sub-part using substring-aware helper
        const subState = computeStateAfterText(sub, currentActiveHighlightId);

        chunks.push({
          id: `chunk-${chunks.length}-${Date.now()}`,
          content: effectivePrefix + sub + partSuffix,
          originalContent: sub,
          startIndex: currentChunkStartIndex,
          endIndex: currentChunkStartIndex + sub.length,
          index: 0, 
          total: 0,
          length: (effectivePrefix + sub + partSuffix).length,
          carriedHighlightRuleId: chunkStartHighlightId
        });
        
        // Update global trackers
        currentChunkStartIndex += sub.length;
        currentScanIndex += sub.length;

        // Update words array to process the rest
        words[i] = rest;
        i--; // Retry this index with the shortened word
        
        // Reset Chunk State
        chunkStartHighlightId = subState;
        currentActiveHighlightId = subState;
        currentChunkContent = "";
        currentChunkRawLength = 0;
        continue;
      }

      // Normal push
      chunks.push({
        id: `chunk-${chunks.length}-${Date.now()}`,
        content: effectivePrefix + currentChunkContent + partSuffix,
        originalContent: currentChunkContent,
        startIndex: currentChunkStartIndex,
        endIndex: currentChunkStartIndex + currentChunkRawLength,
        index: 0,
        total: 0,
        length: (effectivePrefix + currentChunkContent + partSuffix).length,
        carriedHighlightRuleId: chunkStartHighlightId
      });

      // Update global trackers
      currentChunkStartIndex += currentChunkRawLength;
      
      // Start new chunk: set the carried highlight state to whatever was active when we ended
      chunkStartHighlightId = currentActiveHighlightId;
      currentChunkContent = word;
      currentChunkRawLength = word.length;
      currentScanIndex += word.length; // Now we account for this word being in the NEXT chunk
      
      // Process state for this new word using substring-aware helper
      const newWordState = computeStateAfterText(word, chunkStartHighlightId);
      currentActiveHighlightId = newWordState;
    }
  }

  // Push remaining
  if (currentChunkContent.length > 0) {
    const effectivePrefix = chunks.length === 0 ? "" : partPrefix;
    chunks.push({
      id: `chunk-${chunks.length}-${Date.now()}`,
      content: effectivePrefix + currentChunkContent,
      originalContent: currentChunkContent,
      startIndex: currentChunkStartIndex,
      endIndex: currentChunkStartIndex + currentChunkRawLength,
      index: 0,
      total: 0,
      length: (effectivePrefix + currentChunkContent).length,
      carriedHighlightRuleId: chunkStartHighlightId
    });
  }

  // Fix indices
  return chunks.map((c, idx) => ({
    ...c,
    index: idx + 1,
    total: chunks.length
  }));
};