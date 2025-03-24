import { useState } from "react";

interface BrainDumpInputProps {
  onClarify: (input: string) => void;
}

export default function BrainDumpInput({ onClarify }: BrainDumpInputProps) {
  const [inputText, setInputText] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const handleClarify = () => {
    if (!inputText.trim()) return;
    
    setIsProcessing(true);
    onClarify(inputText);
  };

  const handleClear = () => {
    setInputText("");
  };

  return (
    <div className="flex flex-col h-[calc(100vh-64px)]">
      {/* Header Section with enhanced styling */}
      <div className="text-center py-8">
        <h2 className="text-4xl gradient-text mb-3">Brain Dump</h2>
        <p className="text-gray-300 max-w-2xl mx-auto text-lg">Type or paste your thoughts below. Don't worry about structure—just let it flow.</p>
      </div>
      
      {/* Input Area with completely improved styling */}
      <div className="flex-grow mx-auto w-full max-w-4xl px-4 md:px-0 mb-8">
        <div className="relative h-full rounded-xl border-2 border-indigo-600/30 shadow-lg shadow-indigo-500/10 overflow-hidden bg-[#1e1f2d] hover:border-indigo-500/40 transition-all duration-300">
          {/* Enhanced visibility background */}
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/10 to-purple-900/5 pointer-events-none"></div>
          
          <textarea 
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="• Tasks I need to do...
• Projects I'm thinking about...
• Feelings I'm having...
• Ideas to explore...
• Things to remember..." 
            className="w-full h-full p-8 bg-transparent focus:outline-none text-white resize-none no-scrollbar text-lg placeholder:text-gray-400/90"
            spellCheck="false"
            autoFocus
          />
        </div>
      </div>
      
      {/* Actions with improved styling */}
      <div className="flex justify-center space-x-8 pb-10">
        <button 
          onClick={handleClear}
          className="px-6 py-3 rounded-lg text-gray-300 hover:bg-opacity-80 transition-all duration-300 
                     shadow-md hover:shadow-lg flex items-center bg-[#2a2b3d] hover:bg-[#30324a] border border-gray-700"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
          Clear
        </button>
        <button 
          onClick={handleClarify}
          disabled={isProcessing || !inputText.trim()}
          className={`btn-primary px-10 py-3 rounded-lg text-white font-bold shadow-lg hover:shadow-xl transition-all duration-300
            ${(isProcessing || !inputText.trim()) ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {isProcessing ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Clarify Now
            </>
          )}
        </button>
      </div>
    </div>
  );
} 