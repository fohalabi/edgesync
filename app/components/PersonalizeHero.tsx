'use client';

import { usePersonalization } from '@/hooks/usePersonalization';

export default function PersonalizedHero() {
  const { data, loading, error } = usePersonalization();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading personalized content...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-red-600">Failed to load personalization</p>
        </div>
      </div>
    );
  }

  const { variant, segment, experimentVariant } = data;
  const themeClasses = {
    default: 'from-blue-50 to-indigo-100',
    premium: 'from-purple-50 to-pink-100',
    casual: 'from-green-50 to-teal-100',
  };

  return (
    <div
      className={`min-h-screen flex items-center justify-center bg-gradient-to-br ${
        themeClasses[variant.content.theme || 'default']
      }`}
    >
      <div className="max-w-4xl mx-auto px-4 text-center">
        <div className="mb-8">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4">
            {variant.content.headline}
          </h1>
          <p className="text-xl text-gray-700 mb-8">
            {variant.content.subheadline}
          </p>
          <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors shadow-lg">
            {variant.content.cta}
          </button>
        </div>

        <div className="mt-12 p-6 bg-white/50 backdrop-blur rounded-lg border border-gray-200 max-w-2xl mx-auto">
          <h3 className="font-semibold text-gray-900 mb-4">
            Personalization Details
          </h3>
          <div className="grid grid-cols-2 gap-4 text-sm text-left">
            <div>
              <span className="font-medium text-gray-700">Segment:</span>
              <p className="text-gray-600">{segment.id}</p>
            </div>
            <div>
              <span className="font-medium text-gray-700">Device:</span>
              <p className="text-gray-600">{segment.device}</p>
            </div>
            <div>
              <span className="font-medium text-gray-700">Country:</span>
              <p className="text-gray-600">{segment.country || 'Unknown'}</p>
            </div>
            <div>
              <span className="font-medium text-gray-700">New User:</span>
              <p className="text-gray-600">
                {segment.isNewUser ? 'Yes' : 'No'}
              </p>
            </div>
            {experimentVariant && (
              <div className="col-span-2">
                <span className="font-medium text-gray-700">
                  Experiment Variant:
                </span>
                <p className="text-gray-600">{experimentVariant}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}