import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import MovieCard from './MovieCard';
import { Movie } from '../types';

interface ContentRowProps {
  title: string;
  movies: Movie[];
  onMovieClick: (movie: Movie) => void;
}

const ContentRow: React.FC<ContentRowProps> = ({ title, movies, onMovieClick }) => {
  const rowRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (rowRef.current) {
      const { current } = rowRef;
      const scrollAmount = direction === 'left' ? -current.offsetWidth / 1.5 : current.offsetWidth / 1.5;
      current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className="space-y-4 my-8 px-4 md:px-12 relative group/row">
      <h2 className="text-xl md:text-2xl font-bold text-white mb-2 pl-1 border-l-4 border-indigo-600">
        {title}
      </h2>
      
      <div className="relative">
        <button 
            className="absolute left-0 top-0 bottom-0 z-40 w-12 bg-gradient-to-r from-black/80 to-transparent flex items-center justify-center opacity-0 group-hover/row:opacity-100 transition-opacity duration-300 pointer-events-none md:pointer-events-auto cursor-pointer"
            onClick={() => scroll('left')}
        >
            <ChevronLeft className="w-8 h-8 text-white hover:scale-125 transition-transform" />
        </button>

        <div 
            ref={rowRef}
            className="flex space-x-4 overflow-x-auto scrollbar-hide pb-4 pt-2 snap-x"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
            {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} onClick={onMovieClick} />
            ))}
        </div>

        <button 
            className="absolute right-0 top-0 bottom-0 z-40 w-12 bg-gradient-to-l from-black/80 to-transparent flex items-center justify-center opacity-0 group-hover/row:opacity-100 transition-opacity duration-300 pointer-events-none md:pointer-events-auto cursor-pointer"
            onClick={() => scroll('right')}
        >
            <ChevronRight className="w-8 h-8 text-white hover:scale-125 transition-transform" />
        </button>
      </div>
    </div>
  );
};

export default ContentRow;
