import React, { useState, useEffect, useRef } from 'react';
import { X, Save, Upload, Plus, Trash2, Film, Tv, Settings, Image as ImageIcon, Loader2, Download } from 'lucide-react';
import { Movie, Episode, SiteConfig } from '../types';

interface AdminModalProps {
  movie?: Movie | null;
  allMovies?: Movie[];
  currentSiteConfig: SiteConfig;
  onSaveContent: (movie: Movie) => void;
  onSaveConfig: (config: SiteConfig) => void;
  onClose: () => void;
}

const AdminModal: React.FC<AdminModalProps> = ({ movie, allMovies = [], currentSiteConfig, onSaveContent, onSaveConfig, onClose }) => {
  const [activeTab, setActiveTab] = useState<'content' | 'settings'>('content');
  const [isProcessingImg, setIsProcessingImg] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Content Form State
  const [contentType, setContentType] = useState<'movie' | 'series'>('movie');
  const [formData, setFormData] = useState<Partial<Movie>>({
    title: '',
    description: '',
    genre: [],
    duration: '',
    rating: 0,
    year: new Date().getFullYear(),
    imageUrl: '',
    videoUrl: '',
    cast: [],
    director: '',
    episodes: []
  });

  // Settings Form State
  const [configData, setConfigData] = useState<SiteConfig>(currentSiteConfig);

  // Episode Form State
  const [newEpisode, setNewEpisode] = useState<Partial<Episode>>({
    title: '',
    season: 1,
    episodeNumber: 1,
    videoUrl: '',
    duration: ''
  });

  useEffect(() => {
    if (movie) {
      setFormData(movie);
      setContentType(movie.type || 'movie');
      setActiveTab('content');
    } else {
      // Reset form if movie is null (Add mode)
      setFormData({
        title: '',
        description: '',
        genre: [],
        duration: '',
        rating: 0,
        year: new Date().getFullYear(),
        imageUrl: '',
        videoUrl: '',
        cast: [],
        director: '',
        episodes: []
      });
      setContentType('movie');
      setActiveTab('content');
    }
  }, [movie]);

  const handleContentChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleConfigChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setConfigData(prev => ({ ...prev, [name]: value }));
  };

  const handleArrayChange = (e: React.ChangeEvent<HTMLInputElement>, field: 'genre' | 'cast') => {
    const values = e.target.value.split(',').map(item => item.trim());
    setFormData(prev => ({ ...prev, [field]: values }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessingImg(true);
    const reader = new FileReader();
    reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
            const canvas = document.createElement('canvas');
            const MAX_WIDTH = 600; // Resize to max 600px width
            const MAX_HEIGHT = 900;
            let width = img.width;
            let height = img.height;

            if (width > height) {
                if (width > MAX_WIDTH) {
                    height *= MAX_WIDTH / width;
                    width = MAX_WIDTH;
                }
            } else {
                if (height > MAX_HEIGHT) {
                    width *= MAX_HEIGHT / height;
                    height = MAX_HEIGHT;
                }
            }

            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            ctx?.drawImage(img, 0, 0, width, height);
            
            // Compress to JPEG 0.7 quality
            const dataUrl = canvas.toDataURL('image/jpeg', 0.7);
            setFormData(prev => ({ ...prev, imageUrl: dataUrl }));
            setIsProcessingImg(false);
        };
        img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleAddEpisode = () => {
    if (!newEpisode.videoUrl || !newEpisode.title) return;

    const episode: Episode = {
      id: Date.now().toString() + Math.random().toString(),
      title: newEpisode.title || `Episode ${newEpisode.episodeNumber}`,
      season: Number(newEpisode.season) || 1,
      episodeNumber: Number(newEpisode.episodeNumber) || (formData.episodes?.length || 0) + 1,
      videoUrl: newEpisode.videoUrl || '',
      duration: newEpisode.duration || '',
      description: newEpisode.description || ''
    };

    setFormData(prev => ({
      ...prev,
      episodes: [...(prev.episodes || []), episode]
    }));

    setNewEpisode(prev => ({
      ...prev,
      title: '',
      episodeNumber: (Number(prev.episodeNumber) || 0) + 1,
      videoUrl: '',
      duration: ''
    }));
  };

  const handleDeleteEpisode = (id: string) => {
    setFormData(prev => ({
        ...prev,
        episodes: prev.episodes?.filter(e => e.id !== id)
    }));
  };

  const handleSubmitContent = (e: React.FormEvent) => {
    e.preventDefault();
    const newMovie: Movie = {
      id: movie?.id || Date.now().toString(),
      type: contentType,
      title: formData.title || 'Untitled',
      description: formData.description || '',
      genre: formData.genre || [],
      duration: formData.duration || '',
      rating: Number(formData.rating) || 0,
      year: Number(formData.year) || new Date().getFullYear(),
      imageUrl: formData.imageUrl || 'https://via.placeholder.com/300x450?text=No+Image',
      videoUrl: contentType === 'movie' ? (formData.videoUrl || '') : undefined,
      cast: formData.cast || [],
      director: formData.director || '',
      episodes: contentType === 'series' ? (formData.episodes || []) : undefined
    };
    onSaveContent(newMovie);
  };

  const handleSubmitConfig = (e: React.FormEvent) => {
      e.preventDefault();
      onSaveConfig(configData);
  }

  const handleExportData = () => {
      const dataStr = JSON.stringify(allMovies, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
      
      const exportFileDefaultName = `seriesgenius_backup_${new Date().toLocaleDateString()}.json`;
      
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-[#1a1c21] w-full max-w-4xl rounded-2xl shadow-2xl border border-gray-700 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header with Tabs */}
        <div className="p-4 border-b border-gray-700 flex justify-between items-center bg-[#0f1014]">
          <div className="flex space-x-6">
              <button 
                onClick={() => setActiveTab('content')}
                className={`flex items-center text-sm font-bold pb-1 border-b-2 transition ${activeTab === 'content' ? 'text-indigo-400 border-indigo-400' : 'text-gray-400 border-transparent hover:text-white'}`}
              >
                  <Upload className="w-4 h-4 mr-2" /> Content Manager
              </button>
              <button 
                onClick={() => setActiveTab('settings')}
                className={`flex items-center text-sm font-bold pb-1 border-b-2 transition ${activeTab === 'settings' ? 'text-indigo-400 border-indigo-400' : 'text-gray-400 border-transparent hover:text-white'}`}
              >
                  <Settings className="w-4 h-4 mr-2" /> Site Settings
              </button>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-gray-800 rounded-full transition text-gray-400 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <div className="overflow-y-auto p-6 scrollbar-hide">
          {activeTab === 'content' ? (
              <form onSubmit={handleSubmitContent} className="space-y-6">
                
                {/* Content Type Switch */}
                <div className="flex space-x-4 bg-gray-800 p-1 rounded-lg w-fit">
                    <button
                        type="button"
                        onClick={() => setContentType('movie')}
                        className={`flex items-center px-4 py-2 rounded-md transition ${contentType === 'movie' ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:text-white'}`}
                    >
                        <Film className="w-4 h-4 mr-2" /> Movie
                    </button>
                    <button
                        type="button"
                        onClick={() => setContentType('series')}
                        className={`flex items-center px-4 py-2 rounded-md transition ${contentType === 'series' ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:text-white'}`}
                    >
                        <Tv className="w-4 h-4 mr-2" /> Series
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-gray-400 text-sm mb-1">Title</label>
                    <input required name="title" value={formData.title} onChange={handleContentChange} className="w-full bg-gray-800 text-white rounded p-2 border border-gray-700 focus:border-indigo-500 outline-none" placeholder="Content Title" />
                </div>
                <div>
                    <label className="block text-gray-400 text-sm mb-1">Director/Creator</label>
                    <input name="director" value={formData.director} onChange={handleContentChange} className="w-full bg-gray-800 text-white rounded p-2 border border-gray-700 focus:border-indigo-500 outline-none" placeholder="Director Name" />
                </div>
                </div>

                <div>
                <label className="block text-gray-400 text-sm mb-1">Description</label>
                <textarea name="description" value={formData.description} onChange={handleContentChange} rows={3} className="w-full bg-gray-800 text-white rounded p-2 border border-gray-700 focus:border-indigo-500 outline-none" placeholder="Plot summary..." />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-gray-400 text-sm mb-1">Poster Image</label>
                    <div className="flex gap-2">
                        <input name="imageUrl" value={formData.imageUrl} onChange={handleContentChange} className="flex-1 bg-gray-800 text-white rounded p-2 border border-gray-700 focus:border-indigo-500 outline-none text-sm" placeholder="URL or Upload ->" />
                        <input 
                            type="file" 
                            ref={fileInputRef} 
                            onChange={handleImageUpload} 
                            className="hidden" 
                            accept="image/*"
                        />
                        <button 
                            type="button" 
                            onClick={() => fileInputRef.current?.click()}
                            className="bg-gray-700 hover:bg-gray-600 px-3 rounded border border-gray-600 flex items-center justify-center text-white transition disabled:opacity-50"
                            disabled={isProcessingImg}
                        >
                            {isProcessingImg ? <Loader2 className="w-4 h-4 animate-spin" /> : <ImageIcon className="w-4 h-4" />}
                        </button>
                    </div>
                </div>
                
                {contentType === 'movie' && (
                    <div>
                        <label className="block text-gray-400 text-sm mb-1">Video URL (MP4, YouTube, Vimeo)</label>
                        <input name="videoUrl" value={formData.videoUrl} onChange={handleContentChange} className="w-full bg-gray-800 text-white rounded p-2 border border-gray-700 focus:border-indigo-500 outline-none" placeholder="https://..." />
                    </div>
                )}
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                    <label className="block text-gray-400 text-sm mb-1">Year</label>
                    <input type="number" name="year" value={formData.year} onChange={handleContentChange} className="w-full bg-gray-800 text-white rounded p-2 border border-gray-700 focus:border-indigo-500 outline-none" />
                </div>
                <div>
                    <label className="block text-gray-400 text-sm mb-1">Duration</label>
                    <input name="duration" value={formData.duration} onChange={handleContentChange} className="w-full bg-gray-800 text-white rounded p-2 border border-gray-700 focus:border-indigo-500 outline-none" placeholder={contentType === 'series' ? "Avg ep length" : "e.g. 2h 15m"} />
                </div>
                <div>
                    <label className="block text-gray-400 text-sm mb-1">Rating (0-5)</label>
                    <input type="number" step="0.1" max="5" name="rating" value={formData.rating} onChange={handleContentChange} className="w-full bg-gray-800 text-white rounded p-2 border border-gray-700 focus:border-indigo-500 outline-none" />
                </div>
                </div>

                <div>
                <label className="block text-gray-400 text-sm mb-1">Genres (comma separated)</label>
                <input name="genre" value={formData.genre?.join(', ')} onChange={(e) => handleArrayChange(e, 'genre')} className="w-full bg-gray-800 text-white rounded p-2 border border-gray-700 focus:border-indigo-500 outline-none" placeholder="Action, Drama, Sci-Fi" />
                </div>

                <div>
                <label className="block text-gray-400 text-sm mb-1">Cast (comma separated)</label>
                <input name="cast" value={formData.cast?.join(', ')} onChange={(e) => handleArrayChange(e, 'cast')} className="w-full bg-gray-800 text-white rounded p-2 border border-gray-700 focus:border-indigo-500 outline-none" placeholder="Actor 1, Actor 2" />
                </div>

                {contentType === 'series' && (
                    <div className="border-t border-gray-700 pt-6">
                        <h3 className="text-lg font-bold text-white mb-4">Episodes Management</h3>
                        
                        <div className="space-y-2 mb-4 max-h-40 overflow-y-auto">
                            {formData.episodes?.length === 0 && <p className="text-gray-500 text-sm italic">No episodes added yet.</p>}
                            {formData.episodes?.map((ep) => (
                                <div key={ep.id} className="flex items-center justify-between bg-gray-800 p-2 rounded">
                                    <div className="text-sm">
                                        <span className="text-indigo-400 font-bold mr-2">S{ep.season}:E{ep.episodeNumber}</span>
                                        <span className="text-white">{ep.title}</span>
                                    </div>
                                    <button type="button" onClick={() => handleDeleteEpisode(ep.id)} className="text-red-400 hover:text-red-300">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                        </div>

                        <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                            <div className="grid grid-cols-4 gap-2 mb-2">
                                <div>
                                    <input type="number" placeholder="Season" value={newEpisode.season} onChange={e => setNewEpisode({...newEpisode, season: Number(e.target.value)})} className="w-full bg-gray-900 text-white rounded p-2 border border-gray-700 text-sm" />
                                </div>
                                <div>
                                    <input type="number" placeholder="Ep No." value={newEpisode.episodeNumber} onChange={e => setNewEpisode({...newEpisode, episodeNumber: Number(e.target.value)})} className="w-full bg-gray-900 text-white rounded p-2 border border-gray-700 text-sm" />
                                </div>
                                <div className="col-span-2">
                                    <input placeholder="Episode Title" value={newEpisode.title} onChange={e => setNewEpisode({...newEpisode, title: e.target.value})} className="w-full bg-gray-900 text-white rounded p-2 border border-gray-700 text-sm" />
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <input placeholder="Video URL" value={newEpisode.videoUrl} onChange={e => setNewEpisode({...newEpisode, videoUrl: e.target.value})} className="flex-1 bg-gray-900 text-white rounded p-2 border border-gray-700 text-sm" />
                                <button type="button" onClick={handleAddEpisode} className="bg-green-600 hover:bg-green-700 text-white px-4 rounded font-bold text-sm flex items-center">
                                    <Plus className="w-4 h-4 mr-1" /> Add
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                <div className="pt-4 flex justify-end">
                <button type="submit" className="flex items-center px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold transition">
                    <Save className="w-4 h-4 mr-2" />
                    {movie ? 'Save Changes' : 'Upload Content'}
                </button>
                </div>
              </form>
          ) : (
              <form onSubmit={handleSubmitConfig} className="space-y-6">
                  <div className="bg-indigo-900/20 p-4 rounded-lg border border-indigo-500/30 mb-6">
                      <h3 className="text-indigo-400 font-bold mb-2">Website Branding</h3>
                      <p className="text-gray-400 text-sm">Customize how your site looks to visitors. Changes will be saved to your browser.</p>
                  </div>
                  
                  <div>
                    <label className="block text-gray-400 text-sm mb-1">Website Name</label>
                    <input required name="siteName" value={configData.siteName} onChange={handleConfigChange} className="w-full bg-gray-800 text-white rounded p-2 border border-gray-700 focus:border-indigo-500 outline-none" placeholder="e.g. My Movie Site" />
                  </div>

                  <div>
                    <label className="block text-gray-400 text-sm mb-1">Logo URL</label>
                    <input name="siteLogoUrl" value={configData.siteLogoUrl} onChange={handleConfigChange} className="w-full bg-gray-800 text-white rounded p-2 border border-gray-700 focus:border-indigo-500 outline-none" placeholder="https://example.com/logo.png" />
                    <p className="text-xs text-gray-500 mt-1">Leave empty to show text only.</p>
                  </div>

                  {/* Export Section */}
                  <div className="mt-8 border-t border-gray-700 pt-6">
                       <h4 className="text-sm font-bold text-gray-400 mb-4">Data Management</h4>
                       <div className="bg-gray-800 p-4 rounded-lg border border-gray-700 flex items-center justify-between">
                            <div>
                                <h5 className="text-white font-bold text-sm">Backup Content</h5>
                                <p className="text-gray-400 text-xs">Download all movies and settings as a JSON file.</p>
                            </div>
                            <button type="button" onClick={handleExportData} className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm font-bold flex items-center transition border border-gray-600">
                                <Download className="w-4 h-4 mr-2" /> Export
                            </button>
                       </div>
                  </div>

                  {/* Preview */}
                  <div className="mt-8 border-t border-gray-700 pt-6">
                      <h4 className="text-sm font-bold text-gray-400 mb-4">Preview Navbar</h4>
                      <div className="bg-black p-4 rounded-lg border border-gray-700 flex items-center gap-2">
                           {configData.siteLogoUrl && <img src={configData.siteLogoUrl} className="h-8 w-auto object-contain" alt="preview" />}
                           <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-600">
                                {configData.siteName || 'Site Name'}
                           </span>
                      </div>
                  </div>

                  <div className="pt-4 flex justify-end">
                    <button type="submit" className="flex items-center px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-bold transition">
                        <Save className="w-4 h-4 mr-2" />
                        Save Branding
                    </button>
                 </div>
              </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminModal;