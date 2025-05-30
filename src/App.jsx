import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './index.css';

function App() {
  const navigate = useNavigate();
  const [theme, setTheme] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const [lastTheme, setLastTheme] = useState('');
  const [copyFeedback, setCopyFeedback] = useState('');
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [language, setLanguage] = useState('IT');
  const [tone, setTone] = useState('friendly');
  const [showFeedback, setShowFeedback] = useState(false);
   const [feedbackRating, setFeedbackRating] = useState(0);
   const [feedbackComment, setFeedbackComment] = useState('');
   
   // Inline editing states
   const [editingCaption, setEditingCaption] = useState(false);
   const [editingIdeas, setEditingIdeas] = useState({});
   const [editingHashtags, setEditingHashtags] = useState(false);
   const [editedCaption, setEditedCaption] = useState('');
   const [editedIdeas, setEditedIdeas] = useState({});
   const [editedHashtags, setEditedHashtags] = useState('');
   
   // AI suggestions and batch mode
   const [showSuggestions, setShowSuggestions] = useState(false);
   const [batchMode, setBatchMode] = useState(false);
   const [batchThemes, setBatchThemes] = useState(['']);
   const [batchResults, setBatchResults] = useState([]);
   const [batchLoading, setBatchLoading] = useState(false);

  // Enhanced effects and animations
  useEffect(() => {
    // Entrance animation
    setTimeout(() => setIsVisible(true), 100);
    
    // Load history from localStorage
    const savedHistory = localStorage.getItem('socialCreatorHistory');
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    }
  }, []);

  const translatePrompt = (text, targetLang) => {
    // Traduzioni semplici per il prompt di base
    const translations = {
      'IT': {
        basePrompt: 'Genera contenuti social per il tema:',
        errorMsg: 'Si è verificato un errore durante la generazione del contenuto. Riprova più tardi.',
        emptyThemeMsg: 'Inserisci un tema o parola chiave'
      },
      'EN': {
        basePrompt: 'Generate social content for the theme:',
        errorMsg: 'An error occurred while generating content. Please try again later.',
        emptyThemeMsg: 'Please enter a theme or keyword'
      }
    };
    
    // Auto-translate common words if language doesn't match input
    let translatedText = text;
    if (targetLang === 'EN' && /[àèéìíîòóùú]/.test(text)) {
      // Italian to English common translations
      const itToEn = {
        'palestra': 'gym', 'fitness': 'fitness', 'allenamento': 'workout',
        'cibo': 'food', 'cucina': 'cooking', 'ricetta': 'recipe',
        'viaggio': 'travel', 'vacanza': 'vacation', 'mare': 'sea',
        'montagna': 'mountain', 'città': 'city', 'natura': 'nature',
        'moda': 'fashion', 'stile': 'style', 'bellezza': 'beauty',
        'tecnologia': 'technology', 'business': 'business', 'lavoro': 'work'
      };
      Object.keys(itToEn).forEach(it => {
        translatedText = translatedText.replace(new RegExp(`\\b${it}\\b`, 'gi'), itToEn[it]);
      });
    } else if (targetLang === 'IT' && !/[àèéìíîòóùú]/.test(text)) {
      // English to Italian common translations
      const enToIt = {
        'gym': 'palestra', 'fitness': 'fitness', 'workout': 'allenamento',
        'food': 'cibo', 'cooking': 'cucina', 'recipe': 'ricetta',
        'travel': 'viaggio', 'vacation': 'vacanza', 'sea': 'mare',
        'mountain': 'montagna', 'city': 'città', 'nature': 'natura',
        'fashion': 'moda', 'style': 'stile', 'beauty': 'bellezza',
        'technology': 'tecnologia', 'business': 'business', 'work': 'lavoro'
      };
      Object.keys(enToIt).forEach(en => {
        translatedText = translatedText.replace(new RegExp(`\\b${en}\\b`, 'gi'), enToIt[en]);
      });
    }
    
    return {
      translatedText: translatedText,
      basePrompt: translations[targetLang].basePrompt,
      errorMsg: translations[targetLang].errorMsg,
      emptyThemeMsg: translations[targetLang].emptyThemeMsg
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!theme.trim()) {
      const { emptyThemeMsg } = translatePrompt('', language);
      setError(emptyThemeMsg);
      return;
    }
    
    setLoading(true);
    setError(null);
    setLastTheme(theme);
    
    try {
      // Traduci il prompt in base alla lingua selezionata
      const { translatedText, basePrompt } = translatePrompt(theme, language);
      
      const response = await fetch('https://car235.pythonanywhere.com/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
           theme: translatedText,
           language: language.toLowerCase(),
           basePrompt: basePrompt,
           tone: tone
         }),
      });
      
      if (!response.ok) {
        throw new Error('Server response error');
      }
      
      const data = await response.json();
      setResults(data);
      
      // Save to history
      const newHistoryItem = {
        id: Date.now(),
        theme: theme,
        results: data,
        timestamp: new Date().toLocaleString(),
        language: language
      };
      
      const updatedHistory = [newHistoryItem, ...history].slice(0, 5);
      setHistory(updatedHistory);
      localStorage.setItem('socialCreatorHistory', JSON.stringify(updatedHistory));
      
      // Show feedback modal after successful generation
       setTimeout(() => setShowFeedback(true), 1000);
       
       // Scroll to results with animation
       setTimeout(() => {
         const resultsElement = document.getElementById('generated-results');
         if (resultsElement) {
           resultsElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
         }
       }, 500);
      
    } catch (err) {
      const { errorMsg } = translatePrompt('', language);
      setError(errorMsg);
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };
  
  const handleRegenerate = async () => {
    if (!lastTheme) {
      setError('No previous theme to regenerate');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('http://localhost:5000/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ theme: lastTheme }),
      });
      
      if (!response.ok) {
        throw new Error('Server response error');
      }
      
      const data = await response.json();
      setResults(data);
      
      // Save to history
      const newHistoryItem = {
        id: Date.now(),
        theme: lastTheme,
        results: data,
        timestamp: new Date().toLocaleString()
      };
      
      const updatedHistory = [newHistoryItem, ...history].slice(0, 5);
      setHistory(updatedHistory);
      localStorage.setItem('socialCreatorHistory', JSON.stringify(updatedHistory));
      
      // Show feedback modal after successful generation
       setTimeout(() => setShowFeedback(true), 1000);
       
       // Scroll to results with animation
       setTimeout(() => {
         const resultsElement = document.getElementById('generated-results');
         if (resultsElement) {
           resultsElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
         }
       }, 500);
      
    } catch (err) {
      console.error('Error:', err);
      setError('Failed to regenerate content. Please check if the server is running.');
    } finally {
      setLoading(false);
    }
  };
  
  const copyToClipboard = async (text, type) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopyFeedback(type);
      setTimeout(() => setCopyFeedback(''), 1000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };
  
  const loadFromHistory = (historyItem) => {
    setResults(historyItem.results);
    setTheme(historyItem.theme);
    setLastTheme(historyItem.theme);
  };
  
  const downloadContent = (format) => {
    if (!results) return;
    
    const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
    const filename = `social-content-${timestamp}.${format}`;
    
    let content = '';
    
    if (format === 'txt') {
      content = `SOCIAL MEDIA CONTENT\n`;
      content += `Generated on: ${new Date().toLocaleString()}\n`;
      content += `Theme: ${lastTheme}\n\n`;
      content += `CAPTION:\n${results.caption}\n\n`;
      content += `POST IDEAS:\n${results.post_ideas.map((idea, i) => `${i + 1}. ${idea}`).join('\n')}\n\n`;
      content += `HASHTAGS:\n${results.hashtags.join(' ')}`;
    } else if (format === 'csv') {
      content = 'Type,Content\n';
      content += `"Caption","${results.caption.replace(/"/g, '""')}"\n`;
      results.post_ideas.forEach((idea, i) => {
        content += `"Post Idea ${i + 1}","${idea.replace(/"/g, '""')}"\n`;
      });
      content += `"Hashtags","${results.hashtags.join(' ').replace(/"/g, '""')}"`;
    }
    
    const blob = new Blob([content], { type: format === 'csv' ? 'text/csv' : 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  
  const getTrendingIndicator = (hashtag) => {
    // Lista di hashtag popolari/trending (simulazione)
    const trendingHashtags = [
      '#viral', '#trending', '#fyp', '#explore', '#love', '#instagood', 
      '#photooftheday', '#fashion', '#beautiful', '#happy', '#cute', 
      '#tbt', '#like4like', '#followme', '#picoftheday', '#follow', 
      '#me', '#selfie', '#summer', '#art', '#instadaily', '#friends', 
      '#repost', '#nature', '#girl', '#fun', '#style', '#smile', 
      '#food', '#instalike', '#family', '#travel', '#fitness', '#motivation'
    ];
    
    const hashtagLower = hashtag.toLowerCase();
    if (trendingHashtags.includes(hashtagLower)) {
      return '🔥';
    }
    
    // Logica aggiuntiva per hashtag con molte lettere (spesso popolari)
    if (hashtag.length <= 8 && hashtag.length >= 4) {
      return '⭐';
    }
    
    return '';
    };
    
    // Inline editing functions
    const startEditingCaption = () => {
      setEditingCaption(true);
      setEditedCaption(results.caption);
    };
    
    const saveEditedCaption = () => {
      setResults(prev => ({ ...prev, caption: editedCaption }));
      setEditingCaption(false);
    };
    
    const startEditingIdea = (index) => {
      setEditingIdeas(prev => ({ ...prev, [index]: true }));
      setEditedIdeas(prev => ({ ...prev, [index]: results.post_ideas[index] }));
    };
    
    const saveEditedIdea = (index) => {
      const newIdeas = [...results.post_ideas];
      newIdeas[index] = editedIdeas[index];
      setResults(prev => ({ ...prev, post_ideas: newIdeas }));
      setEditingIdeas(prev => ({ ...prev, [index]: false }));
    };
    
    const startEditingHashtags = () => {
      setEditingHashtags(true);
      setEditedHashtags(results.hashtags.join(' '));
    };
    
    const saveEditedHashtags = () => {
      const hashtagArray = editedHashtags.split(' ').filter(tag => tag.trim());
      setResults(prev => ({ ...prev, hashtags: hashtagArray }));
      setEditingHashtags(false);
    };
    
    // AI suggestions
    const aiSuggestions = {
      'IT': ['fitness', 'cucina', 'viaggio', 'moda', 'tecnologia', 'business', 'natura', 'arte', 'musica', 'sport'],
      'EN': ['fitness', 'cooking', 'travel', 'fashion', 'technology', 'business', 'nature', 'art', 'music', 'sports']
    };
    
    const selectSuggestion = (suggestion) => {
      setTheme(suggestion);
      setShowSuggestions(false);
    };
    
    // Batch processing
    const addBatchTheme = () => {
      setBatchThemes(prev => [...prev, '']);
    };
    
    const removeBatchTheme = (index) => {
      setBatchThemes(prev => prev.filter((_, i) => i !== index));
    };
    
    const updateBatchTheme = (index, value) => {
      setBatchThemes(prev => prev.map((theme, i) => i === index ? value : theme));
    };
    
    const processBatch = async () => {
      const validThemes = batchThemes.filter(t => t.trim());
      if (validThemes.length === 0) return;
      
      setBatchLoading(true);
      setBatchResults([]);
      
      try {
        const results = [];
        for (const batchTheme of validThemes) {
          const { translatedText, basePrompt } = translatePrompt(batchTheme, language);
          
          const response = await fetch('/api/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
              theme: translatedText,
              language: language.toLowerCase(),
              basePrompt: basePrompt,
              tone: tone
            }),
          });
          
          if (response.ok) {
            const data = await response.json();
            results.push({ theme: batchTheme, ...data });
          }
        }
        setBatchResults(results);
      } catch (error) {
        console.error('Batch processing error:', error);
      } finally {
        setBatchLoading(false);
      }
    };
    
    const shareToSocial = (platform, content) => {
     const text = `${content.caption}\n\n${content.post_ideas.join('\n\n')}\n\n${content.hashtags.join(' ')}`;
     
     if (platform === 'instagram') {
       // Instagram doesn't support direct URL sharing, copy to clipboard instead
       copyToClipboard(text, language === 'IT' ? 'Contenuto per Instagram' : 'Instagram Content');
       alert(language === 'IT' ? 'Contenuto copiato! Aprire Instagram e incollare.' : 'Content copied! Open Instagram and paste.');
     } else if (platform === 'linkedin') {
       const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}&summary=${encodeURIComponent(text)}`;
       window.open(linkedinUrl, '_blank');
     } else if (platform === 'native' && navigator.share) {
       navigator.share({
         title: language === 'IT' ? 'Contenuto Social Generato' : 'Generated Social Content',
         text: text,
         url: window.location.href
       }).catch(console.error);
     } else {
       // Fallback: copy to clipboard
       copyToClipboard(text, language === 'IT' ? 'Contenuto Social' : 'Social Content');
     }
   };
   
   const submitFeedback = () => {
     const feedback = {
       rating: feedbackRating,
       comment: feedbackComment,
       timestamp: new Date().toISOString(),
       theme: lastTheme,
       language: language,
       tone: tone
     };
     
     // Save feedback locally
     const existingFeedback = JSON.parse(localStorage.getItem('userFeedback') || '[]');
     existingFeedback.push(feedback);
     localStorage.setItem('userFeedback', JSON.stringify(existingFeedback));
     
     // Reset feedback form
     setShowFeedback(false);
     setFeedbackRating(0);
     setFeedbackComment('');
     
     // Show thank you message
     setCopyFeedback(language === 'IT' ? 'Grazie per il feedback!' : 'Thank you for your feedback!');
     setTimeout(() => setCopyFeedback(''), 3000);
   };

  return (
    <div className={`min-h-screen relative overflow-hidden bg-black transition-all duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      {/* Enhanced Dynamic Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-800"></div>
      <div className="absolute inset-0 bg-gradient-to-tr from-blue-950/30 via-transparent to-purple-950/30"></div>
      <div className="absolute inset-0 bg-gradient-to-bl from-transparent via-indigo-950/20 to-transparent"></div>
      
      {/* Galaxy Particles Background */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Floating Particles */}
        {[...Array(40)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full opacity-20"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${3 + Math.random() * 4}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 5}s`
            }}
          />
        ))}
        
        {/* Larger Glowing Particles */}
        {[...Array(15)].map((_, i) => (
          <div
            key={`glow-${i}`}
            className="absolute w-2 h-2 bg-gradient-to-r from-blue-400/30 to-purple-400/30 rounded-full blur-sm"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `floatSlow ${5 + Math.random() * 6}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 8}s`
            }}
          />
        ))}
        
        {/* Constellation Lines */}
        <svg className="absolute inset-0 w-full h-full opacity-10">
          <defs>
            <linearGradient id="appLineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.1" />
            </linearGradient>
          </defs>
          {[...Array(6)].map((_, i) => (
            <line
              key={`line-${i}`}
              x1={`${Math.random() * 100}%`}
              y1={`${Math.random() * 100}%`}
              x2={`${Math.random() * 100}%`}
              y2={`${Math.random() * 100}%`}
              stroke="url(#appLineGradient)"
              strokeWidth="1"
              className="animate-pulse"
              style={{
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 2}s`
              }}
            />
          ))}
        </svg>
      </div>
      
      {/* Advanced Animated Elements */}
      <div className="absolute inset-0">
        <div 
          className="absolute w-96 h-96 bg-gradient-to-r from-blue-600/15 to-purple-600/15 rounded-full blur-3xl transition-all duration-700 ease-out"
          style={{
            left: '20%',
            top: '30%',
            transform: `translate(-50%, -50%) scale(1)`,
            opacity: 0.6 + Math.sin(Date.now() / 3000) * 0.2
          }}
        ></div>
        <div 
          className="absolute top-1/3 right-1/3 w-64 h-64 bg-gradient-to-r from-indigo-600/12 to-cyan-600/12 rounded-full blur-2xl animate-pulse"
          style={{
            transform: `translateY(0px) rotate(0deg)`
          }}
        ></div>
        <div 
          className="absolute bottom-1/3 left-1/3 w-72 h-72 bg-gradient-to-r from-purple-600/10 to-pink-600/10 rounded-full blur-2xl"
          style={{
            transform: `translateY(0px) scale(${1 + Math.sin(Date.now() / 4000) * 0.1})`
          }}
        ></div>
      </div>

      {/* Enhanced Grid Pattern with Animation */}
      <div 
        className="absolute inset-0 opacity-[0.03] transition-opacity duration-1000"
        style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.4) 1px, transparent 0)',
          backgroundSize: '60px 60px',
          transform: `translateY(0px)`
        }}
      ></div>
      
      {/* Floating Orbs */}
      <div className="absolute inset-0 pointer-events-none">
        <div 
          className="absolute w-2 h-2 bg-blue-400/30 rounded-full animate-pulse"
          style={{
            top: '20%',
            left: '10%',
            animationDelay: '0s',
            transform: `translateY(${Math.sin(Date.now() / 2000) * 20}px)`
          }}
        ></div>
        <div 
          className="absolute w-1 h-1 bg-purple-400/40 rounded-full animate-pulse"
          style={{
            top: '60%',
            right: '15%',
            animationDelay: '1s',
            transform: `translateY(${Math.cos(Date.now() / 2500) * 15}px)`
          }}
        ></div>
        <div 
          className="absolute w-1.5 h-1.5 bg-cyan-400/25 rounded-full animate-pulse"
          style={{
            bottom: '30%',
            left: '80%',
            animationDelay: '2s',
            transform: `translateY(${Math.sin(Date.now() / 3000) * 25}px)`
          }}
        ></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 py-16">
        {/* Navigation */}
        <nav className="flex justify-between items-center mb-8">
          <button
            onClick={() => navigate('/')}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-800/50 hover:bg-gray-700/50 border border-gray-700/50 hover:border-purple-500/50 rounded-full transition-all duration-300 group"
          >
            <span className="text-purple-400 group-hover:translate-x-[-2px] transition-transform duration-300">←</span>
            <span className="text-gray-300 group-hover:text-white transition-colors duration-300">Back to Home</span>
          </button>
          
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">SC</span>
            </div>
            <span className="text-lg font-semibold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              ConnexaLab
            </span>
          </div>
        </nav>

        {/* Ultra-Modern Header */}
        <header className={`text-center mb-20 transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="inline-block relative">
            <div className="absolute -inset-4 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-cyan-600/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
            <h1 className="relative text-5xl md:text-7xl font-extralight tracking-wider bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent mb-8 hover:scale-105 transition-transform duration-700">
              Social Creator
            </h1>
            <div className="relative">
              <div className="h-px w-full bg-gradient-to-r from-transparent via-blue-400/50 to-transparent mb-2"></div>
              <div className="h-px w-3/4 mx-auto bg-gradient-to-r from-transparent via-purple-400/30 to-transparent mb-8"></div>
            </div>
          </div>
          <div className="relative">
            <p className="text-xl md:text-2xl text-gray-300 font-extralight max-w-3xl mx-auto leading-relaxed tracking-wider mb-4">
              AI-Powered Content Generation Platform
            </p>
            <p className="text-sm md:text-base text-gray-500 font-light max-w-2xl mx-auto leading-relaxed">
              Transform your ideas into engaging social media content with advanced AI technology
            </p>
          </div>
          
          {/* Floating Status Indicators */}
          <div className="flex justify-center items-center space-x-6 mt-8">
            <div className="flex items-center space-x-2 px-4 py-2 bg-green-900/20 border border-green-700/30 rounded-full">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-green-300 text-xs font-medium tracking-wide">AI READY</span>
            </div>
            <div className="flex items-center space-x-2 px-4 py-2 bg-blue-900/20 border border-blue-700/30 rounded-full">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" style={{animationDelay: '0.5s'}}></div>
              <span className="text-blue-300 text-xs font-medium tracking-wide">REAL-TIME</span>
            </div>
          </div>
        </header>
        
        {/* Ultra-Modern Form Container */}
         <div className={`max-w-3xl mx-auto mb-16 transition-all duration-1000 delay-300 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
           <div className="relative group">
             {/* Animated Border */}
             <div className="absolute -inset-1 bg-gradient-to-r from-blue-600/50 via-purple-600/50 to-cyan-600/50 rounded-3xl blur opacity-20 group-hover:opacity-40 transition-opacity duration-700"></div>
             
             <div className="relative backdrop-blur-xl bg-gray-900/60 border border-gray-700/60 rounded-3xl p-10 shadow-2xl hover:shadow-blue-900/30 transition-all duration-700">
               <form onSubmit={handleSubmit} className="space-y-10">
                 {/* Language and Tone Selectors */}
               <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-6">
                 {/* Language Selector */}
                 <div className="flex bg-black/30 border border-gray-600/50 rounded-xl p-1 backdrop-blur-sm">
                   <button
                     type="button"
                     onClick={() => setLanguage('IT')}
                     className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                       language === 'IT'
                         ? 'bg-blue-600 text-white shadow-lg'
                         : 'text-gray-400 hover:text-gray-200'
                     }`}
                   >
                     🇮🇹 Italiano
                   </button>
                   <button
                     type="button"
                     onClick={() => setLanguage('EN')}
                     className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                       language === 'EN'
                         ? 'bg-blue-600 text-white shadow-lg'
                         : 'text-gray-400 hover:text-gray-200'
                     }`}
                   >
                     🇬🇧 English
                   </button>
                 </div>
                 
                 {/* Tone Selector */}
                 <div className="flex items-center space-x-2">
                   <span className="text-gray-400 text-sm">
                     {language === 'IT' ? 'Tono:' : 'Tone:'}
                   </span>
                   <select
                     value={tone}
                     onChange={(e) => setTone(e.target.value)}
                     className="bg-black/30 border border-gray-600/50 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50 backdrop-blur-sm"
                   >
                     <option value="friendly">
                       {language === 'IT' ? '😊 Amichevole' : '😊 Friendly'}
                     </option>
                     <option value="professional">
                       {language === 'IT' ? '💼 Professionale' : '💼 Professional'}
                     </option>
                     <option value="hype">
                       {language === 'IT' ? '🔥 Hype' : '🔥 Hype'}
                     </option>
                   </select>
                 </div>
               </div>
                 
                 <div className="space-y-6">
                   <div className="flex items-center space-x-3 mb-6">
                     <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                       <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                       </svg>
                     </div>
                     <label htmlFor="theme" className="text-lg font-medium text-gray-200 tracking-wide">
                       {language === 'IT' ? 'Content Theme' : 'Content Theme'}
                     </label>
                   </div>
                   
                   <div className="relative group">
                     <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600/30 to-purple-600/30 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                     <input
                       type="text"
                       id="theme"
                       value={theme}
                       onChange={(e) => setTheme(e.target.value)}
                       className="relative w-full px-8 py-6 bg-black/60 backdrop-blur-sm border border-gray-600/60 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/60 focus:border-blue-500/60 transition-all duration-500 text-xl font-light hover:bg-black/70"
                       placeholder={language === 'IT' ? 'Descrivi la tua idea, tema o argomento...' : 'Describe your content idea, theme, or topic...'}
                     />
                     
                     {/* Input Enhancement Effects */}
                     <div className="absolute right-4 top-1/2 transform -translate-y-1/2 opacity-50">
                       <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                       </svg>
                     </div>
                   </div>
                   
                   {/* Character Counter */}
                   <div className="flex justify-between items-center text-sm text-gray-500">
                     <span>Be specific for better results</span>
                     <span className={`${theme.length > 100 ? 'text-yellow-400' : 'text-gray-500'}`}>
                       {theme.length}/200
                     </span>
                   </div>
                 </div>
                 
                 {/* Enhanced Generate Buttons */}
                 <div className="flex gap-4">
                   <button
                     type="submit"
                     disabled={loading}
                     className={`flex-1 relative overflow-hidden group ${
                       loading ? 'cursor-not-allowed opacity-70' : 'hover:scale-[1.02] hover:shadow-2xl hover:shadow-blue-500/25'
                     } transition-all duration-700`}
                   >
                     <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 rounded-2xl"></div>
                     <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                     <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                     
                     <div className="relative px-10 py-6 text-white font-semibold text-xl tracking-wide">
                       {loading ? (
                         <div className="flex items-center justify-center space-x-4">
                           <div className="relative">
                             <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
                             <div className="absolute inset-0 w-6 h-6 border-3 border-transparent border-r-white/50 rounded-full animate-spin" style={{animationDirection: 'reverse', animationDuration: '0.8s'}}></div>
                           </div>
                           <span className="animate-pulse">{language === 'IT' ? 'Generazione Contenuto Straordinario...' : 'Generating Amazing Content...'}</span>
                         </div>
                       ) : (
                         <div className="flex items-center justify-center space-x-3">
                           <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                           </svg>
                           <span>{language === 'IT' ? 'Genera Contenuto' : 'Generate Content'}</span>
                         </div>
                       )}
                     </div>
                   </button>
                   
                   {/* Regenerate Button */}
                   {lastTheme && (
                     <button
                       type="button"
                       onClick={handleRegenerate}
                       disabled={loading}
                       className={`px-6 py-6 relative overflow-hidden group ${
                         loading ? 'cursor-not-allowed opacity-70' : 'hover:scale-[1.02] hover:shadow-2xl hover:shadow-green-500/25'
                       } transition-all duration-700`}
                     >
                       <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl"></div>
                       <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                       <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                       
                       <div className="relative text-white font-semibold text-xl tracking-wide">
                         <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                         </svg>
                       </div>
                     </button>
                   )}
                 </div>
               </form>
               
               {/* Enhanced Error Display */}
               {error && (
                 <div className="mt-8 relative">
                   <div className="absolute -inset-0.5 bg-gradient-to-r from-red-600/50 to-orange-600/50 rounded-2xl blur opacity-50"></div>
                   <div className="relative p-6 bg-red-900/40 backdrop-blur-sm border border-red-700/60 rounded-2xl text-red-200">
                     <div className="flex items-center space-x-3">
                       <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                       </svg>
                       <span className="font-medium">{error}</span>
                     </div>
                   </div>
                 </div>
               )}
             </div>
           </div>
         </div>
        
        {/* History Section */}
        {history.length > 0 && (
          <div className="max-w-4xl mx-auto mb-8">
            <button
              onClick={() => setShowHistory(!showHistory)}
              className="w-full backdrop-blur-sm bg-gray-800/40 border border-gray-600/50 rounded-xl p-4 text-left hover:bg-gray-700/40 transition-all duration-300"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-300 tracking-wide">
                  📚 {language === 'IT' ? `Storico Recente (${history.length})` : `Recent History (${history.length})`}
                </h3>
                <svg className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${showHistory ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </button>
            
            {showHistory && (
              <div className="mt-4 space-y-3">
                {history.map((item) => (
                  <div key={item.id} className="backdrop-blur-sm bg-gray-800/30 border border-gray-600/40 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-400">{item.timestamp}</span>
                      <button
                        onClick={() => loadFromHistory(item)}
                        className="px-3 py-1 bg-blue-600/20 border border-blue-500/30 rounded-lg text-blue-300 text-sm hover:bg-blue-600/30 transition-all duration-300"
                      >
                        Carica
                      </button>
                    </div>
                    <p className="text-gray-300 font-medium">{item.theme}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Copy Feedback */}
      {copyFeedback && (
        <div className="fixed top-4 right-4 z-50 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg animate-pulse">
          ✅ {copyFeedback} {language === 'IT' ? 'Copiato!' : 'Copied!'}
        </div>
      )}
      
      {/* Feedback Modal */}
       {showFeedback && (
         <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
           <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6 max-w-md w-full">
             <h3 className="text-xl font-semibold text-white mb-4">
               {language === 'IT' ? 'Come è stato il contenuto generato?' : 'How was the generated content?'}
             </h3>
             
             {/* Comment */}
             <textarea
               value={feedbackComment}
               onChange={(e) => setFeedbackComment(e.target.value)}
               placeholder={language === 'IT' ? 'Lascia un commento sul contenuto generato...' : 'Leave a comment about the generated content...'}
               className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 resize-none mb-4"
               rows={4}
             />
             
             {/* Buttons */}
             <div className="flex space-x-3">
               <button
                 onClick={() => setShowFeedback(false)}
                 className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors duration-300"
               >
                 {language === 'IT' ? 'Salta' : 'Skip'}
               </button>
               <button
                 onClick={submitFeedback}
                 className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-300"
               >
                 {language === 'IT' ? 'Invia Feedback' : 'Submit Feedback'}
               </button>
             </div>
           </div>
         </div>
       )}

        {/* Sophisticated Results Display */}
         {results && (
           <div className="max-w-4xl mx-auto">
             <div className="backdrop-blur-sm bg-gray-900/40 border border-gray-700/50 rounded-2xl p-8 shadow-2xl hover:shadow-blue-900/20 transition-all duration-700">
               {/* Results Header */}
               <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 space-y-4 md:space-y-0">
                 <h2 className="text-2xl font-light tracking-wide bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                   {language === 'IT' ? 'Contenuto Generato' : 'Generated Content'}
                 </h2>
                 
                 <div className="flex items-center space-x-3">
                   {/* Download Buttons */}
                   <div className="flex space-x-2">
                     <button
                       onClick={() => downloadContent('txt')}
                       className="px-3 py-2 bg-green-600/20 border border-green-500/30 rounded-lg text-green-300 text-sm hover:bg-green-600/30 transition-all duration-300 flex items-center space-x-2"
                     >
                       <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                       </svg>
                       <span>.txt</span>
                     </button>
                     <button
                       onClick={() => downloadContent('csv')}
                       className="px-3 py-2 bg-green-600/20 border border-green-500/30 rounded-lg text-green-300 text-sm hover:bg-green-600/30 transition-all duration-300 flex items-center space-x-2"
                     >
                       <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                       </svg>
                       <span>.csv</span>
                     </button>
                   </div>
                   
                   {/* Share Buttons */}
                   <div className="flex space-x-2">
                     {/* Native Share (if supported) */}
                     {navigator.share && (
                       <button
                         onClick={() => shareToSocial('native', results)}
                         className="px-3 py-2 bg-blue-600/20 border border-blue-500/30 rounded-lg text-blue-300 text-sm hover:bg-blue-600/30 transition-all duration-300 flex items-center space-x-2"
                       >
                         <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                         </svg>
                         <span>{language === 'IT' ? 'Condividi' : 'Share'}</span>
                       </button>
                     )}
                     
                     {/* Instagram */}
                     <button
                       onClick={() => shareToSocial('instagram', results)}
                       className="px-3 py-2 bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-500/30 rounded-lg text-purple-300 text-sm hover:from-purple-600/30 hover:to-pink-600/30 transition-all duration-300 flex items-center space-x-2"
                     >
                       <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                         <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                       </svg>
                       <span>IG</span>
                     </button>
                     
                     {/* LinkedIn */}
                     <button
                       onClick={() => shareToSocial('linkedin', results)}
                       className="px-3 py-2 bg-blue-700/20 border border-blue-600/30 rounded-lg text-blue-300 text-sm hover:bg-blue-700/30 transition-all duration-300 flex items-center space-x-2"
                     >
                       <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                         <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                       </svg>
                       <span>LI</span>
                     </button>
                   </div>
                   
                   {results.ai_powered !== undefined && (
                     <div className="flex items-center space-x-3">
                       <span className={`inline-flex items-center px-3 py-1 rounded-lg text-xs font-medium tracking-wide uppercase ${
                         results.ai_powered 
                           ? 'bg-green-900/30 text-green-300 border border-green-700/50' 
                           : 'bg-gray-800/50 text-gray-400 border border-gray-600/50'
                       }`}>
                         {results.ai_powered ? 'AI Generated' : 'Template'}
                       </span>
                       
                       {results.processing_time && (
                         <span className="text-xs text-gray-500 bg-gray-800/50 px-2 py-1 rounded border border-gray-600/50">
                           {results.processing_time}
                         </span>
                       )}
                     </div>
                   )}
                 </div>
               </div>
               
               <div className="grid gap-8">
                 {/* Caption Section */}
                 <div className="group">
                   <div className="flex items-center justify-between mb-4">
                     <h3 className="text-lg font-medium text-gray-300 tracking-wide uppercase">
                       {language === 'IT' ? 'Didascalia' : 'Caption'}
                     </h3>
                     <button
                       onClick={() => copyToClipboard(results.caption, language === 'IT' ? 'Didascalia' : 'Caption')}
                       className="px-3 py-2 bg-blue-600/20 border border-blue-500/30 rounded-lg text-blue-300 text-sm hover:bg-blue-600/30 transition-all duration-300 flex items-center space-x-2"
                     >
                       <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                       </svg>
                       <span>{language === 'IT' ? 'Copia' : 'Copy'}</span>
                     </button>
                   </div>
                   <div className="backdrop-blur-sm bg-black/30 border border-gray-600/50 rounded-xl p-6 group-hover:shadow-lg group-hover:shadow-blue-900/20 transition-all duration-500">
                     <p className="text-gray-200 text-lg leading-relaxed font-light">{results.caption}</p>
                   </div>
                 </div>
                 
                 {/* Post Ideas Section */}
                 <div className="group">
                   <div className="flex items-center justify-between mb-4">
                     <h3 className="text-lg font-medium text-gray-300 tracking-wide uppercase">
                       {language === 'IT' ? 'Idee Post' : 'Post Ideas'}
                     </h3>
                     <button
                       onClick={() => copyToClipboard(results.post_ideas.join('\n\n'), language === 'IT' ? 'Idee Post' : 'Post Ideas')}
                       className="px-3 py-2 bg-blue-600/20 border border-blue-500/30 rounded-lg text-blue-300 text-sm hover:bg-blue-600/30 transition-all duration-300 flex items-center space-x-2"
                     >
                       <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                       </svg>
                       <span>{language === 'IT' ? 'Copia' : 'Copy'}</span>
                     </button>
                   </div>
                   <div className="space-y-4">
                     {results.post_ideas.map((idea, index) => (
                       <div key={index} className="backdrop-blur-sm bg-black/30 border border-gray-600/50 rounded-xl p-5 hover:shadow-lg hover:shadow-blue-900/20 transition-all duration-500 group">
                         <div className="flex items-start space-x-4">
                           <span className="flex-shrink-0 w-7 h-7 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center text-white font-medium text-sm">
                             {index + 1}
                           </span>
                           <span className="text-gray-200 text-lg leading-relaxed font-light">{idea}</span>
                         </div>
                       </div>
                     ))}
                   </div>
                 </div>
                 
                 {/* Hashtags Section */}
                 <div className="group">
                   <div className="flex items-center justify-between mb-4">
                     <div className="flex items-center space-x-4">
                       <h3 className="text-lg font-medium text-gray-300 tracking-wide uppercase">
                         Hashtags
                       </h3>
                       {/* Legend */}
                       <div className="flex items-center space-x-3 text-xs">
                           <div className="flex items-center space-x-1">
                             <span className="text-orange-300">🔥</span>
                             <span className="text-gray-400">{language === 'IT' ? 'Trending' : 'Trending'}</span>
                           </div>
                           <div className="flex items-center space-x-1">
                             <span className="text-yellow-300">⭐</span>
                             <span className="text-gray-400">{language === 'IT' ? 'Ottimale' : 'Optimal'}</span>
                           </div>
                         </div>
                     </div>
                     <button
                         onClick={() => copyToClipboard(results.hashtags.join(' '), 'Hashtags')}
                         className="px-3 py-2 bg-blue-600/20 border border-blue-500/30 rounded-lg text-blue-300 text-sm hover:bg-blue-600/30 transition-all duration-300 flex items-center space-x-2"
                       >
                         <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                         </svg>
                         <span>{language === 'IT' ? 'Copia' : 'Copy'}</span>
                       </button>
                   </div>
                   <div className="flex flex-wrap gap-3">
                     {results.hashtags.map((hashtag, index) => {
                       const trendIndicator = getTrendingIndicator(hashtag);
                       return (
                         <span 
                           key={index} 
                           className={`px-4 py-2 border rounded-lg text-sm font-medium hover:shadow-lg transition-all duration-500 hover:scale-105 cursor-pointer flex items-center space-x-1 ${
                             trendIndicator === '🔥' 
                               ? 'bg-orange-900/30 border-orange-500/50 text-orange-300 hover:bg-orange-800/40 hover:shadow-orange-900/20'
                               : trendIndicator === '⭐'
                               ? 'bg-yellow-900/30 border-yellow-500/50 text-yellow-300 hover:bg-yellow-800/40 hover:shadow-yellow-900/20'
                               : 'bg-gray-800/50 border-gray-600/50 text-gray-300 hover:bg-gray-700/50 hover:shadow-blue-900/20'
                           }`}
                         >
                           <span>{hashtag}</span>
                           {trendIndicator && (
                             <span className="text-xs">{trendIndicator}</span>
                           )}
                         </span>
                       );
                     })}
                   </div>
                 </div>
               </div>
             </div>
           </div>
         )}
      </div>
      
      {/* Subtle Accent Elements */}
       <div className="absolute inset-0 pointer-events-none">
         <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-blue-500/30 rounded-full"></div>
         <div className="absolute top-3/4 right-1/3 w-0.5 h-0.5 bg-purple-500/20 rounded-full"></div>
         <div className="absolute bottom-1/3 left-1/2 w-1 h-1 bg-gray-500/20 rounded-full"></div>
       </div>
    </div>
  );
}

export default App;