
import { useState, useEffect } from 'react';

export default function CandidateSearchApp() {
  const [view, setView] = useState('search'); // 'search' or 'potential'
  const [currentCandidate, setCurrentCandidate] = useState(null);
  const [potentialCandidates, setPotentialCandidates] = useState([]);
  const [noMoreCandidates, setNoMoreCandidates] = useState(false);
  
  // Mock API for candidates
  const mockCandidates = [
    {
      id: 1,
      name: 'Jane Smith',
      username: 'janesmith',
      location: 'San Francisco, CA',
      avatar: '/api/placeholder/100/100',
      email: 'jane.smith@example.com',
      html_url: 'https://github.com/janesmith',
      company: 'TechCorp'
    },
    {
      id: 2,
      name: 'John Doe',
      username: 'johndoe',
      location: 'New York, NY',
      avatar: '/api/placeholder/100/100',
      email: 'john.doe@example.com',
      html_url: 'https://github.com/johndoe',
      company: 'DevInc'
    },
    {
      id: 3,
      name: 'Emma Wilson',
      username: 'emmawilson',
      location: 'London, UK',
      avatar: '/api/placeholder/100/100',
      email: 'emma.wilson@example.com',
      html_url: 'https://github.com/emmawilson',
      company: 'CodeFactory'
    }
  ];
  
  const [candidates, setCandidates] = useState([...mockCandidates]);
  
  // Load saved candidates from localStorage on initial render
  useEffect(() => {
    const savedCandidates = localStorage.getItem('potentialCandidates');
    if (savedCandidates) {
      setPotentialCandidates(JSON.parse(savedCandidates));
    }
    
    // Load first candidate
    loadNextCandidate();
  }, []);
  
  // Save potential candidates to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('potentialCandidates', JSON.stringify(potentialCandidates));
  }, [potentialCandidates]);
  
  const loadNextCandidate = () => {
    if (candidates.length > 0) {
      setCurrentCandidate(candidates[0]);
      setCandidates(candidates.slice(1));
    } else {
      setCurrentCandidate(null);
      setNoMoreCandidates(true);
    }
  };
  
  const acceptCandidate = () => {
    if (currentCandidate) {
      setPotentialCandidates([...potentialCandidates, currentCandidate]);
      loadNextCandidate();
    }
  };
  
  const rejectCandidate = () => {
    loadNextCandidate();
  };
  
  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="mb-6">
        <div className="flex space-x-4">
          <button 
            className={`py-2 px-4 rounded ${view === 'search' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
            onClick={() => setView('search')}
          >
            Candidate Search
          </button>
          <button 
            className={`py-2 px-4 rounded ${view === 'potential' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
            onClick={() => setView('potential')}
          >
            Potential Candidates ({potentialCandidates.length})
          </button>
        </div>
      </div>
      
      {view === 'search' ? (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">Candidate Search</h2>
          
          {currentCandidate && !noMoreCandidates ? (
            <div>
              <div className="flex items-start mb-4">
                <img 
                  src={currentCandidate.avatar} 
                  alt={currentCandidate.name} 
                  className="w-16 h-16 rounded-full mr-4"
                />
                <div>
                  <h3 className="text-lg font-semibold">{currentCandidate.name}</h3>
                  <p className="text-gray-600">@{currentCandidate.username}</p>
                  <p className="text-gray-600">{currentCandidate.location}</p>
                </div>
              </div>
              
              <div className="mb-4">
                <p><strong>Email:</strong> {currentCandidate.email}</p>
                <p><strong>GitHub:</strong> <a href={currentCandidate.html_url} className="text-blue-600 hover:underline">{currentCandidate.html_url}</a></p>
                <p><strong>Company:</strong> {currentCandidate.company}</p>
              </div>
              
              <div className="flex space-x-4">
                <button 
                  onClick={acceptCandidate}
                  className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
                >
                  + Add to Potential
                </button>
                <button 
                  onClick={rejectCandidate}
                  className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
                >
                  - Reject
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-lg text-gray-600">No more candidates available for review.</p>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">Potential Candidates</h2>
          
          {potentialCandidates.length > 0 ? (
            <div className="space-y-4">
              {potentialCandidates.map(candidate => (
                <div key={candidate.id} className="border rounded-lg p-4">
                  <div className="flex items-start mb-2">
                    <img 
                      src={candidate.avatar} 
                      alt={candidate.name} 
                      className="w-12 h-12 rounded-full mr-4" 
                    />
                    <div>
                      <h3 className="text-lg font-semibold">{candidate.name}</h3>
                      <p className="text-gray-600">@{candidate.username}</p>
                      <p className="text-gray-600">{candidate.location}</p>
                    </div>
                  </div>
                  
                  <div>
                    <p><strong>Email:</strong> {candidate.email}</p>
                    <p><strong>GitHub:</strong> <a href={candidate.html_url} className="text-blue-600 hover:underline">{candidate.html_url}</a></p>
                    <p><strong>Company:</strong> {candidate.company}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-lg text-gray-600">No candidates have been accepted yet.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );