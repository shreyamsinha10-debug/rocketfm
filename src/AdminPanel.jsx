import React, { useState, useEffect } from 'react';
import { UploadCloud, PlusCircle, Book, Music } from 'lucide-react';
import { API_BASE_URL } from './apiConfig';

// Reusable Input Component
const FormInput = ({ label, id, ...props }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-text-secondary mb-1">{label}</label>
        <input id={id} {...props} className="w-full bg-bg-secondary border border-border rounded-md px-3 py-2 text-text-primary focus:outline-none focus:ring-2 focus:ring-accent" />
    </div>
);

// Reusable File Input Component
const FileInput = ({ label, id, file, setFile, ...props }) => (
     <div>
        <label htmlFor={id} className="block text-sm font-medium text-text-secondary mb-1">{label}</label>
        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-border border-dashed rounded-md">
            <div className="space-y-1 text-center">
                <UploadCloud className="mx-auto h-12 w-12 text-text-secondary" />
                <div className="flex text-sm text-text-secondary">
                    <label htmlFor={id} className="relative cursor-pointer bg-bg-primary rounded-md font-medium text-accent hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-accent">
                        <span>Upload a file</span>
                        <input id={id} name={id} type="file" className="sr-only" onChange={(e) => setFile(e.target.files[0])} {...props} />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                </div>
                {file && <p className="text-xs text-text-secondary">{file.name}</p>}
            </div>
        </div>
    </div>
);


// Component to Create a New Category
const CreateCategoryForm = ({ setStatusMessage }) => {
    const [categoryName, setCategoryName] = useState('');
    const [categoryCode, setCategoryCode] = useState('');
    const [description, setDescription] = useState('');
    const [coverImage, setCoverImage] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!coverImage) {
            setStatusMessage({ text: 'Please select a cover image for the category.', type: 'error' });
            return;
        }

        setStatusMessage({ text: 'Creating category...', type: 'info' });

        try {
            const categoryRequest = { categoryName, categoryCode, description };
            const formData = new FormData();
            formData.append('category', new Blob([JSON.stringify(categoryRequest)], { type: 'application/json' }));
            formData.append('coverImage', coverImage);

            const response = await fetch(`${API_BASE_URL}/categories`, {
                method: 'POST',
                body: formData,
            });
            if (!response.ok) {
                const err = await response.json().catch(() => ({}));
                throw new Error(err.error || err.businessErrorDescription || 'Failed to create category');
            }
            setStatusMessage({ text: 'Category created successfully!', type: 'success' });
            setCategoryName('');
            setCategoryCode('');
            setDescription('');
            setCoverImage(null);
        } catch (error) {
            setStatusMessage({ text: error.message, type: 'error' });
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <h3 className="text-lg font-semibold text-text-primary flex items-center gap-2"><PlusCircle size={20}/> Create New Category</h3>
            <FormInput label="Category Name" id="categoryName" type="text" value={categoryName} onChange={(e) => setCategoryName(e.target.value)} required />
            <FormInput label="Category Code" id="categoryCode" type="text" value={categoryCode} onChange={(e) => setCategoryCode(e.target.value)} required />
            <FormInput label="Description" id="description" type="text" value={description} onChange={(e) => setDescription(e.target.value)} required />
            <FileInput label="Category Cover Image" id="categoryCoverImage" file={coverImage} setFile={setCoverImage} accept="image/*" required />
            <button type="submit" className="w-full bg-accent text-white font-bold py-2 px-4 rounded-md hover:bg-blue-600 transition-colors">Create Category</button>
        </form>
    );
};

// Component to Create a New Series
const CreateSeriesForm = ({ categories, setStatusMessage }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [author, setAuthor] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [coverImage, setCoverImage] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!coverImage || !categoryId) {
            setStatusMessage({ text: 'Please select a category and cover image.', type: 'error' });
            return;
        }
        setStatusMessage({ text: 'Creating series...', type: 'info' });

        const seriesRequest = { title, description, author, categoryId: parseInt(categoryId) };
        const formData = new FormData();
        formData.append('series', new Blob([JSON.stringify(seriesRequest)], { type: 'application/json' }));
        formData.append('coverImage', coverImage);
        
        try {
            const response = await fetch(`${API_BASE_URL}/series`, {
                method: 'POST',
                body: formData
            });
            if (!response.ok) throw new Error('Failed to create series');
            setStatusMessage({ text: 'Series created successfully!', type: 'success' });
            setTitle(''); setDescription(''); setAuthor(''); setCategoryId(''); setCoverImage(null);
        } catch (error) {
            setStatusMessage({ text: error.message, type: 'error' });
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <h3 className="text-lg font-semibold text-text-primary flex items-center gap-2"><Book size={20}/> Create New Series</h3>
            <FormInput label="Title" id="title" type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
            <FormInput label="Description" id="seriesDescription" type="text" value={description} onChange={(e) => setDescription(e.target.value)} required />
            <FormInput label="Author" id="author" type="text" value={author} onChange={(e) => setAuthor(e.target.value)} required />
            <div>
                <label htmlFor="category" className="block text-sm font-medium text-text-secondary mb-1">Category</label>
                <select id="category" value={categoryId} onChange={(e) => setCategoryId(e.target.value)} required className="w-full bg-bg-secondary border border-border rounded-md px-3 py-2 text-text-primary focus:outline-none focus:ring-2 focus:ring-accent">
                    <option value="">Select a category</option>
                    {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.categoryName}</option>)}
                </select>
            </div>
            <FileInput label="Cover Image" id="coverImage" file={coverImage} setFile={setCoverImage} accept="image/*" required />
            <button type="submit" className="w-full bg-accent text-white font-bold py-2 px-4 rounded-md hover:bg-blue-600 transition-colors">Create Series</button>
        </form>
    );
};

// Component to Upload an Audio Episode
const MAX_UPLOAD_MB = 100;
const MAX_UPLOAD_BYTES = MAX_UPLOAD_MB * 1024 * 1024;
const UPLOAD_TIMEOUT_MS = 5 * 60 * 1000;

const UploadAudioForm = ({ series, setStatusMessage }) => {
    const [seriesId, setSeriesId] = useState('');
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [episodeNumber, setEpisodeNumber] = useState('');
    const [audioFile, setAudioFile] = useState(null);
    const [uploading, setUploading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!audioFile || !seriesId) {
            setStatusMessage({ text: 'Please select a series and an audio file.', type: 'error' });
            return;
        }
        if (audioFile.size > MAX_UPLOAD_BYTES) {
            setStatusMessage({
                text: `File is too large (${(audioFile.size / 1024 / 1024).toFixed(1)} MB). Maximum allowed size is ${MAX_UPLOAD_MB} MB.`,
                type: 'error',
            });
            return;
        }

        setUploading(true);
        setStatusMessage({ text: 'Uploading audio...', type: 'info' });

        const formData = new FormData();
        formData.append('file', audioFile);

        const params = new URLSearchParams();
        params.append('seriesId', seriesId);
        params.append('title', title);
        params.append('description', description);
        params.append('episodeNumber', episodeNumber);
        const url = `${API_BASE_URL}/audio/upload?${params.toString()}`;

        try {
            const controller = new AbortController();
            const timeout = setTimeout(() => controller.abort(), UPLOAD_TIMEOUT_MS);

            const response = await fetch(url, {
                method: 'POST',
                body: formData,
                signal: controller.signal,
            });
            clearTimeout(timeout);

            if (!response.ok) {
                const errText = await response.text();
                let message = `Upload failed (${response.status})`;
                try {
                    const err = JSON.parse(errText);
                    message = err.error || err.businessErrorDescription || message;
                } catch {
                    if (errText && !errText.includes('<!DOCTYPE')) message = errText;
                }
                if (response.status === 413) {
                    message = `File too large (max ${MAX_UPLOAD_MB} MB on server).`;
                }
                throw new Error(message);
            }

            setStatusMessage({ text: 'Audio uploaded successfully!', type: 'success' });
            setSeriesId('');
            setTitle('');
            setDescription('');
            setEpisodeNumber('');
            setAudioFile(null);
        } catch (error) {
            const message = error.name === 'AbortError'
                ? 'Upload timed out. Try a smaller file or check your connection.'
                : error.message || 'Failed to upload audio';
            setStatusMessage({ text: message, type: 'error' });
        } finally {
            setUploading(false);
        }
    };
    
    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <h3 className="text-lg font-semibold text-text-primary flex items-center gap-2"><Music size={20}/> Upload Audio Episode</h3>
            <div>
                <label htmlFor="series" className="block text-sm font-medium text-text-secondary mb-1">Series</label>
                <select id="series" value={seriesId} onChange={(e) => setSeriesId(e.target.value)} required className="w-full bg-bg-secondary border border-border rounded-md px-3 py-2 text-text-primary focus:outline-none focus:ring-2 focus:ring-accent">
                    <option value="">Select a series</option>
                    {series.map(s => <option key={s.id} value={s.id}>{s.title}</option>)}
                </select>
            </div>
            <FormInput label="Episode Title" id="episodeTitle" type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
            <FormInput label="Episode Description" id="episodeDescription" type="text" value={description} onChange={(e) => setDescription(e.target.value)} required />
            <FormInput label="Episode Number" id="episodeNumber" type="number" value={episodeNumber} onChange={(e) => setEpisodeNumber(e.target.value)} required />
            <FileInput label="Audio File" id="audioFile" file={audioFile} setFile={setAudioFile} accept="audio/*" required />
            <button type="submit" disabled={uploading} className="w-full bg-accent text-white font-bold py-2 px-4 rounded-md hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                {uploading ? 'Uploading...' : 'Upload Audio'}
            </button>
            <p className="text-xs text-text-secondary">Max file size: {MAX_UPLOAD_MB} MB. Large uploads may take a few minutes.</p>
        </form>
    );
};


export default function AdminPanel() {
  const [theme, setTheme] = useState('dark');
  const [categories, setCategories] = useState([]);
  const [series, setSeries] = useState([]);
  const [statusMessage, setStatusMessage] = useState({ text: '', type: '' });

  // Fetch initial data for dropdowns
  useEffect(() => {
    const fetchData = async () => {
        try {
            const [catResponse, seriesResponse] = await Promise.all([
                fetch(`${API_BASE_URL}/categories`),
                fetch(`${API_BASE_URL}/series`)
            ]);
            const catData = await catResponse.json();
            const seriesData = await seriesResponse.json();
            setCategories(catData);
            setSeries(seriesData);
        } catch (error) {
            setStatusMessage({ text: 'Failed to load initial data.', type: 'error' });
        }
    };
    fetchData();
  }, []);
  
  // Effect to clear status message after a few seconds (keep errors longer)
  useEffect(() => {
    if (statusMessage.text) {
        const delay = statusMessage.type === 'error' ? 12000 : 5000;
        const timer = setTimeout(() => setStatusMessage({ text: '', type: '' }), delay);
        return () => clearTimeout(timer);
    }
  }, [statusMessage]);

  return (
    <div className="dark"> {/* Admin panel is always dark for consistency */}
      <style>{`
        :root {
          --color-bg-primary: #ffffff; --color-bg-secondary: #f3f4f6; --color-bg-hover: #e5e7eb; --color-text-primary: #111827; --color-text-secondary: #6b7280; --color-border: #d1d5db; --color-accent: #3b82f6;
        }
        .dark {
          --color-bg-primary: #111827; --color-bg-secondary: #1f2937; --color-bg-hover: #374151; --color-text-primary: #ffffff; --color-text-secondary: #9ca3af; --color-border: #374151; --color-accent: #3b82f6;
        }
        .bg-bg-primary { background-color: var(--color-bg-primary); }
        .bg-bg-secondary { background-color: var(--color-bg-secondary); }
        .text-text-primary { color: var(--color-text-primary); }
        .text-text-secondary { color: var(--color-text-secondary); }
        .border-border { border-color: var(--color-border); }
        .text-accent { color: var(--color-accent); }
        .bg-accent { background-color: var(--color-accent); }
      `}</style>
      <div className="bg-bg-secondary min-h-screen font-sans text-text-primary p-4 sm:p-8">
        <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-text-primary mb-2">RocketFM Admin Panel</h1>
            <p className="text-text-secondary mb-8">Use the forms below to add new content to the platform.</p>

            {statusMessage.text && (
                <div className={`p-4 rounded-md mb-6 ${
                    statusMessage.type === 'success' ? 'bg-green-500/20 text-green-300' : 
                    statusMessage.type === 'error' ? 'bg-red-500/20 text-red-300' : 'bg-blue-500/20 text-blue-300'
                }`}>
                    {statusMessage.text}
                </div>
            )}

            <div className="grid md:grid-cols-3 gap-8">
                <div className="md:col-span-1 bg-bg-primary p-6 rounded-lg shadow-lg">
                    <CreateCategoryForm setStatusMessage={setStatusMessage} />
                </div>
                <div className="md:col-span-2 space-y-8">
                    <div className="bg-bg-primary p-6 rounded-lg shadow-lg">
                        <CreateSeriesForm categories={categories} setStatusMessage={setStatusMessage} />
                    </div>
                    <div className="bg-bg-primary p-6 rounded-lg shadow-lg">
                       <UploadAudioForm series={series} setStatusMessage={setStatusMessage} />
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}
