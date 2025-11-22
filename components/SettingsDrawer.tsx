import React from 'react';
import { X, Plus, Trash2, Type, Settings } from 'lucide-react';
import { AppSettings, HighlightRule, FontSize } from '../types';

interface SettingsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AppSettings;
  onUpdateSettings: (newSettings: AppSettings) => void;
}

const COLORS = [
  { name: 'Amber', value: '#d97706', class: 'bg-amber-600' },
  { name: 'Rose', value: '#e11d48', class: 'bg-rose-500' },
  { name: 'Purple', value: '#9333ea', class: 'bg-purple-600' },
  { name: 'Blue', value: '#2563eb', class: 'bg-blue-600' },
  { name: 'Moonstone', value: '#60a5fa', class: 'bg-sky-400' },
  { name: 'Warm Slate', value: '#94a3b8', class: 'bg-slate-400' },
  { name: 'Gray', value: '#4b5563', class: 'bg-gray-600' },
  { name: 'Green', value: '#16a34a', class: 'bg-green-600' },
];

const FONT_SIZES: { label: string; value: FontSize }[] = [
  { label: 'Small', value: 'text-sm' },
  { label: 'Medium', value: 'text-base' },
  { label: 'Large', value: 'text-lg' },
  { label: 'XL', value: 'text-xl' },
];

export const SettingsDrawer: React.FC<SettingsDrawerProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
}) => {
  if (!isOpen) return null;

  const handleAddRule = () => {
    const newRule: HighlightRule = {
      id: Date.now().toString(),
      name: 'New Rule',
      startChar: '"',
      endChar: '"',
      color: '#2563eb'
    };
    onUpdateSettings({
      ...settings,
      highlightRules: [...settings.highlightRules, newRule]
    });
  };

  const handleRemoveRule = (id: string) => {
    onUpdateSettings({
      ...settings,
      highlightRules: settings.highlightRules.filter(r => r.id !== id)
    });
  };

  const handleRuleChange = (id: string, field: keyof HighlightRule, value: string) => {
    onUpdateSettings({
      ...settings,
      highlightRules: settings.highlightRules.map(r => 
        r.id === id ? { ...r, [field]: value } : r
      )
    });
  };

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
            <Settings className="text-indigo-500" size={24} />
            Quill Settings
          </h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-indigo-100 dark:hover:bg-slate-800 rounded-full transition-colors text-slate-500 dark:text-slate-400"
          >
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          
          {/* Appearance Settings */}
          <section className="space-y-4">
             <h3 className="text-sm font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-2">
               <Type size={14} /> Appearance
             </h3>
             
             <div>
               <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Font Size</label>
               <div className="grid grid-cols-4 gap-2">
                 {FONT_SIZES.map((size) => (
                   <button
                     key={size.value}
                     onClick={() => onUpdateSettings({ ...settings, fontSize: size.value })}
                     className={`
                       px-2 py-2 rounded-md text-xs font-bold transition-all border
                       ${settings.fontSize === size.value
                         ? 'bg-indigo-100 border-indigo-300 text-indigo-700 dark:bg-indigo-900 dark:border-indigo-700 dark:text-indigo-200'
                         : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-indigo-200'
                       }
                     `}
                   >
                     {size.label}
                   </button>
                 ))}
               </div>
             </div>
          </section>

          <hr className="border-indigo-50 dark:border-slate-800" />

          {/* General Settings */}
          <section className="space-y-4">
            <h3 className="text-sm font-bold text-indigo-400 uppercase tracking-wider">Splitting</h3>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Chunk Limit (Characters)</label>
              <input 
                type="number" 
                value={settings.chunkSize}
                onChange={(e) => onUpdateSettings({...settings, chunkSize: parseInt(e.target.value) || 256 })}
                className="w-full p-2 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-300 focus:border-indigo-300 outline-none transition-all bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Split Suffix</label>
                <input 
                  type="text" 
                  value={settings.partSuffix}
                  placeholder="..."
                  onChange={(e) => onUpdateSettings({...settings, partSuffix: e.target.value })}
                  className="w-full p-2 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-300 outline-none bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                />
                <p className="text-xs text-slate-400 mt-1">Added to end of split parts</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Split Prefix</label>
                <input 
                  type="text" 
                  value={settings.partPrefix}
                  placeholder="..."
                  onChange={(e) => onUpdateSettings({...settings, partPrefix: e.target.value })}
                  className="w-full p-2 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-300 outline-none bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                />
                <p className="text-xs text-slate-400 mt-1">Added to start of continued parts</p>
              </div>
            </div>
          </section>

          <hr className="border-indigo-50 dark:border-slate-800" />

          {/* Highlight Rules */}
          <section className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-bold text-indigo-400 uppercase tracking-wider">Highlighters</h3>
              <button 
                onClick={handleAddRule}
                className="flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 bg-indigo-50 dark:bg-indigo-900/30 px-3 py-1 rounded-full transition-colors"
              >
                <Plus size={14} /> Add Rule
              </button>
            </div>
            
            <div className="space-y-4">
              {settings.highlightRules.map((rule) => (
                <div key={rule.id} className="p-4 bg-white/50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-700 space-y-3 group">
                  <div className="flex justify-between items-center">
                    <input 
                      value={rule.name}
                      onChange={(e) => handleRuleChange(rule.id, 'name', e.target.value)}
                      className="bg-transparent text-sm font-bold text-slate-700 dark:text-slate-200 focus:bg-white dark:focus:bg-slate-700 focus:ring-1 focus:ring-indigo-200 rounded px-1 -ml-1 w-32"
                    />
                    <button 
                      onClick={() => handleRemoveRule(rule.id)}
                      className="text-slate-300 hover:text-red-400 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex-1 grid grid-cols-2 gap-2">
                      <div>
                         <label className="text-[10px] text-slate-400 uppercase font-bold">Start</label>
                         <input 
                          value={rule.startChar}
                          onChange={(e) => handleRuleChange(rule.id, 'startChar', e.target.value)}
                          className="w-full p-1.5 text-sm border border-slate-200 dark:border-slate-600 rounded bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 text-center font-mono"
                        />
                      </div>
                      <div>
                         <label className="text-[10px] text-slate-400 uppercase font-bold">End</label>
                         <input 
                          value={rule.endChar}
                          onChange={(e) => handleRuleChange(rule.id, 'endChar', e.target.value)}
                          className="w-full p-1.5 text-sm border border-slate-200 dark:border-slate-600 rounded bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 text-center font-mono"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-1">
                      <label className="text-[10px] text-slate-400 uppercase font-bold block">Color</label>
                      <div className="flex gap-1 flex-wrap w-24">
                        {COLORS.map(c => (
                          <button
                            key={c.name}
                            onClick={() => handleRuleChange(rule.id, 'color', c.value)}
                            className={`w-5 h-5 rounded-full ${c.class} ${rule.color === c.value ? 'ring-2 ring-offset-1 ring-slate-400 dark:ring-slate-600' : ''}`}
                            title={c.name}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-xs text-slate-400 italic px-2">
                    Preview: <span style={{color: rule.color}}>{rule.startChar}sample text{rule.endChar}</span>
                  </div>
                </div>
              ))}
              
              {settings.highlightRules.length === 0 && (
                <div className="text-center py-8 text-slate-400 text-sm">
                  No highlight rules active. Add one to colorize specific text parts (e.g. "speech").
                </div>
              )}
            </div>
          </section>

        </div>
      </div>
    </div>
  );
};