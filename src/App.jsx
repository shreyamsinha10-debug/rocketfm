import React, { useState, useRef, useEffect } from 'react';
import { Search, ChevronDown, Menu, X, PlayCircle, PauseCircle, Mic, BookOpen, HeartPulse, Home, Radio, ListMusic, Plus, Clock, User, SkipBack, SkipForward, Volume2, Sun, Moon, Music, BarChart2, History, Calendar, PlusCircle, ArrowLeft } from 'lucide-react';
import { API_BASE_URL, proxyAssetUrl } from './apiConfig';

const normalizeSeries = (series) => ({
  ...series,
  coverImage: proxyAssetUrl(series.coverImage),
});

// Mock Data as a fallback in case of API failure
const mockData = {
  topCharts: [
       { id: 7, title: 'Cyberpunk Dreams', author: 'Sci-Fi Series', coverImage: 'https://images.unsplash.com/photo-1593432274231-fa6273e11b8a?q=80&w=400&auto=format&fit=crop' },
       { id: 8, title: 'Misty Mountains', author: 'Fantasy Audiobook', coverImage: 'https://images.unsplash.com/photo-1454496522488-7a8e488e8606?q=80&w=400&auto=format&fit=crop' },
  ],
  upcoming: [
      { id: 10, title: 'Learn to Code', categoryName: 'Education', coverImage: 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?q=80&w=400&auto=format&fit=crop' },
  ],
  topArtists: [
      { id: 1, author: 'CyberVoice' },
      { id: 2, author: 'StoryTeller' },
  ]
};

// ####################################################################
// # UI COMPONENTS
// ####################################################################

const ContentCard = ({ item, onSelectSeries }) => (
  <div className="flex-shrink-0 w-40 sm:w-48 group cursor-pointer" onClick={() => onSelectSeries(item)}>
    <div className="relative mb-2">
      <img src={proxyAssetUrl(item.coverImage) || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=400&auto=format&fit=crop'} alt={item.title} className="w-full h-48 object-cover rounded-md shadow-lg transition-transform duration-300 group-hover:scale-105" />
    </div>
    <div>
        <h3 className="font-semibold text-base text-text-primary truncate">{item.title}</h3>
        <p className="text-sm text-text-secondary mt-1">{item.author}</p>
    </div>
  </div>
);

const UpcomingCard = ({ item, onSelectSeries }) => (
    <div className="relative group rounded-lg overflow-hidden cursor-pointer" onClick={() => onSelectSeries(item)}>
        <img src={proxyAssetUrl(item.coverImage) || 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?q=80&w=400&auto=format&fit=crop'} alt={item.title} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"/>
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
        <div className="absolute bottom-0 left-0 p-4">
            <h3 className="font-bold text-lg text-white">{item.title}</h3>
            <p className="text-sm text-gray-300">{item.categoryName}</p>
        </div>
    </div>
);

const ArtistListItem = ({ artist, rank }) => (
    <div className="flex items-center justify-between p-2 rounded-md hover:bg-bg-hover">
        <div className="flex items-center gap-4">
            <span className="text-text-secondary font-bold w-4">{rank}</span>
            <img src={`https://i.pravatar.cc/100?u=${artist.author}`} alt={artist.author} className="w-12 h-12 rounded-full"/>
            <div>
                <p className="font-semibold text-text-primary">{artist.author}</p>
            </div>
        </div>
        <div className="flex items-center gap-4">
            <button className="text-accent border border-accent rounded-full px-4 py-1 text-sm font-semibold hover:bg-accent hover:text-white transition-colors">Follow</button>
        </div>
    </div>
);

const ContentCarousel = ({ title, data, onSelectSeries }) => (
  <section className="py-6">
      <h2 className="text-2xl font-bold text-text-primary tracking-tight mb-4">{title}</h2>
      <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide -mx-4 px-4">
        {data.map(item => <ContentCard key={item.id} item={item} onSelectSeries={onSelectSeries} />)}
      </div>
  </section>
);

const Header = ({ toggleSidebar, theme, toggleTheme }) => (
    <header className="sticky top-0 z-40 flex-shrink-0 bg-bg-primary/70 backdrop-blur-md border-b border-border">
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-4">
            <button onClick={toggleSidebar} className="lg:hidden text-text-primary"><Menu size={24} /></button>
            <a href="/" className="text-2xl font-bold text-text-primary tracking-tighter"><span className="text-accent">Rocket</span><span>FM</span></a>
        </div>
        <div className="flex-1 max-w-md mx-4"><div className="relative"><Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary"/><input type="text" placeholder="Search..." className="bg-bg-secondary w-full rounded-full pl-10 pr-4 py-2 text-text-primary focus:outline-none focus:ring-2 focus:ring-accent"/></div></div>
        <div className="flex items-center gap-4">
            <button onClick={toggleTheme} className="text-text-primary">{theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}</button>
            <button className="bg-bg-secondary text-text-primary rounded-full p-1 flex items-center gap-2 pr-2"><div className="w-8 h-8 bg-bg-hover rounded-full flex items-center justify-center"><User size={18} /></div><span className="text-sm font-semibold hidden sm:block">Alex</span><ChevronDown size={16} className="hidden sm:block"/></button>
        </div>
      </div>
    </header>
);

const Sidebar = ({ isOpen, setIsOpen }) => (
    <aside className={`fixed top-0 left-0 h-full bg-bg-primary border-r border-border text-text-secondary p-6 space-y-4 z-50 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:relative lg:translate-x-0 lg:w-64 transition-transform duration-300 flex flex-col`}>
        <div className="flex justify-between items-center lg:hidden"><a href="/" className="text-2xl font-bold text-text-primary tracking-tighter"><span className="text-accent">Rocket</span><span>FM</span></a><button onClick={() => setIsOpen(false)} className="text-text-primary"><X size={24} /></button></div>
        <nav className="space-y-1 pt-12"><a href="#" className="flex items-center gap-4 px-3 py-2 rounded-md text-sm font-bold bg-bg-hover text-text-primary"><Home size={20} /> Home</a><a href="#" className="flex items-center gap-4 px-3 py-2 rounded-md text-sm font-bold hover:bg-bg-hover hover:text-text-primary transition-colors"><Radio size={20} /> Genres</a><a href="#" className="flex items-center gap-4 px-3 py-2 rounded-md text-sm font-bold hover:bg-bg-hover hover:text-text-primary transition-colors"><Music size={20} /> Music</a></nav>
        <div className="mt-auto"><a href="/admin" className="w-full bg-accent text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2 hover:bg-blue-600 transition-colors"><Music size={20} /> Admin Panel</a></div>
    </aside>
);

const AudioPlayer = ({ currentEpisode, currentSeries, isPlaying, onPlayPause, audioRef, progress, duration, onTimeUpdate, onLoadedMetadata, onEnded }) => {
    const formatTime = (time) => {
        if (isNaN(time)) return '0:00';
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    const handleProgressChange = (e) => { audioRef.current.currentTime = e.target.value; };
    if (!currentEpisode || !currentSeries) return null;

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-bg-primary/70 backdrop-blur-md border-t border-border h-24 z-50 text-text-primary">
            <audio ref={audioRef} src={`${API_BASE_URL}/audio/stream/${currentEpisode.id}`} onTimeUpdate={onTimeUpdate} onLoadedMetadata={onLoadedMetadata} onEnded={onEnded}></audio>
            <div className="container mx-auto h-full flex items-center justify-between px-4">
                <div className="flex items-center gap-4 w-1/4">
                    <img src={proxyAssetUrl(currentSeries.coverImage)} alt={currentSeries.title} className="w-14 h-14 rounded-md" />
                    <div><p className="font-bold text-sm">{currentEpisode.title}</p><p className="text-xs text-text-secondary">{currentSeries.title}</p></div>
                </div>
                <div className="flex flex-col items-center justify-center gap-2 w-1/2">
                    <div className="flex items-center gap-6"><button className="text-text-secondary hover:text-text-primary"><SkipBack size={20} /></button><button onClick={onPlayPause} className="bg-text-primary text-bg-primary rounded-full p-2 hover:scale-105">{isPlaying ? <PauseCircle size={28} className="fill-current" /> : <PlayCircle size={28} className="fill-current" />}</button><button className="text-text-secondary hover:text-text-primary"><SkipForward size={20} /></button></div>
                    <div className="flex items-center gap-2 w-full max-w-lg"><span className="text-xs text-text-secondary">{formatTime(progress)}</span><input type="range" min="0" max={duration || 0} value={progress} onChange={handleProgressChange} className="w-full h-1 bg-bg-hover rounded-lg appearance-none cursor-pointer accent-accent" /><span className="text-xs text-text-secondary">{formatTime(duration)}</span></div>
                </div>
                <div className="flex items-center gap-2 w-1/4 justify-end"><Volume2 size={20} /><input type="range" min="0" max="1" step="0.01" className="w-24 h-1 bg-bg-hover rounded-lg appearance-none cursor-pointer accent-white" onChange={(e) => audioRef.current.volume = e.target.value} /></div>
            </div>
        </div>
    );
};

// ####################################################################
// # VIEWS / PAGES
// ####################################################################

function SeriesDetailView({ series, onPlayEpisode, onBack }) {
    const [episodes, setEpisodes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchEpisodes = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await fetch(`${API_BASE_URL}/episodes/series/${series.id}`);
                if (!response.ok) throw new Error('Failed to fetch episodes');
                const data = await response.json();
                setEpisodes(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchEpisodes();
    }, [series.id]);

    return (
        <main className="p-4 sm:p-6">
            <button onClick={onBack} className="flex items-center gap-2 text-text-secondary font-semibold mb-6 hover:text-text-primary">
                <ArrowLeft size={20} /> Back to Home
            </button>
            <div className="flex flex-col md:flex-row gap-8">
                <div className="md:w-1/3 flex-shrink-0">
                    <img src={proxyAssetUrl(series.coverImage)} alt={series.title} className="w-full h-auto rounded-lg shadow-lg" />
                    <h1 className="text-3xl font-bold text-text-primary mt-4">{series.title}</h1>
                    <p className="text-text-secondary mt-2">{series.author}</p>
                    <p className="text-sm text-text-secondary mt-4">{series.description}</p>
                </div>
                <div className="md:w-2/3">
                    <h2 className="text-2xl font-bold text-text-primary mb-4">Episodes</h2>
                    {loading && <p>Loading episodes...</p>}
                    {error && <p className="text-red-500">{error}</p>}
                    <div className="space-y-2">
                        {episodes.map(episode => (
                            <div key={episode.id} className="flex items-center justify-between p-3 bg-bg-secondary rounded-md hover:bg-bg-hover">
                                <div className="flex items-center gap-4">
                                    <span className="text-text-secondary font-mono text-sm">{episode.episodeNumber}</span>
                                    <div>
                                        <p className="font-semibold text-text-primary">{episode.title}</p>
                                        <p className="text-xs text-text-secondary">{episode.description}</p>
                                    </div>
                                </div>
                                <button onClick={() => onPlayEpisode(episode)} className="text-accent hover:text-blue-400">
                                    <PlayCircle size={28} />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </main>
    );
}

function MainContentView({ onSelectSeries }) {
    const [topCharts, setTopCharts] = useState([]);
    const [upcoming, setUpcoming] = useState([]);
    const [topArtists, setTopArtists] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try { setLoading(true); setError(null);
                const response = await fetch(`${API_BASE_URL}/series`);
                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                const data = (await response.json()).map(normalizeSeries);
                setTopCharts(data.slice(0, 5));
                setUpcoming(data.slice(5, 7));
                const artists = data.reduce((acc, series) => {
                    if (!acc.find(a => a.author === series.author)) acc.push(series);
                    return acc;
                }, []);
                setTopArtists(artists.slice(0, 4));
            } catch (error) {
                console.error("Failed to fetch data:", error);
                setError("Could not load live data. Showing sample content.");
                setTopCharts(mockData.topCharts); setUpcoming(mockData.upcoming); setTopArtists(mockData.topArtists);
            } finally { setLoading(false); }
        };
        fetchData();
    }, []);

    return (
        <main className="p-4 sm:p-6">
            {loading && <p>Loading...</p>}
            {error && <p className="text-red-500 mb-4">{error}</p>}
            {!loading && (
                <>
                    <ContentCarousel title="Top Charts" data={topCharts} onSelectSeries={onSelectSeries} />
                    <section className="py-6"><h2 className="text-2xl font-bold text-text-primary tracking-tight mb-4">Upcoming Events</h2><div className="grid md:grid-cols-2 gap-6">{upcoming.map(item => <UpcomingCard key={item.id} item={item} onSelectSeries={onSelectSeries}/>)}</div></section>
                    <section className="py-6"><h2 className="text-2xl font-bold text-text-primary tracking-tight mb-4">Top Artists</h2><div className="space-y-2">{topArtists.map((artist, index) => <ArtistListItem key={artist.id || index} artist={artist} rank={index + 1}/>)}</div></section>
                </>
            )}
        </main>
    );
}

// ####################################################################
// # ROOT APP COMPONENT
// ####################################################################

export default function App() {
  const [theme, setTheme] = useState('dark');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  const [selectedSeries, setSelectedSeries] = useState(null);
  const [currentEpisode, setCurrentEpisode] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef(null);

  useEffect(() => { document.documentElement.classList.toggle('dark', theme === 'dark'); }, [theme]);
  const toggleTheme = () => setTheme(theme === 'dark' ? 'light' : 'dark');
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  useEffect(() => {
    if (currentEpisode) {
        if (isPlaying) audioRef.current.play().catch(e => console.error("Audio play failed:", e));
        else audioRef.current.pause();
    }
  }, [isPlaying, currentEpisode]);

  const handlePlayEpisode = (episode) => {
    if (currentEpisode?.id === episode.id) {
        setIsPlaying(!isPlaying);
    } else {
        setCurrentEpisode(episode);
        setIsPlaying(true);
    }
  };

  const handlePlayPause = () => { if(currentEpisode) setIsPlaying(!isPlaying); };
  const handleTimeUpdate = () => { if (audioRef.current) setProgress(audioRef.current.currentTime); };
  const handleLoadedMetadata = () => { if (audioRef.current) setDuration(audioRef.current.duration); };

  return (
    <div className={`${theme}`}>
      <style>{`
        :root { --color-bg-primary: #ffffff; --color-bg-secondary: #f3f4f6; --color-bg-hover: #e5e7eb; --color-text-primary: #111827; --color-text-secondary: #6b7280; --color-border: #d1d5db; --color-accent: #3b82f6; }
        .dark { --color-bg-primary: #111827; --color-bg-secondary: #1f2937; --color-bg-hover: #374151; --color-text-primary: #ffffff; --color-text-secondary: #9ca3af; --color-border: #374151; --color-accent: #3b82f6; }
        .bg-bg-primary { background-color: var(--color-bg-primary); } .bg-bg-secondary { background-color: var(--color-bg-secondary); } .bg-bg-hover { background-color: var(--color-bg-hover); }
        .text-text-primary { color: var(--color-text-primary); } .text-text-secondary { color: var(--color-text-secondary); } .border-border { border-color: var(--color-border); }
        .text-accent { color: var(--color-accent); } .border-accent { border-color: var(--color-accent); } .accent-accent { accent-color: var(--color-accent); } .bg-accent { background-color: var(--color-accent); }
        .hover\\:bg-accent:hover { background-color: var(--color-accent); } .focus\\:ring-accent:focus { --tw-ring-color: var(--color-accent); }
        .scrollbar-hide::-webkit-scrollbar { display: none; } .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
      <div className="bg-bg-primary min-h-screen font-sans text-text-primary">
        <div className="flex">
          <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
          <div className="flex-1 min-w-0 pb-24">
              <Header toggleSidebar={toggleSidebar} theme={theme} toggleTheme={toggleTheme} />
              {selectedSeries ? (
                  <SeriesDetailView 
                    series={selectedSeries}
                    onPlayEpisode={handlePlayEpisode}
                    onBack={() => setSelectedSeries(null)}
                  />
              ) : (
                  <MainContentView onSelectSeries={setSelectedSeries} />
              )}
          </div>
        </div>
        <AudioPlayer 
          currentEpisode={currentEpisode}
          currentSeries={selectedSeries}
          isPlaying={isPlaying} 
          onPlayPause={handlePlayPause}
          onEnded={() => setIsPlaying(false)}
          audioRef={audioRef}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          progress={progress}
          duration={duration}
        />
      </div>
    </div>
  );
}
