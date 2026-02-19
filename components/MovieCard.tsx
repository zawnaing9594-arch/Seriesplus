import React from 'react';
import { Play } from 'lucide-react';
import { Movie } from '../types';

interface MovieCardProps {
  movie: Movie;
  onClick: (movie: Movie) => void;
}

const MovieCard: React.FC<MovieCardProps> = ({ movie, onClick }) => {
  return (
    <div 
      className="relative flex-none w-36 md:w-56 aspect-[2/3] rounded-lg overflow-hidden cursor-pointer group transition-all duration-300 hover:z-20 hover:scale-105"
      onClick={() => onClick(movie)}
    >
      <img
        src={movie.imageUrl}
        alt={movie.title}
        className="w-full h-full object-cover transition-transform duration-300 group-hover:brightness-75"
        loading="lazy"
      />
      
      {/* Hover Overlay */}
      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
         <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
             <div className="flex items-center justify-center mb-2">
                 <div className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center shadow-lg">
                    <Play className="w-5 h-5 fill-current ml-0.5" />
                 </div>
             </div>
             <h3 className="text-white font-bold text-sm md:text-base leading-tight">{movie.title}</h3>
             <div className="flex items-center space-x-2 mt-1">
                <span className="text-green-400 text-xs font-bold">{movie.rating} Rating</span>
                <span className="text-gray-300 text-xs">• {movie.year}</span>
             </div>
             <p className="text-gray-400 text-xs mt-1 line-clamp-2">{movie.genre.join(', ')}</p>
         </div>
      </div>
    </div>
  );
};

export default MovieCard;
