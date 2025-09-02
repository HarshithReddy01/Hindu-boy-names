import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';
import './App.css';

interface NameData {
  name: string;
  length: string;
  syllables_est: string;
  vowel_ratio: string;
  starts_with: string;
  ending: string;
  endswith_a: string;
  endswith_i: string;
  endswith_y: string;
}

const App: React.FC = () => {
  const [allNames, setAllNames] = useState<NameData[]>([]);
  const [filteredNames, setFilteredNames] = useState<NameData[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadCSV();
  }, []);

  useEffect(() => {
    filterNames();
  }, [searchTerm, allNames]);

  const loadCSV = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const csvPath = '/Hindu-boy-names/names.csv';
      
      console.log('Attempting to load CSV from:', csvPath);
      
      const response = await fetch(csvPath);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const csvText = await response.text();
      
      const results = Papa.parse(csvText, {
        header: true,
        skipEmptyLines: true
      });
      
      if (results.data && results.data.length > 0) {
        const validNames = results.data.filter((row: any) => 
          row.name && row.name.trim() !== ''
        ) as NameData[];
        setAllNames(validNames);
        setFilteredNames(validNames);
        console.log(`Successfully loaded ${validNames.length} names`);
      } else {
        setError('No data found in the CSV file');
      }
      setLoading(false);
    } catch (error) {
      console.error('CSV loading error:', error);
      setError(`Error loading CSV file: ${error instanceof Error ? error.message : 'Unknown error'}`);
      setLoading(false);
    }
  };

  const filterNames = () => {
    if (searchTerm === '') {
      setFilteredNames([...allNames]);
    } else {
      const filtered = allNames.filter(name => 
        name.name.toLowerCase().startsWith(searchTerm.toLowerCase().trim())
      );
      // Sorting macha
      const sorted = filtered.sort((a, b) => a.name.localeCompare(b.name));
      setFilteredNames(sorted);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  if (loading) {
    return (
      <div className="container">
        <div className="header">
          <h1>Hindu Names Browser</h1>
          <p>Explore and search through beautiful Hindu names</p>
        </div>
        <div className="loading">Loading names...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <div className="header">
          <h1>Hindu Names Browser</h1>
          <p>Explore and search through beautiful Hindu names</p>
        </div>
        <div className="error">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="header">
        <h1>Hindu Names Browser</h1>
        <p>Explore and search through beautiful Hindu names</p>
      </div>
      
      <div className="search-section">
        <input 
          type="text" 
          className="search-box" 
          placeholder="Type to search names..."
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </div>
      
      <div className="results-section">
        <div className="results-info">
          Showing {filteredNames.length} of {allNames.length} names
        </div>
        
        {filteredNames.length === 0 ? (
          <div className="no-results">
            <p>No names found matching your search.</p>
          </div>
        ) : (
          <div className="names-list">
            {filteredNames.map((name, index) => (
              <div key={index} className="name-card">
                <div className="name-text">{name.name}</div>
                <div className="name-details">
                  <div className="detail-item">
                    <span className="detail-label">Length:</span>
                    <span>{name.length || 'N/A'}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Syllables:</span>
                    <span>{name.syllables_est || 'N/A'}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Vowel Ratio:</span>
                    <span>{name.vowel_ratio || 'N/A'}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default App;

