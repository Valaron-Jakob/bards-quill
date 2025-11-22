import React, { useState, useEffect, useRef } from 'react';
import { Settings, Feather, Sun, Moon, Info, Code2 } from 'lucide-react';
import { AppSettings, TextChunk } from './types';
import { splitText } from './utils/textUtils';
import { SettingsDrawer } from './components/SettingsDrawer';
import { InfoDrawer } from './components/InfoDrawer';
import { OutputCard } from './components/OutputCard';

const DEFAULT_SETTINGS: AppSettings = {
  chunkSize: 256,
  partPrefix: "",
  partSuffix: "...",
  fontSize: 'text-base',
  darkMode: false,
  highlightRules: [
    { id: '1', name: 'Speech', startChar: '"', endChar: '"', color: '#2563eb' },
    { id: '2', name: 'Action', startChar: '*', endChar: '*', color: '#e11d48' },
  ]
};

const STORAGE_KEY_TEXT = 'bards_quill_text';
const STORAGE_KEY_SETTINGS = 'bards_quill_settings';

// Colors for the markers
const MARKER_COLORS = ['bg-indigo-400', 'bg-rose-400', 'bg-emerald-400', 'bg-amber-400', 'bg-sky-400', 'bg-purple-400'];

const App: React.FC = () => {
  const [inputText, setInputText] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEY_TEXT) || "";
    } catch (error) {
      return "";
    }
  });

  const [settings, setSettings] = useState<AppSettings>(() => {
    try {
      const savedSettings = localStorage.getItem(STORAGE_KEY_SETTINGS);
      return savedSettings ? { ...DEFAULT_SETTINGS, ...JSON.parse(savedSettings) } : DEFAULT_SETTINGS;
    } catch (error) {
      return DEFAULT_SETTINGS;
    }
  });

  const [chunks, setChunks] = useState<TextChunk[]>([]);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isInfoOpen, setIsInfoOpen] = useState(false);

  // Refs for sync scrolling
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_TEXT, inputText);
  }, [inputText]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    const newChunks = splitText(inputText, settings);
    setChunks(newChunks);
  }, [inputText, settings]);

  const handleScroll = () => {
    if (textareaRef.current && backdropRef.current) {
      backdropRef.current.scrollTop = textareaRef.current.scrollTop;
    }
  };

  const toggleDarkMode = () => {
    setSettings(prev => ({ ...prev, darkMode: !prev.darkMode }));
  };

  return (
    <div className={`${settings.darkMode ? 'dark' : ''} h-full`}>
      <div className="h-screen flex flex-col text-slate-900 dark:text-slate-100 font-sans selection:bg-indigo-100 selection:text-indigo-900 dark:selection:bg-indigo-900 dark:selection:text-indigo-100 overflow-hidden bg-fantasy-bg dark:bg-slate-900 transition-colors duration-300">
        
        {/* Compact Header */}
        <header className="flex-none py-4 px-6 border-b border-indigo-100 dark:border-slate-800 bg-fantasy-bg/80 dark:bg-slate-900/80 backdrop-blur-sm z-10 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-100 dark:bg-slate-800 rounded-lg text-indigo-600 dark:text-indigo-400">
              <Feather size={20} />
            </div>
            <h1 className="text-xl font-serif font-bold text-indigo-950 dark:text-slate-200">
              Bard's Quill
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={toggleDarkMode}
              className="p-2 hover:bg-fantasy-paper dark:hover:bg-slate-800 rounded-lg transition-colors text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400"
              aria-label="Toggle Dark Mode"
              title="Theme Toggle"
            >
              {settings.darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button
              onClick={() => setIsInfoOpen(true)}
              className="p-2 hover:bg-fantasy-paper dark:hover:bg-slate-800 rounded-lg transition-colors text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400"
              aria-label="Info"
              title="Info"
            >
              <Info size={20} />
            </button>
            <a
              href="https://github.com/Valaron-Jakob/bards-quill"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 hover:bg-fantasy-paper dark:hover:bg-slate-800 rounded-lg transition-colors text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400"
              aria-label="GitHub"
              title="View on GitHub"
            >
              <Code2 size={20} />
            </a>
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="p-2 hover:bg-fantasy-paper dark:hover:bg-slate-800 rounded-lg transition-colors text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400"
              aria-label="Settings"
              title="Settings"
            >
              <Settings size={20} />
            </button>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col lg:flex-row overflow-hidden">
          
          {/* Left Column: Input Section */}
          <section className="flex-1 flex flex-col p-4 lg:p-6 min-h-0 border-b lg:border-b-0 lg:border-r border-indigo-50 dark:border-slate-800 relative bg-fantasy-paper/50 dark:bg-slate-800/50">
            
            <div className="flex-1 relative flex flex-col rounded-xl border border-fantasy-accent/20 dark:border-slate-700 shadow-inner bg-fantasy-paper dark:bg-slate-900 overflow-hidden group">
               
               {/* 
                   LAYERED INPUT SYSTEM 
                   1. Textarea (z-0): Handles user input and scrolling. 
                   2. Backdrop (z-10): Sits ON TOP, pointer-events-none. Shows visual markers.
               */}
               <div className="relative flex-1 w-full h-full overflow-hidden">
                  
                  {/* TEXTAREA: User Input (Bottom Layer) */}
                  <textarea
                    ref={textareaRef}
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onScroll={handleScroll}
                    placeholder="Paste your long roleplay text here..."
                    spellCheck={true}
                    className={`absolute inset-0 w-full h-full pl-12 p-6 resize-none outline-none leading-loose text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-600 bg-transparent scrollbar-thin scrollbar-thumb-indigo-200 dark:scrollbar-thumb-slate-700 scrollbar-track-transparent z-0 font-sans ${settings.fontSize}`}
                  />

                  {/* BACKDROP: Visual Indicators (Top Layer) */}
                  <div 
                    ref={backdropRef}
                    className={`absolute inset-0 pl-12 p-6 leading-loose font-sans whitespace-pre-wrap break-words select-none pointer-events-none z-10 scrollbar-none overflow-hidden ${settings.fontSize}`}
                    aria-hidden="true"
                    style={{ 
                      color: 'transparent', // Text is invisible, but takes up space
                    }}
                  >
                    {chunks.map((chunk, i) => (
                      <span key={chunk.id}>
                        {/* 
                            MARKER TRICK: 
                            Position absolute with left:0 inside an inline element snaps to the 
                            left edge of the closest positioned ancestor (the container), 
                            but stays at the vertical top of the text line.
                        */}
                        <span 
                          className={`absolute left-3 w-1.5 h-4 rounded-full opacity-90 shadow-sm mt-2 transition-colors duration-300 ${MARKER_COLORS[i % MARKER_COLORS.length]}`} 
                        />
                        {/* The Text Content (Invisible layout guide) */}
                        {chunk.originalContent}
                      </span>
                    ))}
                    {chunks.length === 0 && inputText.length === 0 && (
                       <span></span>
                    )}
                  </div>

               </div>

               {/* Footer Stats */}
               <div className="flex-none px-4 py-2 bg-fantasy-bg/50 dark:bg-slate-800/50 text-[10px] uppercase tracking-wider text-slate-400 dark:text-slate-500 border-t border-fantasy-accent/10 dark:border-slate-700 flex justify-between items-center z-20">
                 <span>{inputText.length} Characters</span>
                 <span>{chunks.length} Parts</span>
               </div>
            </div>
          </section>

          {/* Right Column: Output Section */}
          <section className="flex-1 flex flex-col bg-fantasy-bg/50 dark:bg-slate-900/50 lg:bg-transparent min-h-0 transition-colors">
             <div className="flex-1 overflow-y-auto p-4 lg:p-6 scrollbar-thin scrollbar-thumb-indigo-200 dark:scrollbar-thumb-slate-700 scrollbar-track-transparent">
               <div className="max-w-2xl mx-auto space-y-4">
                  {chunks.length > 0 ? (
                    chunks.map((chunk, i) => (
                      <div key={chunk.id} className="flex gap-3">
                        {/* Matching visual indicator in output list */}
                        <div className={`w-1 self-stretch rounded-full flex-none mt-4 mb-4 opacity-50 ${MARKER_COLORS[i % MARKER_COLORS.length]}`} />
                        <div className="flex-1 min-w-0">
                          <OutputCard 
                            chunk={chunk} 
                            highlightRules={settings.highlightRules}
                            fontSize={settings.fontSize}
                          />
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="h-64 flex flex-col items-center justify-center text-center opacity-40">
                      <p className="font-serif text-indigo-900 dark:text-slate-400 italic">The pages are empty...</p>
                    </div>
                  )}
                  
                  {chunks.length > 0 && (
                     <div className="h-12" /> /* Spacer */
                  )}
               </div>
             </div>
          </section>

        </main>

        <SettingsDrawer 
          isOpen={isSettingsOpen} 
          onClose={() => setIsSettingsOpen(false)}
          settings={settings}
          onUpdateSettings={setSettings}
        />
        
        <InfoDrawer 
          isOpen={isInfoOpen}
          onClose={() => setIsInfoOpen(false)}
        />

      </div>
    </div>
  );
};

export default App;