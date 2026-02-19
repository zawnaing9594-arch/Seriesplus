import React from 'react';
import { Play, Info, Plus } from 'lucide-react';
import { Movie } from '../types';

interface HeroProps {
  movie: Movie;
  onPlay: (movie: Movie) => void;
  onMoreInfo: (movie: Movie) => void;
}

const Hero: React.FC<HeroProps> = ({ movie, onPlay, onMoreInfo }) => {
  return (
    <div className="relative h-[85vh] w-full overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={movie.imageUrl}
          alt={movie.title}
          className="w-full h-full object-cover"
        />
        {/* Gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="absolute bottom-0 left-0 w-full p-6 md:p-12 lg:p-16 flex flex-col justify-end h-full">
        <div className="max-w-2xl space-y-4 animate-fade-in-up">
           <div className="flex items-center space-x-2 text-yellow-400 font-medium tracking-wide text-sm uppercase">
                <span>{movie.genre[0]}</span>
                <span>•</span>
                <span>{movie.year}</span>
                <span>•</span>
                <span>{movie.duration}</span>
           </div>
          
          <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight leading-none drop-shadow-xl">
            {movie.title}
          </h1>
          
          <p className="text-gray-200 text-lg md:text-xl line-clamp-3 md:line-clamp-none max-w-xl drop-shadow-md">
            {movie.description}
          </p>

          <div className="flex items-center space-x-4 pt-4">
            <button 
              onClick={() => onPlay(movie)}
              className="flex items-center justify-center px-8 py-3 bg-white text-black hover:bg-gray-200 rounded-lg font-bold transition transform hover:scale-105"
            >
              <Play className="w-5 h-5 mr-2 fill-current" />
              Watch Now
            </button>
            <button 
              onClick={() => onMoreInfo(movie)}
              className="flex items-center justify-center px-8 py-3 bg-gray-600/60 backdrop-blur-md text-white hover:bg-gray-500/60 rounded-lg font-bold transition transform hover:scale-105 border border-white/20"
            >
              <Info className="w-5 h-5 mr-2" />
              Details
            </button>
            <button className="p-3 bg-gray-600/60 backdrop-blur-md text-white hover:bg-gray-500/60 rounded-full transition transform hover:scale-105 border border-white/20">
                <Plus className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
