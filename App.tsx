import React, { useState, useMemo, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ContentRow from './components/ContentRow';
import MovieDetailModal from './components/MovieDetailModal';
import AdminModal from './components/AdminModal';
import PinModal from './components/PinModal';
import { Movie, SiteConfig } from './types';
import { MOVIES } from './services/mockData';
import { UploadCloud, Search } from 'lucide-react';

function App() {
  // Main State for Movies with LocalStorage Persistence
  const [movies, setMovies] = useState<Movie[]>(() => {
    try {
        const saved = localStorage.getItem('streamgenius_content');
        // If local storage is empty, load sample data (MOVIES)
        return saved ? JSON.parse(saved) : MOVIES;
    } catch (e) {
        return MOVIES;
    }
  });

  // Site Config State
  const [siteConfig, setSiteConfig] = useState<SiteConfig>(() => {
    try {
        const saved = localStorage.getItem('streamgenius_config');
        return saved ? JSON.parse(saved) : { siteName: 'SeriesGenius', siteLogoUrl: '' };
    } catch (e) {
        return { siteName: 'SeriesGenius', siteLogoUrl: '' };
    }
  });
  
  // UI State
  const [isAdmin, setIsAdmin] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [selectedEpisodeId, setSelectedEpisodeId] = useState<string | undefined>(undefined);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isPinModalOpen, setIsPinModalOpen] = useState(false);
  const [editingMovie, setEditingMovie] = useState<Movie | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Persist to LocalStorage
  useEffect(() => {
    if (movies.length > 0) {
        localStorage.setItem('streamgenius_content', JSON.stringify(movies));
    }
  }, [movies]);

  useEffect(() => {
      localStorage.setItem('streamgenius_config', JSON.stringify(siteConfig));
      document.title = siteConfig.siteName;
  }, [siteConfig]);

  // Deep Linking Logic
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const contentId = params.get('content');
      const episodeId = params.get('episode');

      if (contentId && movies.length > 0) {
          const found = movies.find(m => m.id === contentId);
          if (found) {
              setSelectedMovie(found);
              if (episodeId) {
                  setSelectedEpisodeId(episodeId);
              }
          }
      }
    } catch (e) {
      console.warn("Could not parse URL parameters", e);
    }
  }, [movies]);

  const featuredMovie = movies.length > 0 ? movies[0] : null;

  // Filter Logic based on Search
  const filteredMovies = useMemo(() => {
      if (!searchQuery) return movies;
      const lowerQ = searchQuery.toLowerCase();
      return movies.filter(m => 
          m.title.toLowerCase().includes(lowerQ) || 
          m.genre.some(g => g.toLowerCase().includes(lowerQ))
      );
  }, [movies, searchQuery]);

  // Derived Categories
  const contentRows = useMemo(() => {
    if (searchQuery) {
        return [{ title: `Search Results for "${searchQuery}"`, movies: filteredMovies }];
    }

    if (movies.length === 0) return [];
    
    // Custom logic to categorize mock data
    const series = movies.filter(m => m.type === 'series');
    const action = movies.filter(m => m.genre.some(g => g.includes('Action')));
    const drama = movies.filter(m => m.genre.some(g => g.includes('Drama')));
    const recent = [...movies].reverse().slice(0, 5);

    return [
        { title: "Trending Now", movies: movies },
        { title: "TV Series", movies: series },
        { title: "Action & Adventure", movies: action },
        { title: "Critically Acclaimed Dramas", movies: drama },
        { title: "Recently Added", movies: recent }
    ].filter(cat => cat.movies.length > 0);
  }, [movies, filteredMovies, searchQuery]);

  const handleMovieClick = (movie: Movie) => {
    setSelectedMovie(movie);
    setSelectedEpisodeId(undefined);
    try {
      const newUrl = `${window.location.pathname}?content=${movie.id}`;
      // Wrap in try-catch to prevent SecurityError in some sandboxed environments
      window.history.replaceState({ path: newUrl }, '', newUrl);
    } catch (e) {
      console.log("Deep linking update skipped");
    }
  };

  const handleCloseModal = () => {
    setSelectedMovie(null);
    setSelectedEpisodeId(undefined);
    try {
      window.history.replaceState({ path: window.location.pathname }, '', window.location.pathname);
    } catch (e) {
       console.log("Deep linking update skipped");
    }
  };

  const handleOpenAdmin = (movieToEdit?: Movie) => {
    if (movieToEdit) {
        setEditingMovie(movieToEdit);
        // Do not close selectedMovie here, so AdminModal opens on top of DetailModal
    } else {
        setEditingMovie(null);
    }
    setIsAdminOpen(true);
  };

  const handleSaveMovie = (movie: Movie) => {
    if (editingMovie) {
        // Update the movies list
        setMovies(prev => prev.map(m => m.id === movie.id ? movie : m));
        
        // CRITICAL UPDATE: If the user is currently viewing the movie being edited, update the view immediately
        if (selectedMovie && selectedMovie.id === movie.id) {
            setSelectedMovie(movie);
        }
    } else {
        setMovies(prev => [movie, ...prev]);
    }
    setIsAdminOpen(false);
    setEditingMovie(null);
  };

  const handleSaveConfig = (config: SiteConfig) => {
      setSiteConfig(config);
      setIsAdminOpen(false);
  }

  const handleAdminToggle = () => {
    if (isAdmin) {
        if (confirm("Logout Admin Mode?")) setIsAdmin(false);
    } else {
        setIsPinModalOpen(true);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f1014] text-white font-sans selection:bg-indigo-500 selection:text-white pb-20">
      <Navbar 
        onOpenAdmin={() => handleOpenAdmin()} 
        onAdminLogin={handleAdminToggle}
        isAdmin={isAdmin} 
        siteConfig={siteConfig}
        onSearch={setSearchQuery}
      />
      
      <main>
        {!searchQuery && featuredMovie ? (
            <Hero 
              movie={featuredMovie} 
              onPlay={handleMovieClick}
              onMoreInfo={handleMovieClick}
            />
        ) : !searchQuery && (
            <div className="h-[50vh] flex flex-col items-center justify-center text-center px-4 pt-20">
                {movies.length === 0 && (
                    <>
                        <div className="w-20 h-20 bg-gray-800 rounded-full flex items-center justify-center mb-6">
                            <UploadCloud className="w-10 h-10 text-gray-600" />
                        </div>
                        {isAdmin ? (
                            <button 
                                onClick={() => handleOpenAdmin()}
                                className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold"
                            >
                                Upload First Content
                            </button>
                        ) : (
                            <h1 className="text-3xl font-bold text-gray-500">No Content Available</h1>
                        )}
                    </>
                )}
            </div>
        )}

        {/* Search Empty State */}
        {searchQuery && filteredMovies.length === 0 && (
             <div className="h-[60vh] flex flex-col items-center justify-center text-center px-4 pt-20">
                 <Search className="w-16 h-16 text-gray-700 mb-4" />
                 <h2 className="text-2xl font-bold text-gray-400">No results found for "{searchQuery}"</h2>
             </div>
        )}
        
        <div className={`relative z-10 ${!searchQuery && featuredMovie ? '-mt-24 md:-mt-32 pt-32' : 'mt-20'} pb-10 bg-gradient-to-t from-[#0f1014] to-transparent`}>
          {contentRows.map((category, index) => (
            <ContentRow 
              key={index}
              title={category.title} 
              movies={category.movies} 
              onMovieClick={handleMovieClick}
            />
          ))}
        </div>
      </main>

      <footer className="max-w-7xl mx-auto px-4 py-8 text-center text-gray-500 text-sm border-t border-gray-800 mt-8">
        <div className="flex flex-col md:flex-row items-center justify-center gap-2">
            <p>&copy; {new Date().getFullYear()} {siteConfig.siteName}. All rights reserved.</p>
        </div>
      </footer>

      {selectedMovie && (
        <MovieDetailModal 
          movie={selectedMovie} 
          initialEpisodeId={selectedEpisodeId}
          onClose={handleCloseModal}
          onEdit={handleOpenAdmin}
          isAdmin={isAdmin}
          siteConfig={siteConfig}
        />
      )}

      {isAdminOpen && (
        <AdminModal 
            movie={editingMovie}
            allMovies={movies}
            currentSiteConfig={siteConfig}
            onSaveContent={handleSaveMovie}
            onSaveConfig={handleSaveConfig}
            onClose={() => setIsAdminOpen(false)}
        />
      )}

      {isPinModalOpen && (
        <PinModal 
            onSuccess={() => setIsAdmin(true)}
            onClose={() => setIsPinModalOpen(false)}
        />
      )}
    </div>
  );
}

export default App;