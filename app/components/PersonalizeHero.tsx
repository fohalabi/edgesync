'use client';

import React, { useState } from 'react';
import { usePersonalization } from '@/hooks/usePersonalization';
import { ArrowRight, Zap, Globe, TrendingUp, Sun, Moon, Github } from 'lucide-react';
import Link from 'next/link';

export default function PersonalizedHero() {
  const { data, loading, error } = usePersonalization();
  const [darkMode, setDarkMode] = useState(false);

  const bgClass = darkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-900';
  const cardBg = darkMode ? 'bg-gray-800' : 'bg-white';
  const borderColor = darkMode ? 'border-gray-700' : 'border-gray-200';

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading personalized experience...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <p className="text-red-600">Failed to load personalization data</p>
        </div>
      </div>
    );
  }

  const { variant, segment, experimentVariant } = data;
  
  const themeClasses = {
    default: 'from-slate-50 via-blue-50 to-slate-100',
    premium: 'from-slate-50 via-orange-50 to-slate-100',
    casual: 'from-slate-50 via-green-50 to-slate-100',
  };

  const accentColors = {
    default: 'bg-blue-600 hover:bg-blue-700 border-blue-600',
    premium: 'bg-orange-600 hover:bg-orange-700 border-orange-600',
    casual: 'bg-green-600 hover:bg-green-700 border-green-600',
  };

  const theme = variant.content.theme || 'default';

  return (
    <div className={`min-h-screen ${bgClass} transition-colors duration-200`}>
    {/* Header with Logo, GitHub, and Theme Toggle */}
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
      <div className="flex items-center justify-between mb-2 mt-2">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <Zap className="text-blue-500" size={32} />
          <span className="text-2xl font-bold">EdgePersonal</span>
        </div>

        {/* GitHub + Theme Toggle */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`p-2 rounded-lg border ${borderColor} hover:bg-opacity-80 transition-opacity`}
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          
          <a
            href="https://github.com/yourusername/edge-personalization"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 hover:opacity-70 transition-opacity"
          >
            <Github size={20} />
          </a>
        </div>
      </div>
    </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        {/* Main Hero */}
        <div className="text-center mb-16">
          <div className={`inline-flex items-center gap-2 px-4 py-2 ${cardBg} rounded-full shadow-sm mb-6 border ${borderColor}`}>
            <Zap className="text-blue-500" size={16} />
            <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-slate-700'}`}>
              Personalized for {segment.country || 'your region'} · {segment.device}
            </span>
          </div>

          <h1 className={`text-5xl md:text-6xl lg:text-7xl font-bold ${darkMode ? 'text-gray-100' : 'text-slate-900'} mb-6 leading-tight`}>
            {variant.content.headline || 'Deliver experiences that adapt at the edge.'}
          </h1>
          
          <p className={`text-xl md:text-2xl ${darkMode ? 'text-gray-400' : 'text-slate-600'} mb-10 max-w-3xl mx-auto`}>
            {variant.content.subheadline || 
              'Serve each visitor a unique experience powered by real-time edge logic, no backend latency required.'}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link 
              href="/dashboard"
              className={`${accentColors[theme]} text-white font-semibold py-4 px-8 rounded-lg transition-all shadow-lg hover:shadow-xl flex items-center gap-2 group`}
            >
              {variant.content.cta || 'Go to Dashboard'}
              <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
            </Link>
            
            <button className={`${cardBg} ${darkMode ? 'text-gray-200' : 'text-slate-700'} font-semibold py-4 px-8 rounded-lg transition-all shadow-md hover:shadow-lg border-2 ${borderColor} ${darkMode ? 'hover:border-gray-600' : 'hover:border-slate-300'}`}>
              Learn More
            </button>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <div className={`${cardBg} p-6 rounded-xl shadow-md border ${borderColor}`}>
            <div className={`w-12 h-12 ${darkMode ? 'bg-blue-900/30' : 'bg-blue-100'} rounded-lg flex items-center justify-center mb-4`}>
              <Zap className="text-blue-600" size={24} />
            </div>
            <h3 className={`text-xl font-bold ${darkMode ? 'text-gray-100' : 'text-slate-900'} mb-2`}>Lightning Fast</h3>
            <p className={darkMode ? 'text-gray-400' : 'text-slate-600'}>
              Personalized responses are delivered from the nearest edge node — typically under 50ms worldwide.
            </p>
          </div>

          <div className={`${cardBg} p-6 rounded-xl shadow-md border ${borderColor}`}>
            <div className={`w-12 h-12 ${darkMode ? 'bg-blue-900/30' : 'bg-blue-100'} rounded-lg flex items-center justify-center mb-4`}>
              <Globe className="text-green-600" size={24} />
            </div>
            <h3 className={`text-xl font-bold ${darkMode ? 'text-gray-100' : 'text-slate-900'} mb-2`}>Global Intelligence</h3>
            <p className={darkMode ? 'text-gray-400' : 'text-slate-600'}>
              Automatically adapts content, language, and layout to match each visitor’s location and context.
            </p>
          </div>

         <div className={`${cardBg} p-6 rounded-xl shadow-md border ${borderColor}`}>
            <div className={`w-12 h-12 ${darkMode ? 'bg-blue-900/30' : 'bg-blue-100'} rounded-lg flex items-center justify-center mb-4`}>
              <TrendingUp className="text-orange-600" size={24} />
            </div>
            <h3 className={`text-xl font-bold ${darkMode ? 'text-gray-100' : 'text-slate-900'} mb-2`}>Adaptive Insights</h3>
            <p className={darkMode ? 'text-gray-400' : 'text-slate-600'}>
              Get real-time analytics and segmentation data directly from the edge to refine personalization logic.
            </p>
          </div>
        </div>

        {/* Personalization Debug Panel (Collapsible) */}
        <details className={`${cardBg} backdrop-blur p-6 rounded-xl border-2 ${borderColor} max-w-3xl mx-auto`}>
          <summary className={`cursor-pointer font-semibold ${darkMode ? 'text-gray-100' : 'text-slate-900'} flex items-center justify-between`}>
            <span>🔍 View Personalization Details</span>
            <span className={`text-sm ${darkMode ? 'text-gray-500' : 'text-slate-500'}`}>(Click to expand)</span>
          </summary>
          
          <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
            <div className={`p-3 ${darkMode ? 'bg-gray-700' : 'bg-slate-50'} rounded-lg`}>
              <span className={`font-medium ${darkMode ? 'text-gray-300' : 'text-slate-700'} block mb-1`}>Segment ID</span>
              <p className={`${darkMode ? 'text-gray-200' : 'text-slate-900'} font-mono`}>{segment.id}</p>
            </div>
            <div className={`p-3 ${darkMode ? 'bg-gray-700' : 'bg-slate-50'} rounded-lg`}>
             <span className={`font-medium ${darkMode ? 'text-gray-300' : 'text-slate-700'} block mb-1`}>Device Type</span>
              <p className={`${darkMode ? 'text-gray-200' : 'text-slate-900'} font-mono`}>{segment.device}</p>
            </div>
            <div className={`p-3 ${darkMode ? 'bg-gray-700' : 'bg-slate-50'} rounded-lg`}>
              <span className={`font-medium ${darkMode ? 'text-gray-300' : 'text-slate-700'} block mb-1`}>Location</span>
              <p className={`${darkMode ? 'text-gray-200' : 'text-slate-900'} font-mono`}>{segment.country || 'Unknown'}</p>
            </div>
            <div className={`p-3 ${darkMode ? 'bg-gray-700' : 'bg-slate-50'} rounded-lg`}>
              <span className={`font-medium ${darkMode ? 'text-gray-300' : 'text-slate-700'} block mb-1`}>User Status</span>
              <p className={`${darkMode ? 'text-gray-200' : 'text-slate-900'} font-mono`}>
                {segment.isNewUser ? 'New Visitor' : 'Returning'}
              </p>
            </div>
            {experimentVariant && (
              <div className={`col-span-2 p-3 ${darkMode ? 'bg-blue-900/20 border-blue-800' : 'bg-blue-50 border-blue-200'} rounded-lg border`}>
                <span className={`font-medium ${darkMode ? 'text-blue-400' : 'text-blue-700'} block mb-1`}>Experiment Variant</span>
                <p className={`${darkMode ? 'text-blue-300' : 'text-blue-900'} font-mono`}>{experimentVariant}</p>
              </div>
            )}
          </div>
        </details>
      </div>
    </div>
  );
}
