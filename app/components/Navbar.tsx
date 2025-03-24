import { Link } from "@remix-run/react";

interface NavbarProps {
  showNewSession?: boolean;
  showHistory?: boolean;
  onNewSession?: () => void;
}

export default function Navbar({
  showNewSession = true,
  showHistory = true,
  onNewSession
}: NavbarProps) {
  return (
    <div className="glass-nav w-full h-16 px-6 flex items-center justify-between">
      <div className="flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
        <Link to="/" className="text-xl gradient-text ml-3">
          MindSweep.AI
        </Link>
      </div>
      
      <div className="flex items-center space-x-4">
        {showNewSession && (
          <button 
            onClick={onNewSession}
            className="glass px-4 py-2 rounded-lg flex items-center text-sm hover:bg-opacity-80 transition-all duration-300"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            New Session
          </button>
        )}
        
        {showHistory && (
          <Link to="/history" className="glass px-4 py-2 rounded-lg flex items-center text-sm hover:bg-opacity-80 transition-all duration-300">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
            History
          </Link>
        )}
      </div>
    </div>
  );
} 