import { useState } from "react";

export interface ClarifiedResult {
  next_actions: string[];
  projects: string[];
  someday_maybe: string[];
  reflections: string[];
  questions: string[];
  references: string[];
}

interface ResultsScreenProps {
  results: ClarifiedResult;
}

export default function ResultsScreen({ results }: ResultsScreenProps) {
  const [activeTab, setActiveTab] = useState<'reflections' | 'questions' | 'references'>('reflections');
  const [showExportDropdown, setShowExportDropdown] = useState(false);

  const renderItem = (item: string, index: number, type: 'action' | 'other') => {
    return (
      <li key={index} className="flex items-start group mb-3 transition-all duration-300">
        {type === 'action' ? (
          <span className="inline-block w-5 h-5 mt-0.5 mr-3 rounded border border-gray-500 flex-shrink-0 group-hover:border-indigo-400 transition-colors duration-300"></span>
        ) : (
          <span className="inline-block w-2 h-2 mt-2 mr-3 rounded-full bg-amber-400 flex-shrink-0"></span>
        )}
        <span className="text-gray-200">{item}</span>
      </li>
    );
  };

  const copyToClipboard = () => {
    let textToCopy = "";
    
    if (results.next_actions.length > 0) {
      textToCopy += "# Next Actions\n";
      results.next_actions.forEach(item => {
        textToCopy += `- [ ] ${item}\n`;
      });
      textToCopy += "\n";
    }
    
    if (results.projects.length > 0) {
      textToCopy += "# Projects\n";
      results.projects.forEach(item => {
        textToCopy += `- [ ] ${item}\n`;
      });
      textToCopy += "\n";
    }
    
    if (results.someday_maybe.length > 0) {
      textToCopy += "# Someday/Maybe\n";
      results.someday_maybe.forEach(item => {
        textToCopy += `- [ ] ${item}\n`;
      });
      textToCopy += "\n";
    }
    
    if (results.reflections.length > 0) {
      textToCopy += "# Reflections\n";
      results.reflections.forEach(item => {
        textToCopy += `- ${item}\n`;
      });
      textToCopy += "\n";
    }
    
    if (results.questions.length > 0) {
      textToCopy += "# Questions\n";
      results.questions.forEach(item => {
        textToCopy += `- ${item}\n`;
      });
      textToCopy += "\n";
    }
    
    if (results.references.length > 0) {
      textToCopy += "# References\n";
      results.references.forEach(item => {
        textToCopy += `- ${item}\n`;
      });
    }
    
    navigator.clipboard.writeText(textToCopy);
    setShowExportDropdown(false);
    alert("Copied to clipboard!");
  };

  const downloadMarkdown = () => {
    let markdown = "";
    
    if (results.next_actions.length > 0) {
      markdown += "# Next Actions\n";
      results.next_actions.forEach(item => {
        markdown += `- [ ] ${item}\n`;
      });
      markdown += "\n";
    }
    
    if (results.projects.length > 0) {
      markdown += "# Projects\n";
      results.projects.forEach(item => {
        markdown += `- [ ] ${item}\n`;
      });
      markdown += "\n";
    }
    
    if (results.someday_maybe.length > 0) {
      markdown += "# Someday/Maybe\n";
      results.someday_maybe.forEach(item => {
        markdown += `- [ ] ${item}\n`;
      });
      markdown += "\n";
    }
    
    if (results.reflections.length > 0) {
      markdown += "# Reflections\n";
      results.reflections.forEach(item => {
        markdown += `- ${item}\n`;
      });
      markdown += "\n";
    }
    
    if (results.questions.length > 0) {
      markdown += "# Questions\n";
      results.questions.forEach(item => {
        markdown += `- ${item}\n`;
      });
      markdown += "\n";
    }
    
    if (results.references.length > 0) {
      markdown += "# References\n";
      results.references.forEach(item => {
        markdown += `- ${item}\n`;
      });
    }
    
    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'mindsweep-results.md';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setShowExportDropdown(false);
  };

  return (
    <div className="w-full h-[calc(100%-64px)] p-6 flex flex-col">
      <div className="text-center mb-8 relative">
        <h2 className="text-4xl gradient-text mb-3">Clarified Results</h2>
        <p className="text-gray-300 mb-2 text-lg">Your thoughts have been organized into GTD categories.</p>
        
        {/* Export button */}
        <div className="absolute right-0 top-0 z-10">
          <button 
            onClick={() => setShowExportDropdown(!showExportDropdown)} 
            className="glass px-4 py-2 rounded-lg flex items-center text-sm hover:bg-opacity-80 transition-all duration-300"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-indigo-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
            </svg>
            Export
          </button>
          
          {/* Export dropdown */}
          {showExportDropdown && (
            <div className="absolute right-0 mt-2 w-56 glass shadow-xl rounded-lg z-20 border border-indigo-900/20 overflow-hidden">
              <button 
                onClick={downloadMarkdown}
                className="w-full flex items-center px-4 py-3 text-left hover:bg-indigo-800/20 transition-colors duration-300"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-indigo-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                <span>Download as Markdown</span>
              </button>
              <button 
                onClick={copyToClipboard}
                className="w-full flex items-center px-4 py-3 text-left hover:bg-indigo-800/20 transition-colors duration-300"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-green-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                </svg>
                <span>Copy to Clipboard</span>
              </button>
            </div>
          )}
        </div>
      </div>
      
      {/* Results Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-[calc(100%-70px)] overflow-hidden">
        {/* Next Actions */}
        <div className="glass p-5 flex flex-col shadow-lg border border-green-900/10 hover:shadow-green-900/5 transition-all duration-300">
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 rounded-full bg-green-500/90 flex items-center justify-center mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-green-400">Next Actions</h3>
          </div>
          <div className="flex-grow overflow-auto no-scrollbar pr-2">
            <ul className="space-y-1">
              {results.next_actions.length > 0 ? (
                results.next_actions.map((action, index) => renderItem(action, index, 'action'))
              ) : (
                <li className="text-gray-500 italic">No next actions found</li>
              )}
            </ul>
          </div>
        </div>
        
        {/* Projects */}
        <div className="glass p-5 flex flex-col shadow-lg border border-blue-900/10 hover:shadow-blue-900/5 transition-all duration-300">
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 rounded-full bg-blue-500/90 flex items-center justify-center mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-blue-400">Projects</h3>
          </div>
          <div className="flex-grow overflow-auto no-scrollbar pr-2">
            <ul className="space-y-1">
              {results.projects.length > 0 ? (
                results.projects.map((project, index) => renderItem(project, index, 'action'))
              ) : (
                <li className="text-gray-500 italic">No projects found</li>
              )}
            </ul>
          </div>
        </div>
        
        {/* Someday/Maybe */}
        <div className="glass p-5 flex flex-col shadow-lg border border-purple-900/10 hover:shadow-purple-900/5 transition-all duration-300">
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 rounded-full bg-purple-500/90 flex items-center justify-center mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-purple-400">Someday/Maybe</h3>
          </div>
          <div className="flex-grow overflow-auto no-scrollbar pr-2">
            <ul className="space-y-1">
              {results.someday_maybe.length > 0 ? (
                results.someday_maybe.map((item, index) => renderItem(item, index, 'action'))
              ) : (
                <li className="text-gray-500 italic">No someday/maybe items found</li>
              )}
            </ul>
          </div>
        </div>
        
        {/* Reflections/Open Questions/Reference */}
        <div className="glass p-5 flex flex-col shadow-lg border border-amber-900/10 hover:shadow-amber-900/5 transition-all duration-300">
          <div className="flex items-center justify-between">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 rounded-full bg-amber-500/90 flex items-center justify-center mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-amber-400">Other Items</h3>
            </div>
            
            <div className="flex mb-4">
              <button
                onClick={() => setActiveTab('reflections')}
                className={`px-3 py-1 text-sm rounded-l-lg transition-all ${activeTab === 'reflections' ? 'bg-amber-900/40 text-amber-300' : 'bg-transparent text-gray-400 hover:text-gray-300'}`}
              >
                Reflections
              </button>
              <button
                onClick={() => setActiveTab('questions')}
                className={`px-3 py-1 text-sm transition-all ${activeTab === 'questions' ? 'bg-amber-900/40 text-amber-300' : 'bg-transparent text-gray-400 hover:text-gray-300'}`}
              >
                Questions
              </button>
              <button
                onClick={() => setActiveTab('references')}
                className={`px-3 py-1 text-sm rounded-r-lg transition-all ${activeTab === 'references' ? 'bg-amber-900/40 text-amber-300' : 'bg-transparent text-gray-400 hover:text-gray-300'}`}
              >
                References
              </button>
            </div>
          </div>
          
          <div className="flex-grow overflow-auto no-scrollbar pr-2">
            {activeTab === 'reflections' && (
              <ul className="space-y-1">
                {results.reflections.length > 0 ? (
                  results.reflections.map((item, index) => renderItem(item, index, 'other'))
                ) : (
                  <li className="text-gray-500 italic">No reflections found</li>
                )}
              </ul>
            )}
            
            {activeTab === 'questions' && (
              <ul className="space-y-1">
                {results.questions.length > 0 ? (
                  results.questions.map((item, index) => renderItem(item, index, 'other'))
                ) : (
                  <li className="text-gray-500 italic">No questions found</li>
                )}
              </ul>
            )}
            
            {activeTab === 'references' && (
              <ul className="space-y-1">
                {results.references.length > 0 ? (
                  results.references.map((item, index) => renderItem(item, index, 'other'))
                ) : (
                  <li className="text-gray-500 italic">No references found</li>
                )}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 