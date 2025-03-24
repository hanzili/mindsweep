import { Link, useNavigate } from "@remix-run/react";
import type { MetaFunction } from "@remix-run/node";
import Navbar from "~/components/Navbar";

export const meta: MetaFunction = () => {
  return [
    { title: "History - MindSweep.AI" },
    { name: "description", content: "Your MindSweep.AI session history" },
  ];
};

export default function History() {
  const navigate = useNavigate();
  
  const handleNewSession = () => {
    navigate('/');
  };

  // Mock data for session history
  const sessions = [
    {
      id: "1",
      title: "Today's Priorities",
      timestamp: "Today, 2:45 PM",
      snippet: "I need to schedule a time to meet Sean in person and prepare discussion topics. Also need to check my vaccine record and book an appointment...",
      stats: {
        actions: 5,
        projects: 3,
        someday: 2
      }
    },
    {
      id: "2",
      title: "Academic Planning",
      timestamp: "Yesterday, 10:12 AM",
      snippet: "Need to explore having a fixed schedule for school. Try to make progress on COMP461 myself. Need to plan out the work and send a message...",
      stats: {
        actions: 8,
        projects: 2,
        reflections: 4
      }
    },
    {
      id: "3",
      title: "Business Ideas",
      timestamp: "Apr 28, 2023",
      snippet: "I want to start a business that makes progress. Through research I find it hard to make an all-in-one GTD tool. Some niche tool that follows GTD practice...",
      stats: {
        actions: 4,
        projects: 5,
        questions: 3
      }
    }
  ];
  
  return (
    <div className="min-h-screen">
      <div className="bg-texture"></div>
      <Navbar 
        showNewSession={true}
        showHistory={false}
        onNewSession={handleNewSession}
      />
      
      <div className="w-full h-[calc(100%-64px)] p-6 flex flex-col">
        
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-indigo-300">Session History</h2>
          <p className="text-gray-400">Review and revisit your previous clarification sessions.</p>
          <p className="text-amber-400 mt-2">Note: This is a mock UI to demonstrate future functionality. Session data is not being saved yet.</p>
        </div>
        
        {/* Search & Filter */}
        <div className="flex items-center justify-between mb-6">
          <div className="glass flex items-center px-4 py-2 rounded-lg w-full sm:w-1/3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input type="text" placeholder="Search sessions... (mock)" className="bg-transparent focus:outline-none text-white w-full" />
          </div>
          
          <div className="hidden sm:flex space-x-2">
            <button className="glass px-3 py-2 rounded-lg text-sm hover:bg-opacity-80">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              Filter
            </button>
            <button className="glass px-3 py-2 rounded-lg text-sm hover:bg-opacity-80">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4h13M3 8h9m-9 4h9m5-4v12m0 0l-4-4m4 4l4-4" />
              </svg>
              Sort
            </button>
          </div>
        </div>
        
        {/* Sessions List */}
        {sessions.length > 0 ? (
          <div className="flex-grow glass rounded-lg overflow-hidden">
            <div className="p-4 h-full overflow-auto no-scrollbar">
              {sessions.map((session, index) => (
                <div 
                  key={session.id}
                  className={`glass mb-4 p-4 rounded-lg hover:bg-opacity-80 cursor-pointer transition-all ${index === 0 ? 'border border-indigo-500 border-opacity-30' : ''}`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold text-white">{session.title}</h3>
                    <span className="text-xs text-gray-400">{session.timestamp}</span>
                  </div>
                  <div className="text-gray-400 text-sm mb-2 line-clamp-2">
                    {session.snippet}
                  </div>
                  <div className="flex items-center space-x-2">
                    {session.stats.actions && (
                      <span className="text-xs bg-green-900 bg-opacity-30 text-green-400 px-2 py-1 rounded">
                        {session.stats.actions} Actions
                      </span>
                    )}
                    {session.stats.projects && (
                      <span className="text-xs bg-blue-900 bg-opacity-30 text-blue-400 px-2 py-1 rounded">
                        {session.stats.projects} Projects
                      </span>
                    )}
                    {session.stats.someday && (
                      <span className="text-xs bg-purple-900 bg-opacity-30 text-purple-400 px-2 py-1 rounded">
                        {session.stats.someday} Someday
                      </span>
                    )}
                    {session.stats.reflections && (
                      <span className="text-xs bg-amber-900 bg-opacity-30 text-amber-400 px-2 py-1 rounded">
                        {session.stats.reflections} Reflections
                      </span>
                    )}
                    {session.stats.questions && (
                      <span className="text-xs bg-gray-700 bg-opacity-30 text-gray-400 px-2 py-1 rounded">
                        {session.stats.questions} Questions
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex-grow glass rounded-lg overflow-hidden flex items-center justify-center">
            <div className="text-center p-8">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-600 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              <h3 className="text-xl font-semibold text-gray-400 mb-2">No History Yet</h3>
              <p className="text-gray-500 mb-4">You haven't created any sessions yet.</p>
              <button 
                onClick={handleNewSession} 
                className="btn-primary px-4 py-2 rounded-lg text-white inline-block"
              >
                Create Your First Session
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 