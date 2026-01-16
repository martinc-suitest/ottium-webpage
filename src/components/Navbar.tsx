import './Navbar.css';
import logo from "../img/logo/Ottium_logo.svg";
import { useState, useMemo, useEffect } from 'react';

interface SearchResult {
  id: string;
  title: string;
  snippet: string;
  url?: string;
}

// Function to extract searchable content from the page
function extractPageContent(): SearchResult[] {
  const results: SearchResult[] = [];
  let id = 0;

  // Get all text containers (p, div, span, section, article, etc.)
  const textElements = document.querySelectorAll('p, div, section, article, h1, h2, h3, h4, h5, h6, span');
  const seenSnippets = new Set<string>();
  
  textElements.forEach((element) => {
    // Skip navbar, search UI, navigation, and other UI elements
    if (element.closest('.navbar, nav, header, .navbar-menu, .navbar-search, .search-results, [role="navigation"], footer')) {
      return;
    }
    
    // Skip if element is hidden or display none
    const style = window.getComputedStyle(element);
    if (style.display === 'none' || style.visibility === 'hidden') {
      return;
    }
    
    const text = element.textContent?.trim() || '';
    
    // Look for text blocks with at least 10 characters
    if (text && text.length >= 10 && text.length < 1000 && !seenSnippets.has(text.substring(0, 50))) {
      // Skip if text contains only special patterns that indicate UI noise
      if (text.match(/^[\s✓🔜✕</>]*$/) || 
          text.includes('matching documents') || 
          text.includes('No results found') || 
          text.includes('Type to start') ||
          text.includes('Select device')) {
        return;
      }
      
      seenSnippets.add(text.substring(0, 50));
      
      // Check if this element or a parent has a heading
      let title = '';
      
      // If element is a heading, use it as title
      if (element.tagName.match(/^H[1-6]$/)) {
        title = text;
      } else {
        // Look for a nearby heading in previous siblings or parent
        let current = element.previousElementSibling;
        let attempts = 0;
        
        while (!title && current && attempts < 3) {
          const headingText = current.textContent?.trim() || '';
          if (current.tagName.match(/^H[1-6]$/)) {
            title = headingText;
            break;
          }
          current = current.previousElementSibling;
          attempts++;
        }
        
        // If no nearby heading, check parent for heading
        if (!title) {
          const parentHeading = element.parentElement?.querySelector('h1, h2, h3, h4, h5, h6');
          if (parentHeading) {
            title = parentHeading.textContent?.trim() || '';
          }
        }

        // Check closest section
        if (!title) {
          const closestSection = element.closest('section');
          if (closestSection) {
            const sectionHeading = closestSection.querySelector('h1, h2, h3, h4, h5, h6');
            if (sectionHeading) {
              title = sectionHeading.textContent?.trim() || '';
            }
          }
        }
      }
      
      // If still no title, use first 50 characters
      if (!title) {
        title = text.substring(0, 50);
      }
      
      results.push({
        id: String(++id),
        title: title.substring(0, 60),
        snippet: text.substring(0, 150) + (text.length > 150 ? '...' : ''),
        url: element.id ? `#${element.id}` : (element.closest('section')?.id ? `#${element.closest('section')?.id}` : '')
      });
    }
  });

  return results;
}

function Navbar() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [pageContent, setPageContent] = useState<SearchResult[]>([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  // Extract page content on component mount and when page loads
  useEffect(() => {
    // Extract immediately
    const content = extractPageContent();
    setPageContent(content);
    
    // Re-extract after a delay to ensure all content is loaded
    const timer = setTimeout(() => {
      const updatedContent = extractPageContent();
      setPageContent(updatedContent);
    }, 1000);

    // Handle click outside to close menus
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const navbar = document.querySelector('.navbar');
      
      if (navbar && !navbar.contains(target)) {
        setMobileMenuOpen(false);
        setSearchOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      clearTimeout(timer);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    
    const query = searchQuery.toLowerCase();
    return pageContent.filter(item => 
      item.title.toLowerCase().includes(query) ||
      item.snippet.toLowerCase().includes(query)
    );
  }, [searchQuery, pageContent]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setShowResults(false);
  };

  const handleResultClick = (url?: string) => {
    if (url) {
      window.location.href = url;
    }
    setSearchQuery('');
    setShowResults(false);
  };

  const handleSearchIconClick = () => {
    setSearchOpen(!searchOpen);
    if (searchOpen) {
      setSearchQuery('');
      setShowResults(false);
    }
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  const handleLogoClick = () => {
    window.location.reload();
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-logo" onClick={handleLogoClick}>
          <img src={logo} alt="Logo" />
        </div>
        
        <form className={`navbar-search ${searchOpen ? 'search-open' : ''}`} onSubmit={handleSearch}>
          <button
            type="button"
            className="search-icon-button"
            onClick={handleSearchIconClick}
          >
            <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.35-4.35"></path>
            </svg>
          </button>
          <input
            type="text"
            placeholder="Type to start searching"
            className="search-input"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setShowResults(true);
            }}
            onFocus={() => searchQuery && setShowResults(true)}
          />
          {searchQuery && (
            <button
              type="button"
              className="search-clear"
              onClick={handleClearSearch}
            >
              ✕
            </button>
          )}
          
          {showResults && searchQuery && (
            <div className="search-results">
              <div className="search-results-header">
                {searchResults.length} matching documents
              </div>
              <div className="search-results-list">
                {searchResults.length > 0 ? (
                  searchResults.map(result => (
                    <div
                      key={result.id}
                      className="search-result-item"
                      onClick={() => handleResultClick(result.url)}
                    >
                      <div className="search-result-icon">📄</div>
                      <div className="search-result-content">
                        <div className="search-result-title">{result.title}</div>
                        <div className="search-result-snippet">{result.snippet}</div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="search-result-empty">No results found</div>
                )}
              </div>
            </div>
          )}
        </form>

        <button 
          className="hamburger-menu"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <span className={mobileMenuOpen ? 'open' : ''}></span>
          <span className={mobileMenuOpen ? 'open' : ''}></span>
          <span className={mobileMenuOpen ? 'open' : ''}></span>
        </button>

        <ul className={`navbar-menu ${mobileMenuOpen ? 'mobile-open' : ''}`}>
          <li><a href="#welcome" onClick={closeMobileMenu}>Welcome</a></li>
          <li><a href="#features" onClick={closeMobileMenu}>Features</a></li>
          <li><a href="#platforms" onClick={closeMobileMenu}>Platforms</a></li>
          <li><a href="#docs" onClick={closeMobileMenu}>Docs</a></li>
          <li><a href="https://suite.st" onClick={closeMobileMenu}>Company</a></li>
        </ul>
      </div>
    </nav>
  )
}

export default Navbar
