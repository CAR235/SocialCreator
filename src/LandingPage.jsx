import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const features = [
    {
      icon: '🎨',
      title: 'AI-Powered Captions',
      description: 'Generate engaging captions that resonate with your audience using advanced AI technology.'
    },
    {
      icon: '💡',
      title: 'Smart Post Ideas',
      description: 'Get creative post suggestions tailored to your content and brand voice.'
    },
    {
      icon: '#️⃣',
      title: 'Trending Hashtags',
      description: 'Discover the most effective hashtags to maximize your reach and engagement.'
    },
    {
      icon: '⚡',
      title: 'Lightning Fast',
      description: 'Generate content in seconds, not hours. Perfect for busy content creators.'
    }
  ];

  const steps = [
    { number: '01', title: 'Enter Your Idea', description: 'Simply type your content theme or idea' },
    { number: '02', title: 'AI Generation', description: 'Our AI creates engaging content based on your input' },
    { number: '03', title: 'Get Results', description: 'Receive captions, ideas, and hashtags instantly' }
  ];

  return (
    <div className={`min-h-screen relative overflow-hidden bg-black transition-all duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'} text-white`}>
      {/* Enhanced Dynamic Background - Matching App.jsx */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-800"></div>
      <div className="absolute inset-0 bg-gradient-to-tr from-blue-950/30 via-transparent to-purple-950/30"></div>
      <div className="absolute inset-0 bg-gradient-to-bl from-transparent via-indigo-950/20 to-transparent"></div>
      
      {/* Galaxy Particles Background */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Floating Particles */}
        {[...Array(50)].map((_, i) => (
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
        {[...Array(20)].map((_, i) => (
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
            <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.1" />
            </linearGradient>
          </defs>
          {[...Array(8)].map((_, i) => (
            <line
              key={`line-${i}`}
              x1={`${Math.random() * 100}%`}
              y1={`${Math.random() * 100}%`}
              x2={`${Math.random() * 100}%`}
              y2={`${Math.random() * 100}%`}
              stroke="url(#lineGradient)"
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
      
      {/* Advanced Animated Elements - Matching App.jsx */}
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

      {/* Enhanced Grid Pattern with Animation - Matching App.jsx */}
      <div 
        className="absolute inset-0 opacity-[0.03] transition-opacity duration-1000"
        style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.4) 1px, transparent 0)',
          backgroundSize: '60px 60px',
          transform: `translateY(0px)`
        }}
      ></div>
      
      {/* Floating Orbs - Matching App.jsx style */}
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

      {/* Navigation */}
      <nav className="relative z-10 p-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">SC</span>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Social Creator
            </span>
          </div>
          
          <button
            onClick={() => navigate('/app')}
            className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-blue-500/25"
          >
            Launch App
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 px-6 py-20">
        <div className="max-w-7xl mx-auto text-center">
          <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h1 className="text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent leading-tight">
              Create.
              <br />
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Engage.
              </span>
              <br />
              Grow.
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              Transform your social media presence with AI-powered content creation. 
              Generate captivating captions, discover trending hashtags, and get inspired with fresh post ideas.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button
                onClick={() => navigate('/app')}
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full text-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-blue-500/50 group"
              >
                <span className="flex items-center space-x-2">
                  <span>Get Started Free</span>
                  <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
                </span>
              </button>
              

            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 px-6 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Powerful Features
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Everything you need to create compelling social media content
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`p-6 rounded-2xl bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700/50 hover:border-blue-500/50 transition-all duration-500 transform hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/20 group ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}
                style={{ transitionDelay: `${index * 200}ms` }}
              >
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3 text-white group-hover:text-blue-300 transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="text-gray-400 group-hover:text-gray-300 transition-colors duration-300">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="relative z-10 px-6 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              How It Works
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Three simple steps to transform your content
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <div
                key={index}
                className={`text-center group ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}
                style={{ transitionDelay: `${index * 300}ms` }}
              >
                <div className="relative mb-6">
                  <div className="w-20 h-20 mx-auto bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-2xl font-bold group-hover:scale-110 transition-transform duration-300 shadow-2xl">
                    {step.number}
                  </div>
                  {index < steps.length - 1 && (
                    <div className="hidden md:block absolute top-10 left-full w-full h-0.5 bg-gradient-to-r from-blue-600 to-transparent" />
                  )}
                </div>
                <h3 className="text-2xl font-semibold mb-3 group-hover:text-blue-300 transition-colors duration-300">
                  {step.title}
                </h3>
                <p className="text-gray-400 group-hover:text-gray-300 transition-colors duration-300">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 px-6 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <div className="p-12 rounded-3xl bg-gradient-to-r from-blue-900/50 to-purple-900/50 backdrop-blur-sm border border-blue-500/30">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Ready to Transform Your Content?
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Join thousands of creators who are already using AI to supercharge their social media presence.
            </p>
            <button
              onClick={() => navigate('/app')}
              className="px-12 py-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full text-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-blue-500/50 group"
            >
              <span className="flex items-center space-x-2">
                <span>Start Creating Now</span>
                <span className="group-hover:translate-x-1 transition-transform duration-300">✨</span>
              </span>
            </button>
          </div>
        </div>
      </section>

      {/* Enhanced Footer */}
      <footer className="relative z-10 mt-20 overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-gray-900/50 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-blue-950/20 via-purple-950/20 to-indigo-950/20"></div>
        
        {/* Floating Orbs */}
        <div className="absolute -top-20 -left-20 w-40 h-40 bg-gradient-to-r from-blue-600/10 to-purple-600/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-10 -right-20 w-32 h-32 bg-gradient-to-r from-indigo-600/10 to-cyan-600/10 rounded-full blur-2xl animate-pulse" style={{animationDelay: '1s'}}></div>
        
        {/* Glassmorphism Container */}
        <div className="relative backdrop-blur-xl bg-white/5 border-t border-white/10">
           <div className="max-w-7xl mx-auto px-6 py-8">
            {/* Main Content */}
            <div className="text-center space-y-8">
              {/* Logo Section with Animation */}
              <div className="group cursor-pointer inline-block">
                <div className="flex items-center justify-center space-x-3 mb-6 transform transition-all duration-500 group-hover:scale-110">
                  <div className="relative">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 via-purple-500 to-indigo-500 rounded-2xl flex items-center justify-center shadow-2xl shadow-blue-500/25 transform rotate-3 group-hover:rotate-12 transition-transform duration-500">
                      <span className="text-white font-bold text-lg">SC</span>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-400 rounded-2xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity duration-500"></div>
                  </div>
                  <div className="text-left">
                    <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">
                      Social Creator
                    </h3>
                    <p className="text-xs text-gray-400 font-medium tracking-wider uppercase">
                      AI-Powered Content
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Divider with Animation */}
              <div className="flex items-center justify-center space-x-4">
                <div className="h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent flex-1 max-w-32"></div>
                <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse"></div>
                <div className="h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent flex-1 max-w-32"></div>
              </div>
              
              {/* Copyright with Style */}
              <div className="space-y-4">
                <p className="text-gray-300 font-medium">
                  © 2024 Social Creator. 
                  <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent font-semibold">
                    Empowering creators with AI.
                  </span>
                </p>
                
                {/* Powered By with Enhanced Style */}
                <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-950/30 to-purple-950/30 border border-blue-500/20 backdrop-blur-sm hover:border-blue-400/40 transition-all duration-300 group">
                  <span className="text-gray-400 text-sm font-medium">Powered by</span>
                  <div className="w-1 h-1 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full animate-pulse"></div>
                  <a 
                    href="https://connexastudios.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300 font-semibold text-sm transition-all duration-300 group-hover:scale-105 relative"
                  >
                    connexastudios.com
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
                  </a>
                </div>
              </div>
              
              {/* Bottom Glow Effect */}
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-96 h-1 bg-gradient-to-r from-transparent via-blue-500/50 to-transparent"></div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;