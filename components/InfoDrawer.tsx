import React from 'react';
import { X, BookOpen, Edit3, Scissors, Highlighter, Copy, Layers } from 'lucide-react';

interface InfoDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InfoDrawer: React.FC<InfoDrawerProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/20 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      {/* Drawer */}
      <div className="relative w-full max-w-md h-full bg-fantasy-paper dark:bg-slate-900 shadow-2xl flex flex-col border-l border-indigo-100 dark:border-slate-800 animate-in slide-in-from-right duration-300">
        <div className="p-6 border-b border-indigo-50 dark:border-slate-800 flex justify-between items-center bg-gradient-to-r from-fantasy-bg to-fantasy-paper dark:from-slate-900 dark:to-slate-800">
          <h2 className="text-2xl font-serif text-slate-800 dark:text-slate-100 font-bold flex items-center gap-2">
            <BookOpen className="text-indigo-500" size={24} />
            Bard's Guide
          </h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-indigo-100 dark:hover:bg-slate-800 rounded-full transition-colors text-slate-500 dark:text-slate-400"
          >
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-8 text-slate-700 dark:text-slate-300">
          
          <section className="space-y-3">
            <p className="leading-relaxed">
              Welcome to <strong>Bard's Quill</strong>, a tool designed to make writing long roleplay posts for Minecraft easier and more immersive.
            </p>
          </section>

          <div className="space-y-6">
            
            {/* Step 1 */}
            <div className="flex gap-4">
              <div className="flex-none p-2 bg-indigo-100 dark:bg-slate-800 rounded-lg h-fit text-indigo-600 dark:text-indigo-400">
                <Edit3 size={20} />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 dark:text-slate-100 mb-1">1. Write or Paste</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  Type your story in the large text area on the left. Your text is automatically saved to your browser, so you won't lose progress if you close the tab.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex gap-4">
              <div className="flex-none p-2 bg-rose-100 dark:bg-slate-800 rounded-lg h-fit text-rose-600 dark:text-rose-400">
                <Scissors size={20} />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 dark:text-slate-100 mb-1">2. Automatic Splitting</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  The text is automatically split into chunks (default 256 characters) that fit into the Minecraft chat box. Respecting word boundaries so words aren't cut in half.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex gap-4">
              <div className="flex-none p-2 bg-amber-100 dark:bg-slate-800 rounded-lg h-fit text-amber-600 dark:text-amber-400">
                <Layers size={20} />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 dark:text-slate-100 mb-1">3. Visual Markers</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  Look for the small colored bars <span className="inline-block w-2 h-2 rounded-full bg-indigo-400 mx-1"></span> on the left side of your text input. These indicate exactly where a new chat message begins.
                </p>
              </div>
            </div>

            {/* Step 4 */}
            <div className="flex gap-4">
              <div className="flex-none p-2 bg-emerald-100 dark:bg-slate-800 rounded-lg h-fit text-emerald-600 dark:text-emerald-400">
                <Highlighter size={20} />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 dark:text-slate-100 mb-1">4. Highlighting</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  Use the <strong>Settings</strong> (cogwheel icon) to define custom highlighting rules. For example, you can make all text between quotes <code>"like this"</code> appear blue to distinguish speech from actions.
                </p>
              </div>
            </div>

             {/* Step 5 */}
             <div className="flex gap-4">
              <div className="flex-none p-2 bg-sky-100 dark:bg-slate-800 rounded-lg h-fit text-sky-600 dark:text-sky-400">
                <Copy size={20} />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 dark:text-slate-100 mb-1">5. Copy & Paste</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  On the right side, you'll see the split cards. Click the copy icon on any card to copy that specific part to your clipboard, ready to paste into the game.
                </p>
              </div>
            </div>

          </div>
          
          <div className="pt-6 border-t border-indigo-50 dark:border-slate-800 text-center">
             <p className="text-xs text-slate-400 italic">
               "May your tales be long and your chat disconnects few."
             </p>
          </div>

        </div>
      </div>
    </div>
  );
};