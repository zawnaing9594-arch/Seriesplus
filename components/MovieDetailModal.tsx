import React, { useState, useEffect, useRef } from 'react';
import { X, Play, Star, Calendar, Clock, Edit2, Share2, Check, AlertCircle } from 'lucide-react';
import { Movie, Episode, SiteConfig } from '../types';
import Hls from 'hls.js';

interface MovieDetailModalProps {
  movie: Movie | null;
  initialEpisodeId?: string;
  onClose: () => void;
  onEdit: (movie: Movie) => void;
  isAdmin: boolean;
  siteConfig: SiteConfig;
}

const VideoPlayer = ({ url, poster, onClose }: { url: string, poster: string, onClose: () => void }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [error, setError] = useState<string | null>(null);
  let type = 'native';
  let src = url;

  // Regex for YouTube (Supports standard, shorts, embed)
  const youtubeRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
  // Regex for Vimeo (Supports channels, groups, video id)
  const vimeoRegex = /vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/(?:[^\/]*)\/videos\/|album\/(?:\d+)\/video\/|video\/|)(\d+)(?:$|\/|\?)/;
  
  const ytMatch = url.match(youtubeRegex);
  const vimeoMatch = url.match(vimeoRegex);

  if (ytMatch && ytMatch[1]) {
      type = 'youtube';
      src = `https://www.youtube.com/embed/${ytMatch[1]}?autoplay=1&rel=0&modestbranding=1`;
  } else if (vimeoMatch && vimeoMatch[1]) {
      type = 'vimeo';
      src = `https://player.vimeo.com/video/${vimeoMatch[1]}?autoplay=1`;
  } else if (url.includes('facebook.com')) {
      type = 'facebook';
      src = `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(url)}&show_text=false&autoplay=1`;
  } else if (url.endsWith('.m3u8')) {
      type = 'hls';
  }

  useEffect(() => {
    setError(null);
    if (type === 'hls' && videoRef.current) {
        if (Hls.isSupported()) {
            const hls = new Hls();
            hls.loadSource(src);
            hls.attachMedia(videoRef.current);
            hls.on(Hls.Events.MANIFEST_PARSED, () => {
                videoRef.current?.play().catch(e => console.log("Autoplay blocked by browser", e));
            });
            hls.on(Hls.Events.ERROR, (event, data) => {
                if (data.fatal) {
                   setError("Stream error. Please check the URL.");
                }
            });
            return () => hls.destroy();
        } else if (videoRef.current.canPlayType('application/vnd.apple.mpegurl')) {
            videoRef.current.src = src;
            videoRef.current.addEventListener('loadedmetadata', () => {
               videoRef.current?.play().catch(e => console.log("Autoplay blocked by browser", e));
            });
            videoRef.current.addEventListener('error', () => {
                 setError("Error loading video stream.");
            });
        }
    }
  }, [type, src]);

  const handleNativeError = () => {
      setError("Unable to play video. Format may not be supported or link is broken.");
  };

  if (type === 'youtube' || type === 'vimeo' || type === 'facebook') {
      return (
          <div className="w-full h-full relative bg-black">
             <iframe 
                src={src} 
                className="w-full h-full" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowFullScreen
                frameBorder="0"
                title="Video Player"
             ></iframe>
             <button onClick={onClose} className="absolute top-4 right-4 z-50 p-2 bg-black/50 hover:bg-black/80 rounded-full text-white transition md:hidden"><X className="w-6 h-6" /></button>
          </div>
      )
  }

  return (
      <div className="w-full h-full relative group bg-black flex items-center justify-center">
         {error ? (
             <div className="text-center p-4">
                 <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-2" />
                 <p className="text-white font-bold">{error}</p>
                 <p className="text-gray-400 text-sm mt-1 break-all">{url}</p>
             </div>
         ) : (
            <video 
                ref={videoRef} 
                src={type === 'native' ? src : undefined} 
                poster={poster} 
                className="w-full h-full object-contain" 
                controls 
                autoPlay 
                playsInline
                onError={handleNativeError}
            />
         )}
         <button onClick={onClose} className="absolute top-4 right-4 z-50 p-2 bg-black/50 hover:bg-black/80 rounded-full text-white transition md:hidden"><X className="w-6 h-6" /></button>
      </div>
  );
}

const MovieDetailModal: React.FC<MovieDetailModalProps> = ({ movie, initialEpisodeId, onClose, onEdit, isAdmin, siteConfig }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentEpisode, setCurrentEpisode] = useState<Episode | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (movie) {
        // Update document title for better history/tab experience
        const prevTitle = document.title;
        document.title = `Watch ${movie.title} | ${siteConfig.siteName}`;
        return () => { document.title = prevTitle; };
    }
  }, [movie, siteConfig]);

  useEffect(() => {
    if (movie?.type === 'series' && movie.episodes && movie.episodes.length > 0) {
        if (initialEpisodeId) {
            const found = movie.episodes.find(e => e.id === initialEpisodeId);
            if (found) {
                setCurrentEpisode(found);
                setIsPlaying(true);
                return;
            }
        }
        setCurrentEpisode(movie.episodes[0]);
    }
  }, [movie, initialEpisodeId]);

  const handlePlay = () => {
      setIsPlaying(true);
  };

  const handleEpisodeClick = (ep: Episode) => {
      setCurrentEpisode(ep);
      setIsPlaying(true);
  };

  const handleShare = async () => {
      if (!movie) return;
      
      const baseUrl = window.location.origin + window.location.pathname;
      let shareUrl = `${baseUrl}?content=${movie.id}`;
      
      if (movie.type === 'series' && currentEpisode) {
          shareUrl += `&episode=${currentEpisode.id}`;
      }

      // Try Native Share API (Mobile)
      if (navigator.share) {
          try {
              await navigator.share({
                  title: movie.title,
                  text: `Watch ${movie.title} on ${siteConfig.siteName}`,
                  url: shareUrl
              });
              return; // Success, don't fallback to copy
          } catch (err) {
              console.log('Share dismissed', err);
              // Fallthrough to copy if share failed or was cancelled
          }
      }

      // Fallback to Clipboard
      try {
          await navigator.clipboard.writeText(shareUrl);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
      } catch (err) {
          const textArea = document.createElement("textarea");
          textArea.value = shareUrl;
          document.body.appendChild(textArea);
          textArea.select();
          document.execCommand('copy');
          document.body.removeChild(textArea);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
      }
  };

  if (!movie) return null;

  const activeVideoUrl = movie.type === 'series' ? currentEpisode?.videoUrl : movie.videoUrl;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-0 md:p-8">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity" onClick={onClose}></div>
      
      <div className="relative w-full md:max-w-6xl h-full md:h-[90vh] bg-[#0f1014] md:rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row animate-scale-up">
        <button onClick={onClose} className="hidden md:block absolute top-4 right-4 z-50 p-2 bg-black/50 hover:bg-black/80 rounded-full text-white transition">
          <X className="w-6 h-6" />
        </button>

        {/* Controls Overlay */}
        <div className="absolute top-4 left-4 z-50 flex space-x-2">
            {isAdmin && (
                <button 
                  onClick={() => onEdit(movie)} 
                  className="p-2 bg-indigo-600/80 hover:bg-indigo-600 rounded-full text-white transition flex items-center space-x-2 px-4 backdrop-blur-md shadow-lg"
                >
                    <Edit2 className="w-4 h-4" /> <span className="text-xs font-bold">Edit</span>
                </button>
            )}
            <button onClick={handleShare} className="p-2 bg-gray-600/80 hover:bg-gray-500 rounded-full text-white transition flex items-center space-x-2 px-4 backdrop-blur-md shadow-lg">
                {copied ? <Check className="w-4 h-4 text-green-400" /> : <Share2 className="w-4 h-4" />}
                <span className="text-xs font-bold">{copied ? 'Link Copied' : 'Share'}</span>
            </button>
        </div>

        {/* Video Section */}
        <div className={`relative w-full ${isPlaying ? 'md:w-full h-full md:h-full z-40' : 'md:w-[70%] h-[40vh] md:h-full'} bg-black transition-all duration-500`}>
          {isPlaying && activeVideoUrl ? (
             <VideoPlayer url={activeVideoUrl} poster={movie.imageUrl} onClose={() => setIsPlaying(false)} />
          ) : (
            <>
                <button onClick={onClose} className="md:hidden absolute top-4 right-4 z-50 p-2 bg-black/50 rounded-full text-white"><X className="w-6 h-6" /></button>
                <img src={movie.imageUrl} alt={movie.title} className="w-full h-full object-cover opacity-80" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0f1014] via-transparent to-transparent md:bg-gradient-to-r md:from-transparent md:via-transparent md:to-[#0f1014]" />
                <div className="absolute inset-0 flex items-center justify-center">
                     {activeVideoUrl ? (
                        <button onClick={handlePlay} className="group flex flex-col items-center justify-center transition transform hover:scale-110">
                            <div className="w-16 h-16 md:w-20 md:h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mb-4 border-2 border-white group-hover:bg-white/30 transition">
                                <Play className="w-8 h-8 md:w-10 md:h-10 fill-white text-white ml-1" />
                            </div>
                            <span className="text-white font-bold tracking-widest uppercase text-sm drop-shadow-lg">
                                {movie.type === 'series' ? `Watch S${currentEpisode?.season}:E${currentEpisode?.episodeNumber}` : 'Watch Now'}
                            </span>
                        </button>
                     ) : (
                        <div className="text-white/50 bg-black/50 px-4 py-2 rounded-lg backdrop-blur-sm border border-white/10">Video Not Available</div>
                     )}
                </div>
            </>
          )}
        </div>

        {/* Details Section */}
        <div className={`${isPlaying ? 'hidden' : 'flex'} flex-col w-full md:w-[30%] h-[60vh] md:h-full bg-[#0f1014] p-6 md:p-8 overflow-y-auto border-l border-gray-800`}>
            <div className="mb-6">
                <div className="flex justify-between items-start">
                    <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-2">{movie.title}</h2>
                    {isAdmin && (
                        <button onClick={() => onEdit(movie)} className="md:hidden text-indigo-400 p-1">
                            <Edit2 className="w-5 h-5" />
                        </button>
                    )}
                </div>
                <div className="flex flex-wrap gap-3 text-sm text-gray-400 mb-4">
                    <span className="flex items-center text-green-400 font-semibold"><Star className="w-4 h-4 mr-1 fill-current" /> {movie.rating}</span>
                    <span className="flex items-center"><Calendar className="w-4 h-4 mr-1"/> {movie.year}</span>
                    <span className="flex items-center"><Clock className="w-4 h-4 mr-1"/> {movie.type === 'series' ? `${movie.episodes?.length || 0} Episodes` : movie.duration}</span>
                </div>
                <div className="flex flex-wrap gap-2 mb-4">
                    {movie.genre.map(g => (
                        <span key={g} className="px-3 py-1 bg-gray-800 text-gray-200 text-xs rounded-full border border-gray-700">{g}</span>
                    ))}
                </div>
                <p className="text-gray-300 leading-relaxed mb-6 text-sm">{movie.description}</p>
                <div className="mb-6">
                    <h4 className="text-gray-500 text-xs uppercase tracking-wider mb-2 font-semibold">Cast & Crew</h4>
                    <div className="text-sm text-gray-300"><span className="text-gray-500">Director:</span> {movie.director}</div>
                    <div className="text-sm text-gray-300 mt-1"><span className="text-gray-500">Starring:</span> {movie.cast.join(', ')}</div>
                </div>

                {/* Series Episodes List */}
                {movie.type === 'series' && movie.episodes && (
                    <div className="mb-6">
                        <h3 className="text-lg font-bold text-white mb-3">Episodes</h3>
                        <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                            {movie.episodes.map((ep) => (
                                <div 
                                    key={ep.id} 
                                    onClick={() => handleEpisodeClick(ep)}
                                    className={`p-3 rounded-lg cursor-pointer transition flex items-center justify-between ${currentEpisode?.id === ep.id ? 'bg-indigo-900/50 border border-indigo-500/50' : 'bg-gray-800/50 hover:bg-gray-800'}`}
                                >
                                    <div className="flex items-center">
                                        <div className="mr-3 text-gray-400 text-xs font-mono">S{ep.season} E{ep.episodeNumber}</div>
                                        <div className="text-sm font-medium text-white line-clamp-1">{ep.title}</div>
                                    </div>
                                    <Play className={`w-3 h-3 flex-shrink-0 ${currentEpisode?.id === ep.id ? 'text-indigo-400' : 'text-gray-500'}`} />
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetailModal;